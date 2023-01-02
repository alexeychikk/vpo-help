import { testApp } from '../../testing';

describe('GET /health', () => {
  test('returns health check status', async () => {
    const { body } = await testApp.requestApi.get(`/health`).expect(200);

    expect(body).toEqual({
      status: 'ok',
      info: {
        database: { status: 'up' },
        memory: { status: 'up' },
      },
      error: {},
      details: {
        database: { status: 'up' },
        memory: { status: 'up' },
      },
    });
  });
});
