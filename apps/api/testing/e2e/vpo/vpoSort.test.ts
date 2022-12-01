import { serialize } from '@vpo-help/utils';
import { testApp } from '../../testApp';

test('vpo list can be sorted', async () => {
  const list = [
    await testApp.insertVpo({
      scheduleDate: await testApp.getAvailableDateSlot(2),
    }),
    await testApp.insertVpo({
      scheduleDate: await testApp.getAvailableDateSlot(1),
    }),
    await testApp.insertVpo({
      scheduleDate: await testApp.getAvailableDateSlot(0),
    }),
  ];

  const { body } = await testApp.asUser().requestApiWithAuth((req) =>
    req
      .get(`/vpo`)
      .query({ [`sort[scheduleDate]`]: 'asc' })
      .expect(200),
  );

  expect(body).toEqual({
    items: serialize(list.reverse()),
    totalItems: 3,
  });
});
