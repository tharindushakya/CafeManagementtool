import { DbClient } from './db';
import { Payment } from '../models/payment';

export class PaymentRepository {
  constructor(private db: DbClient) {}

  async create(p: Partial<Payment>): Promise<Payment> {
    const q = 'INSERT INTO payments (id, venue_id, booking_id, amount_cents, currency, status, reconcile_status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *';
    const params = [p.id, p.venue_id, p.booking_id, p.amount_cents, p.currency, p.status, p.reconcile_status, p.created_at];
    const res = await this.db.query(q, params);
    return res.rows[0] as Payment;
  }

  async markReconciled(id: string): Promise<void> {
    await this.db.query('UPDATE payments SET reconcile_status = $1 WHERE id = $2', ['reconciled', id]);
  }
}
