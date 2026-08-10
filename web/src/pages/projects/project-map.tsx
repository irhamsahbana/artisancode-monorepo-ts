import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useNavigate } from "react-router";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/use-projects";

import {
  formatRupiah,
  projectStatusLabel,
  projectStatusVariant,
} from "./project-status";

import type { Project, ProjectStatus } from "@artisancode/api-types";

const INDONESIA_CENTER: [number, number] = [-2.5, 118];

const statusColor: Record<ProjectStatus, string> = {
  prospect: "#f59e0b",
  in_progress: "#3b82f6",
  won: "#22c55e",
  lost: "#6b7280",
};

// ponytail: colored dot per status, replaces default blue pin so the leaf
// markers still read at a glance once a cluster (province/city level)
// breaks apart into individual points.
function statusIcon(status: ProjectStatus) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${statusColor[status]};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,.25)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export function ProjectMap() {
  const navigate = useNavigate();
  const { data } = useProjects();
  const points = (data?.items ?? []).filter(
    (p): p is Project & { latitude: number; longitude: number } =>
      p.latitude != null && p.longitude != null,
  );

  return (
    <div>
      <PageHeader
        title="Peta Proyek"
        description="Sebaran lokasi proyek yang sudah ditandai di peta."
      />
      <div className="h-[calc(100vh-13rem)] overflow-hidden rounded-md border">
        <MapContainer
          center={INDONESIA_CENTER}
          zoom={5}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup chunkedLoading>
            {points.map((p) => (
              <Marker
                key={p.id}
                position={[p.latitude, p.longitude]}
                icon={statusIcon(p.status)}
              >
                <Popup>
                  <div className="grid gap-1 text-sm">
                    <p className="font-medium">{p.name}</p>
                    <Badge
                      variant={projectStatusVariant[p.status]}
                      className="w-fit"
                    >
                      {projectStatusLabel[p.status]}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {p.location ?? "-"} &middot;{" "}
                      {formatRupiah(p.estimatedValue)}
                    </p>
                    <button
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="text-left text-xs font-medium text-primary hover:underline"
                    >
                      Lihat detail &rarr;
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {(Object.keys(projectStatusLabel) as ProjectStatus[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: statusColor[s] }}
            />
            {projectStatusLabel[s]}
          </span>
        ))}
      </div>
    </div>
  );
}
