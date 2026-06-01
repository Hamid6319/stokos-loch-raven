"use client";

import type { ModifierGroup } from "../types";
import { ActionButtons, EmptyBox } from "./ui";

type MongoModifierGroup = ModifierGroup & {
  _id?: string;
  id?: string;
};

function getModifierId(group: MongoModifierGroup, fallback: string) {
  return String(group._id || group.id || fallback);
}

export default function ModifierGrid({
  modifierGroups,
  onEdit,
  onDelete,
}: {
  modifierGroups: ModifierGroup[];
  onEdit: (modifier: ModifierGroup) => void;
  onDelete: (id: string) => void;
}) {
  const safeModifierGroups = Array.isArray(modifierGroups)
    ? (modifierGroups as MongoModifierGroup[])
    : [];

  if (!safeModifierGroups.length) {
    return <EmptyBox message="No modifier groups found." />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {safeModifierGroups.map((group, index) => {
        const groupId = getModifierId(group, `${group.name}-${index}`);

        return (
          <div
            key={groupId}
            className="rounded-[26px] border border-zinc-200 bg-white p-5 transition hover:border-green-300 hover:shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-black text-zinc-950">{group.name}</p>
                <p className="mt-1 text-xs font-semibold text-zinc-500">
                  Applies to: {group.appliesTo || "Not selected"}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  group.required
                    ? "bg-green-800 text-white"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {group.required ? "Required" : "Optional"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {Array.isArray(group.options) && group.options.length ? (
                group.options.map((option, optionIndex) => (
                  <span
                    key={`${groupId}-${option}-${optionIndex}`}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-black text-zinc-700"
                  >
                    {option}
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-zinc-400">
                  No options
                </span>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
              <p className="text-xs font-black uppercase tracking-wide text-zinc-400">
                {Array.isArray(group.options) ? group.options.length : 0} options
              </p>

              <ActionButtons
                onEdit={() => onEdit(group)}
                onDelete={() => onDelete(groupId)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}