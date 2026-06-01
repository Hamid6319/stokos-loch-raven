"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  Flame,
  Layers3,
  Package,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  Sparkles,
  Tags,
} from "lucide-react";

import { useMenuCrud } from "./usemenucrud";
import type {
  Category,
  ModifierGroup,
  Product,
  TabType,
  UpsellRule,
} from "./types";

import ProductTable from "./components/producttable";
import CategoryTable from "./components/categorytable";
import ModifierGrid from "./components/modifiergrid";
import UpsellTable from "./components/upselltable";
import MenuModal from "./components/menumodel";

const tabs = [
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "modifiers", label: "Modifier Groups", icon: Settings2 },
  { id: "upsells", label: "Upsells", icon: Sparkles },
] as const;

type ModalState =
  | { type: "products"; item: Product | null }
  | { type: "categories"; item: Category | null }
  | { type: "modifiers"; item: ModifierGroup | null }
  | { type: "upsells"; item: UpsellRule | null }
  | null;

export default function MenuManagementClient() {
  const crud = useMenuCrud();

  const products = Array.isArray(crud.products) ? crud.products : [];
  const categories = Array.isArray(crud.categories) ? crud.categories : [];
  const modifierGroups = Array.isArray(crud.modifierGroups)
    ? crud.modifierGroups
    : [];
  const upsellRules = Array.isArray(crud.upsellRules) ? crud.upsellRules : [];

  const {
    isLoaded = true,

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
  } = crud;

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = product.name || "";
      const category = product.category || "";

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const activeProducts = products.filter(
    (product) => product.status === "Active"
  ).length;

  const activeUpsells = upsellRules.filter(
    (upsell) => upsell.status === "Active"
  ).length;

  const openAdd = (type: TabType) => {
    setActiveTab(type);

    if (type === "products") {
      setModal({ type: "products", item: null });
    }

    if (type === "categories") {
      setModal({ type: "categories", item: null });
    }

    if (type === "modifiers") {
      setModal({ type: "modifiers", item: null });
    }

    if (type === "upsells") {
      setModal({ type: "upsells", item: null });
    }
  };

const handleDelete = async (type: TabType, id: string) => {
  const ok = window.confirm("Are you sure you want to delete this?");
  if (!ok) return;

  try {
    if (type === "products") await deleteProduct(id);
    if (type === "categories") await deleteCategory(id);
    if (type === "modifiers") await deleteModifier(id);
    if (type === "upsells") await deleteUpsell(id);
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete item from database.");
  }
};

 const handleSave = async (
  value: Product | Category | ModifierGroup | UpsellRule
) => {
  if (!modal) return;

  try {
    if (modal.type === "products") {
      modal.item
        ? await updateProduct(value as Product)
        : await addProduct(value as Product);
    }

    if (modal.type === "categories") {
      modal.item
        ? await updateCategory(value as Category)
        : await addCategory(value as Category);
    }

    if (modal.type === "modifiers") {
      modal.item
        ? await updateModifier(value as ModifierGroup)
        : await addModifier(value as ModifierGroup);
    }

    if (modal.type === "upsells") {
      modal.item
        ? await updateUpsell(value as UpsellRule)
        : await addUpsell(value as UpsellRule);
    }

    setModal(null);
  } catch (error) {
    console.error("Save failed:", error);
    alert("Failed to save item in database.");
  }
};

  if (!mounted || !isLoaded) {
    return (
      <div className="w-full space-y-5">
        <section className="rounded-[30px] bg-[#146C38] p-6 text-white shadow-[0_18px_45px_rgba(15,63,36,0.25)] md:p-8">
          <p className="mb-4 w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/75">
            Menu Control
          </p>

          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            Menu Management
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
            Loading menu data...
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <section className="overflow-hidden rounded-[30px] bg-[#146C38] text-white shadow-[0_18px_45px_rgba(15,63,36,0.25)]">
        <div className="relative p-6 md:p-8">
          <p className="mb-4 w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/75">
            Menu Control
          </p>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight md:text-5xl">
                Menu Management
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
                Add, edit, update, and delete products, categories, modifier
                groups, and upsells.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openAdd("products")}
              className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-green-800 transition hover:bg-green-50"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={products.length}
          description={`${activeProducts} active products`}
          icon={<Package size={22} />}
        />

        <StatCard
          title="Categories"
          value={categories.length}
          description="Menu sections"
          icon={<Layers3 size={22} />}
        />

        <StatCard
          title="Modifier Groups"
          value={modifierGroups.length}
          description="Toppings, sauces, sizes"
          icon={<Settings2 size={22} />}
        />

        <StatCard
          title="Active Upsells"
          value={activeUpsells}
          description="Smart add-ons"
          icon={<Flame size={22} />}
        />
      </section>

      <section className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
                    isActive
                      ? "bg-green-800 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-green-50 hover:text-green-800"
                  }`}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {activeTab === "products" && (
              <>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products..."
                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none transition placeholder:text-zinc-400 focus:border-green-700 sm:w-[260px]"
                  />
                </div>

                <div className="relative">
            <select
  value={selectedCategory}
  onChange={(event) => setSelectedCategory(event.target.value)}
  className="h-12 w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 pr-10 text-sm font-black text-zinc-700 outline-none transition focus:border-green-700 sm:w-[220px]"
>
  <option value="All Categories">All Categories</option>

  {categories
    .filter((category) => category?.name)
    .map((category, index) => (
      <option
        key={category.id || `${category.name}-${index}`}
        value={category.name}
      >
        {category.name}
      </option>
    ))}
</select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => openAdd(activeTab)}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-800 px-5 text-sm font-black text-white transition hover:bg-green-900"
            >
              <Plus size={17} />
              Add {getLabel(activeTab)}
            </button>
          </div>
        </div>

        {activeTab === "products" && (
          <ProductTable
            products={filteredProducts}
            onEdit={(product) => setModal({ type: "products", item: product })}
            onDelete={(id) => handleDelete("products", id)}
          />
        )}

        {activeTab === "categories" && (
          <CategoryTable
            categories={categories}
            products={products}
            onEdit={(category) =>
              setModal({ type: "categories", item: category })
            }
            onDelete={(id) => handleDelete("categories", id)}
          />
        )}

        {activeTab === "modifiers" && (
          <ModifierGrid
            modifierGroups={modifierGroups}
            onEdit={(modifier) =>
              setModal({ type: "modifiers", item: modifier })
            }
            onDelete={(id) => handleDelete("modifiers", id)}
          />
        )}

        {activeTab === "upsells" && (
          <UpsellTable
            upsellRules={upsellRules}
            onEdit={(upsell) => setModal({ type: "upsells", item: upsell })}
            onDelete={(id) => handleDelete("upsells", id)}
          />
        )}
      </section>

      {modal && (
        <MenuModal
         key={`${modal.type}-${(modal.item as any)?._id || modal.item?.id || "new"}`}
          type={modal.type}
          item={modal.item}
          categories={categories}
          modifierGroups={modifierGroups}
          upsellRules={upsellRules}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-800">
        {icon}
      </div>

      <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black text-zinc-950">{value}</p>

      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </div>
  );
}

function getLabel(tab: TabType) {
  if (tab === "products") return "Product";
  if (tab === "categories") return "Category";
  if (tab === "modifiers") return "Modifier Group";
  return "Upsell";
}