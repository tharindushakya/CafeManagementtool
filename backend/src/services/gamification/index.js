// Minimal gamification service (in-memory) for dev and unit tests
const wallets = new Map();
const ledger = new Map();

function ensureWallet(userId) {
  if (!wallets.has(userId)) {
    wallets.set(userId, 0);
    ledger.set(userId, []);
  }
}

function credit(userId, amount, reason = 'credit', metadata = {}) {
  ensureWallet(userId);
  const prev = wallets.get(userId);
  const next = prev + Number(amount);
  wallets.set(userId, next);
  const entry = { id: `entry-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, userId, change_amount: Number(amount), balance_after: next, reason, metadata, created_at: new Date().toISOString() };
  ledger.get(userId).push(entry);
  return entry;
}

function debit(userId, amount, reason = 'debit', metadata = {}) {
  return credit(userId, -Math.abs(Number(amount)), reason, metadata);
}

function getBalance(userId) {
  ensureWallet(userId);
  return wallets.get(userId);
}

function getLedger(userId) {
  ensureWallet(userId);
  return ledger.get(userId).slice();
}

function snapshotLeaderboard(topN = 10) {
  const items = [];
  for (const [userId, balance] of wallets.entries()) items.push({ userId, balance });
  items.sort((a, b) => b.balance - a.balance);
  return items.slice(0, topN);
}

module.exports = { credit, debit, getBalance, getLedger, snapshotLeaderboard, _internal: { wallets, ledger } };
