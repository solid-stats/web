// Pagination (KIT-02) — a cursor affordance: Назад / Дальше (Prev / Next) + an
// end-of-list marker. Presentational + INERT this phase (D-01): there is no server,
// no cursor engine — `hasPrev`/`hasNext` are controlled props and the buttons are
// disabled at the ends; `onPrev`/`onNext` are the parent's intent. `.design` notes
// the production list virtualizes (no real pagination); this is the durable visual
// affordance the v1.0 cursor swaps into.
//
// Each control is a ≥44px `<button>` (Pitfall 3) with a Lucide chevron + the label
// word (never icon/color-alone). An enabled control's chevron is cyan; the
// end-of-list state shows the «Это всё» marker instead of an active Next. `/lite`
// is the tailwind-merge-free build; class strings stay literal for the `@source` scan.
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tv } from "tailwind-variants/lite";

type Props = {
  className?: string;
  /** Prev label (RU/EN), e.g. «Назад» — from `_fixtures/STRINGS`. */
  prevLabel: string;
  /** Next label (RU/EN), e.g. «Дальше». */
  nextLabel: string;
  /** End-of-list marker (RU/EN), e.g. «Это всё» — shown when `!hasNext`. */
  endLabel: string;
  /** Whether a previous page exists (controlled — disables Prev at the start). */
  hasPrev: boolean;
  /** Whether a next page exists (controlled — at the end, the end marker shows). */
  hasNext: boolean;
  /** Parent intent — go to the previous page. Inert if omitted (no engine, D-01). */
  onPrev?: () => void;
  /** Parent intent — go to the next page. Inert if omitted. */
  onNext?: () => void;
};

// The pager button. The active chevron is cyan; a disabled control is muted +
// non-interactive (the label still present — never icon/color-alone).
const pager = tv({
  base: "inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border-1 bg-surface-2 px-4 font-body text-sm font-semibold text-text-primary transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:shadow-(--shadow-ring)",
  variants: {
    disabled: {
      true: "pointer-events-none text-text-subtle opacity-60",
      false: "",
    },
  },
});

export function Pagination({
  className,
  prevLabel,
  nextLabel,
  endLabel,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: Props): ReactNode {
  return (
    <nav
      className={`flex items-center justify-between gap-3 ${className ?? ""}`}
      aria-label={`${prevLabel} / ${nextLabel}`}
      data-pagination
    >
      <button
        type="button"
        disabled={!hasPrev}
        aria-disabled={!hasPrev}
        data-page-prev
        onClick={onPrev === undefined ? undefined : onPrev}
        className={pager({ disabled: !hasPrev })}
      >
        <ChevronLeft className={`size-4 shrink-0 ${hasPrev ? "text-primary" : ""}`} aria-hidden />
        {prevLabel}
      </button>
      {hasNext ? (
        <button
          type="button"
          data-page-next
          onClick={onNext === undefined ? undefined : onNext}
          className={pager({ disabled: false })}
        >
          {nextLabel}
          <ChevronRight className="size-4 shrink-0 text-primary" aria-hidden />
        </button>
      ) : (
        // End-of-list — the cursor affordance has no more pages (inert, no server).
        <span
          className="inline-flex min-h-11 items-center gap-1.5 px-4 font-body text-sm text-text-muted"
          data-page-end
        >
          {endLabel}
        </span>
      )}
    </nav>
  );
}
