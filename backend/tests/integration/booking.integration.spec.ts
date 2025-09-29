import request from 'supertest';
import { createApp } from '../../src/index';

describe('Integration: Booking endpoints (DB-backed)', () => {
  test('POST /bookings persists to DB when DATABASE_URL set', async () => {
    if (!process.env.DATABASE_URL) {
      // Skip integration test when no DB available
      return;
    }

    const app = createApp();
    const body = {
      venue_id: '00000000-0000-0000-0000-000000000100',
      user_id: '00000000-0000-0000-0000-000000000101',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600 * 1000).toISOString(),
      idempotency_key: `test-${Date.now()}`
    };

    const res = await request(app).post('/bookings').send(body).set('Accept', 'application/json');
    expect([200,201]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body.booking).toBeDefined();
      expect(res.body.booking.venue_id).toBe(body.venue_id);
    }
  }, 20000);
});
