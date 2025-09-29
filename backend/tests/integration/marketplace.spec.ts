import request from 'supertest';
import express from 'express';
const crypto = require('crypto');
const { createRegistryRouter } = require('../../../marketplace/registry');
const { runPlugin } = require('../../../marketplace/sandbox/runner');

describe('marketplace registry and sandbox', () => {
  let app: express.Express;
  beforeAll(() => {
    app = express();
    // create router with known secret for test; inject express to avoid module resolution issues
    app.use('/', createRegistryRouter({ secret: 'test-secret', express }));
  });

  test('upload signed package, retrieve and run sandbox', async () => {
    const pkg = { name: 'demo-plugin', version: '1.0.0', code: "module.exports = { run: () => 'ok' }" };
    const payload = JSON.stringify({ name: pkg.name, version: pkg.version, code: pkg.code });
    const signature = crypto.createHmac('sha256', 'test-secret').update(payload).digest('hex');
    const postRes = await request(app).post('/marketplace/packages').send({ ...pkg, signature });
    expect(postRes.status).toBe(201);

    const getRes = await request(app).get(`/marketplace/packages/${pkg.name}`);
    expect(getRes.status).toBe(200);
    const remote = getRes.body;
    expect(remote.version).toBe(pkg.version);

    const plugin = runPlugin(remote.code);
    expect(plugin.run()).toBe('ok');
  });
});
