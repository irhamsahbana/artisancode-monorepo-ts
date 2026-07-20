import type { Product } from "@artisancode/api-types";

// ponytail: in-memory product catalog (Master Data Produk) for the demo.
export const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Beton Ready Mix K-300",
    unit: "m3",
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "prod2",
    name: "Paving Block",
    unit: "m2",
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "prod3",
    name: "Besi Beton 12mm",
    unit: "batang",
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "prod4",
    name: "Semen",
    unit: "sak",
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
];
