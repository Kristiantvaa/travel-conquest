// "use client";

// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// import L from "leaflet";

// type LocationStatus = "visited" | "want_to_visit" | "neutral";

// export type MapLocation = {
//   id: string;
//   name: string;
//   description?: string | null;
//   status: LocationStatus;
//   location_type: string;
//   latitude: number;
//   longitude: number;
//   country?: string | null;
//   region?: string | null;
// };

// type MapViewProps = {
//   locations: MapLocation[];
// };

// const visitedIcon = L.divIcon({
//   className: "",
//   html: `
//     <div style="
//       width: 28px;
//       height: 28px;
//       border-radius: 9999px;
//       background: #22c55e;
//       border: 3px solid white;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.35);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 14px;
//     ">
//       ✓
//     </div>
//   `,
//   iconSize: [28, 28],
//   iconAnchor: [14, 14],
// });

// const wishlistIcon = L.divIcon({
//   className: "",
//   html: `
//     <div style="
//       width: 28px;
//       height: 28px;
//       border-radius: 9999px;
//       background: #8b5cf6;
//       border: 3px solid white;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.35);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 14px;
//     ">
//       ★
//     </div>
//   `,
//   iconSize: [28, 28],
//   iconAnchor: [14, 14],
// });

// const neutralIcon = L.divIcon({
//   className: "",
//   html: `
//     <div style="
//       width: 24px;
//       height: 24px;
//       border-radius: 9999px;
//       background: #64748b;
//       border: 3px solid white;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.35);
//     "></div>
//   `,
//   iconSize: [24, 24],
//   iconAnchor: [12, 12],
// });

// function getIcon(status: LocationStatus) {
//   if (status === "visited") return visitedIcon;
//   if (status === "want_to_visit") return wishlistIcon;
//   return neutralIcon;
// }

// export default function MapView({ locations }: MapViewProps) {
//   const defaultCenter: [number, number] = [59.9139, 10.7522];
//   const maxBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

//   return (
//     <div className="h-[400px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow">
//       <MapContainer
//         center={defaultCenter}
//         zoom={4}
//         minZoom={2}
//         scrollWheelZoom
//         className="h-full w-full"
//         maxBounds={maxBounds}
//         maxBoundsViscosity={1.0}
//       >
//         <TileLayer
//           noWrap={true}
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {locations.map((location) => (
//           <Marker
//             key={location.id}
//             position={[location.latitude, location.longitude]}
//             icon={getIcon(location.status)}
//           >
//             <Popup>
//               <div className="space-y-1">
//                 <p className="font-semibold">{location.name}</p>
//                 <p>Status: {location.status}</p>
//                 <p>Type: {location.location_type}</p>

//                 {location.country && <p>Land: {location.country}</p>}
//                 {location.description && <p>{location.description}</p>}
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

type MapLocation = {
  id: string;
  name: string;
  description?: string;
  status: "visited" | "want_to_visit" | "neutral";
  location_type: string;
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
};

type MapViewProps = {
  locations: MapLocation[];
  selectedLocationId?: string | null;
};

const visitedIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 28px;
      height: 28px;
      border-radius: 9999px;
      background: #22c55e;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    ">
      ✓
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const wishlistIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 28px;
      height: 28px;
      border-radius: 9999px;
      background: #8b5cf6;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      ★
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const neutralIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 24px;
      height: 24px;
      border-radius: 9999px;
      background: #64748b;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function getIcon(status: MapLocation["status"]) {
  if (status === "visited") return visitedIcon;
  if (status === "want_to_visit") return wishlistIcon;
  return neutralIcon;
}

function FlyToSelectedLocation({
  locations,
  selectedLocationId,
}: {
  locations: MapLocation[];
  selectedLocationId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedLocationId) return;

    const selectedLocation = locations.find(
      (location) => location.id === selectedLocationId,
    );

    if (!selectedLocation) return;

    map.flyTo([selectedLocation.latitude, selectedLocation.longitude], 10, {
      duration: 1.2,
    });
  }, [selectedLocationId, locations, map]);

  return null;
}

export type { MapLocation };

export default function MapView({
  locations,
  selectedLocationId,
}: MapViewProps) {
  return (
    <div className="h-[600px] w-full overflow-hidden rounded-2xl border border-slate-700 shadow">
      <MapContainer
        center={[59.9139, 10.7522]}
        zoom={4}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToSelectedLocation
          locations={locations}
          selectedLocationId={selectedLocationId}
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={getIcon(location.status)}
          >
            <Popup>
              <div>
                <strong>{location.name}</strong>
                <br />
                Status: {location.status}
                <br />
                Type: {location.location_type}
                {location.country && (
                  <>
                    <br />
                    Land: {location.country}
                  </>
                )}
                {location.description && (
                  <>
                    <br />
                    <span>{location.description}</span>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
