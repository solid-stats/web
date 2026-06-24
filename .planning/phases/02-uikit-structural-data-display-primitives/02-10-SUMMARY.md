---
phase: 02-uikit-structural-data-display-primitives
plan: 10
subsystem: ui
tags: [react, tsx, tailwind-v4, ladle, playwright, data-table, design-tokens, a11y, wcag]

# Dependency graph
requires:
  - phase: 02-09
    provides: "KIT-02 data-table geometry rework (border-separate hairlines, @container auto-density, the RowStates/DataVolumes full-width story pattern) this gap-closure builds on"
provides:
  - "TableRow selected-row marker as an inset box-shadow (--shadow-selected) — no positioned <tr>, columns stay aligned with the table-fixed colgroup"
  - "TableRow real focus-within row treatment (--shadow-row-focus inset ring) distinct from enabled, not obscured by the sticky <thead>; forced catalog state maps to the same utilities"
  - "CompactRow tight name+squad stack (hit area on the row via min-h-11, off the inline name)"
  - "CompactRow/DataVolumes story as full-width labelled sections at a <=384px column (real rows render)"
  - "Two new @theme shadow tokens (--shadow-selected, --shadow-row-focus) sourced from DESIGN.md elevation + gen-theme.mjs"
affects: [KIT-02, data-table, players-page, leaderboard, mobile-list]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inset box-shadow @theme token (shadow-(--token)) as the sanctioned escape for a marker that must NOT position/clip its host — replaces the abspos before: bar that broke table-fixed widths"
    - "One shared utility constant maps the live focus-within: prefix AND the forced catalog state to identical classes, so the static matrix proves the real interaction"
    - "Touch-target floor lives on the interactive ROW container, never on an inline text child (inflates rhythm)"

key-files:
  created: []
  modified:
    - "DESIGN.md (elevation.selected + elevation.row-focus tokens)"
    - "scripts/gen-theme.mjs (emit --shadow-selected + --shadow-row-focus)"
    - "packages/design/src/styles/theme.css (regenerated)"
    - "packages/design/src/shared/uikit/Table/TableRow.tsx"
    - "packages/design/src/shared/uikit/CompactRow/CompactRow.tsx"
    - "packages/design/src/shared/uikit/CompactRow/CompactRow.stories.tsx"
    - "packages/design/tests/keyboard.spec.ts"
    - "packages/design/tests/responsive.spec.ts"

key-decisions:
  - "Added --shadow-selected + --shadow-row-focus as first-class @theme tokens (DESIGN.md elevation → gen-theme.mjs) rather than inlining an arbitrary [box-shadow:…] value — keeps theme.css generated (pnpm check gen-theme diff stays clean) and the no-arbitrary-values grep at zero"
  - "GAP-10 focus indication is an INSET cyan ring (inset 0 0 0 2px primary), not the outset --shadow-ring — an inset ring paints inside the row box so it is never clipped under the sticky header (WCAG 2.4.12)"
  - "GAP-13 hit area moved to the flex ROW (min-h-11) and py-1 dropped from the name anchor — the squad now sits directly under the name"

patterns-established:
  - "Marker-without-positioning: an inset box-shadow token paints a left-edge/ring marker without position:relative, so it cannot perturb table-fixed colgroup widths"
  - "Forced-state ≡ live-state: a single class constant feeds both focus-within: and the data-state catalog override"

requirements-completed: [KIT-02, QUAL-02, QUAL-03]

coverage:
  - id: D1
    description: "GAP-09 — selected row uses an inset box-shadow marker (no positioned <tr>); cells stay aligned with the colgroup; aria-selected + primary-weak fill kept (never fill-only)"
    requirement: "KIT-02"
    verification:
      - kind: e2e
        ref: "packages/design/tests/keyboard.spec.ts#the selected row's columns stay aligned with the colgroup (GAP-09)"
        status: pass
      - kind: e2e
        ref: "packages/design/tests/keyboard.spec.ts#the selected row carries aria-selected (not fill-only)"
        status: pass
    human_judgment: false
  - id: D2
    description: "GAP-10 — focused row is a real focus-within treatment (surface lift + inset ring, not obscured by the sticky header), visibly distinct from enabled; forced catalog state maps to the same utilities"
    requirement: "QUAL-03"
    verification:
      - kind: e2e
        ref: "packages/design/tests/keyboard.spec.ts#the forced focused row differs from enabled (GAP-10)"
        status: pass
      - kind: e2e
        ref: "packages/design/tests/keyboard.spec.ts#live focus lifts the row and the ring is not obscured by the sticky header (GAP-10)"
        status: pass
    human_judgment: false
  - id: D3
    description: "GAP-13 — CompactRow name+squad stack tightly with the >=44px hit area on the row"
    requirement: "QUAL-02"
    verification:
      - kind: e2e
        ref: "packages/design/tests/responsive.spec.ts#the row keeps a >=44px hit area while name + squad stack tightly (GAP-13)"
        status: pass
    human_judgment: false
  - id: D4
    description: "GAP-12 — CompactRow/DataVolumes renders full-width labelled sections at a <=384px column with real rows in each volume and a single-line caption"
    requirement: "QUAL-02"
    verification:
      - kind: e2e
        ref: "packages/design/tests/responsive.spec.ts#every labelled volume cell renders real rows; the caption does not wrap (GAP-12)"
        status: pass
    human_judgment: false
  - id: D5
    description: "Seven-pillar design-review of the reworked TableRow + CompactRow diffed against the binding .design/hifi/players.jsx (selected marker / focus state / mobile stack)"
    requirement: "KIT-02"
    verification:
      - kind: manual_procedural
        ref: "design-review verdict recorded in this SUMMARY (## Design Review — hi-fi diff)"
        status: pass
    human_judgment: true
    rationale: "Structural-parity-vs-hi-fi is a visual judgment (Pillar 2 D-11); automation proves the mechanics but a human signs off the look against the frozen hi-fi"

# Metrics
duration: 25min
completed: 2026-06-24
status: complete
---

# Phase 02 Plan 10: KIT-02 Data-table Row + Compact Visuals Summary

**Selected-row inset box-shadow marker (columns now aligned), a real focus-within row ring not obscured by the sticky header, and a tight full-width mobile CompactRow — closing GAP-09/10/12/13 with two new generated shadow tokens and zero arbitrary values.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-06-24T05:23Z
- **Completed:** 2026-06-24T05:48Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- GAP-09: the selected row's left-edge marker is now an inset box-shadow on the row (`shadow-(--shadow-selected)` → `inset 2px 0 0 var(--color-primary)`); dropping the `position:relative` `<tr>` + `before:` bar means the `table-fixed` colgroup widths hold on the selected row (Счёт/K-D no longer clip). The three redundant signals (primary-weak fill + edge marker + `aria-selected`) are kept.
- GAP-10: the row gained a real `focus-within:` treatment — a surface lift plus an inset cyan ring (`--shadow-row-focus`, `inset 0 0 0 2px var(--color-primary)`). It is inset so it paints inside the row box and is never clipped under the sticky `<thead>` (WCAG 2.4.12). The forced `focused` catalog state maps to the SAME utilities via one shared constant, so the static matrix cell matches live focus.
- GAP-13: `min-h-11` (and `py-1`) came off the CompactRow inline name; the >=44px hit area now comes from `min-h-11` on the flex ROW, so name + squad stack tightly while the anchor still stretches the hit area via `after:inset-0`.
- GAP-12: the CompactRow/DataVolumes story is rebuilt as full-width labelled sections at a `<=384px` (`max-w-sm`) column — real rows render in every volume (few/many/limit/single), the caption no longer wraps to three lines.

## Task Commits

Each task was committed atomically:

1. **Task 1: GAP-09 selected-row inset box-shadow** - `deb4e49` (fix)
2. **Task 2: GAP-10 real focus-within row treatment** - `28be118` (fix)
3. **Task 3: GAP-12/13 tight CompactRow stack + full-width DataVolumes** - `f72db64` (fix)

**Plan metadata:** committed with this SUMMARY (docs).

## Files Created/Modified
- `DESIGN.md` - Added `elevation.selected` + `elevation.row-focus` source tokens
- `scripts/gen-theme.mjs` - Emit `--shadow-selected` + `--shadow-row-focus` into the `@theme` block
- `packages/design/src/styles/theme.css` - Regenerated (now carries the two new shadow tokens)
- `packages/design/src/shared/uikit/Table/TableRow.tsx` - Inset selected marker + real focus-within ROW_FOCUS treatment
- `packages/design/src/shared/uikit/CompactRow/CompactRow.tsx` - Hit area on the row, tight name+squad stack
- `packages/design/src/shared/uikit/CompactRow/CompactRow.stories.tsx` - Full-width DataVolumes sections (StateMatrix dropped)
- `packages/design/tests/keyboard.spec.ts` - GAP-09 column-alignment + GAP-10 focus tests
- `packages/design/tests/responsive.spec.ts` - GAP-13 hit-area/tight-stack + GAP-12 full-width-rows tests

## Decisions Made
- **New shadow tokens over arbitrary values.** `inset 2px 0 0 var(--color-primary)` / `inset 0 0 0 2px var(--color-primary)` cannot be expressed by a stock `shadow-*` utility, and an arbitrary `[box-shadow:…]` is banned (styling.md). Added them to `DESIGN.md` `elevation:` and taught `gen-theme.mjs` to emit `--shadow-selected` / `--shadow-row-focus`, consumed via `shadow-(--token)`. This keeps `theme.css` generated (the `pnpm check` `gen-theme` + `git diff --exit-code` gate stays green) and the no-arbitrary-values grep at zero. DESIGN.md already specified the selected `boxShadow: "inset 2px 0 0 {colors.primary}"` (L383) — the implementation finally matches the binding contract.
- **Inset focus ring, not the outset `--shadow-ring`.** An outset ring would be clipped at the row's top edge under the sticky header; an inset ring is fully within the row box (WCAG 2.4.12).
- **Touch floor on the row container.** Moving `min-h-11` from the inline name to the flex row both fixes the inflated gap and keeps the 44px target — the target was never meant to live on a text node.

## Design Review — hi-fi diff (`.design/hifi/players.jsx`, D-11)

Seven-pillar review of the reworked `TableRow` + `CompactRow` diffed against the binding frozen hi-fi. **Verdict: APPROVE.**

- **Pillar 1 (tokens/contrast):** `pnpm check` (design.md lint) errors = 0; no arbitrary values across `TableRow` + `CompactRow` (grep = 0); the two new shadow tokens resolve `{colors.primary}` through the guarded `resolveRefs`. PASS.
- **Pillar 2 (real-width visual + structural parity):**
  - *Selected marker* — hi-fi paints the selected/left-edge marker via CSS in `players.css`, not a per-row positioned `<tr>`; our inset box-shadow matches that semantic (marker without perturbing the column grid). MATCHED.
  - *Mobile stack* — hi-fi mobile list (`lb-id` name over `lb-sub` squad, L251-270) stacks the identity tightly with no 44px gap; our GAP-13 fix reproduces the tight stack. MATCHED.
  - *Full-row link* — hi-fi `tr.row-link` is a whole-row click target; our full-row anchor (`after:inset-0`) is preserved. MATCHED.
  - *Focus* — hi-fi has no explicit per-row focus ring (browser default on `row-link`); our inset focus-within ring is a justified accessibility ENHANCEMENT (WCAG 2.4.12, a11y.md), not a divergence. JUSTIFIED.
  - No hi-fi element dropped or invented by this change.
- **Pillar 3 (a11y):** axe serious/critical = 0 across the catalog (catalog.spec); `aria-selected` kept (never fill-only); visible focus on the name anchor + the row; 44px hit area on the row. PASS.
- **Pillar 4 (states/volumes):** selected no longer breaks columns; focused ≠ enabled (proven, not just declared); CompactRow ×4 volumes render real rows at a real width; few vs limit-reached already distinguished by the prior wave's caption work. PASS.
- **Pillar 5 (responsive):** CompactRow at the 360px floor — no horizontal/nested scroll, show-more present (responsive.spec, unchanged green); DataVolumes at `<=384px`. PASS.
- **Pillar 6 (system/domain):** dark-only; cyan is the single accent (selected marker + focus ring + name hover); tabular mono numerics; Pips paired with tier color. PASS.
- **Pillar 7 (SEO):** n/a — presentational catalog (D-01), no routes/SSR.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] theme.css drift would fail `pnpm check`**
- **Found during:** Task 1 (GAP-09 token)
- **Issue:** `theme.css` is generated and `pnpm check` runs `gen-theme` then `git diff --exit-code` on it. Adding the marker token only to `theme.css` (or only inline) would either fail the diff gate or force an arbitrary value.
- **Fix:** Added the source token to `DESIGN.md` `elevation:` and extended `gen-theme.mjs` to emit it, then regenerated `theme.css`. Same for the GAP-10 focus token in Task 2.
- **Files modified:** DESIGN.md, scripts/gen-theme.mjs, packages/design/src/styles/theme.css
- **Verification:** `pnpm check` exit 0 (gen-theme diff clean), no-arbitrary-values grep = 0
- **Committed in:** deb4e49 (Task 1), 28be118 (Task 2)

**2. [Rule 2 - Missing test] py-1 also removed from the CompactRow name**
- **Found during:** Task 3 (GAP-13)
- **Issue:** Beyond `min-h-11`, the name anchor's `py-1` added 8px that re-opened the name/squad gap.
- **Fix:** Dropped `py-1` too; the row's `py-2` + `min-h-11` own the rhythm.
- **Files modified:** packages/design/src/shared/uikit/CompactRow/CompactRow.tsx
- **Verification:** responsive.spec asserts name→squad gap < 12px
- **Committed in:** f72db64 (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing-detail)
**Impact on plan:** Both necessary for correctness (token-pipeline integrity, the full GAP-13 fix). No scope creep — all changes inside the four named gaps.

## Issues Encountered
- The harness enforces the `.claude/worktrees/...` canonical path for Edit/Write while `git rev-parse` reports the symlinked `.agents/worktrees/...` path (same inode). Resolved by writing through the `.claude` path and running git through the toplevel; same files, no divergence.

## Next Phase Readiness
- KIT-02 GAP-09/10/12/13 closed; the data-table row + compact visuals match the binding hi-fi semantics.
- Full gate green: ladle build, Playwright (220 passed), Vitest (91 passed), root `pnpm check` exit 0.
- No STATE.md / ROADMAP.md writes (worktree mode — orchestrator owns those after the wave).

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-24*
