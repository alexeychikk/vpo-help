import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography,
} from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';
import type { SettingsDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { BOOKING } from '../../../constants';
import type { VpoForm } from '../Booking';

export type InfoProps = {
  address?: string;
  settings?: Serialized<SettingsDto>;
};

export const Info: React.FC<InfoProps> = (props) => {
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
      <Typography variant="h5" textAlign="center" mb={4}>
        {BOOKING.infoTitle}
      </Typography>
      <Typography component="div" variant="body1">
        <pre
          style={{ lineHeight: 'inherit' }}
          dangerouslySetInnerHTML={{
            __html: BOOKING.info(props.settings),
          }}
        />
        {props.address && (
          <Box sx={{ display: 'flex', alignItems: 'center' }} mt={2}>
            <span>{BOOKING.address}</span>
            <pre
              style={{
                lineHeight: 0,
                display: 'inline-block',
                marginLeft: '5px',
              }}
              dangerouslySetInnerHTML={{
                __html: props.address,
              }}
            />
          </Box>
        )}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <FormControl error={!!error} component="fieldset" variant="standard">
          <FormControlLabel
            control={<Checkbox name={field.name} onChange={field.onChange} />}
            label={BOOKING.confirmInfo}
            sx={{ maxWidth: '600px', mt: 2 }}
          />
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      </Box>
    </Box>
  );
};
