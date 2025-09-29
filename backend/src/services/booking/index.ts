import express from 'express';
import { createBooking, getBooking } from './bookingController';

export function createBookingRouter() {
  const router = express.Router();
  router.post('/bookings', createBooking);
  router.get('/bookings/:id', getBooking);
  return router;
}

export default createBookingRouter;
