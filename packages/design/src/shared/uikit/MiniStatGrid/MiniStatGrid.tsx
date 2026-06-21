// MiniStatGrid (KIT-03) — the even mini-stat grid that follows the headline tiles.
// After the two hero tiles (Score + K/D, the `StatTile` pair), the remaining
// secondary metrics render here in metric-priority order (.design/CLAUDE.md L93,
// L175: Игры → Убийства → ТК → Смерти → K/D → Счёт). Each value is tabular mono.
//
// "Even grid, no orphan tiles" (the design rule): the column count is chosen so
// the LAST row is never a single orphan tile — we reflow by CONTAINER width
// (@container, styling.md "prefer @container over viewport branching") across 2 →
// 3 → 4 columns, and the supplied stat count is kept even by the caller. The grid
// reserves stable dimensions (CLS = 0); an empty roster renders a reserved-height
// placeholder rather than collapsing.
import type { ReactNode } from "react";

/** One secondary metric cell — a muted label over a tabular-mono value. */
export type MiniStat = {
  /** Stable key (also the metric id). */
  readonly key: string;
  /** Metric name in the muted label role (RU primary / EN mirror, from STRINGS). */
  readonly label: string;
  /** Already-formatted value (the caller formats; tabular mono renders it aligned). */
  readonly value: string;
};

type Props = {
  className?: string;
  /** Secondary metrics in metric-priority order. Keep the count even (no orphan tile). */
  stats: readonly MiniStat[];
  /** Reserved-height placeholder text when there are no stats yet (empty state). */
  emptyLabel?: string;
};

export function MiniStatGrid({ className, stats, emptyLabel }: Props): ReactNode {
  // Empty: reserve the height of a single mini-stat row rather than collapsing.
  if (stats.length === 0) {
    return (
      <div
        className={`flex min-h-16 items-center justify-center rounded-md border border-border-1 bg-surface-1 p-4 ${className ?? ""}`}
        data-mini-stat-grid="empty"
      >
        <span className="font-body text-sm text-text-muted">{emptyLabel ?? "—"}</span>
      </div>
    );
  }

  return (
    <div className={`@container ${className ?? ""}`} data-mini-stat-grid={String(stats.length)}>
      {/* Container-keyed reflow: 2 → 3 → 4 columns by container width. The caller keeps
          the stat count even so the trailing row is never a single orphan tile. */}
      <dl className="grid grid-cols-2 gap-3 @md:grid-cols-3 @xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="flex flex-col gap-1 rounded-md border border-border-1 bg-surface-1 p-3"
            data-mini-stat={stat.key}
          >
            <dt className="font-body text-2xs font-semibold uppercase tracking-label text-text-muted">
              {stat.label}
            </dt>
            <dd className="font-mono text-md font-medium tabular-nums text-text-primary">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
