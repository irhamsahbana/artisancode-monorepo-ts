import { ArrowLeft, Pencil, MapPin, Plus, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { toast } from "sonner";

import { LocationView } from "@/components/projects/location-view";
import { EmptyState } from "@/components/shared/empty-state";
import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useContacts } from "@/hooks/use-contacts";
import { useCustomers } from "@/hooks/use-customers";
import { useProducts } from "@/hooks/use-products";
import {
  useProject,
  useProjectVisits,
  useCreateProjectVisit,
} from "@/hooks/use-projects";
import { useCreateRating } from "@/hooks/use-ratings";

import {
  formatRupiah,
  projectStatusLabel,
  projectStatusVariant,
} from "./project-status";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading } = useProject(id ?? "");
  const { data: customersData } = useCustomers({ per_page: 100 });
  const { data: visits } = useProjectVisits(id ?? "");
  const { data: productsData } = useProducts();

  const customer = customersData?.items.find(
    (c) => c.id === project?.customerId,
  );

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Memuat...</p>;
  if (!project)
    return (
      <p className="text-sm text-muted-foreground">Proyek tidak ditemukan.</p>
    );

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{project.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {project.projectNumber}
            </span>
            <Badge variant={projectStatusVariant[project.status]}>
              {projectStatusLabel[project.status]}
            </Badge>
            {project.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {project.location}
              </span>
            )}
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/projects/${id}/edit`}>
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Info Proyek</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info label="Pelanggan">
              {customer ? (
                <Link
                  to={`/customers/${customer.id}`}
                  className="hover:underline"
                >
                  {customer.name}
                </Link>
              ) : (
                "-"
              )}
            </Info>
            <Info label="Sumber Dana">{project.sourceOfFunds ?? "-"}</Info>
            <Info label="PIC (Sales)">{project.picName ?? "-"}</Info>
            <Info label="Nilai Estimasi">
              {formatRupiah(project.estimatedValue)}
            </Info>
            {project.status === "won" && (
              <Info label="Nomor SPK">{project.spkNumber ?? "-"}</Info>
            )}
            {project.status === "lost" && (
              <>
                <Info label="Alasan Gagal">{project.lostReason ?? "-"}</Info>
                <Info label="Pesaing Pemenang">
                  {project.winnerCompetitor ?? "-"}
                </Info>
              </>
            )}
            {project.notes && (
              <div className="sm:col-span-2">
                <Info label="Catatan">{project.notes}</Info>
              </div>
            )}
          </CardContent>
        </Card>

        {project.latitude != null && project.longitude != null && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Lokasi</CardTitle>
            </CardHeader>
            <CardContent>
              <LocationView
                latitude={project.latitude}
                longitude={project.longitude}
              />
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${project.latitude}&mlon=${project.longitude}#map=16/${project.latitude}/${project.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Buka di OpenStreetMap
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Buka di Google Maps
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {project.products && project.products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {project.products.map((line) => {
                  const product = productsData?.items.find(
                    (p) => p.id === line.productId,
                  );
                  return (
                    <li
                      key={line.productId}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <span>{product?.name ?? line.productId}</span>
                      <span className="text-muted-foreground">
                        {line.quantity} {product?.unit ?? ""}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        <VisitLog
          projectId={project.id}
          customerId={project.customerId}
          visits={visits ?? []}
        />
      </div>
    </div>
  );
}

const EMPTY_FORM = {
  visitDate: "",
  metWith: "",
  topic: "",
  notes: "",
  paymentScore: 0,
  relationshipScore: 0,
};

function VisitLog({
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
  const { mutateAsync: addRating } = useCreateRating();
  const { data: contacts } = useContacts(customerId);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.visitDate) {
      toast.error("Tanggal kunjungan wajib diisi.");
      return;
    }
    try {
      await addVisit({
        projectId,
        visitDate: form.visitDate,
        metWith: form.metWith || undefined,
        topic: form.topic || undefined,
        notes: form.notes || undefined,
      });
      if (form.paymentScore > 0 && form.relationshipScore > 0) {
        await addRating({
          customerId,
          ratingDate: form.visitDate,
          paymentScore: form.paymentScore,
          relationshipScore: form.relationshipScore,
          riskLevel: "low",
          notes: form.notes || undefined,
        });
      }
      toast.success("Log kunjungan ditambahkan.");
      setForm(EMPTY_FORM);
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
            <Button size="sm" variant="outline">
              <Plus className="mr-1 h-4 w-4" />
              Tambah Log
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Log Kunjungan</DialogTitle>
            </DialogHeader>
            <form
              id="visit-form"
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <div className="grid gap-1.5">
                <Label>Tanggal *</Label>
                <Input
                  type="date"
                  value={form.visitDate}
                  onChange={(e) =>
                    setForm({ ...form, visitDate: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Bertemu Dengan</Label>
                {contactItems.length > 0 ? (
                  <Select
                    value={form.metWith}
                    onValueChange={(v) => setForm({ ...form, metWith: v })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kontak..." />
                    </SelectTrigger>
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
                    <Input
                      value={form.metWith}
                      onChange={(e) =>
                        setForm({ ...form, metWith: e.target.value })
                      }
                      placeholder="Nama kontak..."
                    />
                    <Link
                      to={`/customers/${customerId}?tab=kontak`}
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      + Tambah kontak di halaman pelanggan
                    </Link>
                  </>
                )}
              </div>
              <div className="grid gap-1.5 sm:col-span-2">
                <Label>Topik</Label>
                <Input
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5 sm:col-span-2">
                <Label>Catatan</Label>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <Separator />
                <p className="pt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Penilaian Pelanggan (opsional)
                </p>
              </div>

              <div className="grid gap-1.5">
                <Label>Skor Pembayaran</Label>
                <StarRating
                  value={form.paymentScore}
                  onChange={(v) => setForm({ ...form, paymentScore: v })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Skor Hubungan</Label>
                <StarRating
                  value={form.relationshipScore}
                  onChange={(v) => setForm({ ...form, relationshipScore: v })}
                />
              </div>
            </form>
            <DialogFooter showCloseButton>
              <Button type="submit" form="visit-form" disabled={isPending}>
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

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{children}</p>
    </div>
  );
}
