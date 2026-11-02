/**
 * M5 inspection checklist — server-side state guard (mirrors claim-state
 * pattern: deny-by-default transitions; repository enforces before write).
 * Checklist items reference evidence by auditLink only (requestId-keyed;
 * no storage paths, no customer data in module state).
 */

export type ChecklistItemStatus = 'pending' | 'passed' | 'failed' | 'not_applicable';

export interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistItemStatus;
  evidenceAuditLink?: string;
}

export interface InspectionChecklist {
  inspectionId: string;
  claimId: string;
  items: ChecklistItem[];
  state: 'open' | 'in_progress' | 'completed';
}

const VALID_TRANSITIONS: Record<InspectionChecklist['state'], InspectionChecklist['state'][]> = {
  open: ['in_progress'],
  in_progress: ['in_progress', 'completed'],
  completed: [],
};

export function canTransitionInspection(
  from: InspectionChecklist['state'],
  to: InspectionChecklist['state']
): boolean {
  return (VALID_TRANSITIONS[from] ?? []).includes(to);
}

export function createChecklist(inspectionId: string, claimId: string): InspectionChecklist {
  const base: Array<[string, string]> = [
    ['exterior-front', 'Exterior — front assessment'],
    ['exterior-rear', 'Exterior — rear assessment'],
    ['interior-cabin', 'Interior — cabin condition'],
    ['mechanical-start', 'Mechanical — start/operation test'],
    ['damage-photos', 'Damage photo evidence attached'],
  ];
  return {
    inspectionId,
    claimId,
    items: base.map(([id, label]) => ({ id, label, status: 'pending' as const })),
    state: 'open',
  };
}

export function updateItem(
  checklist: InspectionChecklist,
  itemId: string,
  status: ChecklistItemStatus,
  evidenceAuditLink?: string
): InspectionChecklist {
  const exists = checklist.items.some((item) => item.id === itemId);
  if (!exists) throw new Error('Unknown checklist item');
  if (checklist.state === 'completed') throw new Error('Checklist completed');
  return {
    ...checklist,
    state: checklist.state === 'open' ? 'in_progress' : checklist.state,
    items: checklist.items.map((item) =>
      item.id === itemId ? { ...item, status, evidenceAuditLink } : item
    ),
  };
}

export function completeChecklist(checklist: InspectionChecklist): InspectionChecklist {
  if (!canTransitionInspection(checklist.state, 'completed')) {
    throw new Error('Invalid inspection state transition');
  }
  const unfinished = checklist.items.filter(
    (item) => item.status === 'pending'
  );
  if (unfinished.length > 0) throw new Error('Pending items remain');
  return { ...checklist, state: 'completed' };
}
