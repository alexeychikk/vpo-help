import type { SxProps } from '@mui/material';
import { Box, Typography } from '@mui/material';

export type BookingInfoItemProps = {
  label: string;
  data: string;
  sx?: SxProps;
};

export const BookingInfoItem: React.FC<BookingInfoItemProps> = (props) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', ...props.sx }}>
      <Typography variant="subtitle1">{props.label}</Typography>
      <Typography variant="h6" fontWeight="bold">
        {props.data}
      </Typography>
    </Box>
  );
};
