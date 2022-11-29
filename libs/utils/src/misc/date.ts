import { setHours, setMinutes, startOfDay } from 'date-fns';

export function setTimeOnDate(time: string, date: Date) {
  const [hours, minutes] = time.split(':');
  return setHours(setMinutes(startOfDay(date), +minutes), +hours);
}
