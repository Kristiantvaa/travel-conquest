// import { DynamicMap } from "@/components/DynamicMap";
// import Link from "next/link";

// const testLocations = [
//   {
//     id: "1",
//     name: "Oslo",
//     description: "Besøkt hovedstad",
//     status: "visited" as const,
//     location_type: "city",
//     latitude: 59.9139,
//     longitude: 10.7522,
//     country: "Norway",
//     region: "Oslo",
//   },
//   {
//     id: "2",
//     name: "Trondheim",
//     description: "Studiebyen",
//     status: "visited" as const,
//     location_type: "city",
//     latitude: 63.4305,
//     longitude: 10.3951,
//     country: "Norway",
//     region: "Trøndelag",
//   },
//   {
//     id: "3",
//     name: "Tokyo",
//     description: "Drømmedestinasjon",
//     status: "want_to_visit" as const,
//     location_type: "city",
//     latitude: 35.6762,
//     longitude: 139.6503,
//     country: "Japan",
//     region: "Tokyo",
//   },
//   {
//     id: "4",
//     name: "Mont Blanc",
//     description: "Fjellmål",
//     status: "want_to_visit" as const,
//     location_type: "mountain",
//     latitude: 45.8326,
//     longitude: 6.8652,
//     country: "France",
//     region: "Alps",
//   },
// ];

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-slate-950 p-6 text-white">
//       <div className="mx-auto max-w-7xl space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold">Travel Conquest Map</h1>
//           <p className="text-slate-300">
//             Grønne markører er besøkt. Lilla markører er ønskeliste.
//           </p>
//           <Link
//             href="/about"
//             className="mt-4 rounded-md bg-blue-500 text-white hover:bg-blue-600"
//           >
//             Go to About Page
//           </Link>
//         </div>

//         <DynamicMap locations={testLocations} />
//       </div>
//     </main>
//   );
// }

// "use client";

// import { useState } from "react";
// import { DynamicMap } from "@/components/DynamicMap";
// import type { MapLocation } from "@/components/MapView";

// const testLocations: MapLocation[] = [
//   {
//     id: "1",
//     name: "Oslo",
//     description: "Besøkt hovedstad",
//     status: "visited",
//     location_type: "city",
//     latitude: 59.9139,
//     longitude: 10.7522,
//     country: "Norway",
//     region: "Oslo",
//   },
//   {
//     id: "2",
//     name: "Trondheim",
//     description: "Studiebyen",
//     status: "visited",
//     location_type: "city",
//     latitude: 63.4305,
//     longitude: 10.3951,
//     country: "Norway",
//     region: "Trøndelag",
//   },
//   {
//     id: "3",
//     name: "Tokyo",
//     description: "Drømmedestinasjon",
//     status: "want_to_visit",
//     location_type: "city",
//     latitude: 35.6762,
//     longitude: 139.6503,
//     country: "Japan",
//     region: "Tokyo",
//   },
//   {
//     id: "4",
//     name: "Mont Blanc",
//     description: "Fjellmål",
//     status: "want_to_visit",
//     location_type: "mountain",
//     latitude: 45.8326,
//     longitude: 6.8652,
//     country: "France",
//     region: "Alps",
//   },
// ];

// export default function Home() {
//   const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
//     null,
//   );

//   return (
//     <main className="min-h-screen bg-slate-950 p-6 text-white">
//       <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
//         <aside className="rounded-2xl bg-slate-900 p-4">
//           <h1 className="mb-4 text-2xl font-bold">Travel Conquest Map</h1>

//           <div className="space-y-2">
//             {testLocations.map((location) => (
//               <button
//                 key={location.id}
//                 type="button"
//                 onClick={() => setSelectedLocationId(location.id)}
//                 className={`w-full rounded-xl px-4 py-3 text-left transition ${
//                   selectedLocationId === location.id
//                     ? "bg-purple-600 text-white"
//                     : "bg-slate-800 text-slate-200 hover:bg-slate-700"
//                 }`}
//               >
//                 <div className="font-semibold">{location.name}</div>
//                 <div className="text-sm opacity-75">
//                   {location.location_type} · {location.status}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </aside>

//         <section>
//           <DynamicMap
//             locations={testLocations}
//             selectedLocationId={selectedLocationId}
//           />
//         </section>
//       </div>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { DynamicMap } from "@/components/DynamicMap";
import { LocationSearch } from "@/components/LocationSearch";
import type { MapLocation } from "@/components/MapView";

const initialLocations: MapLocation[] = [
  {
    id: "1",
    name: "Oslo",
    description: "Besøkt hovedstad",
    status: "visited",
    location_type: "city",
    latitude: 59.9139,
    longitude: 10.7522,
    country: "Norway",
    region: "Oslo",
  },
  {
    id: "2",
    name: "Trondheim",
    description: "Studiebyen",
    status: "visited",
    location_type: "city",
    latitude: 63.4305,
    longitude: 10.3951,
    country: "Norway",
    region: "Trøndelag",
  },
  {
    id: "3",
    name: "Tokyo",
    description: "Drømmedestinasjon",
    status: "want_to_visit",
    location_type: "city",
    latitude: 35.6762,
    longitude: 139.6503,
    country: "Japan",
    region: "Tokyo",
  },
  {
    id: "4",
    name: "Mont Blanc",
    description: "Fjellmål",
    status: "want_to_visit",
    location_type: "mountain",
    latitude: 45.8326,
    longitude: 6.8652,
    country: "France",
    region: "Alps",
  },
];

export default function Home() {
  const [locations, setLocations] = useState<MapLocation[]>(initialLocations);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );

  function handleAddLocation(location: MapLocation) {
    setLocations((currentLocations) => [location, ...currentLocations]);
    setSelectedLocationId(location.id);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl bg-slate-900 p-4">
            <h1 className="mb-2 text-2xl font-bold">Travel Conquest Map</h1>
            <p className="text-sm text-slate-400">
              Green = visited. Purple = want to visit. Grey = nothing.
            </p>
          </div>

          <LocationSearch onAddLocation={handleAddLocation} />

          <div className="rounded-2xl bg-slate-900 p-4">
            <h2 className="mb-4 text-lg font-bold">Places</h2>

            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {locations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setSelectedLocationId(location.id)}
                  className={`w-full rounded-xl px-4 py-3 text-left transition ${
                    selectedLocationId === location.id
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  <div className="font-semibold">{location.name}</div>
                  <div className="text-sm opacity-75">
                    {location.location_type} · {location.status}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section>
          <DynamicMap
            locations={locations}
            selectedLocationId={selectedLocationId}
          />
        </section>
      </div>
    </main>
  );
}
