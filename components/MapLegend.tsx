import { ConquestList } from "@/types";

type MapLegendProps = {
  lists: ConquestList[];
  selectedListId: string | null;
  onSelectList: (listId: string) => void;
  position?: "top-right" | "bottom-right";
};

export default function MapLegend({
  lists,
  selectedListId,
  onSelectList,
  position = "bottom-right",
}: MapLegendProps) {
  if (lists.length === 0) return null;

  const positionClass =
    position === "top-right" ? "right-4 top-4" : "bottom-4 right-4";

  return (
    <div
      className={`pointer-events-auto absolute z-[1000] max-w-[220px] rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-white shadow-lg backdrop-blur-md ${positionClass}`}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
        Trips
      </p>

      <div className="space-y-1.5">
        {lists.map((list) => {
          const isSelected = selectedListId === list.id;
          const listColor = list.color ?? "#8b5cf6";

          return (
            <button
              key={list.id}
              type="button"
              onClick={() => onSelectList(list.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition ${
                isSelected
                  ? "bg-white/15 text-white ring-1"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
              //   style={{
              //     ringColor: isSelected ? listColor : undefined,
              //   }}
              title={list.name}
            >
              <span
                className={`h-3 w-3 shrink-0 rounded-full border ${
                  isSelected ? "border-white/70" : "border-white/30"
                }`}
                style={{ backgroundColor: listColor }}
              />

              <span className="min-w-0 flex-1 truncate">{list.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
