import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { processEvidence } from '@/lib/pipeline/avif-evidence';
import { detectDamage } from '@/lib/ai/damage-detect.service';

const FIXTURES = join(__dirname, '..', 'fixtures');

function fixture(name: string): Buffer {
  return readFileSync(join(FIXTURES, name));
}

describe('AVIF pipeline (real public-domain fixtures)', () => {
  // Real-image AVIF encoding is CPU-heavy; allow 60s under parallel suite load.
  it('processes a real JPEG fixture to AVIF with audit link', { timeout: 60000 }, async () => {
    const buf = fixture('evidence-sample-01.jpg');
    const result = await processEvidence(buf, 'evidence:test-req-01');
    expect(result.bytesIn).toBeGreaterThan(0);
    expect(result.bytesOut).toBeGreaterThan(0);
    expect(result.auditLink).toBe('evidence:test-req-01');
    expect(result.avifPath).toBe('evidence:test-req-01.avif');
  });

  it('processes a real PNG fixture to AVIF', { timeout: 60000 }, async () => {
    const buf = fixture('evidence-sample-02.png');
    const result = await processEvidence(buf, 'evidence:test-req-02');
    expect(result.bytesOut).toBeGreaterThan(0);
  });

  it('rejects non-image buffer', { timeout: 60000 }, async () => {
    await expect(processEvidence(Buffer.from('not-an-image'), 'evidence:test-req-03')).rejects.toThrow();
  });
});

describe('Damage detection (manual fallback mode)', () => {
  it('classifies real fixture for manual review without fabricating severity', { timeout: 60000 }, async () => {
    const buf = fixture('evidence-sample-03.jpg');
    const result = await detectDamage(buf, 'test-req-2026-10-27');
    expect(result.classification.mode).toBe('manual_review');
    expect(result.classification.confidence).toBeNull();
    expect(result.image.width).toBeGreaterThan(0);
    expect(result.requestId).toBe('test-req-2026-10-27');
  });

  it('rejects empty input', async () => {
    await expect(detectDamage(Buffer.alloc(0), 'test-req-empty')).rejects.toThrow('Empty input');
  });
});
