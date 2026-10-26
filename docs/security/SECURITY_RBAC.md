# Security, Authentication, Authorization and RBAC
## Role-specific entry paths
`/auth/customer/sign-in`; `/auth/platform/sign-in`; `/auth/company-admin/sign-in`; `/auth/management/sign-in`; `/auth/claims/sign-in`; `/auth/adjuster/sign-in`; `/auth/inspector/sign-in`; `/auth/finance/sign-in`; `/auth/auditor/sign-in`; `/auth/support/sign-in`.
Can share internal auth implementation, but each route supplies an expected role family; server validates account status, role, scope and MFA. Generic mismatch denial prevents account enumeration. Never trust role supplied by form.

## Model
RBAC plus scope/attributes: role → permission; user → role assignment; permission → resource/action; scope self/org/assigned/branch/global; context includes workflow status, amount threshold, ownership and delegation. Central policy service; deny by default. Example permissions: `customers.read`, `staff.invite`, `staff.roles.assign`, `claims.create`, `claims.read.own`, `claims.read.assigned`, `claims.assign`, `claims.transition`, `claims.adjust`, `claims.approve`, `inspections.manage`, `evidence.upload`, `estimates.review`, `finance.settlement.approve`, `reports.export`, `audit.read`, `settings.manage`.

## Controls
- Public registration can create customer accounts only; staff provisioning is permission-gated.
- Proxy/middleware may redirect but never be sole guard. Protect route handlers, server actions, services and object queries.
- Argon2id password hashing; length-first policy and breached-password check; allow password managers.
- Secure, HttpOnly, SameSite cookies; Secure in production; opaque random sessions stored hashed; rotation, idle/absolute expiry and revocation.
- Email verification and single-use hashed reset tokens, short TTL and rate limits.
- MFA/passkeys; mandatory for privileged roles; reauth for roles, exports, settlements and security settings.
- CSRF token/origin checks for cookie mutations. CSP, HSTS HTTPS, frame-ancestors, nosniff, Referrer-Policy, restrictive Permissions-Policy.
- Schema validation, parameterized SQL, rate limits, bounded pagination, idempotency, generic errors.
- Upload private bucket, type/signature/size checks, malware scan, sanitized filename, safe download disposition. Prevent SSRF/path traversal.
- Export formula injection mitigation. Secrets from secret manager/env; never log secrets/tokens.
- Audit actor/action/resource/time/request ID/outcome/scope/reason and safe diff. Do not log credentials or sensitive payloads.
- Agent-plan security rules: deny-by-default server-side middleware; expected-role validation per sign-in route (no form-trusted role); reusable RBAC sidebar (UI never substitutes authorization); separate .env.local/.env.production; image validation (type/size) before sharp conversion; audit model outputs per inspection; no production fixtures in fixtures or logs.

## Threats to test
Account takeover, role escalation, tenant IDOR, claim state manipulation, malicious uploads, secret leakage, brute force, insider export abuse, injection/XSS/CSRF, availability abuse. Audit and access review.
