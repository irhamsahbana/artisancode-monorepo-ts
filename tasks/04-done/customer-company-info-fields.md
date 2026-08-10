# Customer (company) info — field expansion

**Status:** Done
**Raised by:** Mas Fari (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §7

## Problem

Company general-info form is missing fields client needs. Current `Customer` ([packages/api-types/src/customer.ts](../../packages/api-types/src/customer.ts)) has no NPWP/SKT/address/website, and segmentasi is too generic. WhatsApp/email correctly sit on person (Contact), but company-level data needs its own slots.

## Scope

- [x] Added to `Customer`: `address?`, `npwp?`, `skt?`, `companyEmail?`, `website?`.
- [x] Segmentasi: added dedicated `companyType` enum (`bumn` / `swasta_nasional` / `swasta_asing`), kept existing segmentation master separate to avoid overlap.
- [x] Updated [web/src/pages/customers/customer-form.tsx](../../web/src/pages/customers/customer-form.tsx) + detail view with the new fields, grouped under an "Info Umum Perusahaan" section. Also removed personal fields (gender, birth date, family, hobby/character) that were incorrectly on `Customer` — moved to `Contact` (see key-person-profile-view.md).
- [x] Updated mock customers (all 10) to populate the new fields.

## Notes

Client said form detailing (tambah-kurang isian) will be corrected together with the team later — treat this task as the first pass, expect a follow-up tweak task once they review the actual form.
