// Th (KIT-02) — a sortable table header cell: a plain `<button>` INSIDE the `<th>`
// (no overlay, no menu, no engine) carrying the column label + a Lucide sort arrow
// (`arrow-up` asc / `arrow-down` desc / `arrow-up-down` unsorted) and `aria-sort`
// on the `<th>` (ascending / descending / none). Sort state is a CONTROLLED prop —
// the parent owns it (D-01); `onSort` is the parent's intent, here inert in the
// catalog. The button is the ≥44px hit area (Pitfall 3); numeric columns align the
// header right to match `table-cell-numeric`.
//
// `data-state` drives the static catalog matrix (RESEARCH Pattern 2): each forced
// state maps to the SAME token utilities the live `:hover`/`:focus-visible` apply,
// so one cell renders hover/pressed/focused with no real pointer. `/lite` is the
// tailwind-merge-free build. Class strings stay literal for the `@source` scan.
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { tv } from "tailwind-variants/lite";

/** The controlled sort direction for a column (`none` = unsorted). */
export type SortDirection = "ascending" | "descending" | "none";

/** Catalog-only forced interaction states (loading n/a for a header). */
export type ThState = "enabled" | "hover" | "pressed" | "focused";

type Props = {
  className?: string;
  /** The visible column label (RU primary / EN mirror), from `_fixtures/STRINGS`. */
  label: string;
  /** The controlled sort direction for this column (parent owns it — D-01). */
  sort: SortDirection;
  /** Accessible action name for the sort button (e.g. «сортировать по Счёт»). */
  sortLabel: string;
  /** Right-align the header (numeric columns) to match `table-cell-numeric`. */
  numeric?: boolean;
  /** Parent sort intent — inert in the catalog (no engine, D-01). */
  onSort?: () => void;
  /** Forced state for the static catalog matrix only (no real pointer). */
  forcedState?: ThState;
};

// The header button. `base` carries the real interaction utilities so a live header
// works; the `state` variant is the catalog override applied via `data-state`. The
// `min-h-11` keeps the 44px hit area on the control itself (Pitfall 3).
const thButton = tv({
  base: "flex min-h-11 w-full items-center gap-1.5 rounded-sm px-3 font-body text-xs font-semibold uppercase tracking-label text-text-muted transition-colors hover:text-text-primary active:translate-y-px focus-visible:outline-none focus-visible:shadow-(--shadow-ring)",
  variants: {
    state: {
      enabled: "",
      hover: "text-text-primary",
      pressed: "translate-y-px text-text-primary",
      focused: "shadow-(--shadow-ring) outline-none",
    },
    numeric: {
      true: "justify-end",
      false: "justify-start",
    },
    /** A sorted column's label is cyan — paired with the directional arrow + aria-sort (never color-alone). */
    active: {
      true: "text-primary",
      false: "",
    },
  },
});

/** The directional arrow for the current sort state (decorative — aria-sort carries meaning). */
function SortArrow({ sort }: { sort: SortDirection }): ReactNode {
  if (sort === "ascending") return <ArrowUp className="size-4 shrink-0 text-primary" aria-hidden />;
  if (sort === "descending")
    return <ArrowDown className="size-4 shrink-0 text-primary" aria-hidden />;
  // Unsorted: the muted bidirectional affordance signalling the column IS sortable.
  return <ArrowUpDown className="size-4 shrink-0 text-text-subtle" aria-hidden />;
}

export function Th({
  className,
  label,
  sort,
  sortLabel,
  numeric = false,
  onSort,
  forcedState,
}: Props): ReactNode {
  const isActive = sort !== "none";
  return (
    <th
      scope="col"
      aria-sort={sort}
      data-th={label}
      className={`h-11 bg-surface-2 p-0 ${className ?? ""}`}
    >
      <button
        type="button"
        aria-label={sortLabel}
        data-state={forcedState}
        onClick={onSort}
        className={thButton({ state: forcedState, numeric, active: isActive })}
      >
        {/* Numeric headers put the arrow on the left of a right-aligned label so the
            arrow sits between the label and the column edge; text headers trail it. */}
        {numeric ? <SortArrow sort={sort} /> : null}
        <span className="truncate">{label}</span>
        {numeric ? null : <SortArrow sort={sort} />}
      </button>
    </th>
  );
}
