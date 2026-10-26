import { NextRequest, NextResponse } from 'next/server';
import { denyByDefault, type AuthContext, type Scope } from '@/lib/authorization/authorization';

export async function GET(req: NextRequest) {
  // Deny-by-default: no session cookie => denied generically; no role leak
  const sessionCookie = req.cookies.get('session');
  if (!sessionCookie) {
    return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
  }
  // Skeleton: full DB lookup + role/scope validation performed server-side (Agent 2)
  const ctx: AuthContext = { userId: 'u-placeholder', role: 'customer', scope: 'self' as Scope, requestId: 'r-placeholder' };
  if (!denyByDefault(ctx, 'customer', 'self')) {
    return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
  }
  return NextResponse.json({ success: true, data: [], message: 'Claims list (DB lookup server-only)' });
}
