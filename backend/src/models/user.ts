export interface User {
  id: string; // uuid
  venue_id: string; // uuid
  email: string;
  name?: string;
  created_at: string; // ISO
  updated_at?: string;
}

export const userFromRow = (r: any): User => ({
  id: r.id,
  venue_id: r.venue_id,
  email: r.email,
  name: r.name,
  created_at: r.created_at,
  updated_at: r.updated_at,
});
