import { parse } from 'csv/sync';
import { DEFAULT_CSV_COLUMNS } from '@vpo-help/model';
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

  const parsedList = parse(text);

  const [headerRow] = parsedList;
  expect(headerRow).toHaveLength(DEFAULT_CSV_COLUMNS.length);

  const dataColumns = parsedList.slice(1) as string[][];
  expect(dataColumns).toHaveLength(list.length);

  dataColumns.forEach((row, i) => {
    expect(row).toHaveLength(DEFAULT_CSV_COLUMNS.length);
    const [vpoReferenceNumber, , fullName] = row;
    expect({
      vpoReferenceNumber,
      fullName,
    }).toEqual({
      vpoReferenceNumber: list[i].vpoReferenceNumber,
      fullName: `${list[i].lastName} ${list[i].firstName} ${list[i].middleName}`,
    });
  });
});

test('allows setting csv export columns via query', async () => {
  const list = await testApp.populateVpo(5);

  const { text } = await testApp.asUser().requestApiWithAuth((req) =>
    req
      .get(`/vpo/export`)
      .query({
        columns: `vpoReferenceNumber,vpoIssueDate:Issue Date,fullName:`,
      })
      .buffer()
      .expect(200),
  );

  const parsedList = parse(text);
  const [headerRow] = parsedList;
  expect(headerRow).toEqual(['Номер довідки ВПО', 'Issue Date', 'fullName']);

  const dataColumns = parsedList.slice(1) as string[][];
  dataColumns.forEach((row, i) => {
    expect(row).toHaveLength(3);
    const [vpoReferenceNumber, vpoIssueDate, fullName] = row;
    expect({
      vpoReferenceNumber,
      vpoIssueDate,
      fullName,
    }).toEqual({
      vpoReferenceNumber: list[i].vpoReferenceNumber,
      vpoIssueDate: expectExtended.dateString(),
      fullName: `${list[i].lastName} ${list[i].firstName} ${list[i].middleName}`,
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

  const parsedList = parse(text);
  expect(parsedList).toHaveLength(list.length);
});
