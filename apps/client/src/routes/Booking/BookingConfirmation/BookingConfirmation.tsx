import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { isEmail } from 'class-validator';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ButtonWithLoading } from '../../../components/ButtonWithLoading';
import { TextFieldElement } from '../../../components/TextFieldElement';
import { BOOKING, ERROR_MESSAGES } from '../../../constants';
import { authService } from '../../../services';
import type { VpoForm } from '../Booking';
import { FormValues } from './FormValues';

const RESEND_SECONDS_TIMEOUT = 60;

export const BookingConfirmation: React.FC = () => {
  const { control, getValues, trigger } = useFormContext<VpoForm>();
  const formValues = getValues();
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedForm, setExpandedForm] = useState<string | false>(false);

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedForm(isExpanded ? panel : false);
    };

  const sendVerificationCode = async () => {
    try {
      const isValid = await trigger('email', { shouldFocus: true });
      if (!isValid) return;
      setLoading(true);
      await authService.sendVerificationCode(getValues().email);
      setTimer(RESEND_SECONDS_TIMEOUT);
      setVerificationSent(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        const serverMessage: string = error.response?.data.message;
        let clientMessage = '';
        if (BOOKING.verificationRestriction.regexp.test(serverMessage)) {
          const match = serverMessage.match(
            BOOKING.verificationRestriction.regexp,
          )!;
          const seconds = parseInt(match[1]);
          setTimer(seconds);
          clientMessage = BOOKING.verificationRestriction.getText(seconds);
        } else {
          clientMessage = ERROR_MESSAGES.unknown;
        }
        setErrorMessage(clientMessage);
        setIsModalOpen(true);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (timer <= 0) return;
    setTimeout(() => {
      setTimer((value) => value - 1);
    }, 1000);
  }, [timer]);

  const isTimerVisible = timer > 0;

  return (
    <Stack direction="column" spacing={4}>
      {verificationSent ? (
        <Box>
          <Typography variant="subtitle1" mb={2}>
            {BOOKING.verificationTitle}
            {': '}
            <b>{getValues('email')}</b>
          </Typography>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems="center"
          >
            <TextFieldElement
              required
              name="verificationCode"
              label={BOOKING.form.verificationCode}
              control={control}
              rules={{
                validate: {
                  pattern: (value) =>
                    value?.length !== 6
                      ? BOOKING.errorMessages['verificationCodeLength']
                      : undefined,
                },
              }}
              sx={{ width: { xs: '100%', md: '300px' } }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%' },
              }}
            >
              <ButtonWithLoading
                variant="contained"
                loading={loading}
                disabled={isTimerVisible}
                onClick={sendVerificationCode}
                boxSx={{ display: 'flex', width: { xs: '100%', md: 'auto' } }}
                sx={{ height: '56px', flexGrow: { xs: 1 } }}
              >
                {BOOKING.resendVerification}
              </ButtonWithLoading>
              {isTimerVisible && (
                <Typography variant="subtitle1" ml={2}>
                  {timer}
                </Typography>
              )}
            </Box>
          </Stack>
          <Typography variant="caption" mt={2}>
            {BOOKING.form.verificationCodeHelper}
          </Typography>
        </Box>
      ) : (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextFieldElement
            required
            name="email"
            label={BOOKING.form.email}
            control={control}
            rules={{
              validate: {
                pattern: (value) =>
                  value
                    ? isEmail(value)
                      ? undefined
                      : ERROR_MESSAGES.email
                    : undefined,
              },
            }}
            sx={{ width: { xs: '100%', md: '300px' } }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%' },
            }}
          >
            <ButtonWithLoading
              variant="contained"
              loading={loading}
              disabled={isTimerVisible}
              onClick={sendVerificationCode}
              boxSx={{ display: 'flex', width: { xs: '100%', md: 'auto' } }}
              sx={{ height: '56px', flexGrow: { xs: 1 } }}
            >
              {BOOKING.sendVerification}
            </ButtonWithLoading>
            {isTimerVisible && (
              <Typography variant="subtitle1" ml={2}>
                {timer}
              </Typography>
            )}
          </Box>
        </Stack>
      )}
      <Box>
        <Accordion
          expanded={expandedForm === formValues.vpoReferenceNumber}
          sx={{ width: '100%' }}
          onChange={handleAccordionChange(formValues.vpoReferenceNumber)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{BOOKING.accordionTitlePrefix}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormValues {...formValues} />
          </AccordionDetails>
        </Accordion>
        {formValues.relativeVpos?.map((nestedFormValues) => (
          <Accordion
            expanded={expandedForm === nestedFormValues.vpoReferenceNumber}
            sx={{ width: '100%' }}
            onChange={handleAccordionChange(
              nestedFormValues.vpoReferenceNumber,
            )}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {`${BOOKING.accordionRelativeTitlePrefix}${nestedFormValues.vpoReferenceNumber}`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormValues {...nestedFormValues} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
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
          <Button variant="contained" onClick={() => setIsModalOpen(false)}>
            {BOOKING.close}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
