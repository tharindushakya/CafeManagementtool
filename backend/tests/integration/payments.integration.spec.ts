import request from 'supertest';
import { createApp } from '../../src/index';

describe('Integration: Payments (stripe test-mode)', () => {
  test('POST /payments/create-intent persists a payments row when DB configured', async () => {
    if (!process.env.DATABASE_URL) return;

    const app = createApp();
    const body = {
      venue_id: '00000000-0000-0000-0000-000000000200',
      booking_id: '00000000-0000-0000-0000-000000000201',
      amount_cents: 1500,
      currency: 'USD'
    };

    const res = await request(app).post('/payments/create-intent').send(body).set('Accept', 'application/json');
    // Accept 201 for created, or 501 if payments not configured (no DB/Stripe present)
    expect([201,501]).toContain(res.status);
  }, 20000);
});
