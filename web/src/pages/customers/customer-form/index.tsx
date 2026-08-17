import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useCategoryList } from "@/hooks/use-categories";
import {
  useCreateCustomer,
  useCustomer,
  useUpdateCustomer,
} from "@/hooks/use-customers";

import { BasicInfoFields } from "./basic-info-fields";
import { CompanyInfoFields } from "./company-info-fields";
import { schema, emptyValues, type FormValues } from "./schema";

export function CustomerForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existing } = useCustomer(id ?? "");
  const { data: segmentationsData } = useCategoryList("segmentation");
  const { data: areasData } = useCategoryList("area");
  const { mutateAsync: createCustomer, isPending: creating } =
    useCreateCustomer();
  const { mutateAsync: updateCustomer, isPending: updating } =
    useUpdateCustomer(id ?? "");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        segmentationId: existing.segmentationId ?? "",
        areaId: existing.areaId ?? "",
        companyType: existing.companyType ?? "",
        status: existing.status,
        potential: existing.potential,
        address: existing.address ?? "",
        npwp: existing.npwp ?? "",
        skt: existing.skt ?? "",
        companyEmail: existing.companyEmail ?? "",
        website: existing.website ?? "",
        notes: existing.notes ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing]);

  async function onSubmit(values: FormValues) {
    const body = {
      name: values.name,
      segmentationId: values.segmentationId,
      areaId: values.areaId,
      companyType: values.companyType || undefined,
      status: values.status,
      potential: values.potential,
      address: values.address || undefined,
      npwp: values.npwp || undefined,
      skt: values.skt || undefined,
      companyEmail: values.companyEmail || undefined,
      website: values.website || undefined,
      notes: values.notes || undefined,
    };
    try {
      if (isEdit) {
        await updateCustomer(body);
        toast.success("Pelanggan berhasil diperbarui.");
        navigate(`/customers/${id}`);
      } else {
        await createCustomer(body);
        toast.success("Pelanggan berhasil ditambahkan.");
        navigate("/customers");
      }
    } catch {
      toast.error("Gagal menyimpan data pelanggan.");
    }
  }

  const segmentations =
    segmentationsData?.items.filter((s) => s.status === "active") ?? [];
  const areas = areasData?.items.filter((a) => a.status === "active") ?? [];
  const isPending = creating || updating;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEdit ? "Edit Pelanggan" : "Tambah Pelanggan"}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              <BasicInfoFields
                control={form.control}
                segmentations={segmentations}
                areas={areas}
              />

              <div className="sm:col-span-2">
                <Separator />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">
                  Info Umum Perusahaan
                </p>
              </div>

              <CompanyInfoFields control={form.control} />

              <div className="sm:col-span-2 flex justify-end gap-2">
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
                      : "Tambah Pelanggan"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
