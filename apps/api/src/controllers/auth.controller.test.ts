import { expectExtended } from '@vpo-help/testing';
import { TEST_PASSWORD, TestApp } from '../../testing';

describe('POST /login', () => {
  test('rejects invalid body', async () => {
    const { body } = await TestApp.requestApi
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
    const user = await TestApp.asUser().getCurrentUser();

    const { body } = await TestApp.requestApi
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
    const user = await TestApp.asUser().getCurrentUser();

    const { body } = await TestApp.requestApi
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
