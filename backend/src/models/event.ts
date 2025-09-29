export interface EventRow {
  id: string;
  venue_id: string;
  type: string;
  payload: any;
  created_at: string;
}

export const eventFromRow = (r: any): EventRow => ({
  id: r.id,
  venue_id: r.venue_id,
  type: r.type,
  payload: r.payload,
  created_at: r.created_at,
});
