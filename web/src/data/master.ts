import type { MasterItem } from "@artisancode/api-types";

// ponytail: in-memory master data, keyed by the same group strings the master
// pages and categoryService use (segmentation | area | relation_status).
// Single source for both the master CRUD UI and dropdowns.
export const mockMasterData: Record<string, MasterItem[]> = {
  segmentation: [
    {
      id: "seg1",
      name: "UMKM",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "seg2",
      name: "Korporat",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "seg3",
      name: "Enterprise",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "seg4",
      name: "Startup",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "seg5",
      name: "Freelancer",
      isActive: false,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
  ],
  area: [
    {
      id: "area1",
      name: "Jakarta Selatan",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "area2",
      name: "Jakarta Barat",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "area3",
      name: "Bandung",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "area4",
      name: "Surabaya",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "area5",
      name: "Yogyakarta",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "area6",
      name: "Medan",
      isActive: false,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
  ],
  relation_status: [
    {
      id: "rs1",
      name: "Prospek",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "rs2",
      name: "Aktif",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "rs3",
      name: "Tidak Aktif",
      isActive: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "rs4",
      name: "Blacklist",
      isActive: false,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
  ],
};
