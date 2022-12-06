import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';
import { Box } from '@mui/material';
import moment from 'moment';

const styles: React.CSSProperties = {
  textTransform: 'capitalize',
  display: 'block',
  textAlign: 'center',
  paddingLeft: 0,
};

export const DayScaleCell: React.FC<WeekView.DayScaleCellProps> = ({
  formatDate,
  ...props
}) => {
  return (
    <>
      <Box sx={{ display: { xs: 'table-cell', md: 'none' } }}>
        <WeekView.DayScaleCell
          {...props}
          style={styles}
          formatDate={(date, options) => {
            const momentDate: moment.Moment = moment(date);
            const { weekday } = options;
            return weekday ? momentDate.format('ddd') : '';
          }}
        ></WeekView.DayScaleCell>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'table-cell' } }}>
        <WeekView.DayScaleCell
          {...props}
          style={styles}
          formatDate={(date, options) => {
            const momentDate: moment.Moment = moment(date);
            const { weekday } = options;
            return weekday ? momentDate.format('dddd') : '';
          }}
        ></WeekView.DayScaleCell>
      </Box>
    </>
  );
};
