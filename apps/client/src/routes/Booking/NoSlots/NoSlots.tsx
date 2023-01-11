import { Box, Button, Typography } from '@mui/material';
import { BOOKING } from '../../../constants';
import { ROUTES } from '../../routes.config';

export const NoSlots: React.FC = () => {
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
        {BOOKING.noSlots}
      </Typography>
      <Button href={ROUTES.MAIN.path} variant="contained">
        {BOOKING.gotoMain}
      </Button>
    </Box>
  );
};
