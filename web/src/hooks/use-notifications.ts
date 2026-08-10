import { useMemo } from "react";

import { mockHolidays } from "@/data/holidays";

import { useContactSearch } from "./use-contacts";
import { useProjectFollowUps } from "./use-dashboard";
import { useQuotations } from "./use-quotations";

export interface AppNotification {
  id: string;
  type: "quotation" | "project" | "birthday" | "holiday";
  title: string;
  description: string;
  href: string;
}

export function useNotifications() {
  const { data: quotationsData } = useQuotations();
  const { data: followUpsData } = useProjectFollowUps();
  // Empty search returns all contacts
  const { data: contactsData } = useContactSearch("");

  const notifications = useMemo(() => {
    const items: AppNotification[] = [];

    // 1. Permintaan Penawaran Baru
    const newQuotations = (quotationsData?.items ?? []).filter(
      (q) => q.status === "new",
    );
    for (const q of newQuotations) {
      items.push({
        id: `q-${q.id}`,
        type: "quotation",
        title: "Penawaran Baru",
        description: `Permintaan dari ${q.requesterName} belum direspon.`,
        href: `/quotations?status=new`,
      });
    }

    // 2. Proyek Perlu Follow-up (Top 3 stale only to minimize noise)
    const followUps = (followUpsData ?? []).slice(0, 3);
    for (const f of followUps) {
      const desc =
        f.daysSinceLastVisit === null
          ? "Belum pernah dikunjungi."
          : `Sudah ${f.daysSinceLastVisit} hari sejak kunjungan terakhir.`;
      items.push({
        id: `p-${f.project.id}`,
        type: "project",
        title: `Follow-up: ${f.project.name}`,
        description: desc,
        href: `/projects/${f.project.id}`,
      });
    }

    // 3. Ulang Tahun Pelanggan (Hari ini & Besok)
    const now = new Date();
    const mmddToday = now.toISOString().slice(5, 10);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const mmddTomorrow = tomorrow.toISOString().slice(5, 10);

    const contacts = contactsData ?? [];
    for (const c of contacts) {
      if (!c.contact.dateOfBirth) continue;
      const mmddDob = c.contact.dateOfBirth.slice(5, 10);

      if (mmddDob === mmddToday) {
        items.push({
          id: `bd-${c.contact.id}-today`,
          type: "birthday",
          title: "Ulang Tahun Hari Ini",
          description: `${c.contact.name} (${c.customer.name}) berulang tahun hari ini.`,
          href: `/contacts/${c.contact.id}`,
        });
      } else if (mmddDob === mmddTomorrow) {
        items.push({
          id: `bd-${c.contact.id}-tmrw`,
          type: "birthday",
          title: "Ulang Tahun Besok",
          description: `${c.contact.name} (${c.customer.name}) berulang tahun besok.`,
          href: `/contacts/${c.contact.id}`,
        });
      }
    }

    // 4. Hari Raya / Nasional
    const ymdToday = now.toISOString().slice(0, 10);
    const ymdTomorrow = tomorrow.toISOString().slice(0, 10);

    for (const h of mockHolidays) {
      if (h.date === ymdToday) {
        items.push({
          id: `h-${h.date}`,
          type: "holiday",
          title: "Hari Libur / Nasional",
          description: `Hari ini adalah ${h.name}.`,
          href: `/broadcasts/new`, // Suggest broadcast
        });
      } else if (h.date === ymdTomorrow) {
        items.push({
          id: `h-${h.date}`,
          type: "holiday",
          title: "Hari Libur / Nasional Besok",
          description: `Besok adalah ${h.name}. Siapkan broadcast ucapan?`,
          href: `/broadcasts/new`,
        });
      }
    }

    return items;
  }, [quotationsData, followUpsData, contactsData]);

  return { data: notifications };
}
