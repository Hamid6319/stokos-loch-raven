"use client";

import { useState, type ChangeEvent } from "react";
import type {
  Category,
  ModifierGroup,
  Product,
  ProductStatus,
  CategoryStatus,
  TabType,
  UpsellRule,
  UpsellStatus,
} from "../types";
import { FormInput, FormSelect, ImageBox } from "./ui";
import { Upload, Trash2, X } from "lucide-react";

type MongoItem = {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
  offer?: string;
};

type ProductWithUpsells = Product & {
  _id?: string;
  relatedUpsells?: string[];
};

type CategoryWithMongo = Category & {
  _id?: string;
};

type ModifierGroupWithMongo = ModifierGroup & {
  _id?: string;
};

type UpsellRuleWithCategories = UpsellRule & {
  _id?: string;
  name?: string;
  appliesToCategories?: string[];
};

type ModalItem = Product | Category | ModifierGroup | UpsellRule | null;

const getSafeId = (item: unknown, fallback: string) => {
  if (typeof item === "object" && item !== null) {
    const obj = item as MongoItem;
    return String(obj._id || obj.id || obj.slug || obj.name || obj.offer || fallback);
  }

  return fallback;
};

const getTextValue = (value: unknown, fallback = "") => {
  if (!value) return fallback;

  if (typeof value === "string") return value;

  if (typeof value === "number") return String(value);

  if (typeof value === "object") {
    const obj = value as MongoItem;
    return obj.name || obj.offer || obj.slug || fallback;
  }

  return fallback;
};

const normalizeStringArray = (values: unknown) => {
  if (!Array.isArray(values)) return [];

  return values
    .map((item) => getTextValue(item, ""))
    .filter(Boolean);
};

export default function MenuModal({
  type,
  item,
  categories,
  modifierGroups,
  upsellRules = [],
  onClose,
  onSave,
}: {
  type: TabType;
  item: ModalItem;
  categories: Category[];
  modifierGroups: ModifierGroup[];
  upsellRules?: UpsellRule[];
  onClose: () => void;
  onSave: (value: any) => void;
}) {
  const safeCategories = Array.isArray(categories)
    ? (categories as CategoryWithMongo[])
    : [];

  const safeModifierGroups = Array.isArray(modifierGroups)
    ? (modifierGroups as ModifierGroupWithMongo[])
    : [];

  const safeUpsellRules = Array.isArray(upsellRules)
    ? (upsellRules as UpsellRuleWithCategories[])
    : [];

  const [productForm, setProductForm] = useState<ProductWithUpsells>(() => {
    if (item && type === "products") {
      const product = item as ProductWithUpsells;

      return {
        ...product,
        category: getTextValue((product as any).category, ""),
        modifierGroups: normalizeStringArray((product as any).modifierGroups),
        relatedUpsells: normalizeStringArray((product as any).relatedUpsells),
        updatedAt: product.updatedAt || "Today",
      };
    }

    return {
      id: "",
      name: "",
      category: safeCategories[0]?.name || "",
      price: 0,
      image: "",
      status: "Active",
      modifierGroups: [],
      upsell: "",
      relatedUpsells: [],
      updatedAt: "Today",
    };
  });

  const [categoryForm, setCategoryForm] = useState<CategoryWithMongo>(() => {
    if (item && type === "categories") {
      return item as CategoryWithMongo;
    }

    return {
      id: "",
      name: "",
      status: "Active",
      sortOrder: safeCategories.length + 1,
    };
  });

  const [modifierForm, setModifierForm] = useState<ModifierGroupWithMongo>(() => {
    if (item && type === "modifiers") {
      const modifier = item as ModifierGroupWithMongo;

      return {
        ...modifier,
        appliesTo: getTextValue((modifier as any).appliesTo, ""),
        options: Array.isArray(modifier.options) ? modifier.options : [],
      };
    }

    return {
      id: "",
      name: "",
      appliesTo: safeCategories[0]?.name || "",
      options: [],
      required: false,
    };
  });

  const [modifierOptionsText, setModifierOptionsText] = useState(() => {
    if (item && type === "modifiers") {
      const modifier = item as ModifierGroupWithMongo;
      return Array.isArray(modifier.options) ? modifier.options.join(", ") : "";
    }

    return "";
  });

  const [upsellForm, setUpsellForm] = useState<UpsellRuleWithCategories>(() => {
    if (item && type === "upsells") {
      const upsell = item as UpsellRuleWithCategories;

      return {
        ...upsell,
        offer: upsell.offer || upsell.name || "",
        trigger: upsell.trigger || "",
        placement: upsell.placement || "Cart Sidebar",
        image: upsell.image || "",
        status: upsell.status || "Active",
        appliesToCategories: Array.isArray(upsell.appliesToCategories)
          ? upsell.appliesToCategories
          : [],
      };
    }

    return {
      id: "",
      trigger: "",
      offer: "",
      placement: "Cart Sidebar",
      image: "",
      status: "Active",
      appliesToCategories: [],
    };
  });

  const isEdit = Boolean(item);

  const categoryBasedUpsells = safeUpsellRules.filter((rule) => {
    const selectedCategories = Array.isArray(rule.appliesToCategories)
      ? rule.appliesToCategories
      : [];

    if (rule.status === "Paused" || rule.status === "Inactive") return false;

    if (selectedCategories.length > 0) {
      return selectedCategories.includes(productForm.category);
    }

    const trigger = String(rule.trigger || "").toLowerCase();
    const currentCategory = String(productForm.category || "").toLowerCase();

    return (
      trigger.includes("all") ||
      trigger.includes("any") ||
      trigger.includes(currentCategory) ||
      trigger.includes(currentCategory.replace(/s$/, ""))
    );
  });

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    target: "product" | "upsell"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      event.target.value = "";
      return;
    }

    const maxSize = 1.5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image is too large. Please upload an image under 1.5MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      if (target === "product") {
        setProductForm((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      }

      if (target === "upsell") {
        setUpsellForm((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const removeImage = (target: "product" | "upsell") => {
    if (target === "product") {
      setProductForm((prev) => ({
        ...prev,
        image: "",
      }));
    }

    if (target === "upsell") {
      setUpsellForm((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const toggleProductModifier = (name: string) => {
    setProductForm((prev) => {
      const current = Array.isArray(prev.modifierGroups)
        ? prev.modifierGroups
        : [];

      const exists = current.includes(name);

      return {
        ...prev,
        modifierGroups: exists
          ? current.filter((item) => item !== name)
          : [...current, name],
      };
    });
  };

  const toggleProductUpsell = (id: string) => {
    setProductForm((prev) => {
      const current = prev.relatedUpsells || [];
      const exists = current.includes(id);

      return {
        ...prev,
        relatedUpsells: exists
          ? current.filter((item) => item !== id)
          : [...current, id],
      };
    });
  };

  const toggleUpsellCategory = (name: string) => {
    setUpsellForm((prev) => {
      const current = prev.appliesToCategories || [];
      const exists = current.includes(name);

      return {
        ...prev,
        appliesToCategories: exists
          ? current.filter((item) => item !== name)
          : [...current, name],
      };
    });
  };

  const save = () => {
    if (type === "products") {
      if (!productForm.name.trim()) return alert("Product name required");
      if (!String(productForm.category || "").trim()) {
        return alert("Category required");
      }

      const selectedUpsellNames = safeUpsellRules
        .filter((rule, index) => {
          const ruleId = getSafeId(rule, `upsell-${index}`);
          return productForm.relatedUpsells?.includes(ruleId);
        })
        .map((rule) => rule.offer)
        .filter(Boolean);

      onSave({
        ...productForm,
        price: Number(productForm.price || 0),
        category: String(productForm.category || ""),
        modifierGroups: Array.isArray(productForm.modifierGroups)
          ? productForm.modifierGroups
          : [],
        upsell: selectedUpsellNames.join(", "),
        relatedUpsells: productForm.relatedUpsells || [],
      });

      return;
    }

    if (type === "categories") {
      if (!categoryForm.name.trim()) return alert("Category name required");

      onSave({
        ...categoryForm,
        sortOrder: Number(categoryForm.sortOrder || 1),
      });

      return;
    }

    if (type === "modifiers") {
      if (!modifierForm.name.trim()) {
        return alert("Modifier group name required");
      }

      const options = modifierOptionsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      onSave({
        ...modifierForm,
        appliesTo: String(modifierForm.appliesTo || ""),
        options,
      });

      return;
    }

    if (type === "upsells") {
      if (!upsellForm.offer.trim()) return alert("Offer required");

      const selectedCategories = upsellForm.appliesToCategories || [];

      onSave({
        ...upsellForm,
        name: upsellForm.name || upsellForm.offer,
        offer: upsellForm.offer,
        trigger:
          selectedCategories.length > 0
            ? selectedCategories.join(", ")
            : "All Categories",
        appliesToCategories: selectedCategories,
        placement: upsellForm.placement || "Cart Sidebar",
        status: upsellForm.status || "Active",
      });

      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white shadow-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-green-800">
              {isEdit ? "Edit" : "Add"} {getLabel(type)}
            </p>

            <h3 className="mt-1 text-2xl font-black text-zinc-950">
              {isEdit ? "Update details" : "Create new item"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {type === "products" && (
            <>
              <div className="rounded-3xl border border-zinc-200 p-4">
                <label className="mb-3 block text-sm font-black text-zinc-700">
                  Product Image
                </label>

                <div className="flex items-center gap-4">
                  <ImageBox
                    src={productForm.image}
                    alt={productForm.name || "Product"}
                  />

                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-green-800 px-4 py-3 text-sm font-black text-white transition hover:bg-green-900">
                        <Upload size={16} />
                        Upload from PC
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleImageUpload(event, "product")
                          }
                        />
                      </label>

                      {productForm.image && (
                        <button
                          type="button"
                          onClick={() => removeImage("product")}
                          className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-3 text-sm font-black text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      )}
                    </div>

                    <p className="mt-2 text-xs font-semibold text-zinc-500">
                      Upload JPG, PNG, or WEBP. Keep image under 1.5MB.
                    </p>
                  </div>
                </div>
              </div>

              <FormInput
                label="Product Name"
                value={productForm.name}
                onChange={(value) =>
                  setProductForm((prev) => ({ ...prev, name: value }))
                }
                placeholder="Large Cheese Pizza"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormSelect
                  label="Category"
                  value={String(productForm.category || "")}
                  onChange={(value) =>
                    setProductForm((prev) => ({
                      ...prev,
                      category: value,
                      relatedUpsells: [],
                    }))
                  }
                  options={safeCategories.map((item) => item.name)}
                />

                <FormInput
                  label="Price"
                  value={String(productForm.price)}
                  onChange={(value) =>
                    setProductForm((prev) => ({
                      ...prev,
                      price: Number(value),
                    }))
                  }
                  type="number"
                  placeholder="12.99"
                />
              </div>

              <FormSelect
                label="Status"
                value={productForm.status}
                onChange={(value) =>
                  setProductForm((prev) => ({
                    ...prev,
                    status: value as ProductStatus,
                  }))
                }
                options={["Active", "Draft", "Hidden"]}
              />

              <div>
                <label className="mb-2 block text-sm font-black text-zinc-700">
                  Related Upsells
                </label>

                {categoryBasedUpsells.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm font-bold text-zinc-500">
                    No upsell rules found for {productForm.category}. Create an
                    upsell rule and select this category.
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {categoryBasedUpsells.map((rule, index) => {
                      const ruleId = getSafeId(rule, `upsell-${index}`);
                      const selected =
                        productForm.relatedUpsells?.includes(ruleId);

                      return (
                        <button
                          type="button"
                          key={ruleId}
                          onClick={() => toggleProductUpsell(ruleId)}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                            selected
                              ? "border-green-700 bg-green-50 text-green-800"
                              : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                          }`}
                        >
                          <span className="block">
                            {rule.offer || rule.name || "Upsell Offer"}
                          </span>
                          <span className="mt-1 block text-xs font-bold opacity-70">
                            {rule.placement || "Cart Sidebar"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-zinc-700">
                  Modifier Groups
                </label>

                <div className="grid gap-2 sm:grid-cols-2">
                  {safeModifierGroups.map((group, index) => {
                    const groupId = getSafeId(group, `modifier-${index}`);
                    const selected = productForm.modifierGroups.includes(
                      group.name
                    );

                    return (
                      <button
                        type="button"
                        key={groupId}
                        onClick={() => toggleProductModifier(group.name)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                          selected
                            ? "border-green-700 bg-green-50 text-green-800"
                            : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        {group.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {type === "categories" && (
            <>
              <FormInput
                label="Category Name"
                value={categoryForm.name}
                onChange={(value) =>
                  setCategoryForm((prev) => ({ ...prev, name: value }))
                }
                placeholder="Pizzas"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Sort Order"
                  value={String(categoryForm.sortOrder)}
                  onChange={(value) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      sortOrder: Number(value),
                    }))
                  }
                  type="number"
                  placeholder="1"
                />

                <FormSelect
                  label="Status"
                  value={categoryForm.status}
                  onChange={(value) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      status: value as CategoryStatus,
                    }))
                  }
                  options={["Active", "Inactive"]}
                />
              </div>
            </>
          )}

          {type === "modifiers" && (
            <>
              <FormInput
                label="Modifier Group Name"
                value={modifierForm.name}
                onChange={(value) =>
                  setModifierForm((prev) => ({ ...prev, name: value }))
                }
                placeholder="Pizza Toppings"
              />

              <FormSelect
                label="Applies To"
                value={modifierForm.appliesTo}
                onChange={(value) =>
                  setModifierForm((prev) => ({ ...prev, appliesTo: value }))
                }
                options={safeCategories.map((item) => item.name)}
              />

              <FormInput
                label="Options"
                value={modifierOptionsText}
                onChange={setModifierOptionsText}
                placeholder="Pepperoni, Mushrooms, Onions"
              />

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-200 p-4">
                <input
                  type="checkbox"
                  checked={modifierForm.required}
                  onChange={(event) =>
                    setModifierForm((prev) => ({
                      ...prev,
                      required: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-green-800"
                />

                <span className="text-sm font-black text-zinc-700">
                  Required selection
                </span>
              </label>
            </>
          )}

          {type === "upsells" && (
            <>
              <div className="rounded-3xl border border-zinc-200 p-4">
                <label className="mb-3 block text-sm font-black text-zinc-700">
                  Upsell Image
                </label>

                <div className="flex items-center gap-4">
                  <ImageBox
                    src={upsellForm.image}
                    alt={upsellForm.offer || "Upsell"}
                  />

                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-green-800 px-4 py-3 text-sm font-black text-white transition hover:bg-green-900">
                        <Upload size={16} />
                        Upload from PC
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleImageUpload(event, "upsell")
                          }
                        />
                      </label>

                      {upsellForm.image && (
                        <button
                          type="button"
                          onClick={() => removeImage("upsell")}
                          className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-3 text-sm font-black text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      )}
                    </div>

                    <p className="mt-2 text-xs font-semibold text-zinc-500">
                      Upload JPG, PNG, or WEBP. Keep image under 1.5MB.
                    </p>
                  </div>
                </div>
              </div>

              <FormInput
                label="Offer"
                value={upsellForm.offer}
                onChange={(value) =>
                  setUpsellForm((prev) => ({ ...prev, offer: value }))
                }
                placeholder="Add Wings + 2L Soda"
              />

              <div>
                <label className="mb-2 block text-sm font-black text-zinc-700">
                  Show This Upsell For Categories
                </label>

                <div className="grid gap-2 sm:grid-cols-2">
                  {safeCategories.map((category, index) => {
                    const categoryId = getSafeId(category, `category-${index}`);
                    const selected =
                      upsellForm.appliesToCategories?.includes(category.name);

                    return (
                      <button
                        type="button"
                        key={categoryId}
                        onClick={() => toggleUpsellCategory(category.name)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                          selected
                            ? "border-green-700 bg-green-50 text-green-800"
                            : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-2 text-xs font-semibold text-zinc-500">
                  Select Pizzas, Wings, Breakfast, Subs, etc. Product modal will
                  show upsells according to selected category.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormSelect
                  label="Placement"
                  value={upsellForm.placement}
                  onChange={(value) =>
                    setUpsellForm((prev) => ({ ...prev, placement: value }))
                  }
                  options={["Cart Sidebar", "Product Modal", "Checkout"]}
                />

                <FormSelect
                  label="Status"
                  value={upsellForm.status}
                  onChange={(value) =>
                    setUpsellForm((prev) => ({
                      ...prev,
                      status: value as UpsellStatus,
                    }))
                  }
                  options={["Active", "Paused"]}
                />
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-zinc-200 bg-white p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-zinc-100 px-5 py-3 text-sm font-black text-zinc-700 transition hover:bg-zinc-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={save}
            className="rounded-full bg-green-800 px-5 py-3 text-sm font-black text-white transition hover:bg-green-900"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getLabel(type: TabType) {
  if (type === "products") return "Product";
  if (type === "categories") return "Category";
  if (type === "modifiers") return "Modifier Group";
  return "Upsell";
}