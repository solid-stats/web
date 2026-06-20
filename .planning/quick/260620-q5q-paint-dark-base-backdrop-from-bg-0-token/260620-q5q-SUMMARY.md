---
phase: quick-260620-q5q
plan: 01
subsystem: design-system
tags: [theme, tailwind-v4, tokens, gen-theme]
status: complete
requires: []
provides:
  - "Token-driven base backdrop (@layer base html rule) in generated theme.css"
  - "Tree-shake-proof retention of --color-bg-0 / --color-text-primary @theme tokens"
affects:
  - packages/design/src/styles/theme.css
tech-stack:
  added: []
  patterns:
    - "Reference @theme tokens in a real @layer base rule to defeat Tailwind v4 tree-shaking"
key-files:
  created: []
  modified:
    - scripts/gen-theme.mjs
    - packages/design/src/styles/theme.css
decisions:
  - "Emit @layer base { html { ... } } after the @theme block as part of buildTheme()'s template literal — no new section helper, since the block lives outside @theme and bypasses the block()/sections machinery."
metrics:
  duration: ~6m
  completed: 2026-06-20
  tasks: 1
  files: 2
---

# Phase quick-260620-q5q Plan 01: Paint dark base backdrop from bg-0 token Summary

The theme generator now emits an `@layer base { html }` rule that paints the app backdrop from `var(--color-bg-0)` and base text from `var(--color-text-primary)`, so the dark-only design foundation owns its base canvas from tokens (and survives Tailwind v4 tree-shaking) instead of relying on the browser's incidental dark canvas.

## What Was Built

- `scripts/gen-theme.mjs`: appended an `@layer base` block to `buildTheme()`'s returned template literal, immediately after the `@theme {}` block. The block's `html` rule sets `background-color: var(--color-bg-0);` and `color: var(--color-text-primary);` with two-space indentation and a single trailing newline.
- `packages/design/src/styles/theme.css`: regenerated via `pnpm gen-theme`; now carries the `@layer base { html { ... } }` rule at the tail (lines 161–166).

The `var()` references serve double duty: they paint the base via a real rule independent of utility scanning, and they force Tailwind v4 to retain the `--color-bg-0` / `--color-text-primary` `@theme` tokens that were previously tree-shaken (their only consumer, the Ladle GlobalProvider `bg-bg-0` utility, lives outside `@source`).

## Deviations from Plan

None - plan executed exactly as written. (The first `pnpm check` ran before the commit and the drift gate correctly reported a diff against HEAD; committing the regenerated file first, as the plan instructs, made the gate green.)

## Verification

- `pnpm check` exits 0: `pnpm gen-theme` produces no diff against HEAD for `theme.css` (drift gate green), `pnpm lint:design` green (0 errors), `vp check packages scripts` green.
- `git diff --quiet HEAD -- packages/design/src/styles/theme.css` exits 0 — idempotent regeneration leaves the committed file byte-identical.
- `grep` confirms the generated `theme.css` contains `@layer base`, `var(--color-bg-0)`, and `var(--color-text-primary)`.
- DESIGN.md untouched; theme.css produced only by the generator; scope limited to the two files.

## Self-Check: PASSED

- FOUND: scripts/gen-theme.mjs (modified)
- FOUND: packages/design/src/styles/theme.css (modified, contains the rule)
- FOUND: commit d9b307a
