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
    expect(Object.keys(groupedItems).length).toBeGreaterThanOrEqual(2);
  });
});

describe('PUT /schedule', () => {
  test('auth', async () => {
    await testApp.expectAdmin((req) => req.put('/schedule').send({}));
  });

  test('rejects invalid schedule', async () => {
    const { body } = await testApp.asUser().requestApiWithAuth((req) =>
      req
        .put('/schedule')
        .send({
          0: '',
          1: [{}],
        })
        .expect(400),
    );

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "0.each value in nested property 0 must be either object or array",
          "1.0.timeFrom must be longer than or equal to 5 characters",
          "1.0.timeTo must be longer than or equal to 5 characters",
          "1.0.numberOfPersons must not be greater than 10000",
          "1.0.numberOfPersons must not be less than 1",
          "1.0.numberOfPersons must be an integer number",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('updates schedule', async () => {
    const dto = new ScheduleDto({
      5: [
        new ScheduleSlotDto({
          numberOfPersons: 100,
          timeFrom: '16:40',
          timeTo: '17:50',
        }),
      ],
    });

    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.put('/schedule').send(dto).expect(200));

    expect(body).toEqual(serialize(dto));
  });
});
