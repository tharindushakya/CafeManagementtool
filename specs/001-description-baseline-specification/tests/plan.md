# Tests Plan — 001-description-baseline-specification

Purpose
- Provide a single, actionable test plan that maps each requirement and acceptance criterion to test types, file paths, and owners. This artifact is mandatory per the spec and constitution.

Scope
- Unit, contract, integration, E2E, performance, and security tests for the baseline feature: kiosk client, backend services (booking, device, payments), license management, gamification, and marketplace.

Conventions
- Requirement keys are slugs derived from imperative requirements (e.g., `watchdog-restart-within-5s`).
- Test types: unit, contract, integration, e2e, perf, security.
- File path columns show the canonical location where tests should live under the repository.

## Requirement → Test Mapping

| Req Key | Short description | Test Type(s) | Test file / path | Owner |
|---|---|---:|---|---|
| watchdog-restart-within-5s | Watchdog restarts kiosk within 5s after crash | integration, e2e | `watchdog/tests/watchdog.integration.spec.ts`, `kiosk/tests/e2e/kiosk_lockdown.spec.ts` | watchdog / kiosk team |
| kiosk-lockdown-shell | Kiosk enforces OS lockdown; no explorer access | e2e | `kiosk/tests/e2e/kiosk_lockdown.spec.ts` | kiosk |
| telemetry-at-least-once | Telemetry is queued and reconciled (at-least-once) | integration, contract | `backend/tests/integration/telemetry.integration.spec.ts` | backend/telemetry |
| bookings-atomic-idempotent | Booking lifecycle state transitions atomic & idempotent | unit, integration, contract | `backend/tests/unit/booking.spec.ts`, `backend/tests/integration/booking.integration.spec.ts`, `backend/tests/contract/booking.spec.ts` | backend/booking |
| floorplan-latency-2s | Floorplan UI updates within 2s under normal load | perf, integration | `backend/tests/perf/floorplan_latency.test.js`, `frontend/tests/perf/floorplan_latency.e2e.js` | perf / frontend |
| payments-create-intent | Payments create-intent + webhook handling | integration, security, contract | `backend/tests/integration/payments.integration.spec.ts`, `backend/tests/contract/payments.spec.ts`, `backend/tests/security/payments_security.spec.ts` | payments |
| payments-retention-7y | Payments / receipts retained/archived per policy | integration, ops | `backend/tests/integration/retention.receipts.spec.ts`, `ops/receipts-retention-playbook.md` | backend/data, ops |
| audit-retention-2y | Audit logs retention & secure archive | integration, security | `backend/tests/integration/audit_retention.spec.ts` | backend/security |
| mTLS-required-sensitive | mTLS enforced for devices/payments-sensitive endpoints | security, integration | `backend/tests/security/mtls.spec.ts` | security/infra |
| rbac-enforced | RBAC enforcement for admin paths | security, integration | `backend/tests/security/rbac.spec.ts` | security/auth |
| license-revocation-5s | License revocation enforced within 5s | integration | `backend/tests/integration/license_revocation.spec.ts` | licensing/team |
| marketplace-signed-plugins | Marketplace accepts only signed packages | integration, security | `backend/tests/integration/marketplace.spec.ts` | marketplace |

(If a requirement is missing from this table, add a row and assign an owner; this file is the authoritative test plan for the feature.)

## Acceptance Criteria Mapping
- watchdog-restart-within-5s: integration test must simulate kiosk crash and assert watchdog restarts process and logs reason within ≤5s. E2E test should exercise a real app binary in kiosk mode where possible.
- kiosk-lockdown-shell: E2E test must validate common shell breakout vectors (Alt+Tab, Win+D, Ctrl+Esc) are blocked during an active session.
- floorplan-latency-2s: perf test must measure end-to-end latency from device heartbeat ingestion → pub/sub → frontend update; median p50 < 1s, p95 < 2s under 'normal load' (define normal load in a per-venue scenario; recommended initial baseline: 500 devices, 100 concurrent sessions).
- mTLS-required-sensitive: security tests must show 401/403 or TLS failure when client certs absent; positive path requires valid client certs.
- payments-create-intent: integration tests must succeed in Stripe test-mode and mark `reconcile_status` appropriately; CI must not run production keys.

## Test File Layout / Conventions
- backend/tests/unit/
- backend/tests/contract/
- backend/tests/integration/
- backend/tests/security/
- backend/tests/perf/
- frontend/tests/
- kiosk/tests/e2e/
- watchdog/tests/

Naming: Use `<area>.<type>.spec.ts` or `.test.js` consistent with the service stack.

## CI / Gating
- Jenkins pipeline stages:
  - lint
  - unit tests
  - contract tests (fail if any contract test fails)
  - integration smoke tests (run in an isolated environment)
  - security scans
- Contract tests must run before implementation tasks for public APIs are merged. The pipeline should provide a clear mapping from failed tests → requirement keys.

## Example Test Skeleton (Watchdog integration)
Path: `watchdog/tests/watchdog.integration.spec.ts`

Test: "watchdog restarts kiosk within 5s"
- Arrange: Start kiosk process stub that opens a TCP/HTTP health endpoint; start watchdog service pointing to kiosk.
- Act: Kill kiosk process or cause a crash.
- Assert: Watchdog restarts kiosk within 5s and emits a restart event to watchlog; test reads the log or health endpoint to confirm restart.

Pseudo-steps (implementation note):
1. Start Postgres & Redis via `docker-compose up -d` (if required by the kiosk stub).
2. Spawn kiosk node process `node kiosk/tests/fixtures/kiosk_stub.js`.
3. Start the watchdog process `node watchdog/windows-service/index.js` in test mode.
4. Kill kiosk process and measure time until health endpoint becomes available again.
5. Assert time <= 5000 ms.

## Local run instructions (developer)
- Start infra: `docker-compose up -d`
- Run unit tests: `npm --prefix backend run test`
- Run contract tests: `node ./backend/tests/contract/run-openapi-tests.js --spec specs/001-description-baseline-specification/contracts/openapi.yaml`
- Run watchdog integration locally (example): see `watchdog/tests/README.md` (to be created during implementation).

## Ownership & Maintenance
- Keep this test plan updated as contracts change. Any change to acceptance criteria MUST update this file and add/adjust tests accordingly.
- Tests that require infra should be marked and run in CI stages with ephemeral environments.

---
*Generated by implementation agent — update owners/paths as actual code is added.*
