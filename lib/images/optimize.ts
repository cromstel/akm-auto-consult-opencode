import sharp from 'sharp';

export async function optimizeImage(inputPath: string, outputDir: string, claimId: string) {
  // Agent 3 — AVIF/WebP pipeline; sharp only; no untrusted SVG input allowed
  const base = `${outputDir}/${claimId}`;
  await sharp(inputPath)
    .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
    .avif({ effort: 4 })
    .toFile(`${base}.avif`);
  await sharp(inputPath)
    .resize(640, 480, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(`${base}-thumb.webp`);
  return { avif: `${base}.avif`, thumb: `${base}-thumb.webp` };
}
