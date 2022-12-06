import type { AppointmentForm } from '@devexpress/dx-react-scheduler-material-ui';
import { Box, Container, TextField, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import type { ChangeEventHandler } from 'react';
import { useCallback } from 'react';
import { SCHEDULER } from '../../../constants';

export const AppointmentFormLayout: React.FC<
  AppointmentForm.BasicLayoutProps
> = ({ onFieldChange, ...props }) => {
  const handleStartDateChange = useCallback(
    (nextValue: number | null) => {
      onFieldChange({
        startDate: nextValue ? moment(nextValue).toISOString() : '',
      });
    },
    [onFieldChange],
  );

  const handleEndDateChange = useCallback(
    (nextValue: number | null) => {
      onFieldChange({
        endDate: nextValue ? moment(nextValue).toISOString() : '',
      });
    },
    [onFieldChange],
  );

  const handleSlotCapacityChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        const nextValue = parseInt(event.currentTarget.value);
        onFieldChange({ numberOfPersons: isNaN(nextValue) ? '' : nextValue });
      },
      [onFieldChange],
    );

  return (
    <Container sx={{ p: 2 }}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems="center"
        mt={2}
        mb={4}
      >
        <TimePicker
          label={SCHEDULER.appointmentForm.startDate}
          value={props.appointmentData.startDate}
          onChange={handleStartDateChange}
          renderInput={(params) => (
            <TextField
              required
              error={!props.appointmentData.startDate}
              {...params}
            />
          )}
        />
        <Typography variant="subtitle1" ml={3} mr={3}>
          -
        </Typography>
        <TimePicker
          label={SCHEDULER.appointmentForm.endDate}
          value={props.appointmentData.endDate}
          onChange={handleEndDateChange}
          renderInput={(params) => (
            <TextField
              required
              error={!props.appointmentData.endDate}
              {...params}
            />
          )}
        />
      </Box>
      <TextField
        required
        fullWidth
        type="number"
        id="numberOfPersons"
        name="numberOfPersons"
        label={SCHEDULER.appointmentForm.maxSlotCapacity}
        value={props.appointmentData['numberOfPersons'] ?? ''}
        error={!props.appointmentData['numberOfPersons']}
        onChange={handleSlotCapacityChange}
      />
    </Container>
  );
};
