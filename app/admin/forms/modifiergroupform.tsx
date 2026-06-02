"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import type { Category, ModifierGroup } from "../menu/types";
import { FormInput, FormSelect } from "../menu/components/ui";
import { getTextValue } from "../utils/menuhelpers";

export type ModifierGroupFormRef = {
  submit: () => void;
};

type CategoryWithMongo = Category & {
  _id?: string;
};

type ModifierGroupWithMongo = ModifierGroup & {
  _id?: string;
};

type ModifierGroupFormProps = {
  item: ModifierGroup | null;
  categories: Category[];
  selectedStoreId?: string;
  onSave: (value: any) => void;
};

const ModifierGroupForm = forwardRef<
  ModifierGroupFormRef,
  ModifierGroupFormProps
>(function ModifierGroupForm(
  { item, categories, selectedStoreId = "", onSave },
  ref
) {
  const safeCategories = Array.isArray(categories)
    ? (categories as CategoryWithMongo[])
    : [];

  const [form, setForm] = useState<ModifierGroupWithMongo>(() => {
    if (item) {
      const modifier = item as ModifierGroupWithMongo;

      return {
        ...modifier,
        storeId: modifier.storeId || selectedStoreId,
        appliesTo: getTextValue((modifier as any).appliesTo, ""),
        options: Array.isArray(modifier.options) ? modifier.options : [],
        required: Boolean(modifier.required),
      };
    }

    return {
      id: "",
      storeId: selectedStoreId,
      name: "",
      appliesTo: safeCategories[0]?.name || "",
      options: [],
      required: false,
    };
  });

  const [optionsText, setOptionsText] = useState(() => {
    if (item) {
      const modifier = item as ModifierGroupWithMongo;

      if (!Array.isArray(modifier.options)) return "";

      return modifier.options
        .map((option: any) => {
          if (typeof option === "string") return option;
          return option?.name || option?.label || option?.title || option?.value || "";
        })
        .filter(Boolean)
        .join(", ");
    }

    return "";
  });

  const submit = () => {
    if (!form.name.trim()) {
      return alert("Modifier group name required");
    }

    if (!form.storeId) {
      return alert("Store is required for modifier group");
    }

    const options = optionsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    onSave({
      ...form,
      storeId: form.storeId,
      name: form.name.trim(),
      appliesTo: String(form.appliesTo || ""),
      options,
      required: Boolean(form.required),
    });
  };

  useImperativeHandle(ref, () => ({ submit }));

  return (
    <>
      <FormInput
        label="Modifier Group Name"
        value={form.name}
        onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
        placeholder="Pizza Toppings"
      />

      <FormSelect
        label="Applies To"
        value={form.appliesTo}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            appliesTo: value,
          }))
        }
        options={safeCategories.map((item) => item.name)}
      />

      <FormInput
        label="Options"
        value={optionsText}
        onChange={setOptionsText}
        placeholder="Pepperoni, Mushrooms, Onions"
      />

      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-200 p-4">
        <input
          type="checkbox"
          checked={Boolean(form.required)}
          onChange={(event) =>
            setForm((prev) => ({
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
  );
});

ModifierGroupForm.displayName = "ModifierGroupForm";

export default ModifierGroupForm;