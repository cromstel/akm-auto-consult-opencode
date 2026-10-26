export type ClaimStatus = 'submitted' | 'assigned' | 'inspected' | 'estimated' | 'approved' | 'resolved';

export const CLAIM_STATE_TRANSITIONS: Record<ClaimStatus, ClaimStatus[]> = {
  submitted: ['assigned'],
  assigned: ['inspected'],
  inspected: ['estimated'],
  estimated: ['approved'],
  approved: ['resolved'],
  resolved: [],
};

export function canTransition(from: ClaimStatus, to: ClaimStatus): boolean {
  return CLAIM_STATE_TRANSITIONS[from]?.includes(to) ?? false;
}
