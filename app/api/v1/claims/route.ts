import { NextRequest, NextResponse } from 'next/server';
import { denyByDefault, type AuthContext, type Scope, type RoleFamily } from '@/lib/authorization/authorization';
import { verifySessionToken } from '@/lib/auth/auth.service';
import { listClaims } from '@/lib/repositories/claims';

export async function GET(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') ?? 'unknown';
  const denied = () =>
    NextResponse.json(
      {
        error: {
          code: 'FORBIDDEN',
          message: 'The request could not be processed.',
          requestId,
        },
      },
      { status: 403 }
    );

  const sessionCookie = req.cookies.get('session');
  if (!sessionCookie) {
    return denied();
  }
  const payload = verifySessionToken(sessionCookie.value);
  if (!payload) {
    return denied();
  }

  const scope: Scope = payload.role === 'customer' ? 'self' : payload.role === 'admin' || payload.role === 'auditor' ? 'global' : 'assigned';
  const ctx: AuthContext = {
    userId: payload.userId,
    role: payload.role,
    scope,
    requestId,
  };

  if (!denyByDefault(ctx, payload.role as unknown as RoleFamily, scope)) {
    return denied();
  }

  const url = new URL(req.url);
  const customerId = url.searchParams.get('customerId') ?? undefined;
  const cursor = url.searchParams.get('cursor') ?? undefined;
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) || undefined : undefined;

  try {
    const result = await listClaims({ customerId, cursor, limit });
    return NextResponse.json({ data: result.items, meta: { requestId, pagination: { nextCursor: result.nextCursor } } });
  } catch {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.', requestId } }, { status: 500 });
  }
}
