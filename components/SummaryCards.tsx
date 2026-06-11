"use client";

import { Wallet, CalendarDays, Hash, TrendingUp } from "lucide-react";
import type { Expense } from "@/lib/types";
import {
  formatCurrency,
  spentThisMonth,
  sumExpenses,
  totalsByCategory,
} from "@/lib/utils";

interface CardData {
  label: string;
  value: string;
  hint: string;
  icon: typeof Wallet;
  iconBg: string;
  iconColor: string;
}

export function SummaryCards({ expenses }: { expenses: Expense[] }) {
  const total = sumExpenses(expenses);
  const thisMonth = spentThisMonth(expenses);
  const byCategory = totalsByCategory(expenses);
  const top = byCategory[0];

  const cards: CardData[] = [
    {
      label: "Total spending",
      value: formatCurrency(total),
      hint: "All time",
      icon: Wallet,
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
    },
    {
      label: "This month",
      value: formatCurrency(thisMonth),
      hint: "Current calendar month",
      icon: CalendarDays,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Transactions",
      value: String(expenses.length),
      hint: "Total recorded",
      icon: Hash,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Top category",
      value: top ? top.category.label : "—",
      hint: top ? formatCurrency(top.total) : "No data yet",
      icon: TrendingUp,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:shadow-card-hover"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
          </div>
        );
      })}
    </div>
  );
}
