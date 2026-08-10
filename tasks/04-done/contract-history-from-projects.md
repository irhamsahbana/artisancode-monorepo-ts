# Contract history = won projects per company

**Status:** Done
**Raised by:** Mas Fari (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §6

## Problem

Today "Riwayat Kontrak" is a manual flag/revenue/year on the customer. Client reframes it: **riwayat kontrak = riwayat proyek yang berhasil** (status `won`) atas nama perusahaan + PIC. Project becomes the base data that feeds contract history — name, omset value, against which customer/company. Historical penilaian also hangs off this.

## Scope

- [x] Reframe the customer-detail "Riwayat Kontrak" tab to list `Project` rows where `customerId === customer.id && status === 'won'` — sourced from `mockProjects`, not the current manual fields.
- [x] Show: nama proyek, nilai omset (`estimatedValue`), tahun (from `createdAt`), PIC.
- [x] Removed the manual `hasContractHistory` / `lastRevenue` / `lastContractYear` fields entirely (from `Customer`/`CreateCustomerReq`/`UpdateCustomerReq`/`GetCustomerReq` in api-types, mock data, and customer service). Riwayat kontrak is now fully derived from won projects.

## Notes

Tightly coupled with [customer-rating-formula.md](customer-rating-formula.md) — penilaian also keys off `won` projects. Land them together so the "won project" surface is consistent across tabs.

## Implementation notes

- `useProjects({ customerId, status: 'won' })` already supported the filter — no service changes needed for the query itself.
- Two other places depended on `hasContractHistory` and were migrated to the same "has ≥1 won project" derivation:
  - `web/src/pages/ratings/rating-list.tsx` — rating eligibility now checks `useProjects({ status: 'won' })` customerIds instead of the boolean flag.
  - `web/src/services/dashboard.ts` — `withContractHistory` dashboard metric now counts distinct customers with a won project (`mockProjects`), instead of the removed boolean.
- `contactName(p.contactId)` on the new tab resolves against `useContacts(customer.id)` (already loaded for the Kontak tab) — no extra query.
- Backend (`api/`) intentionally left untouched — this is a DEMO_MODE-only FE app; API/DB schema still has the legacy columns but nothing in `api/src` reads `@artisancode/api-types`, so no build break there.
