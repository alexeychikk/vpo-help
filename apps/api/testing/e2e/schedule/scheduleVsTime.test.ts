import { endOfDay, startOfDay } from 'date-fns';
import { advanceTo } from 'jest-date-mock';
import type { ScheduleAvailableDto } from '@vpo-help/model';
import { ScheduleDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { testApp } from '../../testApp';

jest.setTimeout(999999999);

test('takes into account current time', async () => {
  await testApp.settingsService.updateCommonSettings({
    scheduleDaysAvailable: 2,
    startOfRegistrationDate: startOfDay(new Date('2022-11-22')), // Tuesday
    endOfRegistrationDate: endOfDay(new Date('2022-11-30')), // Wednesday
  });
  advanceTo(new Date('2022-11-22 15:00')); // Tuesday

  await testApp.settingsService.updateSchedule(
    new ScheduleDto({
      2: [
        { timeFrom: '13:00', timeTo: '14:00', numberOfPersons: 1 },
        { timeFrom: '14:00', timeTo: '15:00', numberOfPersons: 1 },
      ],
      3: [{ timeFrom: '16:00', timeTo: '17:00', numberOfPersons: 1 }],
    }),
  );

  const res = await testApp.requestApi.get('/schedule/available').expect(200);
  const body = res.body as Serialized<ScheduleAvailableDto>;

  expect(body.items).toEqual([
    {
      dateFrom: new Date('2022-11-23 16:00').toISOString(),
      dateTo: new Date('2022-11-23 17:00').toISOString(),
    },
    {
      dateFrom: new Date('2022-11-29 13:00').toISOString(),
      dateTo: new Date('2022-11-29 14:00').toISOString(),
    },
    {
      dateFrom: new Date('2022-11-29 14:00').toISOString(),
      dateTo: new Date('2022-11-29 15:00').toISOString(),
    },
  ]);
});
