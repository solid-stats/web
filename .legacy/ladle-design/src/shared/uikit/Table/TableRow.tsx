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
// state maps to the SAME utilities the live `:hover`/`:focus-visible` apply. The
// row height is a computed dynamic value via inline style (ROW_H is row-model
// geometry, not a themable token — the sanctioned escape, like the skeleton's
// reserved colgroup widths). `/lite` is the tailwind-merge-free build.
import type { CSSProperties, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { type TierLevel, type TierMetric } from "../_fixtures";
import { Pips } from "../TierScale";

/** The six row states. `enabled` is resting; the `loading` row is the Skeleton variant (handled by Table). */
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

// GAP-10: the focused-row treatment — a surface lift (`bg-surface-3`) + an INSET cyan
// ring (`shadow-(--shadow-row-focus)`, the `--tw-shadow` slot). It is inset so the ring
// paints INSIDE the row box and is never clipped under the sticky `<thead>` (WCAG 2.4.12).
// UAT-R2: it is keyed off `has-[:focus-visible]` (`:has(:focus-visible)`), NOT `focus-within`.
// `focus-within` also matches when the inner name anchor takes POINTER focus, so a mouse user
// got the keyboard-style row lift on every click (UAT round-2 finding). `:has(:focus-visible)`
// lifts the row only when the anchor matches `:focus-visible` (keyboard / non-pointer focus),
// mirroring the anchor's own `focus-visible:shadow-(--shadow-ring)` ring. The forced `focused`
// catalog state maps to the SAME resolved utilities via this one constant, so the static
// matrix cell matches real keyboard focus exactly.
//
// Two-slot composition (WCAG 2.4.7): the focus ring lives on `shadow-(--…)` (→ `--tw-shadow`)
// while the selected left-edge marker (below) lives on `inset-shadow-(--…)` (→ `--tw-inset-shadow`).
// `box-shadow` composes `var(--tw-inset-shadow), …, var(--tw-shadow)`, so a row that is BOTH
// selected AND keyboard-focused paints BOTH markers — neither overwrites the other's slot
// (the bug the single-`shadow-*` approach had under the merge-free `/lite` build).
// Exported so `TableRow.test.ts` can pin `ROW_FORCED_STATE.focused` against the SAME
// utilities the live `:has(:focus-visible)` lift applies (the sync contract — GAP-20).
export const ROW_FOCUS = "bg-surface-3 shadow-(--shadow-row-focus)";
const rowFocusVisible =
  "has-[:focus-visible]:bg-surface-3 has-[:focus-visible]:shadow-(--shadow-row-focus)";

// The row recipe. `base` carries the live interaction utilities (`hover:bg-surface-3`
// per `table-row` L383; the real `:has(:focus-visible)` lift via `rowFocusVisible`). `selected`
// adds the primary-weak fill + the inset cyan left-edge marker (never fill-only) and
// `disabled` the non-interactive treatment — both driven by the row's real props, not a
// catalog override.
// GAP-09: the selected left-edge marker is an inset box-shadow on the row
// (`inset-shadow-(--shadow-selected-marker)` → `inset 2px 0 0 var(--color-primary)`), NOT an
// absolutely-positioned `before:` bar on a `position:relative` `<tr>`. An abspos child
// in a `<tr>` broke the `table-fixed` colgroup widths on the selected row only; an inset
// shadow paints the marker without positioning the `<tr>`, so columns stay aligned.
// It uses the `inset-shadow-*` utility (→ `--tw-inset-shadow`), NOT `shadow-*`, so it occupies
// a DIFFERENT box-shadow slot than the focus ring and the two compose (WCAG 2.4.7 — see ROW_FOCUS).
// The `--shadow-selected-marker` token omits the `inset` keyword because `inset-shadow-(--var)`
// prepends its own. The inset-bearing `--shadow-selected` token is retained only as the documented
// `table-row.selected` design-of-record (DESIGN.md / theme.css); it is NOT consumed at runtime —
// the shipped marker is `--shadow-selected-marker` on the inset-shadow slot.
// GAP-08: under the table's `border-separate` model a `<tr>` border does not paint, so
// the hairline lives on the row's CELLS (`[&>td]:border-b`). With Tailwind's global
// `box-border` the border sits INSIDE each cell box → zero added row height (no stray
// scroll), and the last row drops it (`last:[&>td]:border-b-0`).
//
// GAP-20: the catalog forced hover/pressed/focused state is NOT a local variant-agnostic
// `state` variant anymore. Under the merge-free `/lite` build a plain forced `bg-surface-3`
// lost to the base `bg-surface-1` by stylesheet order, so the catalog `hover` cell could
// render the resting fill; and the old `pressed: bg-surface-2` invented a press treatment the
// row has none of (the whole-row click delegates to the name anchor — there is no `active:`
// on the `<tr>`). The forced cell now mirrors THIS recipe's real interaction utilities
// VERBATIM with `!`-important via `ROW_FORCED_STATE` (asserted in sync by `TableRow.test.ts`),
// so a recipe drift fails the test instead of shipping a fake catalog cell.
// Exported so `TableRow.test.ts` can assert `ROW_FORCED_STATE` mirrors the recipe's live
// `hover:` / `focus-within:` utilities (the catalog-can't-drift contract — GAP-20).
export const row = tv({
  base: `group bg-surface-1 text-text-primary transition-colors [&>td]:border-b [&>td]:border-border-1 last:[&>td]:border-b-0 hover:bg-surface-3 ${rowFocusVisible}`,
  variants: {
    selected: {
      // primary-weak fill + the inset 2px cyan left-edge marker (an inset box-shadow on
      // the row, NOT a positioned before: bar — GAP-09) — paired with aria-selected,
      // never fill-only. The marker reads the `--shadow-selected-marker` @theme token via the
      // `inset-shadow-*` utility (the `--tw-inset-shadow` slot), so it composes with the
      // focus ring on `--tw-shadow` instead of colliding with it (WCAG 2.4.7).
      true: "bg-primary-weak inset-shadow-(--shadow-selected-marker)",
      false: "",
    },
    disabled: {
      true: "pointer-events-none opacity-60",
      false: "",
    },
  },
});

// The catalog forced-state mirror for `<TableRow>` (RESEARCH Pattern 2). Each entry equals
// the live `:hover` / `:active` / `:has(:focus-visible)` utilities the `row` recipe applies for a
// data row — pseudo-prefix dropped, `!`-important added so the forced cell deterministically
// overrides the row's resting fill in the merge-free `/lite` build (a plain utility loses to
// the base by stylesheet order, which is how the old map rendered `hover` as the resting
// fill). The row has NO `active:` press treatment (the whole-row click delegates to the name
// anchor), so `pressed` is empty — a faithful mirror, not an invented `bg-surface-2`. The
// `focused` cell mirrors `ROW_FOCUS` (the SAME utilities the live `:has(:focus-visible)` applies).
// `TableRow.test.ts` asserts this stays in sync with the recipe. CATALOG-ONLY — never put an
// `!`-important state utility on a shipped row.
export const ROW_FORCED_STATE: Record<"hover" | "pressed" | "focused", string> = {
  hover: "bg-surface-3!",
  pressed: "",
  focused: "bg-surface-3! shadow-(--shadow-row-focus)!",
};

/** The catalog forced-state className for a data row — empty for the resting/selected/
 *  disabled states the matrix renders via the real props. CATALOG-ONLY. */
function forcedRowClass(state: RowState | undefined): string {
  if (state === "hover" || state === "pressed" || state === "focused") {
    return ROW_FORCED_STATE[state];
  }
  return "";
}

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
      className={`${row({ selected, disabled, className })} ${forcedRowClass(forcedState)}`}
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
