import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { listClaims, getClaimForCustomer } from '@/lib/repositories/claims';

/**
 * Integration tests against the local dev database (skipped unless
 * DATABASE_URL is present — run via `npm run test:db`). Creates and removes
 * its own fixture rows; never touches real customer data.
 */
const db = describe.skipIf(!process.env.DATABASE_URL);

const prisma = new PrismaClient();

const suffix = Math.random().toString(36).slice(2, 10);
let customerId = '';
let vehicleId = '';
const claimIds: string[] = [];
const claimNumbers: string[] = [];

db('claims repository', () => {
  beforeAll(async () => {
    const customer = await (prisma as any).customer.create({
      data: { userId: `repo-test-${suffix}`, name: 'Repo Test Customer' },
    });
    customerId = customer.id;

    const vehicle = await prisma.vehicle.create({
      data: { customerId, make: 'Test', model: 'Integration', year: 2024 },
    });
    vehicleId = vehicle.id;

    for (let i = 0; i < 3; i++) {
      const claimNumber = `TEST-REP-${suffix}-${i}`;
      const claim = await prisma.claim.create({
        data: { claimNumber, customerId, vehicleId, status: 'submitted' },
      });
      claimIds.push(claim.id);
      claimNumbers.push(claimNumber);
    }
  });

  afterAll(async () => {
    await prisma.claim.deleteMany({ where: { id: { in: claimIds } } });
    await prisma.vehicle.deleteMany({ where: { id: vehicleId } });
    await prisma.customer.deleteMany({ where: { id: customerId } });
    await prisma.$disconnect();
  });

  it('lists claims scoped to the customer', async () => {
    const { items, nextCursor } = await listClaims({ customerId });
    const ours = items.filter((item) => claimNumbers.includes(item.claimNumber));
    expect(ours).toHaveLength(3);
    expect(nextCursor).toBeNull();
  });

  it('paginates with a cursor and returns the next page', async () => {
    const page1 = await listClaims({ customerId, limit: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.nextCursor).toBe(page1.items[1].id);

    const page2 = await listClaims({ customerId, limit: 2, cursor: page1.nextCursor });
    expect(page2.items).toHaveLength(1);
    expect(page2.nextCursor).toBeNull();
  });

  it('caps the page size', async () => {
    const { items } = await listClaims({ customerId, limit: 999 });
    expect(items.length).toBeLessThanOrEqual(50);
  });

  it('returns the claim for its owning customer', async () => {
    const claim = await getClaimForCustomer(claimIds[0], customerId);
    expect(claim?.id).toBe(claimIds[0]);
  });

  it('returns null for a cross-tenant claim id', async () => {
    const claim = await getClaimForCustomer(claimIds[0], 'customer-that-does-not-exist');
    expect(claim).toBeNull();
  });

  it('includes fixtures in an unscoped list (staff mechanics)', async () => {
    const { items } = await listClaims({});
    const ours = items.filter((item) => claimNumbers.includes(item.claimNumber));
    expect(ours).toHaveLength(3);
  });
});
