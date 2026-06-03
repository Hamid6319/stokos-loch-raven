"use client";

import type { Category, Product } from "../types";
import { ActionButtons, EmptyBox, ImageBox, StatusBadge, TableHead } from "./ui";

type StoreItem = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
};

type MongoObject = {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  offer?: string;
  slug?: string;
};

function getItemId(item: unknown, fallback: string) {
  if (typeof item === "object" && item !== null) {
    const obj = item as MongoObject;
    return String(obj._id || obj.id || obj.slug || fallback);
  }

  return fallback;
}

function getTextValue(value: unknown, fallback = "Not selected") {
  if (!value) return fallback;

  if (typeof value === "string") return value.trim();

  if (typeof value === "number") return String(value);

  if (typeof value === "object") {
    const obj = value as MongoObject;

    return String(
      obj.name || obj.title || obj.offer || obj.slug || obj._id || obj.id || fallback
    ).trim();
  }

  return fallback;
}

function normalizeValue(value: unknown) {
  return getTextValue(value, "").trim().toLowerCase();
}

function getStoreVariants(store: StoreItem) {
  return [store.slug, store._id, store.id, store.name]
    .filter(Boolean)
    .map((value) => String(value).trim());
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

function isSameStore(
  firstStoreId: string,
  secondStoreId: string,
  stores: StoreItem[]
) {
  if (!firstStoreId || !secondStoreId) return false;

  if (firstStoreId === secondStoreId) return true;

  return stores.some((store) => {
    const variants = getStoreVariants(store);

    return variants.includes(firstStoreId) && variants.includes(secondStoreId);
  });
}

function getStoreName(stores: StoreItem[], item: unknown) {
  const storeId = getItemStoreId(item);

  if (!storeId) return "No Store";

  const foundStore = stores.find((store) => {
    const variants = getStoreVariants(store);
    return variants.includes(storeId);
  });

  return foundStore?.name || storeId;
}

function categoryMatchesValue(category: Category, value: string) {
  if (!value) return false;

  const categoryObj = category as Category & {
    _id?: string;
    id?: string;
    slug?: string;
  };

  const categoryValues = [
    categoryObj._id,
    categoryObj.id,
    categoryObj.name,
    categoryObj.slug,
  ]
    .map((item) => normalizeValue(item))
    .filter(Boolean);

  return categoryValues.includes(value);
}

function getProductCategoryName(
  categories: Category[],
  product: Product,
  stores: StoreItem[]
) {
  const productObj = product as Product & {
    category?: unknown;
    categoryId?: unknown;
    categoryName?: unknown;
    categorySlug?: unknown;
  };

  const directCategoryName = String(productObj.categoryName || "").trim();

  if (directCategoryName) {
    return directCategoryName;
  }

  const productStoreId = getItemStoreId(product);

  const productCategoryValues = [
    productObj.categoryId,
    productObj.category,
    productObj.categorySlug,
  ]
    .map((item) => normalizeValue(item))
    .filter(Boolean);

  const fallbackCategory =
    getTextValue(productObj.categoryName, "") ||
    getTextValue(productObj.category, "") ||
    getTextValue(productObj.categoryId, "No Category");

  const sameStoreCategory = categories.find((category) => {
    const categoryStoreId = getItemStoreId(category);

    const matchesCategory = productCategoryValues.some((value) =>
      categoryMatchesValue(category, value)
    );

    const matchesStore =
      !productStoreId ||
      !categoryStoreId ||
      isSameStore(productStoreId, categoryStoreId, stores);

    return matchesCategory && matchesStore;
  });

  if (sameStoreCategory?.name) return sameStoreCategory.name;

  const anyCategory = categories.find((category) =>
    productCategoryValues.some((value) => categoryMatchesValue(category, value))
  );

  return anyCategory?.name || fallbackCategory;
}

export default function ProductTable({
  products,
  categories = [],
  stores = [],
  onEdit,
  onDelete,
}: {
  products: Product[];
  categories?: Category[];
  stores?: StoreItem[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  if (!products.length) return <EmptyBox message="No products found." />;

  return (
    <div className="overflow-hidden rounded-[26px] border border-zinc-200">
      <div className="border-b border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-lg font-black">Products</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Manage menu items, pricing, images, categories, and modifiers.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] text-left">
          <thead className="border-b border-zinc-200 bg-white">
            <tr>
              <TableHead>Product</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Modifiers</TableHead>
              <TableHead>Upsell</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {products.map((product, index) => {
              const productId = getItemId(
                product,
                `${product.name || "product"}-${index}`
              );

              const categoryName = getProductCategoryName(
                categories,
                product,
                stores
              );

              const storeName = getStoreName(stores, product);

              const upsellName = getTextValue(
                (product as Product & { upsell?: unknown }).upsell,
                "No upsell"
              );

              const modifierGroups = Array.isArray(product.modifierGroups)
                ? product.modifierGroups
                : [];

              return (
                <tr key={productId} className="transition hover:bg-green-50/50">
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <ImageBox src={product.image} alt={product.name} />

                      <div>
                        <p className="font-black text-zinc-950">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-zinc-500">
                          {categoryName}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-800">
                      {storeName}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-black text-zinc-700">
                      {categoryName}
                    </span>
                  </td>

                  <td className="px-5 py-5 text-sm font-black">
                    ${Number(product.price || 0).toFixed(2)}
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex max-w-[280px] flex-wrap gap-2">
                      {modifierGroups.length ? (
                        modifierGroups.map((group, groupIndex) => {
                          const groupLabel = getTextValue(
                            group,
                            "Modifier Group"
                          );

                          const groupId = getItemId(
                            group,
                            `${groupLabel}-${groupIndex}`
                          );

                          return (
                            <span
                              key={groupId}
                              className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-black text-green-800"
                            >
                              {groupLabel}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs font-semibold text-zinc-400">
                          No modifiers
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-5 text-sm font-semibold text-zinc-600">
                    {upsellName}
                  </td>

                  <td className="px-5 py-5">
                    <StatusBadge status={product.status || "Active"} />
                  </td>

                  <td className="px-5 py-5">
                    <ActionButtons
                      onEdit={() => onEdit(product)}
                      onDelete={() => onDelete(productId)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}