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

function wellnessIcon(emoji: string, label: string, rating: number, visited: boolean) {
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:1px;white-space:nowrap">
      <span style="font-size:22px;line-height:1;filter:${visited ? 'none' : 'grayscale(0.5) opacity(0.7)'}">${emoji}</span>
      <span style="font-size:9px;font-weight:600;color:${visited ? '#065f46' : '#6b7280'};background:${visited ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)'};padding:1px 4px;border-radius:4px;line-height:1.2;text-align:center;max-width:80px;overflow:hidden;text-overflow:ellipsis">${label}</span>
      <span style="font-size:8px;color:#d97706;background:rgba(255,255,255,0.85);padding:0 3px;border-radius:3px;line-height:1.3">★ ${rating}</span>
    </div>`,
    className: "bg-transparent",
    iconSize: [80, 52],
    iconAnchor: [40, 26],
    popupAnchor: [0, -26],
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

const facilities = [
  { name: "Amstelmeren (GGZ inGeest)", lat: 52.3020, lng: 4.8530, emoji: "🚫", tooltip: "NIET - onhygienisch", color: "red" },
  { name: "Parnassia Castricum Unit 6", lat: 52.5450, lng: 4.6600, emoji: "✅", tooltip: "Prima - rustig, clean", color: "green" },
  { name: "De Nieuwe Valerius", lat: 52.3540, lng: 4.8670, emoji: "✅", tooltip: "Prima - heftige mensen, maar goed bad en vriendelijk personeel", color: "green" },
];

const facilitiesMe = { name: "Jij", lat: 52.4830, lng: 4.6550, emoji: "📍" };

export function FacilitiesMap() {
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height: 350 }}>
      <MapContainer
        key="facilities-map"
        center={[52.42, 4.76]}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='Tiles &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {facilities.map((f) => (
          <Marker key={f.name} position={[f.lat, f.lng]} icon={emojiIcon(f.emoji)}>
            <Popup>
              <strong>{f.name}</strong>
              <div className="text-xs text-stone-500">{f.tooltip}</div>
            </Popup>
          </Marker>
        ))}
        <Marker position={[facilitiesMe.lat, facilitiesMe.lng]} icon={emojiIcon(facilitiesMe.emoji)}>
          <Popup>
            <strong>{facilitiesMe.name}</strong>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Frosted glass legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/80 backdrop-blur-xl rounded-lg border border-stone-200/60 px-4 py-3 shadow-lg">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-stone-400 mb-2">
          Legenda
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <span>✅</span>
            <span>Goedgekeurd</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <span>🚫</span>
            <span>Afgekeurd</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const wellnessVisited = [
  { name: "Thermen Soesterberg", city: "Soesterberg", lat: 52.1275, lng: 5.2919, rating: 4.5 },
  { name: "Sauna van Egmond", city: "Haarlem", lat: 52.3814, lng: 4.6460, rating: 4.6 },
  { name: "Spa Zuiver", city: "Amsterdam", lat: 52.3283, lng: 4.8357, rating: 4.3 },
  { name: "Fort Resort Beemster", city: "Beemster", lat: 52.5369, lng: 4.9492, rating: 4.5 },
  { name: "Thermen Bussloo", city: "Bussloo", lat: 52.2583, lng: 6.1347, rating: 4.4 },
  { name: "Elysium", city: "Bloemendaal", lat: 52.4025, lng: 4.5258, rating: 4.5 },
  { name: "SpaSereen", city: "Rijswijk (Gld)", lat: 51.9361, lng: 5.9694, rating: 4.7 },
  { name: "Thermen Berendonck", city: "Wijchen", lat: 51.7867, lng: 5.7256, rating: 4.3 },
  { name: "Spa Weesp", city: "Weesp", lat: 52.3078, lng: 5.0436, rating: 4.4 },
];

const wellnessTodo = [
  // Noord-Holland
  { name: "Sauna Deco", city: "Amsterdam", lat: 52.3791, lng: 4.8980 },
  { name: "Spa Velserend", city: "IJmuiden", lat: 52.4614, lng: 4.6020 },
  { name: "Spa Sport Hotel Zuiver", city: "Amstelveen", lat: 52.3283, lng: 4.8357 },
  { name: "Sauna Driehuizen", city: "Driehuizen", lat: 52.5550, lng: 4.8100 },
  { name: "Wellness de Kennemerduinen", city: "Overveen", lat: 52.3900, lng: 4.5750 },
  { name: "Spa Luxx", city: "Alkmaar", lat: 52.6324, lng: 4.7534 },
  { name: "Spaarnwoude Spa", city: "Spaarnwoude", lat: 52.4130, lng: 4.7050 },
  // Zuid-Holland
  { name: "Elysium Den Haag", city: "Den Haag", lat: 52.0705, lng: 4.3007 },
  { name: "Thermae Son", city: "Son en Breugel", lat: 51.5100, lng: 5.5000 },
  // Utrecht
  { name: "Sanadome", city: "Nijmegen", lat: 51.8400, lng: 5.8550 },
  // Brabant
  { name: "Sauna Devarana", city: "Den Bosch", lat: 51.6900, lng: 5.2950 },
  { name: "SpaSense", city: "Geldrop", lat: 51.4200, lng: 5.5600 },
  { name: "Thermen Goirle", city: "Goirle", lat: 51.5200, lng: 5.0650 },
  { name: "SpaPuur", city: "Someren", lat: 51.3833, lng: 5.7167 },
  // Gelderland
  { name: "Veluwse Bron", city: "Emst", lat: 52.3200, lng: 5.9600 },
  { name: "De Zwaluwhoeve", city: "Hierden", lat: 52.3700, lng: 5.6700 },
  // Limburg
  { name: "Thermae 2000", city: "Valkenburg", lat: 50.8650, lng: 5.8320 },
  { name: "Ridderode", city: "Heerlen", lat: 50.8917, lng: 5.9667 },
  { name: "Wellness Sittard", city: "Sittard", lat: 51.0000, lng: 5.8700 },
  // Overijssel
  { name: "Saunapaleis De Bonte Wever", city: "Assen", lat: 52.9950, lng: 6.5550 },
  { name: "Thermen Bad Nieuweschans", city: "Bad Nieuweschans", lat: 53.1760, lng: 7.2080 },
  // Zeeland
  { name: "Sauna & Beauty Middelburg", city: "Middelburg", lat: 51.4988, lng: 3.6136 },
  // Belgie
  { name: "Elaisa", city: "Geel (BE)", lat: 51.1597, lng: 4.9897 },
  { name: "Thermae Grimbergen", city: "Grimbergen (BE)", lat: 50.9340, lng: 4.3710 },
];

export function WellnessMap() {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ height: 500, background: "linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #fdf4ff 100%)" }}>
      <MapContainer
        key="wellness-map"
        center={[52.0, 5.3]}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="wellness-map"
      >
        <TileLayer
          attribution='&copy; Stadia'
          url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
        />
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png"
          opacity={0.4}
        />
        {wellnessVisited.map((w) => (
          <Marker key={w.name} position={[w.lat, w.lng]} icon={emojiIcon("🧖🏼‍♂️")}>
            <Popup>
              <strong>{w.name}</strong>
              <div className="text-xs text-stone-500">{w.city}</div>
              <div className="text-xs text-emerald-600 font-medium">Bezocht ✓</div>
            </Popup>
          </Marker>
        ))}
        {wellnessTodo.map((w) => (
          <Marker key={w.name} position={[w.lat, w.lng]} icon={emojiIcon("🧘")}>
            <Popup>
              <strong>{w.name}</strong>
              <div className="text-xs text-stone-500">{w.city}</div>
              <div className="text-xs text-violet-600 font-medium">Nog te ontdekken</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-3 left-3 z-[1000] bg-white/70 backdrop-blur-xl rounded-xl border border-white/60 px-4 py-3 shadow-lg">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-stone-400 mb-2">
          Wellness Journey
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <span>🧖🏼‍♂️</span>
            <span>Bezocht ({wellnessVisited.length})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <span>🧘</span>
            <span>Nog te ontdekken ({wellnessTodo.length})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LocationMap() {
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height: 400 }}>
      <MapContainer
        key="location-map"
        center={[52.48, 4.65]}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='Tiles &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
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
