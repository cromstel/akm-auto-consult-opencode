import { prisma } from './prisma';

/** EstimateRepo — integer pesewas (DECIMAL), deny-by-default scopes, audit-on-change.
 * NEVER float: input amounts must be integers (pesewas / minor units); DB DECIMAL(12,2) stores them.
 */
export const EstimateRepo = {
  findByClaimId: (claimId: string, scope: string) => {
    if (scope !== 'self' && scope !== 'assigned' && scope !== 'global') throw new Error('DENIED');
    return prisma.estimate.findMany({ where: { claimId }, include: { claim: { include: { customer: true, vehicle: true } } }, orderBy: { createdAt: 'desc' } });
  },
  findById: (id: string, scope: string) => {
    if (scope !== 'self' && scope !== 'assigned' && scope !== 'global') throw new Error('DENIED');
    return prisma.estimate.findUnique({ where: { id }, include: { claim: true } });
  },
  create: (data: { claimId: string; itemData: string; total: number; taxConfig: string; status?: string }) => {
    // DECIMAL guard: total must be integer pesewas (never float)
    if (typeof data.total !== 'number' || !Number.isInteger(data.total)) throw new Error('DECIMAL_INVALID: total must be integer pesewas');
    return prisma.estimate.create({ data: { ...data, status: data.status || 'draft', version: 1 } });
  },
  updateStatus: async (id: string, status: string, actorId?: string, scope: string = 'global') => {
    if (scope !== 'self' && scope !== 'assigned' && scope !== 'global') throw new Error('DENIED');
    const allowed = ['draft', 'review', 'approved', 'settled', 'rejected', 'returned'];
    if (!allowed.includes(status)) throw new Error('INVALID_STATUS');
    const est = await prisma.estimate.update({ where: { id }, data: { status }, include: { claim: true } });
    // Audit entry on approval / settlement (never log tokens / secrets)
    await prisma.audit.create({
      data: {
        actorId: actorId || 'system',
        action: 'estimate_status_change',
        resource: 'Estimate',
        resourceId: id,
        context: JSON.stringify({ scope, previousStatus: est.status, newStatus: status }),
        outcome: 'success',
      },
    });
    return est;
  },
  listStaff: (scope: string) => {
    if (scope !== 'self' && scope !== 'assigned' && scope !== 'global') throw new Error('DENIED');
    return prisma.estimate.findMany({ include: { claim: { include: { customer: true } } }, orderBy: { createdAt: 'desc' }, take: 50 });
  },
};
