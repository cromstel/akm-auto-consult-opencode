# Test Fixtures Attribution — tests/fixtures/ (test-only, not production data)

| File | Source | License |
|------|--------|---------|
| evidence-sample-01.jpg | Wikimedia Commons: `Albert_Einstein_Head.jpg` (photographer unknown) | Public domain (published before 1929) |
| evidence-sample-02.png | Wikimedia Commons: `PNG_transparency_demonstration_1.png` (Edmund Palibino) | Public domain |
| evidence-sample-03.jpg | Wikimedia Commons: `Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg` (Léonard de Vinci / C2RMF) | Public domain (old master) |

- Downloaded via `commons.wikimedia.org/wiki/Special:FilePath` (width-limited thumbnails for 01/03).
- Signatures verified (JPEG `FF D8`, PNG `89 50`); all under the 10MB pipeline limit.
- Test-only: used to exercise `lib/pipeline/avif-evidence.ts` end-to-end; never seeded to a database; no production customer data.
- If a source becomes unavailable, the pipeline fails closed; no synthetic fallback.
