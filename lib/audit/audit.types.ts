/**
 * Audit types — actor/action/resource/time/requestId/scope/reason.
 * No sensitive payload; audit for admin mutations (staff provision, role assign, session revoke).
 */
export interface AuditEvent {
  id?: string;
  actorId: string; // user id of actor
  action: string; // e.g. 'staff.provision', 'staff.role_assign', 'session.revoke'
  resource: string; // resource type
  resourceId?: string; // optional target id
  outcome: 'success' | 'failure' | 'denied';
  scope: string; // 'global' | 'org' | 'branch' | 'self'
  reason?: string; // brief reason; never include payload/token/password
  requestId: string;
  timestamp?: Date;
}
