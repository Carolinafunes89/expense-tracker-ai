"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "./ui/Modal";
import { useExpenses } from "@/context/ExpenseProvider";
import { useToast } from "./ui/Toast";
import { CATEGORIES } from "@/lib/categories";
import { cn, todayISO } from "@/lib/utils";
import type { CategoryId, Expense, ExpenseDraft } from "@/lib/types";

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  /** When provided, the form edits this expense instead of creating a new one. */
  expense?: Expense | null;
}

interface FormState {
  amount: string;
  category: CategoryId;
  date: string;
  description: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm = (): FormState => ({
  amount: "",
  category: "food",
  date: todayISO(),
  description: "",
});

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  const amount = Number(form.amount);
  if (!form.amount.trim()) {
    errors.amount = "Amount is required.";
  } else if (Number.isNaN(amount)) {
    errors.amount = "Enter a valid number.";
  } else if (amount <= 0) {
    errors.amount = "Amount must be greater than zero.";
  } else if (amount > 1_000_000) {
    errors.amount = "Amount looks too large.";
  }

  if (!form.date) {
    errors.date = "Date is required.";
  } else if (form.date > todayISO()) {
    errors.date = "Date cannot be in the future.";
  }

  if (!form.description.trim()) {
    errors.description = "Description is required.";
  } else if (form.description.trim().length > 80) {
    errors.description = "Keep it under 80 characters.";
  }

  return errors;
}

export function ExpenseForm({ open, onClose, expense }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenses();
  const { toast } = useToast();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(expense);

  // Sync form state when opening or switching the target expense.
  useEffect(() => {
    if (!open) return;
    if (expense) {
      setForm({
        amount: String(expense.amount),
        category: expense.category,
        date: expense.date,
        description: expense.description,
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [open, expense]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    // Brief delay to surface the loading state on this synchronous store.
    await new Promise((r) => setTimeout(r, 350));

    const draft: ExpenseDraft = {
      amount: Math.round(Number(form.amount) * 100) / 100,
      category: form.category,
      date: form.date,
      description: form.description.trim(),
    };

    if (expense) {
      updateExpense(expense.id, draft);
      toast("Expense updated");
    } else {
      addExpense(draft);
      toast("Expense added");
    }

    setSubmitting(false);
    onClose();
  };

  const inputBase =
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit expense" : "Add expense"}
      description={
        isEditing ? "Update the details below." : "Record a new expense."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700">
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              $
            </span>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              className={cn(inputBase, "pl-7", errors.amount && "border-red-400 focus:ring-red-500/30 focus:border-red-500")}
              aria-invalid={Boolean(errors.amount)}
            />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
        </div>

        {/* Category */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Category</span>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = form.category === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => update("category", c.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition",
                    active
                      ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  <Icon className="h-5 w-5" style={{ color: c.color }} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            max={todayISO()}
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className={cn(inputBase, errors.date && "border-red-400 focus:ring-red-500/30 focus:border-red-500")}
            aria-invalid={Boolean(errors.date)}
          />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="e.g. Lunch at cafe"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={cn(inputBase, errors.description && "border-red-400 focus:ring-red-500/30 focus:border-red-500")}
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-w-[7rem] items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Saving..." : isEditing ? "Save changes" : "Add expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
