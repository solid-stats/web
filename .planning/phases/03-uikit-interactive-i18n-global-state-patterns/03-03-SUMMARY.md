---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 03
subsystem: ui
tags: [ark-ui, select, number-input, stepper, tailwind-variants, lingui, ladle, playwright, a11y, tsx]

# Dependency graph
requires:
  - phase: 03-02
    provides: "Field wrapper (Ark Field.Root label/error/required/disabled broadcast seam) + the input recipe family + the i18n catalog harness + the StateMatrix/StateCell story helper"
  - phase: 03-01
    provides: "the runtime Lingui i18n instance + STRINGS→catalog migration + the keyboard.spec Wave-0 RED scaffolds"
provides:
  - "Select — generic typed-value option control over Ark Select (tv()-per-part recipe, cyan active option paired with the indicator check, Ark-owned keyboard nav)"
  - "Stepper — Ark NumberInput numeric control (tabular-mono value, ≥44px aria-labelled inc/dec triggers)"
  - "Select + Stepper Ladle stories (StateMatrix incl. Select forced-open + ×4 data-volume, Playground) under the Field wrapper"
  - "the Select aria-expanded/aria-controls + arrow-nav + trap-free keyboard contract turned GREEN in keyboard.spec"
affects: [03-04, 03-05, 03-06, KIT-06-overlay, forms, surfaces]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "tv()-per-Ark-part recipe with className per part (never asChild for styling) — extended from Field/Input to Select + Stepper"
    - "forced-open StateMatrix cell via Ark UNCONTROLLED defaultOpen (not controlled open) for the static axe gate"
    - "live keyboard specs run against the lone Playground story (the matrix's forced-open portal dismiss layer intercepts events)"

key-files:
  created:
    - "packages/design/src/shared/uikit/Select/Select.tsx — generic Select<TValue> over Ark Select"
    - "packages/design/src/shared/uikit/Select/select.ts — per-part tv() recipe"
    - "packages/design/src/shared/uikit/Select/Select.stories.tsx — StateMatrix + ×4 data-volume + Playground"
    - "packages/design/src/shared/uikit/Stepper/Stepper.tsx — Ark NumberInput control"
    - "packages/design/src/shared/uikit/Stepper/stepper.ts — per-part tv() recipe"
    - "packages/design/src/shared/uikit/Stepper/stepper.test.ts — mono/44px/no-arbitrary contract"
    - "packages/design/src/shared/uikit/Stepper/Stepper.stories.tsx — StateMatrix + Playground"
  modified:
    - "packages/design/src/index.ts — KIT-05 Wave-3 barrel region (Select, SelectOption, Stepper)"
    - "packages/design/tests/keyboard.spec.ts — Select GREEN block (disclosure + arrow-nav + trap-free)"
    - "packages/design/src/shared/uikit/_fixtures/strings.ts — stepperIncrement/Decrement + selectLabel + 6 option fixtures"

key-decisions:
  - "Adopted the high-quality partial Select slice from the interrupted prior run verbatim (verified clean against plan + skill chain); the only change was the defaultOpen bug fix"
  - "Select forced-open uses Ark UNCONTROLLED defaultOpen — controlled open pins every instance and breaks the user open/close disclosure (Rule 1 bug fix)"
  - "Stepper is its own slice, not a NumberInput variant (D-05 discretion) — distinct mono-value contract + its own aria-labelled triggers"
  - "Select live keyboard specs target the Playground story, not the matrix — the matrix's forced-open portal renders a dismiss layer that intercepts pointer/keyboard events"
  - "the Stepper recipe no-arbitrary-value test distinguishes arbitrary VALUES (bg-[#fff]) from sanctioned data-[…]:/aria-[…]: attribute-variant selectors"

patterns-established:
  - "Select/Stepper extend the tv()-per-Ark-part + className-per-part discipline (no asChild) from Field/Input"
  - "icon-only Ark triggers (Stepper inc/dec) take the accessible NAME as a resolved string prop the story injects — the primitive never invents it"

requirements-completed: [KIT-05, QUAL-01, QUAL-02, QUAL-03, QUAL-05]

coverage:
  - id: D1
    description: "Select — generic typed-value option control: cyan active option paired with the indicator check, Ark-owned arrow/Home/End/type-ahead keyboard nav, input-family trigger, nests under Field"
    requirement: "KIT-05"
    verification:
      - kind: e2e
        ref: "tests/keyboard.spec.ts#KIT-05 Select disclosure + keyboard (Plan 03-03 GREEN)"
        status: pass
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-05-form--select--matrix axe clean (serious/critical)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Stepper — Ark NumberInput control: tabular-mono value (alignment via the mono face), ≥44px aria-labelled inc/dec triggers, nests under Field"
    requirement: "KIT-05"
    verification:
      - kind: unit
        ref: "src/shared/uikit/Stepper/stepper.test.ts#stepper recipe — the Ark NumberInput mono/44px contract"
        status: pass
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-05-form--stepper--matrix axe clean / interactive targets >= 44x44"
        status: pass
    human_judgment: false
  - id: D3
    description: "Select + Stepper Ladle stories — StateMatrix (Select forced-open + ×4 data-volume empty/few/many/limit) + Playground, both bilingual under Field; RU-longest at the 360 floor"
    requirement: "QUAL-01"
    verification:
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-05-form--select|stepper--matrix|playground (axe + 44px + keyboard-reachable)"
        status: pass
    human_judgment: true
    rationale: "Visual correctness of the ×4 data-volume layouts, the cyan active-option treatment, and the RU-longest clip at 360 is a design-review judgment the axe/44px gate does not assert."

# Metrics
duration: 35min
completed: 2026-06-25
status: complete
---

# Phase 03 Plan 03: KIT-05 Select + Stepper Summary

**Ark Select (generic typed-value options, cyan active option, full keyboard nav) and Ark NumberInput Stepper (tabular-mono value, ≥44px aria-labelled triggers), both nesting under the Field wrapper, with the Select keyboard contract turned GREEN.**

## Performance

- **Duration:** ~35 min
- **Completed:** 2026-06-25
- **Tasks:** 3
- **Files modified:** 12 (6 created, 6 modified across 3 task commits)

## Accomplishments
- Adopted + verified the interrupted-run Select slice (generic `Select<TValue>`, per-part `tv()` recipe, cyan active option paired with the indicator check, Ark-owned keyboard nav), then graduated it.
- Built the Stepper slice over Ark NumberInput — tabular-mono value (alignment via the mono face, not weight), ≥44px icon-only inc/dec triggers whose accessible names the story injects.
- Shipped both Ladle story families (StateMatrix incl. Select forced-open + ×4 data-volume empty/few/many/limit, plus a Playground) under the Field wrapper; all axe-clean + 44px in the catalog gate.
- Turned the Select `aria-expanded`/`aria-controls` + arrow-nav (ArrowDown/End move the highlight) + trap-free Tab keyboard contract GREEN in `keyboard.spec`.
- Caught and fixed a real controlled-`open` bug in the adopted Select that pinned every instance closed.

## Task Commits

1. **Task 1: Select — Ark Select per-part recipe, typed value union, cyan active option** — `14d0caf` (feat)
2. **Task 2: Stepper — Ark NumberInput, tabular-mono value, ≥44px aria-labelled triggers** — `a0e0aac` (feat)
3. **Task 3: Select + Stepper stories (×4 data-volume), barrel, select keyboard spec GREEN** — `7d746ac` (feat)

## Files Created/Modified
- `Select/Select.tsx` `Select/select.ts` `Select/index.ts` — generic typed-value control + per-part recipe + barrel (Task 1)
- `Stepper/Stepper.tsx` `Stepper/stepper.ts` `Stepper/stepper.test.ts` `Stepper/index.ts` — NumberInput control + recipe + contract test + barrel (Task 2)
- `Select/Select.stories.tsx` `Stepper/Stepper.stories.tsx` — StateMatrix + Playground under Field (Task 3)
- `src/index.ts` — KIT-05 Wave-3 barrel region (Select, SelectOption, Stepper) (Task 3)
- `tests/keyboard.spec.ts` — Select GREEN keyboard block (Task 3)
- `_fixtures/strings.ts` — stepperIncrement/Decrement + selectLabel + 6 map-name option fixtures, RU/EN parity (Task 3)

## Decisions Made
- **Adopted the partial Select slice verbatim.** The interrupted run's `Select.tsx`/`select.ts`/`index.ts` were high quality and rule-compliant (generic over the value union, composes Field, `tv()`-per-part, a11y cyan+check, placeholder a plain string). Verified against the plan + full skill chain; the only change needed was the `defaultOpen` bug fix (below).
- **`SelectOption<TValue>` generic satisfies typescript.md §36.** The option type is parameterized by the value union (not erased to `SelectOption<string>`), so a caller's `options`/`value` narrow to the same union — the rule's intent.
- **Live keyboard specs target the Playground story.** The matrix's forced-open cell renders a portalled Ark dismiss layer that intercepts pointer/keyboard events for the whole story; the lone Playground Select is the clean live-keyboard surface. The matrix still serves the static axe/forced-open gate.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Select forced-open pinned every instance into controlled mode**
- **Found during:** Task 3 (writing the Select keyboard spec)
- **Issue:** The adopted slice passed Ark's controlled `open={open}` always. With `open` unset (`undefined`) Ark treats the Select as controlled-but-undefined, so closed Selects could never be opened by the user, and the matrix rendered two open listboxes — the open/close disclosure was broken on every instance.
- **Fix:** Switched the prop to Ark's UNCONTROLLED `defaultOpen` (initial-open only); closed Selects are now user-openable. Updated the forced-open story cell to `defaultOpen`.
- **Files modified:** `Select/Select.tsx`, `Select/Select.stories.tsx`
- **Verification:** the keyboard spec's toggle test (`aria-expanded` false→true on click) + arrow-nav + trap-free tests now pass; only one listbox visible at load.
- **Committed in:** `7d746ac` (Task 3 commit)

**2. [Rule 3 - Toolchain] `tsc --noEmit` verify step is not available in this repo**
- **Found during:** Tasks 1–3 (all `<verify>` blocks)
- **Issue:** The plan's `<automated>` steps call `pnpm exec tsc --noEmit` / `pnpm --filter @solid-stats/design exec tsc --noEmit`, but this repo has no `typescript`/`tsc` — the lint/format gate is Vite+ (`vp check`), which has no type-check stage.
- **Fix:** Used `pnpm exec vp check packages` (fmt + lint) as the gate and wrote types correctly by construction; ran `pnpm --filter @solid-stats/design test` (unit) + the Playwright `keyboard.spec.ts`/`catalog.spec.ts` e2e.
- **Verification:** `vp check` green (134 files formatted, 0 lint errors); 126 unit tests pass; e2e green except the by-design KIT-06 RED scaffolds.
- **Committed in:** n/a (process adjustment, no code impact)

**3. [Rule 2 - Missing critical] New i18n keys for the Select/Stepper stories**
- **Found during:** Task 3 (stories)
- **Issue:** The stories need resolved strings the catalog did not yet carry — `stepperIncrement`/`stepperDecrement` (the icon-only trigger accessible names, mandated by a11y.md + UI-SPEC) plus a Select field label and option-list fixtures.
- **Fix:** Added the keys to `STRINGS` (the single i18n source — they flow to both catalogs + the typed key union automatically), RU primary / EN at parity per UI-SPEC.
- **Files modified:** `_fixtures/strings.ts`
- **Verification:** `catalogs.test.ts` parity test passes (every key non-empty in RU + EN, identical key sets).
- **Committed in:** `7d746ac` (Task 3 commit)

---

**Total deviations:** 3 (1 Rule 1 bug, 1 Rule 3 toolchain, 1 Rule 2 missing critical)
**Impact on plan:** The `defaultOpen` fix was essential for correctness (Select was unusable as shipped). The toolchain swap matches the established repo gate. The i18n keys are required story copy. No scope creep — all changes stayed inside `files_modified`.

## Issues Encountered
- **Ark Select keyboard timing.** Opening via pointer `.click()` leaves Ark's roving highlight un-armed; opening via keyboard (`focus()` + `Enter`) moves focus into the listbox content and arms it. The arrow-nav spec opens via keyboard, and uses `End` (jump to last) + `expect.poll` for a deterministic, flake-free "the highlight moves" assertion (verified 3/3 with `--repeat-each=3`).

## Known Stubs
None — both primitives are fully wired; story fixtures are author-controlled presentational data (v0.1 Ladle, no network/server-2).

## Next Phase Readiness
- KIT-05 form family now has Field + Input (03-02) and Select + Stepper (03-03); FileUpload remains for a later KIT-05 plan.
- The KIT-06 overlay keyboard scaffolds (Dialog/Menu/Tabs) stay RED by design — their owning wave turns them GREEN.
- Select/Stepper are graduated into the barrel and consumable by downstream surface phases.

## Self-Check: PASSED

---
*Phase: 03-uikit-interactive-i18n-global-state-patterns*
*Completed: 2026-06-25*
