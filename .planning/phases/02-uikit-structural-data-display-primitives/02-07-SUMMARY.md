---
phase: 02-uikit-structural-data-display-primitives
plan: 07
subsystem: ui
tags: [tailwind-v4, tailwind-variants, button, link, react, ladle, design-system, a11y, gap-closure]

# Dependency graph
requires:
  - phase: 02-uikit-structural-data-display-primitives (02-04 Nav-shell)
    provides: NavBar/MobileTabBar navItem+tab tv() recipes, data-state forced-pseudo pattern, before:-edge active marker
  - phase: 02-uikit-structural-data-display-primitives (02-06 Data-table)
    provides: Th sort button, Pagination cursor affordance, CompactList show-more, full-row anchor
provides:
  - Shared Button base primitive (<button type="button">) — variants primary/secondary/ghost/segment, sizes sm/md
  - Shared Link affordance (<a>) sharing the same control recipe
  - One canonical focus ring (focus-visible:shadow-(--shadow-ring)) + >=44px hit area centralized in one tv()
  - ButtonVariant / ButtonSize / ButtonJustify exported finite-union types graduated into @solid-stats/design
  - 7 hand-rolled controls (NavBar, MobileTabBar, Th, Pagination, Toast, CompactList show-more, state-card actions) refactored onto Button/Link
  - Toast/ErrorState focus-visible:outline-* drift ring removed (GAP-19 named symptom)
  - cursor-pointer product decision single-sourced on the control base
affects: [02-08-nav-shell-rework, 02-09-data-table-fixes, 02-10, surfaces consuming interactive controls]

# Tech tracking
tech-stack:
  added: []  # no new packages — built on existing tailwind-variants + lucide-react
  patterns:
    - "Base-primitive consolidation: one control tv() owns the hit area + canonical ring + variant token recipes; structural-only wrapper recipes (navItem/tab/thHeader) carry just the surface the base does not"
    - "justify variant on the control recipe so the merge-free tailwind-variants/lite build never emits two conflicting justify-* utilities"

key-files:
  created:
    - packages/design/src/shared/uikit/Button/control.ts
    - packages/design/src/shared/uikit/Button/Button.tsx
    - packages/design/src/shared/uikit/Button/Link.tsx
    - packages/design/src/shared/uikit/Button/index.ts
    - packages/design/src/shared/uikit/Button/Button.stories.tsx
    - packages/design/src/shared/uikit/Button/control.test.ts
  modified:
    - packages/design/src/index.ts
    - packages/design/src/shared/uikit/NavBar/NavBar.tsx
    - packages/design/src/shared/uikit/MobileTabBar/MobileTabBar.tsx
    - packages/design/src/shared/uikit/Table/Th.tsx
    - packages/design/src/shared/uikit/Pagination/Pagination.tsx
    - packages/design/src/shared/uikit/Toast/Toast.tsx
    - packages/design/src/shared/uikit/CompactRow/CompactRow.tsx
    - packages/design/src/shared/uikit/ErrorState/ErrorState.stories.tsx
    - packages/design/src/shared/uikit/EmptyState/EmptyState.stories.tsx

key-decisions:
  - "control tv() is the single source of the >=44px hit area + the ONE canonical focus ring + the DESIGN.md button-* variant recipes — no control re-implements them"
  - "segment variant = the sort-header/segmented member (muted, active=cyan); folds the Th thButton precedent into the shared recipe"
  - "Added a justify variant (center default; start/end) to control so the merge-free /lite build emits exactly one justify-* (avoids the base justify-center vs sort-header start/end conflict)"
  - "cursor-pointer is a product decision (Plan 02-07): single-sourced on the control base so all variants + 7 controls inherit it; disabled keeps pointer-events-none (no cursor-not-allowed)"
  - "Nav/tab/pager/show-more rounding consolidated onto the canonical button rounded-sm + control gap/padding; minor token shifts (rounded-md->rounded-sm, gap-2->gap-1.5, tab text-2xs->text-xs) accepted as the intended de-duplication onto the DESIGN.md recipe"

patterns-established:
  - "Pattern 1: shared interactive base — Button/Link consume one control recipe; wrappers add only structural surface (relative + before:-marker + forced data-state matrix)"
  - "Pattern 2: per-recipe justify variant to keep merge-free tailwind-variants/lite conflict-free for layout utilities"

requirements-completed: [KIT-01, KIT-02, KIT-07, QUAL-03]

# Metrics
duration: 13min
completed: 2026-06-23
status: complete
---

# Phase 02 Plan 07: Button/Link Base Primitive (GAP-19) Summary

**A shared Button/Link base primitive — one `control` tv() owning the >=44px hit area, the ONE canonical `focus-visible:shadow-(--shadow-ring)` ring, and the DESIGN.md `button-primary/secondary/ghost` + `segment` recipes — with the 7 hand-rolled Phase-2 controls refactored onto it and the Toast focus-ring drift removed.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-06-23T15:33:04Z
- **Completed:** 2026-06-23T15:46:28Z
- **Tasks:** 3
- **Files modified:** 15 (6 created, 9 modified)

## Accomplishments
- Built the shared `Button` (`<button type="button">`) + `Link` (`<a>`) base on one `control` tv() recipe: variants `primary | secondary | ghost | segment`, sizes `sm | md`, the canonical ring, and the >=44px floor — graduated into `@solid-stats/design` with `ButtonVariant` / `ButtonSize` / `ButtonJustify` types.
- Refactored all 7 hand-rolled controls onto it: NavBar item + MobileTabBar tab (`<Link variant="ghost">`), Th sort button (`<Button variant="segment" active>`), Pagination Prev/Next + CompactList show-more (`<Button variant="secondary">`), Toast action (`<Button variant="ghost" size="sm">`), and the EmptyState/ErrorState story actions.
- Removed the GAP-19 named symptom — the `focus-visible:outline-2 outline-offset-2 outline-primary` drift ring on the Toast action (and the matching ErrorState story button) — every control now carries the single canonical ring.
- Folded the project-wide `cursor-pointer` design decision into the `control` base (single source), so all variants and every refactored control inherit the hand cursor.
- Full gate green: Playwright 215 (was 193 + 6 Button + the matrix), Vitest 87 (incl. 9 TDD `control` contract tests), root `pnpm check` exit 0, zero arbitrary token values.

## Task Commits

Each task was committed atomically:

1. **Task 1 (TDD): Button/Link base + canonical focus ring** — `c90d864` (test, RED) → `ce6a961` (feat, GREEN)
2. **Task 2: refactor the 7 hand-rolled controls onto Button/Link** — `0c5f574` (feat) — includes the coordinator-relayed `cursor-pointer` design decision + the `justify` variant
3. **Task 3: design-review the base + refactored controls vs the DESIGN.md button recipe** — no code delta (review verdict APPROVE; the gate was already green) — recorded below, folded into the plan-metadata commit

**Plan metadata:** committed with this SUMMARY + STATE.md + ROADMAP.md.

_TDD: Task 1 is test → feat (no refactor needed — the recipe was DRY on first GREEN: Button + Link share the one `control`)._

## Files Created/Modified
- `packages/design/src/shared/uikit/Button/control.ts` — the shared `control` tv() recipe (variant/size/justify/active/disabled) + `ButtonVariant`/`ButtonSize`/`ButtonJustify` types + the `cursor-pointer` base
- `packages/design/src/shared/uikit/Button/Button.tsx` — `<button type="button">` consuming `control`
- `packages/design/src/shared/uikit/Button/Link.tsx` — `<a>` affordance sharing `control`; drops `href` + sets `aria-disabled` when disabled
- `packages/design/src/shared/uikit/Button/index.ts` — slice barrel (`control` stays internal)
- `packages/design/src/shared/uikit/Button/Button.stories.tsx` — state-matrix (variants × forced states) + Link + sizes + segment-active + Playground
- `packages/design/src/shared/uikit/Button/control.test.ts` — the TDD pure-logic contract test
- `packages/design/src/index.ts` — graduated the base-primitives export block
- `NavBar.tsx` / `MobileTabBar.tsx` — render `<Link variant="ghost">`; wrapper recipe now carries only `relative` + the `before:` active marker + the forced `data-state` matrix
- `Table/Th.tsx` — `<Button variant="segment" size="sm" justify={...} active={isActive}>`; `thHeader` recipe carries only `w-full uppercase tracking-label` + forced states
- `Pagination/Pagination.tsx` — Prev/Next are `<Button variant="secondary">`; removed the local `pager` recipe
- `CompactRow/CompactRow.tsx` — show-more is `<Button variant="secondary" data-show-more>`
- `Toast/Toast.tsx` — action is `<Button variant="ghost" size="sm" className="text-primary">`; drift ring gone
- `ErrorState.stories.tsx` / `EmptyState.stories.tsx` — story actions now pass `<Button variant="secondary">` (components keep their `action?: ReactNode` prop unchanged)

## Decisions Made
- **`control` is the single source** of the hit area + canonical ring + the `button-*` variant token recipes.
- **`justify` variant** added to `control` (center default; start/end for the sort-header) — required because `tailwind-variants/lite` is merge-free and the sort-header needs `justify-start`/`justify-end` over the button-default `justify-center` without emitting two conflicting utilities.
- **`cursor-pointer` on the base** — a project-wide product decision (relayed by the coordinator during Task 2): every interactive control shows the hand cursor, overriding the native button default-arrow. Single-sourced on the `control` base; the `disabled` variant's existing `pointer-events-none` suppresses the cursor (no `cursor-not-allowed`). `cursor-pointer` is a stock utility — zero arbitrary values.
- **Did NOT touch DensityToggle** — it is deleted by GAP-06 in 02-09; refactoring it now would be wasted work.

## Task 3 — Design-review diff vs the DESIGN.md button recipe (verdict: APPROVE)

Seven-pillar review (Pillars 1/3/4/6 run against the base + each refactored control), diffed against the binding `DESIGN.md` `button-*` recipe (L244-292):

| control variant | DESIGN.md recipe row | implemented tokens |
|---|---|---|
| `primary` | `button-primary` | `bg-primary` / `text-fg-on-accent` / `hover:bg-primary-hover` / `active:bg-primary-active` + `active:translate-y-px` (the `transform: translateY(1px)` row) / `focus-visible:shadow-(--shadow-ring)` (the `elevation.ring` focusVisible row) / disabled `text-text-subtle opacity-60` |
| `secondary` | `button-secondary` | `bg-surface-1` / `text-text-primary` / `border-border-1` → `hover:bg-surface-3 hover:border-border-2` / `active:bg-surface-2` + `translate-y-px` / ring / disabled |
| `ghost` | `button-ghost` | `bg-transparent` / `text-text-muted` → `hover:bg-surface-1 hover:text-text-primary` / `active:bg-surface-2` / ring / disabled |
| `segment` | (no DESIGN.md row — the existing Th `thButton`/sort-header precedent) | `text-text-muted hover:text-text-primary` + `active={true}` → `text-primary` (the sorted-column cyan label, paired with aria-sort + the arrow — never color-alone) |

- **Pillar 1 (tokens & contrast):** zero arbitrary values / raw hex across the Button slice + all refactored controls (grep clean); `shadow-(--shadow-ring)` reads the `@theme` var (the sanctioned escape). `pnpm check` design.md lint = 0 errors.
- **Pillar 3 (a11y):** axe serious/critical = 0 across all 215 Playwright tests; every Button/Link variant renders `min-h-11` (>=44px geometry check green); one canonical focus ring on every control; never-color-alone preserved (active section = cyan + `aria-current` + `before:`-marker; sorted header = cyan + `aria-sort` + arrow).
- **Pillar 4 (states):** the state-matrix story exercises enabled/hover/pressed/focused/disabled per variant via the forced `data-state` pattern.
- **Pillar 6 (system & domain):** dark-only; cyan is the single interactive accent (primary fill + segment-active + nav-active); Lucide-only icons; the refactored account/sign-in/search controls map onto the same `ghost`/`secondary` variant vocabulary the hi-fi shell (`.design/hifi/shell.jsx` L55-68) uses, which the nav-shell rework (02-08) will consume.

## Deviations from Plan

Plan executed as written. The following are recorded design/consolidation decisions, not unplanned fixes:

**1. [Design decision — relayed in Task 2] `cursor-pointer` on the control base**
- **Found during:** Task 2 (coordinator-relayed project-wide UI decision)
- **What:** Added `cursor-pointer` to the `control` tv() base so all variants + the 7 refactored controls inherit the hand cursor; disabled keeps `pointer-events-none` (no `cursor-not-allowed`).
- **Files:** `packages/design/src/shared/uikit/Button/control.ts`
- **Verification:** stock utility, zero arbitrary values; full gate green.
- **Committed in:** `0c5f574` (Task 2 commit, kept inside 02-07 per the relay).

**2. [Consolidation] `justify` variant on `control`**
- **Why:** the sort-header needs `justify-start`/`justify-end` over the button-default `justify-center`; `tailwind-variants/lite` is merge-free, so a `className` override would emit two conflicting `justify-*` utilities. Modeling it as a variant emits exactly one.
- **Files:** `control.ts`, `Button.tsx`, `Link.tsx`, `Table/Th.tsx`, slice + root barrels.
- **Committed in:** `0c5f574`.

**3. [Consolidation] minor token shifts onto the canonical button recipe**
- Nav item / tab / pager / show-more dropped local deviations to adopt the DESIGN.md button recipe: `rounded-md` → `rounded-sm`, nav `gap-2` → control `gap-1.5`, MobileTabBar label `text-2xs` → `text-xs` (size `sm`), Pagination/show-more `rounded-md` → `rounded-sm`. These are the intended de-duplication onto the single recipe (GAP-19), not regressions; every a11y + structural contract (active marker, aria-current, aria-sort, full-row anchor, >=44px) is preserved and the full Playwright matrix is green.

---

**Total deviations:** 0 unplanned (3 recorded design/consolidation decisions). No bugs, no Rule 1-4 auto-fixes required.
**Impact on plan:** none negative — all within GAP-19's centralization intent; full gate green.

## Issues Encountered
- **Stale Ladle preview race (catalog spec).** The first catalog run reported "Story not found" for the Button stories because Playwright's `reuseExistingServer` reused a leftover `ladle preview` on port 61000 serving a pre-Button build. Resolved by killing the stale preview; the clean re-run was green (6/6 Button catalog tests, then 215/215 full). No code change — a harness/process artifact.

## Known Stubs
None — the Button/Link base is fully wired; every refactored control renders through it with live data/handlers preserved (catalog handlers stay intentionally inert per D-01, as before).

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- The base primitive is the enabler wave: **02-08** (nav-shell rework) maps the account/sign-in/search controls onto `secondary`/`ghost` (+ a future `steam` variant); **02-09 / 02-10** (data-table fixes, incl. GAP-06 DensityToggle removal + GAP-07 real pager) build on the `segment`/`secondary` controls landed here.
- No blockers. `ButtonVariant`/`ButtonSize`/`ButtonJustify` are exported for downstream consumers.

## Self-Check: PASSED

All 6 created Button-slice files + the SUMMARY exist on disk; all 3 task commits (`c90d864`, `ce6a961`, `0c5f574`) are present in the git log.

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-23*
