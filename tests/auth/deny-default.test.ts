import { describe, it, expect } from 'vitest';
import { denyByDefault, type AuthContext, type Scope } from '@/lib/authorization/authorization';

describe('deny-by-default guard', () => {
  const baseCtx: AuthContext = { userId: 'u1', role: 'customer', scope: 'self', requestId: 'r1' };

  it('denies missing context', () => {
    expect(denyByDefault(null as unknown as AuthContext, 'customer', 'self')).toBe(false);
  });
  it('denies wrong role', () => {
    expect(denyByDefault({ ...baseCtx, role: 'adjuster' }, 'customer', 'self')).toBe(false);
  });
  it('denies insufficient scope', () => {
    expect(denyByDefault({ ...baseCtx, scope: 'self' as Scope }, 'customer', 'branch')).toBe(false);
  });
  it('allows matching role + scope', () => {
    expect(denyByDefault({ ...baseCtx, role: 'customer', scope: 'self' as Scope }, 'customer', 'self')).toBe(true);
  });
  it('allows global scope on any resource', () => {
    expect(denyByDefault({ ...baseCtx, scope: 'global' as Scope }, 'customer', 'branch')).toBe(true);
  });
});
