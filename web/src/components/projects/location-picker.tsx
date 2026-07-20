import { useQuery } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import { Crosshair, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import "@/lib/leaflet-icon-fix";

import type L from "leaflet";

const INDONESIA_CENTER: [number, number] = [-2.5, 118];

interface PlaceResult {
  label: string;
  lat: number;
  lon: number;
}

interface PhotonFeature {
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  geometry: {
    coordinates: [number, number]; // [lon, lat]
  };
}

function placeLabel(p: PhotonFeature["properties"]): string {
  return [p.name, p.city, p.state, p.country].filter(Boolean).join(", ");
}

// ponytail: Photon (komoot, built on OpenStreetMap data) instead of
// Nominatim — Nominatim's CDN doesn't Vary by Origin, so its CORS header is
// inconsistently cached and browser requests fail unpredictably. Photon is
// built for direct client-side use and free, no API key.
async function searchPlaces(
  query: string,
  signal: AbortSignal,
): Promise<PlaceResult[]> {
  const res = await fetch(
    `https://photon.komoot.io/api/?limit=5&q=${encodeURIComponent(query)}`,
    { signal },
  );
  if (!res.ok) return [];
  const data: { features: PhotonFeature[] } = await res.json();
  return data.features.map((f) => ({
    label: placeLabel(f.properties),
    lon: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
  }));
}

interface Props {
  latitude?: number;
  longitude?: number;
  onChange: (lat: number, lng: number) => void;
  onClear: () => void;
}

function ClickToPlace({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToPoint({
  latitude,
  longitude,
}: {
  latitude?: number;
  longitude?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (latitude != null && longitude != null) {
      map.flyTo([latitude, longitude], Math.max(map.getZoom(), 13));
    }
  }, [latitude, longitude, map]);
  return null;
}

function LocationSearch({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const trimmedQuery = debouncedQuery.trim();

  const { data: results = [], isFetching: loading } = useQuery({
    queryKey: ["place-search", trimmedQuery],
    queryFn: ({ signal }) => searchPlaces(trimmedQuery, signal),
    enabled: trimmedQuery.length >= 3,
  });

  function handleLocateMe() {
    if (!navigator.geolocation) {
      toast.error("Perangkat tidak mendukung deteksi lokasi.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => onSelect(pos.coords.latitude, pos.coords.longitude),
      () => toast.error("Gagal mengambil lokasi Anda."),
    );
  }

  return (
    <div className="relative flex gap-1.5">
      <div className="relative flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama tempat / landmark..."
        />
        {(loading || results.length > 0) && trimmedQuery.length >= 3 && (
          <div className="absolute z-1100 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
            {loading ? (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                Mencari...
              </p>
            ) : (
              results.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onSelect(r.lat, r.lon);
                    setQuery("");
                  }}
                  className="block w-full truncate rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                >
                  {r.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        title="Gunakan lokasi saya"
        onClick={handleLocateMe}
      >
        <Crosshair className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ponytail: pick-a-point map on OpenStreetMap tiles, no API key needed.
// Always optional — the form works fine with no point set.
export function LocationPicker({
  latitude,
  longitude,
  onChange,
  onClear,
}: Props) {
  const hasPoint = latitude != null && longitude != null;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between">
        <Label>Titik Lokasi (opsional)</Label>
        {hasPoint && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-auto gap-1 px-1.5 py-0.5 text-xs text-muted-foreground"
          >
            <X className="h-3 w-3" />
            Hapus titik
          </Button>
        )}
      </div>
      <LocationSearch onSelect={onChange} />
      <div className="h-56 overflow-hidden rounded-md border">
        <MapContainer
          center={
            latitude != null && longitude != null
              ? [latitude, longitude]
              : INDONESIA_CENTER
          }
          zoom={hasPoint ? 14 : 5}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlace onChange={onChange} />
          <FlyToPoint latitude={latitude} longitude={longitude} />
          {latitude != null && longitude != null && (
            <Marker
              position={[latitude, longitude]}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const pos = (e.target as L.Marker).getLatLng();
                  onChange(pos.lat, pos.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <p className="text-xs text-muted-foreground">
        Cari nama tempat, pakai lokasi Anda, klik peta, atau geser pin untuk
        menandai lokasi.
      </p>
    </div>
  );
}
