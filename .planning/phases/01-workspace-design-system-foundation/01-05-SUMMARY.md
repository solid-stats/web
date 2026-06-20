---
phase: 01-workspace-design-system-foundation
plan: 05
subsystem: infra
tags: [toolchain, vite-plus, oxlint, oxfmt, tsgo, ci-gate, design-system, freeze]

# Dependency graph
requires:
  - phase: 01-02
    provides: "the resolved vp check toolchain (TOOLCHAIN.md) + the placeholder root check script"
  - phase: 01-03
    provides: "DESIGN.md token SoT lint-clean + gen-theme.mjs / theme.css pipeline"
  - phase: 01-04
    provides: "packages/design + packages/app workspace source the gate type-checks"
provides:
  - "Root pnpm check gate: gen-theme -> theme.css drift assertion -> design.md lint -> vp check (run-then-check)"
  - "Project-scoped vp check (vp check packages scripts) excluding vendored/generated/docs trees"
  - ".oxlintrc.json + .prettierignore scoping config for the workspace toolchain"
  - "Frozen .design/ reference archive with a canonical-SoT README pointer (D-11)"
affects: [gsd-verify-work, phase-02-uikit, ci, design-review]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "run-then-check CI ordering (regen -> drift-assert -> SoT lint -> code gate)"
    - "explicit-path scoping of vp check (packages scripts) as the deterministic project-source boundary"
    - "design.md lint gated on exit 0 / zero error-severity, not finding count (86 warnings allowed)"

key-files:
  created:
    - .oxlintrc.json
    - .prettierignore
    - .design/README.md
  modified:
    - package.json
    - scripts/gen-theme.mjs

key-decisions:
  - "Scope vp check via explicit paths `vp check packages scripts` (deterministic) + .oxlintrc.json ignorePatterns + .prettierignore — oxlint config-only ignore proved unreliable for root-walk, explicit paths are authoritative."
  - "theme.css excluded from both fmt and lint (generated build output, never hand-edited); drift is caught instead by `git diff --exit-code` inside the gate."
  - "design.md lint kept on plain `design.md lint DESIGN.md` (exit-0 gate); no --max-warnings, no zero-findings grep — the 86 warnings incl. 7 false-positive -weak contrast are expected (Pitfall 1)."
  - ".design/ frozen IN PLACE (README pointer), not moved/archived — per plan Task 2 + MIGRATION.md step 5; CLAUDE.md + MIGRATION.md stay live."

patterns-established:
  - "Toolchain ignore config: .prettierignore (oxfmt default) + .oxlintrc.json ignorePatterns mirror shared-ts-standards §C (.agents/, .planning/, dist/, coverage/, node_modules/) + .design/ + generated theme.css."
  - "WS-05 green gate = pnpm check exits 0 across the workspace."

requirements-completed: [WS-05]

# Metrics
duration: ~12min
completed: 2026-06-20
status: complete
---

# Phase 1 Plan 05: WS-05 Green Gate + `.design/` Freeze Summary

**Root `pnpm check` now runs gen-theme → theme.css drift assertion → `design.md lint` → project-scoped `vp check` and exits 0 across the workspace; `.design/` is frozen to a reference archive with a canonical-SoT README, CLAUDE.md + MIGRATION.md kept live.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-06-20T17:11:00Z
- **Completed:** 2026-06-20T17:23:00Z
- **Tasks:** 2
- **Files modified:** 5 (3 created, 2 modified)

## Accomplishments
- Wired the resolved WS-05 toolchain gate into the root `check` script in run-then-check order: `pnpm gen-theme && git diff --exit-code packages/design/src/styles/theme.css && pnpm lint:design && vp check packages scripts`.
- Scoped `vp check` to project source so it no longer lints the vendored `.agents/skills/**` (the TOOLCHAIN.md plan-05 TODO): explicit paths `packages scripts` + `.oxlintrc.json` `ignorePatterns` + `.prettierignore`. Scan dropped from 255 files to the project's 14/8.
- Fixed the one real project-source finding (`scripts/gen-theme.mjs` formatting via oxfmt) — green, not waived; regeneration leaves `theme.css` drift-free.
- Proved `pnpm check` exits 0 on a clean tree — WS-05 satisfied under the `vp check` path.
- Froze `.design/` (D-11): added `.design/README.md` marking it a reference archive whose canonical SoT is `/DESIGN.md`; `CLAUDE.md` + `MIGRATION.md` stay live and untouched; nothing ported into `packages/`.

## Task Commits

1. **Task 1: Wire + prove the WS-05 green gate (run-then-check)** — `33ddd43` (feat)
2. **Task 2: Freeze .design/ (D-11)** — `9194eed` (docs)

## Files Created/Modified
- `package.json` — finalized the root `check` script (run-then-check ordering with the drift assertion + project-scoped `vp check`).
- `scripts/gen-theme.mjs` — oxfmt formatting fix (method-chain wrap; no logic change).
- `.oxlintrc.json` (created) — oxlint `ignorePatterns` excluding `node_modules/`, `dist/`, `coverage/`, `packages/*/build/`, `.agents/`, `.claude/`, `.planning/`, `.design/`, and the generated `theme.css`.
- `.prettierignore` (created) — oxfmt default ignore (per shared-ts-standards §C) covering the same non-project trees + generated `theme.css` + lockfile.
- `.design/README.md` (created) — frozen-archive pointer to `/DESIGN.md`; tabulates the reference-only trees; declares `CLAUDE.md` + `MIGRATION.md` live.

## What got scoped out of the gate
Vendored/generated/docs trees, so WS-05 reflects our code, not third-party content:
- `.agents/` (vendored skills — the original TODO), `.claude/`
- `.planning/` and `.design/` (docs/markdown + frozen reference, incl. the fake-stack `.design/hifi/*.jsx`)
- `node_modules/`, `dist/`, `coverage/`, `packages/*/build/`
- the generated `packages/design/src/styles/theme.css` (drift-checked via `git diff --exit-code` instead)

`vp check packages scripts` then sees exactly the project's TS/JS source (8 lint files) and formattable files (14), all green.

## What was archived in the freeze
Nothing was moved or deleted (per plan Task 2 acceptance criteria + MIGRATION.md step 5 — in-place freeze). `.design/README.md` was added to declare the existing trees frozen reference: `hifi/`, `wireframes/`, `_ds/`, `app/`, `screenshots/`, `uploads/`, `export/`, `support.js`. `CLAUDE.md` and `MIGRATION.md` remain live and authoritative; the dead `--container: 1240` survives only in this frozen tree.

## Decisions Made
- **Explicit-path scoping over config-only ignore.** oxlint's `ignorePatterns` (and even `-c`) did not reliably exclude `.design/` during the actual root-walk lint run (it honored them in `--debug=files` but still reported `.design/` warnings in the live run). `vp check packages scripts` is deterministic and is the authoritative scope; the `.oxlintrc.json` / `.prettierignore` provide defense-in-depth (and cover `theme.css` within the scoped paths).
- **`theme.css` excluded from format/lint, drift-checked instead.** It is generated, never hand-edited; the `git diff --exit-code` step inside the gate catches an un-regenerated `DESIGN.md` edit.
- **`design.md lint` left as the exit-0 gate.** 0 errors / 86 warnings / 2 info → exit 0; no `--max-warnings`, no zero-findings grep (Pitfall 1).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] oxfmt formatting finding in `scripts/gen-theme.mjs`**
- **Found during:** Task 1 (proving the gate green)
- **Issue:** `vp check` reported a real formatting finding on project source (`scripts/gen-theme.mjs`) — a method chain oxfmt wraps across lines. The plan mandates fixing real project-source findings (green, not waived).
- **Fix:** `vp fmt scripts/gen-theme.mjs` (formatting only). Verified `node scripts/gen-theme.mjs` still emits an identical `theme.css` (no drift) and the generator's output token counts are unchanged.
- **Files modified:** `scripts/gen-theme.mjs`
- **Verification:** `pnpm check` exits 0; `git diff --exit-code packages/design/src/styles/theme.css` clean after regen.
- **Committed in:** `33ddd43` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug/formatting).
**Impact on plan:** Necessary to satisfy WS-05's "green, not waived" requirement. No scope creep — the scoping of `vp check` was an explicit plan/TOOLCHAIN.md instruction, not a deviation.

## Issues Encountered
- **oxlint config-ignore vs. actual-run mismatch.** `.oxlintrc.json` `ignorePatterns` excluded `.design/` in `--debug=files` but the live `vp lint` run still emitted `.design/` warnings. Resolved by scoping `vp check` with explicit project paths (`packages scripts`), which is deterministic; kept the config patterns as defense-in-depth.

## Next Phase Readiness
- The phase gate is GREEN: `pnpm check` exits 0 across the workspace. Ready for `/gsd-verify-work`.
- The toolchain scope is established (`vp check packages scripts`); Phase 2 (UIKIT) adds source under `packages/design/src/shared/uikit/` which is already inside the gate's scope — no gate change needed.
- `.design/` is frozen reference; downstream design phases inherit domain truth from the live `.design/CLAUDE.md`.

## Self-Check: PASSED

- Created files exist: `.oxlintrc.json`, `.prettierignore`, `.design/README.md`, `01-05-SUMMARY.md`.
- Modified files exist: `package.json`, `scripts/gen-theme.mjs`.
- Commits exist: `33ddd43` (Task 1), `9194eed` (Task 2).
- Gate proven: `pnpm check` exits 0 on a clean tree.

---
*Phase: 01-workspace-design-system-foundation*
*Completed: 2026-06-20*
