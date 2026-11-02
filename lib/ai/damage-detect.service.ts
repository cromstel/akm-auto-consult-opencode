/**
 * M5 damage detection — manual-fallback mode (per agent-org-plan.md:
 * "YOLOv8/ONNX or manual fallback"). No model is bundled in this repo, so the
 * service normalizes evidence through the AVIF pipeline and returns a
 * structured `manual_review` classification for the inspector UI. It never
 * fabricates severity scores; automated classification returns null unless a
 * real model is registered.
 *
 * Security: input validated (size/format via sharp metadata) before any
 * processing; audit logs carry requestId only — never file paths that could
 * leak evidence storage details, and never secret values.
 */
import sharp from 'sharp';
import { processEvidence } from '@/lib/pipeline/avif-evidence';
import { logger } from '@/lib/observability/logger';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB, mirrors pipeline limit
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];

export type DamageClassification =
  | { mode: 'manual_review'; confidence: null; reason: string }
  | { mode: 'automated'; confidence: number; severity: 'minor' | 'moderate' | 'severe' };

export interface DamageDetectResult {
  classification: DamageClassification;
  image: {
    width: number;
    height: number;
    format: string;
    bytesIn: number;
    bytesOut: number;
  };
  auditLink: string;
  requestId: string;
}

export async function detectDamage(
  buffer: Buffer,
  requestId: string,
  options?: { auditLink?: string }
): Promise<DamageDetectResult> {
  if (buffer.length === 0) throw new Error('Empty input');
  if (buffer.length > MAX_BYTES) throw new Error('Image exceeds 10 MB');

  // Validate real image before processing (same posture as pipeline).
  const meta = await sharp(buffer).metadata();
  if (!meta.format || !ALLOWED_TYPES.includes(`image/${meta.format}` as const)) {
    throw new Error('Invalid image format');
  }
  if (!meta.width || !meta.height) throw new Error('Invalid image dimensions');

  const auditLink = options?.auditLink ?? `evidence:${requestId}`;
  const processed = await processEvidence(buffer, auditLink);

  // Manual fallback: no model registered — classify for human inspection.
  // Automated mode activates only when a real model is wired in (M5+).
  const classification: DamageClassification = {
    mode: 'manual_review',
    confidence: null,
    reason: 'No detection model registered; inspector review required.',
  };

  logger.info('Damage detection complete', {
    requestId,
    mode: classification.mode,
    bytesIn: processed.bytesIn,
    bytesOut: processed.bytesOut,
  });

  return {
    classification,
    image: {
      width: meta.width,
      height: meta.height,
      format: meta.format,
      bytesIn: processed.bytesIn,
      bytesOut: processed.bytesOut,
    },
    auditLink: processed.auditLink,
    requestId,
  };
}
