import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Combobox } from "@/components/shared/combobox";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { useHasPermission } from "@/hooks/use-auth";
import { useCategoryList } from "@/hooks/use-categories";
import { useContacts } from "@/hooks/use-contacts";
import { useCreateProjectVisit } from "@/hooks/use-projects";

const visitSchema = z.object({
  visitDate: z.string().min(1, "Tanggal kunjungan wajib diisi"),
  metWith: z.string().optional(),
  topic: z.string().optional(),
  notes: z.string().optional(),
});

type VisitFormValues = z.infer<typeof visitSchema>;

const EMPTY_FORM: VisitFormValues = {
  visitDate: "",
  metWith: "",
  topic: "",
  notes: "",
};

export function VisitLog({
  projectId,
  customerId,
  visits,
}: {
  projectId: string;
  customerId: string;
  visits: {
    id: string;
    visitDate: string;
    metWith?: string;
    topic?: string;
    notes?: string;
  }[];
}) {
  const { mutateAsync: addVisit, isPending } = useCreateProjectVisit(projectId);
  const { data: contacts } = useContacts(customerId);
  const { data: visitTopics } = useCategoryList("visit_topic");
  const [open, setOpen] = useState(false);
  const canCreate = useHasPermission("project_visits.create");

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: EMPTY_FORM,
  });

  async function onSubmit(values: VisitFormValues) {
    try {
      await addVisit({
        projectId,
        visitDate: values.visitDate,
        metWith: values.metWith || undefined,
        topic: values.topic || undefined,
        notes: values.notes || undefined,
      });
      toast.success("Log kunjungan ditambahkan.");
      form.reset(EMPTY_FORM);
      setOpen(false);
    } catch {
      toast.error("Gagal menambah log kunjungan.");
    }
  }

  const sorted = [...visits].sort((a, b) =>
    b.visitDate.localeCompare(a.visitDate),
  );

  const contactItems = contacts?.items ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Log Kunjungan / Follow-up</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" disabled={!canCreate}>
              <Plus className="mr-1 h-4 w-4" />
              Tambah Log
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Log Kunjungan</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                id="visit-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="visitDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metWith"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bertemu Dengan</FormLabel>
                      {contactItems.length > 0 ? (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih kontak..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contactItems.map((c) => (
                              <SelectItem key={c.id} value={c.name}>
                                {c.name}
                                {c.position ? ` — ${c.position}` : ""}
                              </SelectItem>
                            ))}
                            <div className="border-t px-2 py-1.5">
                              <Link
                                to={`/customers/${customerId}?tab=kontak`}
                                className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                              >
                                + Tambah kontak baru
                              </Link>
                            </div>
                          </SelectContent>
                        </Select>
                      ) : (
                        <>
                          <FormControl>
                            <Input placeholder="Nama kontak..." {...field} />
                          </FormControl>
                          <Link
                            to={`/customers/${customerId}?tab=kontak`}
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            + Tambah kontak di halaman pelanggan
                          </Link>
                        </>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topik</FormLabel>
                        <Combobox
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          options={(visitTopics?.items ?? []).map((t) => ({
                            value: t.name,
                          }))}
                          placeholder="Pilih atau ketik topik..."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catatan</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
            <DialogFooter showCloseButton>
              <Button
                type="submit"
                form="visit-form"
                disabled={isPending || !canCreate}
              >
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <EmptyState
            title="Belum ada log kunjungan"
            description="Catat hasil follow-up sales di sini."
          />
        ) : (
          <ul className="space-y-4">
            {sorted.map((v) => (
              <li key={v.id} className="rounded-md border px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {v.topic ?? "Kunjungan"}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {v.visitDate}
                  </span>
                </div>
                {v.metWith && (
                  <p className="text-xs text-muted-foreground">
                    Bertemu: {v.metWith}
                  </p>
                )}
                {v.notes && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {v.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
