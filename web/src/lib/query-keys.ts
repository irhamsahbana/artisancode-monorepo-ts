export const queryKeys = {
  customers: {
    all: ["customers"] as const,
    list: (params?: Record<string, unknown>) =>
      ["customers", "list", params] as const,
    detail: (id: string) => ["customers", "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: (group?: string) => ["categories", "list", group] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
  },
  contacts: {
    all: ["contacts"] as const,
    list: (customerId: string) => ["contacts", "list", customerId] as const,
    detail: (id: string) => ["contacts", "detail", id] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => ["dashboard", "stats"] as const,
  },
} as const;
