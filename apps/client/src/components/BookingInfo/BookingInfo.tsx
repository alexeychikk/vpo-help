import { Box, Typography } from '@mui/material';
import moment from 'moment';
import { BOOKING, FOOTER } from '../../constants';
import { BookingInfoItem } from './BookingInfoItem';

export type BookingInfoProps = {
  vpoReferenceNumber: string;
  bookingDate: string;
  addresses: string;
};

export const BookingInfo: React.FC<BookingInfoProps> = ({
  vpoReferenceNumber,
  bookingDate,
  addresses,
}) => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="h5" mb={2}>
        {BOOKING.bookingInfoTitle} (№{vpoReferenceNumber})
      </Typography>
      <BookingInfoItem
        label={BOOKING.form.scheduleDate}
        data={moment(bookingDate).format('HH:mm - DD MMMM YYYY')}
        sx={{ alignItems: 'center', mb: 4 }}
      />
      {addresses && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" mb={2}>
            {FOOTER.addresses}
          </Typography>
          <Typography component="div" variant="body1">
            <pre dangerouslySetInnerHTML={{ __html: addresses }} />
          </Typography>
        </Box>
      )}
    </Box>
  );
};
