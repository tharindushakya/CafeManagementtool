/**
 * This test is intentionally lightweight and verifies the kiosk config values that
 * enforce lockdown behavior. It's a unit-style test acting as an E2E sanity check
 * (running real Electron in CI is heavy and out of scope for this skeleton).
 */

describe('kiosk lockdown skeleton', () => {
  test('window should be configured for kiosk/fullscreen', () => {
    // Instead of launching Electron, assert the main.js creates a Window with expected options
    const fs = require('fs');
    const main = fs.readFileSync(require.resolve('../../src/main.js'), 'utf8');
    expect(main.includes('kiosk: true')).toBe(true);
    expect(main.includes('fullscreen: true')).toBe(true);
  });
});
