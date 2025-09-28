# Phase 0: Research Notes — Gaming Café Management

This document collects short research outcomes required before design decisions.

1. PCI / Stripe Terminal
   - Confirmed owner: Finance & Security compliance team (see spec clarifications).
   - Action: get list of approved Stripe Terminal models and PCI operational checklist.

2. Console SDKs
   - Initial plan: QR linking; vendor SDKs planned later. Research access and licensing.

3. Multi-tenancy
   - Hybrid model selected: shared services with optional per-venue DBs.
   - Action: evaluate row-level security (RLS) vs. separate schemas for tenant isolation.

4. Offline reconciliation
   - Confirm local encryption, replay protection, and idempotency strategies.

5. Telemetry & Logging
   - Define telemetry schema (non-PII), retention pipeline (90 days), and storage costs.

Output: attach findings to plan.md and feed into data-model.md and quickstart.md
