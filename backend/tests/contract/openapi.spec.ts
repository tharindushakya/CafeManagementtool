import * as fs from 'fs';
import * as path from 'path';

describe('OpenAPI contract tests (T005) — failing by design', () => {
  test('openapi.yaml should declare booking and payments paths (TDD: initially fail)', () => {
    const specPath = path.resolve(__dirname, '../../../specs/001-description-baseline-specification/contracts/openapi.yaml');
    const raw = fs.readFileSync(specPath, 'utf8');

    // Expected paths for the MVP contract. These assertions are intended to fail until the contract is expanded.
    expect(raw.includes('/bookings')).toBe(true);
    expect(raw.includes('/payments/create-intent')).toBe(true);
  });
});
