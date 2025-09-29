import { Pool } from 'pg';

export async function runTelemetryRetention(pool: Pool) {
  // Placeholder: delete telemetry older than retention period (e.g., 90 days)
  // In this repo we don't have a telemetry table; if present, implement SQL here.
  // For now, return a resolved promise to keep behavior testable.
  return Promise.resolve({ deleted: 0 });
}
