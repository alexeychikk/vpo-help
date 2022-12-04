import { Box, Chip, Stack, Typography } from '@mui/material';
import type moment from 'moment';
import { useFormContext, useWatch } from 'react-hook-form';
import type { VpoModel } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import type { ScheduleSlotAvailableDto } from '../../../services/schedule';

export type SelectTimeSlotProps = {
  slots: Record<string, ScheduleSlotAvailableDto[]>;
};

export const SelectTimeSlot: React.FC<SelectTimeSlotProps> = ({ slots }) => {
  const { register, setValue, getValues } =
    useFormContext<Serialized<VpoModel>>();
  const scheduleDate = useWatch({
    name: 'scheduleDate',
    defaultValue: getValues().scheduleDate,
  });

  const handleSlotSelect = (dateFrom: moment.Moment) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setValue('scheduleDate', dateFrom.format());
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
                      key={dateFrom.format()}
                      label={`${dateFrom.format('HH:mm')} - ${dateTo.format(
                        'HH:mm',
                      )}`}
                      color="primary"
                      variant={
                        scheduleDate === dateFrom.format()
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
