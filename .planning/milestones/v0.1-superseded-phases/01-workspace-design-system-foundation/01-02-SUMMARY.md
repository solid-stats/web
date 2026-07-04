---
phase: 01-workspace-design-system-foundation
plan: 02
subsystem: infra
tags: [vite-plus, vp-check, oxlint, oxfmt, tsgo, fonts, woff2, font-face, exo-2, ibm-plex, tailwind-v4]

# Dependency graph
requires:
  - phase: 01-01
    provides: pnpm workspace skeleton, packages/design, pnpm-workspace.yaml allowBuilds policy, Node 25 toolchain
provides:
  - "Resolved WS-05 lint/format/type-check gate command (`vp check`) recorded in TOOLCHAIN.md"
  - "vite-plus@^0.2.1 installed as root dev-dep (verified legitimate)"
  - "7 self-hosted Cyrillic .woff2 assets (Exo 2, IBM Plex Sans, IBM Plex Mono)"
  - "fonts.css @font-face declarations with font-display: swap and Vite-resolvable relative paths"
affects: [01-04-smoke-render, 01-05-gate-wiring, every-uikit-surface]

# Tech tracking
tech-stack:
  added: [vite-plus@^0.2.1]
  patterns:
    - "Self-hosted fonts inside packages/design with relative url() paths (Vite fingerprints in build graph)"
    - "WS-05 code gate via Vite+ `vp check` (wraps Oxfmt + Oxlint + tsgo)"

key-files:
  created:
    - .planning/phases/01-workspace-design-system-foundation/TOOLCHAIN.md
    - packages/design/src/styles/fonts.css
    - packages/design/src/assets/fonts/*.woff2 (7 files)
  modified:
    - package.json
    - pnpm-lock.yaml

key-decisions:
  - "WS-05 gate resolved to Vite+ `vp check` (primary D-03 path), NOT the primitive contingency — vite-plus confirmed official (voidzero-dev), legitimacy check returned only too-new flag, vp check runs at root exit 0"
  - "Display font is Exo 2 (not Saira) — Saira lacks Cyrillic, UI is RU-primary; DESIGN.md already updated this session"
  - "No allowBuilds flip needed — vp ran without enabling @swc/core / esbuild / msw native builds"

patterns-established:
  - "Self-hosted @font-face in packages/design/src/styles/fonts.css with relative ../assets/fonts/*.woff2 paths"
  - "`vp check` is the workspace code gate; plan 05 must scope it away from vendored .agents/.planning/.design dirs"

requirements-completed: [WS-05]

# Metrics
duration: 8min
completed: 2026-06-20
status: complete
---

# Phase 01 Plan 02: WS-05 Toolchain Gate & Self-Hosted Fonts Summary

**Resolved the WS-05 lint/format/type-check gate to Vite+ `vp check` and shipped 7 self-hosted Cyrillic .woff2 fonts (Exo 2, IBM Plex Sans, IBM Plex Mono) with their @font-face declarations.**

## Performance

- **Duration:** ~8 min
- **Tasks:** 3
- **Files modified:** 11 (1 TOOLCHAIN.md, 7 fonts, 1 fonts.css, package.json, pnpm-lock.yaml)

## Accomplishments
- Confirmed `vite-plus` legitimate (voidzero-dev, ~648K weekly dl, no postinstall, only `too-new` flag — T-1-03 satisfied), installed `vite-plus@^0.2.1` as root dev-dep, and verified `vp check` RUNS at the workspace root (exit 0; reports formatting findings, which is acceptable — WS-05 only requires it to run here, plan 05 makes it pass).
- Recorded the resolved gate command + a plan-05 scoping note in TOOLCHAIN.md (the contingency `oxlint && oxfmt --check . && tsgo --noEmit` is recorded but NOT used).
- Committed 7 Cyrillic-subset `.woff2` assets (Exo 2 600/700, IBM Plex Sans 400/500/600, IBM Plex Mono 400/500) under `packages/design/src/assets/fonts/` — T-1-04 provenance satisfied (Google Fonts OFL, Cyrillic-verified this session).
- Declared all 7 `@font-face` rules in `packages/design/src/styles/fonts.css` with `font-display: swap` and relative `url("../assets/fonts/*.woff2")` paths so Vite fingerprints them in the build graph.

## Task Commits

1. **Task 1: Resolve WS-05 gate (`vp check`)** - `1f76777` (chore)
2. **Task 2: Add self-hosted woff2 fonts** - `5b41bb1` (feat)
3. **Task 3: Declare @font-face in fonts.css** - `792ec79` (feat)

## Files Created/Modified
- `.planning/phases/01-workspace-design-system-foundation/TOOLCHAIN.md` - resolved WS-05 gate command + plan-05 scoping note
- `packages/design/src/styles/fonts.css` - 7 @font-face for the three families
- `packages/design/src/assets/fonts/*.woff2` - 7 self-hosted Cyrillic font binaries
- `package.json` / `pnpm-lock.yaml` - vite-plus dev-dep

## Decisions Made
- **Gate = `vp check`, not the primitive triplet.** `vite-plus` was confirmed the official package and `vp check` ran at the root, so the primary D-03 path holds; the primitive contingency stays recorded-but-unused.
- **Exo 2 over Saira** for the display family (Saira lacks Cyrillic; DESIGN.md already updated to `'Exo 2'` this session, commit 6c3dbbd).
- **No allowBuilds flip** — `vp` ran without enabling any pinned-false native builds in pnpm-workspace.yaml.

## Deviations from Plan

The plan text named **Saira** as the display family; per this session's font override (Saira lacks Cyrillic, UI is RU-primary), the display family is **Exo 2** everywhere — DESIGN.md was already updated and committed (6c3dbbd) before this plan ran. fonts.css and the assets use `'Exo 2'`. This is a pre-approved session decision, not an autonomous deviation.

Both Task 1 and Task 2 were authored as `blocking-human` checkpoints; both were pre-resolved this session (package legitimacy confirmed; fonts pre-placed and Cyrillic-verified), so all three tasks ran autonomously without stopping.

No Rule 1-4 auto-fixes were required. Plan executed as written (with the Exo 2 substitution above).

## Issues Encountered
- `vp check` (no `vite.config` yet — arrives in plan 04) scans the whole tree including vendored `.agents/skills/**` and flags formatting there. Not a blocker for this plan (gate only needs to RUN). Captured a plan-05 TODO in TOOLCHAIN.md to scope `vp check` to project source.
- `fontTools` is not installed in this environment, so the Cyrillic glyph re-check could not be re-run here; relied on this session's prior fontTools verification (T-1-04) per the resolved checkpoint.

## User Setup Required
None - vite-plus is installed; fonts are committed.

## Next Phase Readiness
- Plan 04 (Ladle smoke render) can now render real type — import fonts.css alongside theme.css.
- Plan 05 can wire `vp check` into the root `check` script (scope it away from `.agents/`, `.planning/`, `.design/`).

## Self-Check: PASSED

All created files exist on disk; all 3 task commits (`1f76777`, `5b41bb1`, `792ec79`) found in git history.

---
*Phase: 01-workspace-design-system-foundation*
*Completed: 2026-06-20*
