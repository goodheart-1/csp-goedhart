"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function emojiIcon(emoji: string) {
  return L.divIcon({
    html: `<span style="font-size:24px;line-height:1">${emoji}</span>`,
    className: "bg-transparent",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

const locations = [
  { name: "Margha Klaver", label: "Mama", lat: 52.4631, lng: 4.6219, emoji: "🍀" },
  { name: "Aad Goedhart", label: "Vader", lat: 52.4863, lng: 4.6572, emoji: "💚" },
  { name: "Roosje Goedhart", label: "Zus", lat: 52.6324, lng: 4.7534, emoji: "🌹" },
  { name: "Sanne Goedhart", label: "Twin", lat: 52.46, lng: 4.61, emoji: "👩🏼‍🚒" },
  { name: "Don Mehrow", label: "", lat: 52.3676, lng: 4.9041, emoji: "🔱" },
  { name: "Jeroen Blokzijl", label: "", lat: 52.0907, lng: 5.231, emoji: "⛰️" },
  { name: "Bram Veldhuijs", label: "", lat: 52.5478, lng: 4.6579, emoji: "🐂" },
  { name: "Daantje (Jij)", label: "", lat: 52.483, lng: 4.655, emoji: "📍" },
];

export default function LocationMap() {
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height: 400 }}>
      <MapContainer
        center={[52.48, 4.65]}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker key={loc.name} position={[loc.lat, loc.lng]} icon={emojiIcon(loc.emoji)}>
            <Popup>
              <strong>{loc.name}</strong>
              {loc.label && <div className="text-xs text-stone-500">{loc.label}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Frosted glass overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/80 backdrop-blur-xl rounded-lg border border-stone-200/60 px-4 py-3 shadow-lg">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-stone-400 mb-1">
          Dichtstbijzijnde contact
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-stone-900">Margha Klaver (Mama)</div>
            <div className="text-xs text-stone-500">2.4 km afstand</div>
          </div>
        </div>
      </div>
    </div>
  );
}
