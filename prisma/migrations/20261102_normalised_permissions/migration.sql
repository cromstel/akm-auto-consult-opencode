-- M2 permission normalization + apply pending staff/auth schema additions.
-- Applies staff_provisioning, session_role and audit index, then builds the
-- normalized Permission / RolePermission tables (per SECURITY_RBAC.md).

-- (1) Previous pending migration additions
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

CREATE INDEX IF NOT EXISTS idx_audit_actor_action ON Audit(actorId, action, timestamp);

-- (2) Normalized permission model
CREATE TABLE IF NOT EXISTS permissions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(128) NOT NULL,
  category VARCHAR(64) NOT NULL,
  description TEXT,
  UNIQUE KEY uniq_permission_name (name),
  KEY idx_permission_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role_permissions (
  permissionId VARCHAR(36) NOT NULL,
  roleId VARCHAR(36) NOT NULL,
  PRIMARY KEY (permissionId, roleId),
  KEY idx_rp_role (roleId),
  CONSTRAINT fk_rp_permission FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_role FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
