"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { createLocationAndMaybeAddToList } from "@/lib/api";
import type {
  ConquestList,
  Location,
  LocationStatus,
  LocationType,
  NewLocation,
} from "@/types";

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
  address?: {
    country?: string;
    state?: string;
    region?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
  };
};

type LocationSearchProps = {
  lists: ConquestList[];
  onLocationCreated: (location: Location) => void;
  onListCreated: () => void;
};

function guessLocationType(result: SearchResult): LocationType {
  const type = result.type?.toLowerCase() ?? "";
  const resultClass = result.class?.toLowerCase() ?? "";
  const displayName = result.display_name.toLowerCase();

  if (
    type.includes("peak") ||
    type.includes("mountain") ||
    resultClass.includes("natural")
  ) {
    return "mountain";
  }

  if (
    type.includes("range") ||
    displayName.includes("mountain range") ||
    displayName.includes("fjellkjede")
  ) {
    return "mountain_range";
  }

  if (
    type.includes("city") ||
    type.includes("town") ||
    type.includes("village")
  ) {
    return "city";
  }

  if (type.includes("country")) {
    return "country";
  }

  if (
    type.includes("state") ||
    type.includes("region") ||
    type.includes("province") ||
    resultClass.includes("boundary")
  ) {
    return "region";
  }

  return "other";
}

function getShortName(displayName: string) {
  return displayName.split(",")[0]?.trim() || displayName;
}

export function LocationSearch({
  lists,
  onLocationCreated,
  onListCreated,
}: LocationSearchProps) {
  const [newListColor, setNewListColor] = useState("#8b5cf6");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] =
    useState<LocationStatus>("want_to_visit");
  const [existingListId, setExistingListId] = useState("");
  const [newListName, setNewListName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setSelectedResult(null);
      return;
    }

    setIsSearching(true);
    setErrorMessage("");
    setSelectedResult(null);

    try {
      const params = new URLSearchParams({
        q: trimmedQuery,
        format: "json",
        addressdetails: "1",
        limit: "8",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = (await response.json()) as SearchResult[];
      setResults(data);

      if (data.length === 0) {
        setErrorMessage("No places found. Try a more specific search.");
      }
    } catch {
      setErrorMessage("Could not search for location.");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSaveLocation() {
    if (!selectedResult) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      const address = selectedResult.address;

      const newLocation: NewLocation = {
        name: getShortName(selectedResult.display_name),
        description: selectedResult.display_name,
        status: selectedStatus,
        location_type: guessLocationType(selectedResult),
        latitude: Number(selectedResult.lat),
        longitude: Number(selectedResult.lon),
        country: address?.country ?? null,
        region:
          address?.state ??
          address?.region ??
          address?.municipality ??
          address?.city ??
          address?.town ??
          address?.village ??
          null,
      };

      const createdLocation = await createLocationAndMaybeAddToList({
        location: newLocation,
        existingListId: existingListId || null,
        newListName: newListName || null,
        newListColor,
      });

      onLocationCreated(createdLocation);

      if (newListName.trim()) {
        onListCreated();
      }

      setQuery("");
      setResults([]);
      setSelectedResult(null);
      setSelectedStatus("want_to_visit");
      setExistingListId("");
      setNewListName("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not save location to Supabase.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/35 px-3 py-2 shadow-lg backdrop-blur-md transition focus-within:border-purple-400/70 focus-within:bg-slate-950/55"
      >
        <Search className="h-4 w-4 shrink-0 text-white/70" />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search places..."
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/55"
        />

        <button
          type="submit"
          disabled={isSearching}
          className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSearching ? "..." : "Search"}
        </button>
      </form>

      {(errorMessage || results.length > 0 || selectedResult) && (
        <div className="mt-3 max-h-[70vh] space-y-3 overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/55 p-3 shadow-xl backdrop-blur-md">
          {errorMessage && (
            <p className="rounded-xl bg-red-950/80 px-3 py-2 text-sm text-red-200">
              {errorMessage}
            </p>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {results.map((result) => {
                  const isSelected =
                    selectedResult?.place_id === result.place_id;

                  return (
                    <button
                      key={result.place_id}
                      type="button"
                      onClick={() => setSelectedResult(result)}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                        isSelected
                          ? "bg-purple-600/90 text-white"
                          : "bg-white/10 text-slate-100 hover:bg-white/15"
                      }`}
                    >
                      <div className="font-medium">
                        {getShortName(result.display_name)}
                      </div>
                      <div className="line-clamp-2 text-xs opacity-70">
                        {result.display_name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedResult && (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  {getShortName(selectedResult.display_name)}
                </p>
                <p className="text-xs text-slate-400">
                  {Number(selectedResult.lat).toFixed(4)},{" "}
                  {Number(selectedResult.lon).toFixed(4)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Mark as
                </label>

                <select
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(event.target.value as LocationStatus)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
                >
                  <option value="visited">Visited</option>
                  <option value="want_to_visit">Want to visit</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Add to existing list
                </label>

                <select
                  value={existingListId}
                  onChange={(event) => setExistingListId(event.target.value)}
                  disabled={newListName.trim().length > 0}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-purple-400 disabled:opacity-50"
                >
                  <option value="">No list</option>
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Or create new list
                </label>

                {newListName.trim().length > 0 && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newListColor}
                      onChange={(event) => setNewListColor(event.target.value)}
                      className="h-9 w-12 cursor-pointer rounded-lg border border-white/10 bg-slate-950/70"
                    />

                    <input
                      value={newListColor}
                      onChange={(event) => setNewListColor(event.target.value)}
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
                    />
                  </div>
                )}

                <input
                  value={newListName}
                  onChange={(event) => {
                    setNewListName(event.target.value);
                    if (event.target.value.trim()) {
                      setExistingListId("");
                    }
                  }}
                  placeholder="e.g. Seven Summits..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-purple-400"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveLocation}
                disabled={isSaving}
                className="w-full rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
