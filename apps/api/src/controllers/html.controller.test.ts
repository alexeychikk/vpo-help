import { HtmlPageModel, UpdateHtmlPageDto } from '@vpo-help/model';
import { expectExtended } from '@vpo-help/testing';
import { serialize } from '@vpo-help/utils';
import { testApp } from '../../testing';

describe('POST /html', () => {
  test('auth', async () => {
    await testApp.expectAdmin((req) => req.post('/html').send({}));
  });

  test('rejects invalid body', async () => {
    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.post('/html').send({}).expect(400));

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "name must be longer than or equal to 1 characters",
          "name must match /^[0-9A-Z-_]+$/i regular expression",
          "content must be an object",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('creates html page data', async () => {
    const dto = new HtmlPageModel({
      name: 'foo-bar',
      content: {
        foo: '<div>bar</div>',
      },
    });

    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.post('/html').send(dto).expect(201));

    expect(body).toEqual({
      ...serialize(dto),
      ...expectExtended.model(),
    });
  });
});

describe('GET /html/:name', () => {
  test('returns html page data by name', async () => {
    const page = await testApp.createHtmlPage();

    const { body } = await testApp.requestApi
      .get(`/html/${page.name}`)
      .expect(200);

    expect(body).toEqual(serialize(page));
  });
});

describe('PUT /html/:name', () => {
  test('auth', async () => {
    await testApp.expectAdmin((req) => req.put('/html/foo').send({}));
  });

  test('rejects invalid body', async () => {
    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) => req.put('/html/foo').send({}).expect(400));

    expect(body).toMatchInlineSnapshot(`
      Object {
        "error": "Bad Request",
        "message": Array [
          "content must be an object",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('updates html page data', async () => {
    const page = await testApp.createHtmlPage();

    const dto = new UpdateHtmlPageDto({
      content: { foo: 'bar ' },
    });

    const { body } = await testApp
      .asUser()
      .requestApiWithAuth((req) =>
        req.put(`/html/${page.name}`).send(dto).expect(200),
      );

    expect(body).toEqual({
      ...serialize(page),
      ...dto,
    });
  });
});

describe('DELETE /html/:name', () => {
  test('auth', async () => {
    await testApp.expectAdmin((req) => req.delete('/html/foo'));
  });

  test('rejects invalid page name', async () => {
    await testApp
      .asUser()
      .requestApiWithAuth((req) => req.delete('/html/foo').expect(404));
  });

  test('deletes html page data', async () => {
    const page = await testApp.createHtmlPage();

    await testApp
      .asUser()
      .requestApiWithAuth((req) =>
        req.delete(`/html/${page.name}`).expect(200),
      );
  });
});
