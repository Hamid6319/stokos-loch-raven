"use client";

import {
  forwardRef,
  useImperativeHandle,
  useState,
  type ChangeEvent,
} from "react";

import type { Category, UpsellRule, UpsellStatus } from "../menu/types";
import { FormInput, FormSelect } from "../menu/components/ui";
import ImageUploadBox from "../adminmenumodel/imageuploadbox";

export type UpsellFormRef = {
  submit: () => void;
};

type CategoryWithMongo = Category & {
  _id?: string;
};

type UpsellRuleWithCategories = UpsellRule & {
  _id?: string;
  name?: string;
  appliesToCategories?: string[];
};

const UpsellForm = forwardRef<
  UpsellFormRef,
  {
    item: UpsellRule | null;
    categories: Category[];
    onSave: (value: any) => void;
  }
>(function UpsellForm({ item, categories, onSave }, ref) {
  const safeCategories = Array.isArray(categories)
    ? (categories as CategoryWithMongo[])
    : [];

  const [form, setForm] = useState<UpsellRuleWithCategories>(() => {
    if (item) {
      const upsell = item as UpsellRuleWithCategories;

      return {
        ...upsell,
        offer: upsell.offer || upsell.name || "",
        trigger: upsell.trigger || "",
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
      image: "",
      status: "Active",
      appliesToCategories: [],
    };
  });

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      alert("Image is too large. Please upload an image under 1.5MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") return;

      setForm((prev) => ({
        ...prev,
        image: result,
      }));
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const submit = () => {
    if (!form.offer.trim()) return alert("Offer required");

    const selectedCategories = form.appliesToCategories || [];

    onSave({
      ...form,
      name: form.name || form.offer,
      offer: form.offer,
      trigger:
        selectedCategories.length > 0
          ? selectedCategories.join(", ")
          : "All Categories",
      appliesToCategories: selectedCategories,
      status: form.status || "Active",
    });
  };

  useImperativeHandle(ref, () => ({
    submit,
  }));

  return (
    <div className="space-y-5">
      <ImageUploadBox
        label="Upsell Image"
        image={form.image}
        alt={form.offer || "Upsell"}
        onUpload={handleImageUpload}
        onRemove={() =>
          setForm((prev) => ({
            ...prev,
            image: "",
          }))
        }
      />

      <FormInput
        label="Offer"
        value={form.offer}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            offer: value,
          }))
        }
        placeholder="Add Wings + 2L Soda"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormSelect
          label="Category"
          value={form.appliesToCategories?.[0] || "All Categories"}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              appliesToCategories: value === "All Categories" ? [] : [value],
            }))
          }
          options={[
            "All Categories",
            ...safeCategories.map((category) => category.name),
          ]}
        />

        <FormSelect
          label="Status"
          value={form.status}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              status: value as UpsellStatus,
            }))
          }
          options={["Active", "Paused", "Inactive"]}
        />
      </div>
    </div>
  );
});

export default UpsellForm;