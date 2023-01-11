import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography,
} from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';
import { BOOKING } from '../../../constants';
import type { VpoForm } from '../Booking';

export const Info: React.FC = () => {
  const { control } = useFormContext<VpoForm>();
  const {
    field,
    fieldState: { error },
  } = useController({
    name: 'infoConfirmation',
    control,
    rules: {
      validate: {
        required: (value) =>
          value ? undefined : BOOKING.infoConfirmationRequired,
      },
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" textAlign="center" mb={2}>
        {BOOKING.infoTitle}
      </Typography>
      <Typography component="div" variant="body1">
        <pre
          style={{ lineHeight: 'inherit' }}
          dangerouslySetInnerHTML={{
            __html: BOOKING.info,
          }}
        />
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <FormControl error={!!error} component="fieldset" variant="standard">
          <FormControlLabel
            control={<Checkbox name={field.name} onChange={field.onChange} />}
            label={BOOKING.confirmInfo}
          />
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      </Box>
    </Box>
  );
};
