Initial migrations directory

This folder contains SQL migrations intended for local development and CI pipelines.

How to run (example):

1. Start local DB services:

   docker-compose up -d

2. Apply migrations (tooling varies):

   - If using a simple psql approach:
     psql "postgres://cafe_user:cafe_pass@localhost:5432/cafe_dev" -f backend/migrations/V1__initial_schema.sql

   - If using a migration tool (node-pg-migrate, Flyway, etc.), configure the tool and point it at `backend/migrations/`.

Notes:
- The migration enables `pgcrypto` for `gen_random_uuid()`; in some environments you may prefer `uuid-ossp` and `uuid_generate_v4()`.
- Add subsequent migrations as `V2__...` etc. Ensure rollbacks or compensating migrations are provided when applicable.
