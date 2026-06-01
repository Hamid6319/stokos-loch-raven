export type TabType = "products" | "categories" | "modifiers" | "upsells";

export type ProductStatus = "Active" | "Draft" | "Hidden";
export type CategoryStatus = "Active" | "Hidden";
export type UpsellStatus = "Active" | "Paused" | "Inactive";

export type Product = {
  _id?: string;
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  status: ProductStatus;
  modifierGroups: string[];
  upsell: string;
  relatedUpsells?: string[];
  updatedAt: string;
};

export type Category = {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  sortOrder: number;
  status: CategoryStatus;
};

export type ModifierGroup = {
  _id?: string;
  id?: string;
  storeId?: string;
  name: string;
  slug?: string;
  appliesTo: string;
  options: string[];
  required: boolean;
  sortOrder?: number;
  status?: "Active" | "Inactive";
};

export type UpsellRule = {
  _id?: string;
  id?: string;
  storeId?: string;
  name?: string;
  slug?: string;
  trigger: string;
  offer: string;
  image?: string;
  appliesToCategories?: string[];
  sortOrder?: number;
  status: UpsellStatus;
};