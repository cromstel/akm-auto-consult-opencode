import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth/auth.service';
import { processEvidence } from '@/lib/pipeline/avif-evidence';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
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
    const form = await req.formData();
    const file = form.get('file');
    const auditLink = form.get('auditLink');
    if (!(file instanceof File) || !auditLink || typeof auditLink !== 'string') {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'The request could not be processed.', requestId } }, { status: 400 });
    }
    // Derive claimId from auditLink format: evidence:{claimId}:{requestId}
    const parts = auditLink.split(':');
    const claimId = parts[1] || '';
    if (!claimId) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'The request could not be processed.', requestId } }, { status: 400 });
    }
    // Ownership verification: customer self or assigned staff
    const claim = await prisma.claim.findUnique({ where: { id: claimId }, select: { id: true, customerId: true } });
    if (!claim) {
      return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'The request could not be processed.', requestId } }, { status: 403 });
    }
    const customer = await prisma.customer.findUnique({ where: { userId: payload.userId } });
    const assignment = await prisma.claimAssignment.findFirst({ where: { claimId, userId: payload.userId } });
    const isSelf = !!customer && customer.id === claim.customerId;
    const isAssigned = !!assignment;
    if (!isSelf && !isAssigned && payload.role !== 'admin' && payload.role !== 'auditor' && payload.role !== 'global') {
      return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'The request could not be processed.', requestId } }, { status: 403 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await processEvidence(buffer, auditLink);
    // Find or create inspection for claim
    let inspection = await prisma.inspection.findFirst({ where: { claimId }, select: { id: true } });
    if (!inspection) {
      inspection = await prisma.inspection.create({ data: { claimId, inspectorId: 'unassigned', status: 'scheduled', checklistData: null } });
    }
    await prisma.evidence.create({
      data: {
        inspectionId: inspection.id,
        filePath: result.avifPath,
        originalName: file.name,
        thumbnailPath: null,
        optimizedFormat: 'avif',
      },
    });
    await prisma.audit.create({
      data: {
        actorId: payload.userId,
        action: 'evidence_upload',
        resource: 'evidence',
        resourceId: inspection.id,
        context: JSON.stringify({ requestId, auditLink, claimId }),
        outcome: 'success',
      },
    }).catch(() => {});
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.', requestId } }, { status: 500 });
  }
}
