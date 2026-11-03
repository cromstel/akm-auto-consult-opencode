import { NextResponse } from 'next/server';
import { authGuard } from '@/lib/auth/auth.middleware';

// Claim intake is a Phase 4 (M4) workflow endpoint. Deny-by-default: any
// staff-family session with the claims officer role may create a claim.
// Body validation with a Zod schema lands with the M4 workflow implementation.
const guard = authGuard('claims_officer', 'global');

export async function POST(req: Request) {
  const deny = await guard(req);
  if (deny) return deny;
  return NextResponse.json({ success: true, message: 'Claim intake endpoint ready (M4 follow-up)' });
}
