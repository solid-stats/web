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

// ---- KIT-08 i18n harness (Wave 1 / Plan 03-01) ----
// The PUBLIC i18n seam: the loaded+activated runtime `i18n` instance (RU primary, D-03) that
// every consuming surface resolves copy through — `i18n._({ id, message, values })` in the
// story/feature, NEVER inside a `shared/uikit` primitive (architecture.md uikit boundary; the
// primitive takes a plain `message: string`). `StringKey` (the typed key union) and `Bilingual`
// graduate too so downstream phases narrow ids against the same single source. The `_i18n`
// `en`/`ru` catalog maps + the `_fixtures/STRINGS` seed stay INTERNAL (underscore-prefix rule —
// not graduated); the `lingui.d.ts` Register augmentation is ambient (no runtime export) and
// already makes a missing/renamed id a type error at every `i18n._` call site (SC#4).
// v1.0 graduation seam (D-03): this SAME instance is wrapped under the `/ru` `/en` localized
// router and its runtime catalogs become the migration source for the `@lingui/cli`
// extract/compile pipeline introduced then.
export { i18n } from "./shared/uikit/_i18n";
export type { Bilingual, StringKey } from "./shared/uikit/_fixtures/strings";

// ---- KIT-05 Form family — Field + Input (Wave 2 / Plan 03-02) ----
// The first form-family slice group: `Field` is the shared visible-label + announced,
// associated, aria-live error wrapper over Ark `Field.Root` (the seam every other form
// control — Select/Stepper/FileUpload — nests under for its label/error/required/disabled
// broadcast); `Input` is the text control styled per the DESIGN.md `input` recipe, inheriting
// validation state from `Field.Root` context. The internal `field`/`input` tv() recipes and
// the `_state-matrix` helper stay internal (NOT graduated). Strings resolve in the story via
// `i18n._({ id })` and pass as plain props — the primitives are i18n-free (uikit boundary).
export { Field } from "./shared/uikit/Field";
export { Input } from "./shared/uikit/Input";

// ---- KIT-05 Form family — Select + Stepper (Wave 3 / Plan 03-03) ----
// The second form-family slice group, both nesting under `Field` for label/error/required/
// disabled. `Select` is the GENERIC typed-value option control over Ark Select (its `options`
// + controlled `value`/`onValueChange` narrow to the SAME value union — `SelectOption` graduates
// so consumers type their lists by that union, never a loose `SelectOption<string>`); Ark owns
// arrow/Home/End/type-ahead + aria-expanded/controls, the active option is cyan PAIRED with the
// indicator check. `Stepper` is the Ark NumberInput numeric control — a tabular-mono value
// (alignment via the mono face) with ≥44px icon-only inc/dec triggers whose accessible names the
// caller injects. The internal `select`/`stepper` tv() recipes stay internal (NOT graduated);
// strings resolve in the story and pass as plain props (uikit boundary).
export type { SelectOption } from "./shared/uikit/Select";
export { Select } from "./shared/uikit/Select";
export { Stepper } from "./shared/uikit/Stepper";

// ---- KIT-05 Form family — FileUpload (Wave 4 / Plan 03-04) ----
// The final form-family slice — `FileUpload`, the image-evidence + external-link upload
// control over Ark `FileUpload`, nesting under `Field`. A KEYBOARD-ACCESSIBLE dropzone
// (focusable, Enter/Space opens the picker) with an explicit Browse button (the shared
// `Button`), per-file accepted (preview + name + remove/retry) and rejected (why+fix)
// rows. The one client-SECURITY surface in this no-app phase: the default `accept`
// allowlists PNG/JPEG/WebP and EXCLUDES SVG (the stored-XSS gate), and preview object URLs
// are revoked on unmount (no blob-URL leak) — both client-side defense-in-depth UX, the
// authoritative gate is `server-2` in v1.0. `RejectReason` graduates so a caller types the
// `rejectedCopy` map by it. The internal `fileUpload` tv() recipe + the accept/reject/
// object-URL logic stay internal (NOT graduated); copy resolves in the story as plain
// props (uikit boundary). This COMPLETES the KIT-05 form family (Field, Input, Select,
// Stepper, FileUpload).
export type { RejectReason } from "./shared/uikit/FileUpload";
export { FileUpload } from "./shared/uikit/FileUpload";

// ---- KIT-06 Overlay family — Dialog + Popover (Wave 5 / Plan 03-05) ----
// The first overlay-family slice group. `Dialog` is the MODAL surface over Ark Dialog —
// Ark owns the focus trap inside, the focus RETURN to the trigger on close, Esc-close, the
// scroll-lock + inert/aria-hidden background; the slice adds the per-part `tv()` recipe
// (surface-1 + border-2 + rounded-xl + --shadow-lg over an `overlay` scrim), a real
// `Dialog.Title` heading, and the icon-only close whose `closeAria` the caller injects. Its
// story ships the destructive-confirmation pattern (WCAG 3.3.6 — `loss` confirm + icon +
// verb+noun label, focus on the safe cancel) Phases 8–9 compose. `Popover` is the NON-modal
// sibling over Ark Popover (surface-1 + border-2 + rounded-lg + --shadow-md) — focus-managed,
// returns focus, Esc-closes, NO trap. Both animate transform/opacity only (CLS = 0) and take
// the controlled `open`/`onOpenChange` (+ uncontrolled `defaultOpen` for the forced-open axe
// cell). The internal `dialog`/`popover` tv() recipes stay internal (NOT graduated); copy
// resolves in the story and passes as plain props (uikit boundary).
export { Dialog } from "./shared/uikit/Dialog";
export { Popover } from "./shared/uikit/Popover";
