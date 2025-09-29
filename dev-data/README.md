This directory contains small, synthetic development fixtures useful for local development and tests.

Guidelines
- Keep files small (<1MB) so the repository stays lightweight.
- Do NOT commit large production exports or sensitive data (PII, secrets).
- For larger or realistic datasets, generate them on-demand using the included generator or store them in a separate artifact repository (S3, Google Cloud Storage, or release assets).

Usage
- To create a sample dataset run (requires Node.js):

  node dev-data/generate-dev-data.js --out dev-data/sample-data.json --users 10 --devices 5 --payments 20

Files
- `sample-data.json` — a tiny example included for quick experiments.
- `generate-dev-data.js` — a small Node script that emits deterministic synthetic JSON fixtures.

If your team needs larger datasets for CI or performance tests, consider using Git LFS or hosting the data in an artifact store and referencing it via CI job steps.
