// "use client";

// import { useState } from "react";
// import { Check, Pencil, X } from "lucide-react";
// import { ConquestList } from "@/types";
// import { updateConquestListDescription } from "@/lib/api";

// type ListPopUpProps = {
//   list: ConquestList;
//   onClose?: () => void;
//   onDescriptionUpdated?: (listId: string, description: string) => void;
//   legendPosition?: "top-right" | "bottom-right";
// };

// export default function ListPopUp({
//   list,
//   onClose,
//   onDescriptionUpdated,
//   legendPosition = "bottom-right",
// }: ListPopUpProps) {
//   const [isEditingDescription, setIsEditingDescription] = useState(false);
//   const [description, setDescription] = useState(list.description ?? "");
//   const [isSavingDescription, setIsSavingDescription] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const popupPositionClass =
//     legendPosition === "top-right" ? "left-4 top-4" : "bottom-4 left-4";

//   const listColor = list.color ?? "#8b5cf6";
//   const progressPercent = Math.round((list.statusProgress ?? 0) * 100);

//   async function handleSaveDescription() {
//     setIsSavingDescription(true);
//     setErrorMessage("");

//     try {
//       await updateConquestListDescription({
//         listId: list.id,
//         description,
//       });

//       onDescriptionUpdated?.(list.id, description);
//       setIsEditingDescription(false);
//     } catch (error) {
//       setErrorMessage(
//         error instanceof Error
//           ? error.message
//           : "Could not update description.",
//       );
//     } finally {
//       setIsSavingDescription(false);
//     }
//   }

//   function handleCancelEdit() {
//     setDescription(list.description ?? "");
//     setIsEditingDescription(false);
//     setErrorMessage("");
//   }

//   return (
//     <div
//       className={`pointer-events-auto absolute z-[1001] w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-slate-950/55 p-4 text-white shadow-xl backdrop-blur-md ${popupPositionClass}`}
//     >
//       <div className="mb-3 flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <div className="mb-1 flex items-center gap-2">
//             <span
//               className="h-3 w-3 shrink-0 rounded-full border border-white/30"
//               style={{ backgroundColor: listColor }}
//             />

//             <h3 className="truncate text-base font-semibold text-white">
//               {list.name}
//             </h3>
//           </div>

//           <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/55">
//             <span>Varighet: X dager</span>
//             <span>Lengde: Y km</span>
//           </div>
//         </div>

//         {onClose && (
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-full bg-white/10 p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white"
//             aria-label="Close list description"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         )}
//       </div>

//       <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
//         <div className="mb-2 flex items-center justify-between gap-2">
//           <p className="text-xs font-medium text-slate-300">Description</p>

//           {!isEditingDescription && (
//             <button
//               type="button"
//               onClick={() => setIsEditingDescription(true)}
//               className="rounded-full bg-white/10 p-1.5 text-white/65 transition hover:bg-white/20 hover:text-white"
//               aria-label="Edit description"
//             >
//               <Pencil className="h-3.5 w-3.5" />
//             </button>
//           )}
//         </div>

//         {isEditingDescription ? (
//           <div className="space-y-2">
//             <textarea
//               value={description}
//               onChange={(event) => setDescription(event.target.value)}
//               placeholder="Add a description..."
//               className="min-h-28 w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm leading-relaxed text-white outline-none placeholder:text-slate-500 focus:border-purple-400"
//             />

//             {errorMessage && (
//               <p className="rounded-xl bg-red-950/80 px-3 py-2 text-xs text-red-200">
//                 {errorMessage}
//               </p>
//             )}

//             <div className="flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={handleCancelEdit}
//                 disabled={isSavingDescription}
//                 className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/75 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={handleSaveDescription}
//                 disabled={isSavingDescription}
//                 className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 <Check className="h-3.5 w-3.5" />
//                 {isSavingDescription ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <p className="max-h-44 overflow-y-auto text-sm leading-relaxed text-slate-200">
//             {list.description || "No description added yet."}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { ConquestList } from "@/types";
import { updateConquestList } from "@/lib/api";

type ListPopUpProps = {
  list: ConquestList;
  onClose?: () => void;
  onListUpdated?: (updatedList: ConquestList) => void;
  legendPosition?: "top-right" | "bottom-right";
};

export default function ListPopUp({
  list,
  onClose,
  onListUpdated,
  legendPosition = "bottom-right",
}: ListPopUpProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(list.name ?? "");
  const [description, setDescription] = useState(list.description ?? "");
  const [durationDays, setDurationDays] = useState(
    list.duration?.toString() ?? "",
  );
  const [lengthKm, setLengthKm] = useState(list.length?.toString() ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setName(list.name ?? "");
    setDescription(list.description ?? "");
    setDurationDays(list.duration?.toString() ?? "");
    setLengthKm(list.length?.toString() ?? "");
    setIsEditing(false);
    setErrorMessage("");
  }, [list]);

  const popupPositionClass =
    legendPosition === "top-right" ? "left-4 top-4" : "bottom-4 left-4";

  const listColor = list.color ?? "#8b5cf6";

  async function handleSave() {
    setIsSaving(true);
    setErrorMessage("");

    try {
      const updatedList = await updateConquestList({
        listId: list.id,
        name: name.trim() || list.name,
        description,
        durationDays: durationDays.trim() ? Number(durationDays) : null,
        lengthKm: lengthKm.trim() ? Number(lengthKm) : null,
      });

      onListUpdated?.({
        ...list,
        ...updatedList,
        statusProgress: list.statusProgress,
      });

      setIsEditing(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not update list.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelEdit() {
    setName(list.name ?? "");
    setDescription(list.description ?? "");
    setDurationDays(list.duration?.toString() ?? "");
    setLengthKm(list.length?.toString() ?? "");
    setIsEditing(false);
    setErrorMessage("");
  }

  return (
    <div
      className={`pointer-events-auto absolute z-[1001] w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-slate-950/55 p-4 text-white shadow-xl backdrop-blur-md ${popupPositionClass}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full border border-white/30"
              style={{ backgroundColor: listColor }}
            />

            {isEditing ? (
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="List name"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-1.5 text-sm font-semibold text-white outline-none placeholder:text-slate-500 focus:border-purple-400"
              />
            ) : (
              <h3 className="truncate text-base font-semibold text-white">
                {list.name}
              </h3>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                value={durationDays}
                onChange={(event) => setDurationDays(event.target.value)}
                type="number"
                min="0"
                placeholder="Varighet"
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-purple-400"
              />

              <input
                value={lengthKm}
                onChange={(event) => setLengthKm(event.target.value)}
                type="number"
                min="0"
                step="0.1"
                placeholder="Lengde"
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-purple-400"
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/55">
              <span>
                Varighet:{" "}
                {list.duration != null ? `${list.duration} dager` : "X dager"}
              </span>
              <span>
                Lengde: {list.length != null ? `${list.length} km` : "Y km"}
              </span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-white/10 p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="Edit list"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="Close list description"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a description..."
              className="min-h-28 w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm leading-relaxed text-white outline-none placeholder:text-slate-500 focus:border-purple-400"
            />

            {errorMessage && (
              <p className="rounded-xl bg-red-950/80 px-3 py-2 text-xs text-red-200">
                {errorMessage}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/75 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check className="h-3.5 w-3.5" />
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <p className="max-h-44 overflow-y-auto text-sm leading-relaxed text-slate-200">
            {list.description || "No description added yet."}
          </p>
        )}
      </div>
    </div>
  );
}
