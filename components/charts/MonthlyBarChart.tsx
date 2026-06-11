"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Expense } from "@/lib/types";
import { formatCompactCurrency, formatCurrency, monthlyTotals } from "@/lib/utils";
import { EmptyChart, tooltipStyle } from "./CategoryPieChart";

export function MonthlyBarChart({ expenses }: { expenses: Expense[] }) {
  const data = monthlyTotals(expenses, 6);
  const hasData = data.some((d) => d.total > 0);

  if (!hasData) {
    return <EmptyChart message="No monthly data yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          tickFormatter={(v: number) => formatCompactCurrency(v)}
          width={56}
        />
        <Tooltip
          cursor={{ fill: "#f8fafc" }}
          formatter={(value: number) => [formatCurrency(value), "Spent"]}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
          contentStyle={tooltipStyle}
        />
        <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
