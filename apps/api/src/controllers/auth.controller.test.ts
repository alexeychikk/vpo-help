import { expectExtended } from '@vpo-help/testing';
import { TEST_PASSWORD, testApp } from '../../testing';

describe('POST /auth/login', () => {
  test('rejects invalid body', async () => {
    const { body } = await testApp.requestApi
      .post('/auth/login')
      .send({})
      .expect(400);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "email must be an email",
          "password must be longer than or equal to 5 characters",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('rejects invalid password', async () => {
    const user = await testApp.asUser().getCurrentUser();

    const { body } = await testApp.requestApi
      .post('/auth/login')
      .send({
        email: user.email,
        password: `invalid_password`,
      })
      .expect(401);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "message": "Unauthorized",
        "statusCode": 401,
      }
    `);
  });

  test('authenticates successfully', async () => {
    const user = await testApp.asUser().getCurrentUser();

    const { body } = await testApp.requestApi
      .post('/auth/login')
      .send({ email: user.email, password: TEST_PASSWORD })
      .expect(200);

    expect(body).toMatchObject({
      accessToken: {
        access_token: expectExtended.accessToken(),
      },
      permissions: expect.any(Object),
      user: {
        ...expectExtended.model(),
        email: user.email,
        role: user.role,
      },
    });
  });
});

describe('POST /auth/login/vpo', () => {
  test('rejects invalid body', async () => {
    const { body } = await testApp.requestApi
      .post('/auth/login/vpo')
      .send({})
      .expect(400);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "vpoReferenceNumber must match /^\\\\d{4}-\\\\d{10}$/i regular expression",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('rejects inexistent vpo reference number', async () => {
    const { body } = await testApp.requestApi
      .post('/auth/login/vpo')
      .send({
        vpoReferenceNumber: '0000-0000000000',
      })
      .expect(404);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "message": "Not Found",
        "statusCode": 404,
      }
    `);
  });

  test('authenticates successfully', async () => {
    const vpo = await testApp.asVpo().getCurrentVpoUser();

    const { body } = await testApp.requestApi
      .post('/auth/login/vpo')
      .send({ vpoReferenceNumber: vpo.vpoReferenceNumber })
      .expect(200);

    expect(body).toMatchObject({
      accessToken: {
        access_token: expectExtended.accessToken(),
      },
      permissions: expect.any(Object),
      user: {
        ...expectExtended.model(),
        role: vpo.role,
        scheduleDate: vpo.scheduleDate,
        vpoReferenceNumber: vpo.vpoReferenceNumber,
      },
    });
  });
});
