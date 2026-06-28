---
phase: 04-public-stats-overview-players-player-profile
plan: 06
subsystem: ui
tags: [react, vitest, playwright, public-stats, i18n, gap-closure]

requires:
  - phase: 04-public-stats-overview-players-player-profile
    provides: Public-stats surfaces, shared harness, STRINGS catalog, and Phase 04 verification gap report
provides:
  - Public-stats i18n regression guard for local bilingual copy maps and provenance link labels
  - Catalog-backed public-stats brand, profile status, and provenance explain-link copy
  - Closed GAP-04-I18N implementation for PlayerProfile and PublicStatsSurfaceHarness
affects: [04-public-stats-overview-players-player-profile, public-stats, i18n, verification]

tech-stack:
  added: []
  patterns:
    - Source-level Vitest guard for public-stats catalog usage
    - Surface components consume public-stats copy through STRINGS via t(lang, key)

key-files:
  created:
    - .planning/phases/04-public-stats-overview-players-player-profile/04-06-SUMMARY.md
  modified:
    - packages/design/src/shared/uikit/_fixtures/strings.ts
    - packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts
    - packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx
    - packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx

key-decisions:
  - "Used the existing STRINGS plus t(lang, key) path for public-stats brand/status/provenance copy; no new i18n seam or root export was added."
  - "Kept the regression guard source-level in Vitest instead of adding RTL/component rendering, matching the frontend test split."

patterns-established:
  - "Public-stats TSX files must not define local bilingual { ru, en } copy maps."
  - "Public-stats ProvenanceLine.linkLabel values must come from STRINGS, not locale conditionals."

requirements-completed: [SURF-01, SURF-02, SURF-03, QUAL-05]

coverage:
  - id: D1
    description: "Public-stats regression guard fails on local bilingual copy maps and language-conditional ProvenanceLine link labels, and requires the new public-stats STRINGS keys"
    requirement: QUAL-05
    verification:
      - kind: unit
        ref: "pnpm --filter @solid-stats/design test -- publicStats.test.ts"
        status: pass
      - kind: other
        ref: "Task 1 RED run: same command failed with missing STRINGS keys and local-copy guard message"
        status: pass
    human_judgment: false
  - id: D2
    description: "PublicStatsSurfaceHarness brand and shared provenance link labels are catalog-backed through t(lang, key)"
    requirement: SURF-01
    verification:
      - kind: unit
        ref: "packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts#keeps public-stats surface copy behind STRINGS/i18n instead of local maps"
        status: pass
      - kind: other
        ref: "pnpm exec vp check packages/design/src/shared/uikit/_fixtures/strings.ts packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts"
        status: pass
    human_judgment: false
  - id: D3
    description: "PlayerProfile active status and profile provenance link labels are catalog-backed while rendered RU/EN wording remains unchanged"
    requirement: SURF-03
    verification:
      - kind: automated_ui
        ref: "LADLE_E2E_PORT=61024 pnpm --dir packages/design exec playwright test tests/public-stats-cross-surface.spec.ts tests/public-stats-player-profile.spec.ts --project=chromium --workers=1 --reporter=list"
        status: pass
      - kind: unit
        ref: "pnpm --filter @solid-stats/design test -- publicStats.test.ts"
        status: pass
    human_judgment: false

metrics:
  started: 2026-06-28T09:38:11Z
  completed: 2026-06-28T09:42:20Z
  duration: 4min
  tasks: 2
  files_changed: 4
status: complete
---

# Phase 04 Plan 06: Public Stats I18n Gap Closure Summary

Public-stats profile and harness copy now resolves through the shared STRINGS catalog, with a source-level guard preventing the same i18n bypass from returning.

## Performance

- **Duration:** 4min
- **Started:** 2026-06-28T09:38:11Z
- **Completed:** 2026-06-28T09:42:20Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added a failing Vitest regression guard for the Phase 04 i18n gap class: missing public-stats keys, component-local bilingual maps, and language-conditional provenance link labels.
- Added `publicStatsBrand`, `publicStatsProfileStatusActive`, and `publicStatsProvenanceLinkLabel` to `STRINGS` with RU/EN parity.
- Routed `PublicStatsSurfaceHarness` brand/provenance copy and `PlayerProfile` status/provenance copy through `t(lang, key)` without changing rendered wording.

## Task Commits

| Task | Name | Commit | Files |
| --- | --- | --- | --- |
| 1 | Add the public-stats i18n regression guard | `027a21e` | `packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts` |
| 2 | Move remaining public-stats profile and harness copy into STRINGS | `dfc90bf` | `strings.ts`, `PublicStatsSurfaceHarness.tsx`, `PlayerProfile.tsx` |

## Verification

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm --filter @solid-stats/design test -- publicStats.test.ts` | Failed as expected before Task 2; passed after Task 2 | RED run failed on the three missing keys and the local-copy guard; GREEN run passed 12 files / 270 tests. |
| `pnpm exec vp check packages/design/src/shared/uikit/_fixtures/strings.ts packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts` | Passed | All 4 files formatted, lint-clean, and type-clean. |
| `LADLE_E2E_PORT=61024 pnpm --dir packages/design exec playwright test tests/public-stats-cross-surface.spec.ts tests/public-stats-player-profile.spec.ts --project=chromium --workers=1 --reporter=list` | Passed | 21/21 Chromium checks. |

## Files Created/Modified

- `packages/design/src/shared/uikit/_fixtures/strings.ts` - Added the remaining public-stats brand/status/provenance-link copy keys.
- `packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts` - Added the i18n regression guard.
- `packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx` - Routed brand and shared provenance link label through `t(lang, key)`.
- `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx` - Removed the local status map and routed profile status/provenance link label through `t(lang, key)`.
- `.planning/phases/04-public-stats-overview-players-player-profile/04-06-SUMMARY.md` - Captures this gap-closure result and coverage metadata.

## Decisions Made

- Used the existing STRINGS/i18n helper path rather than introducing a new catalog or localization abstraction.
- Kept the regression guard as a focused source-level Vitest test, not an RTL/component render test.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The local runtime still reports the existing Node engine warning (`v24.14.0` active, repo expects `>=25 <26`). The scoped Vitest, Vite+, and Playwright gates passed.

## Known Stubs

None. Stub-pattern scan only matched existing explanatory `placeholder` comments in `strings.ts`; no UI-rendered stub or mock-only replacement was introduced.

## Threat Flags

None. The only new file-access surface is the planned test-only `readFileSync` source scan covered by the plan threat model; no runtime endpoint, auth path, data fetch, or schema boundary changed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

GAP-04-I18N is implemented in code and covered by deterministic checks. Phase 04 still needs the normal post-gap verification pass to update the phase verification artifact and route any remaining human visual/copy judgement.

## Self-Check: PASSED

- Summary file exists: `.planning/phases/04-public-stats-overview-players-player-profile/04-06-SUMMARY.md`.
- Task commits exist in git history: `027a21e`, `dfc90bf`.
- Coverage metadata classified successfully with 3/3 deliverables auto-covered by passing verification.
- No tracked file deletions were introduced.

---
*Phase: 04-public-stats-overview-players-player-profile*
*Completed: 2026-06-28*
