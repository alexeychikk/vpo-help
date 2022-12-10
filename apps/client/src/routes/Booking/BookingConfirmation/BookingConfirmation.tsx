import {
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
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { RegisterVpoDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { BookingInfoItem } from '../../../components/BookingInfo/BookingInfoItem';
import { ButtonWithLoading } from '../../../components/ButtonWithLoading';
import { TextFieldElement } from '../../../components/TextFieldElement';
import { BOOKING, ERROR_MESSAGES } from '../../../constants';
import { authService } from '../../../services';

const RESEND_SECONDS_TIMEOUT = 60;

export const BookingConfirmation: React.FC = () => {
  const { control, getValues, trigger } =
    useFormContext<Serialized<RegisterVpoDto>>();
  const formValues = getValues();
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
      >
        <BookingInfoItem
          label={BOOKING.form.scheduleDate}
          data={moment(formValues.scheduleDate).format('HH:mm - DD MMMM YYYY')}
        />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, lg: 5 }}
          sx={{ my: 3 }}
        >
          <BookingInfoItem
            label={BOOKING.form.vpoIssueDate}
            data={moment(formValues.vpoIssueDate).format('DD.MM.YYYY')}
          />
          <BookingInfoItem
            label={BOOKING.form.vpoReferenceNumber}
            data={formValues.vpoReferenceNumber}
          />
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, lg: 5 }}
          sx={{ mb: 3 }}
        >
          <BookingInfoItem
            label={BOOKING.form.lastName}
            data={formValues.lastName}
          />
          <BookingInfoItem
            label={BOOKING.form.firstName}
            data={formValues.firstName}
          />
          <BookingInfoItem
            label={BOOKING.form.middleName}
            data={formValues.middleName}
          />
          <BookingInfoItem
            label={BOOKING.form.phoneNumber}
            data={formValues.phoneNumber}
          />
        </Stack>
        <Stack
          direction={{ md: 'column', lg: 'row' }}
          spacing={{ xs: 2, lg: 5 }}
          sx={{ mb: 3 }}
        >
          <BookingInfoItem
            label={BOOKING.form.dateOfBirth}
            data={moment(formValues.dateOfBirth).format('DD.MM.YYYY')}
          />
          <BookingInfoItem
            label={BOOKING.form.addressOfRegistration}
            data={formValues.addressOfRegistration}
          />
          <BookingInfoItem
            label={BOOKING.form.addressOfResidence}
            data={formValues.addressOfResidence}
          />
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, lg: 5 }}
          sx={{ mb: 3 }}
        >
          <BookingInfoItem
            label={BOOKING.form.numberOfRelatives}
            data={`${formValues.numberOfRelatives} ${BOOKING.peopleSuffix}`}
          />
          {!!formValues.numberOfRelativesBelow16 && (
            <BookingInfoItem
              label={BOOKING.form.numberOfRelativesBelow16}
              data={`${formValues.numberOfRelativesBelow16} ${BOOKING.peopleSuffix}`}
            />
          )}
          {!!formValues.numberOfRelativesAbove65 && (
            <BookingInfoItem
              label={BOOKING.form.numberOfRelativesAbove65}
              data={`${formValues.numberOfRelativesAbove65} ${BOOKING.peopleSuffix}`}
            />
          )}
        </Stack>
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
