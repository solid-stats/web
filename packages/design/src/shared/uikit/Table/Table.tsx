// Table (KIT-02) — the CLS-0 sticky-header scroll-in-card. Presentational-only
// (D-01): NO `@tanstack/react-table`, NO `@tanstack/react-virtual`. The full visual
// contract is markup + tokens + fixture rows passed as props; sort / density /
// selection / pagination are CONTROLLED props (the durable interface the v1.0
// engine swaps into without changing the visual contract).
//
// CLS-0 row model (RESEARCH Pattern 5):
//   • a real `<table className="table-fixed">` + a `<colgroup>` of fixed `<col>`
//     widths inside an `overflow-y-auto` viewport of RESERVED height;
//   • a sticky `<thead>` (`table-header` on surface-2, `position: sticky`);
//   • fixed `ROW_H` (52/44 by density) body rows;
//   • top/bottom SPACER rows of computed height frame the visible window —
//     virtualization-READY but NOT virtualized this phase (D-01); the v1.0
//     virtualizer drops into the same spacer math without changing the contract;
//   • the loading state swaps in the Plan-03 `Skeleton` table variant reproducing
//     the EXACT colgroup + header + N×ROW_H (skeleton box height === data box
//     height → CLS = 0; proven by `cls.spec`).
//
// Reserved/viewport/spacer heights and the colgroup widths are computed dynamic
// values via inline `style` (row-model geometry, not themable tokens — the
// sanctioned escape, like the Skeleton's reserved colgroup). The header/row visual
// classes stay literal token utilities so the `@source` scan emits them.
import type { CSSProperties, ReactNode } from "react";
import { ROW_H, type SkeletonDensity, Skeleton, tableViewportHeight } from "../Skeleton";
import { Th, type SortDirection } from "./Th";

/** Re-export the density type so consumers (AutoTable, stories) share one source. */
export type TableDensity = SkeletonDensity;

/** A sortable column descriptor (label + fixed width + numeric alignment). */
export type TableColumn = {
  /** Stable key — also the controlled-sort match + React key. */
  readonly key: string;
  /** The visible header label (RU primary / EN mirror), from `_fixtures/STRINGS`. */
  readonly label: string;
  /** Fixed column width (px) — the `<colgroup>` reserves it (CLS = 0). */
  readonly width: number;
  /** Right-align (numeric columns) to match `table-cell-numeric`. */
  readonly numeric?: boolean;
  /** Whether this column is sortable (the rank/identity columns are not). */
  readonly sortable?: boolean;
};

/** The controlled sort state — which column key + direction the parent owns (D-01). */
export type SortState = {
  readonly key: string;
  readonly direction: SortDirection;
};

type Props = {
  className?: string;
  /** The fixed column model (drives the colgroup + headers). */
  columns: readonly TableColumn[];
  /** The body rows — already-built `TableRow` elements (rendered from `_fixtures/ROSTER`). */
  children: ReactNode;
  /** The `<table>` accessible name / caption (RU primary / EN mirror). */
  caption: string;
  /** The active row density — fixed `ROW_H` 52/44 (controlled prop; `AutoTable` resolves
   *  it from the `@container`, GAP-06 — there is no user-facing toggle). */
  density: TableDensity;
  /** The controlled sort state (parent owns it — no engine). */
  sort: SortState;
  /** Accessible sort-action labels per column key (e.g. «сортировать по Счёт»). */
  sortLabels: Readonly<Record<string, string>>;
  /** Number of rows the reserved viewport shows before scrolling (CLS = 0 height). */
  visibleRows: number;
  /** When true, swap the body for the Skeleton table variant (exact dims). */
  loading?: boolean;
  /** Computed spacer height (px) above the visible window (virtualization-ready). */
  topSpacer?: number;
  /** Computed spacer height (px) below the visible window (virtualization-ready). */
  bottomSpacer?: number;
  /** Parent sort intent per column key — inert in the catalog (no engine, D-01). */
  onSort?: ((key: string) => void) | undefined;
};

export function Table({
  className,
  columns,
  children,
  caption,
  density,
  sort,
  sortLabels,
  visibleRows,
  loading = false,
  topSpacer = 0,
  bottomSpacer = 0,
  onSort,
}: Props): ReactNode {
  const rowHeight = ROW_H[density];
  // The reserved viewport height holds the layout regardless of row count or loading —
  // header + N visible rows + the hairline borders (GAP-08: border-box math, no stray
  // scroll). Computed geometry, not a themable token.
  const viewportStyle: CSSProperties = {
    height: `${tableViewportHeight(visibleRows, rowHeight)}px`,
  };
  const widths = columns.map((c) => c.width);

  return (
    <div
      className={`overflow-hidden rounded-md border border-border-1 bg-surface-1 ${className ?? ""}`}
      data-table-card
    >
      <div className="overflow-y-auto" style={viewportStyle} data-table-viewport>
        {loading ? (
          // The loading state IS the Skeleton table variant (Plan 03) — identical
          // colgroup + header + N×ROW_H, so the skeleton→data swap shifts nothing. `framed
          // ={false}`: the Table's own card + viewport already frame it, so the skeleton
          // renders just the band (no inner card border to overflow → never scrolls, GAP-08).
          <Skeleton
            variant="table"
            columns={widths}
            rows={visibleRows}
            density={density}
            framed={false}
          />
        ) : (
          // GAP-08: `border-separate` keeps the hairlines on the CELLS (border-box →
          // inside each row box, zero added height), unlike `border-collapse` which
          // added them outside and caused the stray ~1–2px scroll. The header cells
          // carry the bottom hairline; the rows carry theirs (TableRow).
          <table className="w-full table-fixed border-separate border-spacing-0" data-table>
            <caption className="sr-only">{caption}</caption>
            <colgroup>
              {columns.map((c) => (
                <col key={c.key} style={{ width: `${c.width}px` }} />
              ))}
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr>
                {columns.map((c) =>
                  c.sortable === true ? (
                    <Th
                      key={c.key}
                      label={c.label}
                      numeric={c.numeric}
                      sort={sort.key === c.key ? sort.direction : "none"}
                      sortLabel={sortLabels[c.key] ?? c.label}
                      onSort={onSort === undefined ? undefined : () => onSort(c.key)}
                    />
                  ) : (
                    // Non-sortable identity columns (rank) — a plain header cell, no button.
                    <th
                      key={c.key}
                      scope="col"
                      data-th={c.label}
                      className={`h-11 border-b border-border-1 bg-surface-2 px-3 font-body text-xs font-semibold uppercase tracking-label text-text-muted ${
                        c.numeric === true ? "text-right" : "text-left"
                      }`}
                    >
                      {c.label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {/* Top spacer — computed height frames the window above (virtualization-ready). */}
              {topSpacer > 0 ? (
                <tr aria-hidden style={{ height: `${topSpacer}px` }} data-spacer="top">
                  <td colSpan={columns.length} />
                </tr>
              ) : null}
              {children}
              {/* Bottom spacer — computed height frames the window below. */}
              {bottomSpacer > 0 ? (
                <tr aria-hidden style={{ height: `${bottomSpacer}px` }} data-spacer="bottom">
                  <td colSpan={columns.length} />
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
