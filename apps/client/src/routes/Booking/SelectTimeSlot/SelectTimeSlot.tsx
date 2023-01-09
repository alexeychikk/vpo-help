import { Box, Chip, Stack, Typography } from '@mui/material';
import type moment from 'moment';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ScheduleSlotAvailableDto } from '../../../services/schedule';
import type { VpoForm } from '../Booking';

export type SelectTimeSlotProps = {
  slots: Record<string, ScheduleSlotAvailableDto[]>;
};

export const SelectTimeSlot: React.FC<SelectTimeSlotProps> = ({ slots }) => {
  const { register, setValue, getValues } = useFormContext<VpoForm>();
  const scheduleDate = useWatch({
    name: 'scheduleDate',
    defaultValue: getValues().scheduleDate,
  });

  const handleSlotSelect = (dateFrom: moment.Moment) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setValue('scheduleDate', dateFrom.toISOString());
  };

  return (
    <Box>
      <Stack spacing={1}>
        {Object.keys(slots).map((weekDay) => {
          return (
            <Box key={weekDay}>
              <Typography sx={{ textTransform: 'capitalize', my: 1 }}>
                {weekDay}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {slots[weekDay].map(({ dateFrom, dateTo }) => {
                  return (
                    <Chip
                      key={dateFrom.toISOString()}
                      label={`${dateFrom.format('HH:mm')} - ${dateTo.format(
                        'HH:mm',
                      )}`}
                      color="primary"
                      variant={
                        scheduleDate === dateFrom.toISOString()
                          ? 'filled'
                          : 'outlined'
                      }
                      sx={{ mb: 1 }}
                      onClick={() => handleSlotSelect(dateFrom)}
                    />
                  );
                })}
              </Stack>
            </Box>
          );
        })}
      </Stack>
      <input
        {...register('scheduleDate', { required: true })}
        type="text"
        hidden
      />
    </Box>
  );
};
