import { advanceTo } from 'jest-date-mock';
import type { ScheduleAvailableDto } from '@vpo-help/model';
import { ScheduleDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { testApp } from '../../testApp';

test('takes into account registered vpo-s', async () => {
  await testApp.settingsService.updateCommonSettings({
    scheduleDaysAvailable: 2,
    startOfRegistrationDate: new Date('2022-11-22'),
    endOfRegistrationDate: new Date('2022-11-30'),
  });
  advanceTo(new Date('2022-11-22')); // Tuesday

  await testApp.settingsService.updateSchedule(
    new ScheduleDto({
      2: [
        { timeFrom: '13:00', timeTo: '14:00', numberOfPersons: 1 },
        { timeFrom: '14:00', timeTo: '15:00', numberOfPersons: 2 },
      ],
      3: [
        { timeFrom: '16:00', timeTo: '17:00', numberOfPersons: 1 },
        { timeFrom: '17:00', timeTo: '18:00', numberOfPersons: 2 },
      ],
    }),
  );

  await testApp.registerVpo({
    // Tuesday 13:00-14:00
    scheduleDate: await testApp.getAvailableDateSlot(),
  });
  await testApp.registerVpo({
    // Tuesday 14:00-15:00
    scheduleDate: await testApp.getAvailableDateSlot(),
  });
  await testApp.registerVpo({
    // Wednesday 16:00-17:00
    scheduleDate: await testApp.getAvailableDateSlot(1),
  });
  await testApp.registerVpo({
    // Wednesday 17:00-18:00
    scheduleDate: await testApp.getAvailableDateSlot(1),
  });

  const res = await testApp.requestApi.get('/schedule/available').expect(200);
  const body = res.body as Serialized<ScheduleAvailableDto>;

  expect(body.items).toEqual([
    {
      dateFrom: new Date('2022-11-22 14:00').toISOString(),
      dateTo: new Date('2022-11-22 15:00').toISOString(),
    },
    {
      dateFrom: new Date('2022-11-23 17:00').toISOString(),
      dateTo: new Date('2022-11-23 18:00').toISOString(),
    },
    // Next Tuesday is added because today not all slots are available
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
