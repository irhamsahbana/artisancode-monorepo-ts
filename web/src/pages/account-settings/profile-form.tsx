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

import { profileSchema, profileInitial, type ProfileValues } from "./schema";

export function ProfileForm() {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileInitial,
  });

  function onSubmit() {
    toast.success("Profil akun berhasil diperbarui.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Informasi Akun</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
