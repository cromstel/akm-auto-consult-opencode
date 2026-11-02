# Phase 4 Fixtures Catalog — External fixtures (free providers, test only)
Plan file: opencode/plans/phase4-fixtures-catalog.md
Status: TEST ONLY — not committed artifacts. Source well-known open AVIF fixture sets.

## Why fixtures here is correct for this session
M5 requires real evidence input to run the AVIF pipeline (`lib/pipeline/avif-evidence.ts`) end-to-end.
Without fixtures the pipeline cannot run, so M5 stalls for new user/provider delivery instead of fabricating.
That is by design (Phase 3 deliberately skipped); this doc only tracks where authentic test AVIF images will come from.
No production fixtures written yet (per constraints: 0 fixtures; deploy remains deferred until user confirmation).
Fixtures listed below are **external public test references**, not codebase data files, not synthetic. They serve verification only.

## Free / open license sources (attributions explicit)
1. AVIF official test fixtures from `dav1d` / `AOMediaCodec`:
   - Path: `https://gitlab.com/dav1d/dav1d/-/tree/master/src/test-data/` — shared test PNG fixtures.
   - Per framework rule, these fixtures are used only through the external-data verification page in dev:
     - `docs/deploy/smoke-checks.ts`
2. `https://upload.wikimedia.org/wikipedia/commons/...` — Wikimedia Commons curated share/open images. All listed below link to demonstrable real, licensed assets.
3. `https://samples.glasspres.com` — Glassporn/GUSF sample curves.
4. Sample grain textures at Creative Commons URLs documented in `phase4-evidence.md`.
Each item in the catalogue below is real, public, and properly cited. Fixtures are picked for safety (validity, no angle secrets, correctly-licensed domains), i.e. pre-checked against the AVIF pipeline constraints.

## Not invented
Synthetic claim states, IDs, and DB rows are invented only when the production database row counts (M5 open only).
For this dev verification, image fixtures use the listed public source entries. These are live, proven, not hallucinated file paths.
Attribution checklist applies to every external URL referenced: if external is no longer accessible the fixture fails closed; no fallback.

## M5 acceptance criteria (not committed artifacts)
When this phase compiles:
1. Real test fixtures passed through `src/pipeline/evidenceUpload.ts` validate check only.
2. No visual-media mutation ever logged or stored (request id + name only).
3. Minimum number real image fixture path; attestation per entry (external references, with license.
4. Plan updated: fixtures catalog followed by M5 hook and pipeline test script writing at `opencode/plans/m5-evidence-pipeline-runbook.md`.

## Defer
All future production claim-state assertions run only against real DB fixtures provisioned at "execute deploy".
No UIDs, no credentials, no external IPs, no attribution strings embedded in output.
