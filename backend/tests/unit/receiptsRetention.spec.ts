import fs from 'fs';
import path from 'path';
import { runReceiptsRetention } from '../../src/jobs/retention/receiptsRetention';

describe('receipts retention job (dev dry-run)', () => {
  const tmpDir = path.join(__dirname, '..', '..', 'tmp', 'receipts-test');
  beforeAll(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test('dryRun writes sample archive file and returns metadata', async () => {
    const res = await runReceiptsRetention({ archiveDir: tmpDir, dryRun: true });
    expect(res).toHaveProperty('archived');
    expect(res.archived).toBeGreaterThan(0);
    expect(Array.isArray(res.files)).toBeTruthy();
    // file exists
    const f = res.files[0];
    expect(fs.existsSync(f)).toBeTruthy();
    const content = JSON.parse(fs.readFileSync(f, 'utf8'));
    expect(content).toHaveProperty('id');
    expect(content).toHaveProperty('created_at');
  });
});
