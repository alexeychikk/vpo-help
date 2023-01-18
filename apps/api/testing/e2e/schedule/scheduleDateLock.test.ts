import { advanceTo } from 'jest-date-mock';
import { times } from 'lodash';
import { ScheduleDto } from '@vpo-help/model';
import { testApp } from '../../testApp';

test('registering multiple accounts on the same time slot', async () => {
  await testApp.settingsService.updateCommonSettings({
    startOfRegistrationDate: new Date('2022-11-27'),
    endOfRegistrationDate: new Date('2022-11-30'),
  });
  advanceTo(new Date('2022-11-27')); // Sunday

  await testApp.settingsService.updateSchedule(
    new ScheduleDto({
      0: [{ timeFrom: '13:00', timeTo: '14:00', numberOfPersons: 2 }],
      1: [{ timeFrom: '15:00', timeTo: '16:00', numberOfPersons: 2 }],
    }),
  );

  const scheduleDateSunday = await testApp.getAvailableDateSlot();
  const scheduleDateMonday = await testApp.getAvailableDateSlot(1);

  const vpos = await Promise.all([
    ...times(5, () =>
      testApp
        .registerVpo({ scheduleDate: scheduleDateSunday })
        .catch(() => undefined),
    ),
    ...times(5, () =>
      testApp
        .registerVpo({ scheduleDate: scheduleDateMonday })
        .catch(() => undefined),
    ),
  ]);

  expect(vpos.filter(Boolean).length).toEqual(4);
});
