import { describe, it, expect } from 'vitest';
import { CustomerRepo } from '@/lib/db/customer.repository';
describe('CustomerRepo', () => {
  it('exports findByUserId', () => { expect(typeof CustomerRepo.findByUserId).toBe('function'); });
  it('exports findVehicles', () => { expect(typeof CustomerRepo.findVehicles).toBe('function'); });
  it('exports findClaims', () => { expect(typeof CustomerRepo.findClaims).toBe('function'); });
});
