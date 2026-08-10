# Key person profile view

**Status:** Backlog
**Raised by:** Mas Fari (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §5

## Problem

Client wants a dedicated **per-person profile view** for each key person (e.g. Pak Hendran): personal data, profiling (hobi, karakter — free text filled by sales), and historical penilaian. This view "pernah ada, kehapus karena satu dan lain hal" — needs restore. Today contacts only live nested under a customer; there's no person-centric page.

Also clarifies a scoring split: **skor hubungan** lives on person; **skor pembayaran** lives on company. The profiling/subjective side belongs here, not on `CustomerRating`.

## Scope

- [ ] New page `web/src/pages/contacts/contact-profile.tsx` (or `key-person-profile.tsx`) — route `/contacts/:id`.
- [ ] Sections: data pribadi (name, position, WhatsApp, email), profiling (free-text hobi/karakter — sales-authored), daftar perusahaan terkait (many-to-many, see demo-ui-only-plan Fase 1), historis penilaian (relationship scores over time).
- [ ] Make contacts reachable from more places than just customer detail — search-by-person result should land here.
- [ ] Add `profiling?: string` (or structured fields) to `Contact` in [packages/api-types/src/contact.ts](../../packages/api-types/src/contact.ts).

## Notes

Profiling fields stay manual free-text — the sales person describes the person. No structured taxonomy needed; that would just block input. Match the meeting's "semua manual karena yang dideskripsikan sales".
