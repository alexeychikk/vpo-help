import { parse as parseCsv } from 'csv/sync';
import { pick } from 'lodash';
import { CSV_COLUMN_KEYS, DEFAULT_CSV_COLUMNS } from '@vpo-help/model';
import { expectExtended } from '@vpo-help/testing';
import { testApp } from '../../testApp';

test('auth', async () => {
  await testApp.expectAdmin((req) => req.get(`/vpo/export`));
});

test('exports a list of vpo-s to a csv file', async () => {
  const list = await testApp.populateVpo(10);

  const { text } = await testApp.asUser().requestApiWithAuth((req) =>
    req
      .get(`/vpo/export`)
      .buffer()
      .expect(200)
      .expect('Content-Type', 'text/csv')
      .expect('Content-Disposition', /^attachment; filename="(.+)\.csv"$/),
  );

  const parsedList = parseCsv(text, {
    columns: CSV_COLUMN_KEYS,
  });

  const [headerRow] = parsedList;
  expect(Object.values(headerRow)).toHaveLength(DEFAULT_CSV_COLUMNS.length);

  const dataColumns = parsedList.slice(1) as string[][];
  expect(dataColumns).toHaveLength(list.length);

  dataColumns.forEach((row, i) => {
    expect(Object.values(row)).toHaveLength(DEFAULT_CSV_COLUMNS.length);
    expect(row).toMatchObject(
      pick(list[i], [
        'vpoReferenceNumber',
        'email',
        'firstName',
        'lastName',
        'middleName',
      ]),
    );
  });
});

test('allows setting csv export columns via query', async () => {
  const list = await testApp.populateVpo(5);

  const { text } = await testApp.asUser().requestApiWithAuth((req) =>
    req
      .get(`/vpo/export`)
      .query({
        columns: `vpoReferenceNumber,vpoIssueDate:Issue Date,lastName:`,
      })
      .buffer()
      .expect(200),
  );

  const parsedList = parseCsv(text);
  const [headerRow] = parsedList;
  expect(headerRow).toEqual(['Номер довідки ВПО', 'Issue Date', 'lastName']);

  const dataColumns = parsedList.slice(1) as string[][];
  dataColumns.forEach((row, i) => {
    expect(row).toHaveLength(3);
    const [vpoReferenceNumber, vpoIssueDate, lastName] = row;
    expect({
      vpoReferenceNumber,
      vpoIssueDate,
      lastName,
    }).toEqual({
      vpoReferenceNumber: list[i].vpoReferenceNumber,
      vpoIssueDate: expectExtended.dateString(),
      lastName: list[i].lastName,
    });
  });
});

test('allows setting csv export header via query', async () => {
  const list = await testApp.populateVpo(5);

  const { text } = await testApp.asUser().requestApiWithAuth((req) =>
    req
      .get(`/vpo/export`)
      .query({
        header: '', // to remove header
      })
      .buffer()
      .expect(200),
  );

  const parsedList = parseCsv(text);
  expect(parsedList).toHaveLength(list.length);
});
