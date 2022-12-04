import { parse } from 'csv/sync';
import { testApp } from '../../testApp';

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
  const dataColumns = parsedList.slice(1) as string[][];
  dataColumns.forEach((row, i) => {
    expect(row).toHaveLength(12);
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
