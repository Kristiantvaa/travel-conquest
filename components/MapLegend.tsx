import { ConquestList } from "@/types";

type MapLegendProps = {
  lists: ConquestList[];
  position?: "top-right" | "bottom-right";
};

export default function MapLegend({
  lists,
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

      <div className="space-y-2">
        {lists.map((list) => (
          <div key={list.id} className="flex items-center gap-2 text-xs">
            <span
              className="h-3 w-3 shrink-0 rounded-full border border-white/30"
              style={{ backgroundColor: list.color ?? "#8b5cf6" }}
            />

            <span className="truncate text-white/90">
              {list.icon ? `${list.icon} ` : ""}
              {list.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
