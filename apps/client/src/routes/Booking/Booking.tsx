import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import { BookingInfo } from '../../components';
import { BOOKING } from '../../constants';
import { scheduleService } from '../../services';
import type { ScheduleSlotAvailableDto } from '../../services/schedule';
import { getCurrentUTCDate } from '../../utils';
import { ROUTES } from '../routes.config';
import { BookingConfirmation } from './BookingConfirmation';
import { PersonalDataForm } from './PersonalDataForm';
import { SelectTimeSlot } from './SelectTimeSlot';

const steps = BOOKING.stepper;

export const Booking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const form = useForm<BookingModel>({
    mode: 'onBlur',
    defaultValues: {
      vpoIssueDate: getCurrentUTCDate(),
      dateOfBirth: getCurrentUTCDate(),
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

  const handleSubmit = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  if (availableSlotsResponse.error) {
    return <Navigate to={ROUTES.MAIN.path} />;
  }

  return (
    <Container component="main" maxWidth="lg">
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
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {activeStep === steps.length ? (
              <BookingInfo
                vpoReferenceNumber={form.getValues().vpoReferenceNumber}
                bookingDate={form.getValues().scheduleDate}
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
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, ml: 1 }}
                  disabled={availableSlotsResponse.loading}
                >
                  {activeStep === steps.length - 1
                    ? BOOKING.confirmBuuton
                    : BOOKING.nextStep}
                </Button>
              )}
            </Box>
          </Box>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export type BookingModel = {
  firstName: string;
  lastName: string;
  middleName: string;
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
