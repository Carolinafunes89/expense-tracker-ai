"use client";

import { Search, X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { ExpenseFilters as Filters } from "@/lib/types";

interface ExpenseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
}

export function ExpenseFilters({ filters, onChange, resultCount }: ExpenseFiltersProps) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const isFiltered =
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.from !== "" ||
    filters.to !== "";

  const clear = () =>
    onChange({ search: "", category: "all", from: "", to: "" });

  const fieldBase =
    "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search description..."
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className={cn(fieldBase, "w-full pl-9")}
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => set("category", e.target.value as Filters["category"])}
          className={cn(fieldBase, "w-full")}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {/* From */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500">From</label>
          <input
            type="date"
            value={filters.from}
            max={filters.to || undefined}
            onChange={(e) => set("from", e.target.value)}
            className={cn(fieldBase, "w-full")}
          />
        </div>

        {/* To */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500">To</label>
          <input
            type="date"
            value={filters.to}
            min={filters.from || undefined}
            onChange={(e) => set("to", e.target.value)}
            className={cn(fieldBase, "w-full")}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {resultCount} {resultCount === 1 ? "expense" : "expenses"}
        </p>
        {isFiltered && (
          <button
            onClick={clear}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition hover:text-brand-700"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
