#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function rand(seed) {
  let x = seed % 2147483647;
  return function() { x = x * 16807 % 2147483647; return x; };
}

function makeUsers(n, rng) {
  const users = [];
  for (let i = 1; i <= n; i++) {
    users.push({
      id: `user-${i}`,
      email: `user${i}@example.test`,
      name: `User ${i}`,
      createdAt: new Date(2020, 0, i).toISOString()
    });
  }
  return users;
}

function makeDevices(n) {
  const d = [];
  for (let i = 1; i <= n; i++) d.push({ id: `device-${i}`, type: i % 2 === 0 ? 'kiosk' : 'pos', active: true });
  return d;
}

function makePayments(n, users, devices, rng) {
  const p = [];
  for (let i = 1; i <= n; i++) {
    const user = users[(i - 1) % users.length];
    const device = devices[(i - 1) % devices.length];
    p.push({
      id: `pay-${i}`,
      userId: user.id,
      deviceId: device.id,
      amount: ((i * 37) % 2000) / 100,
      currency: 'USD',
      status: i % 10 === 0 ? 'refunded' : 'completed',
      createdAt: new Date(2021, (i % 12), (i % 28) + 1).toISOString()
    });
  }
  return p;
}

function usage() {
  console.log('Usage: node generate-dev-data.js --out <path> --users N --devices N --payments N');
  process.exit(1);
}

const argv = require('minimist')(process.argv.slice(2));
if (!argv.out) usage();
const usersN = parseInt(argv.users || '5', 10);
const devicesN = parseInt(argv.devices || '3', 10);
const paymentsN = parseInt(argv.payments || '10', 10);
const seed = parseInt(argv.seed || '12345', 10);

const rng = rand(seed);
const users = makeUsers(usersN, rng);
const devices = makeDevices(devicesN);
const payments = makePayments(paymentsN, users, devices, rng);

const out = { generatedAt: new Date().toISOString(), users, devices, payments };
fs.writeFileSync(path.resolve(argv.out), JSON.stringify(out, null, 2));
console.log('Wrote', argv.out);
