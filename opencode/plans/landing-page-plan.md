# Landing Page Design — AKM Auto Consult
Plan file: opencode/plans/landing-page-plan.md (design-direction, per skill)

## Contract (checkable)
- Product: motor claim adjustment / inspection / settlement platform (Ghana, VAT + NHIL/GETFund, GHS).
- Audience: customer (register, submit claim, track), staff (claims/inspections/finance/admin), partner/integrator.
- Job: the landing must immediately communicate the workflow (claims -> inspections -> estimates -> settlement) and direct each persona to their portal — without generic hero copy or decorative graphics.
- Constraints: Tailwind v4 token system (CSS first); dark/light via `.dark`; no new dependencies; `getAppName()` drives title; `proxy.ts` middleware; AVIF + audit links; server-only auth; responsive; accessibility (keyboard, reduced-motion, focus management, labels); 0 fixtures.

## Direction
- Purpose: operational dashboard landing (dense, scannable, quiet — not marketing).
- Audience: staff repeating claim workflow; customer checking status.
- Tone: refined, technical, calm (industrial teal + muted slate; not purple/gradient).
- Memorable detail: a subtle grid/line pattern behind the hero (geometric, not decorative) that echoes the claim-tracking timeline; cards use border + card-foreground token rather than shadow-heavy tiers.
- Responsive: mobile 1-col narrow, desktop 3-col with sticky nav; long labels wrap (tested at narrow viewport).

## Content States (recorded with reason when not applicable)
- Loading: stable skeleton structure; cancellation supported via Suspense.
- Empty: shown when DB unavailable (placeholder message with sign-in action); not hidden.
- Error: generic failure message with retry link (security / docs/security/SECURITY_RBAC.md).
- Partial: featured cards shown when some data missing; unavailable portions clearly marked.
- Success: portal cards visible; next action shown (sign-in / claim submit / admin).
- Permission: protected-route message shown generically without role leak (deny-by-default).

## Evidence (local artifacts; never upload to external service)
- File: opencode/plans/landing-page-evidence.json
- Viewports: ["375x812", "1440x900"] — mobile narrow + desktop wide
- Artifacts: rendered PNG screenshots (produced locally via browser preview — stored at docs/assets/landing-*.png)
- Accessibility: keyboard nav verified; reduced-motion respected (`prefers-reduced-motion: reduce` in CSS); focus-visible visible; labels present.
