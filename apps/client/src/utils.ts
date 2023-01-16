import moment from 'moment';
import type { SettingsDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';

export const formatISOStartOfDay = (date: moment.Moment | string | null) =>
  (typeof date === 'string' ? moment(date) : date)
    ?.startOf('day')
    .toISOString();

export const formatISOEndOfDay = (date: moment.Moment | string | null) =>
  (typeof date === 'string' ? moment(date) : date)?.endOf('day').toISOString();

export const getCurrentDate = () => formatISOStartOfDay(moment());

const dotLoaderHtml = ` <span class="dot-loader"></span> `;

export const dotLoader = (value: unknown) =>
  // eslint-disable-next-line eqeqeq
  value == undefined ? dotLoaderHtml : value;

export const dateLoader = (date?: string) =>
  date ? moment(date).format('DD.MM.YYYY') : dotLoaderHtml;

export const nextDayLoader = (date?: string, daysToAdd = 1) =>
  date
    ? moment(date).add('day', daysToAdd).format('DD.MM.YYYY')
    : dotLoaderHtml;
