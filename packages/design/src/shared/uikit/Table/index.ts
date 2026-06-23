// Table slice entry (KIT-02). `Th` and `TableRow` are nested leaf components
// (architecture.md leaf-granularity, D-02) re-exported alongside `Table` so the
// package barrel graduates the whole family from one place. The `_fixtures` roster
// + `_state-matrix` stay internal helpers (NOT graduated).
export type { SortState, TableColumn, TableDensity } from "./Table";
export { Table } from "./Table";
// GAP-06: the auto-density resolver (replaces the removed DensityToggle) — density
// derives from the `@container`, not a user-facing control.
export { AutoTable } from "./AutoTable";
export type { SortDirection, ThState } from "./Th";
export { Th } from "./Th";
export type { RowState, TierCell } from "./TableRow";
export { TableRow } from "./TableRow";
