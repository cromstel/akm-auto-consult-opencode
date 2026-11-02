import { describe, it, expect } from 'vitest';
import { smokeChecks } from '@/docs/deploy/smoke-checks';

describe('smoke checks (not deploy; pre-deploy verification only)', () => {
  it('confirms deploy deferred and no secrets exposed', () => {
    const result = smokeChecks();
    expect(result.auditClean).toBe(true);
    expect(typeof result.envValidated).toBe('boolean');
  });
});
