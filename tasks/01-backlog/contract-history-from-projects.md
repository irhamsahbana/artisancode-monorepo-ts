# Contract history = won projects per company

**Status:** Backlog
**Raised by:** Mas Fari (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §6

## Problem

Today "Riwayat Kontrak" is a manual flag/revenue/year on the customer. Client reframes it: **riwayat kontrak = riwayat proyek yang berhasil** (status `won`) atas nama perusahaan + PIC. Project becomes the base data that feeds contract history — name, omset value, against which customer/company. Historical penilaian also hangs off this.

## Scope

- [ ] Reframe the customer-detail "Riwayat Kontrak" tab to list `Project` rows where `customerId === customer.id && status === 'won'` — sourced from `mockProjects`, not the current manual fields.
- [ ] Show: nama proyek, nilai omset (`estimatedValue`), tahun (from `createdAt` or a dedicated `contractYear`), PIC.
- [ ] Keep the existing manual `hasContractHistory` / `lastRevenue` / `lastYear` fields as a fallback/legacy or remove them once the derived view is stable. Decide one; don't leave both half-wired.

## Notes

Tightly coupled with [customer-rating-formula.md](customer-rating-formula.md) — penilaian also keys off `won` projects. Land them together so the "won project" surface is consistent across tabs.
