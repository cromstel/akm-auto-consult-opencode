// Deny-by-default authorization: never trust UI; server validates role + scope.
export type RoleFamily = 'customer' | 'claims_officer' | 'adjuster' | 'inspector' | 'finance' | 'auditor' | 'support' | 'admin';
export type Scope = 'self' | 'assigned' | 'branch' | 'global';

export interface AuthContext {
  userId: string;
  role: string;
  scope: Scope;
  requestId: string;
}

// Minimal deny-by-default guard skeleton (to be enforced per handler)
export function denyByDefault(ctx: AuthContext, requiredRole: string, resourceScope: Scope): boolean {
  if (!ctx || !ctx.userId) return false;
  if (ctx.role !== requiredRole) return false;
  if (ctx.scope !== resourceScope && resourceScope !== 'global' && ctx.scope !== 'global') return false;
  return true;
}
