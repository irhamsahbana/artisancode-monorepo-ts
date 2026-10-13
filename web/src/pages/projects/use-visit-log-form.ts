import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateProjectVisit } from "@/hooks/use-projects";

import {
  emptyVisitValues,
  visitSchema,
  type VisitFormValues,
} from "./visit-log-schema";

export function useVisitLogForm(projectId: string, onSuccess: () => void) {
  const { mutateAsync: addVisit, isPending } = useCreateProjectVisit(projectId);

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: emptyVisitValues,
  });

  async function onSubmit(values: VisitFormValues) {
    try {
      await addVisit({
        projectId,
        visitDate: values.visitDate,
        metWith: values.metWith || undefined,
        topic: values.topic || undefined,
        notes: values.notes || undefined,
      });
      toast.success("Log kunjungan ditambahkan.");
      form.reset(emptyVisitValues);
      onSuccess();
    } catch {
      toast.error("Gagal menambah log kunjungan.");
    }
  }

  return {
    form,
    isSubmitting: isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
