---
phase: 01-workspace-design-system-foundation
plan: 04
subsystem: ui
tags: [ladle, vite, tailwindcss-v4, design-system, theme, fonts, react]

# Dependency graph
requires:
  - phase: 01-02
    provides: "Self-hosted woff2 fonts (Exo 2 / IBM Plex Sans / IBM Plex Mono) + fonts.css @font-face"
  - phase: 01-03
    provides: "Generated theme.css with the @theme tokens incl. the DS-03 data-trust freshness/known/unknown/conflict tokens"
provides:
  - "Ladle wired to the real Vite 6 + Tailwind v4 stack inside packages/design (dark-only, no SSR)"
  - "The single smoke story proving the generated @theme resolves on the real stack (colors, type, tabular numerals, Cyrillic data-trust vocabulary)"
  - "The @solid-stats/design UIKIT barrel (src/index.ts) — empty in Phase 1, resolves via the exports map"
  - "The colocated src/shared/uikit/<Component>/*.stories.tsx catalog convention, source-scanned by Tailwind v4"
affects: [01-05, ui-phase, component-graduation, any-future-uikit-component]

# Tech tracking
tech-stack:
  added: ["@ladle/react@5.1.1 (design devDep)", "@tailwindcss/vite@4.3.1 (design devDep)", "tailwindcss@4.3.1 (design devDep)"]
  patterns:
    - "Ladle auto-loads packages/design/vite.config.ts and merges its own react + tsconfig-paths plugins (no second Vite)"
    - "Single Tailwind root via .ladle/tailwind.css: @import the generated theme.css + @source ../src (Ladle's Vite root is its bundled app dir in node_modules, so auto content-detection misses the package)"
    - "Compound data-trust freshness tokens (fill/text/border) consumed via inline style reading the custom property — the sanctioned escape hatch for a token whose value (1px solid …) is not expressible as a single Tailwind utility"

key-files:
  created:
    - packages/design/vite.config.ts
    - packages/design/.ladle/config.mjs
    - packages/design/.ladle/components.tsx
    - packages/design/.ladle/tailwind.css
    - packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx
    - packages/design/src/shared/uikit/Smoke/index.ts
    - packages/design/src/index.ts
  modified:
    - packages/design/package.json
    - .gitignore

key-decisions:
  - "Dropped the `defineConfig` import from `vite` in vite.config.ts (type-only `UserConfig` import only) — keeps packages/design free of a direct `vite` dep per RESEARCH anti-pattern; `defineConfig` is only an identity helper."
  - "Added .ladle/tailwind.css carrying `@import \"../src/styles/theme.css\"` + `@source \"../src\"` and made it the single Tailwind root the provider imports — Ladle sets Vite `root` to its bundled app dir, so Tailwind's automatic content detection never scans packages/design and tree-shook every custom-token utility (only the built-in font-mono survived). theme.css stays imported exactly once (via this entry) and is NOT hand-edited."
  - "Freshness pills consume `--color-freshness-*` via inline `style` reading the custom property: the `-border` token holds a full `1px solid …` value that has no single Tailwind border-color utility; styling.md explicitly sanctions an escape hatch that reads a CSS variable from @theme rather than a hardcoded literal."
  - "Provider/base text uses `text-text-primary` (the --color-text-primary ink token), not `text-primary` (which is the cyan --color-primary accent) — the RESEARCH example's `text-primary` would have painted body text cyan."
  - "shared/ FSD segment preserved (src/shared/uikit/Smoke/) per architecture.md slice rules + design pipeline.md §3: the package is a workspace package, not 'the shared layer', so the slice path is not flattened to src/uikit/."

patterns-established:
  - "Ladle catalog convention: colocated src/shared/uikit/<Component>/<Component>.stories.tsx, discovered by the config.mjs glob, NOT re-exported through the public UIKIT barrel."
  - "Dark-only Ladle: theme addon { enabled: false, defaultState: 'dark' } — single-palette @theme, nothing to toggle."

requirements-completed: [WS-02, WS-04]

# Metrics
duration: ~12min
completed: 2026-06-20
status: complete
---

# Phase 1 Plan 04: Ladle on the real Vite + Tailwind v4 stack Summary

**Ladle wired to the real Vite 6 + Tailwind v4 stack in packages/design (dark-only), shipping the one smoke story whose `bg-surface-1` resolves to `var(--color-surface-1)` and which renders Exo 2 display, IBM Plex body/mono tabular numerals, and the Russian data-trust freshness vocabulary on the self-hosted Cyrillic fonts — closing the walking-skeleton DESIGN.md → @theme → Ladle slice.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-06-20T16:55:00Z (approx)
- **Completed:** 2026-06-20T17:07:21Z
- **Tasks:** 2
- **Files modified:** 9 (7 created, 2 modified; pnpm-lock.yaml regenerated)

## Accomplishments
- `pnpm --filter @solid-stats/design exec ladle build` exits 0, transforms 104 modules, emits the Smoke story chunk, and fingerprints all self-hosted woff2 fonts (incl. Exo 2 Cyrillic) into the build graph.
- Built CSS resolves design tokens on the real stack — `.bg-surface-1{background-color:var(--color-surface-1)}` with `--color-surface-1:#151a25`; `.font-display{font-family:var(--font-display)}` → `"Exo 2"`; `.text-primary` → `--color-primary:#36c5e0` (the one cyan accent); `tabular-nums` emitted; 12 `--color-freshness-*` tokens present.
- The smoke story renders the Russian data-trust vocabulary (Актуально / Данные устаревают / Связь потеряна / Переподключение) wired to the DS-03 freshness tokens — proving both the @theme and Cyrillic self-hosted type resolve.
- The `@solid-stats/design` UIKIT barrel (`src/index.ts`) resolves via the exports map; zero real components beyond the one catalog story (D-07 / MIGRATION D4).
- No `allowBuilds` flip was needed — esbuild and @swc/core ship prebuilt platform binaries that were already functional under Node 25.9.0; `pnpm-workspace.yaml` was left untouched.

## Task Commits

Each task was committed atomically:

1. **Task 1: Ladle + Vite + Tailwind v4 wiring (dark-only)** - `2019189` (feat)
2. **Task 2: Smoke story + UIKIT barrel (zero components)** - `c0c0efb` (feat)

## Files Created/Modified
- `packages/design/vite.config.ts` - Root Vite config Ladle auto-loads; applies only `@tailwindcss/vite` (type-only `UserConfig` import, no direct `vite` dep).
- `packages/design/.ladle/config.mjs` - Ladle UserConfig: theme addon disabled (dark-only), `defaultState: "dark"`, colocated story glob, width addon on.
- `packages/design/.ladle/components.tsx` - GlobalProvider importing `fonts.css` + `tailwind.css`; dark-only gunmetal base wrapper using @theme utilities.
- `packages/design/.ladle/tailwind.css` - The single Tailwind root: `@import` the generated theme.css + `@source "../src"` so Tailwind v4 scans the package (Ladle's Vite root is its bundled app dir).
- `packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx` - The one smoke story (export `Tokens` → id `smoke--tokens`); token-driven utilities only, no arbitrary values.
- `packages/design/src/shared/uikit/Smoke/index.ts` - Slice entrypoint (story-only; nothing to re-export).
- `packages/design/src/index.ts` - The (empty) `@solid-stats/design` UIKIT barrel.
- `packages/design/package.json` - Added `@ladle/react`, `@tailwindcss/vite`, `tailwindcss` as design devDeps so the plugin resolves from the package.
- `.gitignore` - Ignore `packages/*/build/` (regenerable Ladle output).

## Decisions Made
See the `key-decisions` frontmatter. The load-bearing one: the `@source` directive in a Ladle-scoped Tailwind entry is the fix for Ladle setting Vite's `root` to its bundled app dir in `node_modules` — without it, Tailwind v4's automatic content detection scanned the wrong tree and tree-shook every custom-token utility (the colors never reached the build; only the built-in `font-mono` survived). This is the Ladle↔Vite↔Tailwind seam RESEARCH flagged as the real risk.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `@source` registration so Tailwind v4 scans the design package**
- **Found during:** Task 2 (first `ladle build` verification)
- **Issue:** Ladle sets the Vite `root` to its own bundled app dir inside `node_modules`, so `@tailwindcss/vite`'s automatic content detection never scanned `packages/design/src`. The story's custom-token utilities (`bg-surface-1`, `font-display`, the freshness pills) were tree-shaken and the entire `@theme` color set was absent from the built CSS — only the built-in `font-mono` survived. The plan's Task 2 verify (`grep -l 'surface-1'` in the built CSS) failed.
- **Fix:** Added `packages/design/.ladle/tailwind.css` as the single Tailwind root — it `@import`s the generated `theme.css` (still the one token source, not hand-edited) and adds `@source "../src"`; the provider imports this entry. After the fix the built CSS resolves `bg-surface-1 → var(--color-surface-1) → #151a25` and emits all 12 freshness tokens.
- **Files modified:** packages/design/.ladle/tailwind.css (new), packages/design/.ladle/components.tsx
- **Verification:** `ladle build` exit 0; `grep` of the built CSS confirms the token-resolved utility rules + the freshness tokens.
- **Committed in:** `2019189` (Task 1 commit)

**2. [Rule 3 - Blocking] Added Ladle/Tailwind build deps to packages/design + dropped the `vite` runtime import**
- **Found during:** Task 1 (first `ladle build` — `ERR_MODULE_NOT_FOUND` for `vite` from the config)
- **Issue:** `vite.config.ts` originally imported `{ defineConfig } from "vite"`, but `vite` is only hoisted in the pnpm virtual store and is not resolvable from `packages/design`; `@tailwindcss/vite` was likewise not symlinked into the package.
- **Fix:** Switched `vite.config.ts` to a plain config object with a type-only `import type { UserConfig } from "vite"` (erased at runtime; keeps no direct `vite` dep per RESEARCH anti-pattern), and added `@ladle/react` / `@tailwindcss/vite` / `tailwindcss` as design `devDependencies` so the plugin resolves from the package. `pnpm install` re-linked them.
- **Files modified:** packages/design/vite.config.ts, packages/design/package.json, pnpm-lock.yaml
- **Verification:** `ladle build` loads the config and applies the plugin (exit 0).
- **Committed in:** `2019189` (Task 1 commit)

**3. [Rule 2 - Missing Critical] Ignore the regenerable Ladle build output**
- **Found during:** Post-task hygiene (`vp check` was linting `packages/design/build/`)
- **Issue:** `packages/*/build/` was not gitignored, so the generated Ladle bundle would have been committed and linted.
- **Fix:** Added `packages/*/build/` to `.gitignore`.
- **Files modified:** .gitignore
- **Verification:** `git check-ignore packages/design/build` confirms it is ignored; `git status` is clean of build artifacts.
- **Committed in:** `2019189` (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (2 blocking, 1 missing critical)
**Impact on plan:** All three were necessary to make `ladle build` resolve the tokens on the real stack — they fix the exact Ladle↔Vite↔Tailwind seam the plan/RESEARCH named as the risk. No new behavior, no scope creep. `pnpm-workspace.yaml` `allowBuilds` was deliberately left untouched (no flip needed).

## Issues Encountered
- The first two `ladle build` runs surfaced the seam issues above (vite resolution, then content-scan tree-shaking). Both were diagnosed by inspecting the built CSS (`font-mono` present but colors absent → Tailwind scanning the wrong root) and resolved as documented.

## User Setup Required
None - no external service configuration required. (Node 25.9.0 must be on PATH to run `ladle build`; this is the existing project pin, not new setup.)

## Next Phase Readiness
- The walking-skeleton design-system slice is complete end-to-end: DESIGN.md → generated @theme → Ladle renders it on the real Vite + Tailwind v4 stack, dark-only, with self-hosted Cyrillic type and the data-trust tokens visibly wired.
- Plan 01-05 (the remaining incomplete plan) can build on the working Ladle catalog. Future component phases graduate real components into `src/shared/uikit/<Component>/` and export them from `src/index.ts`; a consumer app importing `@solid-stats/design` will need its own `@source "../node_modules/@solid-stats/design"` (a Phase-2 concern, per RESEARCH Pattern 4).

## Self-Check: PASSED

- All 7 created files exist on disk.
- Both task commits (`2019189`, `c0c0efb`) exist in git history.

---
*Phase: 01-workspace-design-system-foundation*
*Completed: 2026-06-20*
