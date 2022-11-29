import { Box, Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import {
  DesktopDatePickerElement,
  TextFieldElement,
} from '../../../components';
import { BOOKING } from '../../../constants';
import { formatISOOnlyDate } from '../../../utils';
import type { BookingModel } from '../Booking';

export const PersonalDataForm: React.FC = () => {
  const { control } = useFormContext<BookingModel>();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, lg: 3 }}
        sx={{ mb: 3 }}
      >
        <DesktopDatePickerElement
          required
          ignoreInvalidInputs
          name="vpoReferenceDate"
          label={BOOKING.form.vpoReferenceDate}
          control={control}
          transform={formatISOOnlyDate}
        />
        <TextFieldElement
          required
          name="vpoReferenceNumber"
          label={BOOKING.form.vpoReferenceNumber}
          control={control}
          sx={{ width: '300px' }}
        />
      </Stack>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, lg: 3 }}
        sx={{ mb: 3 }}
      >
        <TextFieldElement
          required
          name="lastName"
          label={BOOKING.form.lastName}
          control={control}
        />
        <TextFieldElement
          required
          name="firstName"
          label={BOOKING.form.firstName}
          control={control}
        />
        <TextFieldElement
          required
          name="middleName"
          label={BOOKING.form.middleName}
          control={control}
        />
      </Stack>
      <Stack
        direction={{ md: 'column', lg: 'row' }}
        spacing={{ xs: 1, lg: 3 }}
        sx={{ mb: 3 }}
      >
        <DesktopDatePickerElement
          required
          ignoreInvalidInputs
          name="dateOfBirth"
          label={BOOKING.form.dateOfBirth}
          control={control}
          transform={formatISOOnlyDate}
        />
        <TextFieldElement
          required
          name="addressOfRegistration"
          label={BOOKING.form.addressOfRegistration}
          control={control}
          sx={{ width: '300px' }}
        />
        <TextFieldElement
          required
          name="addressOfResidence"
          label={BOOKING.form.addressOfResidence}
          control={control}
          sx={{ width: { xs: '300px', md: '450px' } }}
        />
      </Stack>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, lg: 3 }}
        sx={{ mb: 3 }}
      >
        <TextFieldElement
          type="number"
          name="numberOfRelativesBelow16"
          label={BOOKING.form.numberOfRelativesBelow16}
          control={control}
          sx={{ width: '300px' }}
        />
        <TextFieldElement
          type="number"
          name="numberOfRelativesAbove65"
          label={BOOKING.form.numberOfRelativesAbove65}
          control={control}
          sx={{ width: { xs: '300px', md: '400px' } }}
        />
      </Stack>
    </Box>
  );
};
