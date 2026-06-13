"use client";

import dynamic from "next/dynamic";
import type { MapLocation } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-300">
      Laster kart...
    </div>
  ),
});

type DynamicMapProps = {
  locations: MapLocation[];
  selectedLocationId?: string | null;
  selectedListId?: string | null;
};

export function DynamicMap({
  locations,
  selectedLocationId,
  selectedListId,
}: DynamicMapProps) {
  return (
    <MapView
      locations={locations}
      selectedLocationId={selectedLocationId}
      selectedListId={selectedListId}
    />
  );
}
