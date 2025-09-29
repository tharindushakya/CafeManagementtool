export interface Booking {
  id: string; // uuid
  venue_id: string; // uuid
  user_id: string;
  device_id?: string;
  state: 'reserved' | 'active' | 'completed' | 'cancelled';
  starts_at?: string;
  ends_at?: string;
  created_at: string;
  updated_at?: string;
}

export const bookingFromRow = (r: any): Booking => ({
  id: r.id,
  venue_id: r.venue_id,
  user_id: r.user_id,
  device_id: r.device_id,
  // DB column is `status` while model calls it `state`
  state: r.status,
  // DB columns are start_time / end_time; map to starts_at / ends_at in the model
  starts_at: r.start_time,
  ends_at: r.end_time,
  created_at: r.created_at,
  updated_at: r.updated_at,
});
