# Customer (company) info — field expansion

**Status:** Backlog
**Raised by:** Mas Fari (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §7

## Problem

Company general-info form is missing fields client needs. Current `Customer` ([packages/api-types/src/customer.ts](../../packages/api-types/src/customer.ts)) has no NPWP/SKT/address/website, and segmentasi is too generic. WhatsApp/email correctly sit on person (Contact), but company-level data needs its own slots.

## Scope

- [ ] Add to `Customer`: `address?`, `npwp?`, `skt?`, `companyEmail?`, `website?`.
- [ ] Segmentasi: support values `BUMN` / `swasta_nasional` / `swasta_asing` (client's taxonomy) — either extend the existing segmentation master or add a dedicated `companyType` enum. Pick one to avoid two overlapping fields.
- [ ] Update [web/src/pages/customers/customer-form.tsx](../../web/src/pages/customers/customer-form.tsx) + detail view with the new fields, grouped under an "Info Umum Perusahaan" section.
- [ ] Update mock customers to populate the new fields so the demo form isn't empty.

## Notes

Client said form detailing (tambah-kurang isian) will be corrected together with the team later — treat this task as the first pass, expect a follow-up tweak task once they review the actual form.
