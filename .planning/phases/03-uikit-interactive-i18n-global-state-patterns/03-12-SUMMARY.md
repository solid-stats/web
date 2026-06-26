---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 12
subsystem: design-uikit
tags: [forms, a11y, button, fileupload, field, gap-closure, tdd]
requires: [03-10]
provides:
  - "control.ts icon-only square size (≥44px both axes) on the shared Button recipe"
  - "FileUpload row controls (retry + delete) routed through the catalogued Button"
  - "Field visible required marker (non-color-alone) driven by the required prop"
  - "form-affordances.spec.ts regression guard"
affects:
  - packages/design/src/shared/uikit/Button
  - packages/design/src/shared/uikit/FileUpload
  - packages/design/src/shared/uikit/Field
tech-stack:
  added: []
  patterns:
    - "icon-only control = variant=ghost + size=icon (one ring/hit-area source)"
    - "Ark ItemDeleteTrigger asChild → shared Button (behaviour from Ark, visual from Button)"
    - "required marker = * glyph (text-loss) paired with sr-only requiredText (never color-alone)"
key-files:
  created:
    - packages/design/tests/form-affordances.spec.ts
  modified:
    - packages/design/src/shared/uikit/Button/control.ts
    - packages/design/src/shared/uikit/Button/Button.stories.tsx
    - packages/design/src/shared/uikit/FileUpload/FileUpload.tsx
    - packages/design/src/shared/uikit/FileUpload/fileUpload.ts
    - packages/design/src/shared/uikit/FileUpload/FileUpload.stories.tsx
    - packages/design/src/shared/uikit/Field/Field.tsx
    - packages/design/src/shared/uikit/Field/field.ts
    - packages/design/src/shared/uikit/Field/Field.stories.tsx
decisions:
  - "icon-only added as a control SIZE (not a variant) so every variant composes with it; no new FORCED_STATE, so control.test.ts stays in sync untouched."
  - "FileUpload row controls use variant=ghost size=icon — the ghost hover treatment the bespoke recipe wanted, now from the shared control."
  - "helperText aria-describedby needs NO code change: Ark 5.37.2 useField already folds the helper id into the control's aria-describedby (verified in source); the spec keeps it as a green regression guard."
metrics:
  duration_min: 11
  completed: 2026-06-26
  tasks: 4
  commits: 4
  files_changed: 9
status: complete
---

# Phase 3 Plan 12: Form-Control Affordance Hardening (GAP-06 + GAP-07) Summary

Routed the FileUpload retry/delete row controls through a new icon-only size on the shared
`control`/Button recipe (one ≥44px hit-area + canonical-ring source), forwarded `disabled` to
those controls, deleted the duplicate `itemDeleteTrigger` recipe, and gave required Fields a
visible, non-color-alone required marker — all guarded by a new Playwright-against-Ladle
regression that failed RED on the pre-fix gaps.

## What shipped

- **GAP-06 — FileUpload row controls.** Added `size: "icon"` to `control.ts` (square ≥44px:
  `min-h-11` from base + `min-w-11`, no horizontal padding, centered) and catalogued it in
  Button's StateMatrix (so the generic catalog axe + 44px gate covers it). The retry control is
  now a `Button variant="ghost" size="icon"`, and the Ark `ItemDeleteTrigger` renders the same
  Button via `asChild` (Ark keeps the delete behaviour; the visual + ring come from Button).
  Both row controls receive `disabled`, driving the previously-dead `data-[disabled]` branch.
  The bespoke `itemDeleteTrigger` slot is deleted from `fileUpload.ts`.
- **GAP-07 — Field required marker.** A required field's label now renders a visible `*` (a
  shape, `text-loss`-tinted) paired with visually-hidden `requiredText` (the resolved
  `fieldRequired` copy the story passes), driven by the existing `required` prop — never the
  asterisk in colour alone. The slice stays i18n-free (`requiredText` is a resolved prop).
- **Regression spec** (`tests/form-affordances.spec.ts`): required-marker visibility +
  not-color-alone, helper `aria-describedby` association, row controls catalogued (≥44px +
  shared `font-semibold` signature), and disabled-forwarding to row controls.

## TDD flow

- RED (89bd07c): 3 of 4 assertions failed on pre-fix code — no `*` marker; row controls at
  `font-weight:400` (bespoke recipe) not the shared `600`; disabled retry button still enabled.
- GREEN (ed3845f → 77ad576 → f68267d): icon-only control → FileUpload routing + disabled →
  Field marker. Final run: **4 passed**.

## Deviations from Plan

### Auto-adjusted (within scope)

**1. [Rule 3 — Test fixture] helperText `aria-describedby` was already wired by Ark 5.37.2.**
- **Found during:** Task 1 RED run (TDD fail-fast: the helper assertion passed pre-fix).
- **Detail:** Ark `useField` (`use-field.ts` `labelIds`) folds the helper-text id into the
  control's `aria-describedby` whenever a helper is present (independent of `invalid`). So the
  GAP-07 helper sub-claim was already satisfied upstream — no `Field.tsx` change was needed for
  it. The spec keeps the assertion as a **green regression guard**, and the Field head comment
  documents the verified behaviour. (2 of 3 behaviours were RED; this one was already closed.)

**2. [Rule 3 — Test fixture] Story cells beyond `files_modified`.**
- `FileUpload.stories.tsx`: the `disabled` cell now renders `files + onRetry` so the
  disabled-forwarding gap is actually exercised by a row control (the old disabled cell rendered
  an empty upload with no row controls). Committed with the RED fixture / Task 3.
- `Field.stories.tsx`: the `required` cell + Playground now pass `requiredText` (resolved
  `fieldRequired`) and the `required` cell uses `selectLabel` as its visible label so the marker
  text is unambiguous from the label text. These were required to drive the regression assertions.

### Test 2 note

`helperText` association is a guard, not a RED→GREEN — see Deviation 1.

## Verification

- `pnpm check` — green (0 errors, formatting + lint + types pass).
- `pnpm --filter @solid-stats/design test` — **186 passed** (incl. control.test.ts FORCED_STATE
  sync, fileUpload.test.ts).
- `pnpm --filter @solid-stats/design test:e2e` (chromium) — **360 passed** (incl. the new
  form-affordances spec + the generic catalog gate over the new icon-only Button state and the
  files+disabled FileUpload cell).

## Self-Check: PASSED

- `packages/design/tests/form-affordances.spec.ts` — FOUND
- Commits 89bd07c, ed3845f, 77ad576, f68267d — FOUND
