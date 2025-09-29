import { Router, Request, Response } from 'express';

export default function createTelemetryRouter() {
  const router = Router();

  // Accept telemetry POSTs. For MVP we accept JSON payloads and return 202.
  router.post('/telemetry', (req: Request, res: Response) => {
    const payload = req.body;
    // In a full implementation we'd persist payload to a time-series DB or object store.
    // For now, validate basic shape and acknowledge.
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'invalid payload' });
    }

    // Acceptable payload example: { device_id, venue_id, metrics: {...}, ts }
    return res.status(202).json({ received: true });
  });

  return router;
}
