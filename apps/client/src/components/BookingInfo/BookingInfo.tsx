import { Box, Typography } from '@mui/material';
import moment from 'moment';
import { BOOKING } from '../../constants';
import { BookingInfoItem } from './BookingInfoItem';

export type BookingInfoProps = {
  vpoReferenceNumber: string;
  bookingDate: string;
};

export const BookingInfo: React.FC<BookingInfoProps> = ({
  vpoReferenceNumber,
  bookingDate,
}) => {
  const bookingMomentDate = moment(bookingDate);
  const isExpired = bookingMomentDate.isBefore(moment());
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="h5" mb={2}>
        {BOOKING.bookingInfoTitle} (№{vpoReferenceNumber})
      </Typography>
      {isExpired ? (
        <Typography variant="h6" mb={4}>
          {BOOKING.bookingExpired}
        </Typography>
      ) : (
        <BookingInfoItem
          label={BOOKING.form.scheduleDate}
          data={bookingMomentDate.format('HH:mm - DD MMMM YYYY')}
          sx={{ alignItems: 'center', mb: 4 }}
        />
      )}
    </Box>
  );
};
