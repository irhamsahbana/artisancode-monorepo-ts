import type { BroadcastLog, BroadcastTemplate } from "@artisancode/api-types";

// ponytail: static demo broadcast templates.
export const mockBroadcastTemplates: BroadcastTemplate[] = [
  {
    id: "b1",
    name: "Ucapan Idul Fitri 1446 H",
    message:
      "Taqabbalallahu minna wa minkum. Selamat Hari Raya Idul Fitri 1446 H. Mohon maaf lahir dan batin. Semoga kita tetap sehat dan sukses bersama.",
    occasion: "idul_fitri",
    audienceReligion: "Islam",
    status: "draft",
    createdAt: "2026-06-15T09:00:00.000Z",
  },
  {
    id: "b2",
    name: "Promo Natal",
    message:
      "Selamat Natal! Dapatkan promo khusus untuk pemesanan ready mix. Hubungi kami untuk detail.",
    occasion: "christmas",
    audienceReligion: "Kristen",
    audienceCustomerStatus: "active",
    status: "scheduled",
    scheduledAt: "2026-12-24T09:00:00.000Z",
    createdAt: "2026-06-10T14:30:00.000Z",
  },
  {
    id: "b3",
    name: "Hari Kemerdekaan RI",
    message:
      "Dirgahayu RI! 🇮🇩 Mari bangun negeri dengan beton berkualitas. Dukung proyek infrastruktur Indonesia dengan produk precast terbaik.",
    occasion: "national_day",
    status: "sent",
    sentAt: "2026-08-17T08:00:00.000Z",
    createdAt: "2026-06-05T11:00:00.000Z",
  },
];

export const mockBroadcastLogs: BroadcastLog[] = [
  {
    id: "l1",
    templateId: "b1",
    sentAt: "2026-07-19T10:30:00.000Z",
    recipientCount: 0,
    status: "pending",
  },
  {
    id: "l2",
    templateId: "b3",
    sentAt: "2026-08-17T08:00:00.000Z",
    recipientCount: 5,
    status: "sent",
    recipientLogs: [
      {
        contactId: "c1",
        contactName: "Ahmad Suhendra",
        status: "sent",
        sentAt: "2026-08-17T08:01:00.000Z",
      },
      {
        contactId: "c2",
        contactName: "Budi Hartanto",
        status: "sent",
        sentAt: "2026-08-17T08:01:15.000Z",
      },
      {
        contactId: "c3",
        contactName: "Chandra Wijaya",
        status: "failed",
        errorMessage: "WhatsApp number not connected",
      },
      {
        contactId: "c4",
        contactName: "Dedy Kurniawan",
        status: "sent",
        sentAt: "2026-08-17T08:02:00.000Z",
      },
      {
        contactId: "c5",
        contactName: "Eko Prasetyo",
        status: "sent",
        sentAt: "2026-08-17T08:02:30.000Z",
      },
    ],
  },
];
