import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { ProfileFields } from "./profile-fields";
import { schema, initialValues, type FormValues } from "./schema";

export function BusinessProfile() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  function onSubmit() {
    toast.success("Profil bisnis berhasil disimpan.");
  }

  return (
    <div>
      <PageHeader
        title="Profil Bisnis"
        description="Informasi perusahaan Anda."
      />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              <ProfileFields control={form.control} />
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
