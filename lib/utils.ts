import {
  format,
  parseISO,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import type { Expense, ExpenseFilters } from "./types";
import { getCategory } from "./categories";

/** Tiny classNames joiner. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Compact currency, e.g. $1.2k — used for tight chart axes. */
export function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

/** yyyy-MM-dd for today, suitable for <input type="date"> defaults. */
export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Apply search + category + date-range filters. */
export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFilters,
): Expense[] {
  const search = filters.search.trim().toLowerCase();

  return expenses.filter((e) => {
    if (filters.category !== "all" && e.category !== filters.category) {
      return false;
    }

    if (search) {
      const haystack = `${e.description} ${getCategory(e.category).label}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (filters.from && e.date < filters.from) return false;
    if (filters.to && e.date > filters.to) return false;

    return true;
  });
}

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((total, e) => total + e.amount, 0);
}

export function spentThisMonth(expenses: Expense[], ref: Date = new Date()): number {
  const start = startOfMonth(ref);
  const end = endOfMonth(ref);
  return sumExpenses(
    expenses.filter((e) => {
      const d = parseISO(e.date);
      return isWithinInterval(d, { start, end });
    }),
  );
}

export interface CategoryTotal {
  category: ReturnType<typeof getCategory>;
  total: number;
}

/** Totals per category, sorted descending, excluding empty categories. */
export function totalsByCategory(expenses: Expense[]): CategoryTotal[] {
  const map = new Map<string, number>();
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  }
  return Array.from(map.entries())
    .map(([id, total]) => ({ category: getCategory(id as Expense["category"]), total }))
    .sort((a, b) => b.total - a.total);
}

export interface MonthlyTotal {
  month: string; // "Jan"
  label: string; // "Jan 2026"
  total: number;
}

/** Spending totals for the last `count` months, oldest first. */
export function monthlyTotals(
  expenses: Expense[],
  count = 6,
  ref: Date = new Date(),
): MonthlyTotal[] {
  const buckets: MonthlyTotal[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const monthDate = subMonths(ref, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const total = sumExpenses(
      expenses.filter((e) =>
        isWithinInterval(parseISO(e.date), { start, end }),
      ),
    );
    buckets.push({
      month: format(monthDate, "MMM"),
      label: format(monthDate, "MMM yyyy"),
      total,
    });
  }

  return buckets;
}

/** Build a CSV string and trigger a browser download. */
export function exportExpensesToCSV(expenses: Expense[]): void {
  const headers = ["Date", "Category", "Description", "Amount"];
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const rows = expenses
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((e) =>
      [
        e.date,
        getCategory(e.category).label,
        escape(e.description),
        e.amount.toFixed(2),
      ].join(","),
    );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `expenses-${todayISO()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
