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
import { Lists } from "@/components/Lists";

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
                listColor:
                  location.lists
                    ?.filter((list) => list.id !== selectedListId)
                    ?.at(0)?.color ?? null,
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
        currentLocations.map((location) => {
          const updatedLists =
            location.lists?.map((list) =>
              list.id === updatedList.id ? updatedList : list,
            ) ?? [];

          const isInUpdatedList = updatedLists.some(
            (list) => list.id === updatedList.id,
          );

          return {
            ...location,
            lists: updatedLists,
            listColor: isInUpdatedList ? updatedList.color : location.listColor,
          };
        }),
      );

      setSelectedListDetails((current) =>
        current
          ? {
              ...current,
              color: updatedList.color,
            }
          : current,
      );

      setSelectedListColor(updatedList.color ?? "#8b5cf6");
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
    <main className="min-h-screen bg-slate-950 px-6 pb-6 pt-2 text-white">
      <div className="rounded-2xl  p-4">
        <h1 className="mb-2 text-4xl font-bold">Travel Conquest Map</h1>
        <p className="text-m text-slate-400">
          Search places, save them, and organize them in conquest lists.
        </p>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_250px]">
        <section className="relative">
          <div className="pointer-events-none absolute left-1/2 top-4 z-[1000] w-full max-w-xl -translate-x-1/2 px-4">
            <div className="pointer-events-auto rounded-2xl border border-white/20 bg-slate-950/45 p-1 shadow-xl backdrop-blur-md">
              <LocationSearch
                lists={lists}
                onLocationCreated={handleLocationCreated}
                onListCreated={reloadLocationsAndLists}
              />
            </div>
          </div>

          <DynamicMap
            locations={locations}
            selectedLocationId={selectedLocationId}
            selectedListId={selectedListId}
            selectedListLocationIds={selectedListLocationIds}
            selectedListColor={selectedListDetails?.color ?? null}
          />
        </section>{" "}
        <aside className="space-y-4">
          {errorMessage && (
            <div className="rounded-2xl bg-red-950 p-4 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          <Lists
            lists={lists}
            selectedListId={selectedListId}
            selectedListDetails={selectedListDetails}
            selectedListColor={selectedListColor}
            isListLoading={isListLoading}
            onSelectList={handleSelectList}
            onSelectedListColorChange={setSelectedListColor}
            onUpdateSelectedListColor={handleUpdateSelectedListColor}
            onSelectLocationFromList={(locationId) => {
              setSelectedLocationId(locationId);
              setSelectedListId(null);
              setSelectedListDetails(null);
            }}
            onRemoveLocationFromList={handleRemoveLocationFromList}
          />
          <Places
            locations={locations}
            selectedLocationId={selectedLocationId}
            handleSelectLocation={handleSelectLocation}
            handleStatusChange={handleStatusChange}
            handleDeleteLocation={handleDeleteLocation}
          />
        </aside>
      </div>
    </main>
  );
}
