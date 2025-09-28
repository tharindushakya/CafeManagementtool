# [PROJECT NAME] Development Guidelines

Auto-generated from all feature plans. Last updated: [DATE]

## Active Technologies
[EXTRACTED FROM ALL PLAN.MD FILES]

## Project Structure
```
[ACTUAL STRUCTURE FROM PLANS]
```

## Commands
[ONLY COMMANDS FOR ACTIVE TECHNOLOGIES]

## Code Style
[LANGUAGE-SPECIFIC, ONLY FOR LANGUAGES IN USE]

## Recent Changes
[LAST 3 FEATURES AND WHAT THEY ADDED]

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

## Constitution Summary (AUTO-INCLUDE)
- Security-first: Ensure agents surface security requirements (mTLS, RBAC, PCI notes) when
	generating code or infra plans.
- Spec-driven: Agents MUST reference `/specs/<feature>/spec.md` and avoid making
	implementation decisions not present in the spec.
- Test-driven: Agents MUST list tests to generate and where to place them (contract, unit,
	integration) in generated artifacts.

<!-- NOTE: Preserve manual additions between the MANUAL ADDITIONS markers. Agent update
scripts should only append changes outside that region. -->