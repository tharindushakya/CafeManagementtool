Jenkins seed job: Approving Script Security Signatures

If your seed job (Job DSL) fails with "ERROR: script not yet approved for use", Jenkins' Script Security plugin blocked one or more signatures used by the DSL/script. A Jenkins administrator must inspect and approve the pending signatures before the seed job will run.

Recommended steps (admin only):

1) Inspect & Approve via UI (recommended)
  - Open Jenkins -> Manage Jenkins -> In-process Script Approval
  - Review pending signatures and approve those you trust
  - Re-run the seed job (the seed-job build)

2) Approve from the Script Console (admin-only, quicker)
  - Open Jenkins -> Manage Jenkins -> Script Console
  - Paste the contents of `.jenkins/approve-pending-signatures.groovy` (this repo)
  - Run the script. It will print pending signatures and then approve them all.
  - Example output:
    - "Pending: <signature1>"
    - "Approved: <signature1>"
  - Re-run the seed job

Security note:
  - Only approve signatures from trusted sources. Approving everything blindly can grant scripts the ability to perform sensitive operations.
  - Prefer the UI where you can inspect the code/signature. Use the Script Console method only when an admin has reviewed the pending signatures or for a trusted local development Jenkins.

If you continue to see failures after approving signatures:
  - Check the seed job console output for the exact signature(s) and re-check the In-process Script Approval page.
  - Ensure the pipeline job DSL script points to the correct repository and branch (this repo uses `main` as the default branch). Update `.jenkins/pipeline-job.groovy` if needed.

Re-seeding tips:
  - After approving signatures, re-run the seed job in the Jenkins UI (or trigger it via the seed job's "Build Now").
  - Verify the created job (e.g., "CafeManagementTool-baseline") appears and is configured to use `Jenkinsfile` in the repository.
