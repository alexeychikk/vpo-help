import { Stack } from '@mui/material';
import moment from 'moment';
import { useFormContext } from 'react-hook-form';
import type { VpoModel } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { DesktopDatePickerElement } from '../../../components/DesktopDatePickerElement';
import { PhoneNumberField } from '../../../components/PhoneNumberField';
import { SelectElement } from '../../../components/SelectElement';
import { TextFieldElement } from '../../../components/TextFieldElement';
import { BOOKING, ERROR_MESSAGES } from '../../../constants';
import { formatISOStartOfDay } from '../../../utils';

export type FormFieldsProps = {
  index?: number;
  arrayKey?: string;
};

export const FormFields: React.FC<FormFieldsProps> = ({ index, arrayKey }) => {
  const isArrayFields = arrayKey && typeof index === 'number';
  const formKeys = {
    vpoIssueDate: isArrayFields
      ? `${arrayKey}.${index}.vpoIssueDate`
      : 'vpoIssueDate',
    vpoReferenceNumber: isArrayFields
      ? `${arrayKey}.${index}.vpoReferenceNumber`
      : 'vpoReferenceNumber',
    firstName: isArrayFields ? `${arrayKey}.${index}.firstName` : 'firstName',
    lastName: isArrayFields ? `${arrayKey}.${index}.lastName` : 'lastName',
    middleName: isArrayFields
      ? `${arrayKey}.${index}.middleName`
      : 'middleName',
    taxIdNumber: isArrayFields
      ? `${arrayKey}.${index}.taxIdNumber`
      : 'taxIdNumber',
    phoneNumber: isArrayFields
      ? `${arrayKey}.${index}.phoneNumber`
      : 'phoneNumber',
    dateOfBirth: isArrayFields
      ? `${arrayKey}.${index}.dateOfBirth`
      : 'dateOfBirth',
    addressOfRegistration: isArrayFields
      ? `${arrayKey}.${index}.addressOfRegistration`
      : 'addressOfRegistration',
    addressOfResidence: isArrayFields
      ? `${arrayKey}.${index}.addressOfResidence`
      : 'addressOfResidence',
    numberOfRelatives: isArrayFields
      ? `${arrayKey}.${index}.numberOfRelatives`
      : 'numberOfRelatives',
    numberOfRelativesBelow16: isArrayFields
      ? `${arrayKey}.${index}.numberOfRelativesBelow16`
      : 'numberOfRelativesBelow16',
    numberOfRelativesAbove65: isArrayFields
      ? `${arrayKey}.${index}.numberOfRelativesAbove65`
      : 'numberOfRelativesAbove65',
  };
  const { control, watch } = useFormContext<Serialized<VpoModel>>();
  const dateOfBirth = watch(formKeys.dateOfBirth);
  const isTaxIdRequired =
    !isArrayFields || moment().diff(moment(dateOfBirth), 'years', true) > 14;

  return (
    <>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, lg: 3 }}
        sx={{ mb: 3 }}
      >
        <DesktopDatePickerElement
          required
          ignoreInvalidInputs
          name={formKeys.vpoIssueDate}
          label={BOOKING.form.vpoIssueDate}
          control={control}
          transform={formatISOStartOfDay}
          maxDate={moment()}
          rules={{
            validate: {
              minDate: (value) =>
                value && moment(value).isBefore(moment('2022-02-24'))
                  ? BOOKING.form.vpoIssueMinDateError
                  : undefined,
              maxDate: (value) =>
                value && moment(value).isAfter(moment())
                  ? BOOKING.form.vpoIssueMaxDateError
                  : undefined,
            },
          }}
          sx={{ width: { xs: '100%', md: '260px', lg: 'unset' } }}
        />
        <SelectElement
          required
          name={formKeys.addressOfResidence}
          label={BOOKING.form.addressOfResidence}
          helperText={BOOKING.form.addressOfResidenceHelper}
          control={control}
          rules={{
            validate: {
              city: (value) =>
                value && value !== BOOKING.form.addressOfResidenceValue
                  ? BOOKING.form.addressOfResidenceError
                  : undefined,
            },
          }}
          sx={{ width: { xs: '100%', md: '260px', lg: '450px' } }}
          options={BOOKING.form.addressOfResidenceOptions}
        />
        <TextFieldElement
          required
          name={formKeys.vpoReferenceNumber}
          label={BOOKING.form.vpoReferenceNumber}
          helperText={BOOKING.form.vpoReferenceNumberHelper}
          control={control}
          rules={{
            pattern: {
              value: /^(\d{4}-)?\d{10}$/i,
              message: ERROR_MESSAGES.patternVpoReferenceNumber,
            },
          }}
          sx={{ width: { md: '260px', lg: '300px' } }}
        />
      </Stack>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, lg: 3 }}
        sx={{ mb: 3 }}
      >
        <TextFieldElement
          required
          name={formKeys.lastName}
          label={BOOKING.form.lastName}
          control={control}
          rules={{
            maxLength: { value: 50, message: ERROR_MESSAGES.maxLength },
          }}
        />
        <TextFieldElement
          required
          name={formKeys.firstName}
          label={BOOKING.form.firstName}
          control={control}
          rules={{
            maxLength: { value: 50, message: ERROR_MESSAGES.maxLength },
          }}
        />
        <TextFieldElement
          required
          name={formKeys.middleName}
          label={BOOKING.form.middleName}
          control={control}
          rules={{
            maxLength: { value: 50, message: ERROR_MESSAGES.maxLength },
          }}
        />
        <TextFieldElement
          required={isTaxIdRequired}
          name={formKeys.taxIdNumber}
          label={BOOKING.form.taxIdNumber}
          control={control}
          rules={{
            pattern: {
              value: /^\d{10}$/,
              message: BOOKING.form.taxIdNumberError,
            },
          }}
        />
      </Stack>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, lg: 3 }}
        sx={{ mb: 3 }}
      >
        <DesktopDatePickerElement
          required
          ignoreInvalidInputs
          name={formKeys.dateOfBirth}
          label={BOOKING.form.dateOfBirth}
          control={control}
          transform={formatISOStartOfDay}
          maxDate={moment()}
        />
        <TextFieldElement
          required
          name={formKeys.addressOfRegistration}
          label={BOOKING.form.addressOfRegistration}
          control={control}
          rules={{
            maxLength: { value: 200, message: ERROR_MESSAGES.maxLength },
          }}
          sx={{ width: { xs: '100%', md: '300px' } }}
        />
        <PhoneNumberField
          required={!isArrayFields}
          name={formKeys.phoneNumber}
          label={BOOKING.form.phoneNumber}
          control={control}
        />
      </Stack>
      {!isArrayFields && (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 1, lg: 3 }}
          sx={{ mb: 3 }}
        >
          <TextFieldElement
            required
            type="number"
            name={formKeys.numberOfRelatives}
            label={BOOKING.form.numberOfRelatives}
            helperText={BOOKING.form.numberOfRelativesHelper}
            control={control}
            rules={{
              min: { value: 0, message: ERROR_MESSAGES.min },
              max: { value: 50, message: ERROR_MESSAGES.max },
            }}
            sx={{ width: { xs: '100%', md: '450px' } }}
          />
          <TextFieldElement
            type="number"
            name={formKeys.numberOfRelativesBelow16}
            label={BOOKING.form.numberOfRelativesBelow16}
            control={control}
            rules={{
              min: { value: 0, message: ERROR_MESSAGES.min },
              max: { value: 50, message: ERROR_MESSAGES.max },
            }}
            sx={{ width: { xs: '100%', md: '300px' } }}
          />
          <TextFieldElement
            type="number"
            name={formKeys.numberOfRelativesAbove65}
            label={BOOKING.form.numberOfRelativesAbove65}
            control={control}
            rules={{
              min: { value: 0, message: ERROR_MESSAGES.min },
              max: { value: 50, message: ERROR_MESSAGES.max },
            }}
            sx={{ width: { xs: '100%', md: '400px' } }}
          />
        </Stack>
      )}
    </>
  );
};
