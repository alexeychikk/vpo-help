import faker from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { expectExtended, testApp } from '@vpo-help/testing';

describe('POST /login', () => {
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
        ],
        "statusCode": 400,
      }
    `);
  });

  test('creates new user for new email', async () => {
    const email = faker.internet.email(new ObjectId().toString());
    const { body } = await testApp.requestApi
      .post('/auth/login')
      .send({ email })
      .expect(200);

    expect(body).toMatchObject({
      accessToken: {
        access_token: expectExtended.accessToken(),
      },
      user: {
        id: expectExtended.objectId(),
        email,
        createdAt: expectExtended.dateISOString(),
        updatedAt: expectExtended.dateISOString(),
      },
    });
  });

  test('returns existing user for existing email', async () => {
    const user = await testApp.asNewUser().getCurrentUser();

    const { body } = await testApp.requestApi
      .post('/auth/login')
      .send({ email: user.email })
      .expect(200);

    expect(body).toMatchObject({
      accessToken: {
        access_token: expectExtended.accessToken(),
      },
      user,
    });
  });
});
