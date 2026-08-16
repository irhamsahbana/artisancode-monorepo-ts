import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { productService } from "@/services/product";

import type { UpdateProductReq } from "@artisancode/api-types";

export function useProducts(params?: {
  page?: number;
  per_page?: number;
  q?: string;
}) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productService.list(params),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.products.all }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateProductReq) =>
      productService.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.products.all }),
  });
}
