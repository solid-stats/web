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
import { Button } from "../Button";

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

// GAP-19: the sort button is now `<Button variant="segment" active={isActive}>` — the
// segment recipe owns the muted→primary tokens + active=cyan + the canonical ring +
// the ≥44px hit area. This `thHeader` recipe carries ONLY the header-specific surface
// the base does not: full-width, uppercase label rhythm, the numeric justify, and the
// `data-state` forced-matrix overrides (RESEARCH Pattern 2). `font-normal` is left to
// the base (`font-semibold`); `uppercase tracking-label` is the header treatment.
const thHeader = tv({
  base: "w-full uppercase tracking-label",
  variants: {
    state: {
      enabled: "",
      hover: "text-text-primary",
      pressed: "translate-y-px text-text-primary",
      focused: "shadow-(--shadow-ring) outline-none",
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
      <Button
        variant="segment"
        size="sm"
        justify={numeric ? "end" : "start"}
        active={isActive}
        aria-label={sortLabel}
        data-state={forcedState}
        onClick={onSort}
        className={thHeader({ state: forcedState })}
      >
        {/* Numeric headers put the arrow on the left of a right-aligned label so the
            arrow sits between the label and the column edge; text headers trail it. */}
        {numeric ? <SortArrow sort={sort} /> : null}
        <span className="truncate">{label}</span>
        {numeric ? null : <SortArrow sort={sort} />}
      </Button>
    </th>
  );
}
