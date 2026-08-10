import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import L from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useNavigate } from "react-router";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeStatuses, setActiveStatuses] = useState<ProjectStatus[]>([
    "prospect",
    "in_progress",
    "won",
    "lost",
  ]);

  const points = (data?.items ?? []).filter(
    (p): p is Project & { latitude: number; longitude: number } =>
      p.latitude != null && p.longitude != null,
  );

  const filteredPoints = points.filter((p) => {
    if (!activeStatuses.includes(p.status)) return false;
    if (startDate && new Date(p.createdAt) < new Date(startDate)) return false;

    // endDate comparison - include the whole day by adding 1 day if we just compare to string directly
    // but a standard yyyy-MM-dd is midnight. let's just do simple compare
    if (endDate && p.createdAt.split("T")[0] > endDate) return false;
    if (startDate && p.createdAt.split("T")[0] < startDate) return false;

    return true;
  });

  const summary = filteredPoints.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {} as Record<ProjectStatus, number>,
  );

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <PageHeader
          title="Peta Proyek"
          description="Sebaran lokasi proyek yang sudah ditandai di peta."
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Mulai
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-36 h-9"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Sampai
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-36 h-9"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        {(Object.keys(projectStatusLabel) as ProjectStatus[]).map((s) => {
          const isActive = activeStatuses.includes(s);
          return (
            <button
              key={s}
              onClick={() => {
                setActiveStatuses((prev) =>
                  prev.includes(s)
                    ? prev.filter((st) => st !== s)
                    : [...prev, s],
                );
              }}
              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 transition-colors ${
                isActive
                  ? "bg-muted/50 border-border"
                  : "bg-transparent border-transparent opacity-50 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-center w-4 h-4 rounded-sm border mr-1">
                {isActive && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
              </div>
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: statusColor[s] }}
              />
              <span className="font-medium text-muted-foreground">
                {projectStatusLabel[s]}:
              </span>
              <span className="font-bold">{summary[s] || 0}</span>
            </button>
          );
        })}
      </div>

      <div className="h-[600px] w-full overflow-hidden rounded-md border">
        <MapContainer
          center={INDONESIA_CENTER}
          zoom={5}
          className="h-full w-full"
          style={{ height: "100%", minHeight: "600px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup chunkedLoading>
            {filteredPoints.map((p) => (
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
    </div>
  );
}
