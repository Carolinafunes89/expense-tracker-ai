"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <p className="text-sm font-medium text-slate-600">No expenses found</p>
        <p className="mt-1 text-sm text-slate-400">
          Try adjusting your filters or add a new expense.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      {/* Desktop table */}
      <table className="hidden w-full text-left sm:table">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Description</th>
            <th className="px-5 py-3 text-right font-medium">Amount</th>
            <th className="px-5 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((e) => (
            <tr key={e.id} className="group transition hover:bg-slate-50/70">
              <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-600">
                {formatDate(e.date)}
              </td>
              <td className="px-5 py-3.5">
                <CategoryBadge category={e.category} />
              </td>
              <td className="px-5 py-3.5 text-sm text-slate-900">{e.description}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right text-sm font-semibold text-slate-900">
                {formatCurrency(e.amount)}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1 opacity-60 transition group-hover:opacity-100">
                  <ActionButton label="Edit expense" onClick={() => onEdit(e)}>
                    <Pencil className="h-4 w-4" />
                  </ActionButton>
                  <ActionButton label="Delete expense" danger onClick={() => onDelete(e)}>
                    <Trash2 className="h-4 w-4" />
                  </ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <ul className="divide-y divide-slate-100 sm:hidden">
        {expenses.map((e) => (
          <li key={e.id} className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <CategoryBadge category={e.category} />
                <span className="text-xs text-slate-400">{formatDate(e.date)}</span>
              </div>
              <p className="mt-1.5 truncate text-sm text-slate-900">{e.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-sm font-semibold text-slate-900">
                {formatCurrency(e.amount)}
              </span>
              <div className="flex gap-1">
                <ActionButton label="Edit expense" onClick={() => onEdit(e)}>
                  <Pencil className="h-4 w-4" />
                </ActionButton>
                <ActionButton label="Delete expense" danger onClick={() => onDelete(e)}>
                  <Trash2 className="h-4 w-4" />
                </ActionButton>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={
        danger
          ? "rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          : "rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      }
    >
      {children}
    </button>
  );
}
