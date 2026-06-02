"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import type {
  Category,
  ModifierGroup,
  Product,
  ProductStatus,
  UpsellRule,
} from "../menu/types";

import { FormInput, FormSelect } from "../menu/components/ui";
import ImageUploadBox from "../adminmenumodel/imageuploadbox";
import {
  getSafeId,
  getTextValue,
  normalizeStringArray,
} from "../utils/menuhelpers";

export type ProductFormRef = {
  submit: () => void;
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

type ProductFormProps = {
  item: Product | null;
  categories: Category[];
  modifierGroups: ModifierGroup[];
  upsellRules?: UpsellRule[];
  selectedStoreId?: string;
  onSave: (value: any) => void;
};

const ProductForm = forwardRef<ProductFormRef, ProductFormProps>(
  function ProductForm(
    {
      item,
      categories,
      modifierGroups,
      upsellRules = [],
      selectedStoreId = "",
      onSave,
    },
    ref
  ) {
    const safeCategories = Array.isArray(categories)
      ? (categories as CategoryWithMongo[])
      : [];

    const safeModifierGroups = Array.isArray(modifierGroups)
      ? (modifierGroups as ModifierGroupWithMongo[])
      : [];

    const safeUpsellRules = Array.isArray(upsellRules)
      ? (upsellRules as UpsellRuleWithCategories[])
      : [];

    const [form, setForm] = useState<ProductWithUpsells>(() => {
      if (item) {
        const product = item as ProductWithUpsells;

        return {
          ...product,
          storeId: product.storeId || selectedStoreId,
          category: getTextValue((product as any).category, ""),
          modifierGroups: normalizeStringArray((product as any).modifierGroups),
          relatedUpsells: normalizeStringArray((product as any).relatedUpsells),
          updatedAt: product.updatedAt || "Today",
        };
      }

      return {
        id: "",
        storeId: selectedStoreId,
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

    const categoryBasedUpsells = useMemo(() => {
      return safeUpsellRules.filter((rule) => {
        const selectedCategories = Array.isArray(rule.appliesToCategories)
          ? rule.appliesToCategories
          : [];

        if (rule.status === "Paused" || rule.status === "Inactive") {
          return false;
        }

        if (selectedCategories.length > 0) {
          return selectedCategories.includes(String(form.category || ""));
        }

        const trigger = String(rule.trigger || "").toLowerCase();
        const currentCategory = String(form.category || "").toLowerCase();

        return (
          trigger.includes("all") ||
          trigger.includes("any") ||
          trigger.includes(currentCategory) ||
          trigger.includes(currentCategory.replace(/s$/, ""))
        );
      });
    }, [safeUpsellRules, form.category]);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
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

        setForm((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };

      reader.readAsDataURL(file);
      event.target.value = "";
    };

    const toggleModifier = (name: string) => {
      setForm((prev) => {
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

    const toggleUpsell = (id: string) => {
      setForm((prev) => {
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

    const submit = () => {
      if (!form.name.trim()) return alert("Product name required");

      if (!form.storeId) {
        return alert("Store is required for product");
      }

      if (!String(form.category || "").trim()) {
        return alert("Category required");
      }

      const selectedUpsellNames = safeUpsellRules
        .filter((rule, index) => {
          const ruleId = getSafeId(rule, `upsell-${index}`);
          return form.relatedUpsells?.includes(ruleId);
        })
        .map((rule) => rule.offer)
        .filter(Boolean);

      onSave({
        ...form,
        storeId: form.storeId,
        name: form.name.trim(),
        price: Number(form.price || 0),
        category: String(form.category || ""),
        modifierGroups: Array.isArray(form.modifierGroups)
          ? form.modifierGroups
          : [],
        upsell: selectedUpsellNames.join(", "),
        relatedUpsells: form.relatedUpsells || [],
      });
    };

    useImperativeHandle(ref, () => ({ submit }));

    return (
      <>
        <ImageUploadBox
          label="Product Image"
          image={form.image}
          alt={form.name || "Product"}
          onUpload={handleImageUpload}
          onRemove={() => setForm((prev) => ({ ...prev, image: "" }))}
        />

        <FormInput
          label="Product Name"
          value={form.name}
          onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
          placeholder="Large Cheese Pizza"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormSelect
            label="Category"
            value={String(form.category || "")}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                category: value,
                relatedUpsells: [],
              }))
            }
            options={safeCategories.map((item) => item.name)}
          />

          <FormInput
            label="Price"
            value={String(form.price)}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                price: Number(value || 0),
              }))
            }
            type="number"
            placeholder="12.99"
          />
        </div>

        <FormSelect
          label="Status"
          value={form.status}
          onChange={(value) =>
            setForm((prev) => ({
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
              No upsell rules found for {form.category}. Create an upsell rule
              and select this category.
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {categoryBasedUpsells.map((rule, index) => {
                const ruleId = getSafeId(rule, `upsell-${index}`);
                const selected = form.relatedUpsells?.includes(ruleId);

                return (
                  <button
                    type="button"
                    key={ruleId}
                    onClick={() => toggleUpsell(ruleId)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                      selected
                        ? "border-green-700 bg-green-50 text-green-800"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="block">
                      {rule.offer || rule.name || "Upsell Offer"}
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
              const selected = form.modifierGroups.includes(group.name);

              return (
                <button
                  type="button"
                  key={groupId}
                  onClick={() => toggleModifier(group.name)}
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
    );
  }
);

ProductForm.displayName = "ProductForm";

export default ProductForm;