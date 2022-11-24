import { testApp } from '@vpo-help/testing';

describe('GET /users/:id', () => {
  test('rejects unauthorized request', async () => {
    const { body } = await testApp.requestApi
      .get('/users/123')
      .auth('not_valid_token', { type: 'bearer' })
      .expect(401);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "message": "Unauthorized",
        "statusCode": 401,
      }
    `);
  });

  test('rejects invalid user id', async () => {
    const { body } = await testApp.requestApiAsUser((req) =>
      req.get('/users/123').expect(400),
    );
    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "id must be a mongodb id",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('returns error if user is not found', async () => {
    const { body } = await testApp.requestApiAsUser((req) =>
      req.get('/users/111111111111111111111111').expect(404),
    );
    expect(body).toMatchInlineSnapshot(`
      Object {
        "message": "Not Found",
        "statusCode": 404,
      }
    `);
  });

  test('returns user by id', async () => {
    const user = await testApp.asNewUser().getCurrentUser();

    const { body } = await testApp.requestApiAsUser((req) =>
      req.get(`/users/${user.id}`).expect(200),
    );
    expect(body).toMatchObject(user);
  });
});
