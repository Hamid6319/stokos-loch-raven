"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";

type Product = {
  id: string;
  title: string;
  category: string;
  store: string;
  price: string;
  image: string;
  description: string;
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Tomato & Cheese Pizza",
    category: "Pizzas",
    store: "Towson",
    price: "9.99",
    image: "/images/pizza.png",
    description: "Classic cheese pizza with tomato sauce.",
  },
  {
    id: "2",
    title: "Half Sub Combo",
    category: "Deals",
    store: "Towson",
    price: "12.99",
    image: "/images/subcombo.png",
    description: "Half sub with fries and soda.",
  },
];

export default function ProductManagementDemo() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "Pizzas",
    store: "Towson",
    price: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("stokos_mock_products");

    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("stokos_mock_products", JSON.stringify(updatedProducts));
  };

  const resetForm = () => {
    setForm({
      title: "",
      category: "Pizzas",
      store: "Towson",
      price: "",
      image: "",
      description: "",
    });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.title || !form.price) return;

    if (editingId) {
      const updated = products.map((product) =>
        product.id === editingId
          ? {
              ...product,
              ...form,
            }
          : product
      );

      saveProducts(updated);
      resetForm();
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      ...form,
    };

    saveProducts([newProduct, ...products]);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      category: product.category,
      store: product.store,
      price: product.price,
      image: product.image,
      description: product.description,
    });
  };

  const handleDelete = (id: string) => {
    const updated = products.filter((product) => product.id !== id);
    saveProducts(updated);
  };

  return (
    <section className="w-full rounded-3xl bg-white p-6 shadow-sm dark:bg-[#121212]">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-black dark:text-white">
            Product Management
          </h2>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Demo UI using mock/local data. Backend can connect APIs later.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="mb-8 grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-black md:grid-cols-2 lg:grid-cols-3">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Product name"
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-neutral-800 dark:bg-[#181818] dark:text-white"
        />

        <input
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price"
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-neutral-800 dark:bg-[#181818] dark:text-white"
        />

        <input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="/images/product.png"
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-neutral-800 dark:bg-[#181818] dark:text-white"
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-neutral-800 dark:bg-[#181818] dark:text-white"
        >
          <option>Pizzas</option>
          <option>Deals</option>
          <option>Breakfast</option>
          <option>Subs</option>
          <option>Wings</option>
          <option>Sides</option>
        </select>

        <select
          value={form.store}
          onChange={(e) => setForm({ ...form, store: e.target.value })}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-neutral-800 dark:bg-[#181818] dark:text-white"
        >
          <option>Towson</option>
          <option>York</option>
          <option>Liberty</option>
        </select>

        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-neutral-800 dark:bg-[#181818] dark:text-white"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#DA3327] px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-[#12863d] md:col-span-2 lg:col-span-3"
        >
          <Plus size={18} />
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_120px] bg-neutral-100 px-4 py-3 text-xs font-black uppercase text-neutral-600 dark:bg-[#181818] dark:text-neutral-400 md:grid">
          <span>Product</span>
          <span>Category</span>
          <span>Store</span>
          <span>Price</span>
          <span>Actions</span>
        </div>

        {products.map((product) => (
          <div
            key={product.id}
            className="grid gap-3 border-t border-neutral-200 px-4 py-4 dark:border-neutral-800 md:grid-cols-[1.5fr_1fr_1fr_1fr_120px] md:items-center"
          >
            <div>
              <h3 className="text-sm font-black text-black dark:text-white">
                {product.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {product.description}
              </p>
            </div>

            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              {product.category}
            </p>

            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              {product.store}
            </p>

            <p className="text-sm font-black text-[#DA3327]">
              ${product.price}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleEdit(product)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-black transition hover:bg-[#DA3327] hover:text-white dark:bg-[#181818] dark:text-white"
              >
                <Edit size={16} />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(product.id)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-black transition hover:bg-[#DA3327] hover:text-white dark:bg-[#181818] dark:text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}