import { ArrowLeft, Building2, Mail, Pencil, Phone, Star } from "lucide-react";
import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContact, useContactSearch } from "@/hooks/use-contacts";
import { useRatings } from "@/hooks/use-ratings";

import { riskLabel, riskVariant } from "../ratings/rating-status";

export function ContactProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: contact, isLoading } = useContact(id ?? "");
  const { data: allContacts } = useContactSearch(contact?.name ?? "");
  const { data: ratingsData } = useRatings();

  // "pinjam perusahaan": same person, multiple companies, grouped by name.
  const companies = useMemo(
    () =>
      (allContacts ?? [])
        .filter((r) => r.contact.name === contact?.name)
        .map((r) => ({ contact: r.contact, customer: r.customer })),
    [allContacts, contact],
  );

  // Skor hubungan (person) — vs skor pembayaran yang tinggal di company.
  const history = useMemo(
    () =>
      (ratingsData?.items ?? [])
        .filter((r) => r.contactId === id)
        .sort((a, b) => b.ratingDate.localeCompare(a.ratingDate)),
    [ratingsData, id],
  );

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Memuat...</p>;
  if (!contact)
    return (
      <p className="text-sm text-muted-foreground">
        Key person tidak ditemukan.
      </p>
    );

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{contact.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            {contact.position && (
              <span className="text-xs text-muted-foreground">
                {contact.position}
              </span>
            )}
            {contact.isPrimary && (
              <Badge variant="secondary" className="text-[10px]">
                Kontak Utama
              </Badge>
            )}
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/contacts/${id}/edit`}>
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Data Pribadi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info
              icon={<Phone className="h-3.5 w-3.5" />}
              label="WhatsApp"
              value={contact.whatsapp ?? "-"}
            />
            <Info
              icon={<Mail className="h-3.5 w-3.5" />}
              label="Email"
              value={contact.email ?? "-"}
            />
            <Info
              label="Jenis Kelamin"
              value={
                contact.gender === "male"
                  ? "Laki-laki"
                  : contact.gender === "female"
                    ? "Perempuan"
                    : "-"
              }
            />
            <Info label="Tempat Lahir" value={contact.birthPlace ?? "-"} />
            <Info label="Tanggal Lahir" value={contact.dateOfBirth ?? "-"} />
            <Info label="Agama" value={contact.religion ?? "-"} />
            <Info label="Pendidikan" value={contact.education ?? "-"} />
            {contact.address && (
              <div className="sm:col-span-2">
                <Info label="Alamat" value={contact.address} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Info Keluarga</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info label="Nama Suami/Istri" value={contact.spouseName ?? "-"} />
            <Info
              label="Pekerjaan Suami/Istri"
              value={contact.spouseOccupation ?? "-"}
            />
            <Info label="Nama Anak" value={contact.childrenNames ?? "-"} />
            <Info
              label="Pekerjaan Anak"
              value={contact.childrenOccupation ?? "-"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Profiling</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {contact.profiling || "Belum ada catatan profiling dari sales."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Perusahaan Terkait</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {companies.length === 0 ? (
              <p className="text-sm text-muted-foreground">-</p>
            ) : (
              companies.map(({ contact: c, customer }) => (
                <Link
                  key={c.id}
                  to={`/customers/${customer.id}`}
                  className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/40"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    {customer.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {c.position ?? "-"}
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Historis Penilaian (Skor Hubungan)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <EmptyState
                title="Belum ada riwayat penilaian"
                description="Skor hubungan untuk person ini akan muncul di sini."
              />
            ) : (
              <ul className="space-y-3">
                {history.map((r) => (
                  <li key={r.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {r.ratingDate}
                      </span>
                      <Badge variant={riskVariant[r.riskLevel]}>
                        {riskLabel[r.riskLevel]}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{r.relationshipScore} / 5</span>
                    </div>
                    {r.notes && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {r.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 flex items-center gap-1 text-sm font-medium">
        {icon}
        {value}
      </p>
    </div>
  );
}
