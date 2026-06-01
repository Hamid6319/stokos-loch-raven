import type { Category, ModifierGroup, Product, UpsellRule } from "./types";

export const STORAGE_KEY = "stokos_admin_menu_data";

export const defaultProducts: Product[] = [
  {
    id: "PRD-001",
    name: "Large Cheese Pizza",
    category: "Pizzas",
    price: 12.99,
    image: "/images/largepizza.png",
    status: "Active",
    modifierGroups: ["Pizza Size", "Pizza Toppings"],
    upsell: "Wings + Soda",
    updatedAt: "Today",
  },
  {
    id: "PRD-002",
    name: "Buffalo Wings",
    category: "Wings",
    price: 10.99,
    image: "/images/pizzaandwings.png",
    status: "Active",
    modifierGroups: ["Wing Sauce"],
    upsell: "Fries + Drink",
    updatedAt: "Today",
  },
  {
    id: "PRD-003",
    name: "Chicken Cheesesteak Sub",
    category: "Hot Subs",
    price: 9.49,
    image: "/images/subcombo.png",
    status: "Active",
    modifierGroups: ["Bread Choice"],
    upsell: "Fries + Soda",
    updatedAt: "Yesterday",
  },
];

export const defaultCategories: Category[] = [
  { id: "CAT-001", name: "Pizzas", status: "Active", sortOrder: 1 },
  { id: "CAT-002", name: "Wings", status: "Active", sortOrder: 2 },
  { id: "CAT-003", name: "Hot Subs", status: "Active", sortOrder: 3 },
  { id: "CAT-004", name: "Breakfast", status: "Active", sortOrder: 4 },
  { id: "CAT-005", name: "Fresh Salads", status: "Active", sortOrder: 5 },
];

export const defaultModifierGroups: ModifierGroup[] = [
  {
    id: "MOD-001",
    name: "Pizza Size",
    appliesTo: "Pizzas",
    options: ["Small", "Medium", "Large", "X-Large"],
    required: true,
  },
  {
    id: "MOD-002",
    name: "Pizza Toppings",
    appliesTo: "Pizzas",
    options: ["Pepperoni", "Mushrooms", "Onions", "Green Peppers"],
    required: false,
  },
  {
    id: "MOD-003",
    name: "Wing Sauce",
    appliesTo: "Wings",
    options: ["Buffalo", "BBQ", "Mild", "Hot"],
    required: true,
  },
];

export const defaultUpsellRules: UpsellRule[] = [
  {
    id: "UP-001",
    trigger: "Any Pizza",
    offer: "Add Wings + 2L Soda",
    image: "/images/pizzaandwings.png",
    status: "Active",
  },
  {
    id: "UP-002",
    trigger: "Any Sub",
    offer: "Add Fries + Can Soda",
    image: "/images/subcombo.png",
    status: "Active",
  },
];