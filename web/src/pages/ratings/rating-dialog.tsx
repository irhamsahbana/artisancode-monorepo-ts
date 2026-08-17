import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useCreateRating } from "@/hooks/use-ratings";

const ratingSchema = z.object({
  customerId: z.string().min(1, "Pelanggan wajib dipilih"),
  ratingDate: z.string().min(1, "Tanggal penilaian wajib diisi"),
  paymentScore: z.string(),
  relationshipScore: z.string(),
  riskLevel: z.enum(["low", "medium", "high"]),
  problemNotes: z.string().optional(),
  notes: z.string().optional(),
});

type RatingFormValues = z.infer<typeof ratingSchema>;

const emptyForm: RatingFormValues = {
  customerId: "",
  ratingDate: new Date().toISOString().slice(0, 10),
  paymentScore: "3",
  relationshipScore: "3",
  riskLevel: "low",
  problemNotes: "",
  notes: "",
};

export function RatingDialog({
  open,
  onOpenChange,
  eligible,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  eligible: { id: string; name: string }[];
}) {
  const { mutateAsync, isPending } = useCreateRating();
  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: emptyForm,
  });

  async function onSubmit(values: RatingFormValues) {
    try {
      await mutateAsync({
        customerId: values.customerId,
        ratingDate: values.ratingDate,
        paymentScore: Number(values.paymentScore),
        relationshipScore: Number(values.relationshipScore),
        riskLevel: values.riskLevel,
        problemNotes: values.problemNotes || undefined,
        notes: values.notes || undefined,
      });
      toast.success("Penilaian tersimpan.");
      form.reset({
        ...emptyForm,
        ratingDate: new Date().toISOString().slice(0, 10),
      });
      onOpenChange(false);
    } catch {
      toast.error("Gagal menyimpan penilaian.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Penilaian</DialogTitle>
          <DialogDescription>
            Nilai pelanggan berdasarkan pembayaran & hubungan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pelanggan *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih pelanggan berkontrak" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eligible.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ratingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Penilaian *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skor Pembayaran (1-5)</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relationshipScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skor Hubungan (1-5)</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level Risiko *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problemNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan Masalah</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: sering telat bayar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan Tambahan</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
