import { NextResponse } from 'next/server';
import type { RoleFamily, Scope } from '@/lib/authorization/authorization';
import { denyByDefault, type AuthContext } from '@/lib/authorization/authorization';
import { verifySessionToken } from '@/lib/auth/auth.service';

const ROLE_SCOPE_MAP: Record<string, Scope> = {
  customer: 'self',
  claims_officer: 'assigned',
  adjuster: 'assigned',
  inspector: 'assigned',
  finance: 'branch',
  auditor: 'global',
  support: 'branch',
  admin: 'global',
  management: 'global',
};

/**
 * Deny-by-default auth middleware. Reads the session cookie server-side,
 * verifies the JWT via auth.service, then enforces the expected role family
 * and global scope for platform staff routes. Never trusts a client-supplied
 * role; mismatches return a generic 401 with no enumeration surface.
 *
 * Called per route via `authGuard(requiredRole, resourceScope?)`. When the
 * request carries no session cookie the middleware returns a 401 denial so
 * protected routes never reach handlers with unauthenticated context.
 */
export function authGuard(requiredRole: RoleFamily, resourceScope: Scope = 'global') {
  return async (req: Request): Promise<NextResponse | null> => {
    try {
      const cookieHeader = req.headers.get('cookie') || '';
      const m = cookieHeader.match(/session=([^;]+)/);
      if (!m) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const ctx = verifySessionToken(decodeURIComponent(m[1]));
      if (!ctx) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const authCtx: AuthContext = {
        userId: ctx.userId,
        role: ctx.role,
        scope: ROLE_SCOPE_MAP[ctx.role] ?? 'global',
        requestId: req.headers.get('x-request-id') || crypto.randomUUID(),
      };
      return denyByDefault(authCtx, requiredRole, resourceScope) ? null : denyResponse();
    } catch {
      return denyResponse();
    }
  };
}

function denyResponse(): NextResponse {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

/** Convenience guard for the staff portal: expects any non-customer staff role. */
export const STAFF_GUARD = authGuard('claims_officer', 'global');
