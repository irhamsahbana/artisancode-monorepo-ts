import { ArrowLeft, Pencil, MapPin, ExternalLink } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";

import { LocationView } from "@/components/projects/location-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContact } from "@/hooks/use-contacts";
import { useCustomers } from "@/hooks/use-customers";
import { useProducts } from "@/hooks/use-products";
import { useProject, useProjectVisits } from "@/hooks/use-projects";
import { useQuotations } from "@/hooks/use-quotations";
import {
  quotationStatusLabel,
  quotationStatusVariant,
} from "@/pages/quotations/quotation-status";

import {
  formatRupiah,
  projectStatusLabel,
  projectStatusVariant,
} from "./project-status";
import { VisitLog } from "./visit-log";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading } = useProject(id ?? "");
  const { data: customersData } = useCustomers({ per_page: 100 });
  const { data: contact } = useContact(project?.contactId ?? "");
  const { data: visits } = useProjectVisits(id ?? "");
  const { data: productsData } = useProducts();
  const { data: quotationsData } = useQuotations();

  const projectQuotations = (quotationsData?.items ?? [])
    .filter((q) => q.projectId === project?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

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
            <Info label="PIC (Pelanggan)">
              {contact ? (
                <Link
                  to={`/contacts/${contact.id}`}
                  className="hover:underline"
                >
                  {contact.name}
                </Link>
              ) : (
                "-"
              )}
            </Info>
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

        {projectQuotations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Daftar Penawaran</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {projectQuotations.map((q) => (
                  <li key={q.id} className="rounded-md border p-3">
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-sm">
                          {q.title || "Penawaran Tanpa Judul"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {q.createdAt.slice(0, 10)} &middot; {q.topic || "-"}
                        </p>
                      </div>
                      <Badge
                        variant={quotationStatusVariant[q.status]}
                        className="shrink-0 text-[10px] px-1.5 py-0 h-4"
                      >
                        {quotationStatusLabel[q.status]}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
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
