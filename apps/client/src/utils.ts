import moment from 'moment';

export const formatISOStartOfDay = (date: moment.Moment | string | null) =>
  (typeof date === 'string' ? moment(date) : date)
    ?.startOf('day')
    .toISOString();

export const formatISOEndOfDay = (date: moment.Moment | string | null) =>
  (typeof date === 'string' ? moment(date) : date)?.endOf('day').toISOString();

export const getCurrentDate = () => formatISOStartOfDay(moment());
