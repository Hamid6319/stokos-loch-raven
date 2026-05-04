"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  // States
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState({ label: "Medium 12\"", price: 9.99 });
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(product.price);

  // Options Data (Ideally comes from product prop)
  const sizes = [
    { label: "Medium 12\"", price: 9.99 },
    { label: "Large 14\"", price: 10.99 },
    { label: "X-Large 16\"", price: 11.99 },
  ];

  const toppings = [
    { name: "Extra Cheese", price: 1.5 },
  { name: "Pepperoni", price: 1.5 },
  { name: "Chicken", price: 1.5 },
  { name: "Ham", price: 1.5 },
  { name: "Meatballs", price: 1.5 },
  { name: "Salami", price: 1.5 },
  { name: "Sausage", price: 1.5 },
  { name: "Bacon", price: 1.5 },
  { name: "Ground Beef", price: 1.5 },
  { name: "Beef Pepperoni", price: 3.0 },
  { name: "Broccoli", price: 1.5 },
  { name: "Pineapple", price: 1.5 },
  { name: "Banana Peppers", price: 1.5 },
  { name: "Onions", price: 1.5 },
  { name: "Spinach", price: 1.5 },
  { name: "Black Olives", price: 1.5 },
  { name: "Mushrooms", price: 1.5 },
  { name: "Jalapeno Peppers", price: 1.5 },
  { name: "Green Peppers", price: 1.5 },
  ];

  const sauces = [
     { name: "Blue Cheese Dipping Sauce", price: 0.5 },
  { name: "French Dipping Sauce", price: 0.5 },
  { name: "Creamy Italian Dipping Sauce", price: 0.5 },
  { name: "Lite Italian Dipping Sauce", price: 0.5 },
  { name: "1000 Island Dipping Sauce", price: 0.5 },
  { name: "Fat Free Honey Dijon Dipping Sauce", price: 0.5 },
  { name: "Ranch Dipping Sauce", price: 0.5 },
  ];

  // Price Calculation Logic
  useEffect(() => {
    let base = selectedSize.price;
    
    // Toppings sum
    const toppingsTotal = selectedToppings.reduce((acc, name) => {
      const item = toppings.find(t => t.name === name);
      return acc + (item?.price || 0);
    }, 0);

    // Sauces sum
    const saucesTotal = selectedSauces.reduce((acc, name) => {
      const item = sauces.find(s => s.name === name);
      return acc + (item?.price || 0);
    }, 0);

    setTotalPrice(((base + toppingsTotal + saucesTotal) * quantity).toFixed(2));
  }, [selectedSize, selectedToppings, selectedSauces, quantity]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#121212] w-full max-w-lg rounded-3xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl relative">
        
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-5 border-b dark:border-zinc-800 bg-white dark:bg-[#121212] sticky top-0 z-10">
          <h2 className="text-xl font-black uppercase tracking-tight dark:text-white">{product.title}</h2>
          <button onClick={onClose} className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow p-0 no-scrollbar">
          <div className="relative w-full aspect-[16/10]">
            <Image src={product.image} alt={product.title} fill className="object-cover" />
          </div>

          <div className="p-6 space-y-8">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">{product.description}</p>

            {/* Sizes */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black uppercase text-sm tracking-widest">Choose an Option</h3>
                <span className="text-[10px] text-zinc-500 uppercase">Required, select one</span>
              </div>
              <div className="space-y-3">
                {sizes.map((size) => (
                  <label key={size.label} className="flex items-center justify-between p-3 border dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="size" 
                        checked={selectedSize.label === size.label}
                        onChange={() => setSelectedSize(size)}
                        className="w-5 h-5 accent-black" 
                      />
                      <span className="font-bold text-sm">{size.label}</span>
                    </div>
                    <span className="font-bold text-sm">${size.price}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Toppings */}
            <section>
                <h3 className="font-black uppercase text-sm tracking-widest mb-4">Add Toppings</h3>
                <div className="space-y-3">
                    {toppings.map((item) => (
                        <label key={item.name} className="flex items-center justify-between py-2 border-b dark:border-zinc-800 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    onChange={(e) => {
                                        if(e.target.checked) setSelectedToppings([...selectedToppings, item.name]);
                                        else setSelectedToppings(selectedToppings.filter(t => t !== item.name));
                                    }}
                                    className="w-5 h-5 accent-green-600 rounded" 
                                />
                                <span className="text-sm font-semibold">{item.name}</span>
                            </div>
                            <span className="text-sm font-bold text-zinc-500">+${item.price.toFixed(2)}</span>
                        </label>
                    ))}
                </div>
            </section>
          </div>
        </div>

        {/* Footer with Controls */}
        <div className="p-5 border-t dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center bg-white dark:bg-black rounded-full p-1 border dark:border-zinc-800">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <Minus size={18} />
                    </button>
                    <span className="w-10 text-center font-black text-lg">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <button className="flex-grow ml-4 bg-[#1a1a1a] dark:bg-white dark:text-black text-white h-12 rounded-xl flex items-center justify-between px-6 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg">
                    <span className="font-black uppercase tracking-tighter text-sm">Add to Order</span>
                    <span className="font-black text-lg">${totalPrice}</span>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}