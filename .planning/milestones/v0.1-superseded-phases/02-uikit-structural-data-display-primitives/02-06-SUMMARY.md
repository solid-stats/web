---
phase: 02-uikit-structural-data-display-primitives
plan: 06
subsystem: uikit
tags: [kit-02, data-table, sticky-header, cls, colgroup, controlled-props, aria-sort, aria-selected, full-row-click-zone, density, compact-row, pagination, tailwind-variants, lucide-react, ladle, axe, a11y, container-queries, tailwind-v4]

# Dependency graph
requires:
  - phase: 02-uikit-structural-data-display-primitives
    plan: 01
    provides: "Vitest + Playwright-against-Ladle catalog gate (axe/44px/keyboard), _fixtures (ROSTER/scoreOf/kdOf, SS_BASELINE/tierFor pure, STRINGS RU+EN), _state-matrix (StateMatrix/StateCell)"
  - phase: 02-uikit-structural-data-display-primitives
    plan: 03
    provides: "Skeleton table variant (fixed colgroup + header + N×ROW_H, ROW_H 52/44), tv() on tailwind-variants/lite, colocated component-shape, cls.spec pattern, EmptyState/ErrorState"
  - phase: 02-uikit-structural-data-display-primitives
    plan: 04
    provides: "data-state + tv() forced-pseudo-state recipe, NavBar before: inset cyan left-edge marker precedent, shadow-(--shadow-ring) focus, container-keyed reflow precedent"
  - phase: 02-uikit-structural-data-display-primitives
    plan: 05
    provides: "TierChip/TierScale + Pips discrete meter (tier→semantic-token literal map: loss/warn/info/win ascending), baseline-explicit tierFor, never-color-alone (color + word/value + Pips)"
provides:
  - "KIT-02 data-table family — six colocated Ladle slices: Table (CLS-0 sticky-header scroll-in-card, real <table className=table-fixed> + <colgroup> fixed widths + sticky <thead> on surface-2 inside an overflow-y-auto reserved-height viewport; fixed ROW_H 52/44 + top/bottom spacer rows = virtualization-READY but NOT virtualized — D-01; loading swaps in the Plan-03 Skeleton table variant for CLS=0), Th (plain <button> + Lucide arrow + aria-sort asc/desc/none, controlled sort prop), TableRow (whole-row click zone + focusable name-cell <a> anchor stretched via after:inset-0; selected = primary-weak + inset 2px cyan before: left-edge + aria-selected; truncate+title long cells; tier-colored Счёт/K-D with Pips), DensityToggle (controlled ROW_H 52/44 segmented toggle, active = cyan + aria-pressed + Rows3/Rows2 icon), CompactRow/CompactList (mobile < md @container reflow: top-N + «показать ещё · N», secondary cols dropped, label-over-value, NO h-scroll/nested-scroll at 360px), Pagination (inert cursor affordance Назад/Дальше + «Это всё» end-of-list, controlled hasPrev/hasNext)"
  - "Presentational-only (D-01): sort/density/selection/pagination are CONTROLLED props — the durable interface the v1.0 TanStack/server engine swaps into without changing the visual contract; NO @tanstack/react-table, NO @tanstack/react-virtual imported anywhere (grep 0)"
  - "CLS-0 table contract: the loading state IS the Skeleton table variant (identical colgroup + header + N×ROW_H); cls.spec proves the loading-table card box height+width === the data-table card box (CLS=0). Reserved/viewport/spacer heights + colgroup widths are computed dynamic values via inline style (row-model geometry, not themable tokens); row/cell visual classes stay literal token utilities"
  - "Full-row a11y (Pitfall 5): the name-cell <a data-name-anchor> is the focusable affordance (after:inset-0 stretches its hit area across the row), Tab reaches it, SR traverses rows; keyboard.spec asserts Tab reaches the anchor + the selected row carries aria-selected (not fill-only)"
  - "All rows from the single _fixtures roster (Vasiliy #1, Score 4.13 отлично / K/D 3.39, descending to the negative-score tail), tier-colored via tierFor (baseline explicit, D-04); ×7 row states + ×4 data-volumes + ×5 endings; axe-clean / keyboard / ≥44px / RU + EN"
  - "Added densityGroup/densityComfortable/densityCompact + paginationEnd to _fixtures/STRINGS (RU+EN parity)"
  - "Graduated into the public barrel @solid-stats/design (src/index.ts) — Table, Th, TableRow, DensityToggle, CompactList, CompactRow, Pagination + the Sort*/TableColumn/TableDensity/TierCell/CompactRowData types; completes the full Phase-2 structural & data-display catalog (KIT-01/02/03/04/07). _fixtures/_state-matrix/Smoke stay internal"
  - "tests/cls.spec: Table loading-vs-data card box equality (CLS=0); tests/keyboard.spec: Table full-row anchor reachability + aria-selected; tests/responsive.spec: CompactRow 360px no h-scroll/no nested scroll + show-more present"
affects: [phase-04-overview-surface, phase-05-player-profile-surface, phase-06-commander-side-surface, phase-07-replays-surface, phase-09-all-surfaces]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CLS-0 data table: a real <table className=table-fixed> + <colgroup> of fixed px widths inside an overflow-y-auto viewport of RESERVED height (header + visibleRows×ROW_H via inline style); the loading state REUSES the Plan-03 Skeleton table variant (identical geometry) so the skeleton→data swap shifts nothing. Proven by cls.spec card-box equality"
    - "Virtualization-ready (NOT virtualized) row model (D-01): top/bottom spacer <tr> of computed inline-style height frame the visible window, so the v1.0 virtualizer drops into the same spacer math without changing the visual contract"
    - "Full-row click zone with keyboard/SR support (Pitfall 5): a focusable <a> in the name cell whose after:inset-0 pseudo-element stretches the hit area across the whole row — Tab reaches the anchor (it owns the accessible name + focus ring), the row is the pointer target. after:content-[''] is the sanctioned pseudo-element idiom, not a token-substitutable arbitrary value"
    - "Selected row = THREE redundant signals (never fill-only): primary-weak fill + an inset 2px cyan left-edge via a literal before: bar (NavBar precedent) + aria-selected"
    - "Controlled-prop primitive (D-01): sort (aria-sort + controlled SortState) / density (controlled TableDensity) / selection (controlled selected) / pagination (controlled hasPrev/hasNext) — the durable interface the v1.0 engine swaps into; no engine, no server this phase"
    - "Wide fixed-colgroup row primitives (TableRow ×7 states, table data-volumes) are demoed in full-width labelled rows, NOT crammed into a narrow StateMatrix cell which clips the 640px colgroup — same fix as the prior-wave MiniStatGrid"
    - "Mobile table reflow (@container, styling.md): CompactList is the @container root; CompactRow stacks label-over-value, drops secondary columns, top-N + «показать ещё · N» — NO horizontal scroll, NO nested scroll (the page scrolls; .design mobile model)"

key-files:
  created:
    - packages/design/src/shared/uikit/Table/{index.ts,Table.tsx,Th.tsx,TableRow.tsx,Table.stories.tsx}
    - packages/design/src/shared/uikit/DensityToggle/{index.ts,DensityToggle.tsx,DensityToggle.stories.tsx}
    - packages/design/src/shared/uikit/CompactRow/{index.ts,CompactRow.tsx,CompactRow.stories.tsx}
    - packages/design/src/shared/uikit/Pagination/{index.ts,Pagination.tsx,Pagination.stories.tsx}
  modified:
    - packages/design/src/index.ts
    - packages/design/src/shared/uikit/_fixtures/strings.ts
    - packages/design/tests/cls.spec.ts
    - packages/design/tests/keyboard.spec.ts
    - packages/design/tests/responsive.spec.ts

key-decisions:
  - "Table is presentational-only (D-01): NO @tanstack/react-table, NO @tanstack/react-virtual; sort/density/selection/pagination are controlled props. The row model is virtualization-READY (fixed ROW_H + computed spacer rows) but NOT virtualized — the v1.0 engine swaps into the same spacer math"
  - "The loading state REUSES the Plan-03 Skeleton table variant (not a rebuilt skeleton) — guaranteeing the CLS=0 colgroup+header+ROW_H match the data table; cls.spec asserts the card box equality"
  - "Th and TableRow are nested leaf components inside the Table slice (architecture.md leaf-granularity, D-02) and graduate together; the selected-row inset cyan edge is a literal before: bar (NavBar precedent), NOT an arbitrary box-shadow value"
  - "Full-row click zone uses a focusable name-cell <a> with after:inset-0 stretch (Pitfall 5) — the keyboard/SR-reachable affordance; after:content-[''] is the standard pseudo-element idiom (the only non-token class string, not a substitutable arbitrary value)"
  - "CompactRow/CompactList is the mobile (< md) reflow keyed off @container (not viewport), top-N + «показать ещё · N» per the .design mobile model; NO horizontal/nested scroll at 360px"
  - "Pagination is inert this phase (no server) — controlled hasPrev/hasNext; .design notes prod virtualizes (no real pagination), so this is the durable cursor affordance the v1.0 cursor swaps into"

patterns-established:
  - "CLS-0 data table (table-fixed + colgroup + reserved viewport + ROW_H + spacer rows + Skeleton-variant loading) — the data surface every public-stats page (Phases 4-7) composes"
  - "Full-row click zone with a focusable name-cell anchor (after:inset-0 stretch + aria-selected) — the keyboard/SR-traversable row pattern for all list/table surfaces"
  - "Controlled-prop table primitive (sort/density/selection/pagination as props) — the durable interface for the mechanical v1.0 swap-to-server"

requirements-completed: [KIT-02, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06]

# Metrics
duration: ~50min
completed: 2026-06-21
status: complete
---

# Phase 2 Plan 06: KIT-02 Data-table Family Summary

**Six colocated Ladle slices completing the Phase-2 catalog — Table (a CLS-0 sticky-header scroll-in-card: real `<table table-fixed>` + `<colgroup>` fixed widths + reserved-height `overflow-y-auto` viewport + fixed ROW_H 52/44 + virtualization-ready spacer rows; loading reuses the Plan-03 Skeleton table variant for an exact CLS=0 swap), Th (plain `<button>` + Lucide arrow + `aria-sort`, controlled sort), TableRow (whole-row click zone with a focusable name-cell anchor stretched via `after:inset-0`; selected = primary-weak + inset 2px cyan `before:` edge + `aria-selected`, never fill-only; truncate+title; tier-colored Счёт/K-D with Pips), DensityToggle (controlled 52/44, active = cyan + `aria-pressed` + icon), CompactRow/CompactList (mobile `@container` reflow: top-N + «показать ещё · N», no h-scroll at 360px), and an inert Pagination cursor affordance — presentational-only (D-01, no `@tanstack/react-table`/`react-virtual`), all rows from the single `_fixtures` roster (Vasiliy #1), axe-clean / keyboard / ≥44px / RU+EN, graduated into `@solid-stats/design` and design-review APPROVED.**

## Performance

- **Duration:** ~50 min
- **Tasks:** 3 (Tasks 1-2 TDD-marked — "test" = the catalog/cls/keyboard/responsive gate; Task 3 graduation + per-family design-review + full-phase gate)
- **Files:** 19 (16 created across 4 slices, 3 modified beyond the barrel: STRINGS, cls.spec, keyboard.spec, responsive.spec)

## Accomplishments

- **Table:** a real `<table className="w-full table-fixed">` + a `<colgroup>` of fixed `<col>` widths + a sticky `<thead>` (`table-header` on surface-2) inside an `overflow-y-auto` viewport of reserved height (`header 44 + visibleRows×ROW_H`, computed inline style). Fixed `ROW_H` (52 comfortable / 44 compact) + top/bottom spacer `<tr>` of computed height (virtualization-READY, NOT virtualized — D-01). The `loading` prop swaps in the Plan-03 `Skeleton variant="table"` reproducing the exact colgroup + header + N×ROW_H (CLS=0).
- **Th:** a plain `<button>` inside the `<th>` (`min-h-11` hit area) + a Lucide arrow (`arrow-up`/`arrow-down`/`arrow-up-down`) + `aria-sort` (ascending/descending/none) on the `<th>`; sort is a controlled prop (parent owns it — no overlay/menu/engine). The sorted column's label + arrow are cyan (paired, never color-alone). Numeric headers right-aligned.
- **TableRow:** the whole row is the click zone with a focusable `<a data-name-anchor>` in the player-name cell (`after:inset-0` stretches the hit area; Tab reaches the anchor, SR traverses rows — Pitfall 5). Selected = `primary-weak` fill + an inset 2px cyan left-edge `before:` bar + `aria-selected` (never fill-only). Long name/squad cells `truncate` + `title` (Pitfall 6). Numeric cells `table-cell-numeric` (tabular mono, right-aligned), Счёт/K-D tier-colored with `Pips`.
- **DensityToggle:** a controlled segmented toggle switching `ROW_H` 52/44; each option a ≥44px `<button>`, the active one cyan + `aria-pressed` + the `Rows3`/`Rows2` density icon (never color-alone). RU+EN labels.
- **CompactRow/CompactList:** the mobile (`< md`) layout — a `@container`-keyed stack of label-over-value rows, top-N + a «показать ещё · N» expander, secondary columns dropped, NO horizontal scroll and NO nested scroll at 360px (the page scrolls). Full-row name anchor; tier-colored Счёт/K-D with Pips.
- **Pagination:** an inert cursor affordance — Назад/Дальше (controlled `hasPrev`/`hasNext`) + a «Это всё» end-of-list marker; each control ≥44px with a Lucide chevron + the label word, the active chevron cyan (never icon/color-alone).
- **Fixtures:** added `densityGroup`/`densityComfortable`/`densityCompact` + `paginationEnd` to `_fixtures/STRINGS` (RU+EN parity).
- **Barrel graduation:** appended the KIT-02 block (`Table, Th, TableRow, DensityToggle, CompactList, CompactRow, Pagination` + the `Sort*`/`TableColumn`/`TableDensity`/`TierCell`/`CompactRowData` types) — completing the full Phase-2 catalog (KIT-01/02/03/04/07). `_fixtures`/`_state-matrix`/Smoke stay internal.

## Task Commits

1. **Task 1: Table + Th + TableRow** — `148f723` (feat)
2. **Task 2: DensityToggle + CompactRow + Pagination** — `36c4658` (feat)
3. **Task 3: Graduate KIT-02 into the barrel + design-review fix + full-phase gate** — `ab76f45` (feat)

_Note: the plan-metadata commit (this SUMMARY) follows; STATE.md/ROADMAP.md are owned by the orchestrator (worktree mode)._

## Decisions Made

- **Presentational-only (D-01):** sort/density/selection/pagination are controlled props; the row model is virtualization-ready (fixed ROW_H + computed spacer rows) but NOT virtualized — NO `@tanstack/react-table`, NO `@tanstack/react-virtual` (grep 0).
- **Loading REUSES the Plan-03 Skeleton table variant** (not a rebuilt skeleton) — guaranteeing the CLS=0 colgroup+header+ROW_H match; cls.spec asserts the card box equality.
- **Th/TableRow nested in the Table slice** (architecture.md leaf-granularity, D-02), graduate together. Selected inset cyan edge = a literal `before:` bar (NavBar precedent), not an arbitrary box-shadow.
- **Full-row anchor via `after:inset-0`** (Pitfall 5); `after:content-['']` is the standard pseudo-element idiom (the only non-token class string, not a substitutable arbitrary value).
- **CompactRow keyed off `@container`** (styling.md), not viewport; **Pagination inert** (no server — the durable cursor affordance for v1.0).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] DensityToggle/Pagination per-option copy added to _fixtures/STRINGS**
- **Found during:** Task 2 (the DensityToggle needs the density label SPLIT into a group name + per-option words; Pagination needs an end-of-list marker — STRINGS only carried the combined `densityToggle` phrase + `paginationPrev`/`paginationNext`).
- **Issue:** the Copywriting Contract did not enumerate the split density labels (group + Обычная/Компактная as separate keys) or the «Это всё» end-of-list marker.
- **Fix:** added `densityGroup`, `densityComfortable`, `densityCompact`, `paginationEnd` (all RU+EN) to STRINGS.
- **Files modified:** packages/design/src/shared/uikit/_fixtures/strings.ts
- **Verification:** all DensityToggle/Pagination stories render RU+EN from STRINGS; structural `satisfies Record<string, Bilingual>` holds; `pnpm check` exit 0.
- **Committed in:** `36c4658` (Task 2)

**2. [Rule 1 - Bug] TableRow ×7-states story clipped the Счёт/K-D columns in the narrow StateMatrix cell**
- **Found during:** Task 3 (per-family visual design-review — the row-states screenshot showed only rank/name/squad; the two numeric tier columns were clipped off-screen).
- **Issue:** the TableRow row is rendered inside a `table-fixed` with a 640px fixed colgroup (56+200+120+132+132); a ~360px-wide 3-col `StateMatrix` cell honored the colgroup widths and `overflow-hidden` clipped the trailing Счёт/K-D columns — the exact wide-primitive-in-narrow-cell defect the prior wave hit with MiniStatGrid.
- **Fix:** rendered each of the ×7 states as a full-width labelled row (keeping the `data-state-cell` hook the catalog spec asserts) instead of inside the cramped StateMatrix grid; moved the narrow-safe `empty` data-volume cell onto the shared StateMatrix (key_link preserved).
- **Files modified:** packages/design/src/shared/uikit/Table/Table.stories.tsx
- **Verification:** re-screenshot at 1100px confirms all five columns visible across enabled/hover/pressed/focused/selected/disabled/loading; the selected row shows the cyan inset edge + primary-weak fill; full Playwright 203/203 green.
- **Committed in:** `ab76f45` (Task 3)

---

**Total deviations:** 2 auto-fixed (1 missing-critical copy, 1 visual-clip bug). Both caught by the per-family design-review / story-render sweep, exactly the gate's purpose. No scope creep — each fix closes a stated acceptance criterion (RU+EN split labels; the visible ×7 row-state matrix).
**Impact on plan:** both auto-fixes necessary for correctness; the family ships as specified.

## Issues Encountered

- **Worktree path inode (recurring, Wave 0-5):** Read resolves via the `.agents/...` path but Write/Edit require the `.claude/...` worktree path (same inode/symlink). Used the `.claude/`-prefix for all Write/Edit.
- **Ladle story-id slug:** the `CompactRow` component-title segment slugifies to `compactrow` (no hyphen), not `compact-row`; corrected the responsive.spec story id after the first run surfaced a 0-match timeout.
- **`vp check --fix` format drift (recurring):** the formatter reformatted my in-scope files (kept) only; no out-of-scope files touched this wave.
- **Background-preview teardown exit 144:** killing the `ladle preview` background server returns a signal-based exit 144 in the sandbox (cosmetic teardown noise — the screenshots/gate ran first). Captured the design-review screenshots via a small `@playwright/test` chromium script that waits for `[data-storyloaded]`.

## Design Review (per-family, 7 pillars)

**Verdict: APPROVE** (2 findings raised → both fixed → re-reviewed via screenshots + the full gate).
- **Pillar 1 (tokens/contrast):** 0 arbitrary token values / raw hex across all 4 slices (grep clean); selected edge = literal `before:bg-primary` bar; tier color = the established literal semantic-token map (loss/warn/info/win); `design.md lint` errors=0 (86 pre-existing warnings, none introduced).
- **Pillar 2 (CLS):** the Table loading state IS the Skeleton table variant (identical colgroup + header + N×ROW_H); cls.spec proves the loading-table card box height+width === the data-table card box (CLS=0). Reserved viewport/spacer/colgroup are computed inline-style geometry; no animated layout property.
- **Pillar 3 (a11y / keyboard):** axe 0 serious/critical on all 15 KIT-02 stories; the full-row name anchor is keyboard-focusable (keyboard.spec: Tab reaches `data-name-anchor`); the selected row carries `aria-selected` (not fill-only); `aria-sort` on the headers; DensityToggle `aria-pressed`; Pagination labels + chevrons (never icon/color-alone); every interactive target ≥44px; focus ring on the anchor (not hidden under the sticky header — WCAG 2.4.12).
- **Pillar 4/5 (states / responsive):** ×7 row states (enabled/hover surface-3/pressed/focused/selected/disabled/loading skeleton) full-width visible; ×4 data-volumes (empty EmptyState / few / many capped window with total in caption / limit negative-score tail); ×5 endings (success / system-error ErrorState+ref / user-error n/a read-only / loading skeleton / onboarding-empty); CompactRow at 360px verified no horizontal scroll + no nested scroll + the «показать ещё · N» expander present.
- **Pillar 6 (domain):** dark-only gunmetal; tabular-mono numerals; mock numbers obey the Score/K-D formulas — Vasiliy #1 (Score 4.13 отлично / K/D 3.39), descending consistently to the negative-score tail (low tier red), and no generated player outranks the real leaders; Pips discrete meter is the genuine non-color signal; RU+EN natural.
- **Validation Gaps:** CWV (LCP/INP) N/A (static fixture catalog, no fetch/route; CLS=0 by reservation); SEO (Pillar 7) N/A (uikit primitives, not public routes); back/scroll-restore + SSE N/A (no routing/data layer); virtualization is deferred to v1.0 (D-01 — row model is ready); multi-breakpoint 1920/2560 — chromium-only locally (reflow proven programmatically @360 + @container).

## Verification (plan `<verify>`)

- ✅ `pnpm exec ladle build` — green (4 KIT-02 slices, 15 stories in meta.json).
- ✅ `pnpm exec playwright test` — **203/203 green** (KIT-02 catalog axe serious/critical=0, 44px, keyboard full-row; Table CLS=0 skeleton/data card match; CompactRow 360px no h-scroll/no nested scroll + show-more; prior KIT-01/03/04/07 specs intact).
- ✅ `pnpm exec vitest run` — **78/78 green** (the _fixtures tier/roster proofs).
- ✅ Root `pnpm check` — **exit 0** (gen-theme idempotent, theme.css no drift; design.md lint errors=0; format 104 files clean; lint 98 files 0 errors).
- ✅ Barrel: `import { Table, Th, TableRow, DensityToggle, CompactList, CompactRow, Pagination } from "@solid-stats/design"` resolves alongside every prior family (KIT-01/03/04/07) — the full Phase-2 catalog graduated; helpers/Smoke/_fixtures absent (0 export statements).
- ✅ `grep -rE '@tanstack/react-(table|virtual)'` import lines across `src/` + `tests/` — **0** (D-01 honored).
- ✅ `grep -rE '(bg|text|p|w|h|…)-\[…\]' / '#[0-9A-Fa-f]{6}'` across all 4 slices — **0 arbitrary token values / 0 raw hex** (`after:content-['']` is the sanctioned pseudo-element idiom).
- ✅ `solidstats-frontend-react-design-review` — **APPROVE** (7 pillars, 2 findings raised+fixed).

## Self-Check: PASSED

- 4/4 entry component files present on disk (Table/DensityToggle/CompactRow/Pagination `.tsx`); Th + TableRow leaves present.
- All 3 task commits exist (`148f723`, `36c4658`, `ab76f45`).
- Verification block: Playwright 203/203; Vitest 78/78; root `pnpm check` exit 0; 0 @tanstack imports; 0 arbitrary token values; barrel graduates the 7 KIT-02 names alongside all prior families (helpers/Smoke/_fixtures absent).
- STATE.md / ROADMAP.md NOT touched (worktree mode — orchestrator updates after merge).

## Next Phase Readiness

- The KIT-02 data-table family is importable from `@solid-stats/design` — surface-builders of Phases 4+ mount the data surface (sortable sticky-header table, density toggle, mobile compact list, pagination cursor) with all numbers internally consistent via the single fixture source. **The full Phase-2 structural & data-display catalog (KIT-01/02/03/04/07) is now complete and green — ready for `/gsd-verify-work`.**
- **CLS-0 data table** + **full-row keyboard/SR click zone** + **controlled-prop table primitive** are the durable patterns the Overview / Player-profile / Commander-side / Replays surfaces compose.
- v1.0 swap is mechanical: sort/density/selection/pagination are already controlled props and the row model is virtualization-ready (fixed ROW_H + computed spacer rows) — replace `_fixtures` with the typed `server-2` client and drop in `@tanstack/react-table` + `@tanstack/react-virtual` into the same spacer math; the prop contract is the durable interface.

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-21*
