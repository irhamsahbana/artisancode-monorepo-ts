import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { passwordSchema, passwordEmpty, type PasswordValues } from "./schema";

export function PasswordForm() {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: passwordEmpty,
  });

  function onSubmit() {
    toast.success("Password berhasil diubah.");
    form.reset(passwordEmpty);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ubah Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" variant="outline">
                Ubah Password
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
