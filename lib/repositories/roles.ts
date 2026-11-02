import 'server-only';
import { prisma } from '@/lib/db/prisma';

/**
 * Role/permission registry repository (server-only).
 * Phase 2 authorization reads from here — UI never queries roles directly.
 */
export function listRoles() {
  return prisma.role.findMany({ orderBy: { name: 'asc' } });
}

export function findRoleByName(name: string) {
  return prisma.role.findUnique({ where: { name } });
}
