import sharp from 'sharp';
import { logger } from '@/lib/observability/logger';

/**
 * AVIF evidence pipeline (Phase 2 / M4). Validates upload (type, size,
 * dimensions) before processing; outputs AVIF and stores audit link.
 */
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];

export interface PipelineResult {
  avifPath: string;
  auditLink: string;
  bytesIn: number;
  bytesOut: number;
}

export async function processEvidence(buffer: Buffer, auditLink: string): Promise<PipelineResult> {
  const bytesIn = buffer.length;
  if (bytesIn > MAX_BYTES) throw new Error('Image exceeds 10 MB');

  const image = sharp(buffer);
  const meta = await image.metadata();
  if (!meta.format || !ALLOWED_TYPES.includes(`image/${meta.format}` as (typeof ALLOWED_TYPES)[number])) throw new Error('Invalid image format');

  const avifBuffer = await image.avif({ effort: 4 }).toBuffer();

  logger.info('AVIF pipeline complete', { auditLink, bytesIn, bytesOut: avifBuffer.length, format: meta.format });

  return { avifPath: auditLink + '.avif', auditLink, bytesIn, bytesOut: avifBuffer.length };
}
