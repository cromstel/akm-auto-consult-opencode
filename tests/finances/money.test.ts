import { describe, it, expect } from 'vitest';
import { toPesewas, formatGHS } from '@/lib/finances/money';

describe('toPesewas', () => {
  it('converts decimal strings exactly', () => {
    expect(toPesewas('123.45')).toBe(12345);
  });

  it('converts whole amounts', () => {
    expect(toPesewas('5')).toBe(500);
    expect(toPesewas('0')).toBe(0);
  });

  it('pads single-decimal fractions', () => {
    expect(toPesewas('12.3')).toBe(1230);
  });

  it('handles negative amounts', () => {
    expect(toPesewas('-2.75')).toBe(-275);
  });

  it('trims surrounding whitespace', () => {
    expect(toPesewas('  12.50  ')).toBe(1250);
  });

  it('accepts number input that stringifies exactly', () => {
    expect(toPesewas(123.45)).toBe(12345);
    expect(toPesewas(0.1)).toBe(10);
  });

  it('rejects three-decimal float artifacts', () => {
    expect(() => toPesewas('1.005')).toThrow();
    expect(() => toPesewas(1.005)).toThrow();
  });

  it('rejects malformed input', () => {
    expect(() => toPesewas('.5')).toThrow();
    expect(() => toPesewas('abc')).toThrow();
    expect(() => toPesewas('')).toThrow();
    expect(() => toPesewas('1,000')).toThrow();
    expect(() => toPesewas('12.456')).toThrow();
  });
});

describe('formatGHS', () => {
  it('formats integer pesewas as cedis', () => {
    expect(formatGHS(12345)).toContain('123.45');
  });

  it('formats small amounts', () => {
    expect(formatGHS(50)).toContain('0.50');
  });

  it('handles negatives', () => {
    expect(formatGHS(-50)).toContain('0.50');
  });

  it('rejects non-integer pesewas', () => {
    expect(() => formatGHS(12.5)).toThrow();
  });
});
