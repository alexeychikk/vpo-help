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
import { useCallback, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import type {
  RegisterVpoDto,
  VpoRelativeModel,
  VpoUserModel,
} from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { BookingInfo } from '../../components/BookingInfo';
import { ButtonWithLoading } from '../../components/ButtonWithLoading';
import { InfoDialog } from '../../components/InfoDialog';
import { NavLinkButton } from '../../components/NavLinkButton';
import { BOOKING, ERROR_MESSAGES } from '../../constants';
import { environment } from '../../environments/environment';
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
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [detailedErrorMessage, setDetailedErrorMessage] = useState('');
  const [vpoUser, setVpoUser] = useState<Serialized<VpoUserModel> | null>(null);
  const form = useForm<VpoForm>({
    mode: 'onBlur',
    defaultValues: {
      numberOfRelatives: 0,
      numberOfRelativesBelow16: 0,
      numberOfRelativesAbove65: 0,
    },
  });

  const availableSlotsResponse = useAsync(async () => {
    const slots = await scheduleService.getAvailableSlots();
    return slots.reduce((acc, value) => {
      const key = value.dateFrom.format('dddd (DD.MM.yy)');
      acc[key] ??= [];
      acc[key].push(value);
      return acc;
    }, {} as Record<string, ScheduleSlotAvailableDto[]>);
  }, []);

  const infoResponse = useAsync(async () => {
    const info = await htmlService.getPage('info');
    return info.content;
  });

  const settingsResponse = useAsync(() => settingsService.getSettings());

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
    [availableSlotsResponse.value, infoResponse.value?.['addresses']],
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
            addressOfResidence: formValues.addressOfRegistration.trim(),
            phoneNumber: formValues.phoneNumber.replace(/[\s()-]/g, ''),
            numberOfRelatives:
              parseInt(formValues.numberOfRelatives?.toString() || '') || 0,
            numberOfRelativesBelow16:
              parseInt(formValues.numberOfRelativesBelow16?.toString() || '') ||
              0,
            numberOfRelativesAbove65:
              parseInt(formValues.numberOfRelativesBelow16?.toString() || '') ||
              0,
          },
          relativeVpos: relativeVpos.map((values) => ({
            ...values,
            firstName: values.firstName.trim(),
            middleName: values.middleName.trim(),
            lastName: values.lastName.trim(),
            addressOfResidence: values.addressOfRegistration.trim(),
            phoneNumber: values.phoneNumber
              ? values.phoneNumber.replace(/[\s()-]/g, '')
              : undefined,
            taxIdNumber: values.taxIdNumber || undefined,
          })),
        });
        setVpoUser(data.mainVpo);
        setActiveStep(activeStep + 1);
      } catch (error) {
        setSubmitting(false);
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
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  if (availableSlotsResponse.error || infoResponse.error) {
    console.error(availableSlotsResponse.error, infoResponse.error);
    return <Navigate to={ROUTES.MAIN.path} />;
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
            {activeStep === steps.length && vpoUser ? (
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
                {activeStep === steps.length && vpoUser ? (
                  <BookingInfo
                    vpoReferenceNumber={vpoUser.vpoReferenceNumber}
                    bookingDate={vpoUser.scheduleDate}
                    receivedHelpDate={vpoUser.receivedHelpDate}
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
          <Button onClick={() => setIsModalOpen(false)} sx={{ mr: 2 }}>
            {BOOKING.prevStep}
          </Button>
          <NavLinkButton to={ROUTES.MAIN.path} variant="contained" autoFocus>
            {BOOKING.gotoMain}
          </NavLinkButton>
        </DialogActions>
      </InfoDialog>
    </Container>
  );
};
