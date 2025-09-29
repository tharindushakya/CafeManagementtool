import { DbClient } from './db';
import { Booking } from '../models/booking';

type CreateBookingInput = {
  venue_id: string;
  user_id?: string;
  device_id?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  idempotency_key?: string;
};

export class BookingRepository {
  constructor(private db: DbClient) {}

  // Create booking with idempotency handling. If idempotency_key is provided and a booking
  // with the same key exists, return that booking instead of creating a duplicate.
  async create(b: CreateBookingInput): Promise<Booking> {
    // Simple idempotency handling
    if (b.idempotency_key) {
      const existing = await this.db.query('SELECT * FROM bookings WHERE idempotency_key = $1 LIMIT 1', [b.idempotency_key]);
      if (existing.rows.length > 0) {
        return existing.rows[0] as Booking;
      }
    }

    const q = `INSERT INTO bookings (venue_id, user_id, device_id, start_time, end_time, status, idempotency_key)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const params = [b.venue_id, b.user_id, b.device_id, b.start_time, b.end_time, b.status ?? 'reserved', b.idempotency_key];
    const res = await this.db.query(q, params);
    return res.rows[0] as Booking;
  }

  async findById(id: string): Promise<Booking | null> {
    const q = 'SELECT * FROM bookings WHERE id = $1 LIMIT 1';
    const res = await this.db.query(q, [id]);
    return res.rows[0] ?? null;
  }
}
