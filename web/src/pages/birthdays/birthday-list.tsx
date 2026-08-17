import { Clock, Gift, MessageSquarePlus } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBroadcastLogs, useBroadcasts } from "@/hooks/use-broadcasts";
import { useClientTable } from "@/hooks/use-client-table";
import { useContactSearch } from "@/hooks/use-contacts";

// Fixed daily fire time for the cronbake scheduler (jobs/scheduler.ts) — not
// per-template, so it's informational text here, not an editable setting.
const BIRTHDAY_SEND_TIME = "08:00 WIB";

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
  const navigate = useNavigate();
  const { data: contactsData } = useContactSearch("");
  const { data: broadcastsData } = useBroadcasts();

  const birthdayTemplate = broadcastsData?.items.find(
    (b) => b.occasion === "birthday",
  );
  const { data: templateLogs } = useBroadcastLogs(birthdayTemplate?.id);

  // The scheduler fires once daily — find the log from today's run, if any.
  const todayLog = useMemo(() => {
    const todayKey = new Date().toDateString();
    return (templateLogs ?? [])
      .filter((l) => new Date(l.sentAt).toDateString() === todayKey)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];
  }, [templateLogs]);

  const todayStatusByContact = useMemo(() => {
    const map = new Map<string, "sent" | "failed" | "pending">();
    for (const r of todayLog?.recipientLogs ?? []) {
      map.set(r.contactId, r.status);
    }
    return map;
  }, [todayLog]);

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

  const table = useClientTable(upcomingList);

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
        if (u.daysUntil !== 0) {
          return (
            <span className="text-sm text-muted-foreground">
              Belum waktunya
            </span>
          );
        }
        if (!birthdayTemplate) {
          return <Badge variant="outline">Tidak ada template aktif</Badge>;
        }
        const status = todayStatusByContact.get(u.contactId);
        if (status === "sent") {
          return (
            <Badge className="bg-green-600 text-white hover:bg-green-700">
              Terkirim
            </Badge>
          );
        }
        if (status === "failed") {
          return <Badge variant="destructive">Gagal</Badge>;
        }
        if (todayLog) {
          // Job already ran today but this contact didn't match the
          // template's audience filters (gender/religion/segmentasi/status).
          return <Badge variant="outline">Di luar target template</Badge>;
        }
        return <Badge variant="outline">Menunggu {BIRTHDAY_SEND_TIME}</Badge>;
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
              {birthdayTemplate ? (
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  Dikirim otomatis via WhatsApp setiap hari pukul
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 h-5 font-medium flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {BIRTHDAY_SEND_TIME}
                  </Badge>
                </div>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  Belum ada template aktif — ucapan ulang tahun tidak akan
                  terkirim otomatis.
                </p>
              )}
            </div>
          </div>
          {birthdayTemplate ? (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/broadcasts/${birthdayTemplate.id}`}>
                Lihat Template
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("/broadcasts/new?occasion=birthday")}
            >
              <MessageSquarePlus className="mr-1 h-4 w-4" />
              Buat Template
            </Button>
          )}
        </CardHeader>
        {birthdayTemplate && (
          <CardContent>
            <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
              {birthdayTemplate.message}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Gunakan <b>{`{{nama}}`}</b> di pesan untuk otomatis diganti nama
              tiap penerima.
            </p>
          </CardContent>
        )}
      </Card>

      <h2 className="mb-4 text-base font-semibold">
        Daftar Ulang Tahun Mendatang
      </h2>
      <DataTable
        data={table.data}
        loadedData={table.loadedData}
        columns={columns}
        page={table.page}
        totalPages={table.totalPages}
        totalCount={table.totalCount}
        onPageChange={table.onPageChange}
        hasMore={table.hasMore}
        onLoadMore={table.onLoadMore}
      />
    </div>
  );
}
