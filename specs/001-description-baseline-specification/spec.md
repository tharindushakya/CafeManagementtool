% Feature Specification: Gaming Café Management — Baseline

**Feature Branch**: `001-description-baseline-specification`  
**Created**: 2025-09-29  
**Status**: Draft  
**Input**: Baseline specification request covering client, backend, booking, POS,
license management, gamified UX, memberships, marketplace, console support, security,
and testing/CI.

## Summary
This baseline specification defines the scope, inputs, outputs, and dependencies for a
Gaming Café Management System modeled after ggLeap. The goal is to produce a modular,
secure, extensible platform that supports Windows 11 kiosk clients, a Linux backend with
REST and gRPC APIs, booking and POS workflows, license management, gamified UX, and an
add-on marketplace. Each module below includes interface expectations and test targets so
the implementation can be driven from this spec.

## Goals
- Provide a secure, reliable kiosk client for in-venue play.
- Offer a scalable Linux backend with versioned APIs (REST + gRPC) and Postgres storage.
- Support bookings, reservations, and real-time device status with a visual floorplan.
- Integrate Stripe and Stripe Terminal for payments and recurring billing.
- Offer license management for venue and player account models.
- Provide gamified features (coins, leaderboards, events) and a plugin marketplace.
- Ensure strong security, auditability, and CI-driven testing.

## Clarifications
### Session 2025-09-29
- Q: Who will own PCI/Stripe compliance and payments sign‑off? → A: Finance & Security compliance team
- Q: What retention policy for payments, audit logs, telemetry, receipts? → A: 7y, 2y, 90d, 7y
- Q: Offline payments behavior? → A: PCI device only
- Q: Tenancy model? → A: Hybrid shared services
- Q: Console support detail? → A: QR + SDKs later

## Scope & Non-Goals
- In scope: client app, backend services (auth, booking, billing, devices, marketplace),
   database schemas, admin panel, APIs, and CI pipeline scaffolding.
- Out of scope: game emulation logic, console OS firmware, or proprietary third-party
   SDKs beyond integration points (these will be treated as black-box integrations).

## Required Artifacts (MANDATORY)
- OpenAPI (REST) and proto (gRPC) contracts for public and internal APIs in
   `/specs/001-description-baseline-specification/contracts/`
- Data model: `data-model.md` describing entities and migration notes.
- Test plan: `tests/plan.md` listing unit, integration, contract, and e2e tests per module.
- Security analysis: `security-analysis.md` documenting mTLS topology, RBAC model, PCI scope,
   and data redaction/retention policies.

Any implementation without these artifacts is considered incomplete.

## Modules (scope, inputs, outputs, dependencies)

### 1) Client (Windows 11 kiosk)

Scope
- Fullscreen kiosk shell running on Windows 11 that restricts access to the OS shell.
- A Windows Service watchdog that enforces session timeouts, restarts the client on crash,
   and reports health.
- Local telemetry collection: CPU/GPU utilization, running game/process telemetry, client
   health status.
- Communications for control and telemetry over gRPC with mTLS.

Inputs
- User session actions (login, start timed session, extend session) from the kiosk UI.
- Control commands from backend (start/stop session, revoke session, update client config).

Outputs
- Telemetry payloads (periodic): { timestamp, cpu, gpu, process_list_hash, active_session_id,
   network_status }
- Health pings and watchdog events.

Dependencies
- gRPC client libraries and the platform's TLS store for client certificates.
- Windows Service framework for watchdog (SC, Win32 Service API or .NET worker).
- Local storage for offline queueing of critical events.

Acceptance Criteria
- Client locks down to kiosk shell with no access to explorer/edge/desktop while session active.
- Watchdog restarts client within 5 seconds of crash and logs restart reason.
- Telemetry delivered with at-least-once semantics; queued during offline and reconciled.

Test Cases
- Unit: UI components, config parsing.  
- Integration: Watchdog-restart simulation; telemetry queueing and reconciliation.  
- E2E: Simulate remote revoke command and confirm client terminates session.

### 2) Backend (Linux)

Scope
- Set of microservices on Linux handling authentication, bookings, device state, payments,
   licensing, gamification, marketplace, and admin UI.
- REST (OpenAPI) for public/admin clients and gRPC for inter-service calls and low-latency
   device control.
- Persistent store: PostgreSQL (users, bookings, devices, payments, memberships, coins,
   events). Redis for session state, caching, and pub/sub.

Inputs
- API requests from clients and admin UIs (REST/gRPC).
- Webhooks from Stripe / Stripe Terminal events.

Outputs
- API responses, async events on pub/sub channels (device status, booking updates), audit logs.

Dependencies
- PostgreSQL, Redis, a message broker for durable events (optional: Kafka/RabbitMQ), and
   object store for receipts/logs.
- CI/CD tooling (Jenkins) for pipeline execution, security scans, and deployment.

Database Schema (high level entities)
- users(id, email, hashed_password, profile, roles, created_at, updated_at)
- bookings(id, venue_id, user_id, device_id, start_time, end_time, status, created_at)
- devices(id, venue_id, name, type, status, last_heartbeat, metadata)
- payments(id, booking_id, user_id, amount_cents, currency, stripe_charge_id, status)
- memberships(id, user_id, tier, stripe_subscription_id, perks_json, starts_at, ends_at)
- coins(id, user_id, balance, ledger)
- events(id, venue_id, name, start_time, end_time, rules_json)

Acceptance Criteria
- All public APIs documented with OpenAPI and have corresponding contract tests.
- gRPC contracts captured in proto files and included in `/contracts`.

Test Cases
- Unit tests per service.  
- Integration: DB migrations and schema compatibility tests.  
- Contract tests: API request/response validation.

### 3) Booking & Reservations

Scope
- Visual floorplan editor (admin) and real-time floorplan for public booking portal.
- Booking lifecycle states: reserved -> active -> completed | cancelled.
- Real-time updates: device colors reflect status (available, reserved, in-use, offline).

Inputs
- User bookings (portal), admin reservations, device heartbeats.

Outputs
- Reservation confirmations, email receipts, UI updates to floorplan via websocket or pub/sub.

Dependencies
- Frontend: React app for booking portal, WebSocket/gRPC streaming for real-time updates.
- Backend: Booking service, device service (status), payments service.

Acceptance Criteria
- Floorplan updates within 2s of device heartbeat or reservation change under normal load.
- Reservation state transitions are atomic and idempotent.

Test Cases
- Contract tests for booking API.  
- Integration test for full lifecycle: reserve -> start session -> complete -> billing.

### 4) POS System

Scope
- Integrate Stripe for payments and Stripe Terminal for in-venue card acceptance.
- Support transactions, refunds, receipts, daily financial reports, gift cards, and recurring
  billing (memberships).

Inputs
- Payment intents from booking completion, POS checkout flows, admin refunds.

Outputs
- Charges, refunds, receipts (PDF/JSON), daily summary reports.

Dependencies
- Stripe SDKs, secure handling of payment tokens, and a small trusted service to coordinate
  Stripe Terminal readers.

Offline / Reconciliation Rules
- Offline card capture is ONLY allowed via approved PCI-compliant devices (Stripe Terminal
  or equivalent). The system MUST not implement ad-hoc offline card storage.
- Non-card events (e.g., booking updates, ledger changes) may be queued locally and reconciled
  when connectivity restores.
- Reconciliation procedure: store minimal transaction metadata locally (encrypted), post to
  Stripe as soon as connectivity is available, and mark reconcile status in payments ledger.

Acceptance Criteria
- All payment flows adhere to Stripe best practices; no sensitive card data is logged.
- Receipts generate and store in object storage with access control and retention policy.

Test Cases
- Simulated payment flows in test mode; refunds and receipt generation tests; end-to-end
   reconciliation for daily reports.

### 5) License Management

Scope
- Venue-owned license pools ("Just Play") and optional player accounts.
- Session broker that allocates and revokes accounts to devices/players for timed play.

Inputs
- License purchase, license assignment requests, license revocation commands.

Outputs
- License issuance records, revocation events, audit logs.

Dependencies
- Licensing service, DB for license state, admin UI for license management.

Acceptance Criteria
- License allocation is auditable and revocations are enforced within 5s of the action.

Test Cases
- Allocation/revocation workflows, expiry handling, and pool depletion behavior.

### 6) Gamified UX & Economy

Scope
- Coins wallet system per user, leaderboards, event builder for in-venue tournaments,
   and a rules engine for rewards and promotions.

Inputs
- User actions (play sessions, purchases), admin-configured rules and events.

Outputs
- Coins ledger entries, leaderboard snapshots, event registrations, perk grants.

Dependencies
- Gamification service, event service, payments and membership services.

Acceptance Criteria
- Wallet operations are atomic and ledgered; leaderboards update within acceptable windows;
   reward rules are auditable and testable.

Test Cases
- Wallet credit/debit flows, leaderboard ranking tests, rules-engine policy tests.

### 7) Memberships & Perks

Scope
- Recurring billing via Stripe subscriptions, membership tiers with configurable perks,
   and admin controls to adjust perks and pricing.

Inputs
- Membership signup, upgrade/downgrade requests, billing webhooks from Stripe.

Outputs
- Subscription records, perk entitlements, billing history.

Dependencies
- Stripe subscriptions, membership service, perks configuration storage.

Acceptance Criteria
- Subscription lifecycle aligned with Stripe webhooks; perk entitlements enforced on login.

Test Cases
- Subscription creation, renewal, cancellation, and perk activation tests.

### 8) Add-on Marketplace

Scope
- Microservice plugin model with signed packages and admin UI to enable/disable integrations
(SSO, analytics, loyalty, etc.).

Inputs
- Marketplace package uploads, admin enable/disable commands.

Outputs
- Enabled integrations, compatibility metadata, audit logs of changes.

Dependencies
- Plugin registry, signing key management, runtime sandboxing (container or process isolation).

Acceptance Criteria
- Plugins must be signed and validated prior to enablement; disabling a plugin must not leave
   the system in an inconsistent state.

Test Cases
- Plugin install/uninstall, sandbox isolation verification, compatibility checks.

### 9) Console Support

Scope
- Support console session check-in via QR linking and timed play enforcement for consoles
  integrated into venue devices.
- Vendor SDK integrations (Xbox/PlayStation/Nintendo) are optional and planned for later
  phases; initial rollout uses QR linking and account linking flows.

Inputs
- QR-scan requests, console account linking and session start/stop events.

Outputs
- Linked account records, timed-play enforcement commands sent to devices.

Dependencies
- Console SDK integrations (optional future work), session broker, device service.

Acceptance Criteria
- QR linking flow completes and binds a console session to a user; timed play enforcement
  reliably ends sessions at expiry.
- Vendor SDK integrations documented as optional follow-ups; design includes extension points
  for SDK hooks.

Test Cases
- QR linking end-to-end tests, session enforcement under connectivity loss.

### 10) Security & Compliance

Scope
- mTLS for agent↔backend, RBAC for staff/admin roles, audit logging across payment and
  license events, and data retention/archival policies.

Requirements
- mTLS required for client and inter-service communication where sensitive operations occur.
- RBAC must provide least-privilege roles (admin, manager, support, operator) and be
  enforced in API gateways and services.
- Audit logs MUST capture critical events (auth changes, payment events, license changes) and
  be retained according to policy.
- Payments/PCI owner: Finance & Security compliance team
- Offline payment capture: ONLY via approved PCI-compliant devices; no ad-hoc card storage.

Data Retention
- Payments (transactional payment records): 7 years
- Audit logs: 2 years
- Telemetry (system metrics, non-PII): 90 days
- Receipts (stored copies of payment receipts): 7 years
- Note: These retention values are recorded per request and MUST be validated by the legal/privacy
  owner prior to production rollout.

Acceptance Criteria
- All sensitive API endpoints require mTLS/RBAC; audit log entries for critical operations.
- Reconciliation processes for queued events are auditable and have clear failure/retry behavior.

Test Cases
- Penetration test checklist, RBAC role validation tests, audit log integrity checks.

### 11) Testing & CI/CD

Scope
- Jenkins pipelines to run linters, unit tests, contract tests (OpenAPI/proto), integration
   tests, security scans, and deployment steps.

Requirements
- Each service repo or monorepo package must include unit and contract tests.
- Contract tests for all REST/gRPC endpoints must be executed in CI gates.
- E2E smoke tests for booking and payment flows before production promotion.

Acceptance Criteria
- Jenkins pipelines fail fast on test/security failures and block merges until resolved.

Test Cases
- Unit coverage targets, contract test pass/fail, integration migration verification.

## Migration Plan
Schema migrations MUST be versioned and applied via a migration tool (Flyway/Liquibase). Each
migration must include a rollback or compensating migration where possible.

## Rollback Plan
Service deployment rollbacks should be automated in CI with clear database migration rollback
steps or compatibility strategies (backward-compatible schema changes first).

## Acceptance Criteria (overall)
- Spec artifacts present in `/specs/001-description-baseline-specification/contracts/`.
- Contract tests for public APIs implemented and passing in CI.
- Security sign-off for payment and licensing flows.

## Governance & Sign-off
Required approvers: Product Owner, Tech Lead, Security Owner, Payments Owner. Sign-off lines
required in PRs that implement this spec.

- Payments Owner: Finance & Security compliance team

## Notes
- This document is a baseline. Each module requires a dedicated spec and test plan before
   implementation.

---
*Status: Draft — ready for planning and task generation.*

