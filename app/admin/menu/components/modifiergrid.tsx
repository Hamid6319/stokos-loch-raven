"use client";

import type { ModifierGroup } from "../types";
import { ActionButtons, EmptyBox } from "./ui";

type StoreItem = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
};

type MongoModifierGroup = ModifierGroup & {
  _id?: string;
  id?: string;
  storeId?: unknown;
  storeSlug?: unknown;
  store?: unknown;
};

type MongoObject = {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
};

function getModifierId(group: MongoModifierGroup, fallback: string) {
  return String(group._id || group.id || fallback);
}

function getStoreValue(store: StoreItem) {
  return String(store.slug || store._id || store.id || "").trim();
}

function getItemStoreId(item: unknown) {
  if (!item || typeof item !== "object") return "";

  const obj = item as {
    storeId?: unknown;
    storeSlug?: unknown;
    store?: unknown;
  };

  return (
    normalizeStoreValue(obj.storeId) ||
    normalizeStoreValue(obj.storeSlug) ||
    normalizeStoreValue(obj.store)
  );
}

function normalizeStoreValue(value: unknown) {
  if (!value) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  if (typeof value === "object") {
    const obj = value as MongoObject;
    return String(obj.slug || obj._id || obj.id || obj.name || "").trim();
  }

  return "";
}

function getStoreName(stores: StoreItem[], item: unknown) {
  const storeId = getItemStoreId(item);

  if (!storeId) return "No Store";

  const foundStore = stores.find((store) => getStoreValue(store) === storeId);

  return foundStore?.name || storeId;
}

function getOptionLabel(option: unknown) {
  if (!option) return "";

  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }

  if (typeof option === "object") {
    const obj = option as {
      name?: string;
      label?: string;
      title?: string;
      value?: string;
      price?: number;
    };

    const label = obj.name || obj.label || obj.title || obj.value || "Option";

    return obj.price !== undefined ? `${label} - $${obj.price}` : label;
  }

  return "";
}

export default function ModifierGrid({
  modifierGroups,
  stores = [],
  onEdit,
  onDelete,
}: {
  modifierGroups: ModifierGroup[];
  stores?: StoreItem[];
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
        const storeName = getStoreName(stores, group);

        return (
          <div
            key={groupId}
            className="rounded-[26px] border border-zinc-200 bg-white p-5 transition hover:border-green-300 hover:shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-black text-zinc-950">{group.name}</p>

                <p className="mt-1 text-xs font-semibold text-zinc-500">
                  Store:{" "}
                  <span className="font-black text-green-800">
                    {storeName}
                  </span>
                </p>

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
    group.options.map((option, optionIndex) => {
      const optionLabel = getOptionLabel(option);

      return (
        <span
          key={`${groupId}-${optionLabel}-${optionIndex}`}
          className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-black text-zinc-700"
        >
          {optionLabel}
        </span>
      );
    })
  ) : (
    <span className="text-xs font-semibold text-zinc-400">
      No options
    </span>
  )}
</div>

            <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
              <p className="text-xs font-black uppercase tracking-wide text-zinc-400">
                {Array.isArray(group.options) ? group.options.length : 0}{" "}
                options
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