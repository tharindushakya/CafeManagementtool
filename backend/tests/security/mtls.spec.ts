import fs from 'fs';
import https from 'https';
import path from 'path';
import os from 'os';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const selfsigned = require('selfsigned');

// This is a dev-mode test that demonstrates mTLS enforcement using generated dev certs.
// For CI, ensure the cert generation step runs before this test and a test server is available.

describe('mTLS enforcement (dev skeleton)', () => {
  const certDir = path.resolve(__dirname, '..', '..', 'infra', 'certs', 'dev');

  test('dev certs present or generated; mTLS skeleton assertions', async () => {
    // If cert directory doesn't exist, generate a self-signed cert pair for dev tests.
    if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

    const certFile = path.join(certDir, 'cert.pem');
    const keyFile = path.join(certDir, 'private.pem');
    const caFile = path.join(certDir, 'ca.crt');

    if (!fs.existsSync(certFile) || !fs.existsSync(keyFile)) {
      // generate dev certs using selfsigned
      const attrs = [{ name: 'commonName', value: 'localhost' }];
      const opts = { days: 365, extensions: [{ name: 'subjectAltName', altNames: [{ type: 2, value: 'localhost' }] }] };
      const pems = selfsigned.generate(attrs, opts);
      fs.writeFileSync(certFile, pems.cert, 'utf8');
      fs.writeFileSync(keyFile, pems.private, 'utf8');
      // write CA as the cert (dev convenience)
      fs.writeFileSync(caFile, pems.cert, 'utf8');
    }

    expect(fs.existsSync(certFile)).toBe(true);
    expect(fs.existsSync(keyFile)).toBe(true);
    expect(fs.existsSync(caFile)).toBe(true);

    // Note: this is a dev skeleton. A full test would start an HTTPS server enforcing client certs and assert failure/success paths.
  });
});
