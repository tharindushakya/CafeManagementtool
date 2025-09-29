import request from 'supertest';
import express from 'express';
import createConsoleRouter from '../../src/services/console';

describe('console QR link flow', () => {
  let app: express.Express;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', createConsoleRouter());
  });

  test('POST /consoles/link then GET /consoles/link/:token', async () => {
    const token = `qr-${Date.now()}`;
    const userId = 'user-qr-1';

    const postRes = await request(app).post('/consoles/link').send({ token, userId });
    expect(postRes.status).toBe(200);
    expect(postRes.body).toHaveProperty('linked', true);

    const getRes = await request(app).get(`/consoles/link/${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty('linked', true);
    expect(getRes.body.userId).toBe(userId);
  });
});
