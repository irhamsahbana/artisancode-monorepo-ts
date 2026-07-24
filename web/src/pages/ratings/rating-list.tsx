import { Star, Plus, History } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomers } from "@/hooks/use-customers";
import { useCreateRating, useRatings } from "@/hooks/use-ratings";
import { summarizeRatings } from "@/services/rating";

import { riskLabel, riskVariant } from "./rating-status";

import type { RiskLevel } from "@artisancode/api-types";

interface FormState {
  customerId: string;
  ratingDate: string;
  paymentScore: string;
  relationshipScore: string;
  riskLevel: RiskLevel;
  problemNotes: string;
  notes: string;
}

const emptyForm: FormState = {
  customerId: "",
  ratingDate: new Date().toISOString().slice(0, 10),
  paymentScore: "3",
  relationshipScore: "3",
  riskLevel: "low",
  problemNotes: "",
  notes: "",
};

export function RatingList() {
  const { data: customersData } = useCustomers({ per_page: 100 });
  const { data } = useRatings();

  // Only customers with contract history are eligible for rating.
  const eligible = useMemo(
    () => (customersData?.items ?? []).filter((c) => c.hasContractHistory),
    [customersData],
  );

  const summary = useMemo(() => summarizeRatings(data?.items ?? []), [data]);

  const customerName = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of customersData?.items ?? []) map.set(c.id, c.name);
    return map;
  }, [customersData]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyFor, setHistoryFor] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Penilaian Pelanggan"
        description="Skor pembayaran & hubungan untuk pelanggan berkontrak."
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah Penilaian
          </Button>
        }
      />

      {eligible.length === 0 ? (
        <EmptyState
          title="Belum ada pelanggan berkontrak"
          description="Penilaian hanya berlaku untuk pelanggan dengan riwayat kontrak."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {eligible.map((c) => {
            const s = summary.get(c.id);
            const avg = s ? s.avgTotal / 2 : 0;
            return (
              <Card key={c.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        to={`/customers/${c.id}`}
                        className="truncate font-medium hover:underline"
                      >
                        {c.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {s ? `${s.count} penilaian` : "Belum dinilai"}
                      </p>
                    </div>
                    {s && (
                      <Badge variant={riskVariant[s.latest.riskLevel]}>
                        Risiko {riskLabel[s.latest.riskLevel]}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-2xl font-semibold">
                      {s ? avg.toFixed(1) : "-"}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 5</span>
                  </div>

                  {s && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>
                        Pembayaran:{" "}
                        <b className="text-foreground">
                          {s.avgPayment.toFixed(1)}
                        </b>
                      </span>
                      <span>
                        Hubungan:{" "}
                        <b className="text-foreground">
                          {s.avgRelationship.toFixed(1)}
                        </b>
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHistoryFor(c.id)}
                    >
                      <History className="mr-1 h-4 w-4" />
                      Riwayat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <RatingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        eligible={eligible.map((c) => ({ id: c.id, name: c.name }))}
      />

      <HistoryDialog
        customerId={historyFor}
        customerName={historyFor ? (customerName.get(historyFor) ?? "-") : "-"}
        ratings={data?.items ?? []}
        onClose={() => setHistoryFor(null)}
      />
    </div>
  );
}

function RatingDialog({
  open,
  onOpenChange,
  eligible,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  eligible: { id: string; name: string }[];
}) {
  const { mutateAsync, isPending } = useCreateRating();
  const [form, setForm] = useState<FormState>(emptyForm);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function reset() {
    setForm({
      ...emptyForm,
      ratingDate: new Date().toISOString().slice(0, 10),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerId) {
      toast.error("Pilih pelanggan terlebih dahulu.");
      return;
    }
    try {
      await mutateAsync({
        customerId: form.customerId,
        ratingDate: form.ratingDate,
        paymentScore: Number(form.paymentScore),
        relationshipScore: Number(form.relationshipScore),
        riskLevel: form.riskLevel,
        problemNotes: form.problemNotes || undefined,
        notes: form.notes || undefined,
      });
      toast.success("Penilaian tersimpan.");
      reset();
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
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field label="Pelanggan *">
            <Select
              value={form.customerId}
              onValueChange={(v) => set("customerId", v)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih pelanggan berkontrak" />
              </SelectTrigger>
              <SelectContent>
                {eligible.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Tanggal Penilaian *">
            <Input
              type="date"
              required
              value={form.ratingDate}
              onChange={(e) => set("ratingDate", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Skor Pembayaran (1-5)">
              <Select
                value={form.paymentScore}
                onValueChange={(v) => set("paymentScore", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Skor Hubungan (1-5)">
              <Select
                value={form.relationshipScore}
                onValueChange={(v) => set("relationshipScore", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Level Risiko *">
            <Select
              value={form.riskLevel}
              onValueChange={(v) => set("riskLevel", v as RiskLevel)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Rendah</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Catatan Masalah">
            <Input
              value={form.problemNotes}
              onChange={(e) => set("problemNotes", e.target.value)}
              placeholder="Contoh: sering telat bayar"
            />
          </Field>

          <Field label="Catatan Tambahan">
            <Input
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>

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
      </DialogContent>
    </Dialog>
  );
}

function HistoryDialog({
  customerId,
  customerName,
  ratings,
  onClose,
}: {
  customerId: string | null;
  customerName: string;
  ratings: {
    id: string;
    customerId: string;
    ratingDate: string;
    paymentScore: number;
    relationshipScore: number;
    riskLevel: RiskLevel;
    notes?: string;
    problemNotes?: string;
  }[];
  onClose: () => void;
}) {
  const items = customerId
    ? ratings
        .filter((r) => r.customerId === customerId)
        .sort((a, b) => b.ratingDate.localeCompare(a.ratingDate))
    : [];

  return (
    <Dialog open={!!customerId} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Riwayat Penilaian</DialogTitle>
          <DialogDescription>{customerName}</DialogDescription>
        </DialogHeader>
        {items.length === 0 ? (
          <EmptyState title="Belum ada riwayat penilaian" />
        ) : (
          <ul className="max-h-[60vh] space-y-3 overflow-auto">
            {items.map((r) => (
              <li key={r.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{r.ratingDate}</span>
                  <Badge variant={riskVariant[r.riskLevel]}>
                    {riskLabel[r.riskLevel]}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 text-xs text-muted-foreground">
                  <span>
                    Pembayaran:{" "}
                    <b className="text-foreground">{r.paymentScore}</b>
                  </span>
                  <span>
                    Hubungan:{" "}
                    <b className="text-foreground">{r.relationshipScore}</b>
                  </span>
                </div>
                {r.problemNotes && (
                  <p className="mt-1 text-xs text-destructive">
                    {r.problemNotes}
                  </p>
                )}
                {r.notes && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
