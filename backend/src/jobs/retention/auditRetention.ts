import fs from 'fs';
import path from 'path';

export type AuditRetentionOptions = {
  archiveDir?: string;
  dryRun?: boolean;
};

/**
 * Simple audit retention job (dev harness)
 * - In dryRun it writes a sample archive entry to archiveDir
 */
export async function runAuditRetention(opts: AuditRetentionOptions = {}) {
  const archiveDir = opts.archiveDir || path.join(process.cwd(), 'ops', 'audit-archive');
  const dryRun = opts.dryRun !== undefined ? opts.dryRun : true;

  fs.mkdirSync(archiveDir, { recursive: true });

  const sample = {
    id: 'audit-1',
    event: 'user.login',
    user_id: 'user-123',
    created_at: new Date(Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)).toISOString(), // 2 years ago
  };

  const out = path.join(archiveDir, `audit_${sample.id}.json`);
  if (dryRun) {
    fs.writeFileSync(out, JSON.stringify(sample, null, 2), 'utf8');
    return { archived: 1, files: [out] };
  }

  throw new Error('Non-dry-run mode not implemented in dev harness');
}

if (require.main === module) {
  (async () => {
    try {
      const res = await runAuditRetention({ dryRun: true });
      console.log('Audit retention (dryRun) archived files:', res.files);
    } catch (err) {
      console.error('Audit retention failed:', err);
      process.exit(1);
    }
  })();
}
