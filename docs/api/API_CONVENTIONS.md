# API Conventions
Base `/api/v1`. JSON; multipart only for uploads. Validate all inputs; authenticate, authorize permission and scope; audit significant mutations. Bounded pagination/filter allowlists. Statuses: 200/201/202/204; 400 validation; 401 unauthenticated; 403 forbidden; 404 absent/out-of-scope where enumeration protection; 409 conflict; 422 domain validation; 429 rate limit; 500 generic. Include correlation ID, never stack/SQL details.
- Agent-plan rules: auth middleware validates expected role server-side per endpoint; deny-by-default scope check; audit all mutations (who, what, time, requestId, scope, reason); image uploads validated before sharp pipeline; AI outputs stored per inspection with audit links.

Success `{ "data": {}, "meta": { "requestId": "opaque", "pagination": { "nextCursor": null } } }`
Error `{ "error": { "code": "VALIDATION_ERROR", "message": "The request could not be processed.", "fields": {}, "requestId": "opaque" } }`

## Endpoint catalog
Identity: `POST /auth/customer/register`, `/auth/customer/verify-email`, role-specific `/auth/{role}/sign-in`, `/auth/sign-out`, `/auth/password/forgot`, `/auth/password/reset`, `/auth/mfa/challenge`, `/auth/mfa/enroll`, `/auth/mfa/confirm`, `GET /auth/sessions`, `DELETE /auth/sessions/{id}`, `POST /auth/sessions/revoke-all`.

Customers/orgs: `GET/POST /customers`, `GET/PATCH /customers/{id}`, `GET/POST /organizations`, `GET/PATCH /organizations/{id}`, `GET /organizations/{id}/members`, `POST /organizations/{id}/members/invitations`, `PATCH /organizations/{id}/members/{memberId}`.

Staff/RBAC: `GET /staff`, `POST /staff/invitations`, `GET/PATCH /staff/{id}`, `POST /staff/{id}/deactivate`, `GET/POST /roles`, `PATCH /roles/{id}`, `GET /permissions`, `PUT /roles/{id}/permissions`.

Vehicles/policies: `GET/POST /vehicles`, `GET/PATCH /vehicles/{id}`, `GET/POST /vehicles/{id}/policies`, `GET/POST /insurers`.

Claims: `GET/POST /claims`, `GET/PATCH /claims/{id}`, `POST /claims/{id}/submit`, `/assign`, `/transition`; `GET /claims/{id}/timeline`, `/notes`, `/messages`; `POST` notes/messages.

Inspection/evidence: `GET/POST /claims/{id}/inspections`, `GET/PATCH /inspections/{id}`, `POST /inspections/{id}/submit`; `POST /claims/{id}/evidence/upload-intent`, `POST /claims/{id}/evidence`, `GET /claims/{id}/evidence`, `DELETE /evidence/{id}`.

Estimates: `GET/POST /claims/{id}/estimates`, `GET/PATCH /estimates/{id}`, `POST /estimates/{id}/submit`, `/review`, `/approve`, `/return`; `POST /estimates/{id}/adjustments`; `GET/POST /claims/{id}/reports`.

Finance: `GET/POST /claims/{id}/invoices`, `GET/PATCH /invoices/{id}`, `POST /invoices/{id}/approve`; `POST /claims/{id}/settlements`, `POST /settlements/{id}/approve`, `/mark-paid`; `GET/POST /finance/payments`, `GET /finance/reconciliation`.

Reports/admin: `GET /reports/claims`, `POST /reports/exports`, `GET /reports/exports/{jobId}`, `GET/PATCH /admin/settings`, `GET /audit-events`, `/health/live`, `/health/ready`.

Phase 3 additions (2026-10-26): `POST /api/v1/evidence` (AVIF pipeline + audit link), `PATCH /api/v1/claims/{id}` (transition guard enforced server-side). Smoke pre-deploy script: `docs/deploy/smoke-checks.ts` (not executed against production until "execute deploy" confirmed). Deploy deferred per user.

## Invariants
Do not accept user/role/org/approver/totals/status as authoritative client fields. Server computes money and workflow. Critical mutations use reason and idempotency as required. OpenAPI should derive from actual schemas and stay current.
