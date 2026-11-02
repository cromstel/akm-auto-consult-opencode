import { NextResponse } from 'next/server';
import { denyByDefault } from '@/lib/auth/auth.middleware';
export async function POST(req: Request) {
  const deny = denyByDefault(req);
  if (deny) return deny;
  // Intention: claim intake (Phase 4); body validation omitted for brevity — add Zod schema next
  return NextResponse.json({ success: true, message: 'Claim intake endpoint ready (M4 follow-up)' });
}
