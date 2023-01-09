import { Box, Stack } from '@mui/material';
import moment from 'moment';
import type { VpoModel, VpoRelativeModel } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { BookingInfoItem } from '../../../components/BookingInfo/BookingInfoItem';
import { BOOKING } from '../../../constants';

export type FormValuesProps =
  | Serialized<VpoModel>
  | Serialized<VpoRelativeModel>;

export const FormValues: React.FC<FormValuesProps> = (formValues) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
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
        {formValues.phoneNumber && (
          <BookingInfoItem
            label={BOOKING.form.phoneNumber}
            data={formValues.phoneNumber}
          />
        )}
        {formValues.taxIdNumber && (
          <BookingInfoItem
            label={BOOKING.form.taxIdNumber}
            data={formValues.taxIdNumber}
          />
        )}
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
        {'numberOfRelatives' in formValues && (
          <BookingInfoItem
            label={BOOKING.form.numberOfRelatives}
            data={`${formValues.numberOfRelatives} ${BOOKING.peopleSuffix}`}
          />
        )}
        {'numberOfRelativesBelow16' in formValues &&
          !!formValues.numberOfRelativesBelow16 && (
            <BookingInfoItem
              label={BOOKING.form.numberOfRelativesBelow16}
              data={`${formValues.numberOfRelativesBelow16} ${BOOKING.peopleSuffix}`}
            />
          )}
        {'numberOfRelativesAbove65' in formValues &&
          !!formValues.numberOfRelativesAbove65 && (
            <BookingInfoItem
              label={BOOKING.form.numberOfRelativesAbove65}
              data={`${formValues.numberOfRelativesAbove65} ${BOOKING.peopleSuffix}`}
            />
          )}
      </Stack>
    </Box>
  );
};
