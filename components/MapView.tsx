"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Location as MapLocation } from "@/types";

type MapViewProps = {
  locations: MapLocation[];
  selectedLocationId?: string | null;
  selectedListId?: string | null;
  selectedListLocationIds?: string[];
  selectedListColor?: string | null;
};
function createMarkerIcon({
  status,
  color,
  isInSelectedList,
}: {
  status: MapLocation["status"];
  color?: string | null;
  isInSelectedList?: boolean;
}) {
  const fallbackColor =
    status === "visited"
      ? "#22c55e"
      : status === "want_to_visit"
        ? "#8b5cf6"
        : "#64748b";

  const markerColor = color || fallbackColor;
  const symbol =
    status === "visited" ? "✓" : status === "want_to_visit" ? "★" : "";

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: ${isInSelectedList ? "34px" : "28px"};
        height: ${isInSelectedList ? "34px" : "28px"};
        border-radius: 9999px;
        background: ${markerColor};
        border: ${isInSelectedList ? "4px" : "3px"} solid white;
        box-shadow: 0 4px 14px rgba(0,0,0,0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
      ">
        ${symbol}
      </div>
    `,
    iconSize: isInSelectedList ? [34, 34] : [28, 28],
    iconAnchor: isInSelectedList ? [17, 17] : [14, 14],
  });
}

// Få kartet til å zoome inn på den valgt lokasjon i Frontend
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
  selectedListId,
  selectedListLocationIds = [],
  selectedListColor,
}: MapViewProps) {
  const visibleLocations = selectedListId
    ? locations.filter((location) =>
        selectedListLocationIds.includes(location.id),
      )
    : locations;

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
          locations={visibleLocations}
          selectedLocationId={selectedLocationId}
        />

        {visibleLocations.map((location) => {
          const isInSelectedList =
            !!selectedListId && selectedListLocationIds.includes(location.id);

          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={createMarkerIcon({
                status: location.status,
                color: isInSelectedList ? selectedListColor : null,
                isInSelectedList,
              })}
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
          );
        })}
      </MapContainer>
    </div>
  );
}
