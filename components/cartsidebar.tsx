"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCartStore, CartItem } from "@/app/store/[slug]/usecartstore";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";


const upsellByCategory: Record<string, CartItem[]> = {
  pizzas: [
    {
      cartId: "upsell-coke-2l",
      id: "upsell-coke-2l",
      category: "upsell",
      title: "Coke 2L",
      price: 3.5,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop",
    },
    {
      cartId: "upsell-wings",
      id: "upsell-wings",
      category: "upsell",
      title: "Buffalo Wings",
      price: 8.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=600&auto=format&fit=crop",
    },
    {
      cartId: "upsell-fries-pizza",
      id: "upsell-fries-pizza",
      category: "upsell",
      title: "French Fries",
      price: 4.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=600&auto=format&fit=crop",
    },
    {
      cartId: "upsell-garlic-knots",
      id: "upsell-garlic-knots",
      category: "upsell",
      title: "Garlic Knots",
      price: 5.99,
      quantity: 1,
      image:
        "https://www.savingdessert.com/wp-content/uploads/2022/02/Garlic-Knots-8.jpg",
    },
  ],

  breakfast: [
    {
      cartId: "upsell-coffee",
      id: "upsell-coffee",
      category: "upsell",
      title: "Hot Coffee",
      price: 2.49,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop",
    },
    {
      cartId: "upsell-hash-browns",
      id: "upsell-hash-browns",
      category: "upsell",
      title: "Hash Browns",
      price: 3.99,
      quantity: 1,
      image:
        "https://seasonandthyme.com/wp-content/uploads/2022/01/frozen-hash-browns-air-fryer-2.jpeg",
    },
  ],

  trending: [
    {
      cartId: "upsell-fries-trending",
      id: "upsell-fries-trending",
      category: "upsell",
      title: "French Fries",
      price: 4.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=600&auto=format&fit=crop",
    },
    {
      cartId: "upsell-coke-can",
      id: "upsell-coke-can",
      category: "upsell",
      title: "Coke Can",
      price: 1.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=600&auto=format&fit=crop",
    },
  ],
};

export default function CartSidebar() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam || "towson";

  const [loading, setLoading] = useState(false);

  const { cart, isCartOpen, toggleCart, closeCart, removeItem, addItem } =
    useCartStore();

  useEffect(() => {
    const resetLoading = () => {
      setLoading(false);
      closeCart();
    };

    window.addEventListener("pageshow", resetLoading);

    return () => {
      window.removeEventListener("pageshow", resetLoading);
    };
  }, [closeCart]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const mainCartItems = cart.filter((item) => item.category !== "upsell");

  const upsellSections = mainCartItems
    .map((mainItem, index) => {
      const items = (upsellByCategory[mainItem.category || ""] || []).filter(
        (upsell) => !cart.some((cartItem) => cartItem.cartId === upsell.cartId)
      );

      return {
        key: `${mainItem.cartId}-${index}`,
        title: mainItem.title,
        items,
      };
    })
    .filter((section) => section.items.length > 0);

  const handleStripeCheckout = async () => {
    if (cart.length === 0 || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          items: cart,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Checkout API Error:", data);
        alert(data?.error || "Stripe checkout failed");
        setLoading(false);
        return;
      }

      if (data.url) {
      sessionStorage.setItem("stripe_checkout_started", "1");
window.location.assign(data.url);
        return;
      }

      alert("Stripe URL missing");
      setLoading(false);
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={toggleCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:max-w-md bg-white dark:bg-[#121212] shadow-2xl transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b dark:border-zinc-800">
            <h2 className="text-lg sm:text-xl font-black uppercase italic">
              Your Order ({cart.length})
            </h2>

            <button
              onClick={toggleCart}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                <ShoppingBag size={48} className="mb-4 opacity-20" />
                <p className="font-bold">Your cart is empty</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.cartId}-${index}`}
                  className="flex gap-3 sm:gap-4 p-3 border dark:border-zinc-800 rounded-2xl"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-grow">
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="font-bold text-sm leading-tight">
                        {item.quantity}x {item.title}
                      </h4>

                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.size?.label && (
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Size: {item.size.label}
                      </p>
                    )}

                    {item.toppings &&
                      Object.keys(item.toppings).length > 0 && (
                        <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                          Toppings:{" "}
                          {Object.entries(item.toppings)
                            .map(([name, side]) => `${name} (${side})`)
                            .join(", ")}
                        </p>
                      )}

                    {item.sauces && item.sauces.length > 0 && (
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        Sauces: {item.sauces.join(", ")}
                      </p>
                    )}

                    {item.note && (
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Note: {item.note}
                      </p>
                    )}

                    <p className="font-black mt-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}

            {cart.length > 0 && upsellSections.length > 0 && (
              <div className="mt-8 space-y-6">
                {upsellSections.map((section) => (
                  <div key={section.key}>
                    <h3 className="text-xs font-black uppercase mb-3 text-zinc-400">
                      Complete your meal with {section.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      {section.items.map((up) => (
                        <div
                          key={up.cartId}
                          className="p-3 border dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50"
                        >
                          <div className="relative h-24 sm:h-28 w-full rounded-lg overflow-hidden mb-3 bg-zinc-100">
                            <Image
                              src={up.image}
                              alt={up.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="text-[12px] font-bold mb-3 line-clamp-2 min-h-[34px]">
                            {up.title}
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-black">
                              ${up.price.toFixed(2)}
                            </span>

                            <button
                              onClick={() => addItem(up)}
                              className="bg-[#DA3327] text-white w-8 h-8 rounded-lg text-xs font-black"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5 border-t dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-zinc-500 uppercase text-xs">
                Subtotal
              </span>

              <span className="text-xl font-black">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleStripeCheckout}
              disabled={loading || cart.length === 0}
              className="w-full bg-[#DA3327] hover:bg-red-700 text-white h-14 rounded-2xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-60"
            >
              {loading ? "Redirecting..." : "Go to Checkout"}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}