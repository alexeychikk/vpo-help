import { parse as parseCsv } from 'csv/sync';
import { format as formatDate } from 'date-fns';
import { CSV_COLUMN_KEYS } from '@vpo-help/model';
import { testApp } from '../../testApp';

test('auth', async () => {
  await testApp.expectAdmin((req) => req.post(`/vpo/import`));
});

test('updates multiple vpo-s from a csv file', async () => {
  await testApp.populateVpo(8);
  const newVpo = testApp.getFakeVpoRaw({
    vpoReferenceNumber: '9999-9999999999',
  });
  const newVpoRow = CSV_COLUMN_KEYS.slice(0, -1)
    .map((col) => {
      const value = newVpo[col as keyof typeof newVpo];
      if (value instanceof Date) {
        return col === 'scheduleDate'
          ? formatDate(value, 'dd.MM.yyyy HH:mm')
          : formatDate(value, 'dd.MM.yyyy');
      }
      return value;
    })
    .join(',');

  const { text } = await testApp
    .asUser()
    .requestApiWithAuth((req) =>
      req.get(`/vpo/export?sort[vpoReferenceNumber]=asc`).buffer(),
    );
  const parsedList = parseCsv(text).slice(1);

  const getVpoRow = (index: number) => parsedList[index].slice(0, -1).join(',');

  const file = Buffer.from(
    `${CSV_COLUMN_KEYS.join(',')},aid kits,щось смачненьке,guns
${getVpoRow(0)},01.01.2022
${getVpoRow(1)},02.01.2022,3
${getVpoRow(2)},03.01.2022,4,5
${getVpoRow(3)},05.01.2022,6,,7
${getVpoRow(4)},06.01.2022,8,9,10
${getVpoRow(5)},07.01.2022,oops,,11
${getVpoRow(6)},08.01.2022,oops,,12,13,14
${getVpoRow(7)}
vpo_invalid,09.01.2022
,10.01.2022
${newVpoRow},11.01.2022
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
    total: 11,
    processed: 9,
    failed: ['9:vpo_invalid', '10:'],
  });

  const updatedList = await testApp.vpoService.vpoRepository.find({
    order: { vpoReferenceNumber: 1 },
  });

  updatedList.slice(0, 9).forEach((vpo) => {
    expect(vpo.receivedHelpDate).toBeInstanceOf(Date);
  });
  updatedList.slice(1, 7).forEach((vpo) => {
    expect(vpo.receivedGoods?.length).toBeGreaterThan(0);
  });
  expect(updatedList[6].receivedGoods).toEqual([
    { name: 'aid kits', amount: 0 },
    { name: 'щось смачненьке', amount: 0 },
    { name: 'guns', amount: 12 },
    { name: 'unknown_3', amount: 13 },
    { name: 'unknown_4', amount: 14 },
  ]);
  expect(updatedList[8]).toMatchObject({
    ...newVpo,
    dateOfBirth: expect.any(Date),
    scheduleDate: expect.any(Date),
    receivedHelpDate: expect.any(Date),
    vpoIssueDate: expect.any(Date),
  });
});
