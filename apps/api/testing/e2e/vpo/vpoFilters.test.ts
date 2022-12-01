import { SearchType } from '@vpo-help/model';
import { serialize } from '@vpo-help/utils';
import { testApp } from '../../testApp';

test('vpo list supports min and max filters', async () => {
  const list = [
    await testApp.insertVpo({ receivedHelpDate: new Date('2022-09-01') }),
    await testApp.insertVpo({ receivedHelpDate: new Date('2022-10-01') }),
    await testApp.insertVpo({ receivedHelpDate: new Date('2022-12-01') }),
    await testApp.insertVpo({ receivedHelpDate: new Date('2022-11-01') }),
  ];

  const { body } = await testApp.asUser().requestApiWithAuth((req) =>
    req
      .get(`/vpo`)
      .query({
        [`min[receivedHelpDate]`]: new Date('2022-10-01').toISOString(),
        [`max-[receivedHelpDate]`]: new Date('2022-11-01').toISOString(),
      })
      .expect(200),
  );

  expect(body).toEqual({
    items: serialize([list[1], list[3]]),
    totalItems: 2,
  });
});

test('complex vpo list filters', async () => {
  const list = await Promise.all([
    testApp.insertVpo({ vpoReferenceNumber: 'vpo_001' }),
    testApp.insertVpo({
      vpoReferenceNumber: 'vpo_002',
      receivedHelpDate: new Date('2022-09-01'),
    }),
    testApp.insertVpo({
      vpoReferenceNumber: 'vpo_003',
      receivedHelpDate: new Date('2022-10-01'),
    }),
    testApp.insertVpo({
      vpoReferenceNumber: 'vpo_004',
      receivedHelpDate: new Date('2022-11-01'),
    }),
    testApp.insertVpo({
      vpoReferenceNumber: 'vpo_105',
      receivedHelpDate: new Date('2022-11-01'),
    }),
    testApp.insertVpo({
      vpoReferenceNumber: 'vpo_006',
      receivedHelpDate: new Date('2022-11-01'),
    }),
  ]);

  const { body } = await testApp.asUser().requestApiWithAuth((req) =>
    req
      .get(`/vpo`)
      .query({
        q: JSON.stringify({ vpoReferenceNumber: 'vpo_00' }),
        qType: SearchType.Partial,
        [`min-[receivedHelpDate]`]: new Date('2022-10-01').toISOString(),
        [`sort[vpoReferenceNumber]`]: 'desc',
      })
      .expect(200),
  );

  expect(body).toEqual({
    items: serialize([list[5], list[3], list[2], list[0]]),
    totalItems: 4,
  });
});
