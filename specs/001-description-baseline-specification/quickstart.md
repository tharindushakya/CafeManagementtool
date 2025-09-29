# Quickstart — Local developer environment

This quickstart explains how to run the backend services required for local development and testing.

Prerequisites
- Docker & Docker Compose
- Node.js 20+
- npm

Bring up dependencies and run migrations (example):

1. Start infrastructure services:

```powershell
docker-compose up -d
```

2. Install backend dependencies and run tests:

```powershell
npm --prefix backend install
npm --prefix backend run test
```

3. Start the backend in dev mode:

```powershell
npm --prefix backend run dev
```

Environment variables
- Create a `.env` file in `backend/` with values for DATABASE_URL, REDIS_URL, STRIPE_API_KEY (test key), and PORT.

Notes
- Migrations can be run with `npm --prefix backend run migrate` once a migration runner is implemented.
# Quickstart (developer)

1. Start local Postgres and Redis (docker-compose).
2. Run migrations: `flyway migrate` (or configured tool).
3. Start auth, booking, and device services locally.
4. Seed demo venue and demo user.
5. Launch React booking portal on port 3000.

*** End Patch