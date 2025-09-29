/**
 * Minimal DB client wrapper used by repository stubs.
 * In production replace with a real `pg.Pool` client and proper connection handling.
 */

export type QueryResult = { rows: any[]; rowCount: number };

export interface DbClient {
  query: (text: string, params?: any[]) => Promise<QueryResult>;
}

// A small in-memory fake DB useful for unit tests when a real DB is not available.
export class FakeDb implements DbClient {
  private tables = new Map<string, any[]>();

  async query(_text: string, _params: any[] = []): Promise<QueryResult> {
    // Very small stub: always return empty rows. Use more advanced fakes in tests.
    return { rows: [], rowCount: 0 };
  }
}

export const NotImplementedDb: DbClient = {
  query: async () => {
    throw new Error('DB client not configured. Provide a real pg Pool or use FakeDb in tests.');
  },
};
