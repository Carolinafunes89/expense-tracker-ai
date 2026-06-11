import {
  UtensilsCrossed,
  Car,
  Clapperboard,
  ShoppingBag,
  Receipt,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "./types";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  /** Hex color used for charts and accents. */
  color: string;
  /** Tailwind utility classes for badges. */
  badge: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "food",
    label: "Food",
    icon: UtensilsCrossed,
    color: "#10b981",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  {
    id: "transportation",
    label: "Transportation",
    icon: Car,
    color: "#3b82f6",
    badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: Clapperboard,
    color: "#8b5cf6",
    badge: "bg-violet-50 text-violet-700 ring-violet-600/20",
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
    color: "#ec4899",
    badge: "bg-pink-50 text-pink-700 ring-pink-600/20",
  },
  {
    id: "bills",
    label: "Bills",
    icon: Receipt,
    color: "#f59e0b",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  {
    id: "other",
    label: "Other",
    icon: Boxes,
    color: "#64748b",
    badge: "bg-slate-100 text-slate-700 ring-slate-600/20",
  },
];

const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CategoryId, CategoryMeta>,
);

export function getCategory(id: CategoryId): CategoryMeta {
  return CATEGORY_MAP[id] ?? CATEGORY_MAP.other;
}
