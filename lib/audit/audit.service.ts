/**
 * Audit service — safe audit writes; only safe fields emitted.
 * Admin mutations (staff.provision, staff.role_assign, staff.revoke) audited.
 * Never include password, token, payload, or DB connection strings.
 */
import { auditRepository } from './audit.repository';
import type { AuditEvent } from './audit.types';

export async function auditAdminMutation(
  actorId: string,
  action: string,
  resource: string,
  resourceId: string | undefined,
  outcome: 'success' | 'failure' | 'denied',
  scope: string,
  reason: string | undefined,
  requestId: string
): Promise<string> {
  const event: Omit<AuditEvent, 'id' | 'timestamp'> = {
    actorId,
    action,
    resource,
    resourceId,
    outcome,
    scope,
    reason,
    requestId,
  };
  return auditRepository.create(event);
}
