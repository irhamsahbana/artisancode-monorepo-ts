# Notification bell in header

**Status:** Done
**Raised by:** Mas Amir + Mas Fari (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §8

## Problem

Reminders/notifications today are a dashboard concern. Client wants a **lonceng (bell) in the header** that consolidates all "what should I do today" signals — not just on the dashboard. Dashboard stays for progress/overview; the bell is the action prompt.

Notifications to surface:
- Permintaan penawaran belum direspons
- Proyek perlu follow-up
- Ulang tahun pelanggan (today/tomorrow)
- Hari raya / hari nasional

## Scope

- [x] Add a bell icon + dropdown popover in [web/src/components/layout/desktop/header.tsx](../../web/src/components/layout/desktop/header.tsx) (and mobile header).
- [x] Reuse `DashboardReminder` + add a "pending action" feed (quotations `new`, projects stale in `prospect`/`in_progress`).
- [x] Unread indicator badge; clicking an item navigates to the relevant record.
- [x] Keep volume minimal — client explicitly said "notif untuk seminimalisir mungkin", don't spam every event.

## Notes

Reuse existing reminder data source. This is a presentation/placement change (dashboard → header bell), not a new data model. Ponytail: don't build a real-time push system for the demo — derive from existing mock queries.
