import { NextRequest, NextResponse } from 'next/server';
import { platformSignIn } from '@/lib/auth/platform-sign-in';
import type { StaffRoleFamily } from '@/lib/auth/platform-sign-in';
// M2: session middleware / DB verify wired later; here we expose the contract.

export async function POST(req: NextRequest) {
  const requestId = `req-${Date.now()}`;
  try {
    const body = await req.json();
    const payload = {
      email: String(body?.email ?? ''),
      password: String(body?.password ?? ''),
      expectedRole: String(body?.expectedRole ?? '') as StaffRoleFamily,
    };
    // Expected-role validated server-side; form role not trusted.
    const result = await platformSignIn(payload);
    // Audit mutation attempt (success or denied) — safe fields only
    // (actual audit call depends on M2 session/user lookup)
    return NextResponse.json({ success: result.success, sessionToken: result.sessionToken, role: result.role, error: result.error, requestId: result.requestId || requestId }, { status: result.success ? 200 : 403 });
  } catch {
    return NextResponse.json({ success: false, error: 'An error occurred.', requestId }, { status: 500 });
  }
}
