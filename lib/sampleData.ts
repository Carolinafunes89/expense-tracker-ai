import { format, subDays } from "date-fns";
import type { Expense } from "./types";
import { generateId } from "./utils";

interface Seed {
  daysAgo: number;
  amount: number;
  category: Expense["category"];
  description: string;
}

const SEEDS: Seed[] = [
  { daysAgo: 0, amount: 12.5, category: "food", description: "Lunch at cafe" },
  { daysAgo: 1, amount: 45.0, category: "transportation", description: "Gas fill-up" },
  { daysAgo: 2, amount: 89.99, category: "shopping", description: "New running shoes" },
  { daysAgo: 3, amount: 15.99, category: "entertainment", description: "Movie ticket" },
  { daysAgo: 5, amount: 120.0, category: "bills", description: "Electricity bill" },
  { daysAgo: 6, amount: 34.2, category: "food", description: "Groceries" },
  { daysAgo: 9, amount: 9.5, category: "transportation", description: "Subway pass" },
  { daysAgo: 12, amount: 59.0, category: "entertainment", description: "Concert tickets" },
  { daysAgo: 18, amount: 220.0, category: "bills", description: "Internet + phone" },
  { daysAgo: 24, amount: 76.4, category: "shopping", description: "Household supplies" },
  { daysAgo: 33, amount: 42.0, category: "food", description: "Dinner with friends" },
  { daysAgo: 40, amount: 18.75, category: "other", description: "Stationery" },
  { daysAgo: 47, amount: 95.0, category: "bills", description: "Water bill" },
  { daysAgo: 55, amount: 64.3, category: "shopping", description: "Birthday gift" },
  { daysAgo: 70, amount: 28.0, category: "transportation", description: "Taxi ride" },
];

export function buildSampleExpenses(): Expense[] {
  const now = new Date();
  return SEEDS.map((s) => ({
    id: generateId(),
    amount: s.amount,
    category: s.category,
    description: s.description,
    date: format(subDays(now, s.daysAgo), "yyyy-MM-dd"),
    createdAt: new Date().toISOString(),
  }));
}
