import type { Category, ModifierGroup, Product, UpsellRule } from "./types";

export const STORAGE_KEY = "stokos_admin_menu_data";

const DEFAULT_STORE_ID = "towson";

export const defaultProducts: Product[] = [
  {
    id: "PRD-001",
    storeId: DEFAULT_STORE_ID,
    name: "Large Cheese Pizza",
    category: "Pizzas",
    price: 12.99,
    image: "/images/largepizza.png",
    status: "Active",
    modifierGroups: ["Pizza Size", "Pizza Toppings"],
    upsell: "Wings + Soda",
    relatedUpsells: [],
    updatedAt: "Today",
  },
  {
    id: "PRD-002",
    storeId: DEFAULT_STORE_ID,
    name: "Buffalo Wings",
    category: "Wings",
    price: 10.99,
    image: "/images/pizzaandwings.png",
    status: "Active",
    modifierGroups: ["Wing Sauce"],
    upsell: "Fries + Drink",
    relatedUpsells: [],
    updatedAt: "Today",
  },
  {
    id: "PRD-003",
    storeId: DEFAULT_STORE_ID,
    name: "Chicken Cheesesteak Sub",
    category: "Hot Subs",
    price: 9.49,
    image: "/images/subcombo.png",
    status: "Active",
    modifierGroups: ["Bread Choice"],
    upsell: "Fries + Soda",
    relatedUpsells: [],
    updatedAt: "Yesterday",
  },
];

export const defaultCategories: Category[] = [
  {
    id: "CAT-001",
    storeId: DEFAULT_STORE_ID,
    name: "Pizzas",
    status: "Active",
    sortOrder: 1,
  },
  {
    id: "CAT-002",
    storeId: DEFAULT_STORE_ID,
    name: "Wings",
    status: "Active",
    sortOrder: 2,
  },
  {
    id: "CAT-003",
    storeId: DEFAULT_STORE_ID,
    name: "Hot Subs",
    status: "Active",
    sortOrder: 3,
  },
  {
    id: "CAT-004",
    storeId: DEFAULT_STORE_ID,
    name: "Breakfast",
    status: "Active",
    sortOrder: 4,
  },
  {
    id: "CAT-005",
    storeId: DEFAULT_STORE_ID,
    name: "Fresh Salads",
    status: "Active",
    sortOrder: 5,
  },
];

export const defaultModifierGroups: ModifierGroup[] = [
  {
    id: "MOD-001",
    storeId: DEFAULT_STORE_ID,
    name: "Pizza Size",
    appliesTo: "Pizzas",
    options: [
      {
        id: "OPT-001",
        name: "Small",
        price: 0,
        status: "Active",
      },
      {
        id: "OPT-002",
        name: "Medium",
        price: 2,
        status: "Active",
      },
      {
        id: "OPT-003",
        name: "Large",
        price: 4,
        status: "Active",
      },
      {
        id: "OPT-004",
        name: "X-Large",
        price: 6,
        status: "Active",
      },
    ],
    required: true,
  },
  {
    id: "MOD-002",
    storeId: DEFAULT_STORE_ID,
    name: "Pizza Toppings",
    appliesTo: "Pizzas",
    options: [
      {
        id: "OPT-005",
        name: "Pepperoni",
        price: 1.5,
        status: "Active",
      },
      {
        id: "OPT-006",
        name: "Mushrooms",
        price: 1,
        status: "Active",
      },
      {
        id: "OPT-007",
        name: "Onions",
        price: 1,
        status: "Active",
      },
      {
        id: "OPT-008",
        name: "Green Peppers",
        price: 1,
        status: "Active",
      },
    ],
    required: false,
  },
  {
    id: "MOD-003",
    storeId: DEFAULT_STORE_ID,
    name: "Wing Sauce",
    appliesTo: "Wings",
    options: [
      {
        id: "OPT-009",
        name: "Buffalo",
        price: 0,
        status: "Active",
      },
      {
        id: "OPT-010",
        name: "BBQ",
        price: 0,
        status: "Active",
      },
      {
        id: "OPT-011",
        name: "Mild",
        price: 0,
        status: "Active",
      },
      {
        id: "OPT-012",
        name: "Hot",
        price: 0,
        status: "Active",
      },
    ],
    required: true,
  },
];

export const defaultUpsellRules: UpsellRule[] = [
  {
    id: "UP-001",
    storeId: DEFAULT_STORE_ID,
    trigger: "Any Pizza",
    offer: "Add Wings + 2L Soda",
    image: "/images/pizzaandwings.png",
    status: "Active",
    appliesToCategories: [],
  },
  {
    id: "UP-002",
    storeId: DEFAULT_STORE_ID,
    trigger: "Any Sub",
    offer: "Add Fries + Can Soda",
    image: "/images/subcombo.png",
    status: "Active",
    appliesToCategories: [],
  },
];