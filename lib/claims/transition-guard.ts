import { CLAIM_STATE_TRANSITIONS } from '@/lib/claims/state';

/**
 * Server-side transition guard: fails closed (returns false) for unknown
 * statuses or illegal moves — never allows a transition just because the
 * caller asked.
 */
export function canTransition(from: string, to: string): boolean {
  return CLAIM_STATE_TRANSITIONS[from as keyof typeof CLAIM_STATE_TRANSITIONS]?.includes(to as typeof CLAIM_STATE_TRANSITIONS[keyof typeof CLAIM_STATE_TRANSITIONS][number]) ?? false;
}
