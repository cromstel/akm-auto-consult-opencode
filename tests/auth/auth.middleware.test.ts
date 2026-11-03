import { describe, it, expect } from 'vitest';
import type { AuthContext, Scope, RoleFamily } from '@/lib/authorization/authorization';
import { denyByDefault, requireAuthGuard, requireExactRole } from '@/lib/authorization/authorization';

const staffCtx: AuthContext = {
  userId: 'usr-001',
  role: 'claims_officer',
  scope: 'assigned' as Scope,
  requestId: 'req-test-01',
};

const adminCtx: AuthContext = { ...staffCtx, role: 'admin', scope: 'global' as Scope };

describe('denyByDefault RBAC', () => {
  it('denies missing context', () => {
    expect(denyByDefault(null as unknown as AuthContext, 'admin', 'global')).toBe(false);
    expect(denyByDefault({ userId: '', role: '', scope: 'global' as Scope, requestId: 'r' }, 'admin', 'global')).toBe(false);
  });

  it('denies unknown role family', () => {
    const bad = { ...staffCtx, role: 'customer' };
    expect(denyByDefault(bad, 'admin', 'global')).toBe(false);
  });

  it('denies scope mismatch', () => {
    const ctx = { ...adminCtx, scope: 'self' as Scope };
    expect(denyByDefault(ctx, 'admin', 'branch')).toBe(false);
    expect(denyByDefault(ctx, 'admin', 'self')).toBe(true);
  });

  it('passes exact family + global for staff', () => {
    expect(denyByDefault(staffCtx, 'claims_officer', 'global')).toBe(true);
    expect(denyByDefault(adminCtx, 'admin', 'global')).toBe(true);
  });

  it('requireAuthGuard wraps denyByDefault', () => {
    expect(requireAuthGuard('claims_officer', 'global')(staffCtx)).toBe(true);
    expect(requireAuthGuard('admin', 'global')(staffCtx)).toBe(false);
  });

  it('requireExactRole matches exact name', () => {
    expect(requireExactRole(staffCtx, 'claims_officer')).toBe(true);
    expect(requireExactRole(staffCtx, 'claims_officer ')).toBe(false);
    expect(requireExactRole(staffCtx, 'admin')).toBe(false);
  });
});
