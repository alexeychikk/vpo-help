import { advanceTo } from 'jest-date-mock';
import type { ScheduleAvailableDto } from '@vpo-help/model';
import { ScheduleDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { testApp } from '../../testApp';

test('takes into account current time', async () => {
  await testApp.settingsService.updateCommonSettings({
    scheduleDaysAvailable: 2,
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
