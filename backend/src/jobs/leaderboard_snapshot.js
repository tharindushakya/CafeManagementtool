const fs = require('fs');
const path = require('path');
const gamification = require('../services/gamification');

function runSnapshot(outPath) {
  const snapshot = gamification.snapshotLeaderboard(50);
  const out = { generatedAt: new Date().toISOString(), snapshot };
  if (outPath) fs.writeFileSync(path.resolve(outPath), JSON.stringify(out, null, 2));
  return out;
}

module.exports = { runSnapshot };
