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
    search: (q: string) => ["contacts", "search", q] as const,
    searchPersons: (params?: Record<string, unknown>) =>
      ["contacts", "search-persons", params] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => ["dashboard", "stats"] as const,
  },
  projects: {
    all: ["projects"] as const,
    list: (params?: Record<string, unknown>) =>
      ["projects", "list", params] as const,
    detail: (id: string) => ["projects", "detail", id] as const,
    visits: (projectId: string) => ["projects", "visits", projectId] as const,
    allVisits: () => ["projects", "visits"] as const,
  },
  broadcasts: {
    all: ["broadcasts"] as const,
    list: (params?: Record<string, unknown>) =>
      ["broadcasts", "list", params] as const,
  },
  quotations: {
    all: ["quotations"] as const,
    list: (params?: Record<string, unknown>) =>
      ["quotations", "list", params] as const,
  },
  ratings: {
    all: ["ratings"] as const,
    list: (customerId?: string) => ["ratings", "list", customerId] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params?: Record<string, unknown>) =>
      ["products", "list", params] as const,
  },
  uoms: {
    all: ["uoms"] as const,
    list: (params?: Record<string, unknown>) =>
      ["uoms", "list", params] as const,
  },
  unitConversions: {
    all: ["unitConversions"] as const,
    list: (params?: Record<string, unknown>) =>
      ["unitConversions", "list", params] as const,
  },
  roles: {
    all: ["roles"] as const,
    list: (params?: Record<string, unknown>) =>
      ["roles", "list", params] as const,
    detail: (id: string) => ["roles", "detail", id] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params?: Record<string, unknown>) =>
      ["users", "list", params] as const,
  },
} as const;
