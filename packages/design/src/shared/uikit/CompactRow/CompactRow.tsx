// CompactRow (KIT-02) — the mobile (`< md`) table layout. The desktop scroll-in-card
// `Table` does not fit a 360px floor, so below `@md` the list reflows to a stack of
// compact rows: each row is a label-over-value card (the primary identity + the
// tier-colored Счёт/K-D), secondary columns dropped (squad/rank de-emphasised),
// with NO horizontal scroll and NO nested scroll — the PAGE scrolls (`.design`
// mobile model: top-N + incremental «показать ещё · N», never dumps the whole tail).
//
// Reflow is keyed off `@container` (`CompactList` is the `@container` root) per
// styling.md, not a viewport branch. The whole row is a link (the player-name
// anchor stretches via `after:inset-0`) — Tab reaches it, ≥44px tall. Tier cells
// pair the color with `Pips` (never color-alone). `/lite` is the tailwind-merge-free
// build; class strings stay literal for the `@source` scan.
import type { ReactNode } from "react";
import { Button } from "../Button";
import { Pips } from "../TierScale";
import type { TierCell } from "../Table";

/** One compact row's data — the primary identity + the two tier-colored metrics. */
export type CompactRowData = {
  /** Rank (1-based) — shown as a small ordinal, a dropped/secondary signal on mobile. */
  readonly rank: number;
  /** Player nickname (truncates + `title`). */
  readonly name: string;
  /** Squad tag or `null` — secondary, shown muted under the name. */
  readonly squad: string | null;
  /** Href for the row anchor (inert `#` in the catalog). */
  readonly href: string;
  /** The Счёт tier cell. */
  readonly score: TierCell;
  /** The K-D tier cell. */
  readonly kd: TierCell;
};

type RowProps = {
  className?: string;
  /** The row data. */
  row: CompactRowData;
  /** Localized metric labels (RU/EN): `{ score: "Счёт", kd: "K/D" }`. */
  metricLabels: { readonly score: string; readonly kd: string };
};

/** A single label-over-value compact card — the 360px-floor row shape. */
export function CompactRow({ className, row, metricLabels }: RowProps): ReactNode {
  return (
    <div
      className={`group relative flex min-h-11 items-center gap-3 border-b border-border-1 bg-surface-1 px-3 py-2 last:border-b-0 hover:bg-surface-3 ${className ?? ""}`}
      data-compact-row={row.rank}
    >
      {/* Rank — the de-emphasised ordinal (a secondary column, kept tiny on mobile). */}
      <span className="w-6 shrink-0 text-right font-mono text-xs tabular-nums text-text-subtle">
        {row.rank}
      </span>
      {/* Identity — name anchor (stretches across the row) over the muted squad. */}
      <div className="min-w-0 flex-1">
        {/* GAP-13: the inline name no longer carries `min-h-11` — that 44px floor inflated
            the name block and pushed the squad ~44px down. The ≥44px hit area comes from
            the ROW (`min-h-11` on the flex row above); the anchor still stretches its hit
            area across the whole row via `after:inset-0`, so name + squad stack tightly. */}
        <a
          href={row.href}
          title={row.name}
          data-name-anchor
          className="relative block truncate font-body text-sm font-semibold text-text-primary outline-none after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:shadow-(--shadow-ring)"
        >
          {row.name}
        </a>
        <span className="block truncate font-body text-xs text-text-muted" title={row.squad ?? "—"}>
          {row.squad ?? "—"}
        </span>
      </div>
      {/* The two tier-colored metrics — label OVER value (the 360px stack). */}
      <CompactMetric label={metricLabels.score} cell={row.score} />
      <CompactMetric label={metricLabels.kd} cell={row.kd} />
    </div>
  );
}

/** A label-over-value tier metric (the mobile stack): the metric word, then the
 *  tier-colored value paired with Pips (never color-alone). */
function CompactMetric({ label, cell }: { label: string; cell: TierCell }): ReactNode {
  const tone =
    cell.level === "low"
      ? "text-loss"
      : cell.level === "base"
        ? "text-warn"
        : cell.level === "good"
          ? "text-info"
          : "text-win";
  return (
    <div
      className="flex w-14 shrink-0 flex-col items-end gap-0.5"
      data-compact-metric={cell.metric}
    >
      <span className="font-body text-2xs font-semibold uppercase tracking-label text-text-subtle">
        {label}
      </span>
      <span className="inline-flex items-center gap-1">
        <Pips level={cell.level} />
        <span className={`font-mono text-sm tabular-nums ${tone}`}>{cell.value}</span>
      </span>
    </div>
  );
}

type ListProps = {
  className?: string;
  /** The full row set (the page already holds the total — this is the mobile window). */
  rows: readonly CompactRowData[];
  /** How many rows to show before the «показать ещё · N» expander (top-N). */
  topN: number;
  /** Localized metric labels (RU/EN). */
  metricLabels: { readonly score: string; readonly kd: string };
  /** Pre-formatted «показать ещё · N» label (N already interpolated by the caller). */
  showMoreLabel: string;
  /** Total-count caption (e.g. «Игроки · 200») — the data-volume cue. */
  caption: string;
  /** Whether the expander is shown (false when `rows.length <= topN`). */
  expandable?: boolean;
};

/**
 * The mobile list: a `@container` root rendering the top-N compact rows + the
 * «показать ещё · N» expander. NO horizontal scroll, NO nested scroll — the page
 * scrolls. The expander is inert in the catalog (a controlled affordance in v1.0).
 */
export function CompactList({
  className,
  rows,
  topN,
  metricLabels,
  showMoreLabel,
  caption,
  expandable = true,
}: ListProps): ReactNode {
  const shown = rows.slice(0, topN);
  return (
    <section
      className={`@container flex flex-col gap-2 ${className ?? ""}`}
      data-compact-list
      aria-label={caption}
    >
      <p className="px-3 font-body text-xs text-text-muted" data-compact-caption>
        {caption}
      </p>
      <div className="overflow-hidden rounded-md border border-border-1 bg-surface-1">
        {shown.map((row) => (
          <CompactRow key={row.rank} row={row} metricLabels={metricLabels} />
        ))}
      </div>
      {expandable && rows.length > topN ? (
        // GAP-19: the «показать ещё · N» expander is the shared secondary Button.
        <Button variant="secondary" data-show-more>
          {showMoreLabel}
        </Button>
      ) : null}
    </section>
  );
}
