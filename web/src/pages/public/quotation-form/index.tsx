import { toFullPhone } from "@artisancode/phone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useProducts } from "@/hooks/use-products";
import { useProjects } from "@/hooks/use-projects";
import { useCreateQuotation } from "@/hooks/use-quotations";

import { NotesField } from "./notes-field";
import { ProductLinesSection } from "./product-lines-section";
import { RequestFields } from "./request-fields";
import { schema, emptyValues, newLine, type FormValues } from "./schema";

export function QuotationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const isInternal = location.pathname.startsWith("/quotations");

  const { mutateAsync, isPending } = useCreateQuotation();
  const { data: projectsData } = useProjects();
  const { data: productsData } = useProducts();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  async function onSubmit(values: FormValues) {
    try {
      const products = values.productLines
        .filter((l) => l.productId)
        .map((l) => {
          const product = productsData?.items.find((p) => p.id === l.productId);
          return {
            productName: product ? product.name : (l.productId ?? ""),
            specification: l.specification || undefined,
            quantity:
              [l.quantity, l.unit].filter(Boolean).join(" ") || undefined,
          };
        });

      await mutateAsync({
        title: values.title || undefined,
        topic: values.topic || undefined,
        projectId: values.projectId || undefined,
        requesterName: values.requesterName,
        companyName: values.companyName || undefined,
        whatsapp: toFullPhone(values.countryCode, values.whatsapp),
        email: values.email || undefined,
        products: products.length ? products : undefined,
        notes: values.notes || undefined,
      });

      if (isInternal) {
        toast.success("Penawaran berhasil dibuat.");
        navigate("/quotations");
      } else {
        toast.success(
          "Permintaan terkirim. Kami akan segera menghubungi Anda.",
        );
        form.reset({ ...emptyValues, productLines: [newLine()] });
      }
    } catch {
      toast.error("Gagal mengirim permintaan. Coba lagi.");
    }
  }

  const projects = projectsData?.items ?? [];

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold">Permintaan Penawaran</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Isi form di bawah untuk mendapatkan penawaran produk beton precast.
            Kami akan membalas via WhatsApp dalam 1×24 jam.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-5"
              >
                <RequestFields control={form.control} projects={projects} />

                <ProductLinesSection control={form.control} />

                <NotesField control={form.control} />

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(isInternal ? "/quotations" : "/")}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending
                      ? "Menyimpan..."
                      : isInternal
                        ? "Buat Penawaran"
                        : "Kirim Permintaan"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Butuh penawaran cepat? WhatsApp kami di{" "}
            <a
              href="https://wa.me/6281234567890"
              className="font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              6281234567890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
