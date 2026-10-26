// M6 — DECIMAL helper: integer minor units; never use float for money
export function decimal(value: number): number {
  return Math.round(value * 100); // example: 123.45 -> 12345 cents
}
