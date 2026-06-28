---
phase: 04
slug: public-stats-overview-players-player-profile
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-28
updated: 2026-06-28
---

# Phase 04 — Validation Strategy

Concrete validation contract for the design-only public-stats trio: Stats Overview, Players list, and Player Profile in `packages/design`.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.9, Playwright 1.61.0, Ladle 5.1.1, axe via `@axe-core/playwright` 4.11.3 |
| Config files | `packages/design/playwright.config.ts`; Vitest is invoked through `packages/design/package.json` |
| Quick run command | `pnpm --filter @solid-stats/design test -- publicStats.test.ts` |
| Targeted story command | `pnpm --filter @solid-stats/design test:e2e --grep "Stats Overview|Players list|Player Profile|public stats cross-surface"` |
| Full suite command | `pnpm check && pnpm --filter @solid-stats/design test && pnpm --filter @solid-stats/design test:e2e` |
| Estimated runtime | Quick: under 30 seconds; targeted stories: under 90 seconds; full suite: project gate |

## Latest Wave 3 Evidence

| Command | Status | Notes |
|---------|--------|-------|
| `LADLE_E2E_PORT=61024 pnpm --filter @solid-stats/design test:e2e --grep "public stats cross-surface"` | passed | 6 Playwright checks covering story meta, rendered Vasiliy stats/trust consistency, RU/EN unresolved-key smoke, and 360/3440 no-overflow. |
| `pnpm exec vp check --fix packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.tsx packages/design/tests/public-stats-cross-surface.spec.ts` | passed | Scoped format/lint/type gate for the cross-surface spec and the Overview count-label fix. |
| `pnpm exec vp check --fix packages/design/src/surfaces/public-stats packages/design/src/shared/uikit/_fixtures/strings.ts packages/design/tests/public-stats-cross-surface.spec.ts packages/design/tests/public-stats-players-list.spec.ts packages/design/tests/public-stats-player-profile.spec.ts` | passed | Rejected-checkpoint remediation scope: public-stats surfaces, shared fixture strings, and targeted design gates. |
| `pnpm check` | passed | Full repository check after the rejected design-review remediation. The design-doc lint command emitted existing warnings only and completed with `errors: 0`. |
| `LADLE_E2E_PORT=61014 pnpm --dir packages/design exec playwright test tests/public-stats-cross-surface.spec.ts tests/public-stats-players-list.spec.ts tests/public-stats-player-profile.spec.ts tests/public-stats-overview.spec.ts --project=chromium --workers=1 --reporter=list` | passed | 49 targeted public-stats Chromium checks covering the trio plus the added density, spacer, and RU fallback gates. |

## Rejected Checkpoint Remediation

Task 3 human review was rejected and concretized by `04-UI-REVIEW.md`. The continuation treated those BLOCK findings as gap-closure requirements, not as approval.

| Audit Class | Remediation | Automated Gate |
|-------------|-------------|----------------|
| Overview hierarchy collapse and leaderboards pushed below empty trust/status slabs | Rebalanced the Overview first band so leaderboards sit beside the hero stats, reduced trust/status slab weight, and added a visible trend-summary text channel | `public-stats-cross-surface.spec.ts` asserts the leaders remain in the first desktop band |
| Players list spacer misuse and density failure | Removed default success spacers, limited spacer rows to large-volume/limit stories, and localized search/tier/status controls | `public-stats-cross-surface.spec.ts` and `public-stats-players-list.spec.ts` assert zero default success spacers and tight first-row offset |
| Profile duplicated trust slabs and fragmented hero/identity hierarchy | Merged freshness/provenance into identity, disabled the duplicated harness trust bar for profile, and kept hero stats in the same data band | `public-stats-cross-surface.spec.ts` asserts a single freshness/trust instance inside identity and bounded profile tab offset |
| Hardcoded English fallback labels in RU variants | Added RU/EN fixture strings for search, tier, period status, bounty explanation, and trend summary | `public-stats-cross-surface.spec.ts` asserts RU Players stories do not render the hardcoded English fallback labels |

## Sampling Rate

- **After every task commit:** run the task's `<verify><automated>` command.
- **After surface implementation tasks:** run the matching targeted Playwright grep for that surface plus `pnpm --filter @solid-stats/design test -- publicStats.test.ts` when fixture invariants are touched.
- **After Wave 1:** run `pnpm --filter @solid-stats/design test -- publicStats.test.ts`.
- **After Wave 2:** run `pnpm --filter @solid-stats/design test:e2e --grep "Stats Overview|Players list|Player Profile"` and `pnpm --filter @solid-stats/design test`.
- **After Wave 3 / before human checkpoint:** run the full suite command.
- **Before `$gsd-verify-work`:** full suite command must be green and the human design-review checkpoint must be approved or converted into a gap-closure plan.
- **Max feedback latency:** task-level targeted checks should stay under 90 seconds before the full phase gate.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirements | Threat Ref | Secure / Quality Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|--------------|------------|---------------------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | SURF-01, SURF-02, SURF-03, QUAL-05, QUAL-06 | T-04-01, T-04-02 | Fixture contract covers Vasiliy rank, formulas, tiers, data volumes, and RU/EN parity before production fixture logic lands | Vitest unit | `pnpm --filter @solid-stats/design test -- publicStats.test.ts` | Wave 1 created `packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts` | passed |
| 04-01-02 | 01 | 1 | SURF-01, SURF-02, SURF-03, QUAL-05, QUAL-06 | T-04-01, T-04-02 | One canonical fixture graph imports existing roster/tier helpers and does not import frozen hi-fi code | Vitest unit + grep | `pnpm --filter @solid-stats/design test -- publicStats.test.ts` | Wave 1 created `packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts` | passed |
| 04-01-03 | 01 | 1 | QUAL-01, QUAL-03, QUAL-04, QUAL-05 | T-04-03 | Shared harness exposes shell, async states, freshness, and provenance through existing primitives | Vitest + targeted Ladle smoke | `pnpm --filter @solid-stats/design test && pnpm --filter @solid-stats/design test:e2e --grep "public-stats"` | Wave 1 created `_harness` files | passed |
| 04-02-01 | 02 | 2 | SURF-01, QUAL-01, QUAL-02, QUAL-03, QUAL-04 | T-04-02-01, T-04-02-02 | Overview tests cover entries, Vasiliy, overflow, CLS, and focusable controls | Playwright story | `pnpm --filter @solid-stats/design test:e2e --grep "Stats Overview"` | Wave 2 created `packages/design/tests/public-stats-overview.spec.ts` | passed |
| 04-02-02 | 02 | 2 | SURF-01, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06 | T-04-02-01, T-04-02-02 | Overview renders from shared fixture graph with trust layer, responsive mobile top-N, and CLS-safe loading | Playwright story + Vitest | `pnpm --filter @solid-stats/design test:e2e --grep "Stats Overview" && pnpm --filter @solid-stats/design test` | Wave 2 created `StatsOverview` files | passed |
| 04-03-01 | 03 | 2 | SURF-02, QUAL-01, QUAL-02, QUAL-03, QUAL-04 | T-04-03-01, T-04-03-02 | Players list tests cover loading model, desktop visual virtualization, mobile show-more, no overflow, and CLS | Playwright story | `pnpm --filter @solid-stats/design test:e2e --grep "Players list"` | Wave 2 created `packages/design/tests/public-stats-players-list.spec.ts` | passed |
| 04-03-02 | 03 | 2 | SURF-02, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06 | T-04-03-01, T-04-03-02 | Players list composes existing Select, AutoTable/TableRow, CompactList, FreshnessPill, and ProvenanceLine without real TanStack Table/Virtual | Playwright story + Vitest | `pnpm --filter @solid-stats/design test:e2e --grep "Players list" && pnpm --filter @solid-stats/design test` | Wave 2 created `PlayersList` files | passed |
| 04-04-01 | 04 | 2 | SURF-03, QUAL-01, QUAL-02, QUAL-03, QUAL-04 | T-04-04-01, T-04-04-02 | Profile tests cover identity, hero stats, tabs, trust layer, no overflow, and CLS | Playwright story | `pnpm --filter @solid-stats/design test:e2e --grep "Player Profile"` | Wave 2 created `packages/design/tests/public-stats-player-profile.spec.ts` | passed |
| 04-04-02 | 04 | 2 | SURF-03, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06 | T-04-04-01, T-04-04-02 | Profile renders public identity, tabs, stats, freshness, and provenance without full SteamID exposure | Playwright story + Vitest | `pnpm --filter @solid-stats/design test:e2e --grep "Player Profile" && pnpm --filter @solid-stats/design test` | Wave 2 created `PlayerProfile` files | passed |
| 04-05-01 | 05 | 3 | SURF-01, SURF-02, SURF-03, QUAL-02, QUAL-05, QUAL-06 | T-04-05-02 | Cross-surface rendered stories agree on rank, Score, K/D, tier, squad, freshness, provenance, locale variants, and no-overflow smoke | Playwright story | `pnpm --filter @solid-stats/design test:e2e --grep "public stats cross-surface"` | Wave 3 created `packages/design/tests/public-stats-cross-surface.spec.ts` | passed |
| 04-05-02 | 05 | 3 | SURF-01, SURF-02, SURF-03, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06 | T-04-05-01 | Internal surface barrel exists, root design package barrel remains UIKIT-focused, and this validation map stays concrete | Targeted smoke + document grep | `pnpm --filter @solid-stats/design test:e2e --grep "public stats cross-surface" && pnpm --filter @solid-stats/design test -- publicStats.test.ts` | Wave 3 created `packages/design/src/surfaces/public-stats/index.ts` | passed |
| 04-05-03 | 05 | 3 | SURF-01, SURF-02, SURF-03, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06 | T-04-05-01 | Human checkpoint rejected; `04-UI-REVIEW.md` BLOCK findings were remediated and covered by targeted density/spacer/RU fallback gates | Full phase gate + manual design review remediation | `pnpm check`; targeted public-stats Playwright suite | Summary records the rejection, remediation, and remaining evidence | passed after remediation |

## Requirement Coverage Table

| Requirement | Required Behavior | Automated Evidence | Manual Evidence | Owner Plan |
|-------------|-------------------|--------------------|-----------------|------------|
| SURF-01 | Stats Overview renders leaderboards, microcharts, and entry points to players, squads, rotations, commander, and bounty | `public-stats-overview.spec.ts`; `public-stats-cross-surface.spec.ts` | Human checks Overview story against UI-SPEC | 04-02, 04-05 |
| SURF-02 | Players list renders search/filter, tier columns, period selector, loading model, desktop visual virtualization, and mobile top-N | `public-stats-players-list.spec.ts`; `public-stats-cross-surface.spec.ts` | Human checks Players story across required widths | 04-03, 04-05 |
| SURF-03 | Player Profile renders identity, nick history, hero stats, squad/status, tabs, freshness, and provenance | `public-stats-player-profile.spec.ts`; `public-stats-cross-surface.spec.ts` | Human checks Profile story across required widths | 04-04, 04-05 |
| QUAL-01 | Five scenario endings and four data-volume states are represented for the trio | Per-surface story exports and targeted Playwright specs | Human verifies state matrix completeness in Ladle | 04-01..04-05 |
| QUAL-02 | Responsive behavior works at 360, 390, 414, 768, 1024, 1280, 1920, 2560, and 3440 widths | Per-surface responsive assertions and cross-surface no-overflow smoke | Human checks 360, 768, 1280, 1920, 2560, and 3440 widths | 04-02..04-05 |
| QUAL-03 | WCAG 2.2 AA, axe clean, keyboard reachability, 44px targets, and no color-alone states | Existing `catalog.spec.ts` discovers Ladle stories; targeted specs assert focusable controls/tabs | Human checks keyboard/focus and obvious contrast/copy issues | 04-02..04-05 |
| QUAL-04 | CLS is zero for loading/final swaps | Per-surface CLS assertions; existing `cls.spec.ts` patterns | Human checks loading/final swaps at key widths | 04-01..04-05 |
| QUAL-05 | RU and EN strings exist at parity and render naturally | Fixture/i18n Vitest parity; cross-surface RU/EN story smoke | Human reads long Russian labels for clipping/awkward breaks | 04-01, 04-05 |
| QUAL-06 | Mock data preserves formulas, tiers, data trust, and Vasiliy as #1 everywhere | `publicStats.test.ts`; `public-stats-cross-surface.spec.ts` | Human spot-checks Vasiliy/top stats in all three stories | 04-01, 04-05 |

## Wave 0 Requirements

Existing infrastructure covers the phase baseline:

- `packages/design/package.json` already exposes Vitest, Playwright, and Ladle commands.
- `packages/design/tests/catalog.spec.ts` already performs global story axe/target/keyboard sampling through Ladle metadata.
- `packages/design/tests/responsive.spec.ts` and `packages/design/tests/cls.spec.ts` provide local patterns reused by Phase 4 targeted specs.
- Plan 04-01 Task 1 is the first executable Wave 1 contract test for Phase 4 fixture invariants.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual hierarchy and polish for Overview, Players, and Profile | SURF-01, SURF-02, SURF-03 | Automated tests can prove hooks, layout boxes, and states, but not whether the trio matches the intended visual priority from UI-SPEC | Run `pnpm --filter @solid-stats/design ladle`; inspect the three public-stats story groups at 360, 768, 1280, 1920, 2560, and 3440 widths |
| Russian copy quality and clipping | QUAL-05 | RU text may fit technically but still read awkwardly or wrap poorly | Switch RU/EN story variants; inspect long Russian labels in controls, tables, tabs, state cells, provenance, and mobile top-N rows |
| Final design-review remediation | QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06 | Phase 4 is a design-delivery phase and requires human design judgement after automated gates | Task 3 was rejected; `04-UI-REVIEW.md` became the concrete issue list and this continuation records the remediation in `04-05-SUMMARY.md` |

## Final Phase Gate

Run before marking Phase 4 ready for `$gsd-verify-work`:

```fish
pnpm check
pnpm --filter @solid-stats/design test
pnpm --filter @solid-stats/design test:e2e
```

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or concrete prerequisites.
- [x] Sampling continuity: no three consecutive tasks lack automated verification.
- [x] Wave 0 baseline is covered by existing design-package infrastructure plus plan 04-01 fixture tests.
- [x] No watch-mode flags are used.
- [x] Task-level targeted feedback is separated from the full phase gate.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** automated Wave 3 checks passed; the rejected design-review checkpoint was remediated against `04-UI-REVIEW.md` BLOCK findings and covered by targeted public-stats gates.
