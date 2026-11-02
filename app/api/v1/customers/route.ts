import { NextResponse } from 'next/server';
import { verifySessionToken, SessionPayload } from '@/lib/auth/auth.service';
import { CustomerRepo } from '@/lib/db/customer.repository';

function getSessionFromCookie(req: Request): SessionPayload | null {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;
  return verifySessionToken(decodeURIComponent(match[1]));
}

export async function GET(req: Request) {
  const session = getSessionFromCookie(req);
  if (!session || session.role !== 'customer') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const customer = await CustomerRepo.findByUserId(session.userId);
  return NextResponse.json({ success: true, data: customer ?? null });
}
