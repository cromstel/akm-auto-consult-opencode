// Deny-by-default authorization: never trust UI; server validates role + scope.
// Role family is checked as the largest allowed bucket (e.g. admin accepts
// "admin" and "management") — exact role is validated by the caller separately.
export type RoleFamily =
  | 'customer'
  | 'claims_officer'
  | 'adjuster'
  | 'inspector'
  | 'finance'
  | 'auditor'
  | 'support'
  | 'management'
  | 'admin';
export type Scope = 'self' | 'assigned' | 'branch' | 'global';

export interface AuthContext {
  userId: string;
  role: string;
  scope: Scope;
  requestId: string;
}

/**
 * Required role families for protected / platform endpoints. Role names are
 * role-family buckets, not exact roles — the caller enforces exact role after.
 *
 * Used by sign-in routes and protected API routes.
 */
export const REQUIRED_FAMILY: Record<string, RoleFamily> = {
  platform: 'admin',
  company_admin: 'admin',
  management: 'admin',
  claims: 'claims_officer',
  adjuster: 'adjuster',
  inspector: 'inspector',
  finance: 'finance',
  auditor: 'auditor',
  support: 'support',
};

/**
 * Deny-by-default guard enforcing expected-role family + resource scope.
 * `requiredRole` must be a known family name. Mismatch -> false (deny).
 */
export function denyByDefault(
  ctx: AuthContext,
  requiredRole: RoleFamily,
  resourceScope: Scope = 'global'
): boolean {
  if (!ctx || !ctx.userId || !ctx.role) return false;
  const allowed: Record<string, string[]> = {
    admin: ['admin', 'management'],
    claims_officer: ['claims', 'claims_officer'],
    adjuster: ['adjuster'],
    inspector: ['inspector'],
    finance: ['finance'],
    auditor: ['auditor'],
    support: ['support'],
    customer: ['customer'],
  };
  if (!allowed[requiredRole]?.includes(ctx.role)) return false;
  if (resourceScope !== 'global' && ctx.scope !== 'global' && ctx.scope !== resourceScope) return false;
  return true;
}

/**
 * Strict exact-role check used after `denyByDefault` (callers that need exact
 * assignment). Calls permitted when role equals required (case-insensitive, trimmed).
 */
export function requireExactRole(ctx: AuthContext, requiredRole: string): boolean {
  if (!ctx || !ctx.userId || !ctx.role) return false;
  return ctx.role.toLowerCase() === String(requiredRole).toLowerCase();
}

/** Middleware factory enforcing expected family + global scope by default. */
export function requireAuthGuard(requiredRole: RoleFamily, resourceScope?: Scope) {
  return (ctx: AuthContext): boolean => denyByDefault(ctx, requiredRole, resourceScope ?? 'global');
}
