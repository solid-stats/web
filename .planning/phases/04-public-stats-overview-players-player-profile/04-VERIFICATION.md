---
phase: 04-public-stats-overview-players-player-profile
verified: 2026-06-28T09:20:53Z
status: gaps_found
score: 13/15 must-haves verified
behavior_unverified: 0
overrides_applied: 0
gaps:
  - truth: "Public-stats UI copy is catalog/i18n-keyed with RU/EN parity and no hardcoded UI strings in surface components."
    status: failed
    reason: "The surfaces render localized copy, but several user-visible labels still bypass the shared STRINGS/i18n catalog, violating the Phase 04 UI-SPEC and frontend localization rules."
    artifacts:
      - path: "packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx"
        issue: "PROFILE_STATUS is a component-local RU/EN string map, and the ProvenanceLine linkLabel is selected with a hardcoded lang conditional."
      - path: "packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx"
        issue: "The shared harness passes ProvenanceLine linkLabel through a hardcoded lang conditional."
    missing:
      - "Move profile status and provenance explain-link copy to the shared STRINGS/i18n path, then consume them through the existing t(lang, key) helper."
      - "Add or extend a regression check that fails when public-stats surface components introduce hardcoded user-visible RU/EN copy outside the catalog."
---

# Phase 04: Public Stats Overview, Players, Player Profile Verification Report

**Phase Goal:** The core public-stats trio - Stats Overview, the Players list, and the Player profile - designed end-to-end on the real stack, sharing one loading model, tier system, and provenance/freshness layer.
**Verified:** 2026-06-28T09:20:53Z
**Status:** gaps_found
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Stats Overview is a Ladle story with leaderboards, microcharts, and entry points to players, squads, rotations, commander, and bounty. | VERIFIED | `StatsOverview.stories.tsx` exports Success, ScenarioEndings, DataVolumes, Responsive, and Cls; `StatsOverview.tsx` wires entry items at line 72, leaders at line 207, entry links at line 253, Sparkline at line 291, and the shared harness at line 342. |
| 2 | Players list is designed with search/filter, tier-colored columns, period selector, loading model, desktop visual virtualization, mobile top-N/show-more, no horizontal scroll, and CLS-safe swaps. | VERIFIED | `PlayersList.tsx` imports `AutoTable`/`CompactList`, uses controls at line 121, limits spacers to `virtualized` at lines 265-266 and 289, and exposes the list root at line 293. Playwright covers loading states, mobile show-more, no overflow, no default spacer slabs, and matched loading/final geometry. |
| 3 | Player profile is designed with identity, nick history, hero Score/K/D, squad/status, rotation/bounty/history/replay tabs, provenance, and freshness. | VERIFIED | `PlayerProfile.tsx` has Identity at line 141, hero stats at line 217, nick history at line 255, tab panels at line 414, the profile article at line 473, and shared harness wrapping at line 509. Playwright covers identity, hero stats, trust layer, tabs, keyboard roving, no overflow, and CLS-safe profile boxes. |
| 4 | The trio shares the shell, loading model, freshness/provenance layer, and common surface harness. | VERIFIED | `PublicStatsSurfaceHarness.tsx` wraps surfaces in `AppShell` and `AsyncBoundary`, and renders freshness/provenance through shared primitives. GSD key-link verification passed for harness to AppShell. |
| 5 | The trio uses a single canonical fixture graph with Score/K/D formulas, population tiers, and Vasiliy as #1 everywhere. | VERIFIED | `publicStats.ts` derives players from shared roster/tier helpers at lines 108, 124, 139, 172-181, and exports `PUBLIC_STATS`/volumes at lines 197 and 279. `publicStats.test.ts` verifies formulas, tiers, volume kinds, and Vasiliy rank consistency. |
| 6 | All three surfaces render the required scenario endings and data-volume states. | VERIFIED | Each story file exports ScenarioEndings and DataVolumes; catalog E2E executed public-stats scenario/data-volume stories for overview, players, profile, and shared harness. |
| 7 | Responsive behavior is covered at 360, 390, 414, 768, 1024, 1280, 1920, 2560, and 3440 widths with no horizontal scroll. | VERIFIED | Targeted public-stats Playwright specs passed no-overflow checks across those widths; full E2E global responsive suite also passed. |
| 8 | Accessibility gates for axe serious/critical, keyboard reachability, and 44px targets pass for the public-stats stories. | VERIFIED | Full design E2E passed 480/480; catalog checks included public-stats overview/profile/players/shared stories for axe, target size, and keyboard reachability. |
| 9 | Loading/final geometry avoids CLS for Overview, Players, and Profile. | VERIFIED | Targeted specs passed matched-box assertions for Overview, Players table/list, and Profile identity/hero/tabs; full E2E `cls.spec.ts` also passed. |
| 10 | The rejected UI-review blockers are covered by regression gates after repair. | VERIFIED | Cross-surface Playwright passed the density/spacer/RU fallback gates: leaderboard first-band placement, default players table without spacer slabs, single profile freshness instance inside identity, and no RU English fallback labels. |
| 11 | The package boundary remains design-only and does not introduce app routes, raw fetches, TanStack Table/Virtual engines, SSR, or API wiring. | VERIFIED | Static scan found no `fetch(`, `createFileRoute`, `@tanstack/react-table`, or `@tanstack/react-virtual` under `packages/design/src/surfaces/public-stats`; Phase 04 stays in Ladle/design package. |
| 12 | Public-stats internal barrel exists while the root package export remains UIKIT-focused. | VERIFIED | `packages/design/src/surfaces/public-stats/index.ts` exports the three surfaces; `packages/design/src/index.ts` remains UIKIT/i18n primitive exports and does not publish the surface trio at package root. |
| 13 | All trackable Phase 04 context decisions are honored. | VERIFIED | `gsd-tools query check.decision-coverage-verify` returned 7/7 honored and no blocking decisions. |
| 14 | Public-stats UI copy is catalog/i18n-keyed with RU/EN parity and no hardcoded UI strings in surface components. | FAILED | `04-UI-SPEC.md:403` requires no hardcoded UI strings; localization rules require every UI string through i18n. `PlayerProfile.tsx:49`, `PlayerProfile.tsx:181`, `PlayerProfile.tsx:196`, and `PublicStatsSurfaceHarness.tsx:183` still use component-local RU/EN literals. |
| 15 | Final human visual/copy acceptance after the rejected design checkpoint is complete. | UNCERTAIN | `04-VALIDATION.md:97-103` still lists manual-only checks for visual hierarchy/polish, Russian copy quality/clipping, and final design-review remediation. Automated gates passed, but human judgement is still required after the i18n gap is fixed. |

**Score:** 13/15 truths verified (1 failed, 1 human/manual judgement pending, 0 behavior-unverified).

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts` | Canonical fixture graph | VERIFIED | Exists, substantive, imports roster/tier helpers, exports periods, surface data, volumes, adapters. |
| `packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx` | Shared public-stats shell/state/trust harness | VERIFIED_WITH_GAP | Exists, substantive, wired through stories/surfaces; contains one hardcoded provenance link-label gap. |
| `packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.tsx` | Overview surface | VERIFIED | Exists, substantive, wired to fixtures, tables, compact list, microchart, and harness. |
| `packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.stories.tsx` | Overview Ladle stories | VERIFIED | Success, scenario endings, data volumes, responsive, CLS. |
| `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx` | Players list surface | VERIFIED | Exists, substantive, wired to controls, `AutoTable`, `CompactList`, and period/loading model. |
| `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.stories.tsx` | Players list Ladle stories | VERIFIED | Success, loading model, scenario endings, data volumes, responsive, CLS. |
| `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx` | Player profile surface | VERIFIED_WITH_GAP | Exists, substantive, wired to identity, hero stats, tabs, replays, and harness; contains hardcoded status/provenance link-label gap. |
| `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.stories.tsx` | Player profile Ladle stories | VERIFIED | Success, scenario endings, data volumes, responsive, CLS. |
| `packages/design/src/surfaces/public-stats/index.ts` | Internal public-stats barrel | VERIFIED | Exports the three surface components/types. |
| `packages/design/tests/public-stats-cross-surface.spec.ts` | Cross-surface consistency gate | VERIFIED | Passed in targeted and full E2E runs. |
| `.planning/phases/04-public-stats-overview-players-player-profile/04-VALIDATION.md` | Validation map and manual checks | VERIFIED | Covers SURF/QUAL requirements and records remaining manual-only checks. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `publicStats.ts` | shared roster/tier fixtures | imports roster, score/KD helpers, `tierFor`, `SS_BASELINE` | VERIFIED | GSD key-link verification passed. |
| `PublicStatsSurfaceHarness.tsx` | `AppShell.tsx` | wraps surfaces in `AppShell` | VERIFIED | GSD key-link verification passed. |
| `StatsOverview.tsx` | `publicStats.ts` | receives overview fixture data | VERIFIED | GSD key-link verification passed. |
| `PlayersList.tsx` | `AutoTable.tsx` | desktop table visual contract | VERIFIED | GSD key-link verification passed. |
| `PlayersList.tsx` | `CompactRow.tsx` | mobile top-N compact list | VERIFIED | GSD key-link verification passed. |
| `PlayerProfile.tsx` | `Tabs.tsx` | profile tab composition | VERIFIED | GSD key-link verification passed. |
| `public-stats-cross-surface.spec.ts` | all three story files | story-level consistency checks | VERIFIED | GSD key-link verification passed. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `publicStats.ts` | `PUBLIC_STATS`, `PUBLIC_STATS_VOLUMES` | `ROSTER`, `OVERVIEW_PLAYERS`, `scoreOf`, `kdOf`, `tierFor`, `SS_BASELINE` | Yes - derived fixture graph, not empty/static-only | FLOWING |
| `StatsOverview.tsx` | `overview` prop/default | `PUBLIC_STATS.overview` | Yes - top players, trend, provenance, entries | FLOWING |
| `PlayersList.tsx` | `players`, `period`, `volume` props/defaults | `PUBLIC_STATS.players`, `PUBLIC_STATS_PERIODS`, `PUBLIC_STATS_VOLUMES` | Yes - rows, totals, period labels, tier cells | FLOWING |
| `PlayerProfile.tsx` | `profile`, `activeTab`, `mode` props/defaults | `PUBLIC_STATS.profile`, `PUBLIC_STATS_VOLUMES.profile` | Yes - identity, nick history, hero stats, replays, provenance | FLOWING |
| `PublicStatsSurfaceHarness.tsx` | `state`, `provenance`, `children` | surface props plus shared async/trust primitives | Yes - async states and trust layer render from props | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Root design gate | `pnpm check` | Passed; existing Node engine warning only (`v24.14.0` vs `>=25 <26`), design.md warnings only, `errors: 0`, vp check clean. | PASS |
| Public-stats fixture/formula/i18n parity tests | `pnpm --filter @solid-stats/design test -- publicStats.test.ts` | Passed; Vitest reported 12 files and 263 tests passed. | PASS |
| Targeted Phase 04 public-stats Playwright suite | `LADLE_E2E_PORT=61014 pnpm --dir packages/design exec playwright test tests/public-stats-cross-surface.spec.ts tests/public-stats-players-list.spec.ts tests/public-stats-player-profile.spec.ts tests/public-stats-overview.spec.ts --project=chromium --workers=1 --reporter=list` | Passed; 49/49 Chromium tests. | PASS |
| Full design Playwright gate | `LADLE_E2E_PORT=61015 pnpm --dir packages/design exec playwright test --project=chromium --workers=1 --reporter=list` | Passed; 480/480 Chromium tests, including public-stats catalog axe/keyboard/44px checks. | PASS |
| Decision coverage | `gsd-tools query check.decision-coverage-verify ...` | Passed; 7/7 trackable decisions honored. | PASS |

### Probe Execution

| Probe | Command | Result | Status |
|-------|---------|--------|--------|
| None | `find scripts -path '*/tests/probe-*.sh' -type f` | No phase probes found; Phase 04 is a design/Ladle surface phase. | SKIPPED |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| SURF-01 | 04-02, 04-05 | Stats Overview tables, leaderboards, microcharts, entry points | SATISFIED | Overview component/stories exist; targeted and full Playwright passed. |
| SURF-02 | 04-03, 04-05 | Players list search/filter/tier/period/loading/virtualized desktop/mobile top-N | SATISFIED | Players component/stories exist; spacer, overflow, loading, and CLS tests passed. |
| SURF-03 | 04-04, 04-05 | Player profile identity, nick history, hero stats, squad/status, tabs, freshness, provenance | SATISFIED_WITH_GAP | Profile component/stories and tests pass; status/provenance link labels still bypass i18n catalog. |
| QUAL-01 | 04-01..04-05 | Scenario endings x5 and data-volume states x4 | SATISFIED | Story exports and catalog E2E cover scenario/data-volume stories. |
| QUAL-02 | 04-02..04-05 | Responsive at required widths | SATISFIED | Targeted and full responsive suites passed. |
| QUAL-03 | 04-02..04-05 | WCAG 2.2 AA, axe, keyboard, 44px, no color-alone | SATISFIED | Full catalog axe/target/keyboard checks passed for public-stats stories. |
| QUAL-04 | 04-01..04-05 | CLS = 0 | SATISFIED | Targeted Phase 04 CLS checks and full `cls.spec.ts` passed. |
| QUAL-05 | 04-01, 04-05 | RU+EN strings exist, render naturally, no hardcoded UI strings | FAILED | Catalog parity/render smoke passes, but hardcoded surface UI strings remain in `PlayerProfile.tsx` and `PublicStatsSurfaceHarness.tsx`. Human naturalness check remains pending. |
| QUAL-06 | 04-01, 04-05 | Mock data internally consistent with formulas, tiers, data-trust model | SATISFIED | `publicStats.test.ts` and cross-surface Playwright passed. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx` | 49, 181 | Component-local RU/EN UI string map | BLOCKER | Violates `04-UI-SPEC.md:403` and localization rule that UI strings go through i18n. |
| `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx` | 196 | Hardcoded `lang === "ru" ? ... : ...` link label | BLOCKER | Provenance link label bypasses catalog despite existing string keys. |
| `packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx` | 183 | Hardcoded `lang === "ru" ? ... : ...` link label | BLOCKER | Shared harness propagates the same catalog bypass to overview/players trust bars. |

No `TBD`, `FIXME`, or `XXX` debt markers were found in the Phase 04 surface/test/planning files scanned. Placeholder matches were input placeholders or test assertions, not stubs. Static scan found no hi-fi imports, raw fetches, app routes, or TanStack Table/Virtual dependencies in the public-stats surface code.

### Manual Verification Pending After Gap Closure

These items are not the current status driver because `gaps_found` takes precedence, but they remain required before a final `passed` verdict:

1. **Visual hierarchy and polish**
   **Test:** Run the Ladle stories and inspect Overview, Players, and Profile at 360, 768, 1280, 1920, 2560, and 3440 widths.
   **Expected:** The repaired trio matches UI-SPEC priority, with dense high-signal first screens and no recurrence of the rejected UI-review slab/air issues.
   **Why human:** Automated tests prove hooks, dimensions, and regressions, but not visual judgement.

2. **Russian copy quality and clipping**
   **Test:** Switch RU/EN variants for the public-stats stories and inspect controls, tables, tabs, state cells, provenance, and mobile top-N rows.
   **Expected:** Russian labels read naturally and do not clip or wrap awkwardly.
   **Why human:** Tests can catch unresolved keys and known fallback strings, not prose quality.

3. **Final post-repair design review**
   **Test:** Compare remediated stories against `04-UI-REVIEW.md` findings and `04-UI-SPEC.md`.
   **Expected:** The prior BLOCK findings are accepted as closed by human review.
   **Why human:** The rejected checkpoint was explicitly a design judgement gate.

### Gaps Summary

Automated gates are green and the public-stats surfaces are substantive, wired, and data-backed. The phase goal is still not achieved because the copy/i18n contract is part of the Phase 04 success criteria and is observably violated by hardcoded user-visible labels in the profile and shared harness. Fix the i18n catalog bypass first; then rerun `pnpm check`, `pnpm --filter @solid-stats/design test -- publicStats.test.ts`, the targeted public-stats Playwright command, and the human visual/copy checks.

---

_Verified: 2026-06-28T09:20:53Z_
_Verifier: the agent (gsd-verifier)_
