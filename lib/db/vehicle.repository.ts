import { prisma } from './prisma';

export interface VehicleFilters {
  customerId: string;
  make?: string;
  year?: number;
}

export const VehicleRepo = {
  findByCustomerId: (customerId: string, scope: string) => {
    if (scope !== 'self' && scope !== 'global') throw new Error('DENIED');
    return prisma.vehicle.findMany({ where: { customerId }, include: { claims: true } });
  },
  findById: (id: string) =>
    prisma.vehicle.findUnique({ where: { id }, include: { customer: true, claims: true } }),
  create: (data: { customerId: string; make: string; model: string; year: number; vin?: string }) =>
    prisma.vehicle.create({ data }),
  update: (id: string, data: Partial<{ make: string; model: string; year: number; vin?: string }>) =>
    prisma.vehicle.update({ where: { id }, data }),
  delete: (id: string) => prisma.vehicle.delete({ where: { id } }),
};
