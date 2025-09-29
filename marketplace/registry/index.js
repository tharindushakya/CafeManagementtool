const crypto = require('crypto');

// Simple in-memory registry for prototype purposes
function createRegistryRouter(options = {}) {
  // allow dependency injection of express to avoid module-resolution issues when this folder is outside backend/node_modules
  const express = options.express || require('express');
  const router = express.Router();
  const store = new Map();
  const secret = options.secret || process.env.MARKETPLACE_SECRET || 'dev-marketplace-secret';

  function verifySignature(pkg) {
    const { name, version, code, signature } = pkg;
    if (!signature) return false;
    const payload = JSON.stringify({ name, version, code });
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    } catch (e) {
      return false;
    }
  }

  router.post('/marketplace/packages', express.json(), (req, res) => {
    const pkg = req.body || {};
    if (!pkg.name || !pkg.version || !pkg.code) return res.status(400).json({ error: 'missing_fields' });
    if (!verifySignature(pkg)) return res.status(401).json({ error: 'invalid_signature' });
    const key = `${pkg.name}@${pkg.version}`;
    store.set(key, { name: pkg.name, version: pkg.version, code: pkg.code, uploadedAt: new Date().toISOString() });
    // Also set latest pointer
    store.set(pkg.name, { name: pkg.name, version: pkg.version, code: pkg.code, uploadedAt: new Date().toISOString() });
    res.status(201).json({ ok: true, name: pkg.name, version: pkg.version });
  });

  router.get('/marketplace/packages/:name', (req, res) => {
    const name = req.params.name;
    const pkg = store.get(name);
    if (!pkg) return res.status(404).json({ error: 'not_found' });
    // Return metadata and code so sandbox can run it in tests. In production, code may be omitted
    res.json({ name: pkg.name, version: pkg.version, code: pkg.code, uploadedAt: pkg.uploadedAt });
  });

  // expose internals for tests
  router._internal = { store, verifySignature, secret };
  return router;
}

module.exports = { createRegistryRouter };
