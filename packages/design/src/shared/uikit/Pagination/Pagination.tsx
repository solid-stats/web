// Pagination (KIT-02) — a REAL controlled pager (GAP-07): a «N–M из total» range
// indicator framed by Назад / Дальше (Prev / Next). Presentational + INERT this phase
// (D-01): there is no server, no cursor engine — `hasPrev`/`hasNext` + the range model
// (`from`/`to`/`total`) are controlled props and the buttons are disabled at the ends;
// `onPrev`/`onNext` are the parent's intent. The v1.0 cursor swaps into the same contract.
//
// Each pager is a ≥44px `<Button variant="secondary">` (GAP-19 — the shared `control`
// recipe owns the surface + hairline + the canonical ring + the hit area + the disabled
// treatment) with a Lucide chevron + the label word (never icon/color-alone). The
// end-of-list state is a DISABLED Next (keeps `data-page-next` + the label, a11y.md
// "disabled controls keep their label") — NOT a bare «Это всё» text marker (GAP-07).
// `/lite` is the merge-free build; class strings stay literal for the `@source` scan.
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../Button";

type Props = {
  className?: string;
  /** Prev label (RU/EN), e.g. «Назад» — from `_fixtures/STRINGS`. */
  prevLabel: string;
  /** Next label (RU/EN), e.g. «Дальше». */
  nextLabel: string;
  /** The pre-interpolated range indicator, e.g. «1–8 из 200» (from `paginationRange`). */
  rangeLabel: string;
  /** First item index in the current window (1-based) — the «N» of «N–M из total». */
  from: number;
  /** Last item index in the current window — the «M». */
  to: number;
  /** The full result-set size — the «total» (the few/limit cue, GAP-14). */
  total: number;
  /** Whether a previous page exists (controlled — disables Prev at the start). */
  hasPrev: boolean;
  /** Whether a next page exists (controlled — at the end the Next button is disabled). */
  hasNext: boolean;
  /** Parent intent — go to the previous page. Inert if omitted (no engine, D-01). */
  onPrev?: () => void;
  /** Parent intent — go to the next page. Inert if omitted. */
  onNext?: () => void;
};

export function Pagination({
  className,
  prevLabel,
  nextLabel,
  rangeLabel,
  from,
  to,
  total,
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
      <Button
        variant="secondary"
        disabled={!hasPrev}
        aria-disabled={!hasPrev}
        data-page-prev
        onClick={onPrev === undefined ? undefined : onPrev}
      >
        <ChevronLeft className={`size-4 shrink-0 ${hasPrev ? "text-primary" : ""}`} aria-hidden />
        {prevLabel}
      </Button>
      {/* The «N–M из total» range/page indicator — the page position + the total (the
          few vs limit-reached cue, GAP-14). `tabular-nums` keeps the digits stable. */}
      <span
        className="font-body text-sm tabular-nums text-text-muted"
        data-page-range
        data-page-from={from}
        data-page-to={to}
        data-page-total={total}
      >
        {rangeLabel}
      </span>
      {/* End-of-list is a DISABLED Next (keeps its label + `data-page-next`), never a bare
          «Это всё» text marker (GAP-07). The chevron is cyan only when actionable. */}
      <Button
        variant="secondary"
        disabled={!hasNext}
        aria-disabled={!hasNext}
        data-page-next
        onClick={onNext === undefined ? undefined : onNext}
      >
        {nextLabel}
        <ChevronRight className={`size-4 shrink-0 ${hasNext ? "text-primary" : ""}`} aria-hidden />
      </Button>
    </nav>
  );
}
