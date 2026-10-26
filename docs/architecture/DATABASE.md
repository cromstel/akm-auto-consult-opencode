# MySQL Data Model
Use InnoDB, utf8mb4, strict mode, UTC timestamps, FK constraints and migrations. Money uses DECIMAL or integer minor units, never float. IDs consistently UUID/ULID or generated; avoid exposed sequential identifiers.

## Logical tables
Identity/RBAC: `users`, `user_profiles`, `organizations`, `organization_members`, `staff_profiles`, `roles`, `permissions`, `role_permissions`, `user_roles`, `sessions`, `mfa_methods`, `password_reset_tokens`, `email_verification_tokens`, `auth_events`, `audit_events`.

Customer/motor: `customers`, `vehicles`, `insurers`, `policies`, `third_parties`.

Claims: `claims`, `claim_events`, `claim_notes`, `claim_assignments`, `claim_contacts`.

Inspection/evidence: `inspections`, `inspection_checklist_items`, `evidence_files`, `documents`.

Estimates: `estimates`, `estimate_items`, `adjustments`, `tax_rules`, `assessment_reports`.

Finance: `invoices`, `payments`, `payment_allocations`, `settlements`, `finance_approvals`.

Operations: `notifications`, `notification_preferences`, `business_settings`, `number_sequences`, `report_jobs`, optional `webhook_events`.

## Key columns/relationships
- `users`: unique normalized email, password hash, status, verification and timestamps.
- Agent-plan milestone references: M2 auth gate requires role/permission registry (roles, permissions, user_roles, audit_events) and deny-by-default middleware; M4 claims gate requires claim_events timeline with state machine and cross-tenant isolation; M5 AI requires audit storage of model outputs linked to inspections; M6 estimates requires DECIMAL item/total calculations with visible tax/depreciation; M7 deploy requires schema migration/rehearsal and backup strategy.
- Organization membership unique on organization/user; role assignments have scope and expiration.
- `claims`: unique claim number, customer/org, vehicle/policy/insurer, incident timestamp, status, priority, assignee/team, currency, submit/close times.
- `claim_events`: actor, from/to status, reason, visibility, timestamp.
- `evidence_files`: private storage key, safe original name, media type, size, checksum, category, scan state.
- `estimates`: claim, version, status, currency, subtotal/tax/total, approver and supersedes.
- `estimate_items`: item type, quantity/unit cost, submitted amount, tax code/source.
- `adjustments`: type (depreciation/betterment/excess/contribution/unsupported/other), amount/percentage, reason, evidence, author.
- Finance records are append/void/reconcile rather than hard-delete.

## Integrity
Unique normalized email; policy uniqueness per insurer where appropriate; normalized registration/VIN according to ownership rules. Index claim status/assignee/created, organization/customer/created, VIN/registration, evidence claim, audit resource/action/time. Use explicit organization scope in queries. Transactions and idempotency keys for claim submission, transitions, settlements and payments. Optimistic concurrency for approval edits. Delete policy must preserve audit and finance.

## Migrations — restricted dev user (operational)
The dev DB user (`akm_autoconsult`) holds `ALL PRIVILEGES` on `akm_autoconsult_dev.*` only and **cannot create databases server-wide**, so `prisma migrate dev` fails (P3014/P1010: shadow-database access denied). Do not retry `migrate dev` with this user. Use the manual-baseline workflow instead:

1. Generate SQL offline (no DB connection): `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/<NN>_<name>/migration.sql` (on Windows, use `cmd /c` redirection to avoid UTF-16 encoding).
2. Ensure `prisma/migrations/migration_lock.toml` exists with `provider = "mysql"`.
3. Apply without shadow DB: `npx prisma migrate deploy`.
4. Verify: `npx prisma migrate status` must report "Database schema is up to date!".

Current state: baseline `0_init` applied to `akm_autoconsult_dev` (11 model tables + `_prisma_migrations`; MySQL on Windows lowercases table names — expected, Prisma-compatible). Optional future fix: provision a dedicated shadow DB (e.g. `_prisma_shadow`) with full grants for this user, or run `migrate dev` with a `shadowDatabaseUrl`, to re-enable the normal dev workflow.
