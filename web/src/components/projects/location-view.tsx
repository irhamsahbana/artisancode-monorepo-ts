import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import "@/lib/leaflet-icon-fix";

interface Props {
  latitude: number;
  longitude: number;
}

// ponytail: read-only counterpart to LocationPicker, no click/drag handlers.
export function LocationView({ latitude, longitude }: Props) {
  return (
    <div className="h-56 overflow-hidden rounded-md border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} />
      </MapContainer>
    </div>
  );
}
