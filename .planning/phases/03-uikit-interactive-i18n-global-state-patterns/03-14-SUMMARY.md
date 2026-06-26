---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 14
subsystem: design/uikit
status: complete
tags: [uikit, a11y, responsive, dead-code, gap-closure, file-upload, select, tabs, toast, async-boundary]
requires:
  - 03-09 (AsyncBoundary leaf geometry)
  - 03-10 (FileUpload single preview)
  - 03-11 (Toast/ToastManager + Tabs motion token policy)
  - 03-12 (FileUpload Button row controls)
  - 03-13 (Select GAP-09/10, overlay-form-interaction spec)
provides:
  - form-layout + a11y sweep regression (form-layout-sweep.spec.ts)
  - bounded FileUpload list (capped, internally-scrolling itemGroup; width-bound rows)
  - viewport-capped Select listbox (grow-wider-than-trigger preserved)
  - announced AsyncBoundary loading state (role=status)
  - empty-title toast guard; removed dead Tabs Indicator slot
  - RESERVED v1.0 FU7 sync vocabulary + wired itemStatus slot (NOT built)
affects:
  - packages/design/src/shared/uikit/{FileUpload,Select,AsyncBoundary,ToastManager,Tabs}
  - packages/design/src/shared/uikit/_fixtures/strings.ts
tech-stack:
  patterns:
    - "sr-only role=status for a polite loading announcement without CLS"
    - "max-h + overflow-y-auto capped scroll-in-card list (tokens only)"
    - "min-w-(--reference-width) + max-w-* cap: grow-wider-than-trigger, viewport-bounded"
    - "optional render-slot prop to reserve a dead anatomy slot for a future phase"
key-files:
  created:
    - packages/design/tests/form-layout-sweep.spec.ts
  modified:
    - packages/design/src/shared/uikit/Input/Input.stories.tsx
    - packages/design/src/shared/uikit/Select/Select.stories.tsx
    - packages/design/src/shared/uikit/Select/select.ts
    - packages/design/src/shared/uikit/Stepper/Stepper.stories.tsx
    - packages/design/src/shared/uikit/FileUpload/FileUpload.stories.tsx
    - packages/design/src/shared/uikit/FileUpload/FileUpload.tsx
    - packages/design/src/shared/uikit/FileUpload/fileUpload.ts
    - packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.tsx
    - packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.stories.tsx
    - packages/design/src/shared/uikit/ToastManager/ToastManager.tsx
    - packages/design/src/shared/uikit/Tabs/Tabs.tsx
    - packages/design/src/shared/uikit/Tabs/tabs.ts
    - packages/design/src/shared/uikit/_fixtures/strings.ts
    - packages/design/tests/file-upload-preview.spec.ts
decisions:
  - "GAP-12 sweep targets the floor-demo wrapper (data-floor-demo on the Playground roots), NOT the whole document — the StateMatrix grid has a separate, pre-existing, out-of-scope 360 overflow from FileUpload's fixed-width Browse button."
  - "Select cap = max-w-80 (320) — the stock numeric spacing token nearest the 360 floor; max-w-xs is not emitted by this theme (only --container/--container-prose), so the numeric token is used. No DESIGN.md/theme.css change."
  - "Tabs Indicator slot REMOVED (not driven) — the per-trigger border-primary underline is already the structural selection marker, so a sliding indicator carried no meaning."
  - "GAP-17 reserved only: FU7 vocabulary added (unconsumed) + itemStatus wired to an optional renderItemStatus slot; no lightbox/sync model built."
metrics:
  tasks: 5
  commits: 6
  completed: 2026-06-26
---

# Phase 3 Plan 14: Form-layout + a11y/dead-code sweep (+ FU7 reserve) Summary

Closed the GAP-12/13/15/16 minors and reserved (did NOT build) the v1.0 FileUpload items
(GAP-17), guarded by a new `form-layout-sweep` regression that fails on every pre-fix issue.

## What shipped

- **GAP-12 — 360-floor demo wrappers.** Replaced the fixed `w-90` (360px) demo blocks with
  `w-full max-w-90` across the Input/Select/Stepper/FileUpload stories so a 360-floor block plus
  the surrounding padding never overflows the mobile viewport. The sweep test marks the four
  Playground roots with `data-floor-demo` and asserts each wrapper's right edge stays within 360
  (pre-fix: 376 > 360).
- **GAP-13 — bounded FileUpload list.** Width-bound the row (`w-full min-w-0` → the existing
  `truncate` engages) and capped the `itemGroup` (`max-h-64 overflow-y-auto` → a bounded,
  internally-scrolling list). Bumped the `many` fixture to ~30 files (with a separate 3-file
  `limit` fixture so the limit-reached semantics stay correct).
- **GAP-15 — Select listbox cap.** Added `max-w-80` (320) to the listbox `content` slot so a very
  long option never overflows the 360 floor; `min-w-(--reference-width)` is untouched, so the
  grow-wider-than-trigger behaviour (DO-NOT-TOUCH) is preserved. The cap only bites a listbox that
  would otherwise grow past the floor.
- **GAP-16 — a11y/dead-code sweep.** AsyncBoundary loading now announces via a visually-hidden
  `role="status"` polite region (the Skeleton is `aria-hidden`); `sr-only` is absolutely
  positioned so it adds no measured height — the 03-09 CLS-0 geometry is intact. ToastManager
  drops a toast whose title coerces to `""` (no textless icon-only toast, WCAG 4.1.2). The dead,
  unsized Tabs `Indicator` slot was removed (the per-trigger underline is the structural marker).
- **GAP-17 — RESERVE ONLY (not built).** Added the four-state FU7 server-sync vocabulary to
  `strings.ts` (RU primary / EN parity), unconsumed; and wired the previously-dead `itemStatus`
  slot to an optional `renderItemStatus` row slot so v1.0 composes it without reshaping the row.
  No lightbox (FU4) and no sync state model (FU7) were built.

## Tests

- New `form-layout-sweep.spec.ts` — 4 behaviours (GAP-12 ×4 floor-demo wrappers, GAP-13, GAP-15,
  GAP-16); each verified RED on pre-fix code, GREEN after. RED integrity for the rescoped GAP-12
  check was re-verified by temporarily reintroducing `w-90` (right edge 376 > 360 → fail).
- `vitest` unit: 192 passed (incl. tabs/tooltip/fileUpload/catalog recipe tests).
- `pnpm check`: green (gen-theme clean, no diff; design.md lint; types/lint/format).
- Full Playwright e2e (single-worker, deterministic): **374 passed**.

## Deviations from Plan

### Rule 2/3 — necessary test fixtures (added beyond the task's declared `<files>`)

**1. [Rule 3 - Blocking] Select `LongOptionCap` fixture story**
- **Found during:** Task 1 (RED). The GAP-15 assertion needs a long-option Select that overflows
  the 360 floor; no such fixture existed (all map-name options are short).
- **Fix:** Added a `LongOptionCap` story (a narrow `w-40` trigger + a long joined-label option,
  `defaultOpen`) built from already-resolved i18n strings (slice stays i18n-free).
- **Files:** Select.stories.tsx. **Commit:** 3fb5a4b.

**2. [Rule 1 - Bug] FileUpload preview spec invalidated by the 30-file fixture**
- **Found during:** Task 3. `file-upload-preview.spec.ts` hard-asserted the `many` cell renders 3
  rows; the GAP-13 fixture bump to ~30 broke it.
- **Fix:** Updated the count assertion (3 → 30) and the doc comment.
- **Files:** file-upload-preview.spec.ts. **Commit:** 82708b5.

### Scope decision — GAP-12 sweep rescoped to the demo wrapper

The first RED draft asserted document-level overflow on the **Matrix** stories. That incidentally
caught a *separate, pre-existing* 360 overflow in the FileUpload Matrix `StateMatrix` grid (the
fixed-width `Browse` button forces each 2-col grid track past the floor) — which is **not** part of
GAP-12 (per 03-UAT-VISUAL-FINDINGS#GAP-I1, GAP-12 is specifically the `w-90` demo wrapper). Per the
SCOPE BOUNDARY (only fix issues caused by this task), the test was rescoped to the four
single-control **Playground** floor-demo wrappers (`data-floor-demo`), which isolate the wrapper
geometry from the grid. The StateMatrix grid overflow is logged below for a future plan.

## Deferred Issues (out of scope — not caused by this task)

- **FileUpload Matrix `StateMatrix` 360 overflow.** At 360 the 2-column `StateMatrix` grid
  overflows because FileUpload's fixed-width `Browse` button (≈132px) forces each track past the
  half-floor; Select/Stepper cells (fluid `w-full` controls) fit. This is a pre-existing catalog
  layout condition independent of GAP-12 and would require a `StateMatrix`/grid change (shared
  component) or a story-level single-column reflow — out of scope here. Logged for a future
  catalog-responsive plan.
- **`catalog.spec.ts` parallel flakiness.** Under full `fullyParallel` execution on a contended
  CPU, the axe / 44px catalog checks flake non-deterministically (a different, unrelated set fails
  each run — e.g. kit-02 compactrow/table, which this plan never touched). All checks pass
  deterministically with `--workers=1` (374/374) and in isolation. CI runs with `retries: 1`,
  which absorbs this. Pre-existing; not introduced by this plan.

## Self-Check: PASSED
