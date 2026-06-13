"use client";

import { useState } from "react";
import type {
  ConquestList,
  ConquestListWithLocations,
  LocationStatus,
  LocationWithLists,
} from "@/types";
import { Lists } from "@/components/Lists";
import Places from "@/components/Places";

type DropdownMenuProps = {
  errorMessage: string;

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

  locations: LocationWithLists[];
  selectedLocationId: string | null;
  onSelectLocation: (locationId: string) => void;
  onStatusChange: (locationId: string, status: LocationStatus) => void;
  onDeleteLocation: (locationId: string) => void;
};

export default function DropdownMenu({
  errorMessage,

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

  locations,
  selectedLocationId,
  onSelectLocation,
  onStatusChange,
  onDeleteLocation,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSelectLocationFromList(locationId: string) {
    onSelectLocationFromList(locationId);
    setIsOpen(false);
  }

  function handleSelectLocation(locationId: string) {
    onSelectLocation(locationId);
    setIsOpen(false);
  }

  return (
    <div className="absolute right-4 top-4 z-[1100] flex flex-col items-end">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-950/45 text-white shadow-lg backdrop-blur-md transition hover:bg-slate-950/65"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span className="flex flex-col items-center gap-1.5">
          <span className="block h-0.5 w-5 rounded-full bg-white transition-all duration-200 ease-out" />

          <span
            className={`block h-0.5 rounded-full bg-white transition-all duration-200 ease-out ${
              isOpen ? "w-3" : "w-5"
            }`}
          />

          <span className="block h-0.5 w-5 rounded-full bg-white transition-all duration-200 ease-out" />
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 max-h-[calc(100vh-160px)] w-[320px] overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/80 p-4 text-white shadow-2xl backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Menu
            </p>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full px-2 py-1 text-sm text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
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
              onSelectList={onSelectList}
              onSelectedListColorChange={onSelectedListColorChange}
              onUpdateSelectedListColor={onUpdateSelectedListColor}
              onSelectLocationFromList={handleSelectLocationFromList}
              onRemoveLocationFromList={onRemoveLocationFromList}
            />

            <Places
              locations={locations}
              selectedLocationId={selectedLocationId}
              handleSelectLocation={handleSelectLocation}
              handleStatusChange={onStatusChange}
              handleDeleteLocation={onDeleteLocation}
            />
          </div>
        </div>
      )}
    </div>
  );
}
