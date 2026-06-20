---
phase: 01-workspace-design-system-foundation
plan: 03
subsystem: ui
tags: [design-tokens, tailwind-v4, theme, gen-theme, data-trust, workspace]

# Dependency graph
requires:
  - phase: 01-workspace-design-system-foundation (plan 01)
    provides: packages/design workspace package + ./theme.css export target
  - phase: 01-workspace-design-system-foundation (plan 02)
    provides: packages/design/src/styles/fonts.css (co-located, untouched here)
provides:
  - "Token pipeline relocated into the workspace: gen-theme.mjs writes packages/design/src/styles/theme.css (D-09 / WS-03)"
  - "DS-03 data-trust vocabulary as first-class @theme tokens: freshness ×4, known/unknown/conflict, provenance fg/link (D-12)"
  - "Generic {colors.*}/{rounded.*} reference resolver in gen-theme.mjs"
  - "Drift-gated single-source theme.css (committed == regenerated)"
affects: [ui-phase, surface-design, tailwind-consumption, data-trust-components]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Recipe → @theme: components.* data-trust recipes resolved to literal CSS custom properties at generate time (no {token} refs leak)"
    - "Named semantic state tokens carry data-trust; translatable copy stays in i18n, never a token value (D-12)"

key-files:
  created:
    - packages/design/src/styles/theme.css
  modified:
    - scripts/gen-theme.mjs
  removed:
    - src/styles/theme.css

key-decisions:
  - "Data-trust border tokens emit the full `1px solid <color>` shorthand (faithful to the DESIGN.md recipe), mirroring how the elevation section emits full --shadow-ring values rather than bare colors."
  - "DS-03 'first-class token' satisfied by named semantic state tokens (A2); Russian display copy («Актуально» etc.) excluded from @theme and deferred to i18n (Phase 3)."

patterns-established:
  - "Generic resolveRefs() handles any {colors.NAME}/{rounded.NAME} ref, extending the previously hardcoded elevation focus-ring resolve."
  - "theme.css is generated, never hand-edited; a re-run + git diff --exit-code is the drift gate."

requirements-completed: [WS-03, DS-01, DS-02, DS-03]

# Metrics
duration: 3min
completed: 2026-06-20
status: complete
---

# Phase 01 Plan 03: Token pipeline into workspace + DS-03 data-trust tokens Summary

**gen-theme.mjs relocated to write packages/design/src/styles/theme.css and extended to emit the data-trust vocabulary (freshness ×4, known/unknown/conflict, provenance) as first-class resolved @theme tokens — closing the DS-03 gap that was 0 hits before.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-20T09:50:51Z
- **Completed:** 2026-06-20T09:53:13Z
- **Tasks:** 2
- **Files modified:** 2 (1 created, 1 modified, 1 removed)

## Accomplishments
- Relocated `OUT_PATH` to `packages/design/src/styles/theme.css` (D-09 / WS-03); `DESIGN_PATH` stays at repo root (DESIGN.md is the single source of truth).
- Extended `buildTheme()` to read `components.*` and emit 23 data-trust tokens, resolving `{colors.*}`/`{rounded.*}` via a new generic `resolveRefs()` resolver.
- Regenerated drift-free (`git diff --exit-code` clean on re-run), removed the orphan top-level `src/styles/theme.css` (and empty `src/styles/`, `src/`).
- Confirmed `--font-display: 'Exo 2'` (Saira fully absent), paired `--text-*--line-height` intact (DS-01), zero unresolved `{colors.` refs, zero Cyrillic in token values.

## Task Commits

Each task was committed atomically:

1. **Task 1: Relocate OUT_PATH + emit data-trust tokens (D-09 + D-12)** - `568908d` (feat)
2. **Task 2: Regenerate, drift-gate, remove orphan src/styles** - `0d81ad2` (feat)
3. **Deviation fixup: stale OUT_PATH comment in generator header** - `945ddcb` (docs, Rule 1)

## Files Created/Modified
- `scripts/gen-theme.mjs` - Relocated OUT_PATH; added generic `resolveRefs()`; reads `components.*` and emits the data-trust @theme section.
- `packages/design/src/styles/theme.css` - Regenerated (created at the package path; renamed from the old root copy at 76% similarity per git).
- `src/styles/theme.css` - Removed (relocated, not duplicated).

## Emitted DS-03 tokens (23)
- Freshness ×4 (fill/text/border each): `--color-freshness-up-to-date-*`, `--color-freshness-stale-*`, `--color-freshness-offline-*`, `--color-freshness-reconnecting-*` (win / warn / loss / info recipes).
- Known/Unknown/Conflict (fill/text/border each): `--color-known-*`, `--color-unknown-*`, `--color-conflict-*`.
- Provenance: `--color-provenance-fg` (text-muted), `--color-provenance-link` (primary).

## Decisions Made
- Data-trust `*-border` tokens carry the full `1px solid <color>` shorthand (faithful to the DESIGN.md recipe `border:` field), consistent with how the existing elevation section emits full `--shadow-ring` values rather than bare colors.
- DS-03 "first-class token" is satisfied by named semantic state tokens (RESEARCH A2); Russian display strings stay in i18n, never as @theme values (D-12).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Stale OUT_PATH path in gen-theme.mjs header comment**
- **Found during:** Post-Task-2 reference scan
- **Issue:** The generator's header comment still named the old `src/styles/theme.css` output path after the relocation, an inaccurate doc reference.
- **Fix:** Updated the comment to point at `packages/design/src/styles/theme.css`.
- **Files modified:** scripts/gen-theme.mjs
- **Verification:** Re-ran `pnpm gen-theme`; `git diff --exit-code` still clean (comment-only change, no output drift).
- **Committed in:** `945ddcb`

---

**Total deviations:** 1 auto-fixed (1 bug — doc accuracy).
**Impact on plan:** Cosmetic correctness fix; no output change, no scope creep. `packages/design/package.json` `"./theme.css": "./src/styles/theme.css"` is package-relative and already resolves to the new location — left as-is.

## Issues Encountered
None - both tasks executed as planned; all automated verify gates (drift, orphan-gone, freshness ×4, known/unknown/conflict, provenance, paired line-height, no unresolved refs) passed.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The `@solid-stats/design` package now owns the full generated `@theme` (theme.css + fonts.css); consumers can import `./theme.css` and use the data-trust tokens directly.
- DS-03 data-trust vocabulary is available as named tokens for the surface-design / UI phases; Russian display copy remains to be wired in i18n (Phase 3).

## Self-Check: PASSED

- `packages/design/src/styles/theme.css` exists; `scripts/gen-theme.mjs` exists; `src/styles/theme.css` confirmed removed; SUMMARY exists.
- Commits `568908d`, `0d81ad2`, `945ddcb` all present in git history.

---
*Phase: 01-workspace-design-system-foundation*
*Completed: 2026-06-20*
