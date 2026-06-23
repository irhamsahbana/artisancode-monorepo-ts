import { api } from "@/lib/api";

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

export const categoryService = {
  list: (group?: string, q?: string) =>
    api.get<CategoryList>("/categories", {
      group,
      q,
      limit: 100,
    }),

  create: (group: string, name: string) =>
    api.post<CategoryItem>("/categories", { group, name }),

  update: (id: string, body: { name?: string; status?: string }) =>
    api.put<CategoryItem>(`/categories/${id}`, body),

  delete: (id: string) => api.del(`/categories/${id}`),
};
