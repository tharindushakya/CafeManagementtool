
# Implementation Plan: 001-description-baseline-specification — Gaming Café Management (baseline)

**Branch**: `001-description-baseline-specification` | **Date**: 2025-09-29 | **Spec**: `specs/001-description-baseline-specification/spec.md`
**Input**: Feature specification from `specs/001-description-baseline-specification/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
This plan implements the baseline feature for the Gaming Café Management System described in
`specs/001-description-baseline-specification/spec.md`. Primary goals covered here are:
- Secure Windows 11 kiosk client with watchdog and telemetry
- Linux microservices backend (REST + gRPC) providing booking, device state, payments,
  license management, gamification and a marketplace
- Contract-first development: OpenAPI + proto contracts and contract tests
- A hybrid tenancy model (shared control plane + venue-scoped data) and PCI-aware POS

The plan covers Phase 0 (research) and Phase 1 (design/contracts) outputs already
produced: `research.md`, `data-model.md`, `quickstart.md` and contract stubs under
`contracts/`. It prepares the project for Phase 2 (task generation & implementation).

s
## Technical Context

Note: a couple of reasonable assumptions were made to make the plan actionable. If you prefer
different stack choices I can update these quickly.

### Language/Version

- Backend: Node.js 20.x with TypeScript 5.x (microservices). (Assumption: Node/TS stack for
   fast iteration and wide ecosystem; can be swapped to Go/Python if you prefer.)
- Frontend: React 18 + TypeScript for the booking/admin UI.
- Kiosk client: Windows 11 native app (Electron or native .NET/WinUI) with a thin
   gRPC client for control/telemetry.

### Primary Dependencies

- REST: OpenAPI 3.0 (express/fastify + TypeScript types generated), gRPC: protobuf for
   inter-service/device control.
- DB: PostgreSQL 14+ with migrations (Flyway/liquibase or node-based tool), Redis for
   session and pub/sub.
- Payments: Stripe + Stripe Terminal integration (test-mode until security sign-off).

### Storage

PostgreSQL primary store, Redis for ephemeral/session state, object store for
receipts/archives.

### Testing

- Unit: Jest (backend + frontend). Integration: supertest / Playwright for UI flows.
- Contract tests: Dredd or Prism for OpenAPI; grpcurl-based smoke checks for proto.

### Target Platform

Linux for backend services; Windows 11 kiosk clients; web browsers for booking/admin UIs.

### Project Type

Web application with separate backend microservices + kiosk native client.

### Performance Goals

Floorplan real-time updates target <2s under normal load; watchdog restart within 5s.
Other perf goals TBD in Phase 0 follow-ups.

### Constraints

PCI compliance (no ad-hoc card storage), mTLS between kiosk and backend for sensitive ops,
offline-capable kiosk telemetry queueing with encrypted local storage.

### Scale/Scope

Initial MVP scoped to a single-venue demo deployment, designed to scale to multi-venue
operation with tenant scoping (hybrid model documented in spec).

## Constitution Check
*GATE: Completed initial evaluation based on `.specify/memory/constitution.md`. This check
must be re-run after Phase 1 final design.*

Summary status: INITIAL CHECK: PASS — plan meets the constitution gates with noted
mitigations.

Gate details:
- Security-first: REQUIRED. Notes: mTLS required for kiosk↔backend sensitive RPCs; RBAC
   enforced at API gateway and services. PCI scope limited to Stripe/Stripe Terminal SDK and
   an isolated payments service. Audit logging required for payments, license allocation and
   admin changes. Mitigation: include security sign-off by Finance & Security compliance
   team before production payment rollout. (Status: PASS w/mitigation)
- Spec-driven: REQUIRED. Notes: Spec located at
   `specs/001-description-baseline-specification/spec.md`. OpenAPI and proto artifacts are
   present under `contracts/` (currently stubs). Plan requires completing contracts before
   implementation tasks are created. (Status: PASS)
- Kiosk reliability: REQUIRED. Notes: Kiosk lockdown implemented via native Windows shell
   or Electron in kiosk mode + a Windows Service watchdog that restarts client within 5s.
   Watchdog design and tests included in `research.md` and client acceptance criteria. (Status: PASS)
- Extensibility: REQUIRED. Notes: Marketplace plugin model requires signed packages, a
   plugin registry, and sandboxing (container or process isolation). These are documented in
   the spec and must be captured as security review items in Phase 1. (Status: PASS)
- Test-driven: REQUIRED. Notes: Contract tests will be generated from OpenAPI/proto and
   executed in CI gates. Unit, integration and e2e tests are part of Phase 1 outputs. (Status: PASS)
- Resilience: REQUIRED. Notes: Kiosk offline queueing with encrypted local storage,
   idempotent reconciliation and reconcile_status on payment records (see data-model.md).
   Offline card capture is restricted to approved PCI devices. (Status: PASS)
- Transparency: REQUIRED. Notes: Admin metrics (client health, booking throughput, payment
   success rate, reconcile failures) and OpenAPI/proto artifacts are required for public
   documentation. (Status: PASS)

If any of the above gates needs a deviation, record a Complexity Tracking entry with the
justification and approver (product & security). Current status: no exceptions requested.

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->
```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
