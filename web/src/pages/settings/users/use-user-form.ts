import { DEFAULT_COUNTRY_CODE, localPhoneDigits } from "@artisancode/phone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useHasPermission } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-roles";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";

import {
  buildUserSchema,
  defaultUserValues,
  type UserFormValues,
} from "./user-schema";
import { generatePassword } from "./user-utils";

import type { UserAccount } from "@artisancode/api-types";

export function useUserForm(
  open: boolean,
  editing: UserAccount | null,
  onSuccess: () => void,
) {
  const { data: rolesData } = useRoles();
  const roles = rolesData?.items ?? [];
  const { mutate: create, isPending: isCreating } = useCreateUser();
  const { mutate: update, isPending: isUpdating } = useUpdateUser();
  const [showPassword, setShowPassword] = useState(false);
  const isEditing = !!editing;
  const canSubmit = useHasPermission(
    isEditing ? "users.update" : "users.create",
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(buildUserSchema(isEditing)),
    defaultValues: defaultUserValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editing
          ? {
              name: editing.name,
              username: editing.username,
              email: editing.email,
              phone: editing.phone,
              countryCode: editing.countryCode || DEFAULT_COUNTRY_CODE,
              password: "",
              roleId: editing.roleId,
              status: editing.status,
            }
          : defaultUserValues,
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  function generateAndFillPassword() {
    form.setValue("password", generatePassword(), { shouldValidate: true });
    setShowPassword(true);
  }

  function onSubmit(values: UserFormValues) {
    if (editing) {
      update(
        {
          id: editing.id,
          name: values.name,
          email: values.email,
          phone: localPhoneDigits(values.phone),
          country_code: values.countryCode,
          role_id: values.roleId,
          status: values.status,
        },
        {
          onSuccess: () => {
            toast.success("Pengguna berhasil diperbarui.");
            onSuccess();
          },
        },
      );
      return;
    }

    create(
      {
        name: values.name,
        username: values.username ?? "",
        email: values.email,
        phone: localPhoneDigits(values.phone),
        country_code: values.countryCode,
        password: values.password ?? "",
        role_id: values.roleId,
      },
      {
        onSuccess: async () => {
          try {
            await navigator.clipboard.writeText(
              `Email: ${values.email}\nPassword: ${values.password}`,
            );
            toast.success(
              "Pengguna ditambahkan, email & password disalin ke clipboard.",
            );
          } catch {
            toast.success("Pengguna berhasil ditambahkan.");
          }
          onSuccess();
        },
      },
    );
  }

  return {
    form,
    roles,
    showPassword,
    setShowPassword,
    isEditing,
    canSubmit,
    isSaving: isCreating || isUpdating,
    generateAndFillPassword,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
