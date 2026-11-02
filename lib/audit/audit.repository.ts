/**
 * Audit repository — writes to `Audit` table (existing schema.prisma model).
 * All writes parameterized via Prisma; no SQL concat; no payload/logging of secrets.
 */
import type { AuditEvent } from './audit.types';

export interface AuditRepo {
  create(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<string>;
}

// Skeleton using Prisma client (assumes `prisma.audit.create` available)
export const auditRepository: AuditRepo = {
  async create(event) {
    // In production use `import { prisma } from '../db/prisma'` and:
    // await prisma.audit.create({ data: { actorId: event.actorId, action: event.action, resource: event.resource, resourceId: event.resourceId, outcome: event.outcome, context: JSON.stringify({ scope: event.scope, requestId: event.requestId }), reason: event.reason, timestamp: new Date() } });
    // For this backend layer we document required fields; actual DB call wired at M5.
    return `audit-${event.requestId}`;
  },
};
