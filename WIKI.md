# Product Wiki
## Product purpose
Centralize AKM Auto Consult customer/company operations and motor claim adjustment workflow.

## Glossary
Customer account: publicly registered person. Organization: business customer. Claim: incident plus evidence and assessment. Inspection: scheduled field/remote assessment. Estimate: itemized repair/replacement cost. Adjustment: documented estimate change. Contribution/excess: policy share, distinct from depreciation/betterment. Evidence: private image/document/report. RBAC: server-enforced role/permission model.

## Modules
1 Public website/onboarding; 2 identity/session/MFA; 3 customers/organizations/members; 4 vehicles/insurers/policies; 5 claims/intake/assignment/timeline; 6 inspections/checklists; 7 private evidence; 8 estimates/adjustments/taxes/approval; 9 document generation/versioning; 10 finance/invoice/settlement/reconciliation; 11 messages/notifications; 12 dashboards/reports/exports; 13 settings/audit/access review.

## Agent Plan & Milestones
Plan: opencode/plans/agent-org-plan.md. 3-agent parallel orchestration: Agent 1 (Frontend/RBAC/ui), Agent 2 (Backend/DB/claims), Agent 3 (AI/image/quality). Milestones: M1 scaffold; M2 auth (gate); M3A customer/staff shells + M3B DB + M3C image pipeline; M4 claims (gate); M5 AI; M6 estimates/PDF; M7 deploy (gate). Security rules apply at every milestone; no production fixtures; .env.local/.env.production only.

## Lifecycle
Draft → Submitted → Triage → Assigned → Inspection Scheduled → Inspected → Assessment In Progress → Review Pending → Approved / Rejected / Returned → Repair or Settlement In Progress → Settled → Closed. Cancellation and reopening require authorized audited operations. Implement explicit transition rules; no arbitrary status edits.

## Portals
Public: services/contact/legal/customer registration. Customer: own profile/org, vehicles, claims, timeline, requested docs, evidence upload, messages and permitted invoices. Staff: only authorized queues and operations. Admin: provisioning, roles, configuration, audit. Financial and sensitive evidence access is restricted.

## UX
Responsive WCAG 2.2 AA target; light/dark semantic theme; public and dashboard shells distinct; permission-aware reusable nav; server-side pagination/filtering; loading/empty/error/forbidden/not-found states; high-risk actions confirm and require reason.
