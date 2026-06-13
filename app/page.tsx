"use client";

import { useEffect, useMemo, useState } from "react";
import { DynamicMap } from "@/components/DynamicMap";
import { LocationSearch } from "@/components/LocationSearch";
import {
  getConquestLists,
  getListWithLocations,
  getLocationsWithLists,
  removeLocationFromList,
  updateConquestListColor,
  updateLocationStatus,
  deleteLocation,
} from "@/lib/api";
import type {
  ConquestList,
  ConquestListWithLocations,
  LocationStatus,
  LocationWithLists,
} from "@/types";
import Places from "@/components/Places";

export default function Home() {
  const [locations, setLocations] = useState<LocationWithLists[]>([]);
  const [lists, setLists] = useState<ConquestList[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedListDetails, setSelectedListDetails] =
    useState<ConquestListWithLocations | null>(null);

  const selectedListLocationIds =
    selectedListDetails?.locations.map((location) => location.id) ?? [];

  const [selectedListColor, setSelectedListColor] = useState("#8b5cf6");
  const [isLoading, setIsLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedList = useMemo(
    () => lists.find((list) => list.id === selectedListId) ?? null,
    [lists, selectedListId],
  );

  async function loadInitialData() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [locationsData, listsData] = await Promise.all([
        getLocationsWithLists(),
        getConquestLists(),
      ]);

      setLocations(locationsData);
      setLists(listsData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not load data from Supabase.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectLocation(locationId: string) {
    if (selectedLocationId === locationId) {
      setSelectedLocationId(null);
      return;
    }

    setSelectedListId(null);
    setSelectedListDetails(null);
    setSelectedLocationId(locationId);
  }

  async function handleDeleteLocation(locationId: string) {
    const location = locations.find((item) => item.id === locationId);

    if (!location) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${location.name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteLocation(locationId);

      setLocations((currentLocations) =>
        currentLocations.filter((item) => item.id !== locationId),
      );

      if (selectedLocationId === locationId) {
        setSelectedLocationId(null);
      }

      if (selectedListId) {
        await reloadSelectedList(selectedListId);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not delete location.",
      );
    }
  }

  async function reloadLocationsAndLists() {
    const [locationsData, listsData] = await Promise.all([
      getLocationsWithLists(),
      getConquestLists(),
    ]);

    setLocations(locationsData);
    setLists(listsData);
  }

  async function reloadSelectedList(listId: string) {
    setIsListLoading(true);

    try {
      const data = await getListWithLocations(listId);
      setSelectedListDetails(data);
      setSelectedListColor(data.color ?? "#8b5cf6");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not load list.",
      );
    } finally {
      setIsListLoading(false);
    }
  }

  async function handleSelectList(listId: string) {
    if (selectedListId === listId) {
      setSelectedListId(null);
      setSelectedListDetails(null);
      return;
    }
    setSelectedListId(listId);
    setSelectedLocationId(null);
    await reloadSelectedList(listId);
  }

  async function handleLocationCreated() {
    await reloadLocationsAndLists();
  }

  async function handleStatusChange(
    locationId: string,
    status: LocationStatus,
  ) {
    try {
      const updatedLocation = await updateLocationStatus(locationId, status);

      setLocations((currentLocations) =>
        currentLocations.map((location) =>
          location.id === locationId
            ? {
                ...location,
                ...updatedLocation,
              }
            : location,
        ),
      );

      setSelectedListId(null);
      setSelectedListDetails(null);
      setSelectedLocationId(locationId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not update location status.",
      );
    }
  }

  async function handleRemoveLocationFromList(locationId: string) {
    if (!selectedListId) return;

    try {
      await removeLocationFromList(selectedListId, locationId);

      setSelectedListDetails((current) =>
        current
          ? {
              ...current,
              locations: current.locations.filter(
                (location) => location.id !== locationId,
              ),
            }
          : current,
      );

      setLocations((currentLocations) =>
        currentLocations.map((location) =>
          location.id === locationId
            ? {
                ...location,
                lists: location.lists?.filter(
                  (list) => list.id !== selectedListId,
                ),
              }
            : location,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not remove location from list.",
      );
    }
  }

  async function handleUpdateSelectedListColor() {
    if (!selectedListId) return;

    try {
      const updatedList = await updateConquestListColor(
        selectedListId,
        selectedListColor,
      );

      setLists((currentLists) =>
        currentLists.map((list) =>
          list.id === updatedList.id ? updatedList : list,
        ),
      );

      setLocations((currentLocations) =>
        currentLocations.map((location) => ({
          ...location,
          lists: location.lists?.map((list) =>
            list.id === updatedList.id ? updatedList : list,
          ),
        })),
      );

      setSelectedListDetails((current) =>
        current
          ? {
              ...current,
              color: updatedList.color,
            }
          : current,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not update list color.",
      );
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedList) {
      setSelectedListColor(selectedList.color ?? "#8b5cf6");
    }
  }, [selectedList]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading travel map...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[420px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl bg-slate-900 p-4">
            <h1 className="mb-2 text-2xl font-bold">Travel Conquest Map</h1>
            <p className="text-sm text-slate-400">
              Search places, save them, and organize them in conquest lists.
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-2xl bg-red-950 p-4 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          <LocationSearch
            lists={lists}
            onLocationCreated={handleLocationCreated}
            onListCreated={reloadLocationsAndLists}
          />

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
                    onClick={() => handleSelectList(list.id)}
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
                      <div className="text-sm text-slate-400">
                        {list.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {selectedListDetails && (
              <div className="mt-4 space-y-4 rounded-2xl border border-slate-700 bg-slate-950 p-3">
                <div>
                  <h3 className="font-bold">
                    {selectedListDetails.icon ?? "🗺️"}{" "}
                    {selectedListDetails.name}
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
                        setSelectedListColor(event.target.value)
                      }
                      className="h-10 w-14 cursor-pointer rounded-lg border border-slate-700 bg-slate-900"
                    />

                    <input
                      value={selectedListColor}
                      onChange={(event) =>
                        setSelectedListColor(event.target.value)
                      }
                      className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                    />

                    <button
                      type="button"
                      onClick={handleUpdateSelectedListColor}
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
                          onClick={() => {
                            setSelectedLocationId(location.id);
                            setSelectedListId(null);
                            setSelectedListDetails(null);
                          }}
                          className="max-w-[180px] truncate hover:underline"
                          title={location.name}
                        >
                          {location.name}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveLocationFromList(location.id)
                          }
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

          <Places
            locations={locations}
            selectedLocationId={selectedLocationId}
            handleSelectLocation={handleSelectLocation}
            handleStatusChange={handleStatusChange}
            handleDeleteLocation={handleDeleteLocation}
          />
        </aside>

        <section>
          <DynamicMap
            locations={locations}
            selectedLocationId={selectedLocationId}
            selectedListId={selectedListId}
            selectedListLocationIds={selectedListLocationIds}
            selectedListColor={selectedListDetails?.color ?? null}
          />
        </section>
      </div>
    </main>
  );
}
