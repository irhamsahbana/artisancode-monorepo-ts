import { DEFAULT_COUNTRY_CODE } from "@artisancode/phone";

import type { UserAccount } from "@artisancode/api-types";

// ponytail: in-memory user catalog (Pengaturan > Pengguna), mirrors data/roles.ts.
export const mockUsers: UserAccount[] = [
  {
    id: "user1",
    roleId: "role1",
    name: "Super Admin",
    username: "admin",
    email: "admin@wikabeton.id",
    phone: "81234567890",
    countryCode: DEFAULT_COUNTRY_CODE,
    status: "active",
    isProtected: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "user2",
    roleId: "role2",
    name: "Budi Santoso",
    username: "budi.santoso",
    email: "budi.santoso@wikabeton.id",
    phone: "81234567891",
    countryCode: DEFAULT_COUNTRY_CODE,
    status: "active",
    isProtected: false,
    createdAt: "2023-02-01T00:00:00.000Z",
    updatedAt: "2023-02-01T00:00:00.000Z",
  },
];
