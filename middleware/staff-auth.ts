/**
 * M2 Middleware — Deny-by-default RBAC for staff routes.
 * Enforces: session verified -> expected role family matches -> scope check.
 * Generic denial (401/403) on any mismatch. No UI-derived role strings.
 * Audit: admin mutations are logged server-side; never expose session secrets.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth/auth.service';
import { denyByDefault, type RoleFamily, type Scope, type AuthContext } from '@/lib/authorization/authorization';

/** Supported staff route families — must match authorization.ts. */
const STAFF_ROLES: Record<string, RoleFamily> = {
  staff: 'admin',          // staff portal defaults to admin family
  admin: 'admin',
  analytics: 'admin',
  claims: 'claims_officer',
  finance: 'finance',
  inspections: 'inspector',
  reports: 'auditor',
};

/** Extract AuthContext from request cookie securely. */
function buildAuthContext(req: NextRequest, token: string): AuthContext | null {
  const payload = verifySessionToken(token);
  if (!payload || !payload.role || typeof payload.role !== 'string') return null;
  const scope = (req.headers.get('x-scope') || 'global') as Scope;
  if (!['self', 'assigned', 'branch', 'global'].includes(scope)) return null;
  return {
    userId: payload.userId,
    role: payload.role.trim(),
    scope,
    requestId: req.headers.get('x-request-id') || `req-${Date.now()}`,
  };
}

/** Middleware enforcing deny-by-default RBAC with expected-role validation + scope check.
 * Returns NextResponse (deny) or null (allow). Caller must audit admin mutations.
 */
export function staffAuthMiddleware(
  req: NextRequest,
  requiredRole: RoleFamily,
  resourceScope: Scope = 'global'
): NextResponse | null {
  // 1. Token presence
  const cookie = req.headers.get('cookie') || '';
  const m = cookie.match(/session=([^;]+)/);
  if (!m) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Verify signature + payload integrity (secure — secret only in env)
  const token = decodeURIComponent(m[1]);
  const ctx = buildAuthContext(req, token);
  if (!ctx) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // 3. Expected-role family validation (deny-by-default)
  const allowed = denyByDefault(ctx, requiredRole, resourceScope);
  if (!allowed) {
    // Generic denial — never reveal which check failed (security: don't leak role mismatch vs scope mismatch)
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  // 4. Audit guard: admin mutations must log server-side (never log session secrets or payloads)
  // Caller is responsible for writing audit entries to DB/log; middleware never exposes session.
  // DECIMAL-safe: analytics endpoint uses integer pesewas (DECIMAL) — never float.
  return null;
}

/** Factory for /staff/* route middleware with family derived from path. */
export function staffRouteGuard(req: NextRequest): NextResponse | null {
  const path = req.nextUrl.pathname;
  const family = path.includes('/analytics') ? 'admin'
    : path.includes('/admin') ? 'admin'
    : path.includes('/finance') ? 'finance'
    : path.includes('/claims') ? 'claims_officer'
    : path.includes('/inspections') ? 'inspector'
    : path.includes('/reports') ? 'auditor'
    : 'admin'; // staff portal defaults deny-by-default
  const scope = (req.headers.get('x-scope') || 'global') as Scope;
  return staffAuthMiddleware(req, family, scope);
}
