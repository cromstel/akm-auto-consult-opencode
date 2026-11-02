/**
 * Root middleware — wires staff RBAC for /staff/* and analytics API.
 * Deny-by-default. No secrets exposed. DECIMAL-safe analytics endpoint enforced.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { staffRouteGuard } from './middleware/staff-auth';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Staff portal routes — enforce expected-role + scope
  if (path.startsWith('/staff') || path.startsWith('/staff/')) {
    const deny = staffRouteGuard(req);
    if (deny) return deny;
  }

  // Analytics endpoint — auth + scope enforced (generic denial on mismatch)
  if (path.startsWith('/api/analytics/')) {
    const deny = staffRouteGuard(req);
    if (deny) return deny;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/staff/:path*', '/api/analytics/:path*'],
};
