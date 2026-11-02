import { describe, it, expect } from 'vitest';
import { redact } from '@/lib/observability/logger';

describe('redact', () => {
  it('masks sensitive keys at the top level', () => {
    const out = redact({ password: 'x', secret: 'y', token: 'z', ok: 'keep' }) as Record<string, unknown>;
    expect(out.password).toBe('[REDACTED]');
    expect(out.secret).toBe('[REDACTED]');
    expect(out.token).toBe('[REDACTED]');
    expect(out.ok).toBe('keep');
  });

  it('masks nested and case-variant keys', () => {
    const out = redact({ nested: { PasswordHash: 'h', apiKey: 'k', note: 'n' } }) as {
      nested: Record<string, unknown>;
    };
    expect(out.nested.PasswordHash).toBe('[REDACTED]');
    expect(out.nested.apiKey).toBe('[REDACTED]');
    expect(out.nested.note).toBe('n');
  });

  it('masks inside arrays', () => {
    const out = redact([{ session: 's' }, { label: 'fine' }]) as Array<Record<string, unknown>>;
    expect(out[0].session).toBe('[REDACTED]');
    expect(out[1].label).toBe('fine');
  });

  it('caps recursion depth', () => {
    let deep: unknown = { value: 'bottom' };
    for (let i = 0; i < 10; i++) deep = { level: deep };

    let out: unknown = redact(deep);
    for (let i = 0; i < 12 && out && typeof out === 'object'; i++) {
      out = (out as Record<string, unknown>).level;
    }
    expect(out).toBe('[MAX_DEPTH]');
  });

  it('leaves primitives untouched', () => {
    expect(redact('plain')).toBe('plain');
    expect(redact(42)).toBe(42);
    expect(redact(null)).toBe(null);
  });
});
