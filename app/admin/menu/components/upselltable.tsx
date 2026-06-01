"use client";

import type { UpsellRule } from "../types";
import { ActionButtons, EmptyBox, ImageBox, StatusBadge, TableHead } from "./ui";

type MongoUpsellRule = UpsellRule & {
  _id?: string;
  id?: string;
  name?: string;
  appliesToCategories?: string[];
};

function getUpsellId(rule: MongoUpsellRule, fallback: string) {
  return String(rule._id || rule.id || rule.slug || rule.offer || fallback);
}

export default function UpsellTable({
  upsellRules = [],
  onEdit,
  onDelete,
}: {
  upsellRules?: UpsellRule[];
  onEdit: (upsell: UpsellRule) => void;
  onDelete: (id: string) => void;
}) {
  const safeUpsells = Array.isArray(upsellRules)
    ? (upsellRules as MongoUpsellRule[])
    : [];

  if (safeUpsells.length === 0) {
    return <EmptyBox message="No upsell rules found." />;
  }

  return (
    <div className="overflow-hidden rounded-[26px] border border-zinc-200">
      <div className="border-b border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-lg font-black">Upsell Rules</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Suggest checkout add-ons based on product category or cart.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead className="border-b border-zinc-200 bg-white">
            <tr>
              <TableHead>Upsell</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {safeUpsells.map((rule, index) => {
              const ruleId = getUpsellId(rule, `upsell-${index}`);

              return (
                <tr key={ruleId} className="transition hover:bg-green-50/50">
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <ImageBox
                        src={rule.image || ""}
                        alt={rule.offer || rule.name || "Upsell"}
                      />

                      <div>
                        <p className="font-black text-zinc-950">
                          {rule.offer || rule.name || "No offer"}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-zinc-500">
                          {ruleId}
                        </p>

                        {Array.isArray(rule.appliesToCategories) &&
                          rule.appliesToCategories.length > 0 && (
                            <p className="mt-1 text-xs font-semibold text-zinc-400">
                              Categories: {rule.appliesToCategories.join(", ")}
                            </p>
                          )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 text-sm font-black">
                    {rule.trigger || "Any Product"}
                  </td>

                  <td className="px-5 py-5">
                    <StatusBadge status={rule.status || "Paused"} />
                  </td>

                  <td className="px-5 py-5">
                    <ActionButtons
                      onEdit={() => onEdit(rule)}
                      onDelete={() => onDelete(ruleId)}
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