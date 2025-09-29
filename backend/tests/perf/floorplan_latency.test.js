/**
 * Synthetic floorplan latency perf test (T026)
 * This test simulates device heartbeats, a floorplan update service that processes
 * heartbeats and notifies connected clients, and measures end-to-end latency
 * from heartbeat emission to client update.
 *
 * This is a self-contained, deterministic perf harness suitable for CI smoke
 * runs. For larger-scale load tests use the k6 script in infra/loadtests/.
 */

const EventEmitter = require('events');

describe('floorplan latency (synthetic)', () => {
  jest.setTimeout(30000);

  test('mean and p95 latency under light load', async () => {
    const emitter = new EventEmitter();

    // Floorplan service: on heartbeat, quickly notify clients with an update
    emitter.on('heartbeat', (hb) => {
      // simulate minimal processing cost
      const processed = { deviceId: hb.deviceId, timestamp: Date.now(), seq: hb.seq };
      // notify clients
      emitter.emit('update', processed);
    });

    // Client: measure latency from heartbeat emission to receiving update
    const latencies = [];

    const clientListen = (deviceId, seq, t0) => {
      return new Promise((resolve) => {
        const onUpdate = (update) => {
          if (update.deviceId === deviceId && update.seq === seq) {
            const latency = Date.now() - t0;
            latencies.push(latency);
            emitter.removeListener('update', onUpdate);
            resolve();
          }
        };
        emitter.on('update', onUpdate);
      });
    };

    // Simulate N devices sending M heartbeats each as quickly as possible
    const devices = 50; // small-ish load for CI
    const heartbeatsPerDevice = 4;

    const sendAll = async () => {
      const promises = [];
      for (let d = 1; d <= devices; d++) {
        for (let s = 1; s <= heartbeatsPerDevice; s++) {
          const seq = s;
          const deviceId = `device-${d}`;
          const t0 = Date.now();
          promises.push(clientListen(deviceId, seq, t0));
          // Fire heartbeat in next tick to allow listener registration
          emitter.emit('heartbeat', { deviceId, seq, ts: t0 });
        }
      }
      await Promise.all(promises);
    };

    await sendAll();

    // Analyze latencies
    const sum = latencies.reduce((a, b) => a + b, 0);
    const mean = sum / latencies.length;
    const sorted = latencies.slice().sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)];

    // Print a compact report to aid CI logs
    console.log(`samples=${latencies.length} mean=${mean.toFixed(1)}ms p95=${p95}ms min=${sorted[0]}ms max=${sorted[sorted.length-1]}ms`);

    // Acceptance thresholds (CI / perf smoke): mean < 200ms and p95 < 500ms
    expect(mean).toBeLessThan(200);
    expect(p95).toBeLessThan(500);
  });
});
