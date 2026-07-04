---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 13
subsystem: ui
tags: [ark-ui, tailwind-variants, select, dialog, stepper, playwright, a11y, i18n]

# Dependency graph
requires:
  - phase: 03-uikit-interactive-i18n-global-state-patterns
    provides: "Plan 03-11 one-motion-policy — the shared .uikit-overlay-motion recipe the Dialog content builds on"
provides:
  - "Dialog close affordance parked absolute in the content top-right (no dead leading row above the title)"
  - "Select in-listbox empty state (message + icon) when options is empty"
  - "Select opt-in clear control (Ark ClearTrigger) that resets to the placeholder"
  - "Interactive Stepper Playground (useState) that mutates the value and clamps at min/max"
  - "overlay-form-interaction.spec.ts regression guarding GAP-08/09/10/11"
affects: [forms, overlay, select, stepper, dialog, gsd-audit-uat]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Ark ClearTrigger auto-hides via hidden=!hasSelectedItems; render opt-in, override aria-label via props (mergeProps lets props win)"
    - "Catalog Playground owns ephemeral demo useState keyed on the control arg (re-seed on edit) — the TanStack-Form rule governs real forms, not catalog demos"
    - "Empty-listbox node carries role=presentation so axe aria-required-children stays clean on an open empty Select"

key-files:
  created:
    - packages/design/tests/overlay-form-interaction.spec.ts
  modified:
    - packages/design/src/shared/uikit/Dialog/dialog.ts
    - packages/design/src/shared/uikit/Select/Select.tsx
    - packages/design/src/shared/uikit/Select/select.ts
    - packages/design/src/shared/uikit/Select/Select.stories.tsx
    - packages/design/src/shared/uikit/Stepper/Stepper.stories.tsx
    - packages/design/src/shared/uikit/_fixtures/strings.ts

key-decisions:
  - "clearable is OPT-IN (default false) so existing required Selects keep no clear control"
  - "Dialog fix is recipe-only (close → absolute top-right, content → relative); Dialog.tsx unchanged — the close stays first in DOM (preserves initial focus) but is out of flow so the title is the first in-flow child"
  - "The clearable demo cell uses uncontrolled defaultValue so Ark's native ClearTrigger resets to the placeholder without a controlled onValueChange (mirrors the defaultOpen precedent)"
  - "Empty-state node is role=presentation to keep the open empty listbox axe-clean"

patterns-established:
  - "Per-part recipe slots added for empty + clearTrigger + control on the Select; tokens-only, no arbitrary values"
  - "GAP-closure regression drives the catalog stories (forced-open empty cell, clearable cell, interactive Stepper Playground) the fixes expose"

requirements-completed: [KIT-06, KIT-05]

coverage:
  - id: D1
    description: "Dialog close button sits absolute top-right; no ~44px dead row above the title (GAP-08)"
    requirement: "KIT-06"
    verification:
      - kind: e2e
        ref: "packages/design/tests/overlay-form-interaction.spec.ts#GAP-08 Dialog has no dead row above the title"
        status: pass
    human_judgment: false
  - id: D2
    description: "Empty-options Select renders a first-class in-listbox empty state (message + icon), never blank (GAP-09)"
    requirement: "KIT-05"
    verification:
      - kind: e2e
        ref: "packages/design/tests/overlay-form-interaction.spec.ts#GAP-09 empty Select shows an in-listbox empty state"
        status: pass
    human_judgment: false
  - id: D3
    description: "Clearable Select renders an accessible-named clear control that resets the value to the placeholder (GAP-10)"
    requirement: "KIT-05"
    verification:
      - kind: e2e
        ref: "packages/design/tests/overlay-form-interaction.spec.ts#GAP-10 clearable Select can be cleared back to the placeholder"
        status: pass
    human_judgment: false
  - id: D4
    description: "Stepper Playground is interactive: increment mutates the displayed value and clamps at max (GAP-11)"
    requirement: "KIT-05"
    verification:
      - kind: e2e
        ref: "packages/design/tests/overlay-form-interaction.spec.ts#GAP-11 Stepper Playground is interactive"
        status: pass
    human_judgment: false

# Metrics
duration: 25min
completed: 2026-06-26
status: complete
---

# Phase 3 Plan 13: Overlay + Form Interaction Fixes Summary

**Closed GAP-08/09/10/11: Dialog close moved to an absolute top-right corner (no dead row), an empty Select now shows an in-listbox message+icon empty state, Selects gained an opt-in accessible clear control, and the Stepper Playground is interactive — all guarded by a new regression that failed on the pre-fix behaviours.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-06-26T05:50:00Z
- **Completed:** 2026-06-26T06:15:00Z
- **Tasks:** 5 (1 RED + 4 GREEN)
- **Files modified:** 7 (1 created, 6 modified)

## Accomplishments
- GAP-08: the Dialog `CloseTrigger` is now `absolute right-3 top-3` within the `relative` content instead of a `self-end` first flex child — the title is the first in-flow child and sits at the content's top padding (measured title inset 85px → ~25px).
- GAP-09: an empty-options Select renders a first-class empty-state row (muted message + `SearchX` icon, `role="presentation"`) inside the listbox via a new `emptyText` resolved prop and `empty` recipe slot.
- GAP-10: an opt-in `clearable` Select renders Ark's `ClearTrigger` (auto-hidden while empty) parked in the trigger's right inset, accessible-named via `clearAria`; a new `defaultValue` prop lets the demo clear natively to the placeholder.
- GAP-11: the Stepper Playground owns `useState` (keyed on the `value` arg) wired to `onValueChange`, so inc/dec/keyboard mutate the displayed value and Ark's min/max clamp is exercised.
- New `overlay-form-interaction.spec.ts` fails RED on all four pre-fix behaviours and passes GREEN after.

## Task Commits

1. **Task 1: RED regression spec** - `9cedcff` (test)
2. **Task 2: Dialog close top-right (GAP-08)** - `28b84e4` (feat)
3. **Tasks 3+4: Select empty state + clear control (GAP-09, GAP-10)** - `f5fe0a7` (feat)
4. **Task 5: interactive Stepper Playground (GAP-11)** - `450af7c` (feat)

_Tasks 3 and 4 share four files (Select.tsx, select.ts, Select.stories.tsx, strings.ts), so they landed as one logical commit rather than artificially splitting shared-file hunks._

## Files Created/Modified
- `packages/design/tests/overlay-form-interaction.spec.ts` - new GAP-08/09/10/11 regression (created)
- `packages/design/src/shared/uikit/Dialog/dialog.ts` - content `relative`; close `absolute right-3 top-3` (was `self-end`)
- `packages/design/src/shared/uikit/Select/Select.tsx` - `emptyText`/`clearAria`/`clearable`/`defaultValue` props; empty-state node; Ark `ClearTrigger`
- `packages/design/src/shared/uikit/Select/select.ts` - new `control`, `empty`, `clearTrigger` slots (tokens-only)
- `packages/design/src/shared/uikit/Select/Select.stories.tsx` - forced-open empty cell with `emptyText`; new `clearable` cell
- `packages/design/src/shared/uikit/Stepper/Stepper.stories.tsx` - interactive `StepperPlayground` with `useState`
- `packages/design/src/shared/uikit/_fixtures/strings.ts` - `selectEmpty` + `selectClear` keys (RU primary / EN parity)

## Decisions Made
- `clearable` defaults to `false` (opt-in) — required Selects keep no clear control.
- Dialog fix is recipe-only; `Dialog.tsx` was left unchanged because making the close `absolute` removes it from flow, so the title is automatically the first in-flow child while the close keeps its DOM position (preserving initial focus).
- The clearable demo uses uncontrolled `defaultValue` so Ark's native `ClearTrigger` resets to the placeholder without a controlled `onValueChange`.
- The empty-state node is `role="presentation"` so the open empty listbox stays axe-clean (`aria-required-children`).

## Deviations from Plan

**1. [Plan prediction adjustment] `Dialog.tsx` not modified**
- **Found during:** Task 2 (Dialog close repositioning)
- **Issue:** The plan's `files_modified` listed `Dialog.tsx`, but the GAP-08 fix is entirely expressible in the `dialog.ts` recipe (close → absolute, content → relative). Making the close absolute removes it from flow, so the title is already the first in-flow child with no JSX reorder.
- **Fix:** Recipe-only change; left `Dialog.tsx` untouched to preserve the existing initial-focus-on-close behaviour.
- **Files modified:** packages/design/src/shared/uikit/Dialog/dialog.ts
- **Verification:** GAP-08 e2e green (title inset 85px → ~25px); keyboard/motion specs unaffected.
- **Committed in:** `28b84e4`

**2. [Rule 1 - Bug] Clamp assertion corrected in the regression**
- **Found during:** Task 5 (Stepper Playground GREEN run)
- **Issue:** The initial clamp assertion clicked the increment trigger after reaching max; Ark disables that trigger at max, so the click timed out.
- **Fix:** Assert the increment trigger is disabled at max (the actual clamp mechanism) instead of clicking a disabled control. RED ordering is preserved — the pinned-value assertion still fails first on pre-fix code.
- **Files modified:** packages/design/tests/overlay-form-interaction.spec.ts
- **Verification:** GAP-11 e2e green.
- **Committed in:** `450af7c`

---

**Total deviations:** 2 (1 plan-prediction adjustment, 1 test self-fix)
**Impact on plan:** No scope creep; both within the plan's intent. DO-NOT-TOUCH behaviours (Select typeahead, menu-wider-than-trigger, trigger placeholder) untouched.

## Issues Encountered
- The worktree shipped with no `node_modules`; ran `pnpm install --frozen-lockfile` to enable builds/tests.
- Playwright's own `webServer` spawn was killed under the sandbox; ran the Ladle `preview` server as a background job and pointed Playwright at it (`reuseExistingServer`) — purely a local harness workaround, no config change.

## Verification
- `pnpm check`: green (0 errors; 86 pre-existing design-token warnings unrelated to this plan).
- `pnpm --filter @solid-stats/design test` (vitest): 188 passed.
- Full e2e (`playwright test`): 360 passed — incl. the new regression and the existing Dialog/Select/Stepper keyboard, catalog axe, and motion blocks (no DO-NOT-TOUCH regression; the clear control clears the 44px gate, the empty-open cell stays axe-clean).
- `overlay-form-interaction.spec.ts`: 4/4 green (and verified 4/4 RED on pre-fix code before the fixes).

## Next Phase Readiness
- 03-14 owns no overlap with the `selectEmpty`/`selectClear` keys (registered here in 03-13).
- Overlay + form interaction gaps closed; no blockers.

## Self-Check: PASSED

---
*Phase: 03-uikit-interactive-i18n-global-state-patterns*
*Completed: 2026-06-26*
