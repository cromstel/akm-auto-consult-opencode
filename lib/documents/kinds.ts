/**
 * Document kind registry (documents module). Governs which document
 * categories the system recognizes; display labels are derived, not stored
 * per row, so kinds stay canonical.
 */
export const DOCUMENT_KINDS = [
  'inspection-report',
  'damage-report',
  'estimate',
  'invoice',
  'settlement-statement',
  'photo-evidence',
  'policy-document',
  'other',
] as const;

export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export function isDocumentKind(value: string): value is DocumentKind {
  return (DOCUMENT_KINDS as readonly string[]).includes(value);
}
