import { PERMISSIONS } from "@artisancode/api-types";

import type { Permission, Role } from "@artisancode/api-types";

const viewOnly: Permission[] = PERMISSIONS.filter((p) => p.endsWith(".view"));

const salesPermissions: Permission[] = PERMISSIONS.filter(
  (p) =>
    p.startsWith("customers.") ||
    p.startsWith("projects.") ||
    p.startsWith("quotations.") ||
    p === "broadcast_templates.view" ||
    p === "broadcast_logs.view" ||
    p === "customer_ratings.view",
);

// ponytail: in-memory role catalog (Pengaturan > Roles).
export const mockRoles: Role[] = [
  {
    id: "role1",
    name: "Admin",
    description: "Akses penuh ke seluruh modul.",
    permissions: [...PERMISSIONS],
    isSystem: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "role2",
    name: "Sales",
    description: "Kelola pelanggan, proyek, dan penawaran.",
    permissions: salesPermissions,
    isSystem: false,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "role3",
    name: "Viewer",
    description: "Hanya bisa melihat data, tanpa mengubah.",
    permissions: viewOnly,
    isSystem: false,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
];
