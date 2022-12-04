import { Box, Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import type { VpoModel } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import {
  DesktopDatePickerElement,
  PhoneNumberField,
  TextFieldElement,
} from '../../../components';
import { BOOKING, ERROR_MESSAGES } from '../../../constants';
import { formatISOOnlyDate } from '../../../utils';

export const PersonalDataForm: React.FC = () => {
  const { control } = useFormContext<Serialized<VpoModel>>();
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
          name="vpoIssueDate"
          label={BOOKING.form.vpoIssueDate}
          control={control}
          transform={formatISOOnlyDate}
        />
        <TextFieldElement
          required
          name="vpoReferenceNumber"
          label={BOOKING.form.vpoReferenceNumber}
          control={control}
          rules={{
            minLength: { value: 3, message: ERROR_MESSAGES.minLength },
            maxLength: { value: 50, message: ERROR_MESSAGES.maxLength },
          }}
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
          rules={{
            maxLength: { value: 50, message: ERROR_MESSAGES.maxLength },
          }}
        />
        <TextFieldElement
          required
          name="firstName"
          label={BOOKING.form.firstName}
          control={control}
          rules={{
            maxLength: { value: 50, message: ERROR_MESSAGES.maxLength },
          }}
        />
        <TextFieldElement
          required
          name="middleName"
          label={BOOKING.form.middleName}
          control={control}
          rules={{
            maxLength: { value: 50, message: ERROR_MESSAGES.maxLength },
          }}
        />
        <PhoneNumberField
          required
          name="phoneNumber"
          label={BOOKING.form.phoneNumber}
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
          rules={{
            maxLength: { value: 200, message: ERROR_MESSAGES.maxLength },
          }}
          sx={{ width: '300px' }}
        />
        <TextFieldElement
          required
          disabled
          name="addressOfResidence"
          label={BOOKING.form.addressOfResidence}
          helperText={BOOKING.form.addressOfResidenceHelper}
          control={control}
          rules={{
            maxLength: { value: 200, message: ERROR_MESSAGES.maxLength },
          }}
          sx={{ width: { xs: '300px', md: '450px' } }}
        />
      </Stack>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, lg: 3 }}
        sx={{ mb: 3 }}
      >
        <TextFieldElement
          required
          type="number"
          name="numberOfRelatives"
          label={BOOKING.form.numberOfRelatives}
          control={control}
          rules={{
            min: { value: 0, message: ERROR_MESSAGES.min },
            max: { value: 50, message: ERROR_MESSAGES.max },
          }}
          sx={{ width: { xs: '300px', md: '450px' } }}
        />
        <TextFieldElement
          type="number"
          name="numberOfRelativesBelow16"
          label={BOOKING.form.numberOfRelativesBelow16}
          control={control}
          rules={{
            min: { value: 0, message: ERROR_MESSAGES.min },
            max: { value: 50, message: ERROR_MESSAGES.max },
          }}
          sx={{ width: '300px' }}
        />
        <TextFieldElement
          type="number"
          name="numberOfRelativesAbove65"
          label={BOOKING.form.numberOfRelativesAbove65}
          control={control}
          rules={{
            min: { value: 0, message: ERROR_MESSAGES.min },
            max: { value: 50, message: ERROR_MESSAGES.max },
          }}
          sx={{ width: { xs: '300px', md: '400px' } }}
        />
      </Stack>
    </Box>
  );
};
