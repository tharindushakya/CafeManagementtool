import { DbClient } from './db';
import { Device } from '../models/device';

export class DeviceRepository {
  constructor(private db: DbClient) {}

  async upsertHeartbeat(deviceId: string, venueId: string, nowIso: string): Promise<void> {
    const q = `UPDATE devices SET last_heartbeat = $1, status = 'online', updated_at = $1 WHERE id = $2 AND venue_id = $3`;
    await this.db.query(q, [nowIso, deviceId, venueId]);
  }

  async findById(id: string): Promise<Device | null> {
    const q = 'SELECT * FROM devices WHERE id = $1 LIMIT 1';
    const res = await this.db.query(q, [id]);
    return res.rows[0] ?? null;
  }
}
