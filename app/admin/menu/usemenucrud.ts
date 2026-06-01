"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category, ModifierGroup, Product, UpsellRule } from "./types";

type MenuEntity = "products" | "categories" | "modifier-groups" | "upsells";

/**
 * IMPORTANT:
 * If your route folder is:
 * app/api/admin/menu/upsells/route.ts
 * keep upsells: "upsells"
 *
 * If your route folder is:
 * app/api/admin/menu/upsell-rules/route.ts
 * change upsells: "upsell-rules"
 */
const API_ROUTES: Record<MenuEntity, string> = {
  products: "products",
  categories: "categories",
  "modifier-groups": "modifier-groups",
  upsells: "upsells",
};

type MongoItem = {
  _id?: string;
  id?: string;
};

function getMongoId(item: unknown): string {
  if (!item || typeof item !== "object") return "";

  const obj = item as MongoItem;
  return String(obj._id || obj.id || "");
}

function isSameMongoItem(a: unknown, b: unknown): boolean {
  const aId = getMongoId(a);
  const bId = getMongoId(b);

  return Boolean(aId && bId && aId === bId);
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function getArrayFromResponse<T>(json: any): T[] {
  return safeArray<T>(
    json?.data ||
      json?.items ||
      json?.products ||
      json?.categories ||
      json?.modifierGroups ||
      json?.upsellRules
  );
}

function getItemFromResponse<T>(json: any): T {
  return (json?.data || json?.item) as T;
}

function getApiUrl(type: MenuEntity) {
  return `/api/admin/menu/${API_ROUTES[type]}`;
}

/**
 * Silent GET:
 * Empty DB, failed endpoint, or missing collection will return []
 * No alert
 * No console.error
 * No frontend crash
 */
async function apiGet<T>(type: MenuEntity): Promise<T[]> {
  try {
    const res = await fetch(getApiUrl(type), {
      method: "GET",
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || json?.success === false) {
      return [];
    }

    return getArrayFromResponse<T>(json);
  } catch {
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

  return getItemFromResponse<T>(json);
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

  return getItemFromResponse<T>(json);
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

export function useMenuCrud() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [upsellRules, setUpsellRules] = useState<UpsellRule[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadMenu = useCallback(async () => {
    setIsLoaded(false);

    const [productsData, categoriesData, modifiersData, upsellsData] =
      await Promise.all([
        apiGet<Product>("products"),
        apiGet<Category>("categories"),
        apiGet<ModifierGroup>("modifier-groups"),
        apiGet<UpsellRule>("upsells"),
      ]);

    setProducts(productsData);
    setCategories(sortBySortOrder(categoriesData));
    setModifierGroups(modifiersData);
    setUpsellRules(upsellsData);

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const addProduct = async (product: Product) => {
    const created = await apiCreate<Product>("products", {
      ...product,
      price: Number(product.price || 0),
      image: product.image || "",
      modifierGroups: Array.isArray(product.modifierGroups)
        ? product.modifierGroups
        : [],
      relatedUpsells: Array.isArray((product as any).relatedUpsells)
        ? (product as any).relatedUpsells
        : [],
      updatedAt: "Today",
    } as Product);

    setProducts((prev) => [created, ...prev]);
  };

  const updateProduct = async (product: Product) => {
    const updated = await apiUpdate<Product>("products", {
      ...product,
      price: Number(product.price || 0),
      image: product.image || "",
      modifierGroups: Array.isArray(product.modifierGroups)
        ? product.modifierGroups
        : [],
      relatedUpsells: Array.isArray((product as any).relatedUpsells)
        ? (product as any).relatedUpsells
        : [],
      updatedAt: "Today",
    } as Product);

    setProducts((prev) =>
      prev.map((item) => (isSameMongoItem(item, updated) ? updated : item))
    );
  };

  const deleteProduct = async (id: string) => {
    await apiDelete("products", id);

    setProducts((prev) =>
      prev.filter((item) => getMongoId(item) !== String(id))
    );
  };

  const addCategory = async (category: Category) => {
    const created = await apiCreate<Category>("categories", {
      ...category,
      sortOrder: Number(category.sortOrder || categories.length + 1),
    });

    setCategories((prev) => sortBySortOrder([...prev, created]));
  };

  const updateCategory = async (category: Category) => {
    const updated = await apiUpdate<Category>("categories", {
      ...category,
      sortOrder: Number(category.sortOrder || 1),
    });

    setCategories((prev) =>
      sortBySortOrder(
        prev.map((item) => (isSameMongoItem(item, updated) ? updated : item))
      )
    );
  };

  const deleteCategory = async (id: string) => {
    await apiDelete("categories", id);

    setCategories((prev) =>
      prev.filter((item) => getMongoId(item) !== String(id))
    );
  };

  const addModifier = async (modifier: ModifierGroup) => {
    const created = await apiCreate<ModifierGroup>("modifier-groups", {
      ...modifier,
      options: Array.isArray(modifier.options) ? modifier.options : [],
    });

    setModifierGroups((prev) => [created, ...prev]);
  };


const updateModifier = async (modifier: ModifierGroup) => {
  const updated = await apiUpdate<ModifierGroup>("modifier-groups", {
    ...modifier,
    options: Array.isArray(modifier.options) ? modifier.options : [],
  });

  setModifierGroups((prev) =>
    prev.map((item) => (isSameMongoItem(item, updated) ? updated : item))
  );
};

const deleteModifier = async (id: string) => {
  await apiDelete("modifier-groups", id);

  setModifierGroups((prev) =>
    prev.filter((item) => getMongoId(item) !== String(id))
  );
};




  const addUpsell = async (upsell: UpsellRule) => {
    const created = await apiCreate<UpsellRule>("upsells", {
      ...upsell,
      image: upsell.image || "",
      appliesToCategories: Array.isArray((upsell as any).appliesToCategories)
        ? (upsell as any).appliesToCategories
        : [],
    } as UpsellRule);

    setUpsellRules((prev) => [created, ...prev]);
  };
const updateUpsell = async (upsell: UpsellRule) => {
  const updated = await apiUpdate<UpsellRule>("upsells", {
    ...upsell,
    image: upsell.image || "",
    appliesToCategories: Array.isArray((upsell as any).appliesToCategories)
      ? (upsell as any).appliesToCategories
      : [],
  } as UpsellRule);

  setUpsellRules((prev) =>
    prev.map((item) => (isSameMongoItem(item, updated) ? updated : item))
  );
};

const deleteUpsell = async (id: string) => {
  await apiDelete("upsells", id);

  setUpsellRules((prev) =>
    prev.filter((item) => getMongoId(item) !== String(id))
  );
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