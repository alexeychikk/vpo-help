import type { Appointments } from '@devexpress/dx-react-scheduler';
import PeopleIcon from '@mui/icons-material/People';
import { Box, Typography, useTheme } from '@mui/material';
import moment from 'moment';

export const AppointmentContent: React.FC<
  Appointments.AppointmentContentProps
> = (props) => {
  const theme = useTheme();
  const startDate = moment(props.data.startDate);
  const endDate = moment(props.data.endDate);

  return (
    <Typography
      variant="subtitle2"
      sx={{
        textAlign: 'center',
        color: theme.palette.common.white,
        p: 0.5,
        boxSizing: 'content-box',
        lineHeight: 1,
        height: `calc(100% - 8px)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        [theme.breakpoints.down('md')]: {
          fontSize: '1em',
        },
      }}
    >
      <Box>
        {startDate.format('HH:mm')}
        <Box
          sx={{
            display: {
              sm: 'inline',
              xs: 'none',
            },
          }}
        >
          {' '}
          -{' '}
        </Box>
        <Box
          sx={{
            display: {
              sm: 'inline',
              xs: 'block',
            },
          }}
        >
          {endDate.format('HH:mm')}
        </Box>
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
      >
        <PeopleIcon
          sx={{
            [theme.breakpoints.down('md')]: {
              width: '16px',
              height: '16px',
            },
          }}
        />
        {props.data['numberOfPersons']}
      </Box>
    </Typography>
  );
};
