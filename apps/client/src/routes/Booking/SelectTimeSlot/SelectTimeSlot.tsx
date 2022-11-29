import { Box, Chip, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useFormContext, useWatch } from 'react-hook-form';
import type { BookingModel } from '../Booking';

export const SelectTimeSlot: React.FC = () => {
  const { register, setValue, getValues } = useFormContext<BookingModel>();
  const scheduleDate = useWatch({
    name: 'scheduleDate',
    defaultValue: getValues().scheduleDate,
  });

  const mockedData = {
    [moment('2022-11-22').format('dddd (DD.MM.yy)')]: [
      {
        dateFrom: moment('2022-11-22T12:30:00Z').utc(),
        dateTo: moment('2022-11-22T13:00:00Z').utc(),
      },
      {
        dateFrom: moment('2022-11-22T15:30:00Z').utc(),
        dateTo: moment('2022-11-22T16:00:00Z').utc(),
      },
    ],
    [moment('2022-11-23').format('dddd (DD.MM.yy)')]: [
      {
        dateFrom: moment('2022-11-23T15:30:00Z').utc(),
        dateTo: moment('2022-11-23T16:00:00Z').utc(),
      },
      {
        dateFrom: moment('2022-11-23T16:00:00Z').utc(),
        dateTo: moment('2022-11-23T16:30:00Z').utc(),
      },
    ],
  };

  const data = mockedData;

  const handleSlotSelect = (dateFrom: moment.Moment) => {
    setValue('scheduleDate', dateFrom.toISOString());
  };

  return (
    <Box>
      <Stack spacing={1}>
        {Object.keys(data).map((weekDay) => {
          return (
            <Box key={weekDay}>
              <Typography sx={{ textTransform: 'capitalize', my: 1 }}>
                {weekDay}
              </Typography>
              <Stack direction="row" spacing={1}>
                {data[weekDay].map(({ dateFrom, dateTo }) => {
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
