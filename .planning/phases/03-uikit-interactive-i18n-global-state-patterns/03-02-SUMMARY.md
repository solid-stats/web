---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 02
subsystem: ui
tags: [ark-ui, field, input, forms, a11y, aria-live, tailwind-v4, lingui, ladle, playwright]

# Dependency graph
requires:
  - phase: 03-uikit-interactive-i18n-global-state-patterns
    plan: 01
    provides: "the runtime Lingui i18n harness (i18n._ + typed Register), the Ladle RU↔EN switcher, the Wave-0 RED kit-05-form--field--matrix keyboard scaffold"
provides:
  - "KIT-05 Field — the shared visible-label + announced/associated aria-live error wrapper over Ark Field.Root; the reuse seam Select/Stepper/FileUpload nest under for invalid/required/disabled broadcast"
  - "KIT-05 Input — the text control styled per the DESIGN.md input recipe (surface-2 fill, border-1→border-2 hover, primary-border + ring-glow focus, disabled treatment), inheriting validation state from Field.Root context"
  - "Field + Input graduated into the package barrel (KIT-05 region)"
  - "kit-05-form--field--matrix keyboard spec turned GREEN (forced-invalid live, associated error)"
affects: [04, 05, 06, 07, "KIT-05 Select/Stepper/FileUpload (later this phase)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Ark v5 Field wrapper: tv({ slots }) per anatomy part (root/label/helperText/errorText), Field.Root broadcasts invalid/required/disabled via context, Field.Input inherits aria-invalid + aria-describedby, Field.ErrorText is the announced (aria-live) + associated error — rendered only when invalid"
    - "Input recipe maps the DESIGN.md input recipe onto emitted @theme tokens via tv(), focus glow through the sanctioned shadow-(--shadow-ring-glow) var escape (NOT an arbitrary value)"
    - "vite.config resolve.alias points the @lingui/{react,core} specifiers at their runtime index.mjs to dodge the deps' broken/types-only .d.mts in the Ladle production build"

key-files:
  created:
    - "packages/design/src/shared/uikit/Field/{Field.tsx,field.ts,Field.stories.tsx,index.ts}"
    - "packages/design/src/shared/uikit/Input/{Input.tsx,input.ts,input.test.ts,Input.stories.tsx,index.ts}"
  modified:
    - "packages/design/src/index.ts — KIT-05 barrel region (Field + Input)"
    - "packages/design/tests/keyboard.spec.ts — kit-05-form--field--matrix block RED→GREEN + resolved-copy assertion"
    - "packages/design/src/shared/uikit/_fixtures/strings.ts — KIT-05 copy (4 keys, RU+EN parity)"
    - "packages/design/vite.config.ts — @lingui/{react,core} runtime-entry alias (Rule 3 blocking fix)"

key-decisions:
  - "Field is ONE shared wrapper (not split per control) — the D-05 family reuse seam every other form control nests under (planner's call, confirmed)"
  - "Field.ErrorText is rendered ONLY when invalid — Ark associates the error via aria-describedby only while invalid AND an error region is mounted (verified against use-field.ts), so a conditional mount keeps the association honest and matches the forced-invalid catalog cell"
  - "Input wraps Ark Field.Input (not a bare native input) so the control inherits invalid/aria-invalid/aria-describedby from Field.Root context with no prop drilling; null-safe context means it still renders standalone"
  - "KIT-05 copy added to _fixtures/strings.ts (outside files_modified) — the UI-SPEC Copywriting Contract names selectPlaceholder/fieldRequired/fieldErrorRequired; without them the stories cannot resolve required ids (Rule 2 critical-functionality)"
  - "Toolchain: the plan's tsc --noEmit verify is a plan-authoring error (no tsc in this repo); used vp check packages + ladle:build + vitest + playwright (the real WS-05 gates), as in 03-01"

requirements-completed: [KIT-05, QUAL-01, QUAL-02, QUAL-03, QUAL-05]

# Metrics
duration: 12min
completed: 2026-06-25
status: complete
---

# Phase 3 Plan 02: KIT-05 Form family — Field + Input Summary

**The first form-family slice group: a shared `Field` wrapper (visible `<label>` + announced, `aria-live`, programmatically-associated inline error over Ark `Field.Root`) and an `Input` text control styled per the DESIGN.md `input` recipe — `Field` being the reuse seam every later form control nests under — with the Wave-0 forced-invalid live-region keyboard spec turned GREEN.**

## Performance

- **Duration:** ~12 min
- **Completed:** 2026-06-25
- **Tasks:** 3 (all autonomous; no checkpoints)
- **Files:** 9 created + 4 modified

## Accomplishments

- **Task 1 — `Field`** (`c5db48b`): `field.ts` is a `tv({ slots })` recipe (root/label/helperText/errorText) over the Ark Field anatomy — `/lite`, literal token-only classes, zero arbitrary values, the UI-SPEC `label` typography role (12px/600/uppercase/tracking-label). `Field.tsx` renders `Field.Root` (broadcasting `invalid`/`required`/`disabled` via Ark context), a real associated `Field.Label`, the control as `children`, a conditional `Field.HelperText`, and — only when invalid — a `Field.ErrorText` with `aria-live="polite"` paired with a Lucide `CircleAlert` (never color-alone). No i18n import (props-down strings). `data-field` / `data-field-error` hooks.
- **Task 2 — `Input`** (`b828647`, TDD): `input.test.ts` pins the recipe contract (surface-2 fill, border-1→border-2 hover, primary-border + ring-glow focus, text-subtle placeholder, disabled = surface-1/text-subtle/opacity-60, no arbitrary `[` value) — written RED, then `input.ts` made it GREEN. `Input.tsx` wraps Ark `Field.Input` so it inherits `aria-invalid` + `aria-describedby` from `Field.Root` context; controlled `value` + `onValueChange`; `data-field-control` / `data-input` hooks.
- **Task 3 — stories + barrel + GREEN spec** (`9510396`): `Field.stories.tsx` / `Input.stories.tsx` (`KIT-05 Form / …`) each ship a `Matrix` (StateCell grid incl. the forced-invalid axe/live-region cell via `Field invalid`, no Ladle hack) + a `Playground`; every string resolves via `i18n._({ id })` and passes as a plain prop. `Field` + `Input` graduated into the barrel. The `kit-05-form--field--matrix` keyboard block turned GREEN, now also asserting the resolved RU error copy. QUAL-05 RU-longest label rendered at the 360 floor.

## Task Commits

1. **Task 1: Field wrapper** — `c5db48b` (feat)
2. **Task 2: Input control** — `b828647` (feat, TDD RED→GREEN)
3. **Task 3: stories + barrel + GREEN keyboard spec** — `9510396` (feat)

**Plan metadata:** committed with this SUMMARY (docs: complete plan)

## Decisions Made

- **One shared `Field` (D-05):** not split per control — it is the seam Select/Stepper/FileUpload nest under (planner's call, confirmed).
- **Conditional `Field.ErrorText`:** rendered only when `invalid`. Verified against Ark's `use-field.ts`: the control's `aria-describedby` includes the error id only while `invalid && hasErrorText`, and `ErrorText` carries `aria-live="polite"` + its own id. Conditional mount keeps the association honest and matches the forced-invalid catalog cell deterministically.
- **`Input` over Ark `Field.Input`:** inherits validation state from context (no prop drilling); null-safe context lets it render standalone too.
- **Toolchain correction (carried from 03-01):** the plan's `tsc --noEmit` verify is a plan-authoring error — this repo has no `tsc`. Used `vp check packages` + `ladle:build` + `vitest` + `playwright`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `ladle:build` fails on a clean Vite cache — `@lingui/{react,core}` ship broken/types-only `.d.mts`**
- **Found during:** Task 3 (`ladle:build` verify).
- **Issue:** `@lingui/react@6.4.0`'s `index.d.mts` re-exports a stale, non-existent chunk hash (`./shared/react.CAOiZ7-M.mjs`; the published runtime chunk is `react.DZONiYSA.mjs`), and `@lingui/core`'s `.d.mts` exposes only types (so the runtime `i18n` value is "not exported"). The Ladle production rollup pass resolves the bare specifiers through the deps' `types` condition and pulls the `.d.mts` into the module graph, failing `ladle:build` with `UNRESOLVED_IMPORT` / "not exported" once Vite's pre-bundle cache is cleared. **Reproduces on a clean tree with my changes stashed** — a dep-packaging artifact, not plan code. It built earlier in-session only because a stale `node_modules/.vite` optimize cache masked it.
- **Fix:** `vite.config.ts` `resolve.alias` points `@lingui/react` and `@lingui/core` at their published runtime `index.mjs` (the package `exports` `default`), so resolution never touches the `.d.mts`. Scoped to these two deps; documented to remove when Lingui ships corrected declarations.
- **Files modified:** `packages/design/vite.config.ts` (outside the plan's `files_modified` — justified Rule 3).
- **Verification:** clean `rm -rf node_modules/.vite build && ladle:build` → "Meta.json successfully created"; all 211 catalog e2e green.
- **Committed in:** `9510396`.

**2. [Rule 2 - Missing critical copy] KIT-05 strings added to `_fixtures/strings.ts`**
- **Found during:** Task 3 (stories resolving `i18n._({ id })`).
- **Issue:** The UI-SPEC Copywriting Contract names `selectPlaceholder` / `fieldRequired` / `fieldErrorRequired` (+ a RU-longest label for the QUAL-05 clip check), but they were absent from `STRINGS`. The typed `Register` would make resolving them a type error, and the stories cannot render their required copy without them.
- **Fix:** Added the 4 keys (RU primary + EN parity) to `STRINGS`. They flow automatically into the runtime `ru`/`en` catalogs and the typed key union (no parallel maintenance).
- **Files modified:** `packages/design/src/shared/uikit/_fixtures/strings.ts` (outside `files_modified`).
- **Verification:** `vp check` green; stories resolve; keyboard spec asserts the resolved RU error copy.
- **Committed in:** `9510396`.

---

**Total deviations:** 2 (1 blocking dep/build fix, 1 missing critical copy). No scope creep — both kept strictly to enabling the planned slices and gates.

## Gate Results (ACTUAL)

- `pnpm exec vp check packages` — **pass**: all 125 files formatted, 118 files no lint/warnings.
- `pnpm --filter @solid-stats/design test` (vitest) — **pass**: 6 files, **113 tests** (incl. the new 6 `input.test.ts`).
- `pnpm --filter @solid-stats/design ladle:build` — **pass**: Meta.json created (clean-cache rebuild), `kit-05-form--{field,input}--{matrix,playground}` present.
- `pnpm --filter @solid-stats/design test:e2e -- catalog.spec.ts` — **pass**: **211/211** (axe-clean + 44px + keyboard-reachable on all 4 KIT-05 stories).
- `pnpm --filter @solid-stats/design test:e2e -- keyboard.spec.ts` — **10 passed**; `kit-05-form--field--matrix` block **GREEN**. The only 4 failures are the KIT-06 Dialog/Menu/Tabs Wave-0 RED scaffolds — RED by design, owned by a later wave, NOT in this plan's scope.

## Skill Chain Read (mandatory)

Read and applied: `solidstats-shared-{review,testing,planning}-standards/SKILL.md`, `solidstats-frontend-react-{conventions,code-review,tests}/SKILL.md`, `solidstats-shared-ts-standards/SKILL.md`, `solidstats-frontend-react-design/SKILL.md`, and the conventions references `project-patterns.md` + `patterns/{forms,a11y,component-shape,styling,architecture,localization,typescript,tests}.md`. Rules applied: uikit-vs-feature i18n boundary (no i18n import in the primitives; strings resolve in the story); component shape (named fn, system-props-first, explicit-ternary conditionals, no leaked falsy); styling (tv `/lite` merge-free, token-only utilities, NO arbitrary values, the `shadow-(--var)` escape, ≥44px floor); a11y (visible label, announced + associated error with recovery copy, never color-alone, Lucide icon pairing); tests (vitest pure-logic recipe contract; Playwright for component behaviour).

## Threat Surface Scan

No new trust boundary, endpoint, auth path, or schema surface introduced — presentational Ladle primitives only; props are author-controlled fixture strings rendered via auto-escaped JSX (matches the plan threat register, all `accept`).

## Next Phase Readiness

- `Field` is the live-region/validation seam the remaining KIT-05 controls (`Select`, `Stepper`, `FileUpload`) and the v1.0 TanStack Form layer compose under.
- The `@lingui/{react,core}` build alias unblocks every later Wave's `ladle:build` (the breakage is cache-masked and would have surfaced on any clean CI build); flagged to drop once Lingui ships corrected `.d.mts`.

## Self-Check: PASSED

- Files: all 9 created + 4 modified present on disk.
- Commits: `c5db48b`, `b828647`, `9510396` all in git history.
- Gates: vp check / vitest 113 / ladle:build / catalog 211 / Field keyboard block — all green.

---
*Phase: 03-uikit-interactive-i18n-global-state-patterns*
*Completed: 2026-06-25*
