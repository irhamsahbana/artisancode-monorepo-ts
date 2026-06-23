import { ArrowLeft, Pencil, Phone, Mail, Star } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoryList } from "@/hooks/use-categories";
import { useContacts } from "@/hooks/use-contacts";
import { useCustomer } from "@/hooks/use-customers";

const statusLabel: Record<string, string> = {
  active: "Aktif",
  prospect: "Prospek",
  inactive: "Tidak Aktif",
};
const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  prospect: "secondary",
  inactive: "outline",
};
const potentialLabel: Record<string, string> = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

const TABS = ["Info Umum", "Kontak", "Riwayat Kontrak"] as const;
type Tab = (typeof TABS)[number];

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Info Umum");

  const { data: customer, isLoading } = useCustomer(id ?? "");
  const { data: contactsData } = useContacts(id ?? "");
  const { data: segmentationsData } = useCategoryList("segmentation");

  const segmentations = segmentationsData?.items ?? [];

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Memuat...</p>;
  if (!customer)
    return (
      <p className="text-sm text-muted-foreground">
        Pelanggan tidak ditemukan.
      </p>
    );

  const customerContacts = contactsData?.items ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{customer.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={statusVariant[customer.status]}>
              {statusLabel[customer.status]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Potensi: {potentialLabel[customer.potential]}
            </span>
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/customers/${id}/edit`}>
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="flex gap-1 border-b mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Info Umum" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Umum</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info
                label="Jenis"
                value={
                  customer.type === "business" ? "Badan Usaha" : "Perorangan"
                }
              />
              <Info
                label="Segmentasi"
                value={
                  segmentations.find((s) => s.id === customer.segmentationId)
                    ?.name ?? "-"
                }
              />
              <Info label="WhatsApp" value={customer.whatsapp ?? "-"} />
              <Info label="Email" value={customer.email ?? "-"} />
              <Info label="Tanggal Daftar" value={customer.createdAt} />
              {customer.hasContractHistory && (
                <>
                  <Info
                    label="Pendapatan Terakhir"
                    value={
                      customer.lastRevenue
                        ? `Rp ${Number(customer.lastRevenue).toLocaleString("id-ID")}`
                        : "-"
                    }
                  />
                  <Info
                    label="Tahun Kontrak Terakhir"
                    value={customer.lastContractYear?.toString() ?? "-"}
                  />
                </>
              )}
              {customer.notes && (
                <div className="sm:col-span-2">
                  <Info label="Catatan" value={customer.notes} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Info Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info
                label="Jenis Kelamin"
                value={
                  customer.gender === "male"
                    ? "Laki-laki"
                    : customer.gender === "female"
                      ? "Perempuan"
                      : "-"
                }
              />
              <Info label="Tempat Lahir" value={customer.birthPlace ?? "-"} />
              <Info label="Tanggal Lahir" value={customer.dateOfBirth ?? "-"} />
              <Info label="Agama" value={customer.religion ?? "-"} />
              <Info label="Pendidikan" value={customer.education ?? "-"} />
              {customer.address && (
                <div className="sm:col-span-2">
                  <Info label="Alamat" value={customer.address} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Karakter & Hobi</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info label="Karakter" value={customer.character ?? "-"} />
              <Info label="Hobi" value={customer.hobby ?? "-"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Info Keluarga</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info
                label="Nama Suami/Istri"
                value={customer.spouseName ?? "-"}
              />
              <Info
                label="Pekerjaan Suami/Istri"
                value={customer.spouseOccupation ?? "-"}
              />
              <Info label="Nama Anak" value={customer.childrenNames ?? "-"} />
              <Info
                label="Pekerjaan Anak"
                value={customer.childrenOccupation ?? "-"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Info Perusahaan</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info
                label="Nama Perusahaan"
                value={customer.companyName ?? "-"}
              />
              <Info label="Jabatan" value={customer.position ?? "-"} />
              {customer.companyAddress && (
                <div className="sm:col-span-2">
                  <Info
                    label="Alamat Perusahaan"
                    value={customer.companyAddress}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "Kontak" && (
        <div className="space-y-3">
          {customerContacts.length === 0 ? (
            <EmptyState
              title="Belum ada kontak"
              description="Tambahkan kontak untuk pelanggan ini."
            />
          ) : (
            customerContacts.map((con) => (
              <Card key={con.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {con.name}
                    {con.isPrimary && (
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    )}
                  </CardTitle>
                  {con.position && (
                    <p className="text-sm text-muted-foreground">
                      {con.position}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {con.whatsapp && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {con.whatsapp}
                    </span>
                  )}
                  {con.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {con.email}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "Riwayat Kontrak" && (
        <EmptyState
          title="Belum ada riwayat kontrak"
          description="Riwayat kontrak akan muncul di sini."
        />
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
