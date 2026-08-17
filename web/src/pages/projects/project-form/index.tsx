import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useContacts } from "@/hooks/use-contacts";
import { useCustomers } from "@/hooks/use-customers";
import {
  useCreateProject,
  useProject,
  useUpdateProject,
} from "@/hooks/use-projects";

import { BasicFields } from "./basic-fields";
import { NotesField } from "./notes-field";
import { OutcomeFields } from "./outcome-fields";
import { ProductsField } from "./products-field";
import { schema, emptyValues, type FormValues } from "./schema";

export function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existing } = useProject(id ?? "");
  const { data: customersData } = useCustomers({ per_page: 100 });
  const { mutateAsync: createProject, isPending: creating } =
    useCreateProject();
  const { mutateAsync: updateProject, isPending: updating } = useUpdateProject(
    id ?? "",
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        projectNumber: existing.projectNumber,
        name: existing.name,
        customerId: existing.customerId,
        contactId: existing.contactId ?? "",
        location: existing.location ?? "",
        latitude: existing.latitude,
        longitude: existing.longitude,
        sourceOfFunds: existing.sourceOfFunds ?? "",
        picName: existing.picName ?? "",
        status: existing.status,
        estimatedValue: existing.estimatedValue?.toString() ?? "",
        spkNumber: existing.spkNumber ?? "",
        lostReason: existing.lostReason ?? "",
        winnerCompetitor: existing.winnerCompetitor ?? "",
        products: existing.products ?? [],
        notes: existing.notes ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing]);

  async function onSubmit(values: FormValues) {
    const body = {
      projectNumber: values.projectNumber || undefined,
      name: values.name,
      customerId: values.customerId,
      contactId: values.contactId || undefined,
      location: values.location || undefined,
      latitude: values.latitude,
      longitude: values.longitude,
      sourceOfFunds: values.sourceOfFunds || undefined,
      picName: values.picName || undefined,
      status: values.status,
      estimatedValue: values.estimatedValue
        ? Number(values.estimatedValue)
        : undefined,
      spkNumber:
        values.status === "won" ? values.spkNumber || undefined : undefined,
      lostReason:
        values.status === "lost" ? values.lostReason || undefined : undefined,
      winnerCompetitor:
        values.status === "lost"
          ? values.winnerCompetitor || undefined
          : undefined,
      products: values.products.length ? values.products : undefined,
      notes: values.notes || undefined,
    };
    try {
      if (isEdit) {
        await updateProject(body);
        toast.success("Proyek berhasil diperbarui.");
        navigate(`/projects/${id}`);
      } else {
        await createProject(body);
        toast.success("Proyek berhasil ditambahkan.");
        navigate("/projects");
      }
    } catch {
      toast.error("Gagal menyimpan data proyek.");
    }
  }

  const customerId = useWatch({ control: form.control, name: "customerId" });
  const status = useWatch({ control: form.control, name: "status" });
  const { data: contactsData } = useContacts(customerId);
  const customers = customersData?.items ?? [];
  const contacts = contactsData?.items ?? [];
  const isPending = creating || updating;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEdit ? "Edit Proyek" : "Tambah Proyek"}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              <BasicFields
                control={form.control}
                setValue={form.setValue}
                customers={customers}
                contacts={contacts}
                showLocationPicker={!isEdit || !!existing}
              />

              <OutcomeFields control={form.control} status={status} />

              <ProductsField control={form.control} />

              <NotesField control={form.control} />

              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? "Menyimpan..."
                    : isEdit
                      ? "Simpan Perubahan"
                      : "Tambah Proyek"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
