"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type {
  Category,
  ModifierGroup,
  Product,
  TabType,
  UpsellRule,
} from "../types";

import BaseMenuModal from "../../adminmenumodel/basemenumodal";
import ProductForm, { type ProductFormRef } from "../../forms/productform";
import CategoryForm, { type CategoryFormRef } from "../../forms/categoryform";
import ModifierGroupForm, {
  type ModifierGroupFormRef,
} from "../../forms/modifiergroupform";
import UpsellForm, { type UpsellFormRef } from "../../forms/upsellform";
import { getMenuModalLabel } from "../../utils/menuhelpers";

type ModalItem = Product | Category | ModifierGroup | UpsellRule | null;

type StoreItem = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  location?: string;
  phone?: string;
  openingHours?: string;
  status?: string;
};

type CategorySaveValue = Category & {
  storeIds?: string[];
};

type SaveValue = Product | CategorySaveValue | ModifierGroup | UpsellRule;

export default function MenuModal({
  stores = [],
  type,
  item,
  categories,
  modifierGroups,
  upsellRules = [],
  onClose,
  onSave,
}: {
  stores?: StoreItem[];
  type: TabType;
  item: ModalItem;
  categories: Category[];
  modifierGroups: ModifierGroup[];
  upsellRules?: UpsellRule[];
  onClose: () => void;
  onSave: (value: SaveValue) => void;
}) {
  const productRef = useRef<ProductFormRef>(null);
  const categoryRef = useRef<CategoryFormRef>(null);
  const modifierRef = useRef<ModifierGroupFormRef>(null);
  const upsellRef = useRef<UpsellFormRef>(null);

  const isEdit = Boolean(item);
  const label = getMenuModalLabel(type);

  const isCategory = type === "categories";
  const isCategoryAdd = isCategory && !isEdit;
  const isCategoryEdit = isCategory && isEdit;

  const storeOptions = useMemo(() => {
    return stores
      .map((store) => ({
        ...store,
        value: getStoreValue(store),
      }))
      .filter((store) => store.value);
  }, [stores]);

  const firstStoreId = useMemo(() => {
    return storeOptions[0]?.value || "";
  }, [storeOptions]);

  const itemStoreId = useMemo(() => {
    return getItemStoreId(item);
  }, [item]);

  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);

  useEffect(() => {
    const nextSingleStore = itemStoreId || firstStoreId || "";

    setSelectedStoreId(nextSingleStore);

    if (isCategoryAdd) {
      setSelectedStoreIds(storeOptions.map((store) => store.value));
      return;
    }

    setSelectedStoreIds(nextSingleStore ? [nextSingleStore] : []);
  }, [itemStoreId, firstStoreId, storeOptions, isCategoryAdd]);

  const lockedCategoryStoreName = useMemo(() => {
    if (!itemStoreId) return "No Store";

    const foundStore = storeOptions.find((store) => {
      return isSameStore(store, itemStoreId);
    });

    return foundStore?.name || itemStoreId;
  }, [itemStoreId, storeOptions]);

  const selectedStoreCategories = useMemo(() => {
    if (!selectedStoreId) return [];

    const filtered = categories.filter((category) => {
      return isItemInSelectedStore(category, selectedStoreId, storeOptions);
    });

    return dedupeCategoriesForSelect(filtered);
  }, [categories, selectedStoreId, storeOptions]);

  const selectedStoreModifierGroups = useMemo(() => {
    if (!selectedStoreId) return [];

    return modifierGroups.filter((modifier) => {
      return isItemInSelectedStore(modifier, selectedStoreId, storeOptions);
    });
  }, [modifierGroups, selectedStoreId, storeOptions]);

  const selectedStoreUpsellRules = useMemo(() => {
    if (!selectedStoreId) return [];

    return upsellRules.filter((upsell) => {
      return isItemInSelectedStore(upsell, selectedStoreId, storeOptions);
    });
  }, [upsellRules, selectedStoreId, storeOptions]);

  const toggleStore = (storeId: string) => {
    setSelectedStoreIds((prev) => {
      if (prev.includes(storeId)) {
        return prev.filter((id) => id !== storeId);
      }

      return [...prev, storeId];
    });
  };

  const toggleAllStores = () => {
    const allStoreIds = storeOptions.map((store) => store.value);

    setSelectedStoreIds((prev) => {
      if (prev.length === allStoreIds.length) return [];
      return allStoreIds;
    });
  };

  const handleFormSave = (value: SaveValue) => {
    if (isCategoryAdd) {
      if (!selectedStoreIds.length) {
        alert("Please select at least one store.");
        return;
      }

      const categoryValue = value as Category;

      const payload: CategorySaveValue = {
        ...categoryValue,
        storeId: categoryValue.storeId || selectedStoreIds[0],
        storeIds: selectedStoreIds,
      };

      onSave(payload);
      return;
    }

    if (isCategoryEdit) {
      const lockedStoreId = itemStoreId || selectedStoreId;

      if (!lockedStoreId) {
        alert("Category store is missing.");
        return;
      }

      const payload = {
        ...(value as object),
        storeId: lockedStoreId,
      } as Category & { storeIds?: string[] };

      delete payload.storeIds;

      onSave(payload);
      return;
    }

    if (!selectedStoreId) {
      alert("Please select a store first.");
      return;
    }

    onSave({
      ...(value as object),
      storeId: selectedStoreId,
    } as SaveValue);
  };

  const handleSave = () => {
    if (isCategoryAdd) {
      if (!selectedStoreIds.length) {
        alert("Please select at least one store.");
        return;
      }

      categoryRef.current?.submit();
      return;
    }

    if (isCategoryEdit) {
      if (!itemStoreId && !selectedStoreId) {
        alert("Category store is missing.");
        return;
      }

      categoryRef.current?.submit();
      return;
    }

    if (!selectedStoreId) {
      alert("Please select a store first.");
      return;
    }

    if (type === "products" && selectedStoreCategories.length === 0) {
      alert("No categories found for this store. Please add category first.");
      return;
    }

    if (type === "products") productRef.current?.submit();
    if (type === "modifiers") modifierRef.current?.submit();
    if (type === "upsells") upsellRef.current?.submit();
  };

  return (
    <BaseMenuModal
      title={`${isEdit ? "Edit" : "Add"} ${label}`}
      subtitle={isEdit ? "Update details" : "Create new item"}
      isEdit={isEdit}
      onClose={onClose}
      onSave={handleSave}
    >
      <div className="mb-5 rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <label className="block text-xs font-black uppercase tracking-wide text-zinc-500">
            {isCategoryAdd
              ? "Apply Category To Stores *"
              : isCategoryEdit
              ? "Store"
              : "Select Store *"}
          </label>

          {isCategoryAdd && storeOptions.length > 0 && (
            <button
              type="button"
              onClick={toggleAllStores}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-green-800 ring-1 ring-zinc-200 transition hover:bg-green-50"
            >
              {selectedStoreIds.length === storeOptions.length
                ? "Unselect All"
                : "Select All"}
            </button>
          )}
        </div>

        {isCategoryAdd && (
          <div className="grid gap-2 sm:grid-cols-3">
            {storeOptions.map((store) => {
              const checked = selectedStoreIds.includes(store.value);

              return (
                <button
                  key={store.value}
                  type="button"
                  onClick={() => toggleStore(store.value)}
                  className={[
                    "rounded-2xl border px-4 py-3 text-left text-sm font-black transition",
                    checked
                      ? "border-green-700 bg-green-50 text-green-900"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-md border text-xs",
                        checked
                          ? "border-green-700 bg-green-700 text-white"
                          : "border-zinc-300 bg-white text-transparent",
                      ].join(" ")}
                    >
                      ✓
                    </span>

                    {store.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {isCategoryEdit && (
          <div>
            <div className="inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-800 ring-1 ring-green-100">
              {lockedCategoryStoreName}
            </div>

            <p className="mt-2 text-xs font-semibold text-zinc-500">
              Store cannot be changed while editing a category.
            </p>
          </div>
        )}

        {!isCategory && (
          <select
            value={selectedStoreId}
            onChange={(event) => setSelectedStoreId(event.target.value)}
            className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-900 outline-none transition focus:border-green-700"
          >
            <option value="">Select Store</option>

            {storeOptions.map((store) => (
              <option key={store.value} value={store.value}>
                {store.name}
              </option>
            ))}
          </select>
        )}

        {stores.length === 0 && (
          <p className="mt-2 text-xs font-bold text-red-600">
            No stores found. Please add store first.
          </p>
        )}

        {type === "products" &&
          selectedStoreId &&
          selectedStoreCategories.length === 0 && (
            <p className="mt-2 text-xs font-bold text-red-600">
              No categories found for this store. Please add category for this
              store first.
            </p>
          )}
      </div>

      {type === "products" && (
        <ProductForm
          key={`product-form-${selectedStoreId}-${getSafeId(item) || "new"}`}
          ref={productRef}
          item={item as Product | null}
          categories={selectedStoreCategories}
          modifierGroups={selectedStoreModifierGroups}
          upsellRules={selectedStoreUpsellRules}
          onSave={handleFormSave}
        />
      )}

      {type === "categories" && (
        <CategoryForm
          ref={categoryRef}
          item={item as Category | null}
          categories={selectedStoreCategories}
          onSave={handleFormSave}
        />
      )}

      {type === "modifiers" && (
        <ModifierGroupForm
          key={`modifier-form-${selectedStoreId}-${getSafeId(item) || "new"}`}
          ref={modifierRef}
          item={item as ModifierGroup | null}
          categories={selectedStoreCategories}
          onSave={handleFormSave}
        />
      )}

      {type === "upsells" && (
        <UpsellForm
          key={`upsell-form-${selectedStoreId}-${getSafeId(item) || "new"}`}
          ref={upsellRef}
          item={item as UpsellRule | null}
          categories={selectedStoreCategories}
          onSave={handleFormSave}
        />
      )}
    </BaseMenuModal>
  );
}

function getStoreValue(store: StoreItem) {
  return String(store.slug || store._id || store.id || "").trim();
}

function getSafeId(item: unknown) {
  if (!item || typeof item !== "object") return "";

  const obj = item as {
    _id?: string;
    id?: string;
    slug?: string;
    name?: string;
    offer?: string;
  };

  return String(obj._id || obj.id || obj.slug || obj.name || obj.offer || "");
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
    const obj = value as {
      _id?: string;
      id?: string;
      slug?: string;
      name?: string;
    };

    return String(obj.slug || obj._id || obj.id || obj.name || "").trim();
  }

  return "";
}

function isSameStore(store: StoreItem, value: string) {
  const cleanValue = String(value || "").trim();

  return [
    store.slug,
    store._id,
    store.id,
    store.name,
    getStoreValue(store),
  ]
    .filter(Boolean)
    .map((item) => String(item).trim())
    .includes(cleanValue);
}

function isItemInSelectedStore(
  item: unknown,
  selectedStoreId: string,
  storeOptions: Array<StoreItem & { value: string }>
) {
  const itemStoreId = getItemStoreId(item);

  if (!itemStoreId) return false;

  if (itemStoreId === selectedStoreId) return true;

  const selectedStore = storeOptions.find((store) => {
    return isSameStore(store, selectedStoreId);
  });

  if (!selectedStore) return false;

  return isSameStore(selectedStore, itemStoreId);
}

function dedupeCategoriesForSelect(categories: Category[]) {
  const seen = new Set<string>();

  return categories.filter((category) => {
    const name = String(category.name || "").trim().toLowerCase();
    const storeId = getItemStoreId(category);
    const categoryId = getSafeId(category);

    const key = `${storeId}-${name || categoryId}`;

    if (!name) return false;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}