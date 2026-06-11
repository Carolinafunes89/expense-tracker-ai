"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { Expense } from "@/lib/types";
import { formatCurrency, totalsByCategory } from "@/lib/utils";

export function CategoryPieChart({ expenses }: { expenses: Expense[] }) {
  const data = totalsByCategory(expenses).map((t) => ({
    name: t.category.label,
    value: Math.round(t.total * 100) / 100,
    color: t.category.color,
  }));

  if (data.length === 0) {
    return <EmptyChart message="No spending to chart yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={tooltipStyle}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 13, color: "#475569" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
  fontSize: 13,
} as const;

export function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-slate-400">
      {message}
    </div>
  );
}
