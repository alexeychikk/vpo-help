import { endOfDay, startOfDay } from 'date-fns';
import { advanceTo } from 'jest-date-mock';
import type { ScheduleAvailableDto } from '@vpo-help/model';
import { ScheduleDto } from '@vpo-help/model';
import type { Serialized } from '@vpo-help/utils';
import { testApp } from '../../testApp';

test('returns empty array if all slots are taken', async () => {
  await testApp.settingsService.updateCommonSettings({
    scheduleDaysAvailable: 2,
    startOfRegistrationDate: startOfDay(new Date('2022-11-22')), // Tuesday
    endOfRegistrationDate: endOfDay(new Date('2022-11-23')), // Wednesday
  });
  advanceTo(new Date('2022-11-22 12:00')); // Tuesday

  await testApp.settingsService.updateSchedule(
    new ScheduleDto({
      2: [
        { timeFrom: '13:00', timeTo: '14:00', numberOfPersons: 2 },
        { timeFrom: '14:00', timeTo: '15:00', numberOfPersons: 2 },
      ],
    }),
  );

  await testApp.registerVpo({
    // Tuesday 13:00-14:00
    scheduleDate: await testApp.getAvailableDateSlot(),
  });
  await testApp.registerVpo({
    // Tuesday 13:00-14:00
    scheduleDate: await testApp.getAvailableDateSlot(),
  });
  await testApp.registerVpo({
    // Tuesday 14:00-15:00
    scheduleDate: await testApp.getAvailableDateSlot(),
  });
  await testApp.registerVpo({
    // Tuesday 14:00-15:00
    scheduleDate: await testApp.getAvailableDateSlot(),
  });

  advanceTo(new Date('2022-11-22 13:30')); // Tuesday

  const res = await testApp.requestApi.get('/schedule/available').expect(200);
  const body = res.body as Serialized<ScheduleAvailableDto>;

  expect(body.items).toEqual([]);
});
