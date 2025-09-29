import * as fs from 'fs';
import * as path from 'path';

describe('Proto smoke test (T005) — failing by design', () => {
  test('service.proto should define device messages and RPCs (TDD: initially fail)', () => {
    const protoPath = path.resolve(__dirname, '../../../specs/001-description-baseline-specification/contracts/service.proto');
    const raw = fs.readFileSync(protoPath, 'utf8');

    // Look for core symbols expected in expanded proto definitions. These should fail until proto is expanded.
    expect(raw.includes('DeviceHeartbeat')).toBe(true);
    expect(raw.includes('SendControl')).toBe(true);
  });
});
