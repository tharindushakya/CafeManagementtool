<!--
SYNC IMPACT REPORT

Version change: template -> 1.0.0

Modified principles: placeholders -> concrete principles
  - Security-first
  - Spec-driven
  - Kiosk reliability
  - Extensible
  - Test-driven
  - Resilience
  - Transparency

Added sections:
  - Architecture & Tech Constraints
  - Development Workflow & Quality Gates

Templates requiring updates:
  - .specify/templates/plan-template.md: ⚠ pending review
  - .specify/templates/spec-template.md: ⚠ pending review
  - .specify/templates/tasks-template.md: ⚠ pending review
  - .specify/templates/commands/*.md: ⚠ pending review

Deferred items / TODOs:
  - RATIFICATION_DATE: TODO(RATIFICATION_DATE): original adoption date unknown

-- End Sync Impact Report
-->

# CafeManagementtool — Gaming Café Management Constitution

## Core Principles

### Security-first

All networked components MUST authenticate and encrypt traffic using mTLS by default. Access
control MUST be role-based (RBAC) with auditable permission grants and revocations. All
payment integrations (Stripe, Stripe Terminal) and license operations MUST comply with PCI and
Stripe guidance; payment-sensitive logs MUST be redacted. Audit logging MUST record critical
events (authn/authz changes, license issuance, refunds, billing changes) and be retained per
policy. Rationale: operating venues and handling payments require the highest practical
assurance; these requirements are testable via integration tests and audit log verification.

### Spec-driven

Engineering work flows ONLY from formally approved specs. A feature or change MUST have a
spec created from `.specify/templates/spec-template.md` and approved before implementation.
Specs MUST include API contracts (OpenAPI + proto), data schemas, privacy/security analyses,
and a test plan. Rationale: reduces ad-hoc releases, ensures consistent APIs (REST + gRPC), and
makes reviews objective and reproducible.

### Kiosk reliability

Client software for Windows 11 MUST run in a kiosk-style locked shell with a supervising watchdog
service that auto-restarts the client and isolates the system from shell breakout. The client
MUST enforce OS-level lockdown (taskbar, alt-tab prevention, screen-lock behavior) and detect
tampering. Rationale: venues require predictable, secure, and tamper-resistant user sessions.

### Extensible

System architecture MUST be modular: microservices with clear, versioned APIs and a plugin
marketplace for add-ons and integrations. Services MUST support backward-compatible extension
points and explicit deprecation policies. Marketplace packages MUST be sandboxed and signed.
Rationale: venues will require customizations, 3rd-party add-ons, and safe extensibility.

### Test-driven

All new features and critical fixes MUST be accompanied by automated tests (unit, integration,
contract) defined in the spec. Jenkins CI pipelines MUST run these tests and block merges on
failures. Rationale: ensures regressions are caught early and that policy requirements (security,
payment flows) are validated continuously.

### Resilience

System components MUST tolerate intermittent connectivity. Clients and edge agents MUST queue
actions (bookings, payments (where permitted), telemetry) locally and reconcile with server
state when connectivity is restored. Services MUST provide idempotent APIs and reconciliation
mechanisms. Rationale: venues may experience network outages; operational continuity is
business-critical.

### Transparency

APIs, admin dashboards, and user-facing policies MUST be documented clearly. The admin panel
MUST expose operational metrics, audit trails, and service health. Public API docs (OpenAPI)
and SDKs SHOULD be kept in sync with runtime behavior. Rationale: operators must be able to
observe and manage venue operations and trust the platform.

## Architecture & Tech Constraints

The system implements the following mandatory technology and integration constraints:

- Windows 11 kiosk-style client with locked-down shell and a watchdog service.
- Linux-based backend stack with an admin web panel.
- APIs: REST (OpenAPI) for web clients and gRPC for inter-service and performance-sensitive
  paths; both MUST be versioned.
- Database: PostgreSQL as primary persistent store; migrations via a tracked tool (e.g., Flyway,
  Liquibase, or similar).
- Payments: Stripe core API, Stripe Terminal for in-venue card acceptance; all PCI-relevant
  flows MUST follow Stripe recommendations and be isolated from logs and debug dumps.
- License & account model: support venue ("Just Play") scoped licenses and user account
  licensing with audit trails and expiry/renewal workflows.
- Marketplace/add-on support: signed packages, compatibility metadata, and runtime sandboxing.
- Console and timed-play support: integration points for Xbox/PlayStation/Nintendo consoles with
  account linking and timed session enforcement.

## Development Workflow & Quality Gates

- Spec-first development: Every change originates from a spec created from
  `.specify/templates/spec-template.md` and includes API contracts and tests.
- CI: Jenkins pipelines MUST run linters, unit tests, contract tests, integration tests, and
  security scans; merge gates block failures.
- Semantic versioning for services (MAJOR.MINOR.PATCH). MAJOR changes are breaking (remove
  or redefine principles), MINOR for new non-breaking features (new principle/section), PATCH
  for wording/typo fixes and clarifications.
- Release process MUST include a migration/rollback plan for schema or contract changes.
- Code reviews MUST verify spec compliance, security implications, and test coverage.

## Governance

Amendments to this constitution require a documented proposal (spec) and approval by the core
maintainers. For non-trivial changes, a migration and compliance plan MUST be provided. The
convention for versioning is semantic. Compliance reviews (security, PCI, privacy) MUST be
recorded in PRs and the audit log.

All operational exceptions MUST be documented, time-limited, and reviewed within a defined
window (default 30 days).

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2025-09-29

