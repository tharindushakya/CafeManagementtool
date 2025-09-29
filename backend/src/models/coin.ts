export interface Coin {
  id: string;
  venue_id: string;
  user_id: string;
  amount: number;
  created_at: string;
}

export const coinFromRow = (r: any): Coin => ({
  id: r.id,
  venue_id: r.venue_id,
  user_id: r.user_id,
  amount: r.amount,
  created_at: r.created_at,
});
