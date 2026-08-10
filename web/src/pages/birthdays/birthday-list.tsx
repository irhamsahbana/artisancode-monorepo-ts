import { Clock, Gift, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useContactSearch } from "@/hooks/use-contacts";

// ponytail: Template is local state for demo purposes.
const DEFAULT_TEMPLATE =
  "Selamat Ulang Tahun {{Sapaan}} {{Nama}}! 🎉\n\nSemoga selalu diberikan kesehatan, kebahagiaan, dan kesuksesan. Terima kasih atas kepercayaan Anda bersama CRM Wika.";

interface UpcomingBirthday {
  contactId: string;
  contactName: string;
  gender?: "male" | "female";
  customerName: string;
  position: string;
  dateOfBirth: string;
  nextBirthday: Date;
  daysUntil: number;
}

export function BirthdayList() {
  const { data: contactsData } = useContactSearch("");
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [sendTime, setSendTime] = useState("09:00");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState(template);
  const [editTime, setEditTime] = useState(sendTime);

  // Real-time ticking just for status recalculation
  const [currentTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });

  function handleOpenDialog() {
    setEditTemplate(template);
    setEditTime(sendTime);
    setIsDialogOpen(true);
  }

  function handleSave() {
    setTemplate(editTemplate);
    setSendTime(editTime);
    setIsDialogOpen(false);
    toast.success("Pengaturan automasi berhasil disimpan.");
  }

  const upcomingList = useMemo(() => {
    const items: UpcomingBirthday[] = [];
    const now = new Date();
    // Normalize to midnight for accurate day difference
    now.setHours(0, 0, 0, 0);

    for (const { contact, customer } of contactsData ?? []) {
      if (!contact.dateOfBirth) continue;

      const dob = new Date(contact.dateOfBirth);
      const nextBirthday = new Date(
        now.getFullYear(),
        dob.getMonth(),
        dob.getDate(),
      );

      // If it already passed this year, next birthday is next year
      if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
      }

      const diffTime = nextBirthday.getTime() - now.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      items.push({
        contactId: contact.id,
        contactName: contact.name,
        gender: contact.gender,
        customerName: customer.name,
        position: contact.position ?? "-",
        dateOfBirth: contact.dateOfBirth,
        nextBirthday,
        daysUntil,
      });
    }

    return items.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [contactsData]);

  const columns: Column<UpcomingBirthday>[] = [
    {
      key: "contact",
      label: "Key Person",
      render: (u) => {
        const sapaan = u.gender === "female" ? "Ibu" : "Bapak";
        return (
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/contacts/${u.contactId}`}
              className="font-medium hover:underline"
            >
              {sapaan} {u.contactName}
            </Link>
            <span className="text-xs text-muted-foreground">{u.position}</span>
          </div>
        );
      },
    },
    {
      key: "company",
      label: "Pelanggan",
      render: (u) => <span className="text-sm">{u.customerName}</span>,
    },
    {
      key: "date",
      label: "Tanggal Lahir",
      render: (u) => (
        <span className="text-sm">
          {new Date(u.dateOfBirth).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "countdown",
      label: "Jadwal",
      render: (u) => {
        if (u.daysUntil === 0) {
          return <Badge variant="default">Hari ini</Badge>;
        }
        if (u.daysUntil === 1) {
          return <Badge variant="secondary">Besok</Badge>;
        }
        return (
          <span className="text-sm text-muted-foreground">
            {u.daysUntil} hari lagi
          </span>
        );
      },
    },
    {
      key: "status_kirim",
      label: "Status Pengiriman",
      render: (u) => {
        if (u.daysUntil === 0) {
          if (currentTime >= sendTime) {
            return (
              <Badge
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                Terkirim ({sendTime})
              </Badge>
            );
          }
          return <Badge variant="outline">Menunggu {sendTime}</Badge>;
        }
        return (
          <span className="text-sm text-muted-foreground">Belum waktunya</span>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Ulang Tahun Key Person"
        description="Daftar ulang tahun dan automasi pengiriman ucapan selamat."
      />

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">
                Template Automasi Ucapan
              </CardTitle>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                Dikirim otomatis via WhatsApp setiap hari pukul
                <Badge
                  variant="secondary"
                  className="px-1.5 py-0 h-5 font-medium flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  {sendTime}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleOpenDialog}>
            <Pencil className="mr-1 h-4 w-4" />
            Pengaturan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
            {template}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Gunakan <b>{`{{Sapaan}}`}</b> untuk otomatis menjadi Bapak/Ibu
            (berdasarkan gender Key Person), dan <b>{`{{Nama}}`}</b> untuk nama.
          </p>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-base font-semibold">
        Daftar Ulang Tahun Mendatang
      </h2>
      <DataTable data={upcomingList} columns={columns} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pengaturan Automasi Ulang Tahun</DialogTitle>
            <DialogDescription>
              Ubah jam pengiriman dan isi pesan template yang akan dikirim.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Waktu Pengiriman</Label>
              <Input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Pesan Template</Label>
              <Textarea
                rows={5}
                value={editTemplate}
                onChange={(e) => setEditTemplate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Gunakan <b>{`{{Sapaan}}`}</b> untuk Bapak/Ibu berdasarkan
                gender, dan <b>{`{{Nama}}`}</b> untuk nama.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>Simpan Pengaturan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
