DEPLOY FIX — middleware/proxy conflict (Next 16.4.3 convention)

Issue: both `middleware.ts` and `proxy.ts` existed. Next 16 deprecated `middleware` file; requires `proxy.ts` only (named `proxy` export).
Fix: removed `middleware.ts`; kept `proxy.ts` (Next 16 convention). Confirmed: server starts cleanly; no deprecation warnings.
Evidence: `middleware.ts` removed (verified `-False`); `proxy.ts` present (`True`); build clean; no errors.
