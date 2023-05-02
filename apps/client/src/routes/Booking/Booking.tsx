import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  DialogActions,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useMemo, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { useAsync, useAsyncFn, useMount } from 'react-use';
import type { RegisterVpoDto, VpoRelativeModel } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { BookingInfo } from '../../components/BookingInfo';
import { ButtonWithLoading } from '../../components/ButtonWithLoading';
import { InfoDialog } from '../../components/InfoDialog';
import { NavLinkButton } from '../../components/NavLinkButton';
import { BOOKING, ERROR_MESSAGES } from '../../constants';
import { environment } from '../../environments/environment';
import type { RegisterVpoBulkResponseData } from '../../services';
import {
  htmlService,
  scheduleService,
  settingsService,
  vpoService,
} from '../../services';
import type { ScheduleSlotAvailableDto } from '../../services/schedule';
import { ROUTES } from '../routes.config';
import { BookingConfirmation } from './BookingConfirmation';
import { Info } from './Info';
import { NoSlots } from './NoSlots';
import { PersonalDataForm } from './PersonalDataForm';
import { SelectTimeSlot } from './SelectTimeSlot';

const steps = BOOKING.stepper;

export type VpoForm = Serialized<RegisterVpoDto> & {
  relativeVpos: Serialized<VpoRelativeModel>[];
  isInfoRead: boolean;
};

export const Booking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [savedStep, setSavedStep] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [detailedErrorMessage, setDetailedErrorMessage] = useState('');
  const [registeredVpoData, setRegisteredVpoData] =
    useState<RegisterVpoBulkResponseData | null>(null);
  const form = useForm<VpoForm>({
    mode: 'onBlur',
    defaultValues: {
      numberOfRelatives: 0,
      numberOfRelativesBelow16: 0,
      numberOfRelativesAbove65: 0,
      ...(process.env['NODE_ENV'] === 'development'
        ? {
            addressOfRegistration: 'Донецьк',
            addressOfResidence: 'Київ',
            dateOfBirth: '1993-05-02T00:00:00.000Z',
            email: 'user@example.com',
            firstName: 'Джон',
            lastName: 'Доу',
            middleName: 'Поттерович',
            taxIdNumber: Math.random().toString().slice(2, 12),
            phoneNumber: `+38097${Math.random().toString().slice(2, 9)}`,
            vpoIssueDate: '2022-12-12T00:00:00.000Z',
            vpoReferenceNumber: `${Math.random()
              .toString()
              .slice(2, 6)}-${Math.random().toString().slice(2, 12)}`,
          }
        : undefined),
    },
  });

  const [availableSlotsResponse, fetchAvailableSlots] = useAsyncFn(async () => {
    const slots = await scheduleService.getAvailableSlots();
    return slots.reduce((acc, value) => {
      const key = value.dateFrom.format('dddd (DD.MM.yy)');
      acc[key] ??= [];
      acc[key].push(value);
      return acc;
    }, {} as Record<string, ScheduleSlotAvailableDto[]>);
  }, []);

  useMount(async () => {
    await fetchAvailableSlots();
  });

  const infoResponse = useAsync(async () => {
    const info = await htmlService.getPage('info');
    return info.content;
  });

  const settingsResponse = useAsync(() => settingsService.getSettings());

  const registeredVpoReferenceNumbers = useMemo(() => {
    if (!registeredVpoData) return [];
    return [registeredVpoData.mainVpo.vpoReferenceNumber].concat(
      registeredVpoData.relativeVpos.map((item) => item.vpoReferenceNumber),
    );
  }, [registeredVpoData]);

  const getStepContent = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return (
            <Info
              address={infoResponse.value?.['addresses']}
              settings={settingsResponse.value}
            />
          );
        case 1:
          return <SelectTimeSlot slots={availableSlotsResponse.value!} />;
        case 2:
          return <PersonalDataForm />;
        case 3:
          return <BookingConfirmation />;
        default:
          throw new Error('Unknown step');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      availableSlotsResponse.value,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      infoResponse.value?.['addresses'],
      settingsResponse.value,
    ],
  );

  const nextStepOrSubmit: SubmitHandler<VpoForm> = async ({
    relativeVpos,
    verificationCode,
    isInfoRead,
    ...formValues
  }) => {
    if (activeStep === steps.length - 1) {
      try {
        setSubmitting(true);
        const data = await vpoService.registerBulk({
          verificationCode,
          mainVpo: {
            ...formValues,
            firstName: formValues.firstName.trim(),
            middleName: formValues.middleName.trim(),
            lastName: formValues.lastName.trim(),
            addressOfRegistration: formValues.addressOfRegistration.trim(),
            phoneNumber: formValues.phoneNumber.replace(/[\s()-]/g, ''),
            numberOfRelatives:
              parseInt(formValues.numberOfRelatives?.toString() || '') || 0,
            numberOfRelativesBelow16:
              parseInt(formValues.numberOfRelativesBelow16?.toString() || '') ||
              0,
            numberOfRelativesAbove65:
              parseInt(formValues.numberOfRelativesAbove65?.toString() || '') ||
              0,
          },
          relativeVpos: relativeVpos.map((values) => ({
            ...values,
            firstName: values.firstName.trim(),
            middleName: values.middleName.trim(),
            lastName: values.lastName.trim(),
            addressOfRegistration: values.addressOfRegistration.trim(),
            phoneNumber: values.phoneNumber
              ? values.phoneNumber.replace(/[\s()-]/g, '')
              : undefined,
            taxIdNumber: values.taxIdNumber || undefined,
          })),
        });
        setRegisteredVpoData(data);
        setActiveStep(activeStep + 1);
      } catch (error) {
        let clientMessage = ERROR_MESSAGES.unknown;
        // shitcode overload
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 400 ||
            error.response?.status === 409
          ) {
            const serverMessage: string = error.response?.data.message;
            if (BOOKING.helpRestriction.regexp.test(serverMessage)) {
              const match = serverMessage.match(
                BOOKING.helpRestriction.regexp,
              )!;
              const days = parseInt(match[1]);
              clientMessage = BOOKING.helpRestriction.getText(days);
            } else {
              clientMessage = BOOKING.errorMessages[serverMessage];

              if (BOOKING.timeSlotErrors.includes(serverMessage)) {
                form.resetField('scheduleDate', { defaultValue: '' });
                void fetchAvailableSlots();
                setSavedStep(activeStep);
                setActiveStep(1);
              }
            }
            const detailedError = Array.isArray(serverMessage)
              ? serverMessage.join(', ')
              : serverMessage;
            setDetailedErrorMessage(
              `${error.response?.data.error}: ${detailedError}`,
            );
          } else if (error.response?.status === 401) {
            clientMessage = BOOKING.errorMessages['verificationCode'];
          }
        }
        const finalErrorMessage = clientMessage || ERROR_MESSAGES.unknown;
        if (finalErrorMessage === ERROR_MESSAGES.unknown) {
          console.error(error);
        }
        setErrorMessage(finalErrorMessage);
        setIsModalOpen(true);
      }
      setSubmitting(false);
    } else {
      setActiveStep(savedStep !== null ? savedStep : activeStep + 1);
    }
    if (savedStep !== null) setSavedStep(null);
  };

  const handleBack = () => {
    setActiveStep(savedStep !== null ? savedStep : activeStep - 1);
  };

  if (availableSlotsResponse.error || infoResponse.error) {
    console.error(availableSlotsResponse.error, infoResponse.error);
    const errorMessageText = availableSlotsResponse.error
      ? availableSlotsResponse.error.message
      : infoResponse.error?.message;
    return (
      <InfoDialog
        isOpen={true}
        title={BOOKING.errorModalTitle}
        message={ERROR_MESSAGES.unknown}
        detailedMessage={errorMessageText}
      >
        <DialogActions>
          <NavLinkButton
            variant="outlined"
            to={ROUTES.MAIN.path}
            sx={{ mt: 3, ml: 1 }}
          >
            {BOOKING.gotoMain}
          </NavLinkButton>
        </DialogActions>
      </InfoDialog>
    );
  }

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        p: { xs: 0 },
      }}
    >
      <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
        {!availableSlotsResponse.loading &&
        availableSlotsResponse.value &&
        !Object.keys(availableSlotsResponse.value).length ? (
          <NoSlots settings={settingsResponse.value} />
        ) : (
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            {activeStep === steps.length && registeredVpoData ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  my: 3,
                }}
              >
                <CheckCircleOutlineIcon
                  color="success"
                  sx={{ fontSize: '4rem', mr: 2 }}
                />
                <Typography component="h1" variant="h4" align="center">
                  {BOOKING.finishTitle}
                </Typography>
              </Box>
            ) : (
              <>
                <Typography component="h1" variant="h4" align="center">
                  {BOOKING.title}
                </Typography>
                <Stepper
                  activeStep={activeStep}
                  sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' }, pt: 3, pb: 5 }}
                >
                  {steps.map((label) => (
                    <Step key={label} sx={{ pb: { xs: 1, md: 0 } }}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </>
            )}
            <FormProvider<VpoForm> {...form}>
              <Box
                noValidate
                component="form"
                onSubmit={form.handleSubmit(nextStepOrSubmit)}
              >
                {activeStep === steps.length && registeredVpoData ? (
                  <BookingInfo
                    vpoReferenceNumbers={registeredVpoReferenceNumbers}
                    bookingDate={registeredVpoData.mainVpo.scheduleDate}
                    receivedHelpDate={
                      registeredVpoData.mainVpo.receivedHelpDate
                    }
                  />
                ) : availableSlotsResponse.loading || infoResponse.loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={50} />
                  </Box>
                ) : (
                  getStepContent(activeStep)
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  {activeStep !== steps.length && (
                    <NavLinkButton
                      variant="outlined"
                      to={ROUTES.MAIN.path}
                      sx={{ mt: 3, ml: 1 }}
                    >
                      {BOOKING.gotoMain}
                    </NavLinkButton>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {activeStep !== 0 && activeStep !== steps.length && (
                      <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                        {BOOKING.prevStep}
                      </Button>
                    )}
                    {activeStep === steps.length ? (
                      <NavLinkButton
                        variant="contained"
                        to={ROUTES.MAIN.path}
                        sx={{ mt: 3, ml: 1 }}
                      >
                        {BOOKING.gotoMain}
                      </NavLinkButton>
                    ) : (
                      <ButtonWithLoading
                        type="submit"
                        variant="contained"
                        boxSx={{ mt: 3, ml: 1 }}
                        disabled={
                          availableSlotsResponse.loading ||
                          submitting ||
                          (activeStep === steps.length - 1 &&
                            (environment.emailVerificationEnabled
                              ? !form.watch('verificationCode')
                              : false))
                        }
                        loading={submitting}
                      >
                        {activeStep === steps.length - 1
                          ? BOOKING.confirmButton
                          : BOOKING.nextStep}
                      </ButtonWithLoading>
                    )}
                  </Box>
                </Box>
              </Box>
            </FormProvider>
          </Paper>
        )}
      </Container>
      <InfoDialog
        isOpen={isModalOpen}
        title={BOOKING.errorModalTitle}
        message={errorMessage}
        detailedMessage={detailedErrorMessage}
        onClose={() => setIsModalOpen(false)}
      >
        <DialogActions>
          <NavLinkButton to={ROUTES.MAIN.path} sx={{ mr: 2 }}>
            {BOOKING.gotoMain}
          </NavLinkButton>
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="contained"
            autoFocus
          >
            {BOOKING.close}
          </Button>
        </DialogActions>
      </InfoDialog>
    </Container>
  );
};
