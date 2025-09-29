#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const Supervisor = require('./supervisor');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node cli.js <target-script> [--cwd <cwd>] [--log <logfile>]');
  process.exit(2);
}

let target = args[0];
// resolve target to absolute path
if (!path.isAbsolute(target)) target = path.resolve(process.cwd(), target);
// default cwd to the directory containing the target unless overridden
let cwd = path.dirname(target);
let logFile;
for (let i = 1; i < args.length; i++) {
  const a = args[i];
  if (a === '--cwd' && args[i+1]) { cwd = args[i+1]; i++; }
  else if (a === '--log' && args[i+1]) { logFile = args[i+1]; i++; }
}

const sup = new Supervisor(target, { cwd, logFile });
sup.start();

process.on('SIGINT', () => {
  sup.stop();
  process.exit(0);
});
