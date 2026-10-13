import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  useCreateUnitConversion,
  useUpdateUnitConversion,
} from "@/hooks/use-unit-conversions";

import {
  defaultUnitConversionValues,
  unitConversionSchema,
  type UnitConversionFormValues,
} from "./unit-conversion-schema";

import type { UnitConversion, UnitOfMeasurement } from "@artisancode/api-types";

export function useUnitConversionForm(
  open: boolean,
  editing: UnitConversion | null,
  uoms: UnitOfMeasurement[],
  onSuccess: () => void,
) {
  const { mutate: create, isPending: isCreating } = useCreateUnitConversion();
  const { mutate: update, isPending: isUpdating } = useUpdateUnitConversion();

  const form = useForm<UnitConversionFormValues>({
    resolver: zodResolver(unitConversionSchema),
    defaultValues: defaultUnitConversionValues,
  });

  useEffect(() => {
    if (open) {
      const fromUnit = uoms.find((u) => u.id === editing?.fromUnitId);
      form.reset(
        editing
          ? {
              category: fromUnit?.category ?? "",
              fromUnitId: editing.fromUnitId,
              toUnitId: editing.toUnitId,
              factor: String(editing.factor),
            }
          : defaultUnitConversionValues,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const category = useWatch({ control: form.control, name: "category" });
  const unitsInCategory = useMemo(
    () => uoms.filter((u) => u.category === category),
    [uoms, category],
  );

  function onSubmit(values: UnitConversionFormValues) {
    const factor = Number(values.factor);
    if (editing) {
      update(
        {
          id: editing.id,
          fromUnitId: values.fromUnitId,
          toUnitId: values.toUnitId,
          factor,
        },
        {
          onSuccess: () => {
            toast.success("Konversi satuan berhasil diperbarui.");
            onSuccess();
          },
        },
      );
    } else {
      create(
        { fromUnitId: values.fromUnitId, toUnitId: values.toUnitId, factor },
        {
          onSuccess: () => {
            toast.success("Konversi satuan berhasil ditambahkan.");
            onSuccess();
          },
        },
      );
    }
  }

  return {
    form,
    category,
    unitsInCategory,
    isSubmitting: isCreating || isUpdating,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
