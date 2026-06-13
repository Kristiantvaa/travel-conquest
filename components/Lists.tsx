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
  if (selectedListId && selectedListDetails) {
    const listColor = selectedListDetails.color ?? "#8b5cf6";

    return (
      <div className="rounded-xl bg-slate-900/90 p-3">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-white">
              {selectedListDetails.icon ?? "🗺️"} {selectedListDetails.name}
            </h2>
            <p className="text-xs text-slate-400">
              {selectedListDetails.locations.length} locations
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectList(selectedListId)}
            className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Back
          </button>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-950/80 p-2.5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              List color
            </label>

            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={selectedListColor}
                onChange={(event) =>
                  onSelectedListColorChange(event.target.value)
                }
                className="h-8 w-10 shrink-0 cursor-pointer rounded-md border border-slate-700 bg-slate-900"
              />

              <input
                value={selectedListColor}
                onChange={(event) =>
                  onSelectedListColorChange(event.target.value)
                }
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-white outline-none focus:border-white/40"
              />

              <button
                type="button"
                onClick={onUpdateSelectedListColor}
                className="rounded-lg bg-purple-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-500"
              >
                Save
              </button>
            </div>
          </div>

          {isListLoading ? (
            <p className="text-xs text-slate-400">Loading list...</p>
          ) : selectedListDetails.locations.length === 0 ? (
            <p className="text-xs text-slate-400">
              This list has no locations.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedListDetails.locations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-100"
                  style={{
                    border: `1px solid ${listColor}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSelectLocationFromList(location.id)}
                    className="max-w-[130px] truncate hover:underline"
                    title={location.name}
                  >
                    {location.name}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveLocationFromList(location.id)}
                    className="ml-0.5 rounded-full px-1 text-red-400 hover:bg-red-950 hover:text-red-200"
                    aria-label={`Remove ${location.name} from list`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-900/90 p-3">
      <h2 className="mb-2 text-sm font-semibold text-white">Lists</h2>

      {lists.length === 0 ? (
        <p className="text-xs text-slate-400">
          No lists yet. Create one when saving a location.
        </p>
      ) : (
        <div className="space-y-1.5">
          {lists.map((list) => {
            const listColor = list.color ?? "#8b5cf6";

            return (
              <button
                key={list.id}
                type="button"
                onClick={() => onSelectList(list.id)}
                className="w-full rounded-lg border border-transparent bg-slate-800 px-3 py-2 text-left text-xs text-slate-200 transition hover:border-white/20 hover:bg-slate-700"
                style={{
                  borderLeft: `5px solid ${listColor}`,
                }}
              >
                <div className="truncate font-medium">
                  {list.icon ?? "🗺️"} {list.name}
                </div>

                {list.description && (
                  <div className="mt-0.5 truncate text-[11px] text-slate-400">
                    {list.description}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
