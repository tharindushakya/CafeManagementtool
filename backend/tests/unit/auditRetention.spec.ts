import fs from 'fs';
import path from 'path';
import { runAuditRetention } from '../../src/jobs/retention/auditRetention';

describe('audit retention job (dev dry-run)', () => {
  const tmpDir = path.join(__dirname, '..', '..', 'tmp', 'audit-test');
  beforeAll(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('dryRun writes sample audit archive file and returns metadata', async () => {
    const res = await runAuditRetention({ archiveDir: tmpDir, dryRun: true });
    expect(res.archived).toBeGreaterThan(0);
    expect(Array.isArray(res.files)).toBe(true);
    const f = res.files[0];
    expect(fs.existsSync(f)).toBe(true);
    const content = JSON.parse(fs.readFileSync(f, 'utf8'));
    expect(content).toHaveProperty('event');
    expect(content).toHaveProperty('created_at');
  });
});
