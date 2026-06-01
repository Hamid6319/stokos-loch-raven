"use client";

import type { Product } from "../types";
import { ActionButtons, EmptyBox, ImageBox, StatusBadge, TableHead } from "./ui";

type MongoObject = {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  offer?: string;
};

function getItemId(item: unknown, fallback: string) {
  if (typeof item === "object" && item !== null) {
    const obj = item as MongoObject;
    return String(obj._id || obj.id || fallback);
  }

  return fallback;
}

function getTextValue(value: unknown, fallback = "Not selected") {
  if (!value) return fallback;

  if (typeof value === "string") return value;

  if (typeof value === "number") return String(value);

  if (typeof value === "object") {
    const obj = value as MongoObject;
    return obj.name || obj.title || obj.offer || fallback;
  }

  return fallback;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  if (!products.length) return <EmptyBox message="No products found." />;

  return (
    <div className="overflow-hidden rounded-[26px] border border-zinc-200">
      <div className="border-b border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-lg font-black">Products</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Manage menu items, pricing, images, categories, and modifiers.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="border-b border-zinc-200 bg-white">
            <tr>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Modifiers</TableHead>
              <TableHead>Upsell</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {products.map((product, index) => {
              const productId = getItemId(
                product,
                `${product.name || "product"}-${index}`
              );

              const categoryName = getTextValue(
                (product as Product & { category?: unknown }).category,
                "No Category"
              );

              const upsellName = getTextValue(
                (product as Product & { upsell?: unknown }).upsell,
                "No upsell"
              );

              const modifierGroups = Array.isArray(product.modifierGroups)
                ? product.modifierGroups
                : [];

              return (
                <tr
                  key={productId}
                  className="transition hover:bg-green-50/50"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <ImageBox src={product.image} alt={product.name} />

                      <div>
                        <p className="font-black text-zinc-950">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-zinc-500">
                          {productId} · Updated {product.updatedAt || "Today"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-black text-zinc-700">
                      {categoryName}
                    </span>
                  </td>

                  <td className="px-5 py-5 text-sm font-black">
                    ${Number(product.price || 0).toFixed(2)}
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex max-w-[280px] flex-wrap gap-2">
                      {modifierGroups.length ? (
                        modifierGroups.map((group, groupIndex) => {
                          const groupLabel = getTextValue(
                            group,
                            "Modifier Group"
                          );

                          const groupId = getItemId(
                            group,
                            `${groupLabel}-${groupIndex}`
                          );

                          return (
                            <span
                              key={groupId}
                              className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-black text-green-800"
                            >
                              {groupLabel}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs font-semibold text-zinc-400">
                          No modifiers
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-5 text-sm font-semibold text-zinc-600">
                    {upsellName}
                  </td>

                  <td className="px-5 py-5">
                    <StatusBadge status={product.status || "Active"} />
                  </td>

                  <td className="px-5 py-5">
              <ActionButtons
  onEdit={() => onEdit(product)}
  onDelete={() => onDelete(productId)}
/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}