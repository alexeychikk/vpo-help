import { Box, Typography } from '@mui/material';
import type { SettingsDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { NavLinkButton } from '../../../components/NavLinkButton';
import { BOOKING } from '../../../constants';
import { ROUTES } from '../../routes.config';

export type NoSlotsProps = {
  settings?: Serialized<SettingsDto>;
};

export const NoSlots: React.FC<NoSlotsProps> = (props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mt: '33vh',
      }}
    >
      <Typography variant="h5" textAlign="center" mb={2}>
        <span>
          {BOOKING.noSlots}
          {!props.settings?.isLastRegistration && (
            <>
              <br />
              {BOOKING.nextRegistrationAt(props.settings)}
            </>
          )}
        </span>
      </Typography>
      <NavLinkButton to={ROUTES.MAIN.path} variant="contained">
        {BOOKING.gotoMain}
      </NavLinkButton>
    </Box>
  );
};
