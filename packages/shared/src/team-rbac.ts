/** Canonical org RBAC keys, groups, and system role maps. SQL seed must match PERMISSION_KEYS. */

export const PERMISSION_KEYS = [
  "org.settings.read",
  "org.settings.write",
  "team.read",
  "team.invite",
  "team.role.assign",
  "team.remove",
  "customer.read",
  "customer.write",
  "catalog.read",
  "catalog.write",
  "transaction.read",
  "transaction.export",
  "payment.charge",
  "payment.refund",
  "payout.read",
  "payout.create",
  "api_key.manage",
  "webhook.manage",
  "network.view",
  "network.enrollments.create",
  "network.enrollments.view",
  "network.members.view",
  "network.members.manage",
  "network.payments.view",
  "network.fees.view",
  "network.fees.manage",
  "network.webhooks.manage",
  "network.admin",
  "nitro.advance",
  "insurance.read",
  "insurance.manage",
  "booking.read",
  "booking.write",
  "payment_link.create",
  "team.limits.manage",
  "balance.read",
  "transaction.read_own",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_KEY_SET: ReadonlySet<string> = new Set(PERMISSION_KEYS);

export const SYSTEM_ROLE_KEYS = {
  orgAdmin: "org_admin",
  orgMember: "org_member",
  manager: "manager",
  cashier: "cashier",
  staff: "staff",
  viewer: "viewer",
} as const;

export type SystemRoleKey =
  (typeof SYSTEM_ROLE_KEYS)[keyof typeof SYSTEM_ROLE_KEYS];

/** org_admin stays locked; other system roles can have their permission sets edited. */
export const RESERVED_SYSTEM_ROLE_KEYS = new Set<string>([
  SYSTEM_ROLE_KEYS.orgAdmin,
]);

export const LOCKED_SYSTEM_ROLE_KEYS = new Set<string>([
  SYSTEM_ROLE_KEYS.orgAdmin,
  SYSTEM_ROLE_KEYS.orgMember,
  SYSTEM_ROLE_KEYS.manager,
  SYSTEM_ROLE_KEYS.cashier,
  SYSTEM_ROLE_KEYS.staff,
  SYSTEM_ROLE_KEYS.viewer,
]);

/** Jumbo invite chips, in display order. Remaining roles sit under More. */
export const JUMBO_QUICK_INVITE_ROLE_KEYS = [
  SYSTEM_ROLE_KEYS.staff,
  SYSTEM_ROLE_KEYS.cashier,
  SYSTEM_ROLE_KEYS.manager,
] as const;

export const PERMISSION_GROUPS = [
  {
    id: "money",
    keys: [
      "balance.read",
      "payout.read",
      "payout.create",
      "nitro.advance",
    ] satisfies PermissionKey[],
  },
  {
    id: "selling",
    keys: [
      "payment.charge",
      "payment.refund",
      "payment_link.create",
    ] satisfies PermissionKey[],
  },
  {
    id: "sales_history",
    keys: [
      "transaction.read",
      "transaction.read_own",
      "transaction.export",
    ] satisfies PermissionKey[],
  },
  {
    id: "catalog",
    keys: ["catalog.read", "catalog.write"] satisfies PermissionKey[],
  },
  {
    id: "customers",
    keys: ["customer.read", "customer.write"] satisfies PermissionKey[],
  },
  {
    id: "bookings",
    keys: ["booking.read", "booking.write"] satisfies PermissionKey[],
  },
  {
    id: "team",
    keys: [
      "team.read",
      "team.invite",
      "team.role.assign",
      "team.remove",
      "team.limits.manage",
    ] satisfies PermissionKey[],
  },
  {
    id: "business_settings",
    keys: ["org.settings.read", "org.settings.write"] satisfies PermissionKey[],
  },
  {
    id: "developer",
    keys: ["api_key.manage", "webhook.manage"] satisfies PermissionKey[],
  },
  {
    id: "insurance",
    keys: ["insurance.read", "insurance.manage"] satisfies PermissionKey[],
  },
  {
    id: "network",
    keys: [
      "network.view",
      "network.enrollments.create",
      "network.enrollments.view",
      "network.members.view",
      "network.members.manage",
      "network.payments.view",
      "network.fees.view",
      "network.fees.manage",
      "network.webhooks.manage",
      "network.admin",
    ] satisfies PermissionKey[],
  },
] as const;

function isNetworkPermissionGroup(
  group: (typeof PERMISSION_GROUPS)[number],
): group is Extract<(typeof PERMISSION_GROUPS)[number], { id: "network" }> {
  return group.id === "network";
}

const NETWORK_PERMISSION_GROUP = PERMISSION_GROUPS.find(
  isNetworkPermissionGroup,
);
if (!NETWORK_PERMISSION_GROUP) {
  throw new Error("network permission group is required");
}
const NETWORK_KEYS = NETWORK_PERMISSION_GROUP.keys;

export const MANAGER_DENIED_PERMISSIONS = [
  "payout.create",
  "org.settings.write",
  "api_key.manage",
  "webhook.manage",
  "nitro.advance",
  "insurance.manage",
  ...NETWORK_KEYS,
] as const satisfies readonly PermissionKey[];

const MANAGER_DENIED_PERMISSION_SET: ReadonlySet<string> = new Set(
  MANAGER_DENIED_PERMISSIONS,
);

export const MEMBER_DENIED_PERMISSIONS = [
  "payout.create",
  "payment.refund",
  "nitro.advance",
  "insurance.manage",
  "team.limits.manage",
  "team.invite",
  "team.role.assign",
  "team.remove",
  ...NETWORK_KEYS,
] as const satisfies readonly PermissionKey[];

const MEMBER_DENIED_PERMISSION_SET: ReadonlySet<string> = new Set(
  MEMBER_DENIED_PERMISSIONS,
);

export const CASHIER_PERMISSIONS = [
  "payment.charge",
  "payment_link.create",
  "transaction.read",
  "catalog.read",
  "customer.read",
  "customer.write",
  "booking.read",
] as const satisfies readonly PermissionKey[];

export const STAFF_PERMISSIONS = [
  "payment.charge",
  "transaction.read_own",
  "catalog.read",
  "customer.read",
] as const satisfies readonly PermissionKey[];

export const VIEWER_PERMISSIONS = [
  "balance.read",
  "payout.read",
  "transaction.read",
  "transaction.export",
  "catalog.read",
  "customer.read",
  "booking.read",
  "org.settings.read",
  "team.read",
] as const satisfies readonly PermissionKey[];

export type SystemRoleDefinition = {
  key: SystemRoleKey;
  title: string;
  /** null means every permission key. */
  permissions: readonly PermissionKey[] | null;
};

export const SYSTEM_ROLES: readonly SystemRoleDefinition[] = [
  { key: SYSTEM_ROLE_KEYS.orgAdmin, title: "Admin", permissions: null },
  {
    key: SYSTEM_ROLE_KEYS.manager,
    title: "Manager",
    permissions: PERMISSION_KEYS.filter(
      (key) => !MANAGER_DENIED_PERMISSION_SET.has(key),
    ),
  },
  {
    key: SYSTEM_ROLE_KEYS.orgMember,
    title: "Member",
    permissions: PERMISSION_KEYS.filter(
      (key) => !MEMBER_DENIED_PERMISSION_SET.has(key),
    ),
  },
  {
    key: SYSTEM_ROLE_KEYS.cashier,
    title: "Cashier",
    permissions: CASHIER_PERMISSIONS,
  },
  {
    key: SYSTEM_ROLE_KEYS.staff,
    title: "Staff",
    permissions: STAFF_PERMISSIONS,
  },
  {
    key: SYSTEM_ROLE_KEYS.viewer,
    title: "Viewer",
    permissions: VIEWER_PERMISSIONS,
  },
];

const SYSTEM_ROLE_KEY_SET: ReadonlySet<string> = new Set(
  Object.values(SYSTEM_ROLE_KEYS),
);

export function isPermissionKey(value: string): value is PermissionKey {
  return PERMISSION_KEY_SET.has(value);
}

export function isSystemRoleKey(value: string): value is SystemRoleKey {
  return SYSTEM_ROLE_KEY_SET.has(value);
}

export function legacyMemberRoleForRoleKey(
  roleKey: string,
): "Admin" | "Member" {
  return roleKey === SYSTEM_ROLE_KEYS.orgAdmin ? "Admin" : "Member";
}

type OrganizationRoleLabel = {
  key: string;
  title: string;
};

/** System role titles are stored in English in the DB; map keys to locale strings in UI. */
export function getLocalizedOrganizationRoleTitle(
  role: OrganizationRoleLabel,
  t: (key: string) => string,
): string {
  switch (role.key) {
    case SYSTEM_ROLE_KEYS.orgAdmin:
      return t("business.team_members.admin");
    case SYSTEM_ROLE_KEYS.orgMember:
      return t("business.team_members.member");
    case SYSTEM_ROLE_KEYS.manager:
      return t("business.roles_permissions.manager_role");
    case SYSTEM_ROLE_KEYS.cashier:
      return t("business.roles_permissions.cashier_role");
    case SYSTEM_ROLE_KEYS.staff:
      return t("business.roles_permissions.staff_role");
    case SYSTEM_ROLE_KEYS.viewer:
      return t("business.roles_permissions.viewer_role");
    default:
      return role.title;
  }
}

export function parsePermissionKeysFromSqlSeed(sql: string): string[] {
  const startMarker = "-- TEAM_RBAC_PERMISSION_SEED_START";
  const endMarker = "-- TEAM_RBAC_PERMISSION_SEED_END";
  const start = sql.indexOf(startMarker);
  const end = sql.indexOf(
    endMarker,
    start === -1 ? 0 : start + startMarker.length,
  );
  if (start === -1 || end === -1) {
    throw new Error("TEAM_RBAC_PERMISSION_SEED markers missing from SQL");
  }
  const seed = sql.slice(start + startMarker.length, end);
  if (!seed) {
    throw new Error("TEAM_RBAC_PERMISSION_SEED body missing from SQL");
  }
  const keys = [...seed.matchAll(/'([a-z0-9_]+(?:\.[a-z0-9_]+)+)'/g)].flatMap(
    (match) => {
      const key = match[1];
      return key ? [key] : [];
    },
  );
  return [...new Set(keys)];
}
