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
    <div className="rounded-2xl bg-slate-900 p-4">
      <h2 className="mb-4 text-lg font-bold">Places</h2>

      {locations.length === 0 ? (
        <p className="text-sm text-slate-400">
          No locations yet. Search for one above.
        </p>
      ) : (
        <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {locations.map((location) => {
            const isSelected = selectedLocationId === location.id;

            return (
              <div
                key={location.id}
                className={`rounded-xl px-4 py-3 transition ${
                  isSelected
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSelectedLocation(location.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="truncate font-semibold">
                      {location.name}
                    </div>

                    <div className="text-sm opacity-75">
                      {location.location_type} · {location.status}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteLocation(location.id)}
                    className="shrink-0 rounded-full px-2 text-lg font-bold text-red-400 hover:bg-red-950 hover:text-red-200"
                    aria-label={`Remove ${location.name} from places`}
                    title={`Delete ${location.name}`}
                  >
                    ×
                  </button>
                </div>

                {location.lists && location.lists.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {location.lists.map((list) => (
                      <span
                        key={list.id}
                        className="rounded-full px-2 py-0.5 text-xs text-white"
                        style={{
                          backgroundColor: list.color ?? "#8b5cf6",
                        }}
                      >
                        {list.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(location.id, "visited")}
                    className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${
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
                    className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${
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
