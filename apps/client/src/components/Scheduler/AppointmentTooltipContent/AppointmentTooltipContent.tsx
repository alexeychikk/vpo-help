import type { AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import { AccessTimeOutlined } from '@mui/icons-material';
import { Box, Container, Typography } from '@mui/material';
import moment from 'moment';
import { SCHEDULER } from '../../../constants';

export const AppointmentTooltipContent: React.FC<
  AppointmentTooltip.ContentProps
> = (props) => {
  const startDate = moment(props.appointmentData?.startDate);
  const endDate = moment(props.appointmentData?.endDate);

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" textTransform={'capitalize'} marginBottom={2}>
        {startDate.format('dddd')}
      </Typography>
      <Box display={'flex'} alignItems={'center'} marginBottom={1}>
        <AccessTimeOutlined sx={{ mr: 1 }} />
        <Typography variant="h6" textTransform={'capitalize'}>
          {`${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`}
        </Typography>
      </Box>
      <Typography variant="subtitle1">
        {SCHEDULER.appointmentTooltip.maxSlotCapacity}
        {': '}
        {props.appointmentData?.['numberOfPersons'] || 0}
      </Typography>
    </Container>
  );
};
