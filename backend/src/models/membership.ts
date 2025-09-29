export interface Membership {
  id: string;
  venue_id: string;
  user_id: string;
  tier: string;
  starts_at?: string;
  ends_at?: string;
  created_at: string;
}

export const membershipFromRow = (r: any): Membership => ({
  id: r.id,
  venue_id: r.venue_id,
  user_id: r.user_id,
  tier: r.tier,
  starts_at: r.starts_at,
  ends_at: r.ends_at,
  created_at: r.created_at,
});
