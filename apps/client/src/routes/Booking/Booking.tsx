import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { BookingInfo, ButtonWithLoading } from '../../components';
import { BOOKING } from '../../constants';
import { scheduleService, vpoService } from '../../services';
import type { VpoUserModel } from '../../services/auth';
import type { ScheduleSlotAvailableDto } from '../../services/schedule';
import { getCurrentUTCDate } from '../../utils';
import { ROUTES } from '../routes.config';
import { BookingConfirmation } from './BookingConfirmation';
import { PersonalDataForm } from './PersonalDataForm';
import { SelectTimeSlot } from './SelectTimeSlot';

const steps = BOOKING.stepper;

export const Booking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [vpoUser, setVpoUser] = useState<VpoUserModel | null>(null);
  const form = useForm<BookingModel>({
    mode: 'onBlur',
    defaultValues: {
      vpoIssueDate: getCurrentUTCDate(),
      dateOfBirth: getCurrentUTCDate(),
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

  const getStepContent = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return <SelectTimeSlot slots={availableSlotsResponse.value!} />;
        case 1:
          return <PersonalDataForm />;
        case 2:
          return <BookingConfirmation />;
        default:
          throw new Error('Unknown step');
      }
    },
    [availableSlotsResponse.value],
  );

  const nextStepOrSubmit: SubmitHandler<BookingModel> = async (formValues) => {
    if (activeStep === steps.length - 1) {
      try {
        setSubmitting(true);
        const data = await vpoService.register(formValues);
        setVpoUser(data);
        setActiveStep(activeStep + 1);
      } catch (error) {
        setSubmitting(false);
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 400 ||
            error.response?.status === 409
          ) {
            const serverMessage: string = error.response?.data.message;
            let clientMessage = '';
            if (BOOKING.helpRestriction.regexp.test(serverMessage)) {
              const match = serverMessage.match(
                BOOKING.helpRestriction.regexp,
              )!;
              const days = parseInt(match[1]);
              clientMessage = BOOKING.helpRestriction.getText(days);
            } else {
              clientMessage = BOOKING.errorMessages[serverMessage];
            }
            setErrorMessage(clientMessage);
            setIsModalOpen(true);
          }
        }
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  if (availableSlotsResponse.error) {
    return <Navigate to={ROUTES.MAIN.path} />;
  }

  return (
    <Container component="main" maxWidth="xl">
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          {BOOKING.title}
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <FormProvider {...form}>
          <Box
            noValidate
            component="form"
            onSubmit={form.handleSubmit(nextStepOrSubmit)}
          >
            {activeStep === steps.length && vpoUser ? (
              <BookingInfo
                vpoReferenceNumber={vpoUser.vpoReferenceNumber}
                bookingDate={vpoUser.scheduleDate}
                addresses={''}
              />
            ) : availableSlotsResponse.loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={50} />
              </Box>
            ) : (
              getStepContent(activeStep)
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {activeStep !== 0 && activeStep !== steps.length && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  {BOOKING.prevStep}
                </Button>
              )}
              {activeStep === steps.length ? (
                <Button
                  variant="contained"
                  href={ROUTES.MAIN.path}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {BOOKING.gotoMain}
                </Button>
              ) : (
                <ButtonWithLoading
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, ml: 1 }}
                  disabled={availableSlotsResponse.loading || submitting}
                  loading={submitting}
                >
                  {activeStep === steps.length - 1
                    ? BOOKING.confirmBuuton
                    : BOOKING.nextStep}
                </ButtonWithLoading>
              )}
            </Box>
          </Box>
        </FormProvider>
      </Paper>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle id="alert-dialog-title">
          {BOOKING.errorModalTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} sx={{ mr: 2 }}>
            {BOOKING.prevStep}
          </Button>
          <Button href={ROUTES.MAIN.path} variant="contained" autoFocus>
            {BOOKING.gotoMain}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export type BookingModel = {
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  dateOfBirth: string;
  vpoIssueDate: string;
  vpoReferenceNumber: string;
  addressOfRegistration: string;
  addressOfResidence: string;
  numberOfRelatives: number;
  numberOfRelativesBelow16: number;
  numberOfRelativesAbove65: number;
  scheduleDate: string;
};
