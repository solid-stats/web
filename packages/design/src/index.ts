// @solid-stats/design — UIKIT public barrel (the package `exports` map "." entry
// resolves here, D-05). Components graduate into this barrel as each family slice
// lands; the Smoke catalog story and the underscore-prefixed `_fixtures` /
// `_state-matrix` helpers are NOT UIKIT exports and stay intentionally absent.
//
// Later family plans append their own export blocks to distinct regions (barrel
// writes are serialized by wave).

// ---- Base primitives (Wave 1 / Plan 02-07, GAP-19) ----
// The shared interactive base: `Button` (`<button type="button">`) and `Link` (the
// `<a>` affordance) share ONE `control` recipe owning the ≥44px hit area + the ONE
// canonical focus ring + the variant/size token recipes (sourced from the DESIGN.md
// `button-*` recipes). The ~7 hand-rolled catalog controls render through these; the
// internal `control` recipe is NOT graduated.
export type { ButtonVariant, ButtonSize, ButtonJustify } from "./shared/uikit/Button";
export { Button, Link } from "./shared/uikit/Button";

// ---- KIT-04 Data-trust family (Wave 2 / Plan 02-02) ----
export type { FreshnessState } from "./shared/uikit/FreshnessPill";
export { FreshnessPill } from "./shared/uikit/FreshnessPill";
export { ProvenanceLine } from "./shared/uikit/ProvenanceLine";
export type { TrustKind } from "./shared/uikit/TrustBadge";
export { TrustBadge } from "./shared/uikit/TrustBadge";
export type { BannerKind } from "./shared/uikit/DataTrustBanner";
export { DataTrustBanner } from "./shared/uikit/DataTrustBanner";
export { InlineReviewRow } from "./shared/uikit/InlineReviewRow";

// ---- KIT-07 Feedback family (Wave 3 / Plan 02-03) ----
export type { BadgeVariant } from "./shared/uikit/Badge";
export { Badge } from "./shared/uikit/Badge";
export type { PillTone } from "./shared/uikit/Pill";
export { Pill } from "./shared/uikit/Pill";
export type { SkeletonDensity } from "./shared/uikit/Skeleton";
export { ROW_H, Skeleton } from "./shared/uikit/Skeleton";
export { EmptyState } from "./shared/uikit/EmptyState";
export type { ErrorKind } from "./shared/uikit/ErrorState";
export { ErrorState } from "./shared/uikit/ErrorState";
export type { ToastVariant } from "./shared/uikit/Toast";
export { Toast } from "./shared/uikit/Toast";

// ---- KIT-01 Nav-shell family (Wave 4 / Plan 02-04) ----
// The durable prop contract is `NavItem` (the role-aware item list — denied items
// simply absent; NO RBAC, v1.0); the `navItemsFor`/`NAV_ROLES` story fixtures stay
// internal to the slice and are intentionally NOT graduated.
export { SkipLink } from "./shared/uikit/SkipLink";
export type { NavItem, NavItemState } from "./shared/uikit/NavBar/NavBar";
export { NavBar } from "./shared/uikit/NavBar/NavBar";
export { MobileTabBar } from "./shared/uikit/MobileTabBar";
export { AppShell } from "./shared/uikit/AppShell";

// ---- KIT-03 Stat-primitive family (Wave 5 / Plan 02-05) ----
// Population-derived tiers (baseline passed explicitly, never a hardcoded cutoff),
// tabular-mono numerals, and a dependency-free CLS-0 Sparkline. `Pips` lives inside
// the `TierScale` slice (architecture.md leaf-granularity) and graduates with it; the
// `_fixtures` roster/baseline + `tierFor` stay internal helpers (NOT graduated).
export { StatTile } from "./shared/uikit/StatTile";
export type { MiniStat } from "./shared/uikit/MiniStatGrid";
export { MiniStatGrid } from "./shared/uikit/MiniStatGrid";
export { TierChip } from "./shared/uikit/TierChip";
export { Pips, TierScale } from "./shared/uikit/TierScale";
export { Sparkline } from "./shared/uikit/Sparkline";

// ---- KIT-02 Data-table family (Wave 6 / Plan 02-06) ----
// The presentational-only data table (D-01: NO @tanstack/react-table, NO
// @tanstack/react-virtual) — a CLS-0 sticky-header scroll-in-card with a colgroup +
// reserved height + virtualization-ready fixed-ROW_H + spacer rows. `Th` and
// `TableRow` are the nested leaf components (architecture.md leaf-granularity) and
// graduate with `Table`. Sort / density / selection / pagination are CONTROLLED
// props — the durable interface the v1.0 engine swaps into. `CompactList` is the
// mobile (< md) reflow; `Pagination` is the inert cursor affordance. The `_fixtures`
// roster + `_state-matrix` stay internal helpers (NOT graduated). This block
// completes the full Phase-2 structural & data-display catalog.
export type {
  SortDirection,
  SortState,
  TableColumn,
  TableDensity,
  TierCell,
} from "./shared/uikit/Table";
export { Table, Th, TableRow } from "./shared/uikit/Table";
// GAP-06: DensityToggle removed — table density now derives automatically from the
// `@container` (the `AutoTable` resolver), not a user-facing toggle.
export { AutoTable } from "./shared/uikit/Table";
export type { CompactRowData } from "./shared/uikit/CompactRow";
export { CompactList, CompactRow } from "./shared/uikit/CompactRow";
export { Pagination } from "./shared/uikit/Pagination";
