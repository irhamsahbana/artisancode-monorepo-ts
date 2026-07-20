import type { UnitConversion } from "@artisancode/api-types";

// ponytail: in-memory unit-conversion catalog (Master Data Konversi Satuan).
// Meaning: 1 fromUnitId = factor * toUnitId.
export const mockUnitConversions: UnitConversion[] = [
  {
    id: "uc1",
    fromUnitId: "uom3", // Sak
    toUnitId: "uom1", // Kilogram
    factor: 40,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "uc2",
    fromUnitId: "uom1", // Kilogram
    toUnitId: "uom2", // Gram
    factor: 1000,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "uc3",
    fromUnitId: "uom4", // Meter Kubik
    toUnitId: "uom5", // Liter
    factor: 1000,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
];
