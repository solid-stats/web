---
status: testing
phase: 03-uikit-interactive-i18n-global-state-patterns
source: [03-VERIFICATION.md]
started: 2026-06-25T09:01:43Z
updated: 2026-06-25T14:29:05Z
---

## Current Test

number: 2
name: Bilingual toggle — every story renders RU↔EN (SC#2, QUAL-05)
expected: |
  In `ladle dev`, the `locale` global control toggles RU↔EN and EVERY catalogued story
  re-renders in the chosen language (default RU). No clipped or awkward RU wording; the
  RU-longest strings (e.g. the FileUpload dropzone prompt) fit at the 360px mobile floor.
awaiting: user response

## Tests

### 1. SC#4 typed-key gate (KIT-08)
expected: |
  The `lingui.d.ts` `Register { messageIds: keyof typeof STRINGS }` augmentation makes a
  missing/misspelled message id a compile error. Because `vp check` is oxlint+oxfmt only
  (no type-aware checker; the repo has no `tsc` per the Phase-1 toolchain decision), this
  must be confirmed by a type-aware run. Introduce a bad id (e.g. in a `.stories.tsx` or a
  `_fixtures/bad-id.ts`) and run a type-aware check (`tsgolint`, an oxlint typeCheck pass,
  or a `tsc --noEmit` if added). Expect a type error on the unknown id; no silent pass.
  Decision to record: whether to wire a permanent CI type-aware gate (tsgolint is already in
  node_modules/.bin) + a `@ts-expect-error` regression oracle, or accept SC#4 as structural-only.
result: passed
resolution: |
  RESOLVED — the permanent CI type-aware gate was wired (quick task 260625-t1o). The root
  `vite.config.ts` `lint.options.typeCheck:true` makes `pnpm check` (and CI) run the full
  TS-Go/tsgolint type check, so a missing/misspelled `i18n._({ id })` is now a hard error.
  Activating it surfaced 33 real latent type errors; all were fixed as classes and the repo
  is type-clean (`pnpm check` exits 0). A committed `@ts-expect-error` regression oracle
  (`packages/design/src/shared/uikit/_i18n/typed-key.oracle.ts`) guards the contract: it is
  GREEN while the augmentation holds and turns RED (unused-directive, TS2578) if the id ever
  widens back to `string` — proven live (flip-to-real-key → RED, restore → GREEN). CI
  (`.github/workflows/check.yml`) runs `pnpm check` on every push + pull_request. Decision:
  a PERMANENT CI type-aware gate, NOT structural-only.

### 2. Bilingual toggle — every story renders RU↔EN (SC#2, QUAL-05)
expected: |
  In `ladle dev`, the `locale` global control toggles RU↔EN and EVERY catalogued story
  re-renders in the chosen language (default RU). No clipped or awkward RU wording; the
  RU-longest strings (e.g. the FileUpload dropzone prompt) fit at the 360px mobile floor.
result: [pending]

### 3. KIT-05 form family — visual design-review pass (QUAL-01/02/03)
expected: |
  Field (visible label + inline aria-live error + CircleAlert icon), Input, Select (cyan
  active option paired with the check indicator), Stepper (tabular-mono value, ≥44px
  inc/dec), FileUpload (focusable dropzone + Browse, per-file accepted/rejected rows, SVG
  rejected with a why+fix message) all read correctly: consistent recipe, visible focus
  rings, ≥44px hit targets feel right, never color-alone, RU-longest fits at the 360 floor.
result: [pending]

### 4. KIT-06 overlay family — visual design-review pass (QUAL-01/03/04)
expected: |
  Dialog (scrim + focus trap + return-focus + Esc + the destructive-confirmation pattern),
  Popover (non-modal, no trap), Menu (cyan active item, ≥44px), Tabs (cyan active tab paired
  with the underline, no layout shift on selection — CLS=0), Tooltip (focus+hover, respects
  reduced-motion, never the only meaning carrier) all behave and look correct on keyboard
  and pointer, bilingually.
result: [pending]

### 5. SURF-18 — AsyncBoundary + ToastManager visual pass (QUAL-01/04)
expected: |
  AsyncBoundary renders all six states (loading/empty/error/offline/reconnecting/stale) by
  reusing the existing Phase-2 primitives, with the same reserved box height as the ready
  slot (no layout shift — CLS=0). ToastManager stacks, auto-dismisses, and every dismiss
  control has a visible/accessible name (no unnamed ✕).
result: [pending]

## Summary

total: 5
passed: 1
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
