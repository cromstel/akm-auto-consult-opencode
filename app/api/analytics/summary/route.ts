import { NextRequest, NextResponse } from 'next/server';
import { analyticsSummary } from '@/lib/db/analytics/summary.service';
import { staffRouteGuard } from '@/middleware/staff-auth';

export async function GET(req: NextRequest) {
  // Deny-by-default: enforce expected role (admin family) + scope before any DB access.
  const deny = staffRouteGuard(req);
  if (deny) return deny;
  const requestId = `req-${Date.now()}`;
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope') || 'global';
    const from = searchParams.get('from') || undefined;
    const to = searchParams.get('to') || undefined;
    // Parameterized / scoped: only allow known scope values; never pass raw
    // strings to raw SQL. Numeric status goes inside `{ status }` ResponseInit.
    const allowedScopes = ['global', 'org', 'branch', 'self'];
    if (!allowedScopes.includes(scope)) {
      return NextResponse.json({
        success: false,
        data: { claimCount: 0, inspectionCount: 0, settlementGhsPesewas: 0, activeStaffCount: 0 },
        meta: { requestId, generatedAt: new Date().toISOString(), note: 'Invalid scope.' },
        error: 'Access denied.',
      }, { status: 403 });
    }
    const result = await analyticsSummary({ requestId, scope, from, to });
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    return NextResponse.json({ success: false, data: { claimCount: 0, inspectionCount: 0, settlementGhsPesewas: 0, activeStaffCount: 0 }, meta: { requestId, generatedAt: new Date().toISOString(), note: 'Failure — details omitted.' }, error: 'An error occurred.' }, { status: 500 });
  }
}
