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

function FitBoundsToSelectedList({
  locations,
  selectedListId,
}: {
  locations: MapLocation[];
  selectedListId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedListId) return;
    if (locations.length === 0) return;

    const bounds = L.latLngBounds(
      locations.map((location) => [location.latitude, location.longitude]),
    );

    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 8,
      animate: true,
      duration: 1.2,
    });
  }, [locations, selectedListId, map]);

  return null;
}

function createMarkerIcon({
  status,
  color,
  isInSelectedList,
  name,
}: {
  status: MapLocation["status"];
  color?: string | null;
  isInSelectedList?: boolean;
  name: string;
}) {
  const fallbackColor =
    status === "visited"
      ? "#22c55e"
      : status === "want_to_visit"
        ? "#8b5cf6"
        : "#64748b";

  const baseColor = color || fallbackColor;

  const markerColor =
    status === "want_to_visit"
      ? `color-mix(in srgb, ${baseColor} 75%, white)`
      : baseColor;

  const symbolColor =
    status === "visited"
      ? `color-mix(in srgb, ${baseColor} 30%, white)`
      : `white`;

  const borderColor =
    status === "visited"
      ? `color-mix(in srgb, ${baseColor} 90%, black)`
      : `color-mix(in srgb, ${baseColor} 30%, white)`;

  const symbol =
    status === "visited" ? "✓" : status === "want_to_visit" ? "★" : "";

  const size =
    isInSelectedList && status === "visited" ? 40 : isInSelectedList ? 34 : 28;

  const borderWidth =
    isInSelectedList && status === "visited" ? 5 : isInSelectedList ? 3 : 2;

  const boxShadow =
    status === "visited"
      ? `
        0 0 0 4px color-mix(in srgb, ${baseColor} 45%, transparent),
        0 0 18px color-mix(in srgb, ${baseColor} 70%, transparent),
        0 6px 18px rgba(0,0,0,0.5)
      `
      : `0 4px 14px rgba(0,0,0,0.35)`;

  const fontSize =
    status === "visited"
      ? "20px"
      : status === "want_to_visit"
        ? "15px"
        : "14px";

  const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return L.divIcon({
    className: "",
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        transform: translateY(-${size / 2}px);
        pointer-events: auto;
      ">
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 9999px;
          background: ${markerColor};
          border: ${borderWidth}px solid ${borderColor};
          box-shadow: ${boxShadow};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: ${fontSize};
          color: ${symbolColor};
        ">
          ${symbol}
        </div>

        <div style="
          max-width: 120px;
          padding: 2px 6px;
          border-radius: 9999px;
          background: rgba(30, 41, 59, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.14);          
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
          color: white;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        ">
          ${safeName}
        </div>
      </div>
    `,
    iconSize: [120, size + 24],
    iconAnchor: [60, size / 2],
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
        minZoom={3}
        maxBoundsViscosity={1.0}
        maxBounds={[
          [-70, -180],
          [85.2, 180],
        ]}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />

        <FlyToSelectedLocation
          locations={visibleLocations}
          selectedLocationId={selectedLocationId}
        />

        <FitBoundsToSelectedList
          locations={visibleLocations}
          selectedListId={selectedListId}
        />

        {visibleLocations.map((location) => {
          const isInSelectedList =
            !!selectedListId && selectedListLocationIds.includes(location.id);

          return (
            <Marker
              key={`${location.id}-${location.status}-${isInSelectedList ? selectedListColor : location.listColor}`}
              position={[location.latitude, location.longitude]}
              icon={createMarkerIcon({
                status: location.status,
                color: isInSelectedList
                  ? selectedListColor
                  : location.listColor,
                isInSelectedList,
                name: location.name,
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
