import { advanceTo } from 'jest-date-mock';
import type { ScheduleAvailableDto } from '@vpo-help/model';
import { ScheduleDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { testApp } from '../../testApp';

test('available schedule slots depend on start/end registration dates', async () => {
  await testApp.settingsService.updateCommonSettings({
    scheduleDaysAvailable: 10,
    startOfRegistrationDate: new Date('2022-11-22 13:30'), // Tuesday
    endOfRegistrationDate: new Date('2022-11-22 15:30'), // Tuesday
  });
  advanceTo(new Date('2022-11-22 12:00')); // Tuesday

  await testApp.settingsService.updateSchedule(
    new ScheduleDto({
      2: [
        { timeFrom: '12:00', timeTo: '13:00', numberOfPersons: 1 },
        { timeFrom: '13:00', timeTo: '14:00', numberOfPersons: 1 },
        { timeFrom: '14:00', timeTo: '15:00', numberOfPersons: 1 },
        { timeFrom: '15:00', timeTo: '16:00', numberOfPersons: 1 },
        { timeFrom: '16:00', timeTo: '17:00', numberOfPersons: 1 },
      ],
    }),
  );

  const res = await testApp.requestApi.get('/schedule/available').expect(200);
  const body = res.body as Serialized<ScheduleAvailableDto>;

  expect(body.items).toEqual([
    {
      dateFrom: new Date('2022-11-22 14:00').toISOString(),
      dateTo: new Date('2022-11-22 15:00').toISOString(),
    },
  ]);
});
