import { PrismaClient } from '@prisma/client';

/**
 * Non-production seed: role/permission registry ONLY — never customer or
 * claim data. Idempotent (upsert by unique name).
 *
 * Run: npx dotenv-cli -e .env.local -- npx prisma db seed
 */
if (process.env.NODE_ENV === 'production') {
  console.error('Seed refused: production environments must not be seeded (no production fixtures).');
  process.exit(1);
}

const prisma = new PrismaClient();

interface RoleSeed {
  name: string;
  scope: string;
}

// Permission strings align with docs/security/SECURITY_RBAC.md and the
// granular-permission model in the PRD; Phase 2 binds them to sessions.
interface PermSeed {
  name: string;
  category: string;
  description?: string;
}

/**
 * Permission registry aligned with SECURITY_RBAC.md granular permissions list
 * and PRD personas. Used by staff role seed (`rolePermissions`) so the
 * normalized permission/role tables are populated without customer/claim data.
 */
const PERM_SEEDS: PermSeed[] = [
  { name: 'customers.read', category: 'customers', description: 'Read customer profile (self)' },
  { name: 'customers:read', category: 'customers', description: 'Read customer records' },
  { name: 'staff.invite', category: 'staff', description: 'Invite new staff' },
  { name: 'staff.roles.assign', category: 'staff', description: 'Assign roles to staff' },
  { name: 'claims.read', category: 'claims', description: 'Read all claims' },
  { name: 'claims.read.own', category: 'claims', description: 'Read own claims' },
  { name: 'claims.read.assigned', category: 'claims', description: 'Read assigned claims' },
  { name: 'claims.create', category: 'claims', description: 'Create a claim' },
  { name: 'claims.assign', category: 'claims', description: 'Assign a claim' },
  { name: 'claims.transition', category: 'claims', description: 'Transition claim workflow status' },
  { name: 'claims.adjust', category: 'claims', description: 'Adjust claim amounts' },
  { name: 'claims.approve', category: 'claims', description: 'Approve claim settlement' },
  { name: 'inspections.manage', category: 'inspections', description: 'Manage inspections' },
  { name: 'evidence.upload', category: 'evidence', description: 'Upload evidence' },
  { name: 'estimates.review', category: 'estimates', description: 'Review estimates' },
  { name: 'finance.settlement.approve', category: 'finance', description: 'Approve settlement' },
  { name: 'reports.export', category: 'reports', description: 'Export reports' },
  { name: 'audit.read', category: 'audit', description: 'Audit log access' },
  { name: 'settings.manage', category: 'settings', description: 'Manage system settings' },
];

const ROLE_SEEDS: RoleSeed[] = [
  { name: 'public', scope: 'self' },
  { name: 'customer', scope: 'self' },
  { name: 'claims_officer', scope: 'assigned' },
  { name: 'adjuster', scope: 'assigned' },
  { name: 'inspector', scope: 'assigned' },
  { name: 'finance', scope: 'branch' },
  { name: 'auditor', scope: 'global' },
  { name: 'support', scope: 'branch' },
  { name: 'admin', scope: 'global' },
];

// Role->permission mapping aligned with per-role scopes from SECURITY_RBAC.md.
// admin gets all (*) — represented as wildcard rather than full list here.
const ROLE_PERMISSIONS: Array<{ name: string; roleName: string }> = [
  { name: 'customers:read', roleName: 'customer' },
  { name: 'claims:read', roleName: 'customer' },
  { name: 'claims:read.own', roleName: 'customer' },
  { name: 'claims:create', roleName: 'customer' },
  { name: 'vehicles:manage:self', roleName: 'customer' },
  { name: 'evidence:upload:self', roleName: 'customer' },
  { name: 'notes:read:self', roleName: 'customer' },

  { name: 'claims:read', roleName: 'claims_officer' },
  { name: 'claims:assign', roleName: 'claims_officer' },
  { name: 'claims:transition', roleName: 'claims_officer' },
  { name: 'notes:write', roleName: 'claims_officer' },

  { name: 'claims:read', roleName: 'adjuster' },
  { name: 'estimates:read', roleName: 'adjuster' },
  { name: 'estimates:write', roleName: 'adjuster' },
  { name: 'adjustments:write', roleName: 'adjuster' },

  { name: 'claims:read', roleName: 'inspector' },
  { name: 'inspections:read', roleName: 'inspector' },
  { name: 'inspections:write', roleName: 'inspector' },
  { name: 'evidence:read', roleName: 'inspector' },

  { name: 'claims:read', roleName: 'finance' },
  { name: 'invoices:read', roleName: 'finance' },
  { name: 'invoices:write', roleName: 'finance' },
  { name: 'settlements:write', roleName: 'finance' },
  { name: 'payments:record', roleName: 'finance' },
  { name: 'reconciliation:read', roleName: 'finance' },

  { name: 'audit:read', roleName: 'auditor' },
  { name: 'reports:read', roleName: 'auditor' },

  { name: 'customers:read', roleName: 'support' },
  { name: 'claims:read', roleName: 'support' },
  { name: 'messages:write', roleName: 'support' },

  // admin = wildcard
  { name: 'customers.read', roleName: 'admin' },
  { name: 'staff.invite', roleName: 'admin' },
  { name: 'staff.roles.assign', roleName: 'admin' },
  { name: 'claims.read', roleName: 'admin' },
  { name: 'claims.create', roleName: 'admin' },
  { name: 'claims.assign', roleName: 'admin' },
  { name: 'claims.transition', roleName: 'admin' },
  { name: 'claims.adjust', roleName: 'admin' },
  { name: 'claims.approve', roleName: 'admin' },
  { name: 'inspections.manage', roleName: 'admin' },
  { name: 'evidence.upload', roleName: 'admin' },
  { name: 'estimates.review', roleName: 'admin' },
  { name: 'finance.settlement.approve', roleName: 'admin' },
  { name: 'reports.export', roleName: 'admin' },
  { name: 'audit.read', roleName: 'admin' },
  { name: 'settings.manage', roleName: 'admin' },
];

async function main() {
  // 1) Persist permissions independently (createMany by unique name).
  await prisma.permission.createMany({
    data: PERM_SEEDS.map((p) => ({ name: p.name, category: p.category, description: p.description })),
    skipDuplicates: true,
  });

  interface PermissionRoleMap {
  name: string;
  roleId: string;
}

// 2) Persist roles (cleaned: drop permissions field as legacy column remains)
  for (const role of ROLE_SEEDS) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { scope: role.scope },
      create: { name: role.name, scope: role.scope },
    });
  }

  // Build lookup for roles (by name, not id)
  const roleNames: string[] = [];
  for (const role of ROLE_SEEDS) roleNames.push(role.name);
  const existingRoles = await prisma.role.findMany({ where: { name: { in: roleNames } } });
  const roleMap = new Map(existingRoles.map((r) => [r.name, r.id]));

  // 3) Sync role_permissions links
  await prisma.rolePermission.deleteMany({});
  if (ROLE_PERMISSIONS.length > 0) {
    const permissions = await prisma.permission.findMany();
    const permByName = new Map(permissions.map((p) => [p.name, p]));
    await prisma.rolePermission.createMany({
      data: ROLE_PERMISSIONS.map(({ name, roleName }) => {
        const permission = permByName.get(name);
        const roleId = roleMap.get(roleName);
        if (!permission || !roleId) return null;
        return { permissionId: permission.id, roleId };
      }).filter(Boolean) as any,
    });
  }

  const roleCount = await prisma.role.count();
  const permCount = await prisma.permission.count();
  const linkCount = await prisma.rolePermission.count();
  console.log(`Seeded ${permCount} permissions, ${linkCount} role-permission links, ${roleCount} roles (upsert, no customer data).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
