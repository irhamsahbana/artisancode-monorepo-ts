import { localPhoneDigits } from "@artisancode/phone";
import { AppError, type RestResponse } from "@artisancode/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useHasPermission } from "@/hooks/use-auth";
import {
  useBusinessProfile,
  useUpdateBusinessProfile,
} from "@/hooks/use-business-profile";

import { ProfileFields } from "./profile-fields";
import { schema, emptyValues, type FormValues } from "./schema";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof AppError && (error.httpCode ?? 0) < 500) {
    const backendMessage = (error.data as RestResponse | undefined)?.message;
    return backendMessage || error.message;
  }
  return fallback;
}

export function BusinessProfile() {
  const canUpdate = useHasPermission("business_profiles.update");
  const { data: profile, isLoading } = useBusinessProfile();
  const update = useUpdateBusinessProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        phone: profile.phone ?? "",
        countryCode: profile.countryCode ?? emptyValues.countryCode,
        email: profile.email ?? "",
        address: profile.address ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  async function onSubmit(values: FormValues) {
    try {
      await update.mutateAsync({
        name: values.name,
        phone: localPhoneDigits(values.phone),
        countryCode: values.countryCode,
        email: values.email || undefined,
        address: values.address || undefined,
      });
      toast.success("Profil bisnis berhasil disimpan.");
    } catch (error) {
      toast.error(errorMessage(error, "Gagal menyimpan profil bisnis."));
    }
  }

  return (
    <div>
      <PageHeader
        title="Profil Bisnis"
        description="Informasi perusahaan Anda."
      />
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Memuat...</p>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                <ProfileFields control={form.control} />
                <div className="sm:col-span-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={!canUpdate || update.isPending}
                  >
                    Simpan
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
