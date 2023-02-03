import { format as formatDate } from 'date-fns';
import { sortBy } from 'lodash';
import type { VpoModel } from '@vpo-help/model';
import { CSV_COLUMN_KEYS } from '@vpo-help/model';
import { testApp } from '../../testApp';

test('auth', async () => {
  await testApp.expectAdmin((req) => req.post(`/vpo/import`));
});

test('updates multiple vpo-s from a csv file', async () => {
  const vpos = sortBy(await testApp.populateVpo(8), ['vpoReferenceNumber']);
  const newVpo = testApp.getFakeVpoRaw({
    vpoReferenceNumber: '9999-9999999999',
  });
  const newVpoRow = vpoToCsvRow(newVpo);
  const getVpoRow = (index: number) => vpoToCsvRow(vpos[index]);

  // updating fields of vpo#1
  const vpo1UpdatedFields = {
    firstName: 'Foo',
    lastName: 'Bar',
    middleName: 'Baz',
    dateOfBirth: new Date('1995-02-12T22:00:00.000Z'),
    phoneNumber: '+380978888888',
    taxIdNumber: '1234567890',
    email: 'vpo@happyold.com',
    addressOfRegistration: 'Луганськ',
    addressOfResidence: 'Київ',
    numberOfRelatives: 3,
    numberOfRelativesBelow16: 2,
    numberOfRelativesAbove65: 1,
  };
  Object.assign(vpos[1], vpo1UpdatedFields);

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

  expect(body).toMatchInlineSnapshot(`
    Object {
      "failed": Object {
        "10": Object {
          "e": "email must be an email,phoneNumber must be a valid phone number,taxIdNumber must match /^\\\\d{7,20}$/i regular expression,vpoReferenceNumber must match /^\\\\d{4}-\\\\d{10}$/i regular expression,firstName must be longer than or equal to 1 characters,lastName must be longer than or equal to 1 characters,middleName must be longer than or equal to 1 characters,dateOfBirth must be a Date instance,addressOfRegistration must be longer than or equal to 1 characters,addressOfResidence must be longer than or equal to 1 characters,scheduleDate must be a Date instance,receivedHelpDate must be a Date instance",
          "v": "vpo_invalid",
        },
        "11": Object {
          "e": "Not Found",
          "v": "",
        },
      },
      "processed": 9,
      "total": 11,
    }
  `);

  const updatedList = await testApp.vpoService.vpoRepository.find({
    order: { vpoReferenceNumber: 1 },
  });

  updatedList.slice(0, 9).forEach((vpo) => {
    expect(vpo.receivedHelpDate).toBeInstanceOf(Date);
  });
  updatedList.slice(1, 7).forEach((vpo) => {
    expect(vpo.receivedGoods?.length).toBeGreaterThan(0);
  });
  expect(updatedList[1]).toMatchObject(vpo1UpdatedFields);
  expect(updatedList[6].receivedGoods).toEqual([
    { name: 'aid kits', amount: 0 },
    { name: 'щось смачненьке', amount: 0 },
    { name: 'guns', amount: 12 },
    { name: 'unknown_3', amount: 13 },
    { name: 'unknown_4', amount: 14 },
  ]);
  expect(updatedList[7].receivedHelpDate).toEqual(vpos[7].scheduleDate);
  expect(updatedList[8]).toMatchObject({
    ...newVpo,
    dateOfBirth: expect.any(Date),
    scheduleDate: expect.any(Date),
    receivedHelpDate: expect.any(Date),
    vpoIssueDate: expect.any(Date),
  });
});

function vpoToCsvRow(vpo: Partial<VpoModel>): string {
  return CSV_COLUMN_KEYS.slice(0, -1)
    .map((col) => {
      const value = vpo[col as keyof typeof vpo];
      if (value instanceof Date) {
        return col === 'scheduleDate'
          ? formatDate(value, 'dd.MM.yyyy HH:mm')
          : formatDate(value, 'dd.MM.yyyy');
      }
      return value;
    })
    .join(',');
}
