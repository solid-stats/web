---
phase: 02-uikit-structural-data-display-primitives
plan: 09
subsystem: ui
tags: [react, tailwind, ladle, data-table, pagination, skeleton, container-queries, cls]

# Dependency graph
requires:
  - phase: 02-07
    provides: the shared Button/Link `control` base primitive (segment/secondary variants, ≥44px hit area, the canonical focus ring) — the Pagination pagers render through it
  - phase: 02-06
    provides: the original KIT-02 data table (Table/Th/TableRow), Pagination, DensityToggle this plan reworks
  - phase: 02-03
    provides: the Skeleton table variant (KIT-07) this plan's border-box math + framing fixes
provides:
  - GAP-08 closed — border-box table viewport math (border-separate + cell hairlines); no stray scroll on the data table OR the skeleton; cls.spec asserts no-scrollbar on both
  - GAP-11 closed — the Table/RowStates loading cell renders the actual loading Skeleton (shimmer), not a real data row
  - GAP-07 closed — a REAL controlled Pagination pager (N–M of total range + disabled Next at end-of-list + Prev disabled at start), no bare «Это всё» text marker
  - GAP-14 closed — few vs limit-reached read differently via the caption total + the end-of-list pager
  - GAP-06 closed — DensityToggle removed; table density auto-derives from the @container via the new AutoTable resolver; ROW_H 52/44 + the controlled density prop kept
affects: [player-surfaces, squad-surfaces, replay-surfaces, any-future-data-table]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "border-box table geometry: `border-separate border-spacing-0` + cell-level `border-b` (box-internal under Tailwind box-border) so reserved height = header + N rows with no stray scroll — replaces the `border-collapse` model whose hairlines added outside the row boxes"
    - "auto density resolver: container-keyed (`@container` `@5xl:block`/`@5xl:hidden`) two-branch render mirroring AppShell reflow — no user-facing toggle, no JS width hook, CLS-safe (one branch display:none)"
    - "shared table geometry source: `tableViewportHeight(visibleRows, rowHeight)` co-located with ROW_H in the Skeleton module (Table → Skeleton, no cycle); the Skeleton `framed` prop lets the Table frame it as the loading body without a card-in-card"

key-files:
  created:
    - packages/design/src/shared/uikit/Table/AutoTable.tsx
  modified:
    - packages/design/src/shared/uikit/Table/Table.tsx
    - packages/design/src/shared/uikit/Table/Th.tsx
    - packages/design/src/shared/uikit/Table/TableRow.tsx
    - packages/design/src/shared/uikit/Table/Table.stories.tsx
    - packages/design/src/shared/uikit/Table/index.ts
    - packages/design/src/shared/uikit/Pagination/Pagination.tsx
    - packages/design/src/shared/uikit/Pagination/Pagination.stories.tsx
    - packages/design/src/shared/uikit/Skeleton/Skeleton.tsx
    - packages/design/src/shared/uikit/Skeleton/index.ts
    - packages/design/src/shared/uikit/Skeleton/Skeleton.stories.tsx
    - packages/design/src/shared/uikit/_fixtures/strings.ts
    - packages/design/src/index.ts
    - packages/design/tests/cls.spec.ts

key-decisions:
  - "GAP-08 fix uses `border-separate border-spacing-0` + cell-level hairlines (box-internal) rather than padding the reserved height for collapsed borders — symmetric, deterministic, keeps the data box == skeleton box"
  - "the single header hairline is the only +1px reserved in `tableViewportHeight` (the body rows net out: each row's bottom hairline is box-internal, the last drops via `last:[&>td]:border-b-0`)"
  - "auto density derives at `@5xl` (~1024px container) — the AppShell desktop-class breakpoint + the closest container utility to the hi-fi `max-width: 980px` mobile threshold (players.jsx L318)"
  - "real-pager (GAP-07) is a JUSTIFIED divergence from the hi-fi no-pager (capped virtualized scroll) model — the recorded UAT user decision (option B)"
  - "the Skeleton gains a `framed` prop: framed=true standalone (its own card, KIT-07 Proof), framed=false when the Table swaps it in (the Table's card+viewport frame it, no card-in-card overflow)"

patterns-established:
  - "AutoTable: the durable auto-density wrapper future data surfaces mount instead of wiring a density control"
  - "Pagination real-pager contract: from/to/total + hasPrev/hasNext controlled props (no engine, D-01); the v1.0 cursor swaps into the same shape"

requirements-completed: [KIT-02, QUAL-02, QUAL-04]

# Metrics
duration: 38min
completed: 2026-06-24
status: complete
---

# Phase 02 Plan 09: KIT-02 data-table geometry + controls (gap-closure) Summary

**Reworked the KIT-02 data table to match the binding hi-fi semantics: border-box viewport math (no stray scroll on the table or the skeleton), a real N–M-of-total Pagination pager with a disabled Next at end-of-list, the loading cell shows the skeleton, distinct few/limit cues, and DensityToggle replaced by auto density derived from the @container.**

## Performance

- **Duration:** ~38 min
- **Started:** 2026-06-24T00:44:42+07:00 (first task commit)
- **Completed:** 2026-06-24
- **Tasks:** 3
- **Files modified:** 13 (1 created, 3 deleted)

## Accomplishments
- GAP-08: switched the table from `border-collapse` to `border-separate border-spacing-0` with cell-level hairlines (box-internal), so the reserved viewport (header + N rows + the single header hairline) fits exactly — no stray ~1–2px scrollbar on the data table or the Skeleton table variant.
- GAP-11: the Table/RowStates loading cell now renders `<Table loading>` (the shimmer skeleton), not a real Vasiliy data row.
- GAP-07: rebuilt Pagination as a real controlled pager — a «N–M из total» range indicator framed by Prev / Next, with a DISABLED Next at end-of-list (keeps its label + `data-page-next`, no bare «Это всё» `<span>`), Prev disabled at the start.
- GAP-14: the DataVolumes few/limit cells now read differently — few/many show «N из total» (a few of a larger 200-set); limit-reached shows «Все N · конец списка» + the real Pagination at end-of-list.
- GAP-06: deleted the DensityToggle slice (component + story + barrel export); the new `AutoTable` resolver derives density from the `@container` (comfortable at the `@5xl` desktop-class width, compact below), mirroring AppShell reflow + hi-fi `players.jsx` L318. `ROW_H` 52/44 and the controlled `density` prop on `Table` are kept.

## Task Commits

Each task was committed atomically:

1. **Task 1: GAP-08 border-box viewport math + GAP-11 loading cell** — `cca9681` (fix)
2. **Task 2: GAP-07/14 real Pagination pager + distinct few/limit cues** — `8f179f4` (feat)
3. **Task 3: GAP-06 drop DensityToggle, auto density from @container** — `b909525` (feat)

## Files Created/Modified
- `Table/AutoTable.tsx` (created) — the auto-density resolver (@container two-branch render, replaces DensityToggle)
- `Table/Table.tsx` — `border-separate` + cell hairlines; imports `tableViewportHeight`; the controlled `density` prop docstring updated
- `Table/Th.tsx` — the header `<th>` carries the bottom hairline (moved off the `<tr>`)
- `Table/TableRow.tsx` — row hairline moved to the cells (`[&>td]:border-b … last:[&>td]:border-b-0`)
- `Table/Table.stories.tsx` — RowStates loading shows the skeleton; AutoDensity story; few/limit VolumeCaption + end-of-list pager
- `Table/index.ts` — exports `AutoTable`
- `Pagination/Pagination.tsx` — real pager (from/to/total range model, disabled Next at end), drops the `data-page-end` span
- `Pagination/Pagination.stories.tsx` — start / middle / end-of-list pager states, RU+EN
- `Skeleton/Skeleton.tsx` — `tableViewportHeight` (shared geometry source); the `framed` prop; reserved-band wrapper
- `Skeleton/index.ts` — exports `tableViewportHeight`
- `Skeleton/Skeleton.stories.tsx` — the Proof FinalTable reserves the same band height
- `_fixtures/strings.ts` — drop `paginationEnd` + the 4 density-toggle keys; add `paginationRange` (RU+EN)
- `src/index.ts` — drop the `DensityToggle` export; add `AutoTable`
- `tests/cls.spec.ts` — add `scrollHeight <= clientHeight` on the data-table viewport, the loading skeleton viewport, and the standalone Skeleton table variant

## Decisions Made
- GAP-08 solved via `border-separate` + box-internal cell hairlines (symmetric, deterministic) rather than padding the reserved height for collapsed borders.
- Auto density derives at `@5xl` (~1024px container) — the AppShell desktop breakpoint, closest to the hi-fi `max-width: 980px` threshold.
- The real pager (GAP-07) is a recorded UAT user decision (option B) — a justified divergence from the hi-fi capped-virtualized-scroll no-pager model.
- `tableViewportHeight` + the Skeleton `framed` prop are the single shared geometry source (co-located in Skeleton to keep the Table → Skeleton dependency one-directional).

## Deviations from Plan

None — plan executed as written. The GAP-08 fix chose the plan-sanctioned "drop the inner borders from the height-bearing boxes" branch (border-separate + box-internal cell hairlines) over the "add the border total to the height" branch, after empirical measurement showed the collapsed-border model was the asymmetry; both were offered by the plan.

## Issues Encountered
- Initial `border-collapse` + a border-total reservation made the data box (362) ≠ skeleton box (358); switching to `border-separate` with cell-level hairlines and reserving only the single header hairline made both equal AND scroll-free (measured via a throwaway Playwright probe, then removed).
- A card-in-card overflow appeared when the Table wrapped the standalone (framed) Skeleton inside its scrolling viewport; resolved with the Skeleton `framed={false}` path so the Table's own card+viewport frame the band.
- Stale reused `ladle preview` servers (`reuseExistingServer: !isCI`) produced false "story not found" failures during iterative test runs; a clean rebuild + fresh server confirmed all stories load (215 playwright tests green).

## Design Review (seven pillars, diffed vs the binding hi-fi)

**Verdict: APPROVE.** Diffed against `.design/hifi/players.jsx`:

| Hi-fi semantic | Source | This rework | Status |
|---|---|---|---|
| Density derived from device/screen, no toggle | L318 `density = device==='desktop' && !winMobile ? 'comfortable':'compact'` | `AutoTable` `@container` `@5xl` branches | Matched |
| Total in the count caption | L341/L407 `total` | `VolumeCaption` «N из total» + Pagination «N–M из total» | Matched |
| Capped virtualized scroll, NO pager | L173+ | a real controlled pager | Justified divergence (UAT GAP-07 user decision, option B) |
| Skeleton mirrors the table, never scrolls | `TableSkeleton` | border-box band == data box, cls.spec asserts no-scroll on both | Matched |

One 🔵 (optional): `AutoTable` renders both density branches into the DOM (one `display:none`) — acceptable for a catalog primitive; `display:none` removes the hidden branch from the a11y tree (axe clean).

## Self-Check: PASSED

- Created file exists: `packages/design/src/shared/uikit/Table/AutoTable.tsx` — FOUND
- Modified files exist: `Table/Table.tsx`, `Pagination/Pagination.tsx`, `Skeleton/Skeleton.tsx` — FOUND
- DensityToggle slice removed: `packages/design/src/shared/uikit/DensityToggle/` — GONE
- Task commits exist: `cca9681` (GAP-08/11), `8f179f4` (GAP-07/14), `b909525` (GAP-06) — all FOUND
- Gates: `ladle build` green · `playwright test` 215 passed / 0 failed · `vitest run` 91 passed · root `pnpm check` exit 0 · zero arbitrary values · no `@tanstack/react-(table|virtual)` (D-01) · no dangling DensityToggle import

## Next Phase Readiness
- GAP-06/07/08/11/14 closed; remaining phase-02 gap-closure plans 02-10 (e.g. GAP-09/10 selected/focused row states) and 02-11 still pending.
- `AutoTable` + the real Pagination contract are the durable shapes the v1.0 data surfaces and cursor engine swap into.

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-24*
