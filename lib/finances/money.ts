/**
 * Money utilities — Ghana (confirmed 2026-10-26): currency GHS, integer minor
 * units (pesewas, 100 per cedi). Conversions never use float arithmetic;
 * amounts cross boundaries as integer pesewas or validated strings only.
 */
export const CURRENCY_CODE = 'GHS' as const;
export const PESEWAS_PER_CEDI = 100;

const AMOUNT_PATTERN = /^-?\d+(\.\d{1,2})?$/;

/**
 * Convert a decimal string (e.g. "123.45") or integer-like number into
 * integer pesewas. Rejects anything that cannot be represented exactly in
 * two decimal places — including float artifacts like 1.005.
 */
export function toPesewas(input: string | number): number {
  const text = typeof input === 'number' ? String(input) : input.trim();
  if (!AMOUNT_PATTERN.test(text)) {
    throw new Error('Invalid amount: expected up to two decimal places');
  }

  const negative = text.startsWith('-');
  const [whole, fraction = ''] = text.split('.');
  const padded = (fraction + '00').slice(0, 2);
  const value = Number((negative ? whole.slice(1) : whole) + padded);
  return negative ? -value : value;
}

/**
 * Display-only formatting (pesewas -> GHS text). Never used for storage or
 * arithmetic — money is stored and computed in integer pesewas.
 */
export function formatGHS(pesewas: number): string {
  if (!Number.isInteger(pesewas)) {
    throw new Error('Invalid amount: pesewas must be an integer');
  }
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: CURRENCY_CODE,
  }).format(pesewas / PESEWAS_PER_CEDI);
}
