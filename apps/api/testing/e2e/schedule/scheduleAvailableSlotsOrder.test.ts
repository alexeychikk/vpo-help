import { advanceTo } from 'jest-date-mock';
import type { ScheduleAvailableDto } from '@vpo-help/model';
import { ScheduleDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { testApp } from '../../testApp';

test('available schedule slots come in order after update', async () => {
  advanceTo(new Date('2022-11-22 12:00')); // Tuesday

  await testApp.settingsService.updateSchedule(
    new ScheduleDto({
      3: [
        { timeFrom: '18:00', timeTo: '19:00', numberOfPersons: 1 },
        { timeFrom: '16:00', timeTo: '17:00', numberOfPersons: 1 },
      ],
      2: [
        { timeFrom: '14:00', timeTo: '15:00', numberOfPersons: 1 },
        { timeFrom: '13:00', timeTo: '14:00', numberOfPersons: 1 },
      ],
    }),
  );

  const res = await testApp.requestApi.get('/schedule/available').expect(200);
  const body = res.body as Serialized<ScheduleAvailableDto>;

  expect(body.items).toEqual([
    {
      dateFrom: new Date('2022-11-22 13:00').toISOString(),
      dateTo: new Date('2022-11-22 14:00').toISOString(),
    },
    {
      dateFrom: new Date('2022-11-22 14:00').toISOString(),
      dateTo: new Date('2022-11-22 15:00').toISOString(),
    },
    {
      dateFrom: new Date('2022-11-23 16:00').toISOString(),
      dateTo: new Date('2022-11-23 17:00').toISOString(),
    },
    {
      dateFrom: new Date('2022-11-23 18:00').toISOString(),
      dateTo: new Date('2022-11-23 19:00').toISOString(),
    },
  ]);
});
