import { mockMasterData } from "@/data/master";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type { MasterItem } from "@artisancode/api-types";

export interface CategoryItem {
  id: string;
  name: string;
  group: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CategoryList {
  items: CategoryItem[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
}

// ponytail: maps the in-memory master data (keyed by group) into the
// CategoryItem shape the master CRUD UI expects.
function toCategoryItem(m: MasterItem, group: string): CategoryItem {
  return {
    id: m.id,
    name: m.name,
    group,
    status: m.isActive ? "active" : "inactive",
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

function mockList(group?: string, q?: string): CategoryList {
  const groups = group ? [group] : Object.keys(mockMasterData);
  let items: CategoryItem[] = [];
  for (const g of groups) {
    const source = mockMasterData[g] ?? [];
    items.push(...source.map((m) => toCategoryItem(m, g)));
  }
  if (q) {
    const query = q.toLowerCase();
    items = items.filter((i) => i.name.toLowerCase().includes(query));
  }
  return {
    items,
    pagination: { total: items.length, page: 1, perPage: 100, lastPage: 1 },
  };
}

export const categoryService = {
  list: (group?: string, q?: string) =>
    DEMO_MODE
      ? Promise.resolve(mockList(group, q))
      : api.get<CategoryList>("/categories", { group, q, limit: 100 }),

  create: (group: string, name: string) =>
    DEMO_MODE
      ? mockCreate(group, name)
      : api.post<CategoryItem>("/categories", { group, name }),

  update: (id: string, body: { name?: string; status?: string }) =>
    DEMO_MODE
      ? mockUpdate(id, body)
      : api.put<CategoryItem>(`/categories/${id}`, body),

  delete: (id: string) =>
    DEMO_MODE ? mockDelete(id) : api.del(`/categories/${id}`),
};

function findGroup(id: string): string | undefined {
  return Object.keys(mockMasterData).find((g) =>
    (mockMasterData[g] ?? []).some((m) => m.id === id),
  );
}

function mockCreate(group: string, name: string): Promise<CategoryItem> {
  const now = new Date().toISOString();
  const item: MasterItem = {
    id: `m${crypto.randomUUID()}`,
    name,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  (mockMasterData[group] ??= []).push(item);
  return Promise.resolve(toCategoryItem(item, group));
}

function mockUpdate(
  id: string,
  body: { name?: string; status?: string },
): Promise<CategoryItem> {
  const group = findGroup(id);
  const arr = group ? mockMasterData[group] : undefined;
  if (!group || !arr) return Promise.reject(new Error("Category not found"));
  const idx = arr.findIndex((m) => m.id === id);
  const prev = arr[idx];
  if (idx === -1 || !prev)
    return Promise.reject(new Error("Category not found"));
  const updated: MasterItem = {
    ...prev,
    name: body.name ?? prev.name,
    isActive:
      ((body.status ?? prev.isActive) ? "active" : "inactive") === "active",
    updatedAt: new Date().toISOString(),
  };
  arr[idx] = updated;
  return Promise.resolve(toCategoryItem(updated, group));
}

function mockDelete(id: string): Promise<void> {
  const group = findGroup(id);
  const arr = group ? mockMasterData[group] : undefined;
  if (!group || !arr) return Promise.resolve();
  const idx = arr.findIndex((m) => m.id === id);
  if (idx !== -1) arr.splice(idx, 1);
  return Promise.resolve();
}
