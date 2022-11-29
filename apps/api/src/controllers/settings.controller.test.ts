import { SettingsDto } from '@vpo-help/model';
import { expectExtended } from '@vpo-help/testing';
import { serialize } from '@vpo-help/utils';
import { testApp } from '../../testing';

describe('PUT /settings', () => {
  test('rejects unauthorized user', async () => {
    const { body } = await testApp.requestApi
      .put('/settings')
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
      .requestApiWithAuth((req) => req.put('/settings').send({}).expect(403));

    expect(body).toMatchInlineSnapshot(`
      Object {
        "message": "Forbidden",
        "statusCode": 403,
      }
    `);
  });

  test('rejects invalid settings', async () => {
    const { body } = await testApp.asUser().requestApiWithAuth((req) =>
      req
        .put('/settings')
        .send({
          daysToNextVpoRegistration: 'foo',
          endOfWarDate: 'bar',
          scheduleDaysAvailable: 'baz',
          invalid: 'setting',
        })
        .expect(400),
    );

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "daysToNextVpoRegistration must not be less than 1",
          "daysToNextVpoRegistration must be an integer number",
          "endOfWarDate must be a Date instance",
          "scheduleDaysAvailable must not be greater than 31",
          "scheduleDaysAvailable must not be less than 1",
          "scheduleDaysAvailable must be an integer number",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('updates settings', async () => {
    const dto = new SettingsDto({
      daysToNextVpoRegistration: 100,
      endOfWarDate: new Date('2023-01-01'),
      scheduleDaysAvailable: 5,
    });

    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.put('/settings').send(dto).expect(200));

    expect(body).toEqual(serialize(dto));
  });
});

describe('GET /settings', () => {
  test('rejects unauthorized user', async () => {
    const { body } = await testApp.requestApi.get('/settings').expect(401);

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
      .requestApiWithAuth((req) => req.get('/settings').expect(403));

    expect(body).toMatchInlineSnapshot(`
      Object {
        "message": "Forbidden",
        "statusCode": 403,
      }
    `);
  });

  test('returns common settings', async () => {
    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.get('/settings').expect(200));

    expect(body).toMatchObject({
      daysToNextVpoRegistration: expect.any(Number),
      endOfWarDate: expectExtended.dateISOString(),
      scheduleDaysAvailable: expect.any(Number),
    });
  });
});
