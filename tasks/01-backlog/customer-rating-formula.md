# Customer rating — formula-driven stars

**Status:** Backlog (blocked on Mas Sul's scoring spec)
**Raised by:** Mas Fari + Mas Sul (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §4

## Problem

Current rating (`CustomerRating` in [packages/api-types/src/rating.ts](../../packages/api-types/src/rating.ts)) is manual numeric scores per customer with no derived star output and no link to a project. Client wants:

1. **Bintang otomatis** from a scoring formula — not manual star clicks.
2. Penilaian is **per project + perusahaan** (not per pertemuan/follow-up — that stays in the visit log). Skor pembayaran = level **perusahaan**, not person.
3. Penilaian only appears **after the project status = `won`** and field work is done. If project not won → no rating.
4. Key person evaluation = karakter/profiling (subjective, manual text), separate from numeric skor.

## Indicators from Mas Sul (tolak ukur)

- **Cara bayar**: tagihan masuk maks 3 hari, klien bayar 7 hari → kurangi nilai.
- **Kemudahan transaksi**: harga ditawarkan langsung diterima tanpa nego → "sangat baik".
- Output kategori: `istimewa` (bintang 5) / `baik` (bintang 4) + keterangan.

## Scope (pending spec)

- [ ] Wait for Mas Sul to send the standard rumusan + kategori list.
- [ ] Add `projectId: string` to `CustomerRating`. Move `paymentScore` semantics to company level.
- [ ] Gate the rating form/UI on `project.status === 'won'`.
- [ ] Derive star rating (1–5) + kategori label from the formula, display-only. Remove manual star input.
- [ ] Split person-level "profiling" (subjective text) out of `CustomerRating` — see [key-person-profile-view.md](key-person-profile-view.md).

## Notes

Demo fallback if spec doesn't arrive in time: keep current manual scores, add a `projectId` link + the `won`-gate, label it "penilaian sementara (manual)", and surface a TODO comment where the formula plugs in. Don't block the demo on the formula.
