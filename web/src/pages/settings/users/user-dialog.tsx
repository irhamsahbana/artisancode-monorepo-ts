import { DEFAULT_COUNTRY_CODE, localPhoneDigits } from "@artisancode/phone";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CountryCodeSelect } from "@/components/shared/country-code-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHasPermission } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-roles";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";

import type { UserAccount } from "@artisancode/api-types";

function buildSchema(isEditing: boolean) {
  return z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    username: isEditing
      ? z.string().optional()
      : z.string().min(3, "Username minimal 3 karakter"),
    email: z.email("Email tidak valid"),
    phone: z.string().min(1, "Nomor telepon wajib diisi"),
    countryCode: z.string().min(1, "Kode negara wajib dipilih"),
    password: isEditing
      ? z.string().optional()
      : z.string().min(6, "Password minimal 6 karakter"),
    roleId: z.string().min(1, "Role wajib dipilih"),
    status: z.enum(["active", "inactive"]),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

const emptyValues: FormValues = {
  name: "",
  username: "",
  email: "",
  phone: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  password: "",
  roleId: "",
  status: "active",
};

function generatePassword() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

export function UserDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: UserAccount | null;
}) {
  const { data: rolesData } = useRoles();
  const roles = rolesData?.items ?? [];
  const { mutate: create, isPending: isCreating } = useCreateUser();
  const { mutate: update, isPending: isUpdating } = useUpdateUser();
  const [showPassword, setShowPassword] = useState(false);
  const isEditing = !!editing;
  const canSubmit = useHasPermission(
    isEditing ? "users.update" : "users.create",
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(isEditing)),
    defaultValues: emptyValues,
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
          : emptyValues,
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  function onSubmit(values: FormValues) {
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
            onOpenChange(false);
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
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Pengguna" : "Tambah Pengguna"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-3 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama lengkap" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!editing && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field: countryField }) => (
                        <CountryCodeSelect
                          value={countryField.value}
                          onValueChange={countryField.onChange}
                        />
                      )}
                    />
                    <FormControl>
                      <Input
                        placeholder="812xxxxxxxx"
                        className="flex-1"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!editing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                        onClick={() => {
                          form.setValue("password", generatePassword(), {
                            shouldValidate: true,
                          });
                          setShowPassword(true);
                        }}
                      >
                        <RefreshCw className="h-3 w-3" />
                        Generate
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="pr-9"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {editing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            type="submit"
            form="user-form"
            disabled={isCreating || isUpdating || !canSubmit}
          >
            {editing ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
