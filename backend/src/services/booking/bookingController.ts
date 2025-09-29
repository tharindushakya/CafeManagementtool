import { Request, Response } from 'express';
import { Booking } from '../../models/booking';
import { BookingRepository } from '../../repositories/bookingRepository';
import { PgClient } from '../../repositories/pgClient';

const dbUrl = process.env.DATABASE_URL;
let bookingRepo: BookingRepository | null = null;
if (dbUrl) {
  const client = new PgClient(dbUrl);
  bookingRepo = new BookingRepository(client);
}

export const createBooking = async (req: Request, res: Response) => {
  const body = req.body as any;

  // If we have a DB-backed repository, use it
  if (bookingRepo) {
    try {
      const created = await bookingRepo.create({
        venue_id: body.venue_id,
        user_id: body.user_id,
        device_id: body.device_id,
        start_time: body.start_time,
        end_time: body.end_time,
        idempotency_key: body.idempotency_key,
      });
      // Map DB row to API model shape
      res.status(201).json({ booking: created });
      return;
    } catch (err: any) {
      console.error('Booking create failed', err);
      res.status(500).json({ error: 'booking.create_failed' });
      return;
    }
  }

  // Fallback stub
  const now = new Date().toISOString();
  const booking: Booking = {
    id: body.id ?? 'stub-booking-id',
    venue_id: body.venue_id ?? 'stub-venue',
    user_id: body.user_id ?? 'stub-user',
    device_id: body.device_id,
    state: 'reserved',
    starts_at: body.starts_at,
    ends_at: body.ends_at,
    created_at: now,
    updated_at: now,
  };

  res.status(201).json({ booking });
};

export const getBooking = async (req: Request, res: Response) => {
  const id = req.params.id;
  // Stubbed response
  res.json({ id, state: 'reserved' });
};
