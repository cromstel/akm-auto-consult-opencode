import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js 16 convention: proxy.ts (renamed from middleware.ts); named `proxy` export.
// Deny-by-default optimistic guard ONLY — real session validation and role checks
// happen server-side in route handlers/pages (proxy is not an authorization layer).

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protected areas: require a session cookie before entering; otherwise redirect.
  if (path.startsWith('/customer') || path.startsWith('/staff') || path.startsWith('/claims/')) {
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/auth/customer/sign-in', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/customer/:path*', '/staff/:path*', '/claims/:path*', '/api/claims/:path*', '/api/inspections/:path*'],
};
