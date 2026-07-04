---
phase: 04-public-stats-overview-players-player-profile
plan: 01
subsystem: ui
tags: [react, ladle, vitest, public-stats, fixtures, i18n]

requires:
  - phase: 03-uikit-interactive-i18n-global-state-patterns
    provides: AppShell, AsyncBoundary, Lingui i18n harness, state matrix, freshness/provenance primitives
provides:
  - Canonical public-stats fixture graph for Overview, Players, and Player Profile
  - Phase 4 RU/EN public-stats string keys
  - Shared public-stats Ladle shell/state/trust harness
affects: [04-public-stats-overview-players-player-profile, 05-public-stats-squads]

tech-stack:
  added: []
  patterns:
    - Public-stats fixtures derive from shared roster/tier helpers
    - Surface harness composes existing UIKIT primitives without root barrel export

key-files:
  created:
    - packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts
    - packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts
    - packages/design/src/surfaces/public-stats/_fixtures/index.ts
    - packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx
    - packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.stories.tsx
    - packages/design/src/surfaces/public-stats/_harness/index.ts
  modified:
    - packages/design/src/shared/uikit/_fixtures/strings.ts

key-decisions:
  - "Public-stats player tiers are stored as pure tierFor results; UI-ready tier cells are produced by toTierCell."
  - "The public-stats harness remains internal to surfaces/public-stats and is not exported from packages/design/src/index.ts."

patterns-established:
  - "Canonical fixture graph: Overview, Players, and Profile share one derived player model."
  - "Surface harness: AppShell + AsyncBoundary + FreshnessPill + ProvenanceLine + StateMatrix compose reusable public-stats story states."

requirements-completed: [SURF-01, SURF-02, SURF-03, QUAL-01, QUAL-04, QUAL-05, QUAL-06]

coverage:
  - id: D1
    description: "Canonical public-stats fixture graph with Vasiliy rank, formula, tier, volume, and locale parity invariants"
    requirement: SURF-01
    verification:
      - kind: unit
        ref: "pnpm --filter @solid-stats/design test -- publicStats.test.ts"
        status: pass
    human_judgment: false
  - id: D2
    description: "Shared public-stats shell/state/trust harness rendered as Ladle stories"
    requirement: QUAL-01
    verification:
      - kind: automated_ui
        ref: "LADLE_E2E_PORT=61004 pnpm --filter @solid-stats/design test:e2e --grep public-stats"
        status: pass
    human_judgment: false

duration: 9min
completed: 2026-06-28
status: complete
---

# Phase 04 Plan 01: Shared Public Stats Foundation Summary

**Canonical public-stats fixtures, bilingual copy, and a shared Ladle harness for the Overview, Players, and Player Profile surfaces.**

## Performance

- **Duration:** 9min
- **Started:** 2026-06-28T03:40:24Z
- **Completed:** 2026-06-28T03:49:24Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Added a TDD fixture contract covering Vasiliy rank consistency, Score/K/D formula derivation, period-aware tier derivation, data-volume exports, compact row adapter output, and RU/EN key presence.
- Implemented `PUBLIC_STATS`, `PUBLIC_STATS_VOLUMES`, `PUBLIC_STATS_PERIODS`, `toPlayerCompactRow`, and `toTierCell` from the existing roster/tier helpers with no frozen hi-fi imports.
- Added a public-stats story harness that composes `AppShell`, `AsyncBoundary`, `FreshnessPill`, `ProvenanceLine`, and `StateMatrix` for success/loading/empty/error/offline/reconnecting/stale states.

## Task Commits

1. **Task 1: Canonical fixture and i18n invariant tests** - `6aaeaaf` (test)
2. **Task 2: Shared public-stats fixture graph and strings** - `12d1768` (feat)
3. **Task 3: Shared public-stats surface harness story** - `b6bdf71` (feat)

## Files Created/Modified

- `packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts` - Canonical Phase 4 fixture graph and adapters.
- `packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts` - Public-stats fixture invariant tests.
- `packages/design/src/surfaces/public-stats/_fixtures/index.ts` - Internal fixture barrel.
- `packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx` - Shared story shell/state/trust harness.
- `packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.stories.tsx` - Ladle stories for the shared harness.
- `packages/design/src/surfaces/public-stats/_harness/index.ts` - Internal harness barrel.
- `packages/design/src/shared/uikit/_fixtures/strings.ts` - Phase 4 public-stats RU/EN copy keys.

## Decisions Made

- Public-stats player `tiers` store the pure `tierFor` result. `toTierCell` is the UI adapter that adds metric/value metadata for table and compact-row consumers.
- The harness is internal to `packages/design/src/surfaces/public-stats/_harness`; `packages/design/src/index.ts` remains UIKIT-focused.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Kept domain tiers pure instead of storing UI tier cells**
- **Found during:** Task 2
- **Issue:** The first GREEN implementation stored `toTierCell` output in `player.tiers`, which mixed domain tier data with UI cell metadata and failed the D-04 invariant.
- **Fix:** Changed `player.tiers` to store the pure `tierFor` result and kept UI metadata in `toTierCell`.
- **Files modified:** `packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts`
- **Verification:** `pnpm --filter @solid-stats/design test -- publicStats.test.ts`
- **Committed in:** `12d1768`

**Total deviations:** 1 auto-fixed (Rule 1)
**Impact on plan:** The fix preserved the intended fixture contract and did not expand scope.

## Issues Encountered

- The first sandboxed Playwright run failed before tests because Ladle preview could not read network interfaces (`uv_interface_addresses`). Re-running with escalation was required.
- The first escalated Playwright run reused a stale Ladle preview server on the default port and reported "Story not found" despite the fresh `build/meta.json`. Re-running on an isolated `LADLE_E2E_PORT=61004` started a fresh preview and passed.
- The local runtime warns that Node is `v24.x` while the repo expects Node `>=25 <26`. The targeted commands still passed.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None.

## Verification

- `pnpm --filter @solid-stats/design test -- publicStats.test.ts` - pass
- `pnpm --filter @solid-stats/design test` - pass
- `LADLE_E2E_PORT=61004 pnpm --filter @solid-stats/design test:e2e --grep "public-stats"` - pass
- `rg "\.design/hifi|hifi" packages/design/src/surfaces/public-stats packages/design/src/shared/uikit/_fixtures/strings.ts; test $? -eq 1` - pass
- `! rg "PublicStatsSurfaceHarness|PublicStatsStateMatrix|PublicStatsStoryFrame" packages/design/src/index.ts` - pass

## Next Phase Readiness

Plan 04-02 can build the Stats Overview story against `PUBLIC_STATS`, the internal public-stats fixture barrel, and the shared harness. Later Phase 4 surfaces can reuse the same state/trust shell without adding player-specific code to `shared/uikit`.

## Self-Check: PASSED

- Created files exist.
- Task commits exist: `6aaeaaf`, `12d1768`, `b6bdf71`.
- No tracked file deletions were introduced.

---
*Phase: 04-public-stats-overview-players-player-profile*
*Completed: 2026-06-28*
