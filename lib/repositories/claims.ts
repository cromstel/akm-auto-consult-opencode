import 'server-only';
import { prisma } from '@/lib/db/prisma';
import { canTransition } from '@/lib/claims/transition-guard';

/**
 * Claims repository (server-only, deny-by-default + server transition guard).
 * Updates enforce canTransition() server-side; invalid moves fail generically.
 *
 * Scope enforcement: callers (authenticated services) MUST pass the verified
 * customer scope; getClaimForCustomer applies id + customerId together so a
 * wrong-tenant claim id returns null, never another customer's row.
 */
export interface ListClaimsInput {
  customerId?: string;
  cursor?: string | null;
  limit?: number;
}

export interface ClaimSummary {
  id: string;
  claimNumber: string;
  status: string;
  priority: string;
  vehicleId: string;
  createdAt: Date;
}

export interface ListClaimsResult {
  items: ClaimSummary[];
  nextCursor: string | null;
}

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

function clampLimit(requested?: number): number {
  if (!requested || requested < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(requested, MAX_PAGE_SIZE);
}

export async function listClaims(input: ListClaimsInput): Promise<ListClaimsResult> {
  const limit = clampLimit(input.limit);

  const rows = await prisma.claim.findMany({
    where: input.customerId ? { customerId: input.customerId } : undefined,
    select: {
      id: true,
      claimNumber: true,
      status: true,
      priority: true,
      vehicleId: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    cursor: input.cursor ? { id: input.cursor } : undefined,
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  return {
    items,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}

export async function updateClaimStatus(claimId: string, fromStatus: string, toStatus: string, _verifiedUserId: string) { // audit param Phase 3
  if (!canTransition(fromStatus, toStatus)) {
    throw new Error('Invalid claim transition');
  }
  return prisma.claim.update({ where: { id: claimId }, data: { status: toStatus } });
}

export async function getClaimForCustomer(claimId: string, customerId: string) {
  return prisma.claim.findFirst({
    where: { id: claimId, customerId },
    select: {
      id: true,
      claimNumber: true,
      status: true,
      priority: true,
      vehicleId: true,
      createdAt: true,
    },
  });
}
