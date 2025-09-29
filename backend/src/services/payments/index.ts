import express from 'express';
import { createPaymentIntent, stripeWebhook } from './paymentsController';

const router = express.Router();

router.post('/payments/create-intent', createPaymentIntent);
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

export default function createPaymentsRouter() {
  return router;
}
