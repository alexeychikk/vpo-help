import { format } from 'date-fns';
import { groupBy } from 'lodash';
import type { ScheduleAvailableDto } from '@vpo-help/model';
import { ScheduleDto, ScheduleSlotDto } from '@vpo-help/model';
import { expectExtended } from '@vpo-help/testing';
import type { Serialized } from '@vpo-help/utils';
import { serialize } from '@vpo-help/utils';
import { testApp } from '../../testing';

describe('GET /schedule', () => {
  test('returns week schedule of help center', async () => {
    const { body } = await testApp.requestApi.get('/schedule').expect(200);

    expect(body).toMatchObject({
      0: [],
      1: [],
      2: expect.arrayContaining([expectExtended.scheduleSlot()]),
      3: expect.arrayContaining([expectExtended.scheduleSlot()]),
      4: expect.arrayContaining([expectExtended.scheduleSlot()]),
      5: [],
      6: [],
    });
  });
});

describe('GET /schedule/available', () => {
  test('returns closest available date-time slots of help center', async () => {
    const res = await testApp.requestApi.get('/schedule/available').expect(200);
    const body = res.body as Serialized<ScheduleAvailableDto>;

    expect(body).toMatchObject({
      items: expect.arrayContaining([
        expect.objectContaining({
          dateFrom: expectExtended.dateISOString(),
          dateTo: expectExtended.dateISOString(),
        }),
      ]),
    });

    const groupedItems = groupBy(body.items, (slot) =>
      format(new Date(slot.dateFrom), 'yyyy-MM-dd'),
    );
    expect(Object.keys(groupedItems).length).toEqual(2);
  });
});

describe('PUT /schedule', () => {
  test('rejects unauthorized user', async () => {
    const { body } = await testApp.requestApi
      .put('/schedule')
      .send({})
      .expect(401);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "message": "Unauthorized",
        "statusCode": 401,
      }
    `);
  });

  test('rejects user with insufficient permissions', async () => {
    const { body } = await testApp
      .asVpo()
      .requestApiWithAuth((req) => req.put('/schedule').send({}).expect(403));

    expect(body).toMatchInlineSnapshot(`
      Object {
        "message": "Forbidden",
        "statusCode": 403,
      }
    `);
  });

  test('rejects invalid schedule', async () => {
    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.put('/schedule').send({}).expect(400));

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "0 must be an array",
          "1 must be an array",
          "2 must be an array",
          "3 must be an array",
          "4 must be an array",
          "5 must be an array",
          "6 must be an array",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('updates schedule', async () => {
    const dto = new ScheduleDto({
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [
        new ScheduleSlotDto({
          numberOfPersons: 100,
          timeFrom: '16:40',
          timeTo: '17:50',
        }),
      ],
      6: [],
    });

    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.put('/schedule').send(dto).expect(200));

    expect(body).toEqual(serialize(dto));
  });
});
