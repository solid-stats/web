---
phase: 04-public-stats-overview-players-player-profile
plan: 05
subsystem: design
tags: [react, ladle, playwright, public-stats, design-review]
dependency_graph:
  requires: [04-01, 04-02, 04-03, 04-04]
  provides:
    - Cross-surface public-stats consistency gate
    - Internal public-stats surface barrel
    - Rejected design-review remediation for the public-stats trio
    - Nyquist validation map for Phase 04
  affects: [04, 05, 06, 07]
tech_stack:
  added: []
  patterns:
    - fixture-driven cross-surface rendered assertions
    - public-stats density and spacer regression gates
    - RU/EN fallback-copy regression gates
key_files:
  created:
    - packages/design/src/surfaces/public-stats/index.ts
    - packages/design/tests/public-stats-cross-surface.spec.ts
    - .planning/phases/04-public-stats-overview-players-player-profile/04-05-SUMMARY.md
  modified:
    - .planning/phases/04-public-stats-overview-players-player-profile/04-VALIDATION.md
    - packages/design/src/shared/uikit/_fixtures/strings.ts
    - packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.tsx
    - packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx
    - packages/design/src/surfaces/public-stats/PlayersList/PlayersList.stories.tsx
    - packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx
    - packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts
    - packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx
    - packages/design/tests/public-stats-player-profile.spec.ts
    - packages/design/tests/public-stats-players-list.spec.ts
key_decisions:
  - The rejected checkpoint was treated as a concrete issue list from `04-UI-REVIEW.md`, not as approval.
  - Public-stats surfaces stay under `surfaces/public-stats`; only an internal public-stats barrel was added, and the package root barrel remains unchanged.
  - Density, spacer, and RU fallback classes are covered by targeted Playwright assertions instead of relying only on visual review.
patterns_established:
  - Cross-surface gates compare rendered fixture truths across Overview, Players, and Profile.
  - Players list spacer rows are opt-in for high-volume stories, never default success-state filler.
  - Profile-local trust metadata is merged into identity to avoid duplicated slab strips.
requirements_completed: [SURF-01, SURF-02, SURF-03, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06]
coverage:
  - id: D1
    description: "Cross-surface public-stats Playwright gate verifies Vasiliy rank, Score, K/D, tier, squad, freshness, provenance, locale variants, and mobile/ultrawide overflow smoke"
    requirement: QUAL-06
    verification:
      - kind: automated_ui
        ref: "LADLE_E2E_PORT=61014 pnpm --dir packages/design exec playwright test tests/public-stats-cross-surface.spec.ts tests/public-stats-players-list.spec.ts tests/public-stats-player-profile.spec.ts tests/public-stats-overview.spec.ts --project=chromium --workers=1 --reporter=list"
        status: pass
      - kind: other
        ref: "pnpm check"
        status: pass
    human_judgment: false
  - id: D2
    description: "Internal public-stats barrel exports Overview, Players list, and Player Profile surface components and prop types without expanding the package root barrel"
    requirement: SURF-01
    verification:
      - kind: other
        ref: "pnpm exec vp check --fix packages/design/src/surfaces/public-stats packages/design/src/shared/uikit/_fixtures/strings.ts packages/design/tests/public-stats-cross-surface.spec.ts packages/design/tests/public-stats-players-list.spec.ts packages/design/tests/public-stats-player-profile.spec.ts"
        status: pass
    human_judgment: false
  - id: D3
    description: "Rejected design-review BLOCK findings were remediated across Overview hierarchy, Players density/spacers/RU labels, and Profile trust/identity hierarchy"
    requirement: QUAL-02
    verification:
      - kind: automated_ui
        ref: "packages/design/tests/public-stats-cross-surface.spec.ts#density, spacer, and RU fallback gates"
        status: pass
      - kind: automated_ui
        ref: "packages/design/tests/public-stats-players-list.spec.ts#default success spacers"
        status: pass
    human_judgment: true
    rationale: "The concrete rejected-checkpoint issues are automated where feasible, but final visual judgement of the remediated trio still belongs to human design review."
metrics:
  started: 2026-06-28T04:51:11Z
  completed: 2026-06-28T08:59:36Z
  duration: 4h 08m
  tasks: 3
  files_changed: 13
status: complete
---

# Phase 04 Plan 05: Public Stats Cross-Surface Summary

The public-stats trio now has a cross-surface consistency gate, a local surface barrel, a concrete validation map, and remediation for the rejected design-review blockers.

## Performance

- **Duration:** 4h 08m, including checkpoint rejection and continuation.
- **Started:** 2026-06-28T04:51:11Z
- **Completed:** 2026-06-28T08:59:36Z
- **Tasks:** 3
- **Files modified:** 13

## Accomplishments

- Added the TDD cross-surface Playwright gate for shared fixture truth, locale rendering, story catalog presence, and mobile/ultrawide overflow smoke.
- Added the internal `surfaces/public-stats` barrel and completed the Phase 04 validation map with requirement and task coverage.
- Remediated the rejected design checkpoint from `04-UI-REVIEW.md`: Overview leader density, Players default spacer slabs and RU labels, Profile duplicated trust slabs, and hierarchy/density failures.
- Added regression gates for empty spacer misuse, first-band density, single profile trust placement, and hardcoded English labels in RU Players stories.

## Task Commits

| Task | Name | Commit | Files |
| --- | --- | --- | --- |
| 1 | Add failing public stats cross-surface gate | e3d08fe | `packages/design/tests/public-stats-cross-surface.spec.ts` |
| 1 | Implement public stats cross-surface gate | efd9620 | `packages/design/tests/public-stats-cross-surface.spec.ts`, `packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.tsx` |
| 2 | Add public stats surface barrel | 5accca0 | `packages/design/src/surfaces/public-stats/index.ts`, `.planning/phases/04-public-stats-overview-players-player-profile/04-VALIDATION.md` |
| 3 | Add UI audit review issue list | 81b4499 | `.planning/phases/04-public-stats-overview-players-player-profile/04-UI-REVIEW.md` |
| 3 | Repair public stats design review blockers | 9cb7d76 | Public-stats trio surfaces, fixture strings, harness, validation map, and targeted Playwright specs |

## Verification

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm exec vp check --fix packages/design/src/surfaces/public-stats packages/design/src/shared/uikit/_fixtures/strings.ts packages/design/tests/public-stats-cross-surface.spec.ts packages/design/tests/public-stats-players-list.spec.ts packages/design/tests/public-stats-player-profile.spec.ts` | Passed | Scoped format, lint, and type gate for the remediated files. |
| `pnpm check` | Passed | Full repository check. The design-doc lint command emitted existing warnings but completed with `errors: 0`. |
| `LADLE_E2E_PORT=61014 pnpm --dir packages/design exec playwright test tests/public-stats-cross-surface.spec.ts tests/public-stats-players-list.spec.ts tests/public-stats-player-profile.spec.ts tests/public-stats-overview.spec.ts --project=chromium --workers=1 --reporter=list` | Passed | 49 targeted public-stats Chromium checks. |

## Files Created/Modified

- `packages/design/src/surfaces/public-stats/index.ts` - Internal public-stats barrel for the three surface components and prop types.
- `packages/design/tests/public-stats-cross-surface.spec.ts` - Cross-surface consistency, overflow, locale, density, spacer, and RU fallback gates.
- `packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.tsx` - Rebalanced first desktop band, restored visible trend summary, and fixed Sparkline baseline data flow.
- `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx` - Removed default success spacers, localized controls/status copy, and replaced arbitrary layout grid tracks.
- `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.stories.tsx` - Passed locale and volume controls through story variants for gate coverage.
- `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx` - Merged trust metadata into identity, removed duplicated trust slab, and tightened profile hierarchy.
- `packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx` - Added opt-out for shared header trust and compacted the header trust row.
- `packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts` - Added fixture guard cleanup required by the scoped type gate.
- `packages/design/src/shared/uikit/_fixtures/strings.ts` - Added RU/EN strings for public-stats search, tier, period status, bounty, and trend copy.
- `packages/design/tests/public-stats-players-list.spec.ts` - Added default success spacer and density assertions.
- `packages/design/tests/public-stats-player-profile.spec.ts` - Updated bounty copy expectation after replacing the generic tooltip copy.
- `.planning/phases/04-public-stats-overview-players-player-profile/04-VALIDATION.md` - Recorded rejected-checkpoint remediation and latest gate evidence.

## Decisions Made

- The rejected checkpoint was not approved retroactively. `04-UI-REVIEW.md` became the concrete gap-closure issue list for continuation.
- The final visual judgement remains human-owned, but the failure classes called out in the audit now have automated coverage where feasible.
- The public-stats surfaces continue to use fixture-driven Ladle design code only; no app route, API client, fetch, database, auth, or storage boundary was added.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Remediated rejected public-stats visual hierarchy and density failures**
- **Found during:** Task 3 continuation after rejected human checkpoint.
- **Issue:** `04-UI-REVIEW.md` found BLOCK failures in Overview hierarchy, Players spacer slabs, Profile duplicated trust slabs, and surface density.
- **Fix:** Rebalanced Overview, removed default Players spacer slabs, merged Profile trust metadata into identity, and tightened hierarchy/density across the trio.
- **Files modified:** `StatsOverview.tsx`, `PlayersList.tsx`, `PlayerProfile.tsx`, `PublicStatsSurfaceHarness.tsx`
- **Verification:** Targeted public-stats Playwright suite, `pnpm check`
- **Committed in:** 9cb7d76

**2. [Rule 2 - Missing Critical] Added automated gates for the rejected failure classes**
- **Found during:** Task 3 continuation after rejected human checkpoint.
- **Issue:** Existing gates did not catch empty slab/spacer misuse, first-band density collapse, duplicated profile trust, or hardcoded English fallback labels in RU stories.
- **Fix:** Added cross-surface and per-surface Playwright assertions for spacer absence, first-row offsets, leaderboard/profile-band density, single trust placement, and RU fallback labels.
- **Files modified:** `public-stats-cross-surface.spec.ts`, `public-stats-players-list.spec.ts`, `PlayersList.stories.tsx`, `strings.ts`
- **Verification:** Targeted public-stats Playwright suite
- **Committed in:** 9cb7d76

**3. [Rule 1 - Bug] Fixed Sparkline baseline data passed as a number**
- **Found during:** Task 3 Playwright verification.
- **Issue:** Overview passed a numeric baseline score into `Sparkline`, causing runtime errors when the component expected the baseline series object.
- **Fix:** Kept the numeric baseline only for copy and passed `SS_BASELINE` to `Sparkline`.
- **Files modified:** `StatsOverview.tsx`
- **Verification:** Targeted public-stats Playwright suite
- **Committed in:** 9cb7d76

**Total deviations:** 3 auto-fixed (2 Rule 1, 1 Rule 2)
**Impact on plan:** The fixes are limited to the rejected checkpoint's concrete public-stats issues and the gates needed to prevent recurrence.

## Issues Encountered

- A filtered package-script Playwright invocation broadened unexpectedly because of script argument forwarding; final verification used a direct `pnpm --dir packages/design exec playwright test ...` file list.
- Local tooling prints an engine warning because the environment uses Node `v24.14.0` while the package expects Node `>=25 <26`. The scoped gate, `pnpm check`, and targeted Playwright suite passed.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None. Stub-pattern scan only found legitimate fixture placeholder syntax and input placeholder attributes.

## Threat Flags

None. This plan adds design-surface code, fixture strings, and tests only; it introduces no network endpoint, auth path, file access pattern, or trust-boundary schema change.

## Next Phase Readiness

Phase 04 can proceed to verification with deterministic public-stats coverage and a human-routed final visual judgement for the remediated trio. Phase 05 should reuse the public-stats fixture/harness conventions without reintroducing default empty spacer slabs.

## Self-Check: PASSED

- Created files exist: `packages/design/src/surfaces/public-stats/index.ts`, `packages/design/tests/public-stats-cross-surface.spec.ts`, and this summary.
- Task and checkpoint commits exist in git history: `e3d08fe`, `efd9620`, `5accca0`, `81b4499`, and `9cb7d76`.
- No tracked file deletions were introduced.

---
*Phase: 04-public-stats-overview-players-player-profile*
*Completed: 2026-06-28*
