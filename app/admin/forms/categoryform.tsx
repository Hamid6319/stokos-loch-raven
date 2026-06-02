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

type CategoryFormProps = {
  item: Category | null;
  categories: Category[];
  selectedStoreId?: string;
  onSave: (value: CategoryWithMongo) => void;
};

const CategoryForm = forwardRef<CategoryFormRef, CategoryFormProps>(
  function CategoryForm(
    { item, categories, selectedStoreId = "", onSave },
    ref
  ) {
    const safeCategories = Array.isArray(categories)
      ? (categories as CategoryWithMongo[])
      : [];

    const [form, setForm] = useState<CategoryWithMongo>(() => {
      if (item) return item as CategoryWithMongo;

      return {
        id: "",
        storeId: selectedStoreId,
        name: "",
        status: "Active" as CategoryStatus,
        sortOrder: safeCategories.length + 1,
      };
    });

    const submit = () => {
      if (!form.name.trim()) return alert("Category name required");

      if (!form.storeId) {
        return alert("Store is required for category");
      }

      onSave({
        ...form,
        name: form.name.trim(),
        storeId: form.storeId,
        sortOrder: Number(form.sortOrder || 1),
      });
    };

    useImperativeHandle(ref, () => ({ submit }));

    return (
      <>
        <FormInput
          label="Category Name"
          value={form.name}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              name: value,
            }))
          }
          placeholder="Pizzas"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="Sort Order"
            value={String(form.sortOrder)}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                sortOrder: Number(value || 1),
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
  }
);

CategoryForm.displayName = "CategoryForm";
   
export default CategoryForm;