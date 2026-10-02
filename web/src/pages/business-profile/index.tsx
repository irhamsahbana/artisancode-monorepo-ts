import { localPhoneDigits } from "@artisancode/phone";
import { AppError, type RestResponse } from "@artisancode/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useHasPermission } from "@/hooks/use-auth";
import {
  useBusinessProfile,
  useDeleteBusinessIcon,
  useUpdateBusinessProfile,
  useUploadBusinessIcon,
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

function IconUpload({ canUpdate }: { canUpdate: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadBusinessIcon();
  const remove = useDeleteBusinessIcon();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      await upload.mutateAsync(file);
      toast.success("Icon berhasil diperbarui.");
    } catch (error) {
      toast.error(errorMessage(error, "Gagal mengunggah icon."));
    }
  }

  async function handleRemove() {
    if (!confirm("Kembalikan ke icon bawaan?")) return;
    try {
      await remove.mutateAsync();
      toast.success("Icon dikembalikan ke bawaan.");
    } catch (error) {
      toast.error(errorMessage(error, "Gagal menghapus icon."));
    }
  }

  return (
    <div className="sm:col-span-2 flex items-center gap-4">
      <img
        src="/favicon"
        alt="Icon aplikasi"
        className="h-12 w-12 rounded-lg border object-cover"
      />
      <div className="grid gap-1">
        <p className="text-sm font-medium">Icon Tab Browser</p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, SVG, atau ICO, maks 2MB.
        </p>
      </div>
      <div className="ml-auto flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canUpdate || upload.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          Ganti Icon
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canUpdate || remove.isPending}
          onClick={handleRemove}
        >
          Hapus
        </Button>
      </div>
    </div>
  );
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
                <IconUpload canUpdate={canUpdate} />
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
