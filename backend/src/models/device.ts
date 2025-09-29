export interface Device {
  id: string; // uuid
  venue_id: string; // uuid
  name?: string;
  status: 'online' | 'offline' | 'unknown';
  last_heartbeat?: string; // ISO
  created_at: string;
  updated_at?: string;
}

export const deviceFromRow = (r: any): Device => ({
  id: r.id,
  venue_id: r.venue_id,
  name: r.name,
  status: r.status,
  last_heartbeat: r.last_heartbeat,
  created_at: r.created_at,
  updated_at: r.updated_at,
});
