"use client";

import type {
  Category,
  ModifierGroup,
  Product,
  TabType,
  UpsellRule,
} from "../types";

import BaseMenuModal from "../../adminmenumodel/basemenumodal";
import ProductForm, { type ProductFormRef } from "../../forms/productform";
import CategoryForm, { type CategoryFormRef } from "../../forms/categoryform";
import ModifierGroupForm, {
  type ModifierGroupFormRef,
} from "../../forms/modifiergroupform";
import UpsellForm, { type UpsellFormRef } from "../../forms/upsellform";
import { getMenuModalLabel } from "../../utils/menuhelpers";
import { useRef } from "react";

type ModalItem = Product | Category | ModifierGroup | UpsellRule | null;

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
  const productRef = useRef<ProductFormRef>(null);
  const categoryRef = useRef<CategoryFormRef>(null);
  const modifierRef = useRef<ModifierGroupFormRef>(null);
  const upsellRef = useRef<UpsellFormRef>(null);

  const isEdit = Boolean(item);
  const label = getMenuModalLabel(type);

  const handleSave = () => {
    if (type === "products") productRef.current?.submit();
    if (type === "categories") categoryRef.current?.submit();
    if (type === "modifiers") modifierRef.current?.submit();
    if (type === "upsells") upsellRef.current?.submit();
  };

  return (
    <BaseMenuModal
      title={`${isEdit ? "Edit" : "Add"} ${label}`}
      subtitle={isEdit ? "Update details" : "Create new item"}
      isEdit={isEdit}
      onClose={onClose}
      onSave={handleSave}
    >
      {type === "products" && (
        <ProductForm
          ref={productRef}
          item={item as Product | null}
          categories={categories}
          modifierGroups={modifierGroups}
          upsellRules={upsellRules}
          onSave={onSave}
        />
      )}

      {type === "categories" && (
        <CategoryForm
          ref={categoryRef}
          item={item as Category | null}
          categories={categories}
          onSave={onSave}
        />
      )}

      {type === "modifiers" && (
        <ModifierGroupForm
          ref={modifierRef}
          item={item as ModifierGroup | null}
          categories={categories}
          onSave={onSave}
        />
      )}

      {type === "upsells" && (
        <UpsellForm
          ref={upsellRef}
          item={item as UpsellRule | null}
          categories={categories}
          onSave={onSave}
        />
      )}
    </BaseMenuModal>
  );
}