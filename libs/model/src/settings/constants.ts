import { ScheduleDto, ScheduleSlotDto } from './schedule.dto';
import { SettingsDto } from './settings.dto';

export const DEFAULT_SETTINGS = new SettingsDto({
  daysToNextVpoRegistration: 60,
  endOfWarDate: new Date('2025-01-01'),
  scheduleDaysAvailable: 3,
});

export const DEFAULT_DAY_SCHEDULE = [
  new ScheduleSlotDto({
    timeFrom: '13:00',
    timeTo: '13:30',
    numberOfPersons: 40,
  }),
  new ScheduleSlotDto({
    timeFrom: '13:30',
    timeTo: '14:00',
    numberOfPersons: 40,
  }),
  new ScheduleSlotDto({
    timeFrom: '14:00',
    timeTo: '14:30',
    numberOfPersons: 40,
  }),
  new ScheduleSlotDto({
    timeFrom: '14:30',
    timeTo: '15:00',
    numberOfPersons: 40,
  }),
  new ScheduleSlotDto({
    timeFrom: '15:00',
    timeTo: '15:30',
    numberOfPersons: 40,
  }),
  new ScheduleSlotDto({
    timeFrom: '15:30',
    timeTo: '16:00',
    numberOfPersons: 40,
  }),
];

export const DEFAULT_SCHEDULE = new ScheduleDto({
  2: DEFAULT_DAY_SCHEDULE,
  3: DEFAULT_DAY_SCHEDULE,
  4: DEFAULT_DAY_SCHEDULE,
});
