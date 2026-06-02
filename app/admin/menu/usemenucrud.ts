"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Category, ModifierGroup, Product, UpsellRule } from "./types";

type MenuEntity = "products" | "categories" | "modifier-groups" | "upsells";

const API_ROUTES: Record<MenuEntity, string> = {
  products: "products",
  categories: "categories",
  "modifier-groups": "modifier-groups",
  upsells: "upsells",
};

const RESPONSE_KEYS: Record<MenuEntity, string[]> = {
  products: ["product", "products"],
  categories: ["category", "categories"],
  "modifier-groups": ["modifierGroup", "modifierGroups", "modifier", "modifiers"],
  upsells: ["upsellRule", "upsellRules", "upsell", "upsells"],
};

type MongoItem = {
  _id?: string;
  id?: string;
  slug?: string;
  name?: string;
  offer?: string;
};

type CategoryWithMultiStore = Category & {
  storeId?: string;
  storeIds?: string[];
};

function getMongoId(item: unknown): string {
  if (!item || typeof item !== "object") return "";

  const obj = item as MongoItem;

  return String(obj._id || obj.id || obj.slug || obj.name || obj.offer || "");
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function getArrayFromResponse<T>(json: any, type: MenuEntity): T[] {
  const keys = ["items", ...RESPONSE_KEYS[type]];

  const sources = [
    json,
    json?.data,
    json?.result,
    json?.payload,
    json?.data?.data,
    json?.result?.data,
    json?.payload?.data,
  ];

  for (const source of sources) {
    if (Array.isArray(source)) return source as T[];

    if (source && typeof source === "object") {
      for (const key of keys) {
        if (Array.isArray(source[key])) {
          return source[key] as T[];
        }
      }
    }
  }

  return [];
}

function getItemFromResponse<T>(json: any, type: MenuEntity, fallback: T): T {
  const keys = ["item", ...RESPONSE_KEYS[type]];

  const sources = [
    json?.data,
    json?.result,
    json?.payload,
    json,
    json?.data?.data,
    json?.result?.data,
    json?.payload?.data,
  ];

  for (const source of sources) {
    if (!source) continue;

    if (Array.isArray(source)) {
      return {
        ...(fallback as object),
        ...(source[0] as object),
      } as T;
    }

    if (typeof source === "object") {
      for (const key of keys) {
        if (source[key]) {
          const item = Array.isArray(source[key]) ? source[key][0] : source[key];

          return {
            ...(fallback as object),
            ...(item as object),
          } as T;
        }
      }

      if (source._id || source.id || source.slug) {
        return {
          ...(fallback as object),
          ...(source as object),
        } as T;
      }
    }
  }

  return fallback;
}

function getApiUrl(type: MenuEntity) {
  return `/api/admin/menu/${API_ROUTES[type]}`;
}

async function apiGet<T>(type: MenuEntity): Promise<T[]> {
  try {
    const res = await fetch(`${getApiUrl(type)}?t=${Date.now()}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || json?.success === false) {
      console.error(`Failed to load ${type}`, json);
      return [];
    }

    return getArrayFromResponse<T>(json, type);
  } catch (error) {
    console.error(`Failed to load ${type}`, error);
    return [];
  }
}

async function apiCreate<T>(type: MenuEntity, payload: T): Promise<T> {
  const res = await fetch(getApiUrl(type), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || `Failed to create ${type}`);
  }

  return getItemFromResponse<T>(json, type, payload);
}

async function apiUpdate<T extends object>(
  type: MenuEntity,
  payload: T
): Promise<T> {
  const mongoId = getMongoId(payload);

  if (!mongoId) {
    throw new Error(`Missing MongoDB ID for ${type} update`);
  }

  const res = await fetch(getApiUrl(type), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      id: mongoId,
      _id: mongoId,
    }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || `Failed to update ${type}`);
  }

  return getItemFromResponse<T>(json, type, payload);
}

async function apiDelete(type: MenuEntity, id: string): Promise<void> {
  if (!id) {
    throw new Error(`Missing MongoDB ID for ${type} delete`);
  }

  const res = await fetch(`${getApiUrl(type)}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || `Failed to delete ${type}`);
  }
}

function sortBySortOrder<T extends { sortOrder?: number }>(items: T[]) {
  return [...items].sort(
    (a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
  );
}

function addTempId<T extends object>(item: T, tempId: string): T {
  const obj = item as MongoItem;

  if (obj._id || obj.id) return item;

  return {
    ...item,
    id: tempId,
  } as T;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    storeId: String(product.storeId || "").trim(),
    category: String(product.category || product.categoryId || "").trim(),
    categoryId: product.categoryId
      ? String(product.categoryId).trim()
      : String(product.category || "").trim(),
    price: Number(product.price || 0),
    image: product.image || "",
    modifierGroups: safeArray((product as any).modifierGroups),
    relatedUpsells: safeArray((product as any).relatedUpsells),
    status: product.status || "Active",
    updatedAt: product.updatedAt || "Today",
  } as Product;
}

function normalizeCategory(
  category: CategoryWithMultiStore
): CategoryWithMultiStore {
  return {
    ...category,
    storeId: String(category.storeId || "").trim(),
    sortOrder: Number(category.sortOrder || 1),
  };
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

function getCategoryStoreId(category: unknown) {
  if (!category || typeof category !== "object") return "";

  const obj = category as {
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

function getNextCategorySortOrder(
  storeId: string,
  existingCategories: Category[],
  pendingCategories: Category[] = []
) {
  const allCategories = [...existingCategories, ...pendingCategories];

  const maxSortOrder = allCategories.reduce((max, category) => {
    const categoryStoreId = getCategoryStoreId(category);

    if (String(categoryStoreId) !== String(storeId)) return max;

    return Math.max(max, Number(category.sortOrder || 0));
  }, 0);

  return maxSortOrder + 1;
}

function normalizeModifier(modifier: ModifierGroup): ModifierGroup {
  return {
    ...modifier,
    options: Array.isArray(modifier.options) ? modifier.options : [],
  };
}

function normalizeUpsell(upsell: UpsellRule): UpsellRule {
  return {
    ...upsell,
    image: upsell.image || "",
    appliesToCategories: safeArray((upsell as any).appliesToCategories),
  } as UpsellRule;
}

function getEntityKey(item: unknown) {
  if (!item || typeof item !== "object") return "";

  const obj = item as {
    storeId?: unknown;
    name?: unknown;
    offer?: unknown;
    category?: unknown;
    categoryId?: unknown;
    price?: unknown;
    slug?: unknown;
  };

  const storeId = normalizeStoreValue(obj.storeId);
  const name = String(obj.name || obj.offer || "").trim().toLowerCase();
  const category = String(obj.categoryId || obj.category || "")
    .trim()
    .toLowerCase();
  const price = String(obj.price || "").trim();
  const slug = String(obj.slug || "").trim().toLowerCase();

  return [storeId, name, category, price, slug].filter(Boolean).join("|");
}

function replaceTempOrMerge<T extends object>(
  items: T[],
  savedItem: T,
  tempId: string
) {
  const savedId = getMongoId(savedItem);
  const savedKey = getEntityKey(savedItem);

  let replaced = false;

  const next = items.map((item) => {
    const itemId = getMongoId(item);
    const itemKey = getEntityKey(item);

    if (
      itemId === tempId ||
      (savedId && itemId === savedId) ||
      (savedKey && itemKey === savedKey)
    ) {
      replaced = true;

      return {
        ...(item as object),
        ...(savedItem as object),
      } as T;
    }

    return item;
  });

  if (!replaced) {
    return [savedItem, ...next];
  }

  return next;
}

function updateLocalItem<T extends object>(items: T[], savedItem: T) {
  const savedId = getMongoId(savedItem);
  const savedKey = getEntityKey(savedItem);

  return items.map((item) => {
    const itemId = getMongoId(item);
    const itemKey = getEntityKey(item);

    if (
      (savedId && itemId === savedId) ||
      (savedKey && itemKey === savedKey)
    ) {
      return {
        ...(item as object),
        ...(savedItem as object),
      } as T;
    }

    return item;
  });
}

export function useMenuCrud() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [upsellRules, setUpsellRules] = useState<UpsellRule[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const firstLoadDone = useRef(false);

  const loadMenu = useCallback(async () => {
    if (!firstLoadDone.current) {
      setIsLoaded(false);
    }

    const [productsData, categoriesData, modifiersData, upsellsData] =
      await Promise.all([
        apiGet<Product>("products"),
        apiGet<Category>("categories"),
        apiGet<ModifierGroup>("modifier-groups"),
        apiGet<UpsellRule>("upsells"),
      ]);

    setProducts(productsData.map(normalizeProduct));
    setCategories(sortBySortOrder(categoriesData.map(normalizeCategory) as Category[]));
    setModifierGroups(modifiersData.map(normalizeModifier));
    setUpsellRules(upsellsData.map(normalizeUpsell));

    firstLoadDone.current = true;
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const addProduct = async (product: Product) => {
    const tempId = `temp-product-${Date.now()}`;
    const payload = normalizeProduct(product);
    const optimisticProduct = addTempId(payload, tempId);

    setProducts((prev) => [optimisticProduct, ...prev]);

    try {
      const savedProduct = normalizeProduct(
        await apiCreate<Product>("products", payload)
      );

      setProducts((prev) => replaceTempOrMerge(prev, savedProduct, tempId));

      return savedProduct;
    } catch (error) {
      setProducts((prev) => prev.filter((item) => getMongoId(item) !== tempId));
      throw error;
    }
  };

  const updateProduct = async (product: Product) => {
    const payload = normalizeProduct(product);
    const productId = getMongoId(payload);
    const oldProducts = products;

    setProducts((prev) =>
      prev.map((item) => (getMongoId(item) === productId ? payload : item))
    );

    try {
      const savedProduct = normalizeProduct(
        await apiUpdate<Product>("products", payload)
      );

      setProducts((prev) => updateLocalItem(prev, savedProduct));

      return savedProduct;
    } catch (error) {
      setProducts(oldProducts);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    const oldProducts = products;

    setProducts((prev) =>
      prev.filter((item) => getMongoId(item) !== String(id))
    );

    try {
      await apiDelete("products", id);
    } catch (error) {
      setProducts(oldProducts);
      throw error;
    }
  };

  const addCategory = async (category: CategoryWithMultiStore) => {
    const storeIds = Array.isArray(category.storeIds)
      ? category.storeIds.filter(Boolean)
      : [];

    const targetStoreIds = Array.from(
      new Set(
        storeIds.length
          ? storeIds
          : ([category.storeId].filter(Boolean) as string[])
      )
    );

    if (!targetStoreIds.length) {
      throw new Error("Please select at least one store.");
    }

    const baseCategory = { ...category };
    delete baseCategory.storeIds;

    const categoryPayloads: Category[] = [];

    targetStoreIds.forEach((storeId) => {
      const nextSortOrder = getNextCategorySortOrder(
        storeId,
        categories,
        categoryPayloads
      );

      categoryPayloads.push(
        normalizeCategory({
          ...baseCategory,
          storeId,
          sortOrder: nextSortOrder,
        }) as Category
      );
    });

    const tempCategories = categoryPayloads.map((payload, index) => {
      const tempId = `temp-category-${Date.now()}-${index}`;
      return addTempId(payload, tempId) as Category;
    });

    setCategories((prev) => sortBySortOrder([...prev, ...tempCategories]));

    try {
      const savedCategories = await Promise.all(
        categoryPayloads.map(async (payload, index) => {
          const savedCategory = normalizeCategory(
            await apiCreate<Category>("categories", payload)
          ) as Category;

          const tempId = getMongoId(tempCategories[index]);

          setCategories((prev) =>
            sortBySortOrder(replaceTempOrMerge(prev, savedCategory, tempId))
          );

          return savedCategory;
        })
      );

      return savedCategories;
    } catch (error) {
      const tempIds = tempCategories.map((item) => getMongoId(item));

      setCategories((prev) =>
        prev.filter((item) => !tempIds.includes(getMongoId(item)))
      );

      throw error;
    }
  };

  const updateCategory = async (category: Category) => {
    const payload = normalizeCategory(category) as Category;
    const categoryId = getMongoId(payload);
    const oldCategories = categories;

    setCategories((prev) =>
      sortBySortOrder(
        prev.map((item) => (getMongoId(item) === categoryId ? payload : item))
      )
    );

    try {
      const savedCategory = normalizeCategory(
        await apiUpdate<Category>("categories", payload)
      ) as Category;

      setCategories((prev) =>
        sortBySortOrder(updateLocalItem(prev, savedCategory))
      );

      return savedCategory;
    } catch (error) {
      setCategories(oldCategories);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    const oldCategories = categories;

    setCategories((prev) =>
      prev.filter((item) => getMongoId(item) !== String(id))
    );

    try {
      await apiDelete("categories", id);
    } catch (error) {
      setCategories(oldCategories);
      throw error;
    }
  };

  const addModifier = async (modifier: ModifierGroup) => {
    const tempId = `temp-modifier-${Date.now()}`;
    const payload = normalizeModifier(modifier);
    const optimisticModifier = addTempId(payload, tempId);

    setModifierGroups((prev) => [optimisticModifier, ...prev]);

    try {
      const savedModifier = normalizeModifier(
        await apiCreate<ModifierGroup>("modifier-groups", payload)
      );

      setModifierGroups((prev) =>
        replaceTempOrMerge(prev, savedModifier, tempId)
      );

      return savedModifier;
    } catch (error) {
      setModifierGroups((prev) =>
        prev.filter((item) => getMongoId(item) !== tempId)
      );
      throw error;
    }
  };

  const updateModifier = async (modifier: ModifierGroup) => {
    const payload = normalizeModifier(modifier);
    const modifierId = getMongoId(payload);
    const oldModifierGroups = modifierGroups;

    setModifierGroups((prev) =>
      prev.map((item) => (getMongoId(item) === modifierId ? payload : item))
    );

    try {
      const savedModifier = normalizeModifier(
        await apiUpdate<ModifierGroup>("modifier-groups", payload)
      );

      setModifierGroups((prev) => updateLocalItem(prev, savedModifier));

      return savedModifier;
    } catch (error) {
      setModifierGroups(oldModifierGroups);
      throw error;
    }
  };

  const deleteModifier = async (id: string) => {
    const oldModifierGroups = modifierGroups;

    setModifierGroups((prev) =>
      prev.filter((item) => getMongoId(item) !== String(id))
    );

    try {
      await apiDelete("modifier-groups", id);
    } catch (error) {
      setModifierGroups(oldModifierGroups);
      throw error;
    }
  };

  const addUpsell = async (upsell: UpsellRule) => {
    const tempId = `temp-upsell-${Date.now()}`;
    const payload = normalizeUpsell(upsell);
    const optimisticUpsell = addTempId(payload, tempId);

    setUpsellRules((prev) => [optimisticUpsell, ...prev]);

    try {
      const savedUpsell = normalizeUpsell(
        await apiCreate<UpsellRule>("upsells", payload)
      );

      setUpsellRules((prev) => replaceTempOrMerge(prev, savedUpsell, tempId));

      return savedUpsell;
    } catch (error) {
      setUpsellRules((prev) =>
        prev.filter((item) => getMongoId(item) !== tempId)
      );
      throw error;
    }
  };

  const updateUpsell = async (upsell: UpsellRule) => {
    const payload = normalizeUpsell(upsell);
    const upsellId = getMongoId(payload);
    const oldUpsellRules = upsellRules;

    setUpsellRules((prev) =>
      prev.map((item) => (getMongoId(item) === upsellId ? payload : item))
    );

    try {
      const savedUpsell = normalizeUpsell(
        await apiUpdate<UpsellRule>("upsells", payload)
      );

      setUpsellRules((prev) => updateLocalItem(prev, savedUpsell));

      return savedUpsell;
    } catch (error) {
      setUpsellRules(oldUpsellRules);
      throw error;
    }
  };

  const deleteUpsell = async (id: string) => {
    const oldUpsellRules = upsellRules;

    setUpsellRules((prev) =>
      prev.filter((item) => getMongoId(item) !== String(id))
    );

    try {
      await apiDelete("upsells", id);
    } catch (error) {
      setUpsellRules(oldUpsellRules);
      throw error;
    }
  };

  return {
    isLoaded,

    products,
    categories,
    modifierGroups,
    upsellRules,

    addProduct,
    updateProduct,
    deleteProduct,

    addCategory,
    updateCategory,
    deleteCategory,

    addModifier,
    updateModifier,
    deleteModifier,

    addUpsell,
    updateUpsell,
    deleteUpsell,

    reloadMenu: loadMenu,
  };
}