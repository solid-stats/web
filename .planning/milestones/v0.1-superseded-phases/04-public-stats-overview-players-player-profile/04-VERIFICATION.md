---
phase: 04-public-stats-overview-players-player-profile
verified: 2026-06-28T09:56:00Z
status: human_needed
score: 14/15 must-haves verified
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 13/15
  gaps_closed:
    - "Public-stats UI copy is catalog/i18n-keyed with RU/EN parity and no hardcoded UI strings in surface components."
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Inspect Overview, Players list, and Player Profile Ladle stories at 360, 768, 1280, 1920, 2560, and 3440 widths after the i18n gap closure."
    expected: "The remediated trio still matches the Phase 04 visual hierarchy and density contract: useful stats appear high, no empty slab/spacer regressions return, and no horizontal/nested mobile scroll appears."
    why_human: "Automated checks prove dimensions, hooks, and known regressions; they do not prove visual judgement or final design acceptance."
  - test: "Switch RU and EN variants for the public-stats stories and inspect controls, tables, tabs, state cells, provenance, profile status, and mobile top-N rows."
    expected: "Russian copy reads naturally, does not clip or wrap awkwardly, and the moved STRINGS-backed labels still render the intended wording."
    why_human: "The regression test proves catalog sourcing and RU/EN key presence, not prose quality or visual copy fit."
  - test: "Compare the final stories against 04-UI-REVIEW.md and 04-UI-SPEC.md after the i18n fix."
    expected: "The previous rejected design-review findings remain accepted as closed, and the new catalog-backed copy does not create a design/copy regression."
    why_human: "The rejected checkpoint was explicitly a design judgement gate; final acceptance remains human-owned."
---

# Phase 04: Public Stats Overview, Players, Player Profile Verification Report

**Phase Goal:** The core public-stats trio - Stats Overview, the Players list, and the Player profile - designed end-to-end on the real stack, sharing one loading model, tier system, and provenance/freshness layer.
**Verified:** 2026-06-28T09:56:00Z
**Status:** human_needed
**Re-verification:** Yes - after 04-06 i18n gap closure.

## MVP Mode Note

ROADMAP marks Phase 04 as `mode: mvp`, but the roadmap goal is the legacy design-phase goal, not an `As a ..., I want to ..., so that ...` user-story string. `user-story.validate` returned `false`. This re-verification therefore uses the prior phase-level must-haves and the 04-06 gap-closure contract rather than generating a new MVP user-flow table.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Stats Overview is a Ladle story with leaderboards, microcharts, and entry points to players, squads, rotations, commander, and bounty. | VERIFIED | Quick regression: 04-02 artifacts still pass `verify.artifacts`; 04-02 key link from `StatsOverview.tsx` to `publicStats.ts` still verifies. |
| 2 | Players list is designed with search/filter, tier-colored columns, period selector, loading model, desktop visual virtualization, mobile top-N/show-more, no horizontal scroll, and CLS-safe swaps. | VERIFIED | Quick regression: 04-03 artifacts and key links to `AutoTable` and `CompactList` still verify. |
| 3 | Player profile is designed with identity, nick history, hero Score/K/D, squad/status, rotation/bounty/history/replay tabs, provenance, and freshness. | VERIFIED | `PlayerProfile.tsx` remains substantive and wired to `Tabs`; targeted profile Playwright passed 13 profile checks inside the 21-test run. |
| 4 | The trio shares the shell, loading model, freshness/provenance layer, and common surface harness. | VERIFIED | `PublicStatsSurfaceHarness.tsx` still wraps `AppShell`; key-link verification passed. |
| 5 | The trio uses a single canonical fixture graph with Score/K/D formulas, population tiers, and Vasiliy as #1 everywhere. | VERIFIED | `publicStats.test.ts` passed; 270 tests total, including formula/tier/rank invariants. |
| 6 | All three surfaces render the required scenario endings and data-volume states. | VERIFIED | Quick regression: story artifacts for Overview, Players, and Profile still exist and pass artifact verification. |
| 7 | Responsive behavior is covered at 360, 390, 414, 768, 1024, 1280, 1920, 2560, and 3440 widths with no horizontal scroll. | VERIFIED | Targeted 04-06 Playwright passed profile width checks at all required widths plus cross-surface 360/3440 no-overflow smoke. |
| 8 | Accessibility gates for axe serious/critical, keyboard reachability, and 44px targets pass for the public-stats stories. | VERIFIED | Prior full catalog gate remains supported by unchanged story artifacts; targeted 04-06 profile run rechecked keyboard tab roving. |
| 9 | Loading/final geometry avoids CLS for Overview, Players, and Profile. | VERIFIED | Targeted 04-06 profile run passed loading/final geometry equality; previous Overview/Players CLS artifacts unchanged and still verified. |
| 10 | The rejected UI-review blockers are covered by regression gates after repair. | VERIFIED | `public-stats-cross-surface.spec.ts` passed density, spacer, RU fallback, and cross-surface consistency checks in the 21-test run. |
| 11 | The package boundary remains design-only and does not introduce app routes, raw fetches, TanStack Table/Virtual engines, SSR, or API wiring. | VERIFIED | Static source scan found no new route/API/data-engine wiring in the 04-06 touched files; 04-06 only touched STRINGS, tests, harness, and profile. |
| 12 | Public-stats internal barrel exists while the root package export remains UIKIT-focused. | VERIFIED | 04-05 artifact verification for `packages/design/src/surfaces/public-stats/index.ts` still passes; 04-06 did not modify package exports. |
| 13 | All trackable Phase 04 context decisions are honored. | VERIFIED | `check.decision-coverage-verify` returned 7/7 honored. |
| 14 | Public-stats UI copy is catalog/i18n-keyed with RU/EN parity and no hardcoded UI strings in surface components. | VERIFIED | Closed by 04-06: `STRINGS` now has `publicStatsBrand`, `publicStatsProfileStatusActive`, and `publicStatsProvenanceLinkLabel`; `PublicStatsSurfaceHarness.tsx` and `PlayerProfile.tsx` consume them through `t(lang, key)`; source guard rejects local `{ ru, en }` maps and locale-conditional provenance labels; `publicStats.test.ts` passed. |
| 15 | Final human visual/copy acceptance after the rejected design checkpoint is complete. | UNCERTAIN | `04-VALIDATION.md` still lists manual-only visual hierarchy/polish, Russian copy quality/clipping, and final design-review remediation checks. No post-04-06 human acceptance artifact exists. |

**Score:** 14/15 truths verified (1 human/manual judgement pending, 0 behavior-unverified).

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `packages/design/src/shared/uikit/_fixtures/strings.ts` | Catalog keys for public-stats brand/status/provenance-link copy | VERIFIED | Lines 279-286 define the new public-stats copy keys with RU/EN parity. |
| `packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts` | Regression guard for public-stats i18n catalog usage | VERIFIED | Lines 20-26 require the new keys; lines 155-166 scan the verifier-named TSX files for local maps and provenance label conditionals. |
| `packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx` | Catalog-backed public-stats shell and provenance labels | VERIFIED | `Brand` uses `t(lang, "publicStatsBrand")`; `trustBar` passes `linkLabel={t(lang, "publicStatsProvenanceLinkLabel")}`. |
| `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx` | Catalog-backed profile status and provenance labels | VERIFIED | Identity status uses `t(lang, "publicStatsProfileStatusActive")`; profile provenance uses `t(lang, "publicStatsProvenanceLinkLabel")`; no `PROFILE_STATUS` local map remains. |

**Artifacts:** 4/4 04-06 artifacts verified; all 15 pre-existing Phase 04 plan artifacts passed quick regression artifact verification.

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `PublicStatsSurfaceHarness.tsx` | `strings.ts` | `t(lang, key)` resolves brand/provenance copy from STRINGS | VERIFIED | `verify.key-links` found `publicStatsBrand` / `publicStatsProvenanceLinkLabel`. |
| `PlayerProfile.tsx` | `strings.ts` | `t(lang, key)` resolves status/provenance copy from STRINGS | VERIFIED | `verify.key-links` found `publicStatsProfileStatusActive` / `publicStatsProvenanceLinkLabel`. |
| Phase 04 plans 04-01..04-05 | Declared links | Fixture graph, AppShell, stories, table/list/tabs wiring | VERIFIED | Quick regression: all prior GSD key-link checks returned `all_verified: true`. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `strings.ts` | `publicStatsBrand`, `publicStatsProfileStatusActive`, `publicStatsProvenanceLinkLabel` | `STRINGS` bilingual catalog | Yes - RU/EN values exist in the shared catalog | FLOWING |
| `PublicStatsSurfaceHarness.tsx` | brand/provenance labels | `t(lang, key)` over `STRINGS` | Yes - rendered through the existing i18n runtime | FLOWING |
| `PlayerProfile.tsx` | profile status/provenance labels | `t(lang, key)` over `STRINGS` | Yes - rendered through the existing i18n runtime | FLOWING |
| `publicStats.test.ts` | regression guard inputs | `readFileSync` over `PlayerProfile.tsx` and `PublicStatsSurfaceHarness.tsx` | Yes - scans the actual source files named by the prior gap | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Public-stats fixture/formula/i18n guard | `pnpm --filter @solid-stats/design test -- publicStats.test.ts` | Passed; Vitest reported 12 files and 270 tests passed. Existing Node engine warning only (`v24.14.0` vs `>=25 <26`). | PASS |
| Scoped format/lint/type gate for 04-06 files | `pnpm exec vp check packages/design/src/shared/uikit/_fixtures/strings.ts packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts` | Passed; all 4 files formatted, lint-clean, and type-clean. | PASS |
| Targeted 04-06 public-stats Playwright suite | `LADLE_E2E_PORT=61024 pnpm --dir packages/design exec playwright test tests/public-stats-cross-surface.spec.ts tests/public-stats-player-profile.spec.ts --project=chromium --workers=1 --reporter=list` | Passed; 21/21 Chromium checks. | PASS |
| Decision coverage | `gsd-tools query check.decision-coverage-verify ...` | Passed; 7/7 trackable decisions honored. | PASS |

### Probe Execution

| Probe | Command | Result | Status |
|-------|---------|--------|--------|
| None | `find scripts -path '*/tests/probe-*.sh' -type f -print` | No phase probes found; Phase 04 is a design/Ladle surface phase. | SKIPPED |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| SURF-01 | 04-02, 04-05, 04-06 | Stats Overview tables, leaderboards, microcharts, entry points, shared harness provenance copy | SATISFIED | Prior artifacts/key links still pass; 04-06 harness provenance label is catalog-backed and cross-surface Playwright passed. |
| SURF-02 | 04-03, 04-05, 04-06 | Players list search/filter/tier/period/loading/virtualized desktop/mobile top-N, shared harness provenance copy | SATISFIED | Prior artifacts/key links still pass; shared harness label path is catalog-backed and cross-surface Playwright passed. |
| SURF-03 | 04-04, 04-05, 04-06 | Player profile identity, nick history, hero stats, squad/status, tabs, freshness, provenance | SATISFIED | Profile status/provenance labels are catalog-backed; targeted profile Playwright passed. |
| QUAL-01 | 04-01..04-05 | Scenario endings x5 and data-volume states x4 | SATISFIED | Story artifacts and previous validation unchanged; quick regression artifact checks passed. |
| QUAL-02 | 04-02..04-05 | Responsive at required widths | SATISFIED | Targeted 04-06 Playwright rechecked profile all-width no-overflow and cross-surface 360/3440 smoke. |
| QUAL-03 | 04-02..04-05 | WCAG 2.2 AA, axe, keyboard, 44px, no color-alone | SATISFIED | Prior catalog gate unchanged; 04-06 profile run rechecked keyboard tab roving. |
| QUAL-04 | 04-01..04-05 | CLS = 0 | SATISFIED | Targeted 04-06 profile run passed loading/final geometry; prior Overview/Players CLS artifacts unchanged. |
| QUAL-05 | 04-01, 04-05, 04-06 | RU+EN strings exist, render naturally, no hardcoded UI strings | AUTOMATED SATISFIED / HUMAN PENDING | Prior hardcoded-copy gap closed by STRINGS keys, `t(lang, key)` call sites, source guard, and tests. Human naturalness/clipping remains pending. |
| QUAL-06 | 04-01, 04-05 | Mock data internally consistent with formulas, tiers, data-trust model | SATISFIED | `publicStats.test.ts` passed formula/tier/rank invariants. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | - | - | - | No blocker anti-patterns found in the Phase 04 public-stats source/test files scanned. Placeholder matches were catalog comments, input `placeholder` props backed by `t(...)`, or test assertions; they are not stubs. |

Additional scans:

- No `TBD`, `FIXME`, or `XXX` debt markers found in the scanned Phase 04 files.
- No `test.skip`, `describe.skip`, `test.todo`, or related disabled-test markers found in the linked Phase 04 public-stats tests.
- No circular expected-value writer pattern found in the linked Phase 04 public-stats tests.
- No source matches for local bilingual `{ ru, en }` copy maps, language-conditional provenance link labels, or the previous hardcoded English fallback labels in public-stats TSX files.

### Human Verification Required

### 1. Final Visual Hierarchy And Polish

**Test:** Run the Ladle stories and inspect Overview, Players list, and Player Profile at 360, 768, 1280, 1920, 2560, and 3440 widths.
**Expected:** The trio still matches `04-UI-SPEC.md` priority after 04-06: dense high-signal first screens, useful stats high on the page, no recurrence of empty slabs/spacer air, no horizontal scroll, and no nested mobile list scroll.
**Why human:** Automated tests verify known layout regressions and box behavior, not final visual judgement.

### 2. Russian Copy Quality And Clipping

**Test:** Switch RU/EN variants and inspect controls, tables, tabs, state cells, provenance, profile status, and mobile top-N rows.
**Expected:** Russian labels read naturally and do not clip or wrap awkwardly; the moved catalog-backed labels keep the intended wording.
**Why human:** The tests prove catalog sourcing and key parity, not prose quality or visual fit.

### 3. Final Design-Review Acceptance

**Test:** Compare the final stories against `04-UI-REVIEW.md` and `04-UI-SPEC.md` after the i18n fix.
**Expected:** The earlier rejected checkpoint findings remain accepted as closed, and no copy/design regression was introduced by moving labels into STRINGS.
**Why human:** The rejected checkpoint was explicitly a human design-review gate.

### Gaps Summary

No automated gaps remain. The prior i18n blocker is closed by code evidence, GSD artifact/key-link checks, the source-level regression guard, Vitest, scoped Vite+, and targeted Playwright.

The phase is not marked `passed` because final visual/copy acceptance is still explicitly manual in `04-VALIDATION.md` and no post-04-06 human acceptance artifact exists.

---

_Verified: 2026-06-28T09:56:00Z_
_Verifier: the agent (gsd-verifier)_
