---
phase: 01-workspace-design-system-foundation
plan: 01
subsystem: infra
tags: [pnpm-workspace, tailwind-v4, ladle, tsconfig, node25, monorepo, design-system]

# Dependency graph
requires: []
provides:
  - "pnpm workspace root (@solid-stats/web, private) resolving packages/design + packages/app on pnpm 11 + Node 25"
  - "@solid-stats/design package shell with exports map (./theme.css + . UIKIT entry), react/react-dom 19"
  - "@solid-stats/app skeleton depending on @solid-stats/design via workspace:* (D-04)"
  - "Strict tsconfig.base.json (exactOptionalPropertyTypes, noUncheckedIndexedAccess, bundler resolution) extended by both packages"
  - "Committed pnpm-lock.yaml pinning the supply chain (T-1-01)"
  - "Node 25 / pnpm 11 pins (.nvmrc, .node-version, engines, packageManager)"
affects:
  - "01-02 (gen-theme OUT_PATH relocation into packages/design/src/styles/theme.css)"
  - "01-03/01-04 (Ladle + Tailwind v4 wiring in packages/design)"
  - "01-05 (vp check toolchain gate appended to root check script)"
  - "all later phases importing @solid-stats/design"

# Tech tracking
tech-stack:
  added:
    - "@google/design.md@0.3.0 (DESIGN.md lint gate)"
    - "@ladle/react@5.1.1 (component catalog, bundles Vite 6)"
    - "tailwindcss@4.3.1 + @tailwindcss/vite@4.3.1 (Tailwind v4 @theme)"
    - "react@19 + react-dom@19 (Ladle peer, design package)"
  patterns:
    - "Root-once toolchain (D-02): tsconfig.base.json + per-package extends; DESIGN.md + scripts/ at root"
    - "Workspace seam via exports map + workspace:* (D-05)"
    - "Exact-version dev-dep pinning (no caret) + committed lockfile (T-1-01)"
    - "Transitive build scripts off by default (allowBuilds=false, T-1-02 accept)"

key-files:
  created:
    - package.json
    - pnpm-workspace.yaml
    - tsconfig.base.json
    - .nvmrc
    - .node-version
    - packages/design/package.json
    - packages/design/tsconfig.json
    - packages/app/package.json
    - packages/app/tsconfig.json
    - packages/app/src/index.ts
    - pnpm-lock.yaml
  modified: []

key-decisions:
  - "tsconfig.base.json uses moduleResolution: bundler + verbatimModuleSyntax + DOM lib (web-frontend override of the ts-standards NodeNext default) for the Vite/Ladle stack"
  - "react/react-dom pinned at 19.2.0 (Ladle peer >=18; React 19 current per RESEARCH A3)"
  - "Transitive build scripts (@swc/core, esbuild, msw) set allowBuilds=false in pnpm-workspace.yaml — required for plain `pnpm install` to exit 0 on pnpm 11.6 (T-1-02 accept posture)"

patterns-established:
  - "Per-package tsconfig extends ../../tsconfig.base.json so strictness never drifts (D-02)"
  - "packages/app is skeleton-only: one workspace dep, empty src/index.ts, no build (D-04)"

requirements-completed: [WS-01, WS-02]

# Metrics
duration: 4min
completed: 2026-06-20
status: complete
---

# Phase 1 Plan 01: Workspace Foundation Summary

**pnpm workspace base resolving @solid-stats/design + @solid-stats/app on pnpm 11 + Node 25, with a strict bundler tsconfig.base, exact-pinned Tailwind-v4/Ladle/design.md dev-deps, and a committed lockfile.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-06-20T16:34:53+07:00
- **Completed:** 2026-06-20T16:38:54+07:00
- **Tasks:** 3 (Task 2 was a pre-resolved blocking checkpoint)
- **Files modified:** 11 created

## Accomplishments
- Root private `@solid-stats/web` workspace with pnpm@11.6.0 + Node `>=25 <26` pins, four exact-pinned dev-deps, and root scripts (`gen-theme`, `lint:design`, `check` — no `vp check` tail, appended by plan 05).
- `@solid-stats/design` package shell with the exports map exposing both `./theme.css` and the `.` UIKIT entry (D-05), react/react-dom 19, and Ladle scripts — no direct `vite` (Ladle owns bundled Vite 6).
- `@solid-stats/app` skeleton resolving the workspace via `@solid-stats/design: workspace:*` only (D-04), with an empty `src/index.ts` and a base-extending tsconfig.
- `pnpm install` exits 0 on Node 25; `pnpm-lock.yaml` generated and committed (T-1-01).

## Task Commits

1. **Task 1: Root workspace config + Node/pnpm pins** — `2b1ca0f` (feat)
2. **Task 2: Activate Node 25 + confirm dev-dep supply chain** — pre-resolved blocking checkpoint (Node 25.9.0 active via nvm; the four dev-deps confirmed legitimate per RESEARCH § Package Legitimacy Audit). No commit — verification gate.
3. **Task 3: Package skeletons + install** — `83bd02e` (feat)

## Files Created/Modified
- `package.json` — private workspace root: pnpm@11.6.0, engines node>=25, four exact-pinned dev-deps, root scripts.
- `pnpm-workspace.yaml` — `packages/*` glob + `allowBuilds` (all false, T-1-02).
- `tsconfig.base.json` — strict baseline (exactOptionalPropertyTypes, noUncheckedIndexedAccess), bundler resolution, verbatimModuleSyntax, DOM lib.
- `.nvmrc` / `.node-version` — `25`.
- `packages/design/package.json` — `@solid-stats/design`, exports map (both keys), react/react-dom 19, ladle scripts.
- `packages/design/tsconfig.json` — extends base, jsx react-jsx.
- `packages/app/package.json` — `@solid-stats/app`, workspace:* dep on design.
- `packages/app/tsconfig.json` — extends base.
- `packages/app/src/index.ts` — `export {};` (valid empty module).
- `pnpm-lock.yaml` — generated, supply-chain pin.

## Decisions Made
- `tsconfig.base.json` overrides the ts-standards NodeNext default with `moduleResolution: bundler` + `verbatimModuleSyntax` + DOM lib, matching the Vite/Ladle web-frontend stack (shared-ts-standards §C web override).
- `react`/`react-dom` pinned at `19.2.0` (Ladle peer is only `>=18`; React 19 is current — RESEARCH A3).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] pnpm 11.6 `ERR_PNPM_IGNORED_BUILDS` made plain `pnpm install` exit 1**
- **Found during:** Task 3 (install)
- **Issue:** Three transitive deps (`@swc/core`, `esbuild`, `msw`) carry build scripts. pnpm 11.6 blocks them by default and exits 1 until the decision is explicitly recorded — failing the acceptance criterion "`pnpm install` exits 0". The `pnpm` field in `package.json` is no longer read by pnpm 11.6 (settings moved to `pnpm-workspace.yaml`); the field is `allowBuilds` (name→bool map).
- **Fix:** Set `allowBuilds: { "@swc/core": false, esbuild: false, msw: false }` in `pnpm-workspace.yaml` — none of these need their native build for the Phase 1 skeleton (no Ladle/native build runs here; T-1-02 accept). Plain `pnpm install` now exits 0.
- **Files modified:** `pnpm-workspace.yaml`
- **Verification:** `pnpm install >/dev/null 2>&1; echo $?` → `0`.
- **Committed in:** `83bd02e` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary for the install-exit-0 acceptance criterion. Conservative posture (builds off) — no scope creep; re-audit/flip per-tool when a phase needs the artifact.

## Issues Encountered
- Diagnosing the pnpm 11.6 build-script gate took several iterations: an empty `onlyBuiltDependencies` / a `pnpm` field in `package.json` are both ignored by pnpm 11.6 (it warns "the pnpm field is no longer read"). The working schema is the `allowBuilds` map in `pnpm-workspace.yaml` with explicit booleans. Resolved deterministically — plain and `--frozen-lockfile` installs now exit 0.

## User Setup Required
None for downstream execution — Node 25 was activated this session (nvm 25.9.0). Note: the machine's default `node` on PATH is v24; interactive shells pick Node 25 via the committed `.nvmrc` / `.node-version` (`nvm use`). CI must run on Node 25.

## Next Phase Readiness
- Workspace resolves; `@solid-stats/design` is linked into the app (`node_modules/@solid-stats/design` symlink) and importable.
- `packages/design/src/styles/theme.css` is intentionally absent — plan 01-02 relocates it via the `gen-theme.mjs` `OUT_PATH` change (D-09); the exports map already points at the future path.
- Ready for 01-02 (gen-theme relocation + data-trust token emit) and the Ladle/Tailwind wiring plans.

## Self-Check: PASSED

All 11 created files present on disk; both task commits (`2b1ca0f`, `83bd02e`) exist in history.

---
*Phase: 01-workspace-design-system-foundation*
*Completed: 2026-06-20*
