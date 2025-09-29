# Receipts Retention & Archival Playbook

Purpose
- Document the operational steps to archive receipts older than 7 years and validate legal retention.

Prerequisites
- Access to production read-replica or reporting DB; credentials stored in the vault.
- Cold storage account (S3/GCS/Blob) with proper encryption and lifecycle rules.

Recommended workflow (safe path)
1. Run in a disposable environment against a read-replica. Use `backend/src/jobs/retention/receiptsRetention.ts` in dry-run mode to preview archived items.
2. Validate sample output files and reconcile counts with application DB queries.
3. Create compensating migration or tombstone flagging for records marked archived.
4. Copy archives to cold storage with server-side encryption; verify checksums.
5. Rotate policy to remove local copies after verification and legal sign-off.

Verification
- Compare counts between DB query and archived objects. Store a signed manifest with checksums.

Legal sign-off
- Obtain sign-off from Legal/Compliance before deleting any originals. Keep manifests for audit.

Rollback
- If issues, restore objects from cold storage (if retained) and reinstate original records from a snapshot or WAL replay.

CI Integration
- Add a job that runs the retention job in dry-run on a nightly schedule against a snapshot and reports diffs.
