# Tasks (Phase 2) — Baseline implementation (generated)

Feature: 001-description-baseline-specification — Gaming Café Management (baseline)
Spec: `specs/001-description-baseline-specification/spec.md`

Notes: Tasks follow TDD-first ordering. [P] denotes tasks that can run in parallel (different files/services).

## Owners & Estimates

The table below assigns a primary owner (team or role) and a rough implementation estimate for each task. Estimates are intentionally coarse (days). When assigning in the real project, replace the owner with a GitHub username or team and refine estimates.

- T001 — Owner: devops / infra — Estimate: 1d
- T002 — Owner: devops / infra — Estimate: 1d
- T003 — Owner: backend — Estimate: 2d
- T004 — Owner: backend — Estimate: 2d
- T005 — Owner: backend (Jen) — Estimate: 1d
- T006 — Owner: backend — Estimate: 1d
- T007 — Owner: backend — Estimate: 3d
- T008 — Owner: backend / API — Estimate: 2d
- T009 — Owner: backend / devices — Estimate: 2d
- T010 — Owner: backend — Estimate: 2d
- T011 — Owner: backend — Estimate: 5d
- T012 — Owner: backend / devices — Estimate: 3d
- T013 — Owner: payments — Estimate: 3d
- T014 — Owner: security / compliance — Estimate: 2d
- T015 — Owner: backend / telemetry — Estimate: 2d
- T016 — Owner: CI / devops — Estimate: 2d
- T017 — Owner: docs / eng — Estimate: 1d
- T018 — Owner: ops — Estimate: 2d
- T019 — Owner: kiosk — Estimate: 3d
- T020 — Owner: watchdog — Estimate: 2d
- T021 — Owner: QA / test-engineering — Estimate: 1d
- T022 — Owner: backend / data — Estimate: 2d
- T023 — Owner: backend / security — Estimate: 2d
- T024 — Owner: security / infra — Estimate: 3d
- T025 — Owner: security / auth — Estimate: 2d
- T026 — Owner: perf / qa — Estimate: 3d
- T027 — Owner: backend / gamification — Estimate: 3d
- T028 — Owner: backend / console — Estimate: 2d
- T029 — Owner: marketplace / infra — Estimate: 3d

Notes:
- Replace owner placeholders with real GitHub usernames or team names when creating issues/PRs.
- Use the estimates as planning input; break large tasks (>=3d) into subtasks in the sprint board.
- Mark a task done by checking the left box (e.g., T001 [x]).

T001 [x] Setup: Repository skeleton and dev environment
 - Outcome: Monorepo layout with backend/, frontend/, infra/ and toolchain files.
 - Steps:
	 1. Create `backend/` and `frontend/` directories and minimal README.md in each.
	 2. Add `package.json` in `backend/` with scripts: build, test, start, lint (use TypeScript). See plan.md Technical Context.
	 3. Add `package.json` in `frontend/` with scripts: start, build, test.
	 4. Add `docker-compose.yml` at repo root to start Postgres + Redis for local dev (refer quickstart.md).
 - Files changed/created: `backend/package.json`, `frontend/package.json`, `docker-compose.yml`, `backend/README.md`, `frontend/README.md`
 - Dependencies: None
 - Why first: All subsequent tasks expect the repo structure and dev services.

	Progress: Created `backend/package.json`, `frontend/package.json`, `backend/README.md`, `frontend/README.md`, and `docker-compose.yml` at repo root.

T002 [x] Setup: Linting, formatting, and pre-commit hooks
 - Outcome: ESLint + Prettier + Husky pre-commit hooks for backend and frontend.
 - Steps:
	 1. Add ESLint + Prettier configs in `backend/` and `frontend/`.
	 2. Install Husky and configure a pre-commit hook to run `npm run lint` and `npm test` (fast-check set to lint only initially).
 - Files: `.eslintrc.json`, `.prettierrc`, `.husky/commit-msg`
 - Parallel: This task can run in parallel with T001 tasks touching different files.

	Progress: Created root `.eslintrc.json`, `.prettierrc`, and `.husky/` hooks (`pre-commit`, `commit-msg`).

T003 [x] Initialize Postgres schema & migration tool (data-model driven)
 - Outcome: Migration setup and initial schema implementing entities from `data-model.md`.
 - Steps:
	 1. Choose migration tool (Flyway or node-pg-migrate). Add config in `backend/migrations/`.
	 2. Add initial SQL migration `V1__initial_schema.sql` creating tables: users, devices, bookings, payments, memberships, coins, events. Include `venue_id UUID NOT NULL` on tenant scoped tables and the fields listed in `data-model.md`.
	 3. Add simple migration run script in `backend/package.json` (e.g., `npm run migrate`).
 - Files: `backend/migrations/V1__initial_schema.sql`, `backend/config/migrations.*`
 - Why parallel: Migration files are independent and can be prepared in parallel to other setup.

	Progress: Added `backend/migrations/V1__initial_schema.sql`, `backend/migrations/README.md`, and `backend/config/migrations.json`.

T004 [x] Generate TypeScript data models and DB ORM bindings
 - Outcome: Type definitions and minimal ORM models for each entity (users, devices, bookings, payments, memberships, coins, events).
 - Steps:
	 1. Add TypeScript interfaces in `backend/src/models/` matching `data-model.md`.
	 2. Add simple repository layer (e.g., using node-postgres or pg-promise) with CRUD stubs for each model.
 - Files: `backend/src/models/*.ts`, `backend/src/repositories/*.ts`
 - Dependency: T003 creates migrations first; otherwise models can be drafted in parallel but marked as dependent for implementation.

	Progress: Added TypeScript interfaces under `backend/src/models/` and repository stubs under `backend/src/repositories/` (user, booking, device, payment). Added unit test skeleton under `backend/tests/unit/`.

T005 [x] Contract tests: Create failing contract tests for each contract file under `/contracts`
 - Outcome: One contract test per contract artifact that initially fails (TDD). Marked [P].
 - Steps:
	 1. For `contracts/openapi.yaml` create a contract test harness using Dredd or Jest + supertest with OpenAPI schema assertions. Place tests under `backend/tests/contract/openapi.spec.ts`.
	 2. For `contracts/service.proto` add a small proto-based smoke test (`backend/tests/contract/proto.smoke.ts`) that validates the proto can be loaded and messages serialized/deserialized.
 - Files: `backend/tests/contract/openapi.spec.ts`, `backend/tests/contract/proto.smoke.ts`
 - Why first: Tests should exist and fail before implementation (TDD).

	Progress: Added failing contract test skeletons at `backend/tests/contract/openapi.spec.ts` and `backend/tests/contract/proto.smoke.ts`. These tests intentionally assert expanded contract symbols and will fail until `contracts/openapi.yaml` and `contracts/service.proto` are updated per T008/T009.

T006 [x] Core: Implement Health endpoints (OpenAPI + gRPC) — minimal server stub
 - Outcome: Health check REST endpoint and gRPC service that returns OK.
 - Steps:
	 1. Implement `GET /health` in `backend/src/services/health` per `contracts/openapi.yaml`.
	 2. Implement gRPC Health service per `contracts/service.proto` with a `Check` RPC.
	 3. Add startup scripts to run REST + gRPC servers locally.
 - Files: `backend/src/services/health/*`, `backend/src/grpc/health_server.ts`
 - Dependencies: T001, T005 (contract tests will now start to pass once implementation is added).

	Progress: Added REST health router `backend/src/services/health` and gRPC health server stub `backend/src/grpc/health_server.ts`.

T007 [x] Core: Booking service scaffolding and endpoints
 - Outcome: Booking service with REST endpoints: create/reserve/start/complete/cancel and related business logic skeleton.
 - Steps:
	 1. Add `backend/src/services/booking/` with controllers and route definitions matching desired OpenAPI endpoints (to be added to `contracts/openapi.yaml` in next task).
	 2. Implement idempotent booking creation with `booking_id` and state transitions matching `data-model.md`.
	 3. Add unit tests stubs under `backend/tests/unit/booking.spec.ts`.
 - Files: `backend/src/services/booking/*`, `backend/tests/unit/booking.spec.ts`
 - Dependencies: T003 (DB schema), T004 (models), T005 (contract tests for booking endpoints once added).

	Progress: Added booking controller, router, an application entry `backend/src/index.ts`, and a unit test `backend/tests/unit/booking.spec.ts` that asserts POST /bookings returns 201.

T008 [x] Contracts: Expand `contracts/openapi.yaml` with booking, device, and payments endpoints (MVP)
 - Outcome: Full OpenAPI endpoints for booking lifecycle, device heartbeat/status, payment-intent creation, and webhook receiver for Stripe events.
 - Steps:
	 1. Add paths for `/bookings` (POST, GET), `/bookings/{id}/start`, `/bookings/{id}/complete`, `/devices/{id}/heartbeat`, `/payments/create-intent`, `/webhooks/stripe`.
	 2. Define request/response schemas using shared components (Booking, Device, Payment, Error).
	 3. Commit file to `specs/001-description-baseline-specification/contracts/openapi.yaml`.
 - Files: `specs/001-description-baseline-specification/contracts/openapi.yaml` (updated)
 - Dependencies: T006 (health) and T007 (booking) will implement endpoints to match these contracts.

	Progress: Created and committed `specs/001-description-baseline-specification/contracts/openapi.yaml` with booking, device heartbeat, payments, and webhook paths. Contract tests should now load this spec; implementations may still be required to satisfy responses.

T009 [x] Contracts: Expand `service.proto` with device control and health messages
 - Outcome: Protobuf definitions for device heartbeat, control messages, and booking update notifications.
 - Steps:
	 1. Extend `service.proto` with messages: `DeviceHeartbeat`, `DeviceControl`, and `BookingUpdate` and service RPCs: `SendControl`, `StreamHeartbeats`.
	 2. Add comments describing mTLS requirement for device RPCs.
 - Files: `specs/001-description-baseline-specification/contracts/service.proto` (updated)
 - Dependencies: T006 (gRPC health) will be extended to implement these RPCs.

	Progress: Added `specs/001-description-baseline-specification/contracts/service.proto` with `DeviceHeartbeat`, `DeviceControl`, `BookingUpdate` messages and `DeviceService` & `BookingService` RPCs. Added note requiring mTLS for device RPCs in production.

T010 [x] Contract tests: Add tests for the expanded OpenAPI endpoints (booking, device, payments)
 - Outcome: Contract tests are present and fail until implementation is added.
 - Steps:
	 1. Add test files under `backend/tests/contract/booking.spec.ts`, `backend/tests/contract/devices.spec.ts`, `backend/tests/contract/payments.spec.ts` each loading `specs/001-description-baseline-specification/contracts/openapi.yaml`.
	 2. Use a test runner (Jest) with a helper that validates responses against the OpenAPI schema.
 - Files: `backend/tests/contract/*.spec.ts`
 - Parallel: All contract tests are [P] and can run together.
 
T011 [x] Core: Implement Booking endpoints and DB wiring
 - Outcome: Booking endpoints implemented and integrated with DB migrations/repositories.
 - Steps:
	 1. Implement controller logic to create/transition bookings using repository layer (T004).
	 2. Ensure state transitions are atomic (use DB transactions) and idempotent by request idempotency keys.
	 3. Add integration tests that use docker-compose to run Postgres and run migrations (see quickstart.md).
 - Files: `backend/src/services/booking/*`, `backend/tests/integration/booking.integration.spec.ts`
 - Dependencies: T003, T004, T007, T008, T010.

T012 [x] Core: Device service — heartbeat ingestion and pub/sub updates
 - Outcome: Device heartbeat endpoint/service that updates device status and publishes events to Redis pub/sub.
 - Steps:
	 1. Implement REST or gRPC ingestion for device heartbeats in `backend/src/services/device`.
	 2. Update the `devices` table `status` and `last_heartbeat` fields.
	 3. Publish device status changes to Redis channel `device-status.{venue_id}`.
 - Files: `backend/src/services/device/*`, `backend/tests/integration/device.integration.spec.ts`
 - Dependencies: T003, T004, T008, T009.

T013 [x] Core: Payments service integration (Stripe test-mode)
 - Outcome: Payments service capable of creating a PaymentIntent, handling webhook events, and marking payments records with `reconcile_status`.
 - Steps:
	 1. Implement `POST /payments/create-intent` to call Stripe test API and save a payments record in `payments` table with `status = pending`.
	 2. Implement `POST /webhooks/stripe` to process events (payment_intent.succeeded, charge.refunded) and update `payments` table accordingly.
	 3. Add reconcile job that marks `reconcile_status` and retries failed posts.
 - Files: `backend/src/services/payments/*`, `backend/tests/integration/payments.integration.spec.ts`
 - Dependencies: T003, T004, T008, T010.

T014 [x] Security & Compliance tasks (high priority for production)
 - Outcome: Security checklist and gating tasks for PCI and mTLS readiness.
 - Steps:
	 1. Create `security-analysis.md` with mTLS topology, RBAC model, data retention enforcement points, and Stripe PCI scope notes (reference spec clarifications).
	 2. Add CI check placeholder to require Security Owner sign-off before enabling Stripe Terminal production keys.
 - Files: `specs/001-description-baseline-specification/security-analysis.md`
 - Dependencies: Approval from Finance & Security compliance team.

T015 [x] Telemetry pipeline: collection & retention enforcement
 - Outcome: Telemetry ingest endpoint + retention enforcement policy (90 days) and storage plan.
 - Steps:
	 1. Implement telemetry endpoint for kiosk and backend metrics; persist to object store or time-series DB (choice deferred to research tasks).
	 2. Add retention job and policy enforcement script that deletes telemetry older than 90 days.
 - Files: `backend/src/services/telemetry/*`, `infra/telemetry-retention-job`.
 - Dependencies: T006 (kiosk), T012 (device heartbeats).

T016 [P] Testing infra: Jenkins pipeline skeleton and test runners
 - Outcome: Jenkinsfile (or pipeline-as-code) that runs lint, unit tests, contract tests, and integration smoke tests.
 - Steps:
	 1. Add `Jenkinsfile` at repo root with stages: Checkout, Install, Lint, Unit Tests, Contract Tests, Integration (docker-compose up + smoke tests), Security Scan, Publish artifacts.
	 2. Configure contract-test stage to run `backend/tests/contract/*.spec.ts` (these should initially fail until implementation).
 - Files: `Jenkinsfile`, `.jenkins/pipeline-config.yml`
 - Parallel: Test stages include parallel test runners for unit vs contract tests.

T017 [ ] Polish: Unit tests, docs and developer quickstart
 - Outcome: Developer-friendly README, test coverage targets, and a working quickstart that brings up services locally.
 - Steps:
	 1. Flesh out `specs/001-description-baseline-specification/quickstart.md` with exact docker-compose commands and example env vars.
	 2. Add unit tests to reach an initial coverage baseline (e.g., 40%).
	 3. Add `backend/README.md` and `frontend/README.md` with startup steps.
 - Files: `specs/001-description-baseline-specification/quickstart.md` (updated), `backend/README.md`, `frontend/README.md`, unit test files.
 - Dependencies: most core features implemented.

T018 [ ] Ops: Migrations and rollback validation
 - Outcome: Verified migration/rollback process and a playbook for safe DB migrations.
 - Steps:
	 1. Run migrations in a disposable DB, verify schema produced, then run rollback or compensating migration ensuring no data loss in backward-compatible changes.
	 2. Document steps in `ops/migrations-playbook.md`.
 - Files: `ops/migrations-playbook.md`

T019 [ ] Kiosk: Implement Windows 11 kiosk client skeleton and lockdown tests
 - Outcome: `kiosk/` directory with an initial kiosk app template (Electron or .NET) that can run in kiosk mode, developer README, and E2E tests that verify OS lockdown behavior.
 - Steps:
	 1. Create `kiosk/README.md` describing build and kiosk-mode startup.
	 2. Add a minimal app in `kiosk/src/` (Electron recommended for rapid iteration) with configuration that starts fullscreen and disables shell access.
	 3. Add E2E test `kiosk/tests/e2e/kiosk_lockdown.spec.ts` that verifies the app starts in fullscreen, blocks common shell shortcuts (Alt+Tab), and cannot open Explorer while session active.
 - Files: `kiosk/README.md`, `kiosk/src/*`, `kiosk/tests/e2e/kiosk_lockdown.spec.ts`
 - Dependencies: T001 (repo skeleton), T006 (health server available for telemetry during tests)
 - Notes: This task satisfies the constitution's Kiosk reliability MUST (implement skeleton + tests). NOT parallel.

T020 [ ] Kiosk: Implement Windows Watchdog Service and fault-injection tests
 - Outcome: Windows Service in `watchdog/windows-service/` that supervises the kiosk app and restarts it on crash, logging restart reasons. Fault-injection test that kills the kiosk process and verifies watchdog restarts it within 5s.
 - Steps:
	 1. Implement a minimal Windows Service that starts the kiosk app and monitors heartbeat files or health API.
	 2. Add `watchdog/tests/watchdog.integration.spec.ts` which simulates a crash and asserts restart within 5s and that restart reason is logged.
 - Files: `watchdog/windows-service/*`, `watchdog/tests/watchdog.integration.spec.ts`
 - Dependencies: T019
 - Notes: Required by constitution (watchdog restart acceptance criteria). NOT parallel.

T021 [x] Tests: Create required `tests/plan.md` artifact (MANDATORY)
 - Outcome: `specs/001-description-baseline-specification/tests/plan.md` describing unit, integration, contract, and e2e tests; owners; mapping to requirements and acceptance criteria.
 - Steps:
	 1. Draft `tests/plan.md` with a table: requirement key → test type → file/path → owner.
	 2. Include acceptance criteria mapping (e.g., watchdog restart ≤5s, floorplan latency <2s).
 - Files: `specs/001-description-baseline-specification/tests/plan.md`
 - Dependencies: None. This is MANDATORY per spec.

	Progress: Created `specs/001-description-baseline-specification/tests/plan.md` with requirement → test mapping, acceptance criteria, CI gating, and a watchdog integration test skeleton.

T022 [P] Data: Implement receipts & payments retention and archival job (7y)
 - Outcome: Scheduled job that archives receipts to object storage and enforces a 7-year retention policy; payments records flagged and archived according to policy.
 - Steps:
	 1. Add job `backend/src/jobs/retention/receiptsRetention.ts` that moves receipts older than 7y to cold storage and marks them as archived.
	 2. Add `ops/receipts-retention-playbook.md` with verification and legal owner sign-off steps.
 - Files: `backend/src/jobs/retention/receiptsRetention.ts`, `ops/receipts-retention-playbook.md`
 - Dependencies: T013 (payments service), T018 (migrations validated)

T023 [P] Data: Implement audit log retention & secure archive (2y)
 - Outcome: Audit logs pipeline that enforces 2-year retention, encrypts/archives old logs, and allows secure export for compliance.
 - Steps:
	 1. Add `backend/src/jobs/retention/auditRetention.ts` to purge/ archive audit logs older than 2 years and verify integrity.
	 2. Document access controls and export/playback procedures in `ops/audit-retention-playbook.md`.
 - Files: `backend/src/jobs/retention/auditRetention.ts`, `ops/audit-retention-playbook.md`
 - Dependencies: T014 (security analysis) and legal sign-off

T024 [ ] Security: mTLS provisioning, cert tooling, and API gateway enforcement
 - Outcome: Certificate provisioning tooling for dev/test, gateway configuration that enforces mTLS for sensitive endpoints, and automated test that verifies TLS client cert requirement.
 - Steps:
	 1. Add `infra/certs/generate-dev-certs.sh` or PowerShell equivalent and a short README.
	 2. Add API gateway config `infra/gateway/mTLS-policy.yaml` showing required mutual TLS for `/devices/*`, `/payments/*` and other sensitive paths.
	 3. Add test `backend/tests/security/mtls.spec.ts` that confirms failure when client cert not presented and success when presented.
 - Files: `infra/certs/*`, `infra/gateway/mTLS-policy.yaml`, `backend/tests/security/mtls.spec.ts`
 - Dependencies: T006 (health/gRPC) and T009 (proto); T014 for security sign-off after implementation
 - Notes: This implements the constitution's mTLS MUST for sensitive operations. Prefer automation for cert rotation in future.

T025 [ ] Security: RBAC policy implementation and enforcement tests
 - Outcome: RBAC policy definitions and enforcement hooks in API gateway and services; test suite verifying least-privilege enforcement.
 - Steps:
	 1. Add `backend/src/auth/rbac/policies.yaml` with roles admin/manager/support/operator and example policies.
	 2. Implement middleware `backend/src/auth/rbac/middleware.ts` that enforces policy and logs decision events to audit logs.
	 3. Add tests `backend/tests/security/rbac.spec.ts` validating role-restricted paths.
 - Files: `backend/src/auth/rbac/*`, `backend/tests/security/rbac.spec.ts`
 - Dependencies: T024 (mTLS/gateway changes), T014 (security analysis)

T026 [P] Performance: Floorplan latency perf test & watchdog fault-injection harness
 - Outcome: Performance tests that measure floorplan update latency under normal and loaded conditions and an automated fault-injection harness for the watchdog restart acceptance test.
 - Steps:
	 1. Add test script `backend/tests/perf/floorplan_latency.test.js` that simulates device heartbeats and measures end-to-end UI-update latency (instrument via websocket or pub/sub test harness).
	 2. Add load script `infra/loadtests/floorplan_load.yml` for k6 or similar to generate device heartbeat load.
	 3. Add watchdog fault-injection harness `watchdog/tests/fault-injection.sh` to simulate crashes and assert restart within 5s.
 - Files: `backend/tests/perf/*`, `infra/loadtests/*`, `watchdog/tests/*`
 - Dependencies: T011 (booking endpoints), T012 (device ingestion), T019/T020 (kiosk/watchdog tests)

T027 [P] Gamification: Implement coins wallet, ledger entries, and leaderboard snapshotting
 - Outcome: Basic gamification service that supports atomic wallet updates, append-only ledger, and periodic leaderboard snapshots.
 - Steps:
	 1. Add migration `backend/migrations/V2__gamification.sql` adding `coins` table (if not present) and ledger JSONB column.
	 2. Implement service `backend/src/services/gamification/` with credit/debit endpoints and unit tests.
	 3. Add periodic job `backend/src/jobs/leaderboard_snapshot.ts` to compute leaderboards.
 - Files: `backend/migrations/V2__gamification.sql`, `backend/src/services/gamification/*`, `backend/tests/unit/gamification.spec.ts`
 - Dependencies: T003 (initial schema)

T028 [P] Console: QR linking endpoint and E2E QR link test
 - Outcome: `POST /consoles/link` endpoint to accept QR-link tokens, bind a console session to a user, and tests that validate the flow (including offline reconciliation behavior).
 - Steps:
	 1. Add routes/controllers `backend/src/services/console/` and integration tests `backend/tests/integration/console_qr.spec.ts` that simulate QR scan → link → session start.
	 2. Document extension points for vendor SDKs in the console service README.
 - Files: `backend/src/services/console/*`, `backend/tests/integration/console_qr.spec.ts`
 - Dependencies: T007 (booking service) and T011 (booking DB wiring)

T029 [P] Marketplace: Prototype signed package registry and sandboxing check
 - Outcome: Minimal registry service that accepts signed plugin metadata, verifies signatures, and offers a sandbox runtime for testing plugins.
 - Steps:
	 1. Create `marketplace/registry/` with signature verification code and sample signed package format.
	 2. Add a minimal sandbox runner `marketplace/sandbox/` that isolates plugin execution (container or process-based) and tests the disable/enable flow.
	 3. Add integration tests `backend/tests/integration/marketplace.spec.ts` verifying plugin install/uninstall and isolation.
 - Files: `marketplace/registry/*`, `marketplace/sandbox/*`, `backend/tests/integration/marketplace.spec.ts`
 - Dependencies: T014 (security analysis), T024 (mTLS & gateway security)

----
Mapping note: developer/ops tasks (T001, T002, T017, T018) map to constitution principles: Spec-driven (ensures reproducible onboarding), Test-driven (lints/tests), and Transparency (quickstart docs). Consider adding a single-line mapping comment under each dev-op task if desired for reviewers.

----
Parallel execution examples and agent commands
- Tasks that can run in parallel (different files/services): T002, T003, T004, T005, T015, T016
- Example agent commands (for an LLM or automation to pick up tasks):
	- Run contract tests (OpenAPI): `node ./backend/tests/contract/run-openapi-tests.js --spec specs/001-description-baseline-specification/contracts/openapi.yaml`
	- Run proto smoke test: `node ./backend/tests/contract/run-proto-smoke.js --proto specs/001-description-baseline-specification/contracts/service.proto`
	- Run migrations locally: `docker-compose up -d && npm --prefix backend run migrate`

Numbering notes: Tasks begin T001 and are ordered by dependency. Tasks marked [P] can be executed in parallel across different files/services. Sequential tasks that modify the same files are intentionally not marked [P].

If you'd like, I can now:
- Expand `contracts/openapi.yaml` and `service.proto` (create full booking/device/payments contract definitions).  
- Create the migration SQL `V1__initial_schema.sql` under `backend/migrations/` and TypeScript model files so the team can start implementing.  
- Generate the Jenkinsfile and contract-test harness (Dredd + Jest) and commit them to the branch.
