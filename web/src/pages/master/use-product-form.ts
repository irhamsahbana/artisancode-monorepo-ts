import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";

import {
  defaultProductValues,
  productSchema,
  type ProductFormValues,
} from "./product-schema";

import type { Product } from "@artisancode/api-types";

export function useProductForm(
  open: boolean,
  editing: Product | null,
  onSuccess: () => void,
) {
  const { mutate: create, isPending: isCreating } = useCreateProduct();
  const { mutate: update, isPending: isUpdating } = useUpdateProduct();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: editing?.name ?? "",
        unit: editing?.unit ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  function onSubmit(values: ProductFormValues) {
    if (editing) {
      update(
        { id: editing.id, ...values },
        {
          onSuccess: () => {
            toast.success("Produk berhasil diperbarui.");
            onSuccess();
          },
        },
      );
    } else {
      create(values, {
        onSuccess: () => {
          toast.success("Produk berhasil ditambahkan.");
          onSuccess();
        },
      });
    }
  }

  return {
    form,
    isSubmitting: isCreating || isUpdating,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
