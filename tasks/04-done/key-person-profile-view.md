# Key person profile view

**Status:** Done
**Raised by:** Mas Fari (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §5

## Problem

Client wants a dedicated **per-person profile view** for each key person (e.g. Pak Hendran): personal data, profiling (hobi, karakter — free text filled by sales), and historical penilaian. This view "pernah ada, kehapus karena satu dan lain hal" — needs restore. Today contacts only live nested under a customer; there's no person-centric page.

Also clarifies a scoring split: **skor hubungan** lives on person; **skor pembayaran** lives on company. The profiling/subjective side belongs here, not on `CustomerRating`.

## Scope

- [x] New page `web/src/pages/contacts/contact-profile.tsx` — route `/contacts/:id`.
- [x] Sections: data pribadi (name, position, WhatsApp, email, gender, birth place/date, religion, education, address, family), profiling (free-text — sales-authored), daftar perusahaan terkait (many-to-many via `contactService.search`), historis penilaian (relationship scores over time, filtered by `contactId`).
- [x] Reachable from customer detail (Kontak tab card click) and customer-list Key Person view (name link).
- [x] Added `profiling?: string` plus structured personal/family fields to `Contact` in [packages/api-types/src/contact.ts](../../packages/api-types/src/contact.ts).
- [x] Edit form `web/src/pages/contacts/contact-form.tsx` — route `/contacts/:id/edit`, wired to `useUpdateContact`.

## Notes

Profiling fields stay manual free-text — the sales person describes the person. No structured taxonomy needed; that would just block input. Match the meeting's "semua manual karena yang dideskripsikan sales".
