import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateUom, useUpdateUom } from "@/hooks/use-uoms";

import { defaultUomValues, uomSchema, type UomFormValues } from "./uom-schema";

import type { UnitOfMeasurement } from "@artisancode/api-types";

export function useUomForm(
  open: boolean,
  editing: UnitOfMeasurement | null,
  onSuccess: () => void,
) {
  const { mutate: create, isPending: isCreating } = useCreateUom();
  const { mutate: update, isPending: isUpdating } = useUpdateUom();

  const form = useForm<UomFormValues>({
    resolver: zodResolver(uomSchema),
    defaultValues: defaultUomValues,
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: editing?.name ?? "",
        symbol: editing?.symbol ?? "",
        category: editing?.category ?? "other",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  function onSubmit(values: UomFormValues) {
    if (editing) {
      update(
        { id: editing.id, ...values },
        {
          onSuccess: () => {
            toast.success("Satuan berhasil diperbarui.");
            onSuccess();
          },
        },
      );
    } else {
      create(values, {
        onSuccess: () => {
          toast.success("Satuan berhasil ditambahkan.");
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
