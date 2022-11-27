import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';
import moment from 'moment';

export const DayScaleCell: React.FC<WeekView.DayScaleCellProps> = ({
  formatDate,
  ...props
}) => {
  return (
    <WeekView.DayScaleCell
      {...props}
      style={{ textTransform: 'capitalize' }}
      formatDate={(date, options) => {
        const momentDate: moment.Moment = moment(date);
        const { weekday } = options;
        return weekday ? momentDate.format('dddd') : '';
      }}
    ></WeekView.DayScaleCell>
  );
};
