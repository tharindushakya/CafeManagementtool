import request from 'supertest';
import { createApp } from '../../src/index';

describe('Booking controller (unit)', () => {
  test('POST /bookings returns 201 with booking body', async () => {
    const app = createApp();
    const resp = await request(app)
      .post('/bookings')
      .send({ user_id: 'u1', venue_id: 'v1' })
      .set('Accept', 'application/json');
    expect(resp.status).toBe(201);
    expect(resp.body).toHaveProperty('booking');
    expect(resp.body.booking).toHaveProperty('id');
    expect(resp.body.booking).toHaveProperty('venue_id', 'v1');
  });
});
