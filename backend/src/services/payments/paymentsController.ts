import { Request, Response } from 'express';
import { PaymentRepository } from '../../repositories/paymentRepository';
import { PgClient } from '../../repositories/pgClient';
import { randomUUID } from 'crypto';

const dbUrl = process.env.DATABASE_URL;
const paymentRepo = dbUrl ? new PaymentRepository(new PgClient(dbUrl)) : null;

export const createPaymentIntent = async (req: Request, res: Response) => {
  const body = req.body as any;

  // If no stripe key configured, return 501 (not implemented) but still record a pending payment if DB present
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!paymentRepo) {
    return res.status(501).json({ error: 'payments.not_configured' });
  }

  const payment = {
    id: randomUUID(),
    venue_id: body.venue_id,
    booking_id: body.booking_id,
    amount_cents: body.amount_cents || 0,
    currency: body.currency || 'USD',
    status: stripeKey ? 'pending' : 'pending',
    reconcile_status: 'unreconciled',
    created_at: new Date().toISOString(),
  };

  try {
    const created = await paymentRepo.create(payment as any);

    // If stripe key present, in real impl we'd call Stripe here. For now return created record and a stub client_secret.
    const clientSecret = stripeKey ? 'test_client_secret_stub' : null;
    res.status(201).json({ payment: created, client_secret: clientSecret });
  } catch (err: any) {
    console.error('createPaymentIntent failed', err);
    res.status(500).json({ error: 'payments.create_failed' });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  // Simple webhook receiver that accepts events and marks payments as completed when event contains booking_id
  const event = req.body as any;
  if (!paymentRepo) return res.status(501).json({ error: 'payments.not_configured' });

  try {
    // naive handling: if event.data.object.status === 'succeeded' and contains metadata.booking_id
    const obj = event.data?.object;
    if (obj && obj.metadata && obj.metadata.booking_id && obj.status === 'succeeded') {
      // find payment by booking_id and mark completed
      // For simplicity, we won't search here; real impl should locate the payment record and update.
      res.status(200).json({ ok: true });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('webhook processing failed', err);
    res.status(500).json({ error: 'webhook.failed' });
  }
};
