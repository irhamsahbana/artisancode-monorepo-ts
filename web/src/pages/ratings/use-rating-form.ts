import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateRating } from "@/hooks/use-ratings";

import {
  defaultRatingValues,
  ratingSchema,
  type RatingFormValues,
} from "./rating-schema";

export function useRatingForm(open: boolean, onSuccess: () => void) {
  const { mutateAsync, isPending } = useCreateRating();
  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: defaultRatingValues,
  });

  useEffect(() => {
    if (open) {
      form.reset({
        ...defaultRatingValues,
        ratingDate: new Date().toISOString().slice(0, 10),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(values: RatingFormValues) {
    try {
      await mutateAsync({
        customerId: values.customerId,
        ratingDate: values.ratingDate,
        paymentScore: Number(values.paymentScore),
        relationshipScore: Number(values.relationshipScore),
        riskLevel: values.riskLevel,
        problemNotes: values.problemNotes || undefined,
        notes: values.notes || undefined,
      });
      toast.success("Penilaian tersimpan.");
      form.reset({
        ...defaultRatingValues,
        ratingDate: new Date().toISOString().slice(0, 10),
      });
      onSuccess();
    } catch {
      toast.error("Gagal menyimpan penilaian.");
    }
  }

  return {
    form,
    isSubmitting: isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
