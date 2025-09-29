# Migrations playbook

This playbook describes how to safely run and validate database migrations and how to verify rollback/compensating migrations for the Gaming Café Management project.

Goals
- Verify migration creates expected schema (tables, indices, constraints).
- Verify rollback or compensating migrations revert or safely migrate schema without data loss for backward-compatible changes.
- Provide repeatable steps for local dev and CI smoke checks.

Prerequisites
- Docker & Docker Compose
- `docker-compose.yml` at repo root configured to run Postgres and Redis for local dev
- `backend/migrations/` contains migration SQL files (e.g., V1__initial_schema.sql)

Quick local validation (disposable DB)

1. Start a disposable Postgres instance:

```powershell
docker-compose up -d postgres
```

2. Wait for Postgres to be ready (or use a small loop to wait on TCP 5432).

3. Run migrations from the backend project. If a migration runner exists:

```powershell
npm --prefix backend run migrate
```

If the migration runner is not implemented, apply SQL directly:

```powershell
psql "host=localhost port=5432 user=postgres dbname=postgres" -f backend/migrations/V1__initial_schema.sql
```

4. Validate schema: connect to Postgres and run queries to list tables and sample rows. Example checks:

```sql
\dt
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bookings';
```

5. Run integration smoke tests that rely on the schema (in CI this should be automated):

```powershell
npm --prefix backend run test -- tests/integration/booking.integration.spec.ts
```

Rollback validation (two approaches)

- Safe rollback for development (drop and re-create):
  1. If migrations are idempotent and reversible, run the rollback command (tool-specific), e.g., `node-pg-migrate down`.
  2. Re-run `psql` to confirm tables removed or reverted.

- Compensating migration (recommended for production):
  1. Create a new migration that reverses schema changes safely (e.g., move data, backfill, rename columns, then drop old columns in a later migration).
  2. Test the compensating migration against production-like data in a staging environment.

Safety checklist
- Take DB backups / logical exports before running migrations in staging/production.
- Ensure migrations are backward compatible where possible (add columns with NULL/defaults then backfill).
- Avoid destructive operations in a single migration on production (use multi-step migrations with verification steps).

CI smoke test suggestion
- Add a CI job that:
  1. Starts Postgres in a job container
  2. Runs migrations
  3. Runs a small set of integration tests
  4. Tears down the DB

Document any manual steps and owners for production rollouts in this file.
