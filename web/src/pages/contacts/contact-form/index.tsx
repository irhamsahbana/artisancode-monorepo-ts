import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  useContact,
  useCreateContact,
  useUpdateContact,
} from "@/hooks/use-contacts";

import { BasicInfoFields } from "./basic-info-fields";
import { FamilyFields } from "./family-fields";
import { PersonalFields } from "./personal-fields";
import { ProfilingFields } from "./profiling-fields";
import { schema, emptyValues, type FormValues } from "./schema";

export function ContactForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  const customerIdParam = searchParams.get("customerId") ?? "";

  const { data: existing } = useContact(id ?? "");
  const customerId = isEdit ? (existing?.customerId ?? "") : customerIdParam;
  const { mutateAsync: updateContact, isPending: updating } =
    useUpdateContact(customerId);
  const { mutateAsync: createContact, isPending: creating } =
    useCreateContact(customerId);
  const isPending = isEdit ? updating : creating;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        position: existing.position ?? "",
        whatsapp: existing.whatsapp ?? "",
        email: existing.email ?? "",
        gender: existing.gender ?? "",
        birthPlace: existing.birthPlace ?? "",
        dateOfBirth: existing.dateOfBirth ?? "",
        religion: existing.religion ?? "",
        education: existing.education ?? "",
        address: existing.address ?? "",
        spouseName: existing.spouseName ?? "",
        spouseOccupation: existing.spouseOccupation ?? "",
        childrenNames: existing.childrenNames ?? "",
        childrenOccupation: existing.childrenOccupation ?? "",
        profiling: existing.profiling ?? "",
        notes: existing.notes ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing]);

  async function onSubmit(values: FormValues) {
    const body = {
      name: values.name,
      position: values.position || undefined,
      whatsapp: values.whatsapp || undefined,
      email: values.email || undefined,
      gender: values.gender || undefined,
      birthPlace: values.birthPlace || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      religion: values.religion || undefined,
      education: values.education || undefined,
      address: values.address || undefined,
      spouseName: values.spouseName || undefined,
      spouseOccupation: values.spouseOccupation || undefined,
      childrenNames: values.childrenNames || undefined,
      childrenOccupation: values.childrenOccupation || undefined,
      profiling: values.profiling || undefined,
      notes: values.notes || undefined,
    };
    try {
      if (isEdit) {
        if (!id) return;
        await updateContact({ id, ...body });
        toast.success("Key person berhasil diperbarui.");
        navigate(`/contacts/${id}`);
      } else {
        if (!customerId) return;
        const created = await createContact({ customerId, ...body });
        toast.success("Key person berhasil ditambahkan.");
        navigate(`/contacts/${created.id}`);
      }
    } catch {
      toast.error("Gagal menyimpan data key person.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEdit ? "Edit Key Person" : "Tambah Key Person"}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              <BasicInfoFields control={form.control} />

              <div className="sm:col-span-2">
                <Separator />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">
                  Data Pribadi
                </p>
              </div>

              <PersonalFields control={form.control} />

              <div className="sm:col-span-2">
                <Separator />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">
                  Info Keluarga
                </p>
              </div>

              <FamilyFields control={form.control} />

              <div className="sm:col-span-2">
                <Separator />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">
                  Profiling
                </p>
              </div>

              <ProfilingFields control={form.control} />

              <div className="sm:col-span-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
