import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PizzaSide = "left" | "right" | "whole";

export interface CartItem {
  cartId: string;
  id: number | string;
  category?: string;
  title: string;
  image: string;
  price: number; // unit price
  quantity: number;
  size?: { label: string; price: number };
  toppings?: Record<string, PizzaSide>;
  sauces?: string[];
  note?: string;
}

interface CartStore {
  cart: CartItem[];
  isCartOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (cartId: string) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,

      toggleCart: () =>
        set((state) => ({ isCartOpen: !state.isCartOpen })),

      addItem: (item) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (i) => i.cartId === item.cartId
          );

          if (existingIndex > -1) {
            const newCart = [...state.cart];
            newCart[existingIndex] = {
              ...newCart[existingIndex],
              quantity: newCart[existingIndex].quantity + item.quantity,
            };

            return { cart: newCart, isCartOpen: true };
          }

          return {
            cart: [...state.cart, item],
            isCartOpen: true,
          };
        }),

      removeItem: (cartId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.cartId !== cartId),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: "stokos-cart" }
  )
);