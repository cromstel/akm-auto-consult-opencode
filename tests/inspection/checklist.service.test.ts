import { describe, it, expect } from 'vitest';
import {
  createChecklist,
  updateItem,
  completeChecklist,
  canTransitionInspection,
  ChecklistItemStatus,
  InspectionChecklist,
} from '@/lib/inspection/checklist.service';

describe('inspection checklist state guard (deny-by-default)', () => {
  it('creates checklist in open state with pending items', () => {
    const cl = createChecklist('insp-1', 'claim-1');
    expect(cl.state).toBe('open');
    expect(cl.items).toHaveLength(5);
    expect(cl.items.every((i) => i.status === 'pending')).toBe(true);
  });

  it('moves to in_progress on first item update and records evidence audit link', () => {
    let cl = createChecklist('insp-1', 'claim-1');
    cl = updateItem(cl, 'damage-photos', 'passed', 'evidence:req-abc');
    expect(cl.state).toBe('in_progress');
    const item = cl.items.find((i) => i.id === 'damage-photos');
    expect(item?.status).toBe('passed');
    expect(item?.evidenceAuditLink).toBe('evidence:req-abc');
  });

  it('rejects unknown item ids', () => {
    const cl = createChecklist('insp-1', 'claim-1');
    expect(() => updateItem(cl, 'does-not-exist', 'passed')).toThrow('Unknown checklist item');
  });

  it('denies completion while pending items remain', () => {
    let cl = createChecklist('insp-1', 'claim-1');
    cl = updateItem(cl, 'exterior-front', 'passed');
    expect(() => completeChecklist(cl)).toThrow('Pending items remain');
  });

  it('allows completion when all items resolved (passed/failed/not_applicable)', () => {
    let cl: InspectionChecklist = createChecklist('insp-1', 'claim-1');
    const statuses: ChecklistItemStatus[] = ['passed', 'failed', 'not_applicable', 'passed', 'passed'];
    cl.items.forEach((item, idx) => {
      cl = updateItem(cl, item.id, statuses[idx]);
    });
    const done = completeChecklist(cl);
    expect(done.state).toBe('completed');
    expect(() => updateItem(done, 'exterior-front', 'passed')).toThrow('Checklist completed');
  });

  it('state transitions: open→in_progress only; completed is terminal', () => {
    expect(canTransitionInspection('open', 'in_progress')).toBe(true);
    expect(canTransitionInspection('open', 'completed')).toBe(false);
    expect(canTransitionInspection('completed', 'open')).toBe(false);
    expect(canTransitionInspection('completed', 'in_progress')).toBe(false);
  });
});
