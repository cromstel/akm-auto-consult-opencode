import 'server-only';
import { PrismaClient } from '@prisma/client';

/**
 * Server-only Prisma singleton. Importing this module from client code is a
 * build error — there is no client DB access path in this app.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
