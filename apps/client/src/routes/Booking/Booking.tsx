import {
  Box,
  Button,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { getCurrentUTCDate } from '../../utils';
import { BookingInfo } from './BookingInfo';
import { PersonalDataForm } from './PersonalDataForm';
import { SelectTimeSlot } from './SelectTimeSlot';

const steps = [
  'Select time slot',
  'Personal information',
  'Review your booking',
];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <SelectTimeSlot />;
    case 1:
      return <PersonalDataForm />;
    case 2:
      return <BookingInfo />;
    default:
      throw new Error('Unknown step');
  }
}

export const Booking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const form = useForm<BookingModel>({
    mode: 'onBlur',
    defaultValues: {
      vpoReferenceDate: getCurrentUTCDate(),
    },
  });

  const handleSubmit = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  console.log(form.getValues());

  return (
    <Container component="main" maxWidth="lg">
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <>
            <Typography variant="h5" gutterBottom>
              Thank you for your order.
            </Typography>
            <Typography variant="subtitle1">
              Your order number is #2001539. We have emailed your order
              confirmation, and will send you an update when your order has
              shipped.
            </Typography>
          </>
        ) : (
          <FormProvider {...form}>
            <Box
              noValidate
              component="form"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button type="submit" variant="contained" sx={{ mt: 3, ml: 1 }}>
                  {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                </Button>
              </Box>
            </Box>
          </FormProvider>
        )}
      </Paper>
    </Container>
  );
};

export type BookingModel = {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  vpoReferenceDate: string;
  vpoReferenceNumber: string;
  addressOfRegistration: string;
  addressOfResidence: string;
  numberOfRelatives: number;
  numberOfRelativesBelow16: number;
  numberOfRelativesAbove65: number;
  scheduleDate: string;
  receivedGoods?: { [productName: string]: number };
  phoneNumber?: string;
  email?: string;
};
