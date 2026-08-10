# Rename quotation status labels

**Status:** Backlog
**Raised by:** Mas Fari (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §2

## Problem

Quotation status today: `new` / `in_review` / `responded`. Once quotations also surface **project status** (see [quotation-project-sync.md](quotation-project-sync.md)), there will be two "status" columns and the meaning collides. Client wants clearer labels:

- `dalam tinjauan` = penawaran lagi dibuat (internal sedang menyusun)
- `sudah dikirim` = penawaran sudah dikirim ke klien, baru menunggu respon

## Scope

- [ ] Decide enum change vs label-only change. Minimal: keep enum values, swap the Bahasa Indonesia display labels in [web/src/pages/quotations/](../../web/src/pages/quotations/) to `Baru masuk` / `Dalam tinjauan` / `Sudah dikirim penawaran`.
- [ ] Add a column header note or rename column from "Status" → "Status Penawaran" so it doesn't collide with "Status Proyek".

## Notes

Ponytail: label-only swap first. Enum rename touches api-types + mock + services — defer unless label collision actually confuses users in the demo.
