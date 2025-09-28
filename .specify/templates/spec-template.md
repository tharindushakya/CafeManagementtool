# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```
## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
[Describe the main user journey in plain language]
1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

### Edge Cases
- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]  
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*
- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]
*GATE: Automated checks run during main() execution*


### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous  
*Updated by main() during processing*
## Required Artifacts (MANDATORY)
- OpenAPI (REST) or proto (gRPC) contracts in `/specs/[FEATURE_NAME]/contracts/`
- Data model: `data-model.md` with entities and migration notes
- Test plan: list of unit, integration, and contract tests required
- Security analysis: document mTLS, RBAC, PCI/Stripe implications and data redaction plan

Any spec missing the above artifacts is considered incomplete and MUST not be implemented.

## API Contract
Provide OpenAPI, proto, or link to `/specs/[FEATURE_NAME]/contracts`.

## Data Model
Entities, fields, relationships, and migration considerations.

## Security & Compliance
Document threat model, mTLS usage, RBAC roles, audit logging points, and any PCI scope.

## Tests
List required tests (unit, contract, integration). Each contract must include at least one
contract test that will be executed by CI. Provide test file paths or generation instructions.

## Migration Plan
DB migrations, data corrections, compatibility notes, and rollback steps.

## Rollback Plan
How to revert code and schema changes safely.

## Acceptance Criteria
Concrete, testable criteria (pass/fail) for the feature.

## Governance & Sign-off
Spec MUST include approver(s) and a sign-off line. Security and Payments owners must
explicitly approve specs that touch audit, payment, or licensing domains.

## Notes
[Any additional context]
- [ ] User description parsed
- [ ] Key concepts extracted
- [ ] Ambiguities marked
- [ ] User scenarios defined
- [ ] Requirements generated
- [ ] Entities identified
- [ ] Review checklist passed

---
