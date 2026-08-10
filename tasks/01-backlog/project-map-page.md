# Project map page

**Status:** Backlog
**Raised by:** Mas Fari (meeting 2026-08-09) — see [meeting-summary-2026-08-09.md](../../prd/meeting-summary-2026-08-09.md) §9

## Problem

Client wants a dedicated **"Peta Proyek"** menu (not on the dashboard — concern about weight). Plots every project with a tagged location as a point. Click a point → popup with project data (name, status, etc). Point color reflects project status (proses / berhasil=hijau / etc). Uses the existing OpenStreetMap setup.

## Scope

- [ ] New page `web/src/pages/projects/project-map.tsx`, route `/projects/map`, nav entry under the projects section.
- [ ] Render all `mockProjects` that have `latitude`/`longitude` as markers via the existing leaflet/react-leaflet setup.
- [ ] Color markers by `ProjectStatus` (e.g. `won` = green, `in_progress` = blue, `prospect` = amber, `lost` = grey).
- [ ] Click marker → popup/popup-card with project name + status + link to detail.
- [ ] Make sure mock projects have realistic lat/lng (Makassar area) so the map isn't empty.

## Notes

`Project.latitude` / `longitude` already exist in [packages/api-types/src/project.ts](../../packages/api-types/src/project.ts). Check whether the map lib is already installed from the customer-location-map work (recent commits mention Google Maps links + radius circle) — reuse, don't re-add.

Hover/cursor tooltip is the fallback if click-popup proves fiddly — client explicitly accepted hover as good enough.
