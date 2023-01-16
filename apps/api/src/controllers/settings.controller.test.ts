import { addDays } from 'date-fns';
import { UpdateSettingsDto } from '@vpo-help/model';
import { expectExtended } from '@vpo-help/testing';
import { serialize } from '@vpo-help/utils';
import { testApp } from '../../testing';

describe('PUT /settings', () => {
  test('auth', async () => {
    await testApp.expectAdmin((req) => req.put('/settings').send({}));
  });

  test('rejects invalid settings', async () => {
    const { body } = await testApp.asUser().requestApiWithAuth((req) =>
      req
        .put('/settings')
        .send({
          daysToNextVpoRegistration: 'foo',
          endOfRegistrationDate: 'bar',
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
          "endOfRegistrationDate must be a Date instance",
          "scheduleDaysAvailable must not be greater than 31",
          "scheduleDaysAvailable must not be less than 1",
          "scheduleDaysAvailable must be an integer number",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('updates settings', async () => {
    const dto = new UpdateSettingsDto({
      daysToNextVpoRegistration: 100,
      endOfRegistrationDate: addDays(new Date(), 60),
      scheduleDaysAvailable: 5,
    });

    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.put('/settings').send(dto).expect(200));

    expect(body).toMatchObject({
      ...serialize(dto),
      prevEndOfRegistrationDate: expectExtended.dateISOString(),
    });
  });
});

describe('GET /settings', () => {
  test('returns common settings', async () => {
    const { body } = await testApp.requestApi.get('/settings').expect(200);

    expect(body).toMatchObject({
      daysToNextVpoRegistration: expect.any(Number),
      endOfRegistrationDate: expectExtended.dateISOString(),
      scheduleDaysAvailable: expect.any(Number),
    });
  });
});
