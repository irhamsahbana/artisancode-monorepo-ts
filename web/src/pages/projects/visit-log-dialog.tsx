import { Link } from "react-router";

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
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
import { useCategoryList } from "@/hooks/use-categories";
import { useContacts } from "@/hooks/use-contacts";

import { useVisitLogForm } from "./use-visit-log-form";

export function VisitLogDialog({
  open,
  onOpenChange,
  projectId,
  customerId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  customerId: string;
}) {
  const { form, isSubmitting, onSubmit } = useVisitLogForm(projectId, () =>
    onOpenChange(false),
  );
  const { data: contacts } = useContacts(customerId);
  const { data: visitTopics } = useCategoryList("visit_topic");

  const contactItems = contacts?.items ?? [];
  const visitTopicItems = visitTopics?.items ?? [];

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-3xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Tambah Log Kunjungan</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <Form {...form}>
          <form
            id="visit-form"
            onSubmit={onSubmit}
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
                    <Select value={field.value} onValueChange={field.onChange}>
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
                    {visitTopicItems.length > 0 ? (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih topik..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {visitTopicItems.map((t) => (
                            <SelectItem key={t.id} value={t.name}>
                              {t.name}
                            </SelectItem>
                          ))}
                          <div className="border-t px-2 py-1.5">
                            <Link
                              to="/master/visit-topics"
                              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                            >
                              + Tambah topik baru
                            </Link>
                          </div>
                        </SelectContent>
                      </Select>
                    ) : (
                      <>
                        <FormControl>
                          <Input placeholder="Topik kunjungan..." {...field} />
                        </FormControl>
                        <Link
                          to="/master/visit-topics"
                          className="text-xs text-muted-foreground hover:underline"
                        >
                          + Tambah topik di halaman master data
                        </Link>
                      </>
                    )}
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
        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" form="visit-form" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
