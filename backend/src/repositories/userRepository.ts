import { DbClient } from './db';
import { User } from '../models/user';

export class UserRepository {
  constructor(private db: DbClient) {}

  async create(u: Partial<User>): Promise<User> {
    // Minimal stub; replace SQL and param binding with real queries.
    const q = 'INSERT INTO users (id, venue_id, email, name, created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *';
    const params = [u.id, u.venue_id, u.email, u.name, u.created_at];
    const res = await this.db.query(q, params);
    return res.rows[0] as User;
  }

  async findById(id: string): Promise<User | null> {
    const q = 'SELECT * FROM users WHERE id = $1 LIMIT 1';
    const res = await this.db.query(q, [id]);
    return res.rows[0] ?? null;
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
