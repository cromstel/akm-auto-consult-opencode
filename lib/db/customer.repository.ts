import { prisma } from './prisma';

export interface CustomerFilters {
  userId?: string;
  organization?: string;
}

export const CustomerRepo = {
  findByUserId: (userId: string) =>
    prisma.customer.findUnique({ where: { userId }, include: { vehicles: true, claims: true } }),
  findVehicles: (customerId: string) =>
    prisma.vehicle.findMany({ where: { customerId } }),
  findClaims: (customerId: string) =>
    prisma.claim.findMany({ where: { customerId }, include: { vehicle: true, notes: true } }),
};
