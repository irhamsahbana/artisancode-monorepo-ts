# Quotation ↔ Project sync

**Status:** Backlog
**Raised by:** Mas Fari (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §1–3

## Problem

Quotations are currently flat and disconnected from projects. Client wants **proyek = base data induk**. The quotation must link to a real project record and surface that project's name + status, so sales can see "penawaran sudah dikirim, status proyek masih prospek → follow up lagi".

Also: topic on the quotation form should not be a free dropdown — it needs a dedicated "Penawaran" button path, with topic still typeable manually (RFQ, permintaan penawaran, etc). `productName` must be fixed from master (not free text) so search/filter categories stay consistent.

## Scope

- [ ] Add `projectId?: string` + `topic?: string` to `QuotationRequest` in [packages/api-types/src/quotation.ts](../../packages/api-types/src/quotation.ts).
- [ ] Quotation form: topic field = two-mode (select existing topic OR type new). When topic = "permintaan penawaran", surface a "Buat Penawaran" button that routes into the quotation monitoring flow.
- [ ] Quotation form: link to project via dropdown sourced from `mockProjects` (dedup-aware — see client case "Apartemen Tanjung Bunga" vs "Pembangunan Apartemen Makassar").
- [ ] `productName` on quotation lines: change from free string to select from `mockProducts` (master), no free typing.
- [ ] Quotation list/detail: show **Nama Proyek** + **Status Proyek** columns, derived from the linked `Project` (synced, not stored). Rename existing `status` column to avoid collision with project status — see [quotation-status-rename.md](quotation-status-rename.md).
- [ ] Internal sales can also fill the quotation form (not only external/public submit).

## Notes

- Penawaran = inisialisasi awal only. Manajemen lanjutan lives di proyek. Quotation just links.
- Dedup case is real — multiple customer spellings for the same internal project. Demo: dropdown over existing projects is enough; proper fuzzy match = backend stage.

## Depends on

- [quotation-status-rename.md](quotation-status-rename.md)
