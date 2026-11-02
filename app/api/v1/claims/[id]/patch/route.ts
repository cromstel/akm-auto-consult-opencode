import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth/auth.service';
import { canTransition } from '@/lib/claims/transition-guard';
import { prisma } from '@/lib/db/prisma';

const VALID_STATUSES = [
  'submitted', 'assigned', 'inspected', 'estimated', 'approved', 'resolved',
] as const;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = req.headers.get('x-request-id') ?? 'unknown';
  try {
    const sessionCookie = req.cookies.get('session')?.value ?? '';
    const payload = verifySessionToken(sessionCookie);
    if (!payload) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'The request could not be processed.', requestId } },
        { status: 401 }
      );
    }
    const body: unknown = await req.json();
    if (typeof body !== 'object' || body == null || !('toStatus' in body) || !('fromStatus' in body)) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'The request could not be processed.', requestId } }, { status: 400 });
    }
    const { toStatus, fromStatus, checklistData, verifiedUserId: _verifiedUserId } = body as { toStatus: string; fromStatus: string; checklistData?: string; verifiedUserId?: string };
    if (!VALID_STATUSES.includes(toStatus as typeof VALID_STATUSES[number])) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'The request could not be processed.', requestId } }, { status: 400 });
    }
    if (!canTransition(fromStatus, toStatus)) {
      return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'The request could not be processed.', requestId } }, { status: 403 });
    }
    const { id: claimId } = await params;
    // Ownership verification
    const claim = await prisma.claim.findUnique({ where: { id: claimId }, select: { id: true, customerId: true } });
    if (!claim) {
      return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'The request could not be processed.', requestId } }, { status: 403 });
    }
    const customer = await prisma.customer.findUnique({ where: { userId: payload.userId } });
    const assignment = await prisma.claimAssignment.findFirst({ where: { claimId, userId: payload.userId } });
    const isSelf = !!customer && customer.id === claim.customerId;
    const isAssigned = !!assignment;
    if (!isSelf && !isAssigned && payload.role !== 'admin' && payload.role !== 'auditor') {
      return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'The request could not be processed.', requestId } }, { status: 403 });
    }
    // Persist claim status change
    await prisma.claim.update({ where: { id: claimId }, data: { status: toStatus } });
    // Persist checklist data to Inspection if provided
    if (typeof checklistData === 'string' && checklistData.length > 0) {
      const inspection = await prisma.inspection.findFirst({ where: { claimId } });
      if (inspection) {
        await prisma.inspection.update({ where: { id: inspection.id }, data: { checklistData } });
      } else {
        await prisma.inspection.create({ data: { claimId, inspectorId: 'unassigned', status: 'scheduled', checklistData } });
      }
    }
    await prisma.audit.create({
      data: {
        actorId: payload.userId,
        action: 'claim_transition',
        resource: 'claim',
        resourceId: claimId,
        context: JSON.stringify({ requestId, toStatus, fromStatus }),
        outcome: 'success',
      },
    }).catch(() => {});
    return NextResponse.json({ data: { claimId, newStatus: toStatus }, meta: { requestId } }, { status: 200 });
  } catch {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.', requestId } }, { status: 500 });
  }
}
