import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { staffRouteGuard } from './middleware/staff-auth';

/**
 * Next 16 proxy.ts (replaces middleware.ts). Deny-by-default for protected
 * routes; propagates x-request-id; passes session cookie through; RBAC guard
 * for /staff/* and /api/analytics/* enforced via staffRouteGuard.
 * Full session verification handled server-side per SECURITY_RBAC.md.
 */
const PROTECTED = ['/customer', '/staff', '/claims', '/admin', '/auth/'];

export function proxy(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') ?? crypto.randomUUID();
  const path = req.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path.startsWith(p));

  const headers = new Headers(req.headers);
  headers.set('x-request-id', requestId);

  // RBAC: staff portal and analytics — deny-by-default with expected-role check
  if (path.startsWith('/staff') || path.startsWith('/staff/') || path.startsWith('/api/analytics/')) {
    const deny = staffRouteGuard(req);
    if (deny) {
      // Preserve request-id on denial responses
      deny.headers.set('x-request-id', requestId);
      return deny;
    }
  }

  let response: NextResponse;
  if (isProtected) {
    const sessionCookie = req.cookies.get('session');
    response = sessionCookie
      ? NextResponse.next({ request: { headers } })
      : NextResponse.redirect(new URL('/auth/customer/sign-in', req.url));
  } else {
    response = NextResponse.next({ request: { headers } });
  }
  response.headers.set('x-request-id', requestId);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
