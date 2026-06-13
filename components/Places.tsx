import type { LocationStatus } from "@/types";
import type { MapLocation } from "./MapView";

type PlacesProps = {
  locations: MapLocation[];
  selectedLocationId?: string | null;
  handleSelectLocation: (id: string) => void;
  handleStatusChange: (id: string, status: LocationStatus) => void;
  handleDeleteLocation: (id: string) => void;
};

export default function Places({
  locations,
  selectedLocationId,
  handleSelectLocation,
  handleStatusChange,
  handleDeleteLocation,
}: PlacesProps) {
  function toggleSelectedLocation(id: string) {
    handleSelectLocation(id);
  }

  return (
    <div className="rounded-xl bg-slate-900/90 p-3">
      <h2 className="mb-2 text-sm font-semibold text-white">Places</h2>

      {locations.length === 0 ? (
        <p className="text-xs text-slate-400">
          No locations yet. Search for one above.
        </p>
      ) : (
        <div className="max-h-[300px] space-y-1.5 overflow-y-auto pr-1">
          {locations.map((location) => {
            const isSelected = selectedLocationId === location.id;
            const locationColor = location.listColor ?? "#8b5cf6";

            return (
              <div
                key={location.id}
                className={`rounded-lg border px-3 py-2 text-xs transition ${
                  isSelected
                    ? "border-white/70 bg-slate-700/80 text-white ring-1 ring-white/40"
                    : "border-transparent bg-slate-800 text-slate-200 hover:border-white/20 hover:bg-slate-700"
                }`}
                style={{
                  borderLeft: `5px solid ${locationColor}`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSelectedLocation(location.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="truncate font-medium">{location.name}</div>

                    <div className="mt-0.5 truncate text-[11px] opacity-70">
                      {location.location_type}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteLocation(location.id)}
                    className="shrink-0 rounded-full px-1.5 text-sm font-bold text-red-400 hover:bg-red-950 hover:text-red-200"
                    aria-label={`Remove ${location.name} from places`}
                    title={`Delete ${location.name}`}
                  >
                    ×
                  </button>
                </div>

                {/* {location.lists && location.lists.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {location.lists.map((list) => (
                      <span
                        key={list.id}
                        className="max-w-[110px] truncate rounded-full px-1.5 py-0.5 text-[10px] text-white"
                        style={{
                          backgroundColor: list.color ?? "#8b5cf6",
                        }}
                        title={list.name}
                      >
                        {list.name}
                      </span>
                    ))}
                  </div>
                )} */}

                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(location.id, "visited")}
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                      location.status === "visited"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-700 text-slate-200 hover:bg-emerald-600"
                    }`}
                  >
                    Visited
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(location.id, "want_to_visit")
                    }
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                      location.status === "want_to_visit"
                        ? "bg-purple-500 text-white"
                        : "bg-slate-700 text-slate-200 hover:bg-purple-600"
                    }`}
                  >
                    Want
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
