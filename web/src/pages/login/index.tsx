import { AppError } from "@artisancode/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { InstallButton } from "@/components/shared/install-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useLogin } from "@/hooks/use-auth";

import { LoginFields } from "./login-fields";
import { schema, emptyValues, type FormValues } from "./schema";

export function Login() {
  const navigate = useNavigate();
  const { mutate: doLogin, isPending } = useLogin();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  function onSubmit(values: FormValues) {
    doLogin(values, {
      onSuccess: () => navigate("/dashboard"),
      onError: (error) => {
        const isServerError =
          error instanceof AppError && (error.httpCode ?? 0) >= 500;
        toast.error(
          isServerError
            ? "Terjadi kesalahan pada server. Coba lagi nanti."
            : "Email atau password salah.",
        );
      },
    });
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">CRM Wika</CardTitle>
          <CardDescription>Masuk ke akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <LoginFields control={form.control} />
              <Button
                type="submit"
                className="w-full mt-1"
                disabled={isPending}
              >
                {isPending ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <InstallButton />
    </div>
  );
}
