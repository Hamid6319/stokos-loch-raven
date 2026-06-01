"use client";

import type { Category, Product } from "../types";
import { ActionButtons, EmptyBox, StatusBadge, TableHead } from "./ui";

export default function CategoryTable({
  categories,
  products,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  products: Product[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}) {
  if (!categories.length) return <EmptyBox message="No categories found." />;

  return (
    <div className="overflow-hidden rounded-[26px] border border-zinc-200">
      <div className="border-b border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-lg font-black">Categories</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Control menu sections and display order.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-zinc-200 bg-white">
            <tr>
              <TableHead>Category</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {categories
              .slice()
              .sort(
                (a, b) =>
                  Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
              )
              .map((category, index) => {
                const categoryId = String(
                  (category as Category & { _id?: string })._id ||
                    category.id ||
                    `${category.name}-${index}`
                );

                return (
                  <tr
                    key={categoryId}
                    className="transition hover:bg-green-50/50"
                  >
                    <td className="px-5 py-5">
                      <p className="font-black text-zinc-950">
                        {category.name}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-zinc-500">
                        {categoryId}
                      </p>
                    </td>

                    <td className="px-5 py-5 text-sm font-black">
                      {
                        products.filter(
                          (product) => product.category === category.name
                        ).length
                      }
                    </td>

                    <td className="px-5 py-5 text-sm font-black">
                      #{category.sortOrder || 0}
                    </td>

                    <td className="px-5 py-5">
                      <StatusBadge status={category.status} />
                    </td>

                    <td className="px-5 py-5">
                      <ActionButtons
                        onEdit={() => onEdit(category)}
                        onDelete={() => onDelete(categoryId)}
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