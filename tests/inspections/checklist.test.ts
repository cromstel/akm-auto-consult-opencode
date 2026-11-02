import { describe, it, expect } from 'vitest';
import { parseChecklist } from '@/lib/inspections/checklist';

describe('parseChecklist', () => {
  it('parses a valid checklist', () => {
    const result = parseChecklist(
      JSON.stringify({ items: [{ id: '1', section: 'exterior', label: 'Front bumper', status: 'pass' }] })
    );
    expect(result.items[0].label).toBe('Front bumper');
  });

  it('accepts optional notes', () => {
    const result = parseChecklist(
      JSON.stringify({ items: [{ id: '1', section: 's', label: 'l', status: 'fail', note: 'Cracked' }] })
    );
    expect(result.items[0].note).toBe('Cracked');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseChecklist('not-json')).toThrow();
  });

  it('throws on invalid item status', () => {
    expect(() =>
      parseChecklist(JSON.stringify({ items: [{ id: '1', section: 's', label: 'l', status: 'broken' }] }))
    ).toThrow();
  });

  it('throws on empty item id', () => {
    expect(() =>
      parseChecklist(JSON.stringify({ items: [{ id: '', section: 's', label: 'l', status: 'pass' }] }))
    ).toThrow();
  });
});
