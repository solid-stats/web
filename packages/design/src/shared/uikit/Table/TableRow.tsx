// TableRow (KIT-02) — a single fixed-height (`ROW_H` 52/44) data row. The WHOLE row
// is the click zone (beats the player-name text — UI-SPEC click zone), with a
// focusable `<a>` anchor in the player-name cell as the visible affordance: Tab
// reaches the anchor, the row delegates the pointer click to it (Pitfall 5 — a
// keyboard/SR user reaches and understands the row). The selected row is THREE
// redundant signals — a `primary-weak` fill + an inset 2px cyan left-edge marker
// (an inset box-shadow on the row, never fill-only) + `aria-selected` (a11y.md never
// color-alone). Long name/squad cells `truncate` + `title` (Pitfall 6 — never clip).
// Numeric cells are `table-cell-numeric` (tabular mono, right-aligned), Счёт/K-D
// tier-colored with `Pips` (paired — never color-alone).
//
// `data-state` drives the static catalog matrix (RESEARCH Pattern 2); the forced
// state maps to the SAME utilities the live `:hover`/`:focus-within` apply. The
// row height is a computed dynamic value via inline style (ROW_H is row-model
// geometry, not a themable token — the sanctioned escape, like the skeleton's
// reserved colgroup widths). `/lite` is the tailwind-merge-free build.
import type { CSSProperties, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { type TierLevel, type TierMetric } from "../_fixtures";
import { Pips } from "../TierScale";

/** The ×7 row states. `enabled` is resting; `loading` is the Skeleton variant (handled by Table). */
export type RowState = "enabled" | "hover" | "pressed" | "focused" | "selected" | "disabled";

/** A tier-colored numeric cell (Счёт / K-D): the value + its resolved tier level. */
export type TierCell = {
  /** Pre-formatted tabular value (e.g. «4.13»). */
  readonly value: string;
  /** The metric this value belongs to (data hook for the design-review). */
  readonly metric: TierMetric;
  /** The resolved tier level — drives the color + the paired Pips count. */
  readonly level: TierLevel;
};

type Props = {
  className?: string;
  /** Computed row height (px) from the active density — `ROW_H` 52/44. */
  rowHeight: number;
  /** Rank number (1-based) shown in the leading numeric column. */
  rank: number;
  /** Player nickname (truncates + `title` if long). */
  name: string;
  /** Squad tag, or `null` when the player has none. */
  squad: string | null;
  /** Href for the player-name anchor (inert `#` in the catalog — no routes, D-01). */
  href: string;
  /** The Счёт tier cell. */
  score: TierCell;
  /** The K-D tier cell. */
  kd: TierCell;
  /** Whether this row is the selected one (primary-weak + inset edge + aria-selected). */
  selected?: boolean;
  /** Whether this row is non-interactive (e.g. a stale/under-review entry). */
  disabled?: boolean;
  /** Forced state for the static catalog matrix only (no real pointer). */
  forcedState?: RowState;
};

// The row recipe. `base` carries the live interaction utilities (`hover:bg-surface-3`
// per `table-row` L383). The `state` variant is the catalog override; `selected` adds
// the primary-weak fill + the inset cyan left-edge marker (never fill-only).
// GAP-09: the selected left-edge marker is an inset box-shadow on the row
// (`shadow-(--shadow-selected)` → `inset 2px 0 0 var(--color-primary)`), NOT an
// absolutely-positioned `before:` bar on a `position:relative` `<tr>`. An abspos child
// in a `<tr>` broke the `table-fixed` colgroup widths on the selected row only; an inset
// shadow paints the marker without positioning the `<tr>`, so columns stay aligned.
// GAP-08: under the table's `border-separate` model a `<tr>` border does not paint, so
// the hairline lives on the row's CELLS (`[&>td]:border-b`). With Tailwind's global
// `box-border` the border sits INSIDE each cell box → zero added row height (no stray
// scroll), and the last row drops it (`last:[&>td]:border-b-0`).
const row = tv({
  base: "group bg-surface-1 text-text-primary transition-colors [&>td]:border-b [&>td]:border-border-1 last:[&>td]:border-b-0 hover:bg-surface-3",
  variants: {
    state: {
      enabled: "",
      hover: "bg-surface-3",
      pressed: "bg-surface-2",
      focused: "",
      selected: "",
      disabled: "opacity-60",
    },
    selected: {
      // primary-weak fill + the inset 2px cyan left-edge marker (an inset box-shadow on
      // the row, NOT a positioned before: bar — GAP-09) — paired with aria-selected,
      // never fill-only. The marker reads the `--shadow-selected` @theme token.
      true: "bg-primary-weak shadow-(--shadow-selected)",
      false: "",
    },
    disabled: {
      true: "pointer-events-none",
      false: "",
    },
  },
});

// The player-name anchor — the focusable visible affordance. The focus ring sits on
// the anchor (`focus-visible:shadow-(--shadow-ring)`), and `after:absolute
// after:inset-0` stretches its hit area across the WHOLE row so the row is the
// pointer target while the anchor owns the accessible name + keyboard focus.
const nameAnchor =
  "relative inline-flex max-w-full items-center truncate rounded-sm font-body text-sm font-semibold text-text-primary outline-none after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:shadow-(--shadow-ring)";

/** A tier-colored numeric value paired with its Pips meter (never color-alone). */
const tierText = tv({
  base: "font-mono text-sm tabular-nums",
  variants: {
    level: {
      low: "text-loss",
      base: "text-warn",
      good: "text-info",
      elite: "text-win",
    } satisfies Record<TierLevel, string>,
  },
});

function NumericTierCell({ cell }: { cell: TierCell }): ReactNode {
  return (
    <td className="px-3 text-right align-middle" data-numeric-cell={cell.metric}>
      <span className="inline-flex items-center justify-end gap-1.5">
        <Pips level={cell.level} />
        <span className={tierText({ level: cell.level })}>{cell.value}</span>
      </span>
    </td>
  );
}

export function TableRow({
  className,
  rowHeight,
  rank,
  name,
  squad,
  href,
  score,
  kd,
  selected = false,
  disabled = false,
  forcedState,
}: Props): ReactNode {
  const state = disabled ? "disabled" : selected ? "selected" : forcedState;
  const rowStyle: CSSProperties = { height: `${rowHeight}px` };
  return (
    <tr
      aria-selected={selected ? true : undefined}
      aria-disabled={disabled ? true : undefined}
      data-state={state}
      data-table-row={rank}
      style={rowStyle}
      className={row({ state, selected, disabled, className })}
    >
      {/* Rank — numeric, muted, the row's leading ordinal. */}
      <td className="px-3 text-right align-middle font-mono text-sm tabular-nums text-text-muted">
        {rank}
      </td>
      {/* Player name — the focusable full-row anchor; truncate + title (never clip). */}
      <td className="overflow-hidden px-3 align-middle">
        <a
          href={disabled ? undefined : href}
          aria-disabled={disabled ? true : undefined}
          title={name}
          data-name-anchor
          className={nameAnchor}
        >
          {name}
        </a>
      </td>
      {/* Squad — secondary text, truncate + title (dropped on CompactRow at 360px). */}
      <td className="overflow-hidden px-3 align-middle font-body text-sm text-text-muted">
        <span className="block truncate" title={squad ?? "—"}>
          {squad ?? "—"}
        </span>
      </td>
      <NumericTierCell cell={score} />
      <NumericTierCell cell={kd} />
    </tr>
  );
}
