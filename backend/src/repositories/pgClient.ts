import { Pool } from 'pg';
import { DbClient, QueryResult } from './db';

export class PgClient implements DbClient {
  private pool: Pool;

  constructor(connectionString?: string) {
    this.pool = new Pool({ connectionString: connectionString || process.env.DATABASE_URL });
  }

  async query(text: string, params: any[] = []): Promise<QueryResult> {
    const res = await this.pool.query(text, params);
    return { rows: res.rows, rowCount: res.rowCount ?? 0 };
  }

  async close() {
    await this.pool.end();
  }
}
