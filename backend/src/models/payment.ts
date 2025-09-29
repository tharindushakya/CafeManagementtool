export interface Payment {
  id: string; // uuid
  venue_id: string;
  booking_id?: string;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  reconcile_status?: 'unreconciled' | 'reconciled' | 'error';
  stripe_intent_id?: string;
  created_at: string;
  updated_at?: string;
}

export const paymentFromRow = (r: any): Payment => ({
  id: r.id,
  venue_id: r.venue_id,
  booking_id: r.booking_id,
  amount_cents: r.amount_cents,
  currency: r.currency,
  status: r.status,
  reconcile_status: r.reconcile_status,
  stripe_intent_id: r.stripe_intent_id,
  created_at: r.created_at,
  updated_at: r.updated_at,
});
