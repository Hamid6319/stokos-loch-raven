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

const ModifierGroupForm = forwardRef<ModifierGroupFormRef, {
  item: ModifierGroup | null;
  categories: Category[];
  onSave: (value: any) => void;
}>(function ModifierGroupForm({ item, categories, onSave }, ref) {
  const safeCategories = Array.isArray(categories)
    ? (categories as CategoryWithMongo[])
    : [];

  const [form, setForm] = useState<ModifierGroupWithMongo>(() => {
    if (item) {
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

  const [optionsText, setOptionsText] = useState(() => {
    if (item) {
      const modifier = item as ModifierGroupWithMongo;
      return Array.isArray(modifier.options) ? modifier.options.join(", ") : "";
    }

    return "";
  });

  const submit = () => {
    if (!form.name.trim()) {
      return alert("Modifier group name required");
    }

    const options = optionsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    onSave({
      ...form,
      appliesTo: String(form.appliesTo || ""),
      options,
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
          setForm((prev) => ({ ...prev, appliesTo: value }))
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
          checked={form.required}
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

export default ModifierGroupForm;