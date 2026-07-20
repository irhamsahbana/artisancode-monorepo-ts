import { ArrowLeft, Pencil, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/hooks/use-customers";
import {
  useProject,
  useProjectVisits,
  useCreateProjectVisit,
} from "@/hooks/use-projects";

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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Info Proyek</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
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

          <VisitLog projectId={project.id} visits={visits ?? []} />
        </div>
      </div>
    </div>
  );
}

function VisitLog({
  projectId,
  visits,
}: {
  projectId: string;
  visits: {
    id: string;
    visitDate: string;
    metWith?: string;
    topic?: string;
    notes?: string;
  }[];
}) {
  const { mutateAsync: addVisit, isPending } = useCreateProjectVisit(projectId);
  const [form, setForm] = useState({
    visitDate: "",
    metWith: "",
    topic: "",
    notes: "",
  });

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
      toast.success("Log kunjungan ditambahkan.");
      setForm({ visitDate: "", metWith: "", topic: "", notes: "" });
    } catch {
      toast.error("Gagal menambah log kunjungan.");
    }
  }

  const sorted = [...visits].sort((a, b) =>
    b.visitDate.localeCompare(a.visitDate),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Log Kunjungan / Follow-up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sorted.length === 0 ? (
          <EmptyState
            title="Belum ada log kunjungan"
            description="Catat hasil follow-up sales di sini."
          />
        ) : (
          <ul className="space-y-3">
            {sorted.map((v) => (
              <li key={v.id} className="rounded-md border p-3">
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

        <form
          onSubmit={handleSubmit}
          className="grid gap-3 rounded-md border bg-muted/30 p-3 sm:grid-cols-2"
        >
          <p className="text-sm font-medium sm:col-span-2">Tambah Log</p>
          <div className="grid gap-1.5">
            <Label className="text-xs">Tanggal *</Label>
            <Input
              type="date"
              value={form.visitDate}
              onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Bertemu Dengan</Label>
            <Input
              value={form.metWith}
              onChange={(e) => setForm({ ...form, metWith: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label className="text-xs">Topik</Label>
            <Input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label className="text-xs">Catatan</Label>
            <Input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" size="sm" disabled={isPending}>
              <Plus className="mr-1 h-4 w-4" />
              {isPending ? "Menyimpan..." : "Tambah Log"}
            </Button>
          </div>
        </form>
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
