-- Admin console backend — M2 schema additions for staff/auth & audit
-- DO NOT RUN `prisma migrate deploy` automatically; apply after M2 auth wiring reviewed.

CREATE TABLE IF NOT EXISTS staff_provisioning (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  createdBy VARCHAR(36) NOT NULL,
  role VARCHAR(64) NOT NULL,
  scope VARCHAR(32) DEFAULT 'branch',
  status VARCHAR(32) DEFAULT 'pending',
  verified BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_staff_provision_role (role),
  INDEX idx_staff_provision_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS session_role (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  userId VARCHAR(36) NOT NULL,
  role VARCHAR(64) NOT NULL,
  scope VARCHAR(32) DEFAULT 'self',
  issuedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiresAt DATETIME,
  revoked BOOLEAN DEFAULT FALSE,
  INDEX idx_session_role_user (userId),
  INDEX idx_session_role_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Audit index for fast admin-mutation lookup (actor + action + time)
CREATE INDEX IF NOT EXISTS idx_audit_actor_action ON Audit(actorId, action, timestamp);
