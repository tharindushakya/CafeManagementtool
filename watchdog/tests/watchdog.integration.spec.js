const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const SUPERVISOR_CLI = path.resolve(__dirname, '..', 'windows-service', 'cli.js');
const KIOSK = path.resolve(__dirname, '..', 'windows-service', 'fake_kiosk.js');
const LOG = path.resolve(__dirname, '..', 'windows-service', 'watchdog_restarts.log');

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

describe('watchdog supervisor', () => {
  let sup;

  beforeAll(() => {
    if (fs.existsSync(LOG)) fs.unlinkSync(LOG);
  });

  test('restarts kiosk within 5s after crash', async () => {
    // start supervisor
    sup = spawn(process.execPath, [SUPERVISOR_CLI, KIOSK], { stdio: 'inherit' });

    // wait for the log file to appear (kiosk spawned)
    const deadlineFile = Date.now() + 3000;
    while (!fs.existsSync(LOG) && Date.now() < deadlineFile) {
      await wait(100);
    }
    expect(fs.existsSync(LOG)).toBe(true);

    // read log and try to extract pid
    let content = fs.readFileSync(LOG, 'utf8');
    const spawned = content.match(/spawned pid=(\d+)/);
    let pid = null;
    if (spawned) pid = parseInt(spawned[1], 10);

    // if we have a pid, try kill it to simulate crash; otherwise, write an exit to the child process by killing the supervisor's child indirectly
    if (pid) {
      try { process.kill(pid); } catch (e) { /* ignore */ }
    } else {
      // best-effort: touch the log to trigger restart path by sending SIGTERM to all node processes in this cwd (not ideal on Windows)
    }

    // wait up to 5s for a restart entry
    const deadline = Date.now() + 5000;
    let restarted = false;
    while (Date.now() < deadline) {
      await wait(200);
      content = fs.readFileSync(LOG, 'utf8');
      if (content.match(/restarting pid=\d+/)) { restarted = true; break; }
    }

    // cleanup
    if (sup) {
      try { sup.kill(); } catch (e) {}
    }

    expect(restarted).toBe(true);
  }, 20000);
});
