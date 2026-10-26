export interface DamageDetectionResult {
  damageType: string;
  confidence: number;
  bbox: { x: number; y: number; w: number; h: number };
  manualTag?: string;
  audited: boolean;
}

export function detectDamage(_imagePath: string): Promise<DamageDetectionResult> {
  // M5 — YOLOv8/ONNX skeleton; manual fallback enforced if model unavailable
  return Promise.resolve({
    damageType: 'unknown',
    confidence: 0.0,
    bbox: { x: 0, y: 0, w: 0, h: 0 },
    manualTag: 'manual-review-required',
    audited: true,
  });
}
