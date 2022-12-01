import { serialize } from '@vpo-help/utils';
import { testApp } from '../../testApp';

test('vpo list can be searched', async () => {
  const list = [
    await testApp.insertVpo({ vpoReferenceNumber: 'VPO foo' }),
    await testApp.insertVpo(),
    await testApp.insertVpo({ addressOfRegistration: 'foo bar street' }),
    await testApp.insertVpo(),
  ];

  const { body } = await testApp
    .asUser()
    .requestApiWithAuth((req) =>
      req.get(`/vpo`).query({ q: 'foo' }).expect(200),
    );

  expect(body).toEqual({
    items: serialize([list[0], list[2]]),
    totalItems: 2,
  });
});
