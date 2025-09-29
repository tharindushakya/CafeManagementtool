// ...existing content retained below
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { createApp } from '../../src/index';

const app = createApp();
const specPath = path.resolve(__dirname, '../../../specs/001-description-baseline-specification/contracts/openapi.yaml');

describe('Contract: Devices endpoints (OpenAPI)', () => {
  test('POST /devices/{id}/heartbeat should accept heartbeat payload', async () => {
    const yaml = fs.readFileSync(specPath, 'utf8');
    expect(yaml).toContain('/devices/{id}/heartbeat');

    const deviceId = '00000000-0000-0000-0000-000000000010';
    const body = {
      device_id: deviceId,
      venue_id: '00000000-0000-0000-0000-000000000001',
      status: 'ok',
      last_heartbeat: new Date().toISOString()
    };

    const res = await request(app).post(`/devices/${deviceId}/heartbeat`).send(body);
    expect([200,201]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.status).toBeDefined();
    }
  });
});
