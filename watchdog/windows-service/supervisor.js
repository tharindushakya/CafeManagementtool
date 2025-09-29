const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class Supervisor {
  constructor(target, opts = {}) {
    this.target = target;
    this.args = opts.args || [];
    this.cwd = opts.cwd || process.cwd();
    this.restartDelayMs = opts.restartDelayMs || 200;
    this.logFile = opts.logFile || path.join(this.cwd, 'watchdog_restarts.log');
    this.child = null;
    this.stopped = false;
    this.restartCount = 0;
  }

  _log(msg) {
    const line = `${new Date().toISOString()} ${msg}\n`;
    try {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
      fs.appendFileSync(this.logFile, line);
    } catch (e) {
      // best-effort
      console.error('log write failed', e);
    }
  }

  start() {
    this.stopped = false;
    this._spawn();
  }

  _spawn() {
    if (this.stopped) return;
    // spawn using node if target is a .js file
    const useNode = this.target.endsWith('.js');
    const cmd = useNode ? process.execPath : this.target;
    const args = useNode ? [this.target].concat(this.args) : this.args;

    this.child = spawn(cmd, args, { cwd: this.cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    const pid = this.child.pid;
    this._log(`spawned pid=${pid} target=${this.target}`);

    this.child.on('exit', (code, signal) => {
      this._log(`exited pid=${pid} code=${code} signal=${signal}`);
      if (this.stopped) return;
      this.restartCount += 1;
      this._log(`restarting pid=${pid} count=${this.restartCount}`);
      setTimeout(() => this._spawn(), this.restartDelayMs);
    });

    this.child.stdout && this.child.stdout.on('data', (d) => process.stdout.write(d));
    this.child.stderr && this.child.stderr.on('data', (d) => process.stderr.write(d));
  }

  stop() {
    this.stopped = true;
    if (this.child) {
      try { this.child.kill(); } catch (e) {}
      this.child = null;
    }
    this._log('supervisor stopped');
  }
}

module.exports = Supervisor;
