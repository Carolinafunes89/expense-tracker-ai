export type CategoryId =
  | "food"
  | "transportation"
  | "entertainment"
  | "shopping"
  | "bills"
  | "other";

export interface Expense {
  id: string;
  /** Positive number, stored in major currency units (e.g. dollars). */
  amount: number;
  category: CategoryId;
  description: string;
  /** ISO date string: yyyy-MM-dd */
  date: string;
  /** ISO timestamp of creation */
  createdAt: string;
}

/** Shape used by the add/edit form before an id is assigned. */
export type ExpenseDraft = Omit<Expense, "id" | "createdAt">;

export interface ExpenseFilters {
  search: string;
  category: CategoryId | "all";
  from: string; // yyyy-MM-dd or ""
  to: string; // yyyy-MM-dd or ""
}
