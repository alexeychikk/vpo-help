import { serialize } from '@vpo-help/utils';
import { testApp } from '../../testApp';

test('vpo list can be paginated', async () => {
  const list = [
    await testApp.insertVpo(),
    await testApp.insertVpo(),
    await testApp.insertVpo(),
    await testApp.insertVpo(),
  ];

  const { body } = await testApp
    .asUser()
    .requestApiWithAuth((req) =>
      req.get(`/vpo`).query({ page: 2, limit: 2 }).expect(200),
    );

  expect(body).toEqual({
    items: serialize(list.slice(2)),
    totalItems: 4,
  });
});
