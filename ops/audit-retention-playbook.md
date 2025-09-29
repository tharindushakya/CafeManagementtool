# Audit Log Retention Playbook

Purpose
- Document steps to archive and secure audit logs older than 2 years.

Steps
1. Run the retention job in dry-run against a reporting DB snapshot and verify expected record counts.
2. Export logs to encrypted cold storage with integrity checks and manifest.
3. Mark records as archived in the DB or move them to an audit_archive table subject to access controls.
4. Keep a signed manifest for compliance and verification.

Rollback
- Restore from cold storage and re-import if needed. Keep WAL backups for point-in-time restores.

CI
- Nightly dry-run job that reports diffs and failing counts.
