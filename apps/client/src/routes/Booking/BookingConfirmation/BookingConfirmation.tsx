import { Box, Stack } from '@mui/material';
import moment from 'moment';
import { useFormContext } from 'react-hook-form';
import { BookingInfoItem } from '../../../components';
import { BOOKING } from '../../../constants';
import type { BookingModel } from '../Booking';

export const BookingConfirmation: React.FC = () => {
  const { getValues } = useFormContext<BookingModel>();
  const formValues = getValues();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <BookingInfoItem
        label={BOOKING.form.scheduleDate}
        data={moment(formValues.scheduleDate)
          .utc()
          .format('HH:mm - DD MMMM YYYY')}
      />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2, lg: 5 }}
        sx={{ my: 3 }}
      >
        <BookingInfoItem
          label={BOOKING.form.vpoIssueDate}
          data={moment(formValues.vpoIssueDate).utc().format('DD.MM.YY')}
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
      </Stack>
      <Stack
        direction={{ md: 'column', lg: 'row' }}
        spacing={{ xs: 2, lg: 5 }}
        sx={{ mb: 3 }}
      >
        <BookingInfoItem
          label={BOOKING.form.dateOfBirth}
          data={moment(formValues.dateOfBirth).utc().format('DD.MM.YY')}
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
      {formValues.numberOfRelativesBelow16 &&
        formValues.numberOfRelativesAbove65 && (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, lg: 5 }}
            sx={{ mb: 3 }}
          >
            {formValues.numberOfRelativesBelow16 && (
              <BookingInfoItem
                label={BOOKING.form.numberOfRelativesBelow16}
                data={`${formValues.numberOfRelativesBelow16} ${BOOKING.peopleSuffix}`}
              />
            )}
            {formValues.numberOfRelativesAbove65 && (
              <BookingInfoItem
                label={BOOKING.form.numberOfRelativesAbove65}
                data={`${formValues.numberOfRelativesAbove65} ${BOOKING.peopleSuffix}`}
              />
            )}
          </Stack>
        )}
    </Box>
  );
};
