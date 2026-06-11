import { getCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/lib/types";

export function CategoryBadge({ category }: { category: CategoryId }) {
  const meta = getCategory(category);
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        meta.badge,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}
