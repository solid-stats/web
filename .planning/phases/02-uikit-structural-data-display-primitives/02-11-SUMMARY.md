---
phase: 02-uikit-structural-data-display-primitives
plan: 11
subsystem: ui
tags: [skeleton, sweep-shimmer, stattile, cls, badge, localization, tailwind-v4, ladle, playwright]

# Dependency graph
requires:
  - phase: 02-uikit-structural-data-display-primitives (plan 03)
    provides: the original Skeleton family (text/tile/table variants, opacity pulse)
  - phase: 02-uikit-structural-data-display-primitives (plan 05)
    provides: the StatTile (KIT-03) hero stat tile with the optional signed delta line
  - phase: 02-uikit-structural-data-display-primitives (plan 09)
    provides: the touched Skeleton table geometry + cls.spec table box-equality proof
provides:
  - "GAP-15: a transform-only SWEEP shimmer on all Skeleton variants (text/tile/table), static under reduced motion"
  - "GAP-16: a withDelta Skeleton tile variant that reserves the StatTile delta row (CLS = 0), proven by a cls.spec delta box-equality assertion"
  - "GAP-18: outcome badge copy unified to W/L in both ru + en (intentional non-translation, documented for QUAL-05)"
affects: [player-profile, players-list, any-surface-with-loading-skeletons, any-surface-with-outcome-badges]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Token-driven keyframe in .ladle/tailwind.css: a .sk-sweep ::after gradient overlay animating transform: translateX only, gradient stops read --color-text-muted via color-mix (no raw hex)"
    - "Line-box matching for CLS-exact skeletons: a skeleton row carries the SAME text-size utility as the real text line it stands in for, so its rendered line-box equals the font line-height exactly (fractional Exo-2 metrics included) — no arbitrary px heights"
    - "Intentional non-translation: a bilingual fixture key whose ru === en value is a documented gaming shorthand, parity satisfied by design"

key-files:
  created: []
  modified:
    - packages/design/.ladle/tailwind.css
    - packages/design/src/shared/uikit/Skeleton/Skeleton.tsx
    - packages/design/src/shared/uikit/Skeleton/Skeleton.stories.tsx
    - packages/design/src/shared/uikit/StatTile/StatTile.stories.tsx
    - packages/design/src/shared/uikit/_fixtures/strings.ts
    - packages/design/tests/cls.spec.ts

key-decisions:
  - "Sweep shimmer re-implemented (not ported) from the binding hi-fi players.css .sk::after: same translateX(-100%)→translateX(100%) 1.25s loop + reduced-motion-off, but the shine gradient reads --color-text-muted via color-mix (the hi-fi used its --fg-3) and the fill maps --surface-3 → bg-surface-2"
  - "GAP-16 closed via the withDelta Skeleton tile variant (the plan's preferred option) so a no-delta tile stays compact; the alternative (StatTile always reserving the delta slot) was rejected to keep value-only tiles tight"
  - "Skeleton tile rows are sized by applying the real type-role text utility (text-2xs / text-4xl / text-sm) to each shimmer row, giving exact box equality without arbitrary px heights"
  - "GAP-18: outcome copy is W/L in BOTH languages — an intentional non-translation matching the DESIGN.md badge-outcome-* recipe; QUAL-05 parity is by-presence (the _fixtures.test.ts proof asserts ru+en both non-empty, never ru !== en), so ru === en passes"

patterns-established:
  - "Pattern: token-driven sweep keyframe (.sk-sweep) — the reusable shimmer recipe for every Skeleton variant"
  - "Pattern: text-role line-box matching for CLS-exact skeleton rows (no arbitrary heights)"

requirements-completed: [KIT-03, KIT-07, QUAL-04, QUAL-05]

coverage:
  - id: D1
    description: "GAP-15 — sweep-shimmer Skeleton (transform-only translateX gradient overlay, static under reduced motion) across all variants; animate-pulse removed"
    requirement: "KIT-07"
    verification:
      - kind: automated_ui
        ref: "packages/design/tests/cls.spec.ts#Skeleton CLS = 0 › table skeleton reserves the same height as the final table"
        status: pass
      - kind: automated_ui
        ref: "packages/design/tests/catalog.spec.ts#kit-07-feedback--skeleton--* axe clean (serious/critical)"
        status: pass
      - kind: other
        ref: "grep -c animate-pulse Skeleton.tsx = 0; grep sk-sweep/translateX present; grep bg-[/#hex = 0"
        status: pass
    human_judgment: false
  - id: D2
    description: "GAP-16 — withDelta Skeleton tile variant reserves the StatTile delta row so a delta tile is not taller than its skeleton (CLS = 0); plain tile still matches the compact skeleton"
    requirement: "KIT-03"
    verification:
      - kind: automated_ui
        ref: "packages/design/tests/cls.spec.ts#StatTile CLS = 0 › delta-tile skeleton reserves the same box height as the final delta tile"
        status: pass
      - kind: automated_ui
        ref: "packages/design/tests/cls.spec.ts#StatTile CLS = 0 › plain-tile skeleton still matches the no-delta tile box height (no regression)"
        status: pass
    human_judgment: false
  - id: D3
    description: "GAP-18 — outcome badge copy unified to W/L in both ru + en, intentional non-translation documented for QUAL-05"
    requirement: "QUAL-05"
    verification:
      - kind: unit
        ref: "packages/design/src/shared/uikit/_fixtures/_fixtures.test.ts#RU + EN string-map parity (QUAL-05)"
        status: pass
      - kind: other
        ref: "grep outcomeWin/outcomeLoss strings.ts → { ru: \"W\", en: \"W\" } / { ru: \"L\", en: \"L\" }"
        status: pass
    human_judgment: false
  - id: D4
    description: "Design-review (seven pillars) APPROVE on Skeleton (sweep) + StatTile (delta reserve) + Badge (W/L), diffed against the binding hi-fi players.css sweep + the DESIGN.md badge-outcome-* recipe"
    requirement: "QUAL-04"
    verification:
      - kind: other
        ref: "design.md lint errors=0; transform-only sweep + reduced-motion-off; zero arbitrary values across the three surfaces; full Playwright 220 + Vitest 91 + root pnpm check exit 0"
        status: pass
    human_judgment: false

# Metrics
duration: 6min
completed: 2026-06-24
status: complete
---

# Phase 02 Plan 11: Stat / Feedback / Copy Fixes Summary

**Transform-only sweep-shimmer Skeleton on every variant, a withDelta StatTile skeleton that reserves the delta row for CLS = 0, and outcome badge copy unified to the W/L gaming shorthand in both languages — closing GAP-15, GAP-16, GAP-18.**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-06-24T05:42:00Z
- **Completed:** 2026-06-24T05:47:51Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- **GAP-15** — Replaced the barely-perceptible opacity pulse with a SWEEP shimmer on all three Skeleton variants (text/tile/table): a token-driven `.sk-sweep` `::after` gradient bar animating `transform: translateX(...)` only, dropping to a static block under `prefers-reduced-motion`. The dull loading look on Table + StatTile is fixed too. `animate-pulse` is gone.
- **GAP-16** — Added a `withDelta` option to the Skeleton `tile` variant that reserves the StatTile delta row, so a delta-bearing tile is no longer taller than its loading skeleton (CLS on load eliminated). Proven by a new `cls.spec` assertion: delta-tile skeleton box height == final delta tile box height (and the plain pair still matches, no regression).
- **GAP-18** — Unified the outcome badge copy to the `W`/`L` gaming shorthand in BOTH languages, replacing the asymmetric RU `«П»` / `«пор.»`. Matches the DESIGN.md `badge-outcome-*` recipe; the intentional non-translation is documented for QUAL-05.
- Full gate green: Playwright 220, Vitest 91, root `pnpm check` exit 0, `design.md lint` errors = 0, zero arbitrary values across the three surfaces.

## Task Commits

Each task was committed atomically:

1. **Task 1: GAP-15 sweep-shimmer Skeleton across all variants** - `cace00e` (feat)
2. **Task 2: GAP-16 StatTile delta-row skeleton reserve + cls delta proof** - `eba0e1f` (feat)
3. **Task 3: GAP-18 unify outcome badge copy to W/L in both languages** - `a902ce3` (feat)

## Files Created/Modified

- `packages/design/.ladle/tailwind.css` - Added the `.sk-sweep` utility + `@keyframes sk-sweep` (token-driven, transform-only, reduced-motion-off).
- `packages/design/src/shared/uikit/Skeleton/Skeleton.tsx` - Shimmer constant now uses `.sk-sweep` instead of `animate-pulse`; tile variant gains the `withDelta` option and mirrors the StatTile box via text-role line-box matching.
- `packages/design/src/shared/uikit/Skeleton/Skeleton.stories.tsx` - Recipe comment cites GAP-15 / the sweep + reduced-motion note.
- `packages/design/src/shared/uikit/StatTile/StatTile.stories.tsx` - New `Proof` story: `withDelta` skeleton above a delta tile, plain skeleton above a no-delta tile (the CLS proof pairs).
- `packages/design/src/shared/uikit/_fixtures/strings.ts` - `outcomeWin`/`outcomeLoss` → `{ ru: "W", en: "W" }` / `{ ru: "L", en: "L" }` with the QUAL-05 intentional-non-translation comment.
- `packages/design/tests/cls.spec.ts` - New `StatTile CLS = 0` describe block: delta-tile and plain-tile skeleton-vs-final box-height equality assertions.

## Decisions Made

- **Sweep re-implemented, not ported.** Diffed against the binding hi-fi `players.css` `.sk::after`: same `translateX(-100%) → translateX(100%)` 1.25s ease-in-out loop and reduced-motion-off semantics, but re-authored with project tokens — the shine gradient reads `--color-text-muted` via `color-mix` (the hi-fi used its `--fg-3`) and the fill maps `--surface-3` → `bg-surface-2`. The keyframe lives in `.ladle/tailwind.css` because no stock Tailwind animation translates an `::after` overlay and the gradient stop must read a token.
- **GAP-16 via `withDelta` (the plan's preferred option)** so a no-delta tile stays compact, rather than having StatTile always reserve a delta slot.
- **Line-box matching for exact CLS equality.** Each skeleton tile row carries the same `text-*` role utility as the StatTile line it stands in for (`text-2xs` label · `text-4xl` value · `text-sm` delta), so the row's rendered line-box equals the real font line-height exactly — including fractional Exo-2 metrics — with no arbitrary px heights. (First attempt used approximate `h-*` bars and the box heights drifted ~12px; the line-box approach hit exact equality.)
- **GAP-18 parity is by-presence.** The `_fixtures.test.ts` QUAL-05 proof asserts each key has both a non-empty `ru` and `en` — it does not require `ru !== en` — so `{ ru: "W", en: "W" }` is valid and the intentional non-translation needs no test change, only the documenting comment.

## Hi-fi / recipe diff (design-review record, QUAL-04)

**Verdict: APPROVE** (seven pillars), with the binding diffs recorded:

- **Skeleton sweep vs `.design/hifi/players.css` `.sk::after`** — semantics matched (translateX sweep, 1.25s ease-in-out infinite, reduced-motion → `animation: none`); token substitution `--fg-3` → `--color-text-muted` (color-mix 16%) and `--surface-3` → `bg-surface-2`. The dropped-affordance the Phase-2 review flagged ("Skeleton used an opacity pulse vs the hi-fi sweep shimmer", checklist Pillar 2) is now resolved.
- **Badge copy vs DESIGN.md `badge-outcome-win/loss`** — the recipe names `W`/`L` as the paired label; copy now matches in both locales. The Pillar 6 finding (`outcomeWin="П"` bare letter vs `outcomeLoss="пор."` abbreviation-with-period asymmetry) is resolved.
- **StatTile delta reserve** — the Pillar 2 finding ("a StatTile skeleton must reserve the delta row") is resolved, with the cls.spec assertion proving it.

Pillar checks: Pillar 1 `design.md lint` errors = 0 + zero arbitrary values; Pillar 2 transform-only sweep + skeleton box == final box (table + StatTile delta/plain); Pillar 3 axe serious/critical = 0, skeleton stays `aria-hidden`/`aria-busy`, sweep is essential loading motion and static under reduced motion; Pillar 6 outcome copy symmetric + recipe-aligned.

## Deviations from Plan

None - plan executed exactly as written. (The line-box-matching approach for the tile skeleton heights is the plan's own "EXACTLY equals the StatTile delta line's rendered height" requirement; the first `h-*` approximation was corrected to line-box utilities within Task 2 before commit, not a scope change.)

## Issues Encountered

- The initial Task-2 tile skeleton used approximate `h-4`/`h-10`/`h-5` bars; the cls.spec measured a ~12px box-height mismatch against the real StatTile (106.33px final vs 94px skeleton). Resolved by sizing each skeleton row with the real type-role `text-*` utility so the rendered line-box matches the font line-height exactly — both delta and plain assertions then passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The sweep-shimmer Skeleton, the `withDelta` delta-reserving tile skeleton, and the W/L outcome badges are ready for graduation into the TanStack Start routes (player profile, players list) where loading skeletons and outcome badges appear.
- No blockers. STATE.md / ROADMAP.md are intentionally NOT touched here (worktree mode — the orchestrator owns those writes after the wave merges).

## Self-Check: PASSED

All 6 modified files present on disk; all 3 task commits (`cace00e`, `eba0e1f`, `a902ce3`) found in git history.

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-24*
