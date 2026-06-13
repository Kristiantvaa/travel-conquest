// components/Lists.tsx

import type { ConquestList, ConquestListWithLocations } from "@/types";

type ListsProps = {
  lists: ConquestList[];
  selectedListId: string | null;
  selectedListDetails: ConquestListWithLocations | null;
  selectedListColor: string;
  isListLoading: boolean;
  onSelectList: (listId: string) => void;
  onSelectedListColorChange: (color: string) => void;
  onUpdateSelectedListColor: () => void;
  onSelectLocationFromList: (locationId: string) => void;
  onRemoveLocationFromList: (locationId: string) => void;
};

export function Lists({
  lists,
  selectedListId,
  selectedListDetails,
  selectedListColor,
  isListLoading,
  onSelectList,
  onSelectedListColorChange,
  onUpdateSelectedListColor,
  onSelectLocationFromList,
  onRemoveLocationFromList,
}: ListsProps) {
  return (
    <div className="rounded-2xl bg-slate-900 p-4">
      <h2 className="mb-4 text-lg font-bold">Lists</h2>

      {lists.length === 0 ? (
        <p className="text-sm text-slate-400">
          No lists yet. Create one when saving a location.
        </p>
      ) : (
        <div className="space-y-2">
          {lists.map((list) => (
            <button
              key={list.id}
              type="button"
              onClick={() => onSelectList(list.id)}
              className={`w-full rounded-xl px-4 py-3 text-left transition ${
                selectedListId === list.id
                  ? "bg-slate-700 text-white ring-2"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
              style={{
                borderLeft: `8px solid ${list.color ?? "#8b5cf6"}`,
                ringColor: list.color ?? "#8b5cf6",
              }}
            >
              <div className="font-semibold">
                {list.icon ?? "🗺️"} {list.name}
              </div>

              {list.description && (
                <div className="text-sm text-slate-400">{list.description}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {selectedListDetails && (
        <div className="mt-4 space-y-4 rounded-2xl border border-slate-700 bg-slate-950 p-3">
          <div>
            <h3 className="font-bold">
              {selectedListDetails.icon ?? "🗺️"} {selectedListDetails.name}
            </h3>
            <p className="text-sm text-slate-400">
              {selectedListDetails.locations.length} locations
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              List color
            </label>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedListColor}
                onChange={(event) =>
                  onSelectedListColorChange(event.target.value)
                }
                className="h-10 w-14 cursor-pointer rounded-lg border border-slate-700 bg-slate-900"
              />

              <input
                value={selectedListColor}
                onChange={(event) =>
                  onSelectedListColorChange(event.target.value)
                }
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
              />

              <button
                type="button"
                onClick={onUpdateSelectedListColor}
                className="rounded-xl bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-500"
              >
                Save
              </button>
            </div>
          </div>

          {isListLoading ? (
            <p className="text-sm text-slate-400">Loading list...</p>
          ) : selectedListDetails.locations.length === 0 ? (
            <p className="text-sm text-slate-400">
              This list has no locations.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedListDetails.locations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center gap-1 rounded-full bg-slate-800 px-2 py-1 text-sm"
                  style={{
                    border: `1px solid ${
                      selectedListDetails.color ?? "#8b5cf6"
                    }`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSelectLocationFromList(location.id)}
                    className="max-w-[180px] truncate hover:underline"
                    title={location.name}
                  >
                    {location.name}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveLocationFromList(location.id)}
                    className="ml-1 rounded-full px-1 text-red-400 hover:bg-red-950 hover:text-red-200"
                    aria-label={`Remove ${location.name} from list`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
