import { prisma } from './prisma';

export const ClaimRepo = {
  findByCustomerId: (customerId: string, scope: string) => {
    if (scope !== 'self' && scope !== 'assigned' && scope !== 'global') throw new Error('DENIED');
    return prisma.claim.findMany({ where: { customerId }, include: { customer: true, vehicle: true, notes: true, estimates: true } });
  },
  findById: (id: string, scope: string) => {
    if (scope !== 'self' && scope !== 'assigned' && scope !== 'global') throw new Error('DENIED');
    return prisma.claim.findUnique({ where: { id }, include: { customer: true, vehicle: true, inspections: true, notes: true, estimates: true } });
  },
  create: (data: { claimNumber: string; customerId: string; vehicleId: string; status?: string; priority?: string }) =>
    prisma.claim.create({ data }),
  updateStatus: (id: string, status: string) =>
    prisma.claim.update({ where: { id }, data: { status } }),
};
