import { api } from "@/lib/api";

import type {
  CreateProductReq,
  Product,
  ProductList,
  UpdateProductReq,
} from "@artisancode/api-types";

export const productService = {
  list: (params?: { page?: number; per_page?: number; q?: string }) =>
    api.get<ProductList>("/products", params),

  create: (body: CreateProductReq) => api.post<Product>("/products", body),

  update: (id: string, body: UpdateProductReq) =>
    api.put<Product>(`/products/${id}`, body),
};
