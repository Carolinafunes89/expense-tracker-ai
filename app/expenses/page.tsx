"use client";

import { useMemo, useState } from "react";
import { Plus, Download } from "lucide-react";
import { useExpenses } from "@/context/ExpenseProvider";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/PageHeader";
import { ExpenseFilters } from "@/components/ExpenseFilters";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingState } from "@/components/ui/Loading";
import { exportExpensesToCSV, filterExpenses } from "@/lib/utils";
import type { Expense, ExpenseFilters as Filters } from "@/lib/types";

const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "all",
  from: "",
  to: "",
};

export default function ExpensesPage() {
  const { expenses, loading, deleteExpense } = useExpenses();
  const { toast } = useToast();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);

  const filtered = useMemo(
    () => filterExpenses(expenses, filters),
    [expenses, filters],
  );

  if (loading) return <LoadingState />;

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteExpense(pendingDelete.id);
    toast("Expense deleted", "info");
    setPendingDelete(null);
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      toast("Nothing to export", "error");
      return;
    }
    exportExpensesToCSV(filtered);
    toast(`Exported ${filtered.length} expenses`);
  };

  const actions = (
    <>
      <button
        onClick={handleExport}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export CSV</span>
      </button>
      <button
        onClick={openAdd}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
      >
        <Plus className="h-4 w-4" />
        Add expense
      </button>
    </>
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Expenses"
        subtitle="Search, filter, and manage all your expenses."
        actions={actions}
      />

      <ExpenseFilters
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      <ExpenseList
        expenses={filtered}
        onEdit={openEdit}
        onDelete={(e) => setPendingDelete(e)}
      />

      <ExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        expense={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete expense"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.description}"? This action cannot be undone.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
