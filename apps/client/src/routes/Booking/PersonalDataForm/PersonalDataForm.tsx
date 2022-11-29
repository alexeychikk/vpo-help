import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { DesktopDatePickerElement } from '../../../components';
import { formatISOOnlyDate } from '../../../utils';
import type { BookingModel } from '../Booking';

export const PersonalDataForm: React.FC = () => {
  const { control } = useFormContext<BookingModel>();
  return (
    <Box>
      <DesktopDatePickerElement
        name="vpoReferenceDate"
        control={control}
        transform={formatISOOnlyDate}
      />
    </Box>
  );
};
