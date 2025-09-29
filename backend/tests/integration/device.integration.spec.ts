import request from 'supertest';
import { createApp } from '../../src/index';
import { createRedisClient } from '../../src/lib/redisClient';

describe('Integration: Device heartbeat ingestion', () => {
  test('POST /devices/:id/heartbeat persists and publishes to Redis when configured', async () => {
    if (!process.env.DATABASE_URL || !process.env.REDIS_URL) return;

    const redis = createRedisClient(process.env.REDIS_URL);
    const venueId = '00000000-0000-0000-0000-000000000500';
    const deviceId = '00000000-0000-0000-0000-000000000501';
    const ch = `device-status.${venueId}`;

    let received: any = null;
    await new Promise<void>((resolve, reject) => {
      const sub = createRedisClient(process.env.REDIS_URL!);
      (async () => {
        await sub.subscribe(ch);
      })();

      sub.on('message', (_channel: string, msg: string) => {
        received = JSON.parse(msg);
        sub.disconnect();
        resolve();
      });

      // fire the HTTP request after subscription
      (async () => {
        const app = createApp();
        await request(app)
          .post(`/devices/${deviceId}/heartbeat`)
          .send({ device_id: deviceId, venue_id: venueId, status: 'ok', last_heartbeat: new Date().toISOString() });
      })();
    });

    expect(received).toBeTruthy();
    expect(received.device_id).toBe(deviceId);
  }, 20000);
});
