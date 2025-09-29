import express from 'express';
import { Request, Response } from 'express';
import { DeviceRepository } from '../../repositories/deviceRepository';
import { PgClient } from '../../repositories/pgClient';
import { createRedisClient } from '../../lib/redisClient';

export function createDeviceRouter() {
  const router = express.Router();

  // Use DB-backed repo if DATABASE_URL present, otherwise use NotImplementedDb via import in repo
  const dbUrl = process.env.DATABASE_URL;
  const repo = dbUrl ? new DeviceRepository(new PgClient(dbUrl)) : new DeviceRepository({ query: async () => ({ rows: [], rowCount: 0 }) });

  const redisUrl = process.env.REDIS_URL;
  const redis = redisUrl ? createRedisClient(redisUrl) : null;

  router.post('/devices/:id/heartbeat', async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body || {};
    const nowIso = payload.last_heartbeat || new Date().toISOString();
    const venueId = payload.venue_id;

    try {
      if (venueId) {
        await repo.upsertHeartbeat(id, venueId, nowIso);
      }

      if (redis && venueId) {
        const ch = `device-status.${venueId}`;
        await redis.publish(ch, JSON.stringify({ device_id: id, status: payload.status || 'ok', last_heartbeat: nowIso }));
      }

      res.status(200).json({ device_id: id, status: payload.status || 'ok' });
    } catch (err: any) {
      console.error('heartbeat failed', err);
      res.status(500).json({ error: 'heartbeat_failed' });
    }
  });

  return router;
}

export default createDeviceRouter;
