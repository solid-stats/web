---
phase: 04-public-stats-overview-players-player-profile
plan: 03
subsystem: design
tags: [react, ladle, playwright, public-stats, players-list]
dependency_graph:
  requires: [04-01, 04-02]
  provides:
    - PlayersList public-stats surface
    - Players list Ladle story matrix
    - Players list Playwright contract
  affects: [04-04, 04-05]
tech_stack:
  added: []
  patterns:
    - fixture-driven public-stats players surface composition
    - visual-only desktop table spacer hooks through AutoTable
    - mobile CompactList top-N story contract
key_files:
  created:
    - packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx
    - packages/design/src/surfaces/public-stats/PlayersList/PlayersList.stories.tsx
    - packages/design/src/surfaces/public-stats/PlayersList/index.ts
    - packages/design/tests/public-stats-players-list.spec.ts
  modified:
    - packages/design/src/shared/uikit/Table/AutoTable.tsx
key_decisions:
  - Players list remains a v0.1 Ladle surface: story-controlled visual controls only, no route/search-param/data engine.
  - AutoTable now forwards optional spacer geometry to Table so surfaces can expose the existing visual virtualization hooks without adding TanStack Table/Virtual.
requirements_completed: [SURF-02, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06]
coverage:
  - id: D1
    description: "Players list Playwright contract covers controls, loading model, mobile top-N/no-scroll, desktop spacer hooks, and CLS geometry"
    requirement: SURF-02
    verification:
      - kind: automated_ui
        ref: "LADLE_E2E_PORT=61016 pnpm --filter @solid-stats/design test:e2e --grep \"Players list\""
        status: pass
    human_judgment: false
  - id: D2
    description: "PlayersList surface and Ladle stories render from PUBLIC_STATS with no v1.0 routing/table/data engines"
    requirement: SURF-02
    verification:
      - kind: automated_ui
        ref: "LADLE_E2E_PORT=61017 pnpm --filter @solid-stats/design test:e2e"
        status: pass
      - kind: unit
        ref: "pnpm --filter @solid-stats/design test"
        status: pass
      - kind: other
        ref: "rg '@tanstack/react-table|@tanstack/react-virtual|createFileRoute|fetch\\(' packages/design/src/surfaces/public-stats/PlayersList"
        status: pass
    human_judgment: false
metrics:
  started: 2026-06-28T04:00:30Z
  completed: 2026-06-28T04:24:46Z
  duration: 24m
  tasks: 2
  files_changed: 5
status: complete
---

# Phase 04 Plan 03: Players List Summary

Players list now has a fixture-driven Ladle surface with search/filter controls, period loading states, tiered Score/K/D rows, mobile top-N behavior, desktop table spacer hooks, and targeted Playwright coverage.

## Accomplishments

- Added the TDD RED contract for the Players list journey, covering search, filters, period selector, Vasiliy, tier cues, loading model branches, mobile no-scroll CompactList, desktop AutoTable spacers, and CLS geometry.
- Implemented `PlayersList` under `surfaces/public-stats`, composed with the plan 04-01 harness, shared fixture graph, `Field`, `Input`, `Select`, `Button`, `CompactList`, `AutoTable`, and `TableRow`.
- Added Ladle stories for `Success`, `LoadingModel`, `ScenarioEndings`, `DataVolumes`, `Responsive`, and `Cls`.
- Preserved the D-06 boundary: no TanStack Table/Virtual, no route/search-param wiring, no real fetch/data engine.

## Task Commits

| Task | Name | Commit | Files |
| --- | --- | --- | --- |
| 1 | Add failing Players list journey, loading, and no-scroll tests | 73d4b97 | `packages/design/tests/public-stats-players-list.spec.ts` |
| 2 | Implement Players list component and stories | 1b56945 | `packages/design/src/surfaces/public-stats/PlayersList/*`, `packages/design/src/shared/uikit/Table/AutoTable.tsx`, `packages/design/tests/public-stats-players-list.spec.ts` |

## Verification

| Command | Result | Notes |
| --- | --- | --- |
| `LADLE_E2E_PORT=61012 pnpm --filter @solid-stats/design test:e2e --grep "Players list"` | Failed as expected | RED phase: 16 tests failed because PlayersList stories did not exist yet. |
| `pnpm exec vp check --fix packages/design/src/surfaces/public-stats/PlayersList packages/design/src/shared/uikit/Table/AutoTable.tsx packages/design/tests/public-stats-players-list.spec.ts` | Passed | Scoped formatting, lint, and type checks passed. |
| `LADLE_E2E_PORT=61016 pnpm --filter @solid-stats/design test:e2e --grep "Players list"` | Passed | 16 targeted Players list tests. |
| `pnpm --filter @solid-stats/design test` | Passed | 12 files, 255 tests. |
| `LADLE_E2E_PORT=61017 pnpm --filter @solid-stats/design test:e2e` | Passed | 444 Playwright tests. |
| `rg '@tanstack/react-table\|@tanstack/react-virtual\|createFileRoute\|fetch\\(' packages/design/src/surfaces/public-stats/PlayersList` | Passed | No matches. |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] Forwarded AutoTable spacer geometry**
- **Found during:** Task 2
- **Issue:** The plan required desktop Players list stories to expose the existing visual virtualization spacer hooks through `AutoTable`, but `AutoTable` did not forward `topSpacer`/`bottomSpacer` to `Table`.
- **Fix:** Added optional `topSpacer` and `bottomSpacer` props to `AutoTable` and passed them through to both density branches.
- **Files modified:** `packages/design/src/shared/uikit/Table/AutoTable.tsx`
- **Verification:** `LADLE_E2E_PORT=61016 pnpm --filter @solid-stats/design test:e2e --grep "Players list"`
- **Committed in:** `1b56945`

**2. [Rule 1 - Bug] Prevented literal `{n}` count labels in Players list**
- **Found during:** Task 2
- **Issue:** The direct story-level `i18n._` path rendered simple `{n}` placeholders literally for Players list count labels.
- **Fix:** Added a local `withCount` formatter for Players list captions and show-more labels.
- **Files modified:** `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx`
- **Verification:** `LADLE_E2E_PORT=61016 pnpm --filter @solid-stats/design test:e2e --grep "Players list"`
- **Committed in:** `1b56945`

**Total deviations:** 2 auto-fixed (1 Rule 2, 1 Rule 1)
**Impact on plan:** Both fixes were required to satisfy the declared Players list contract. No v1.0 behavior was added.

## Issues Encountered

- The sandboxed Playwright RED run failed before webServer startup; rerunning with escalation was required for Ladle local preview, matching earlier Phase 4 behavior.
- Local tooling prints an engine warning because the environment uses Node `v24.14.0` while the package expects Node `>=25 <26`. The scoped checks, Vitest suite, targeted e2e, and full e2e all passed.
- Some RED selectors needed alignment with Ark Select semantics and visible density branches during GREEN. The final Playwright contract asserts the rendered public behavior, not component internals.

## Known Stubs

None. Search/filter controls are intentionally story-controlled visual controls for v0.1; route search params, server filtering/sorting/pagination, and cache-backed Back restoration remain deferred to v1.0 by D-06.

## Threat Flags

None. This plan adds design-surface stories, tests, and a presentational AutoTable prop pass-through only; it introduces no network endpoint, auth path, file access pattern, or trust-boundary schema change.

## Next Phase Readiness

Plan 04-04 can build Player Profile against the same fixture graph, public-stats harness, table/compact-row patterns, and Players active-nav state. Plan 04-05 can use the new Players list story/test hooks for cross-surface consistency checks.

## Self-Check: PASSED

- Created files exist.
- Task commits `73d4b97` and `1b56945` exist in git history.
- No tracked file deletions were introduced.

---
*Phase: 04-public-stats-overview-players-player-profile*
*Completed: 2026-06-28*
