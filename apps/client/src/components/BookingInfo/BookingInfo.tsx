import { Box, CircularProgress, Typography } from '@mui/material';
import moment from 'moment';
import { Navigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import { BOOKING } from '../../constants';
import { ROUTES } from '../../routes/routes.config';
import { htmlService, settingsService } from '../../services';
import { BookingInfoItem } from './BookingInfoItem';

export type BookingInfoProps = {
  vpoReferenceNumbers?: string[];
  bookingDate: string;
  receivedHelpDate?: string;
};

export const BookingInfo: React.FC<BookingInfoProps> = ({
  vpoReferenceNumbers,
  bookingDate,
  receivedHelpDate,
}) => {
  const bookingMomentDate = moment(bookingDate);
  const isHelpReceived = !!receivedHelpDate;
  const isExpired = !isHelpReceived && bookingMomentDate.isBefore(moment());
  const isScheduled = !isHelpReceived && !isExpired;
  const infoResponse = useAsync(async () => {
    const info = await htmlService.getPage('info');
    return info.content;
  });
  const settingsResponse = useAsync(() => settingsService.getSettings());

  if (infoResponse.loading) {
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress size={50} />
    </Box>;
  }

  if (infoResponse.error) {
    console.error(infoResponse.error);
    return <Navigate to={ROUTES.MAIN.path} />;
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="h5" mb={2}>
        {BOOKING.bookingInfoTitle}
      </Typography>

      {isHelpReceived && (
        <Typography variant="h6" mb={4}>
          <span
            dangerouslySetInnerHTML={{
              __html: BOOKING.helpReceived(settingsResponse.value, {
                receivedHelpDate,
              }),
            }}
          />
        </Typography>
      )}
      {isExpired && (
        <Typography variant="h6" mb={4}>
          <span
            dangerouslySetInnerHTML={{
              __html: BOOKING.bookingExpired(settingsResponse.value),
            }}
          />
        </Typography>
      )}
      {isScheduled && (
        <>
          <BookingInfoItem
            label={BOOKING.form.scheduleDate}
            data={bookingMomentDate.format('HH:mm - DD MMMM YYYY')}
            sx={{ alignItems: 'center', mb: 2 }}
          />
          {vpoReferenceNumbers?.length && (
            <Typography variant="h6" mb={4}>
              {BOOKING.bookingInfoReferenceNumbers}
              {vpoReferenceNumbers.join(', ')}
            </Typography>
          )}
          {infoResponse.value?.['addresses'] && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1">{BOOKING.address}</Typography>
              <Typography component="div" variant="h6" mb={4}>
                <pre
                  dangerouslySetInnerHTML={{
                    __html: infoResponse.value?.['addresses'],
                  }}
                />
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
