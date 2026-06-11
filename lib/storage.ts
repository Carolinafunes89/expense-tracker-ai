import type { Expense } from "./types";

const STORAGE_KEY = "expense-tracker:expenses";

function isExpense(value: unknown): value is Expense {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.amount === "number" &&
    typeof e.category === "string" &&
    typeof e.description === "string" &&
    typeof e.date === "string" &&
    typeof e.createdAt === "string"
  );
}

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isExpense);
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // Storage may be full or unavailable (private mode); fail silently.
  }
}
