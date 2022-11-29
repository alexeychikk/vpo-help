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
        id: expectExtended.objectId(),
        createdAt: expectExtended.dateISOString(),
        updatedAt: expectExtended.dateISOString(),
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
          "vpoReferenceNumber must be longer than or equal to 3 characters",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('rejects invalid vpo reference number', async () => {
    const { body } = await testApp.requestApi
      .post('/auth/login/vpo')
      .send({
        vpoReferenceNumber: 'invalid_reference',
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
    const vpo = await testApp.asVpo().getCurrentVpo();

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
        id: expectExtended.objectId(),
        createdAt: expectExtended.dateISOString(),
        updatedAt: expectExtended.dateISOString(),
        role: vpo.role,
        scheduleDate: vpo.scheduleDate,
        vpoReferenceNumber: vpo.vpoReferenceNumber,
      },
    });
  });
});
