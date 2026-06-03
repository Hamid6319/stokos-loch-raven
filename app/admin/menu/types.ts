export type TabType = "products" | "categories" | "modifiers" | "upsells";

export type ProductStatus = "Active" | "Draft" | "Hidden";
export type CategoryStatus = "Active" | "Hidden";
export type UpsellStatus = "Active" | "Paused" | "Inactive";
export type StoreStatus = "Active" | "Inactive";

export type OrderType = "pickup" | "delivery" | "both";

export type StoreAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type StoreHours = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

export type Store = {
  _id?: string;
  id?: string;

  name: string;
  slug: string;

  phone?: string;
  email?: string;
  hngrUrl?: string;

  address?: StoreAddress;

  status: StoreStatus;

  orderType?: OrderType;
  pickupEnabled?: boolean;
  deliveryEnabled?: boolean;

  deliveryFee?: number;
  minimumOrder?: number;
  taxRate?: number;

  hours?: StoreHours[];

  updatedAt?: string;
};

export type ModifierOption = {
  id?: string;
  name: string;
  price: number;
  status?: "Active" | "Inactive";
};

export type Product = {
  _id?: string;
  id: string;

  storeId: string;

  name: string;

  // DB relation / category id
  category: string;
  categoryId?: string;

  // frontend/database readable label
  categoryName?: string;

  price: number;
  image: string;

  status: ProductStatus;

  modifierGroups: string[];
  modifierGroupIds?: string[];

  upsell: string;
  relatedUpsells?: string[];

  description?: string;
  sortOrder?: number;

  updatedAt: string;
};
export type Category = {
  _id?: string;
  id?: string;

  storeId: string;

  name: string;
  slug?: string;
  description?: string;
  image?: string;

  sortOrder: number;
  status: CategoryStatus;

  updatedAt?: string;
};

export type ModifierGroup = {
  _id?: string;
  id?: string;

  storeId: string;

  name: string;
  slug?: string;

  appliesTo: string;
  appliesToCategories?: string[];

  options: ModifierOption[];

  required: boolean;
  minSelect?: number;
  maxSelect?: number;

  sortOrder?: number;
  status?: "Active" | "Inactive";

  updatedAt?: string;
};

export type UpsellRule = {
  _id?: string;
  id?: string;

  storeId: string;

  name?: string;
  slug?: string;

  trigger: string;
  offer: string;
  image?: string;

  appliesToCategories?: string[];
  appliesToProducts?: string[];

  sortOrder?: number;
  status: UpsellStatus;

  updatedAt?: string;
};