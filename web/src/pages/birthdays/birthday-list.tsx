import { Gift, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContactSearch } from "@/hooks/use-contacts";

// ponytail: Template is local state for demo purposes.
const DEFAULT_TEMPLATE =
  "Selamat Ulang Tahun {{Nama}}! 🎉\n\nSemoga selalu diberikan kesehatan, kebahagiaan, dan kesuksesan. Terima kasih atas kepercayaan Anda bersama CRM Wika.";

interface UpcomingBirthday {
  contactId: string;
  contactName: string;
  customerName: string;
  position: string;
  dateOfBirth: string;
  nextBirthday: Date;
  daysUntil: number;
}

export function BirthdayList() {
  const { data: contactsData } = useContactSearch("");
  const [template] = useState(DEFAULT_TEMPLATE);

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
      render: (u) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/contacts/${u.contactId}`}
            className="font-medium hover:underline"
          >
            {u.contactName}
          </Link>
          <span className="text-xs text-muted-foreground">{u.position}</span>
        </div>
      ),
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
      label: "Status",
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
              <p className="text-xs text-muted-foreground mt-0.5">
                Dikirim otomatis via WhatsApp pada hari ulang tahun.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Mock: Edit dialog goes here")}
          >
            <Pencil className="mr-1 h-4 w-4" />
            Edit Template
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
            {template}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Gunakan <b>{`{{Nama}}`}</b> untuk menyebutkan nama Key Person secara
            dinamis.
          </p>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-base font-semibold">
        Daftar Ulang Tahun Mendatang
      </h2>
      <DataTable data={upcomingList} columns={columns} />
    </div>
  );
}
