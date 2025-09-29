import fs from 'fs';
import path from 'path';
import os from 'os';

export type RetentionOptions = {
  archiveDir?: string;
  dryRun?: boolean;
};

/**
 * Simple receipts retention job (dev-friendly)
 * - In dryRun mode it simulates finding receipts older than 7 years and writes JSON files to archiveDir
 * - In real mode (not implemented here) it would connect to Postgres and move/archive rows to cold storage
 */
export async function runReceiptsRetention(opts: RetentionOptions = {}) {
  const archiveDir = opts.archiveDir || path.join(process.cwd(), 'ops', 'receipts-archive');
  const dryRun = opts.dryRun !== undefined ? opts.dryRun : true;

  // ensure archive dir exists
  fs.mkdirSync(archiveDir, { recursive: true });

  // For this dev harness we simulate discovery of receipts older than 7 years
  const now = Date.now();
  const sevenYearsMs = 7 * 365 * 24 * 60 * 60 * 1000;
  const sampleOld = {
    id: 'sample-1',
    amount_cents: 499,
    currency: 'USD',
    created_at: new Date(now - sevenYearsMs - 1000).toISOString(),
    archived_at: new Date().toISOString(),
  };

  const archivedFiles: string[] = [];

  if (dryRun) {
    // write a single sample JSON to represent archive
    const out = path.join(archiveDir, `receipt_${sampleOld.id}.json`);
    fs.writeFileSync(out, JSON.stringify(sampleOld, null, 2), 'utf8');
    archivedFiles.push(out);
    return { archived: archivedFiles.length, files: archivedFiles };
  }

  // Placeholder: real implementation would connect to DB and move records to cold storage or archive table
  throw new Error('Non-dry-run mode not implemented in dev harness');
}

// If executed directly, run dry-run and print summary
if (require.main === module) {
  (async () => {
    try {
      const res = await runReceiptsRetention({ dryRun: true });
      console.log('Receipts retention (dryRun) archived files:', res.files);
    } catch (err) {
      console.error('Retention job failed:', err);
      process.exit(1);
    }
  })();
}
