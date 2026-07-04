---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 01
subsystem: ui
tags: [lingui, ark-ui, i18n, icu, ladle, playwright, tailwind-v4, typescript]

# Dependency graph
requires:
  - phase: 02-uikit-structural-data-display
    provides: "STRINGS bilingual seed (_fixtures/strings.ts), the Ladle GlobalProvider + tailwind.css import-once discipline, the Playwright-against-Ladle keyboard/cls spec harness, the src/index.ts per-wave barrel"
provides:
  - "KIT-08 runtime i18n harness — RU-primary + EN-parity catalogs derived from STRINGS, a loaded/activated @lingui/core instance, typed message ids via the Register augmentation, RU one/few/many through ICU"
  - "The Ladle language switcher — a `locale` global control (RU↔EN) + I18nProvider wrap so every catalogued story renders bilingually (SC#2)"
  - "The PUBLIC i18n seam graduated into the package barrel (`export { i18n }` + Bilingual/StringKey types) for Phases 4–9"
  - "Wave-0 RED behaviour specs — KIT-06 overlay (Dialog/Menu/Tabs) + KIT-05 Field keyboard/ARIA, and SURF-18 AsyncBoundary CLS=0 — referencing the story ids each later wave must turn green"
affects: [04, 05, 06, 07, KIT-06 overlay, KIT-05 form, SURF-18 global-state, every story that resolves copy]

# Tech tracking
tech-stack:
  added: ["@ark-ui/react@5.37.2", "@lingui/core@6.4.0", "@lingui/react@6.4.0 (installed in Task 2 / 18e151f)"]
  patterns:
    - "Lingui RUNTIME mode (no macros, no @lingui/cli) — explicit i18n._({ id, message, values }); catalogs derived from a single STRINGS source"
    - "Ladle global-control-arg locale toggle read in the GlobalProvider, no custom addon-button file (D-04)"
    - "Wave-0 RED Nyquist scaffolds — behaviour specs reference not-yet-existing story ids so each later wave has a failing acceptance gate (no .skip)"

key-files:
  created:
    - "packages/design/src/shared/uikit/_i18n/{catalogs,i18n,lingui.d,index}.ts + catalogs.test.ts (Task 2 / 18e151f)"
  modified:
    - "packages/design/.ladle/components.tsx — Provider reads the locale control, re-activates i18n, wraps stories in I18nProvider"
    - "packages/design/.ladle/config.mjs — locale global control (inline-radio RU↔EN, default ru)"
    - "packages/design/src/index.ts — graduate the PUBLIC i18n seam (i18n + Bilingual/StringKey)"
    - "packages/design/tests/keyboard.spec.ts — RED overlay/form behaviour specs"
    - "packages/design/tests/cls.spec.ts — RED AsyncBoundary CLS=0 spec"

key-decisions:
  - "Locale toggle = Ladle global control via the control addon defaultState (D-04 global-control-arg), not a custom addon-button component — fewer files, mirrors the disabled theme precedent, reads cleanly as globalState.control['locale'].value"
  - "Toolchain correction: the plan's `tsc --noEmit` verify is a plan-authoring error (no tsc/typescript dep in this repo) — used `pnpm exec vp check packages` (the WS-05 gate) + `ladle:build` instead"
  - "i18n graduation is the PUBLIC seam only (instance + Bilingual/StringKey types); en/ru catalogs + STRINGS stay internal per the underscore-prefix rule"

patterns-established:
  - "Pattern 1: every story resolves copy through the shared runtime i18n instance; strings resolve in the STORY (i18n._), never inside a shared/uikit primitive (architecture.md boundary)"
  - "Pattern 2: Wave-0 RED behaviour specs carry a top-of-file wave→block→story-id map so each later-wave executor knows which block its story must turn green"

requirements-completed: [KIT-08, QUAL-05]

coverage:
  - id: D1
    description: "RU-primary + EN-parity i18n catalogs derived from STRINGS with full key-set identity, plus RU one/few/many through ICU (never concatenation)"
    requirement: "QUAL-05"
    verification:
      - kind: unit
        ref: "packages/design/src/shared/uikit/_i18n/catalogs.test.ts (parity, key-set identity, replayCount one/few/many distinct)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Typed message ids — a missing/renamed id is a type error via the Register augmentation = keyof typeof STRINGS"
    requirement: "KIT-08"
    verification:
      - kind: other
        ref: "Register augmentation in _i18n/lingui.d.ts + `as Catalog` narrowing (compile-time contract). NOTE: vp check in this repo does not run type-aware checks (see Deviations) — surfaced at the phase tsc/CI gate, not per-commit."
        status: unknown
    human_judgment: true
    rationale: "The typed-key gate cannot be auto-proven by the available per-commit toolchain (vp check runs fmt+lint only; no tsc dep). The phase verify-work gate must run the type-checker to confirm SC#4."
  - id: D3
    description: "Ladle language switcher — a locale global control toggles RU↔EN and re-renders every catalogued story bilingually via I18nProvider (SC#2)"
    requirement: "KIT-08"
    verification:
      - kind: automated_ui
        ref: "pnpm --filter @solid-stats/design ladle:build (Meta.json built; control + I18nProvider wired)"
        status: pass
      - kind: manual_procedural
        ref: "ladle dev → toggle the Language control RU↔EN, confirm catalogued copy re-renders"
        status: unknown
    human_judgment: true
    rationale: "Visual bilingual re-render across stories is a human visual confirmation; the build proves the wiring, not the rendered toggle."
  - id: D4
    description: "Wave-0 RED behaviour specs for KIT-06 overlays (Dialog Esc-close+return-focus, trap-free Tab cycle, Menu aria-expanded/controls, Tabs roving tabindex), KIT-05 Field live error, and SURF-18 AsyncBoundary CLS=0 — each RED until its owning wave lands the story"
    requirement: "KIT-08"
    verification:
      - kind: e2e
        ref: "tests/keyboard.spec.ts + tests/cls.spec.ts — reference kit-06-overlay--*, kit-05-form--field--matrix, surf-18-global-state--asyncboundary--cls (RED by design until later waves)"
        status: fail
    human_judgment: false
    rationale: "RED is the intended state (Nyquist); the spec files type/lint-clean under vp check. Each later wave turns its block green as its acceptance gate."

# Metrics
duration: 11min
completed: 2026-06-25
status: complete
---

# Phase 3 Plan 01: Ark UI + Lingui i18n harness & Ladle language switch Summary

**Runtime Lingui i18n harness (RU-primary catalogs derived from STRINGS, typed ids, ICU one/few/many), a Ladle RU↔EN language switcher wrapping every story in I18nProvider, the i18n seam graduated into the barrel, and Wave-0 RED behaviour specs for the overlay/form/AsyncBoundary primitives the later waves fill.**

## Performance

- **Duration:** ~11 min (Tasks 3–4 this session; Task 2 in a prior session at `18e151f`)
- **Started:** 2026-06-25T12:18:00Z (Task 3)
- **Completed:** 2026-06-25T12:30:00Z
- **Tasks:** 4 (Task 1 checkpoint approved; Task 2 prior; Tasks 3–4 this session)
- **Files modified:** 5 (this session) + 6 created (Task 2)

## Accomplishments
- Wired the Ladle language switcher: a `locale` global control (inline-radio RU↔EN, default ru) read in the GlobalProvider, which re-activates the shared runtime `i18n` instance and wraps every story in `<I18nProvider>` (SC#2). fonts.css→tailwind.css import-once order preserved.
- Graduated the PUBLIC i18n seam into the package barrel — `export { i18n }` + `type { Bilingual, StringKey }` — with the v1.0 `/ru` `/en` router graduation seam noted; en/ru catalogs + STRINGS stay internal.
- Added the Wave-0 RED behaviour specs: KIT-06 Dialog (Esc-close + return-focus, trap-free Tab cycle), Menu (aria-expanded/aria-controls), Tabs (roving tabindex), KIT-05 Field (aria-live error associated to the control), and SURF-18 AsyncBoundary (six-state CLS=0) — each referencing the not-yet-existing story id its owning wave must turn green.

## Task Commits

Each task was committed atomically:

1. **Task 1: Pre-install package-legitimacy checkpoint** — approved by the user (no commit; gated Task 2)
2. **Task 2: Install Ark UI + Lingui, build the runtime i18n harness** — `18e151f` (feat, TDD; prior session)
3. **Task 3: Wire the Ladle language switcher + I18nProvider, graduate the i18n seam** — `b112f57` (feat)
4. **Task 4: Wave-0 RED behaviour specs (overlays, form, AsyncBoundary)** — `b636df3` (test)

**Plan metadata:** committed with this SUMMARY (docs: complete plan)

## Files Created/Modified
- `packages/design/.ladle/components.tsx` — Provider `{ globalState, children }`; reads `control.locale.value`, `i18n.activate(locale)`, wraps in `<I18nProvider>`
- `packages/design/.ladle/config.mjs` — `locale` global control via the control addon `defaultState` (inline-radio RU↔EN, default ru); theme + width untouched
- `packages/design/src/index.ts` — KIT-08 barrel region: `export { i18n }` + `type { Bilingual, StringKey }`
- `packages/design/tests/keyboard.spec.ts` — RED KIT-06 overlay + KIT-05 Field behaviour specs (+ top-of-file wave→block→story-id map)
- `packages/design/tests/cls.spec.ts` — RED SURF-18 AsyncBoundary CLS=0 spec
- (Task 2 / `18e151f`) `packages/design/src/shared/uikit/_i18n/{catalogs,i18n,lingui.d,index}.ts`, `catalogs.test.ts`, `_fixtures/strings.ts` (replayCount ICU exemplar), `package.json`, `tsconfig.json` paths

## Decisions Made
- **Locale toggle mechanism (D-04):** chose the Ladle global-control-arg path (declare `locale` in the `control` addon `defaultState`, read `globalState.control['locale'].value` in the Provider) over a custom addon-button component. Stable in Ladle 5.1.1, fewer files, mirrors the disabled `theme` global-toggle precedent, and keeps the change inside `files_modified`.
- **i18n graduation scope:** PUBLIC seam only (the `i18n` instance + `Bilingual`/`StringKey` types). The `en`/`ru` catalog maps and the `STRINGS` seed stay internal per the underscore-prefix barrel rule; the `lingui.d.ts` Register augmentation is ambient (no runtime export).
- **replayCount exemplar already in place:** the RU one/few/many ICU exemplar was added to `_fixtures/strings.ts` in Task 2, so Task 3 needed no strings.ts change despite it appearing in `files_modified`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Toolchain correction: `tsc --noEmit` → `vp check packages`**
- **Found during:** Task 3 + Task 4 (the plan's `<verify>` blocks)
- **Issue:** The PLAN.md verify commands call `pnpm --filter @solid-stats/design exec tsc --noEmit`. This repo has NO `tsc`/`typescript` dependency (the WS-05 decision standardised on Vite+ `vp check`); the command fails with "Command tsc not found".
- **Fix:** Used the project's real gates — `pnpm exec vp check packages` (format + lint, the WS-05 type-aware gate) and `pnpm --filter @solid-stats/design ladle:build`. Did not install tsc.
- **Files modified:** none (verification-only)
- **Verification:** `vp check packages` green (116 files formatted, 109 files no lint/warnings); `ladle:build` green (Meta.json built); vitest 103 pass.
- **Committed in:** n/a (toolchain choice; documented here)

**2. [Rule 1 - Limitation surfaced] `vp check` does not run type-aware checks in this repo**
- **Found during:** Task 3 (verifying the SC#4 typed-key must_have)
- **Issue:** Empirically, appending a bogus `i18n._({ id: "thisIdDoesNotExist" })` reference did NOT trip `vp check packages` — the gate runs Oxfmt + Oxlint only; full TS type-checking (which the `Register` augmentation needs to surface a missing id as an error) is gated on `lint.options.typeCheck`, which is not enabled in this project's config. No `tsc` dependency exists to run standalone.
- **Fix:** Not auto-fixable inside this plan's scope (enabling type-aware lint is a repo-wide toolchain change — Rule 4 territory, deferred). The SC#4 contract is still structurally enforced at compile time by the `Register` augmentation + the `as Catalog` narrowing; surfacing it in CI belongs to the phase verify-work / tsc gate.
- **Files modified:** none
- **Verification:** documented as coverage D2 `human_judgment: true`; flagged for the phase gate.
- **Committed in:** n/a

---

**Total deviations:** 2 (1 blocking toolchain correction, 1 surfaced limitation)
**Impact on plan:** No scope creep. Both tasks completed against the real project gates; the typed-key CI surfacing is correctly deferred to the phase gate rather than expanded here.

## Issues Encountered
- The `files_modified` list includes `_fixtures/strings.ts` under Task 3, but the `replayCount` ICU exemplar it refers to was already added in Task 2 (`18e151f`). No change was needed in Task 3, so it is absent from the Task 3 commit — not a regression.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- KIT-08 i18n harness is the seam every Wave 2–7 story resolves copy through; the language switcher and barrel export are live.
- The Wave-0 RED specs are wired and failing by design — each later wave (KIT-06 overlay, KIT-05 form, SURF-18 global-state) has a concrete failing acceptance gate keyed to a known story id.
- Concern (carry forward): the SC#4 typed-key proof is not surfaced by the per-commit `vp check` gate (type-aware lint disabled, no tsc dep). The phase verify-work step must run a type-checker to confirm a missing message id errors.

## Self-Check: PASSED

- Files: all 5 modified + SUMMARY present on disk.
- Commits: `18e151f` (Task 2), `b112f57` (Task 3), `b636df3` (Task 4) all in git history.

---
*Phase: 03-uikit-interactive-i18n-global-state-patterns*
*Completed: 2026-06-25*
