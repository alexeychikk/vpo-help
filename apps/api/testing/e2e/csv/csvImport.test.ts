import { sortBy } from 'lodash';
import { testApp } from '../../testApp';

test('auth', async () => {
  await testApp.expectAdmin((req) => req.post(`/vpo/import`));
});

test('updates multiple vpo-s from a csv file', async () => {
  const list = sortBy(await testApp.populateVpo(8), 'vpoReferenceNumber');

  const file = Buffer.from(
    `vpoReferenceNumber,date,aid kits,щось смачненьке,guns
${list[0].vpoReferenceNumber},01.01.2022
${list[1].vpoReferenceNumber},02.01.2022,3
${list[2].vpoReferenceNumber},03.01.2022,4,5
${list[3].vpoReferenceNumber},05.01.2022,6,,7
${list[4].vpoReferenceNumber},06.01.2022,8,9,10
${list[5].vpoReferenceNumber},07.01.2022,oops,,11
${list[6].vpoReferenceNumber},08.01.2022,oops,,12,13,14
${list[7].vpoReferenceNumber}
vpo_invalid,09.01.2022
,10.01.2022
`,
  );

  const { body } = await testApp
    .asUser()
    .requestApiWithAuth((req) =>
      req
        .post(`/vpo/import`)
        .attach('file', file, 'vpo_import.csv')
        .expect(200),
    );

  expect(body).toEqual({
    total: 10,
    processed: 8,
    failed: ['9:vpo_invalid', '10:'],
  });

  const updatedList = await testApp.vpoService.vpoRepository.find({
    order: { vpoReferenceNumber: 1 },
  });

  updatedList.slice(0, 8).forEach((vpo) => {
    expect(vpo.receivedHelpDate).toBeInstanceOf(Date);
  });
  updatedList.slice(1, 7).forEach((vpo) => {
    expect(vpo.receivedGoods?.length).toBeGreaterThan(0);
  });
  expect(updatedList[6].receivedGoods).toEqual([
    { name: 'aid kits', amount: 0 },
    { name: 'щось смачненьке', amount: 0 },
    { name: 'guns', amount: 12 },
    { name: 'unknown_5', amount: 13 },
    { name: 'unknown_6', amount: 14 },
  ]);
});
