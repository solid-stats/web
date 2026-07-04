// AutoTable (KIT-02 / GAP-06) — the auto-density resolver. There is NO user-facing
// density toggle (the invented `DensityToggle` was removed): density DERIVES from the
// surface, mirroring the binding hi-fi `players.jsx` L318
//   `const density = (device === 'desktop' && !winMobile) ? 'comfortable' : 'compact'`
// — comfortable at a desktop-class width, compact below.
//
// The derivation is CONTAINER-keyed, not viewport-keyed (styling.md "prefer @container
// over viewport branching"), the SAME mechanism `AppShell` reflows with (`@5xl:block` /
// `@5xl:hidden`): the wrapper is an `@container`, and two reserved-height `Table` renders
// are gated by container-query visibility — the comfortable (ROW_H 52) table shows at the
// `@5xl` desktop-class container width and up, the compact (ROW_H 44) table below it. Only
// ONE is ever displayed (the other is `display:none`), so there is no layout shift and the
// resolution is pure CSS (no JS width hook). The controlled `density` prop on `Table` is
// KEPT — `AutoTable` simply feeds it the resolved value per branch.
import type { ReactNode } from "react";
import { Table, type SortState, type TableColumn, type TableDensity } from "./Table";

type Props = {
  className?: string;
  /** The fixed column model (drives the colgroup + headers) — shared by both branches. */
  columns: readonly TableColumn[];
  /** The `<table>` accessible name / caption (RU primary / EN mirror). */
  caption: string;
  /** The controlled sort state (parent owns it — no engine, D-01). */
  sort: SortState;
  /** Accessible sort-action labels per column key. */
  sortLabels: Readonly<Record<string, string>>;
  /** Number of rows the reserved viewport shows before scrolling (CLS = 0 height). */
  visibleRows: number;
  /** When true, swap the body for the Skeleton table variant (exact dims). */
  loading?: boolean;
  /** Computed spacer height (px) above the visible window (virtualization-ready). */
  topSpacer?: number;
  /** Computed spacer height (px) below the visible window (virtualization-ready). */
  bottomSpacer?: number;
  /**
   * The body rows for a resolved density — called once per branch so each `TableRow`
   * gets the correct `rowHeight` (ROW_H 52 comfortable / 44 compact). A render-prop
   * (not a built `ReactNode`) because the row height differs per branch.
   */
  rows: (density: TableDensity) => ReactNode;
  /** Parent sort intent per column key — inert in the catalog (no engine, D-01). */
  onSort?: ((key: string) => void) | undefined;
};

export function AutoTable({
  className,
  columns,
  caption,
  sort,
  sortLabels,
  visibleRows,
  loading = false,
  topSpacer = 0,
  bottomSpacer = 0,
  rows,
  onSort,
}: Props): ReactNode {
  // Shared props for both density branches (everything except `density` + the rows).
  const shared = {
    columns,
    caption,
    sort,
    sortLabels,
    visibleRows,
    loading,
    topSpacer,
    bottomSpacer,
    onSort,
  };
  return (
    <div className={`@container ${className ?? ""}`} data-auto-table>
      {/* Comfortable — desktop-class container width (@5xl ≈ 1024px) and up. */}
      <div className="hidden @5xl:block" data-density-branch="comfortable">
        <Table {...shared} density="comfortable">
          {rows("comfortable")}
        </Table>
      </div>
      {/* Compact — below the desktop-class width (the mobile/narrow floor). */}
      <div className="@5xl:hidden" data-density-branch="compact">
        <Table {...shared} density="compact">
          {rows("compact")}
        </Table>
      </div>
    </div>
  );
}
