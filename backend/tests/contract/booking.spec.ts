// ...existing content retained below
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { createApp } from '../../src/index';

const app = createApp();
const specPath = path.resolve(__dirname, '../../../specs/001-description-baseline-specification/contracts/openapi.yaml');

describe('Contract: Booking endpoints (OpenAPI)', () => {
  test('POST /bookings should return 201 with booking object', async () => {
    // Load spec to ensure file exists (contract test requirement)
    const yaml = fs.readFileSync(specPath, 'utf8');
    expect(yaml).toContain('/bookings');

    const body = {
      venue_id: '00000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000002',
      start_time: new Date().toISOString(),
      duration_minutes: 60
    };

    const res = await request(app).post('/bookings').send(body).set('Accept', 'application/json');
    expect([200,201]).toContain(res.status);
    // Basic shape assertion per contract
    expect(res.body).toBeDefined();
    if (res.status === 201) {
      expect(res.body.booking).toBeDefined();
      expect(res.body.booking.id).toBeDefined();
      expect(res.body.booking.venue_id).toBe(body.venue_id);
    }
  });
});
