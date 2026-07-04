---
phase: 04-public-stats-overview-players-player-profile
plan: 02
subsystem: design
tags: [react, ladle, playwright, public-stats, overview]
dependency_graph:
  requires: [04-01]
  provides:
    - StatsOverview public-stats surface
    - Stats Overview Ladle story matrix
    - Stats Overview Playwright contract
  affects: [04-03, 04-04, 04-05]
tech_stack:
  added: []
  patterns:
    - fixture-driven public-stats surface composition
    - targeted Ladle story verification for no-overflow, CLS, and keyboard targets
key_files:
  created:
    - packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.tsx
    - packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.stories.tsx
    - packages/design/src/surfaces/public-stats/StatsOverview/index.ts
    - packages/design/tests/public-stats-overview.spec.ts
  modified: []
key_decisions:
  - Stats Overview entry affordances use known internal Ladle story hrefs until v1.0 routes exist.
  - Stats Overview keeps user-facing copy behind the existing Lingui/i18n harness; the story title uses slug wording only.
requirements_completed: [SURF-01, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06]
metrics:
  started: 2026-06-28T03:55:28Z
  completed: 2026-06-28T04:10:24Z
  duration: 15m
  tasks: 2
  files_changed: 4
status: complete
---

# Phase 04 Plan 02: Stats Overview Summary

Stats Overview now has a fixture-driven Ladle surface with overview metrics, leaderboard context, public entry affordances, responsive variants, and targeted Playwright coverage.

## Accomplishments

- Added the TDD RED contract for the Overview journey, covering Vasiliy, five public entry affordances, no horizontal overflow from 360px to 3440px, CLS-safe loading geometry, and 44px keyboard-focusable entry targets.
- Implemented `StatsOverview` under `surfaces/public-stats`, composed with the plan 04-01 harness, shared fixture graph, `StatTile`, `MiniStatGrid`, `AutoTable`, compact rows, sparkline, freshness, and provenance primitives.
- Added Ladle stories for `Success`, `ScenarioEndings`, `DataVolumes`, `Responsive`, and `Cls`.
- Kept public-facing copy routed through the existing i18n fixture/harness pattern and used internal story hrefs for entry affordances.

## Task Commits

| Task | Name | Commit | Files |
| --- | --- | --- | --- |
| 1 | Add failing Overview journey and layout tests | 0768ae1 | `packages/design/tests/public-stats-overview.spec.ts` |
| 2 | Implement the Stats Overview surface and stories | 1645421 | `packages/design/src/surfaces/public-stats/StatsOverview/*`, `packages/design/tests/public-stats-overview.spec.ts` |

## Verification

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm exec vp check --fix packages/design/src/surfaces/public-stats/StatsOverview packages/design/tests/public-stats-overview.spec.ts` | Passed | Formatting, lint, and type checks passed for the 04-02 files. |
| `pnpm --filter @solid-stats/design test` | Passed | 12 files, 255 tests. |
| `LADLE_E2E_PORT=61010 pnpm --filter @solid-stats/design test:e2e --grep "Stats Overview"` | Passed | 12 targeted Overview tests. |
| `LADLE_E2E_PORT=61011 pnpm --filter @solid-stats/design test:e2e` | Passed | 410 Playwright tests. |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Scoped duplicate-sensitive Playwright locators**
- **Found during:** Task 2
- **Issue:** The initial RED test used broad text/link locators. After the real Overview surface rendered both desktop and compact sections, hidden duplicate labels could make the assertions ambiguous.
- **Fix:** Scoped Vasiliy to `[data-overview-leaders] [data-name-anchor]:visible` and entry links to `[data-overview-entries]`.
- **Files modified:** `packages/design/tests/public-stats-overview.spec.ts`
- **Commit:** 1645421

**2. [Rule 3 - Blocking] Isolated Ladle e2e ports**
- **Found during:** Task 1 and Task 2 verification
- **Issue:** A stale default Ladle preview could return missing story content while the built stories were correct.
- **Fix:** Ran targeted and full Playwright verification with isolated `LADLE_E2E_PORT` values.
- **Files modified:** None
- **Commit:** N/A

## Issues Encountered

- `pnpm check` was not used as the final gate because it fails on out-of-scope formatting in 04-01 files: `packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts` and `packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx`. The scoped 04-02 formatter/lint/type gate passed.
- Local tooling prints an engine warning because the environment uses Node `v24.14.0` while the package expects `>=25 <26`.

## Known Stubs

None. Entry affordances intentionally point to known internal Ladle story hrefs for the design milestone and do not claim production route wiring.

## Threat Flags

None. This plan adds design-surface stories and tests only; it introduces no network endpoint, auth path, file access pattern, or trust-boundary schema change.

## Next Phase Readiness

Plans 04-03 through 04-05 can reuse the Overview story/test structure for story-scoped responsive, CLS, and affordance checks.

## Self-Check: PASSED

- Created files exist.
- Task commits `0768ae1` and `1645421` exist in git history.
