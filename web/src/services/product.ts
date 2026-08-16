import { mockProducts } from "@/data/products";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  CreateProductReq,
  Product,
  ProductList,
  UpdateProductReq,
} from "@artisancode/api-types";

function mockList(params?: {
  page?: number;
  per_page?: number;
  q?: string;
}): ProductList {
  const { page = 1, per_page = 100, q } = params ?? {};
  let items = mockProducts;
  if (q) {
    const query = q.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(query));
  }
  const start = (page - 1) * per_page;
  const paginatedItems = items.slice(start, start + per_page);
  return {
    items: paginatedItems,
    pagination: {
      total: items.length,
      page,
      per_page,
      last_page: Math.ceil(items.length / per_page),
    },
  };
}

export const productService = {
  list: (params?: { page?: number; per_page?: number; q?: string }) =>
    DEMO_MODE
      ? Promise.resolve(mockList(params))
      : api.get<ProductList>("/products", params),

  create: (body: CreateProductReq) =>
    DEMO_MODE ? mockCreate(body) : api.post<Product>("/products", body),

  update: (id: string, body: UpdateProductReq) =>
    DEMO_MODE
      ? mockUpdate(id, body)
      : api.put<Product>(`/products/${id}`, body),
};

function mockCreate(body: CreateProductReq): Promise<Product> {
  const now = new Date().toISOString();
  const p: Product = {
    id: `prod${crypto.randomUUID()}`,
    name: body.name,
    unit: body.unit,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  mockProducts.push(p);
  return Promise.resolve(p);
}

function mockUpdate(id: string, body: UpdateProductReq): Promise<Product> {
  const idx = mockProducts.findIndex((x) => x.id === id);
  const existing = mockProducts[idx];
  if (idx === -1 || !existing)
    return Promise.reject(new Error("Product not found"));
  const updated: Product = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  mockProducts[idx] = updated;
  return Promise.resolve(updated);
}
