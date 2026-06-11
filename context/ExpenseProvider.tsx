"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Expense, ExpenseDraft } from "@/lib/types";
import { loadExpenses, saveExpenses } from "@/lib/storage";
import { generateId } from "@/lib/utils";

interface ExpenseContextValue {
  expenses: Expense[];
  loading: boolean;
  addExpense: (draft: ExpenseDraft) => void;
  updateExpense: (id: string, draft: ExpenseDraft) => void;
  deleteExpense: (id: string) => void;
  replaceAll: (expenses: Expense[]) => void;
  clearAll: () => void;
}

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

/** Newest first, by date then creation time. */
function sortExpenses(expenses: Expense[]): Expense[] {
  return expenses
    .slice()
    .sort((a, b) =>
      a.date === b.date
        ? b.createdAt.localeCompare(a.createdAt)
        : b.date.localeCompare(a.date),
    );
}

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage once, on the client.
  useEffect(() => {
    setExpenses(sortExpenses(loadExpenses()));
    setLoading(false);
  }, []);

  // Persist on every change (after initial load).
  useEffect(() => {
    if (!loading) saveExpenses(expenses);
  }, [expenses, loading]);

  const addExpense = useCallback((draft: ExpenseDraft) => {
    const expense: Expense = {
      ...draft,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => sortExpenses([expense, ...prev]));
  }, []);

  const updateExpense = useCallback((id: string, draft: ExpenseDraft) => {
    setExpenses((prev) =>
      sortExpenses(
        prev.map((e) => (e.id === id ? { ...e, ...draft } : e)),
      ),
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const replaceAll = useCallback((next: Expense[]) => {
    setExpenses(sortExpenses(next));
  }, []);

  const clearAll = useCallback(() => setExpenses([]), []);

  const value = useMemo<ExpenseContextValue>(
    () => ({
      expenses,
      loading,
      addExpense,
      updateExpense,
      deleteExpense,
      replaceAll,
      clearAll,
    }),
    [expenses, loading, addExpense, updateExpense, deleteExpense, replaceAll, clearAll],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}

export function useExpenses(): ExpenseContextValue {
  const ctx = useContext(ExpenseContext);
  if (!ctx) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return ctx;
}
