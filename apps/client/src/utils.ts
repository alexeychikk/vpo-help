import moment from 'moment';

export const formatISOOnlyDate = (date: moment.Moment | null) =>
  date?.hours(0).minutes(0).seconds(0).format();

export const getCurrentUTCDate = () => formatISOOnlyDate(moment());
