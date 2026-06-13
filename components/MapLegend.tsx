"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ConquestList } from "@/types";
import ProgressDot from "./ProgressDot";
import ListPopUp from "./ListPopUp";

type MapLegendProps = {
  lists: ConquestList[];
  selectedListId: string | null;
  onSelectList: (listId: string) => void;
  onClearSelectedList?: () => void;
  onListUpdated?: (updatedList: ConquestList) => void;
  position?: "top-right" | "bottom-right";
};

const LISTS_PER_PAGE = 4;

export default function MapLegend({
  lists,
  selectedListId,
  onSelectList,
  onClearSelectedList,
  onListUpdated,
  position = "bottom-right",
}: MapLegendProps) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");

  const sortedLists = useMemo(() => {
    return [...lists].sort(
      (a, b) => (a.statusProgress ?? 0) - (b.statusProgress ?? 0),
    );
  }, [lists]);

  const selectedList = useMemo(() => {
    return lists.find((list) => list.id === selectedListId) ?? null;
  }, [lists, selectedListId]);

  const totalPages = Math.ceil(sortedLists.length / LISTS_PER_PAGE);

  const visibleLists = sortedLists.slice(
    page * LISTS_PER_PAGE,
    page * LISTS_PER_PAGE + LISTS_PER_PAGE,
  );

  if (lists.length === 0) return null;

  const positionClass =
    position === "top-right" ? "right-4 top-4" : "bottom-4 right-4";

  const canGoUp = page > 0;
  const canGoDown = page < totalPages - 1;

  function goUp() {
    if (!canGoUp) return;
    setDirection("up");
    setPage((current) => Math.max(current - 1, 0));
  }

  function goDown() {
    if (!canGoDown) return;
    setDirection("down");
    setPage((current) => Math.min(current + 1, totalPages - 1));
  }

  return (
    <>
      {selectedList && (
        <ListPopUp
          list={selectedList}
          onClose={onClearSelectedList}
          onListUpdated={onListUpdated}
          legendPosition={position}
        />
      )}

      <div
        className={`pointer-events-auto absolute z-[1000] max-w-[220px] rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-white shadow-lg backdrop-blur-md ${positionClass}`}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Trips
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goUp}
                disabled={!canGoUp}
                className="rounded-md p-0.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous trips"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>

              <span className="text-[10px] text-white/45">
                {page + 1}/{totalPages}
              </span>

              <button
                type="button"
                onClick={goDown}
                disabled={!canGoDown}
                className="rounded-md p-0.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next trips"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <div
            key={page}
            className={`space-y-1.5 animate-in fade-in duration-200 ${
              direction === "down"
                ? "slide-in-from-top-2"
                : "slide-in-from-bottom-2"
            }`}
          >
            {visibleLists.map((list) => {
              const isSelected = selectedListId === list.id;
              const listColor = list.color ?? "#8b5cf6";

              return (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => onSelectList(list.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition ${
                    isSelected
                      ? "bg-white/15 text-white ring-1 ring-white/25"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                  title={list.name}
                >
                  <ProgressDot
                    color={listColor}
                    progress={list.statusProgress ?? 0}
                    isSelected={isSelected}
                  />

                  <span className="min-w-0 flex-1 truncate">{list.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
