# Validation Report: customers-portal-plan.md

## Implementation Status
✓ Phase / Lane — DB Repository (`lib/db/customer.repository.ts`) — Fully implemented
⚠️ Phase / Lane — API (`app/api/v1/customers/route.ts`) — Partially implemented (GET only, no middleware file per plan, no claim intake endpoint)
⚠️ Phase / Lane — UI (`components/evidence/evidence-upload-form.tsx`) — Rebuilt (fixed broken import); missing planned files (`app/customer/profile/page.tsx`, `components/customer/Card.tsx`, layout enhancement)
✗ Phase M1 Auth Gate (`lib/auth/auth.middleware.ts`) — Not implemented (existing `/auth/customer/sign-in` page exists but no dedicated middleware file)
✗ Phase M2 Customer Profile (`app/customer/dashboard/page.tsx` enhanced) — Not enhanced; profile page missing
✗ Phase M3 Vehicle Link — Not added
✗ Phase M4 Claims Intake API — Not added (only existing `/api/v1/claims` routes present)

## Automated Verification Results
✓ Build: passes for new modules (pre-existing `staff/reports-params.tsx` error unrelated)
✗ Types: 1 error in existing `app/api/v1/claims/route.ts(37,27)` (RoleFamily assignment — pre-existing)
✗ Lint: 7 problems (2 errors: `tmp/add-logo.cjs` require-style + existing issue; 5 warnings — pre-existing / unrelated to portal)
✗ Tests: 0 new tests added for `CustomerRepo` or `/api/v1/customers`; existing suite 5/5 per TODO M7 unchanged

## Code Review Findings

### Matches Plan:
- Database repository (`lib/db/customer.repository.ts`) matches planned scoped query layer (findByUserId, findVehicles, findClaims) using existing Prisma Customer/Vehicle/Claim schema.
- API `GET /api/v1/customers` implements cookie session verification (`verifySessionToken`) and role check (`session.role !== 'customer'` → 401), aligning with security requirements.
- Evidence upload form rebuilt with named export preserved; fixes build-time module-not-found error.
- Plan file written (`opencode/plans/customers-portal-plan.md`) and evidence report (`opencode/plans/customers-portal-plan.tdd.md`); verification task list (`opencode/review-todo.md`).

### Deviations from Plan:
- **Phase M1**: Plan called for `lib/auth/auth.middleware.ts`; actual implementation reused existing `authorization.ts` + cookie-check inside route rather than dedicated middleware file.
  - Assessment: Functionally equivalent (deny-by-default enforced), but deviates from file-level specification.
  - Recommendation: Create `auth.middleware.ts` wrapping authorization rules explicitly if cross-route reuse required.
- **Phase M2**: Plan specified enhanced `app/customer/dashboard/page.tsx` + new `app/customer/profile/page.tsx` + `components/customer/Card.tsx`; none created/modified.
  - Assessment: Portal pages (`/customer/dashboard`, `/customer/claims`) already exist from prior work; enhancements deferred.
  - Recommendation: Add profile/card components before M2 gate.
- **Phase M3**: Plan specified vehicle link/page; `app/customer/vehicles/page.tsx` exists but no DB link enhancement or new route created.
- **Phase M4**: Plan specified claim intake API + status tracking endpoint; only pre-existing claim routes present (`/api/v1/claims` and claim state patches).
- **Plan deviation noted in conversation**: User requested parallel agents; subagent session mechanism unavailable, so direct multi-lane edits executed sequentially by agent.

### Additional Deviations / Improvements:
- API route uses direct cookie parsing (`req.headers.get('cookie')`) rather than a shared `authService.getSession()` — `auth.service.ts` exports `verifySessionToken`, not `getSession`; this is a correct adaptation.
- Customer repository uses relative import (`./prisma`) corrected during review (was `../prisma` initially); no impact.
- Evidence form rewritten as clean multi-line component to resolve build-time module export failure.

### Potential Issues / Edge Cases:
- `CustomerRepo.findByUserId` does not explicitly check `customer` exists before accessing `claim`/`vehicle` arrays; `prisma.customer.findUnique` returns `null` and caller must handle — current API route handles (`customer ?? null`).
- No pagination/filter params in `/api/v1/customers`; plan did not specify pagination but future scaling may need it.
- `/api/v1/customers` only supports `GET`; no `POST` for profile/update — plan implied profile management.
- No tests cover `CustomerRepo`; regression risk if schema changes.
- Security: cookie session relies on `AUTH_SESSION_SECRET`; verified missing-secret throws at token creation but route only checks `verifySessionToken` (returns `null` if secret missing) — safe fail-closed behavior.
- Existing `app/customer/layout.tsx` does not include RBAC sidebar per PRD Phase 1; out of scope for this review but worth noting.

### Manual Testing Required:
1. UI / Portal:
   - [ ] `/auth/customer/sign-in` loads and validates expected role server-side (mismatch = generic deny)
   - [ ] `/customer/dashboard` displays customer-scoped claims/vehicles from DB
   - [ ] `/customer/claims` loads with `EvidenceUploadForm` visible and upload succeeds to `/api/v1/evidence`
   - [ ] `/customer/vehicles` shows registered vehicles linked to customer profile
   - [ ] New `/customer/profile` page (if created later) shows editable profile fields
2. Integration:
   - [ ] `GET /api/v1/customers` with valid session cookie returns customer data; invalid/missing cookie → 401; wrong role (`platform`) → 401
   - [ ] Customer registration creates `Customer` row linked to `User` with `role='customer'`
3. Security / Edge:
   - [ ] Attempting `/api/v1/customers` with `localStorage`-style token (no cookie) is denied
   - [ ] Attempting `/api/v1/claims` with another customer's claim ID is blocked by scope check (verify `authorization.ts` enforces; if missing, vulnerability)

## Recommendations:
- Create `lib/auth/auth.middleware.ts` explicitly to match plan file specification and allow reuse across `/api/*` routes.
- Complete M2/M3 pages (`profile/page.tsx`, `Card.tsx`, layout sidebar) and M4 claim intake endpoint (`POST /api/v1/claims/intake`) before closing M7.
- Add at least unit tests for `CustomerRepo.findByUserId` and integration tests for `/api/v1/customers` (auth success/failure cases) to meet 80% coverage requirement.
- Fix pre-existing `app/api/v1/claims/route.ts` type error (`RoleFamily` assignment at line 37) and `tmp/add-logo.cjs` lint error separately.
- Confirm `prisma/migrations/` includes any new indexes if `CustomerRepo` performance degrades; current schema has relations; check for missing `customerId` index on `Claim`/`Vehicle` if needed.

## Status Update
Plan file `opencode/plans/customers-portal-plan.md` frontmatter: review completed. Evidence saved. Implementation partially complete — DB lane fully done, API partly done, UI rebuilt but missing planned pages; security requirements satisfied at route level.
