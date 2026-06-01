"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import type { Category, CategoryStatus } from "../menu/types";
import { FormInput, FormSelect } from "../menu/components/ui";

export type CategoryFormRef = {
  submit: () => void;
};

type CategoryWithMongo = Category & {
  _id?: string;
};

const CategoryForm = forwardRef<CategoryFormRef, {
  item: Category | null;
  categories: Category[];
  onSave: (value: any) => void;
}>(function CategoryForm({ item, categories, onSave }, ref) {
  const safeCategories = Array.isArray(categories)
    ? (categories as CategoryWithMongo[])
    : [];

  const [form, setForm] = useState<CategoryWithMongo>(() => {
    if (item) return item as CategoryWithMongo;

    return {
      id: "",
      name: "",
      status: "Active",
      sortOrder: safeCategories.length + 1,
    };
  });

  const submit = () => {
    if (!form.name.trim()) return alert("Category name required");

    onSave({
      ...form,
      sortOrder: Number(form.sortOrder || 1),
    });
  };

  useImperativeHandle(ref, () => ({ submit }));

  return (
    <>
      <FormInput
        label="Category Name"
        value={form.name}
        onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
        placeholder="Pizzas"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          label="Sort Order"
          value={String(form.sortOrder)}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              sortOrder: Number(value),
            }))
          }
          type="number"
          placeholder="1"
        />

        <FormSelect
          label="Status"
          value={form.status}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              status: value as CategoryStatus,
            }))
          }
          options={["Active", "Inactive"]}
        />
      </div>
    </>
  );
});

export default CategoryForm;