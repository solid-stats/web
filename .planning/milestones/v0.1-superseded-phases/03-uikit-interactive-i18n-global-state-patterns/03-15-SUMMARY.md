---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 15
subsystem: design-system
tags: [design-tokens, gen-theme, field, a11y, gap-closure]
requires: [03-12]
provides: ["GAP-14 caption-color decision recorded in DESIGN.md"]
affects: [DESIGN.md]
tech-stack:
  added: []
  patterns: ["DESIGN.md as single token source of truth; hierarchy via type, not extra ink"]
key-files:
  created: []
  modified:
    - DESIGN.md
decisions:
  - "GAP-14 resolved as Option 2: accept the multi-axis typographic delta; the shared text-muted ink is intentional. No new caption color token."
metrics:
  duration: ~6m
  completed: 2026-06-26
status: complete
---

# Phase 3 Plan 15: GAP-14 Field Caption Color Summary

GAP-14 (Field caption reads too similarly to its label) closed as a recorded DESIGN.md token decision — the shared `text-muted` ink is intentional; label↔caption hierarchy is carried by type, not a second gray. No new color token, no `theme.css` change.

## What Was Done

- **Task 1 — recorded the caption-color decision in DESIGN.md** (`8ed5b9f`). Added a focused note in the Text-token section (right after the `text-subtle` "not for body text" callout, the rule that drives the decision) stating that a `Field`'s helper/caption text intentionally shares the label's `text-muted` ink.

## The Decision (Option 2 of the plan)

The plan offered two sanctioned outcomes: (1) introduce a distinct AA caption color token, or (2) accept the spec-correct weight/case/tracking delta and record that the shared color is intentional. **Option 2 was chosen**, for these reasons:

1. The `Field` `helperText` already uses `text-muted` (AA everywhere), **not** the decorative `caption` typography role's `text-subtle` — it is already the AA-correct ink for meaningful copy.
2. Label and caption are separated on three typographic axes plus position: label is uppercase / 600 / `tracking-label` (0.06em); caption is sentence-case / 400 / untracked. That is deliberate, sufficient hierarchy.
3. A new between-`muted`-and-`subtle` caption ink would (a) breach the deliberately tight 3-rung text ramp (`primary`/`muted`/`subtle`), (b) risk the 4.5:1 normal-text AA floor on the darker input surfaces — the very rule that already bars `text-subtle` for this copy — and (c) serve a single slot (token proliferation).
4. GAP-14 is severity LOW and MVP_MODE is active — scope was kept tight: a recorded design-of-record, no code/token churn.

Net effect: hierarchy between a field's label and its caption is carried by the **type treatment**, not by color. `field.ts` was left unchanged (its `helperText` slot already points at `text-text-muted`).

## Verification

- `node scripts/gen-theme.mjs && git diff --exit-code packages/design/src/styles/theme.css` — **clean**. The DESIGN.md edit is prose-only (after the front-matter fence), so the generator output is byte-identical; the drift gate is green.
- `pnpm check` — **exit 0** (gen-theme drift gate + `design.md lint` + format + lint/type). The `design.md lint` warnings present are pre-existing (unreferenced `chart-*`/`grid-line` colors, no `spacing` section); `errors: 0`.
- No `design.md lint` contrast run was required: no color token was added or changed.

## Deviations from Plan

None — plan executed as written. Option 2 is an explicitly sanctioned outcome in the plan's `must_haves`. No code change was made beyond the recorded DESIGN.md decision (as the plan's Option 2 specifies); `theme.css` and `field.ts` were intentionally left untouched, and 03-12's required-marker slot in `field.ts` is preserved.

## Known Stubs

None.

## Self-Check: PASSED

- DESIGN.md modified and committed (`8ed5b9f`) — FOUND.
- Drift gate green; `pnpm check` exit 0 in-worktree — VERIFIED.
