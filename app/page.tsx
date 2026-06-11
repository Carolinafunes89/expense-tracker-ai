"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Sparkles, ArrowRight, PiggyBank } from "lucide-react";
import { useExpenses } from "@/context/ExpenseProvider";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { ExpenseForm } from "@/components/ExpenseForm";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LoadingState } from "@/components/ui/Loading";
import { buildSampleExpenses } from "@/lib/sampleData";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { expenses, loading, replaceAll } = useExpenses();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);

  if (loading) return <LoadingState />;

  const loadSample = () => {
    replaceAll(buildSampleExpenses());
    toast("Sample data loaded");
  };

  const addButton = (
    <button
      onClick={() => setFormOpen(true)}
      className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
    >
      <Plus className="h-4 w-4" />
      Add expense
    </button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="An overview of your spending."
        actions={addButton}
      />

      {expenses.length === 0 ? (
        <EmptyDashboard onAdd={() => setFormOpen(true)} onLoadSample={loadSample} />
      ) : (
        <>
          <SummaryCards expenses={expenses} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard title="Spending by category">
              <CategoryPieChart expenses={expenses} />
            </ChartCard>
            <ChartCard title="Monthly spending" subtitle="Last 6 months">
              <MonthlyBarChart expenses={expenses} />
            </ChartCard>
          </div>

          <RecentExpenses />
        </>
      )}

      <ExpenseForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function RecentExpenses() {
  const { expenses } = useExpenses();
  const recent = expenses.slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Recent expenses</h2>
        <Link
          href="/expenses"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ul className="divide-y divide-slate-100">
        {recent.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <CategoryBadge category={e.category} />
              <span className="truncate text-sm text-slate-700">{e.description}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-slate-400 sm:inline">
                {formatDate(e.date)}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {formatCurrency(e.amount)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyDashboard({
  onAdd,
  onLoadSample,
}: {
  onAdd: () => void;
  onLoadSample: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
        <PiggyBank className="h-7 w-7 text-brand-600" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        Start tracking your expenses
      </h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Add your first expense to see summaries and charts here, or load some
        sample data to explore the app.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Add expense
        </button>
        <button
          onClick={onLoadSample}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Sparkles className="h-4 w-4 text-brand-500" />
          Load sample data
        </button>
      </div>
    </div>
  );
}
