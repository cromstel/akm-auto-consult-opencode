# PRD — AKM Auto Consult by CITGROUP
Version 1.0 | 2026-10-25

## Vision and goals
Secure web platform for customer/company management, motor claim intake, inspection, loss adjusting, estimate adjustment, approval, settlement, reporting and audit. Improve traceability, turnaround, customer visibility and operational control.

## Personas / roles
Platform Owner/Super Admin; Company Admin; Management; Claims Officer; Loss Adjuster; Inspector/Surveyor; Finance Officer; Read-only Auditor; Support Officer; Customer/Company Customer. Permissions are granular and independently assigned; role names are not scattered as UI checks.

### Milestones / agent orchestration
Plan file: opencode/plans/agent-org-plan.md. 3-agent parallel team: Agent 1 (Frontend/UI + RBAC sidebar/theme), Agent 2 (Backend/DB + claims workflow/auth middleware), Agent 3 (AI/image pipeline + quality/security gates). Milestones M1-M7; checkpoint gates at M2 (auth), M4 (claims), M7 (deploy). Apply best recommendations from plan and security docs at each milestone.

## Functional requirements
### Public/onboarding
Public service/contact/FAQ/privacy/terms pages. Customer-only registration with verification and abuse controls. Organization registration can create an organization and first owner. Staff cannot self-register. Organization member invitation/approval supported.

### Authentication and authorization
Separate role paths: `/auth/customer/sign-in`, `/auth/platform/sign-in`, `/auth/company-admin/sign-in`, `/auth/management/sign-in`, `/auth/claims/sign-in`, `/auth/adjuster/sign-in`, `/auth/inspector/sign-in`, `/auth/finance/sign-in`, `/auth/auditor/sign-in`, `/auth/support/sign-in`. Validate expected role, status, scope and MFA server-side. Password reset, email verification, session revoke, MFA and audit.

### Customers/company/vehicles/policies
Profiles, contacts, organization members, statuses, duplicate detection, vehicle registration/VIN/make/model/year/mileage, insurer and policy details, coverage dates, sum insured, excess and private policy documents.

### Claims
Incident intake with date/time/location/narrative, vehicle, policy, third parties and evidence. Triage, priority, assignment, SLA, internal/customer notes, event timeline, state machine and authorized reopening/cancellation.

### Inspection/evidence
Scheduling, assignee, checklist, report, mobile upload, category/caption/checksum/metadata, chain of custody. Private storage, file type/signature/size validation, malware scan and short-lived signed URLs.

### Estimate/adjustment
Line items with quantity, labor/parts, costs, tax code, source and currency. Preserve submitted estimate; adjustments separately versioned with reason, actor, timestamp and evidence. Distinguish depreciation, betterment, excess/contribution and unsupported damage. Server computes totals with decimal-safe logic. Tax configuration effective-dated; no presumed rates. Review/approval and immutable approved versions.

### Documents, finance and notifications
Generate claim/inspection/estimate/adjustment reports, letters, invoices and settlement statements with template versions. Finance includes invoices, receipts, payment/settlement records and reconciliation, maker/checker and configurable thresholds. Email/SMS/in-app provider adapter, retries and customer preferences.

### Reporting/admin
Role dashboards, claim aging/status/insurer/team reports, scoped exports, system settings, staff provisioning, role/permission management, audit events, retention and access reviews.

## Non-functional
OWASP/ASVS-aligned security; MySQL transactional integrity; backup/restore; observability; privacy/retention; accessibility WCAG 2.2 AA; responsive; performance and bundle budgets set by owner; timezone/currency/locale configurable.

## Acceptance criteria
Customer can register/verify/sign in/submit claim/upload/view only scoped records. Staff creation is admin-only. Role-specific auth routes reject role mismatch. Every protected API/action enforces auth+permission+scope. Cross-tenant tests pass. Invalid workflow transitions rejected and audited. Money tests pass. Public/staff shells separate. Secrets not in repository/build. Lint/typecheck/tests/migrations/build pass. Security, accessibility, backup and release signoffs completed.

## Success measures
Claim intake completion, assignment/inspection/assessment/settlement duration, backlog aging, customer self-service, audit completeness, auth abuse, API error rate, uptime and customer satisfaction; establish baseline/targets with management.
