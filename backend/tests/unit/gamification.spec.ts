import * as fs from 'fs';
import * as path from 'path';
const gamification = require('../../src/services/gamification');
const snapshotJob = require('../../src/jobs/leaderboard_snapshot');

describe('gamification wallet and leaderboard', () => {
  test('credit, debit, balance, ledger and snapshot', () => {
    const uidA = 'user-a';
    const uidB = 'user-b';
    gamification.credit(uidA, 100, 'signup_bonus');
    gamification.credit(uidB, 200, 'signup_bonus');
    gamification.debit(uidB, 50, 'purchase');

    expect(gamification.getBalance(uidA)).toBe(100);
    expect(gamification.getBalance(uidB)).toBe(150);

    const ledgerA = gamification.getLedger(uidA);
    expect(Array.isArray(ledgerA)).toBe(true);
    expect(ledgerA.length).toBeGreaterThanOrEqual(1);

    const outPath = path.resolve(__dirname, '..', '..', 'tmp', `leaderboard_${Date.now()}.json`);
    const tmpDir = path.dirname(outPath);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const out = snapshotJob.runSnapshot(outPath);
    expect(out).toHaveProperty('snapshot');
    expect(Array.isArray(out.snapshot)).toBe(true);
    expect(out.snapshot[0].userId).toBe(uidB);
  });
});
