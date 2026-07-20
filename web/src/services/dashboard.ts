import { mockCustomers } from "@/data/customers";
import { mockMasterData } from "@/data/master";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type { DashboardMetrics } from "@artisancode/api-types";

// ponytail: derive metrics live from mockCustomers so counts never drift from
// the list. Master names come from mockMasterData for byArea.
function mockStats(): DashboardMetrics {
  const count = (pred: (c: (typeof mockCustomers)[number]) => boolean) =>
    mockCustomers.filter(pred).length;

  const tally = <K extends keyof (typeof mockCustomers)[number]>(key: K) => {
    const map = new Map<string, number>();
    for (const c of mockCustomers) {
      const v = String(c[key]);
      map.set(v, (map.get(v) ?? 0) + 1);
    }
    return [...map.entries()].map(([k, c]) => ({ key: k, count: c }));
  };

  const nameOf = (group: string, id: string) =>
    mockMasterData[group]?.find((m) => m.id === id)?.name ?? id;

  const byArea = new Map<string, number>();
  for (const c of mockCustomers) {
    byArea.set(c.areaId, (byArea.get(c.areaId) ?? 0) + 1);
  }

  return {
    totalCustomers: mockCustomers.length,
    totalProspects: count((c) => c.status === "prospect"),
    totalActive: count((c) => c.status === "active"),
    totalInactive: count((c) => c.status === "inactive"),
    withContractHistory: count((c) => c.hasContractHistory),
    highPotential: count((c) => c.potential === "high"),
    byStatus: tally("status").map(({ key, count: c }) => ({
      status: key,
      count: c,
    })),
    byArea: [...byArea.entries()].map(([id, c]) => ({
      areaId: id,
      name: nameOf("area", id),
      count: c,
    })),
    byPotential: tally("potential").map(({ key, count: c }) => ({
      potential: key,
      count: c,
    })),
  };
}

export const dashboardService = {
  stats: () =>
    DEMO_MODE
      ? Promise.resolve(mockStats())
      : api.get<DashboardMetrics>("/dashboard"),
};
