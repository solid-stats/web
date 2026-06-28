# Phase 04 - UI Review

**Audited:** 2026-06-28
**Baseline:** `04-UI-SPEC.md` plus SolidStats design-review overlay
**Screenshots:** provided checkpoint screenshots inspected; fresh capture not captured because no dev server responded on 3000, 5173, or 8080
**Verdict:** BLOCK

Human checkpoint feedback is treated as rejection, not approval. The audit confirms the systemic failure class: the public-stats trio renders as sparse UIKit/demo cards rather than dense, trustworthy public stats.

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | Several visible Players labels/statuses bypass Lingui and cannot satisfy RU/EN parity. |
| 2. Visuals | 1/4 | Desktop and mobile compositions are sparse card stacks with large empty slabs, not dense stats surfaces. |
| 3. Color | 2/4 | The token palette is mostly respected, but accent and semantic color are used without enough meaning/labels in charts and decorative icons. |
| 4. Typography | 2/4 | Surface code exceeds the UI-SPEC type scale and weight set. |
| 5. Spacing | 1/4 | Arbitrary grid templates and forced min-height geometry create the rejected empty-slab layout. |
| 6. Experience Design | 2/4 | State stories and tests prove presence/no-overflow, but not visual hierarchy, density, or trustworthiness. |

**Overall: 10/24**

---

## Top 3 Priority Fixes

1. **Recompose all three desktop surfaces for density** - 1920px layouts currently stretch cards and tables into empty slabs - rebuild around compact trust headers, richer table columns, visible counts, and data-first grouped sections instead of full-width one-line panels.
2. **Fix the profile and players composition before polishing details** - Profile repeats trust, splits headline context into slabs, and Players uses spacer-first table geometry - make trust/identity/filters compact, move useful stats into the available width, and remove fake air from ready states.
3. **Add visual gates that would fail this build** - current tests pass because they check no overflow and geometry equality - add screenshot/density assertions at 360, 768, 1280, 1920, 2560, and 3440, plus RU copy checks and manual checkpoint capture before any approval.

---

## Detailed Findings

### Pillar 1: Copywriting (2/4)

- **WARNING:** `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx:98` hardcodes `"Active rotation ready"`, `"All-time warm ready"`, `"Recomputing aggregate"`, and `"Loading aggregate"` instead of using the copy contract's RU/EN loading labels. The screenshot `phase04-players-360.png` shows this raw status row, so RU variants cannot satisfy `04-UI-SPEC.md:124` and `04-UI-SPEC.md:136`.
- **WARNING:** `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx:132`, `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx:154`, and `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx:112` hardcode `"Search players"`, `"Tier"`, and `"All tiers"`. Move these into `STRINGS` with RU/EN parity and use the existing `i18n._` path.
- **WARNING:** `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx:351` uses the generic `tooltipContent` string in the Bounty panel. That reads as UIKit filler, not a public-stats explanation. Replace it with a bounty-specific, localized explanation.

### Pillar 2: Visuals (1/4)

- **BLOCKER:** `phase04-overview-1920.png` shows a full-width trust slab, two half-width hero cards, a full-width color strip, and a leaderboard far below the fold. `StatsOverview.tsx:301` to `StatsOverview.tsx:309` simply stacks primitive cards; this misses the UI-SPEC requirement for a dense entry point with leaderboards, stat tiles, microcharts, and entry links (`04-UI-SPEC.md:52`, `04-UI-SPEC.md:210` to `04-UI-SPEC.md:227`). Recompose the overview into compact grouped stats and a meaningful leaderboard region.
- **BLOCKER:** `phase04-players-1920.png` shows the first table row starting after a large blank reserved region. `PlayersList.tsx:40` to `PlayersList.tsx:43` defines fixed top/bottom spacers, and `PlayersList.tsx:251` to `PlayersList.tsx:261` passes them into the ready table. That violates the comfortable-density table contract and "no stray bottom air" requirement (`04-UI-SPEC.md:281`, `04-UI-SPEC.md:300`). Use spacer rows only where virtualization is being demonstrated, not in the default ready story.
- **BLOCKER:** `phase04-profile-1920.png` shows the profile identity and trust layers as near-empty full-width panels. `PlayerProfile.tsx:166`, `PlayerProfile.tsx:245`, and `PlayerProfile.tsx:483` to `PlayerProfile.tsx:494` separate identity, hero stats, trust, mini stats, and tabs into large slabs rather than a compact high headline. Merge trust into the identity/headline block and spend width on actual profile data.
- **WARNING:** `phase04-overview-360.png`, `phase04-players-360.png`, and `phase04-profile-360.png` show mobile as a long pile of cards. It avoids horizontal scroll, but it does not create a purposeful mobile information hierarchy; the top of each surface repeats the same trust card pattern before the user reaches useful stats.

### Pillar 3: Color (2/4)

- **WARNING:** `StatsOverview.tsx:274` to `StatsOverview.tsx:286` renders the trend strip as color-only bars with only a generic `Score` caption. The screenshot shows blue/green bars without a visible legend or threshold text. The spec requires charts and semantic color not to carry meaning alone (`04-UI-SPEC.md:109`, `04-UI-SPEC.md:248` to `04-UI-SPEC.md:250`, `04-UI-SPEC.md:384`).
- **WARNING:** Decorative section icons repeatedly use `text-primary` (`StatsOverview.tsx:202`, `PlayerProfile.tsx:276`, `PlayerProfile.tsx:346`). The accent is reserved for interactive/active/focus/provenance/tier affordances (`04-UI-SPEC.md:111` to `04-UI-SPEC.md:114`); decorative cyan weakens the 10% signal channel.

### Pillar 4: Typography (2/4)

- **WARNING:** The surface code uses six type sizes (`text-2xs`, `text-xs`, `text-sm`, `text-xl`, `text-2xl`, `text-3xl`) and four weights (`font-medium`, `font-semibold`, `font-bold`, plus default), while the UI-SPEC limits surface composition to four sizes and two weights (`04-UI-SPEC.md:84` to `04-UI-SPEC.md:97`). Examples: `PlayerProfile.tsx:170` to `PlayerProfile.tsx:173`, `PlayerProfile.tsx:352`, and `PublicStatsSurfaceHarness.tsx:240`.
- **WARNING:** Profile H1 styling (`PlayerProfile.tsx:173`) visually competes with the hero stat tiles instead of forming a compact identity header. Keep the display role, but reduce surrounding slab scale and align it with trust/status metadata.

### Pillar 5: Spacing (1/4)

- **BLOCKER:** `PlayersList.tsx:128` and `PlayerProfile.tsx:166` use arbitrary grid templates (`@4xl:grid-cols-[1fr_220px_160px_auto]`, `@3xl:grid-cols-[1fr_auto]`). The design system allows computed pixel geometry for table colgroups/row heights/spacer rows only, not arbitrary page layout templates (`04-UI-SPEC.md:75` to `04-UI-SPEC.md:78`).
- **BLOCKER:** Ready-state panels use forced min-heights that become empty visual slabs: `StatsOverview.tsx:209`, `PlayersList.tsx:175`, `PlayerProfile.tsx:153`, `PlayerProfile.tsx:166`, `PlayerProfile.tsx:438`, `PlayerProfile.tsx:457`, and `PlayerProfile.tsx:488`. The UI-SPEC requires balanced cards/tables and no stretched empty strips (`04-UI-SPEC.md:243` to `04-UI-SPEC.md:245`, `04-UI-SPEC.md:359`).
- **BLOCKER:** The 1920 screenshots prove the content container width is technically used but not converted into useful rows/columns. The design-system overlay requires large screens to spend width on data, not gutters or blank panels; this build spends it on full-width cards with little content.

### Pillar 6: Experience Design (2/4)

- **BLOCKER:** The human checkpoint was rejected because the visual hierarchy and trustworthiness failed. This was a known manual-only gate in `04-VALIDATION.md:83` to `04-VALIDATION.md:89`, and `04-VALIDATION.md:110` still says approval was awaiting human review. Do not mark Phase 4 ready; create a gap-closure plan from this review.
- **WARNING:** Tests do not protect the design contract that failed. `public-stats-overview.spec.ts:39` to `public-stats-overview.spec.ts:47` and `public-stats-cross-surface.spec.ts:170` to `public-stats-cross-surface.spec.ts:181` check no horizontal overflow, but they do not assert density, hierarchy, empty-slab absence, meaningful table columns, or screenshot parity.
- **WARNING:** Scenario/data-volume stories render matrices in narrow story wrappers (`StatsOverview.stories.tsx:25` to `StatsOverview.stories.tsx:47`, `PlayersList.stories.tsx:37` to `PlayersList.stories.tsx:62`, `PlayerProfile.stories.tsx:26` to `PlayerProfile.stories.tsx:52`). They prove the variants exist, not that each state works as a real-width surface.

---

## Registry Safety

Registry audit: skipped. `components.json` is absent, `04-UI-SPEC.md:5` sets `shadcn_initialized: false`, and `04-UI-SPEC.md:467` to `04-UI-SPEC.md:472` declares no third-party registry blocks.

---

## Validation Gaps

- Fresh Playwright/MCP screenshots were not captured because no local dev server responded on 3000, 5173, or 8080. Existing rejected-checkpoint screenshots were used as rendered evidence.
- `@google/design.md lint`, axe, keyboard, and CWV traces were not run in this audit because there was no running preview server. The review is based on provided screenshots plus static code/test inspection.
- 768, 1024, 1280, 2560, and 3440 visual screenshots were not available in this checkpoint set, even though the UI-SPEC requires review across those widths.

---

## Evidence Screenshots

- `phase04-overview-360.png`
- `phase04-overview-1920.png`
- `phase04-players-360.png`
- `phase04-players-1920.png`
- `phase04-profile-360.png`
- `phase04-profile-1920.png`

---

## Files Audited

- `.planning/phases/04-public-stats-overview-players-player-profile/04-CONTEXT.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-UI-SPEC.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-VALIDATION.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-01-PLAN.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-02-PLAN.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-03-PLAN.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-04-PLAN.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-05-PLAN.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-01-SUMMARY.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-02-SUMMARY.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-03-SUMMARY.md`
- `.planning/phases/04-public-stats-overview-players-player-profile/04-04-SUMMARY.md`
- `packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.tsx`
- `packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.stories.tsx`
- `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx`
- `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.stories.tsx`
- `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx`
- `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.stories.tsx`
- `packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx`
- `packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts`
- `packages/design/src/shared/uikit/_fixtures/strings.ts`
- `packages/design/tests/public-stats-overview.spec.ts`
- `packages/design/tests/public-stats-players-list.spec.ts`
- `packages/design/tests/public-stats-player-profile.spec.ts`
- `packages/design/tests/public-stats-cross-surface.spec.ts`
