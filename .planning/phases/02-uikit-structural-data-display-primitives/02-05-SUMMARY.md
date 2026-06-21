---
phase: 02-uikit-structural-data-display-primitives
plan: 05
subsystem: uikit
tags: [kit-03, stat-tile, tier, sparkline, tabular-nums, tailwind-variants, lucide-react, ladle, axe, a11y, container-queries, cls, tailwind-v4]

# Dependency graph
requires:
  - phase: 02-uikit-structural-data-display-primitives
    plan: 01
    provides: "Vitest + Playwright-against-Ladle catalog gate (axe/44px/keyboard), _fixtures (ROSTER/scoreOf/kdOf, SS_BASELINE/tierFor pure, STRINGS RU+EN), _state-matrix (StateMatrix/StateCell), sr-only utility in .ladle/tailwind.css"
  - phase: 02-uikit-structural-data-display-primitives
    plan: 03
    provides: "tv() on tailwind-variants/lite, colocated component-shape (index.ts + Component.tsx + Component.stories.tsx, story = StateMatrix + Playground), Skeleton tile variant, tests/cls.spec pattern"
  - phase: 02-uikit-structural-data-display-primitives
    plan: 04
    provides: "data-state + tv() forced-pseudo-state recipe, never-color-alone (color + word + aria-current + marker) precedent, container-keyed @md reflow precedent"
provides:
  - "KIT-03 stat-primitive family — six colocated Ladle slices: StatTile (hero stat-xl tabular value + signed delta colored win/loss paired with trending-up/down Lucide icon, recipe stat-tile, loading = Skeleton tile), MiniStatGrid (even @container-keyed 2/3/4-col grid in metric priority, no orphan tile, empty = reserved placeholder), TierChip (tierFor with baseline explicit → level name + entry threshold «≥2.4 ХОРОШО» + pips, color paired with word), TierScale + nested Pips (four-zone scale, active zone = color + word + filled pips + aria-current), Sparkline (dependency-free DOM bars, computed % height via inline style, tier-token fill, figure aria-hidden + sr-only figcaption summary, motion-safe scaleY grow / motion-reduce off, fixed h-10 CLS 0)"
  - "Population-derived tiers with baseline passed EXPLICITLY (D-04, tierFor already Vitest-pure); tier→token map (no --color-tier-* token exists): ascending loss/warn/info/win held literal so @source emits it"
  - "Pips discrete 4-level meter (low=1/base=2/good=3/elite=4) — the redundant non-color signal that makes never-color-alone genuine"
  - "All stat data from the single _fixtures roster (Vasiliy #1: Score 4.13 отлично, K/D 3.39 норма, games 22 / kills 96 / tk 1 / deaths 27 / bounty 14208), internally consistent with the Score/K-D formulas; RU+EN from STRINGS"
  - "KIT-03 metric labels + tier/sparkline copy added to _fixtures/STRINGS (RU+EN parity)"
  - "Graduated into the public barrel @solid-stats/design (src/index.ts) — StatTile, MiniStatGrid, TierChip, TierScale, Pips, Sparkline + MiniStat type; _fixtures/_state-matrix/tierFor stay internal"
  - "tests/cls.spec: Sparkline empty vs many reserve identical height (CLS 0)"
affects: [02-06-data-table, phase-04-overview-surface, phase-05-player-profile-surface, phase-06-commander-side-surface, phase-09-all-surfaces]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tier→token map without --color-tier-* tokens: the four levels map onto existing semantic tokens (ascending quality loss/warn/info/win), held LITERAL inside tv() so the Tailwind v4 @source scan emits them. Color is redundant with the level word + the Pips count (never color-alone genuinely satisfied)"
    - "Sanctioned computed-dimension escape (styling.md): Sparkline bar height is a computed % via inline style (dynamic value, NOT a themable token); the bar FILL stays a token class. Same precedent as Skeleton's reserved colgroup widths and DataTrustBanner's reserved height"
    - "CLS-0 microchart: a fixed-height (h-10) flex row holds the layout regardless of bar count; empty renders a flat baseline bar, not a collapse. Mount grow is transform-only (scaleY, origin-bottom) under motion-safe / dropped under motion-reduce — animate transform/opacity, never layout"
    - "Chart a11y (a11y.md): bars are decorative in an aria-hidden div inside a <figure>; the data reaches a screen reader through a sibling sr-only <figcaption> value summary — never via color"
    - "tv() compoundVariants gate a color behind a boolean so /lite (no tailwind-merge) does not leak it via source order: the Pips tier color applies ONLY to on=true pips; off pips are bg-border-2 alone (the TierScale active-zone recipe uses the same shape)"
    - "Wide multi-column primitives (MiniStatGrid) are demoed in a full-width story row, NOT crammed into a narrow StateMatrix cell which would collapse the @container reflow"

key-files:
  created:
    - packages/design/src/shared/uikit/StatTile/{index.ts,StatTile.tsx,StatTile.stories.tsx}
    - packages/design/src/shared/uikit/MiniStatGrid/{index.ts,MiniStatGrid.tsx,MiniStatGrid.stories.tsx}
    - packages/design/src/shared/uikit/TierChip/{index.ts,TierChip.tsx,TierChip.stories.tsx}
    - packages/design/src/shared/uikit/TierScale/{index.ts,TierScale.tsx,TierScale.stories.tsx}
    - packages/design/src/shared/uikit/Sparkline/{index.ts,Sparkline.tsx,Sparkline.stories.tsx}
  modified:
    - packages/design/src/index.ts
    - packages/design/src/shared/uikit/_fixtures/strings.ts
    - packages/design/tests/cls.spec.ts

key-decisions:
  - "Tier color uses existing semantic tokens (loss/warn/info/win ascending), NOT new --color-tier-* tokens — those were never added to DESIGN.md; adding tokens would be an architectural change (Rule 4). The color is held literal in tv() and is redundant with the Pips count + level word"
  - "Sparkline is dependency-free DOM bars (NO recharts/visx/d3, D-03): bar height = computed % via inline style (sanctioned escape), bar fill = tier-token class (literal so @source emits it)"
  - "Pips lives inside the TierScale slice (architecture.md leaf-granularity, D-02) and graduates with it; re-exported so the sibling TierChip renders the same meter"
  - "TierChip caption is pre-formatted by the caller («≥2.4 ХОРОШО» for base/good/elite, «НИЖЕ» for low which has no entry threshold); tierFor is called with baseline passed explicitly (D-04)"
  - "MiniStatGrid reflows by @container width (2/3/4 cols) like the AppShell precedent, not by viewport; the caller keeps the stat count even so the trailing row is never an orphan tile"

patterns-established:
  - "Tier→semantic-token literal map (no tier tokens exist) — reused by any tier-colored surface in Phases 4-9"
  - "Dependency-free CLS-0 Sparkline (fixed-height row + computed-% bars + figure/sr-only summary + motion-reduce) — the microchart vocabulary for the Overview/Profile surfaces"
  - "Pips discrete meter as the never-color-alone redundant signal alongside the level word"

requirements-completed: [KIT-03, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06]

# Metrics
duration: 14min
completed: 2026-06-21
status: complete
---

# Phase 2 Plan 05: KIT-03 Stat-primitive Family Summary

**Six colocated Ladle slices for the headline-data vocabulary — StatTile (hero stat-xl tabular value + signed delta with trend icon, never color-alone), MiniStatGrid (even @container grid, no orphan, metric priority), TierChip (population-derived tier via tierFor with baseline explicit, level name + «≥2.4 ХОРОШО» threshold + Pips), TierScale + nested Pips (four-zone scale, active zone = color + word + filled pips + aria-current), and a dependency-free Sparkline (DOM bars, computed-% height, tier-token fill, figure aria-hidden + sr-only summary, motion-reduce, fixed h-10 CLS 0) — all numbers internally consistent from the single _fixtures roster (Vasiliy #1), axe-clean / RU+EN, graduated into @solid-stats/design and design-review APPROVED.**

## Performance

- **Duration:** ~14 min (start 12:50:46+07 → end 13:04:48+07)
- **Tasks:** 3 (Tasks 1-2 TDD-marked — "test" = catalog gate + cls.spec; Task 3 graduation + design-review)
- **Files:** 18 (15 created across 5 slices, 3 modified: barrel, STRINGS, cls.spec)

## Accomplishments

- **StatTile:** recipe `stat-tile` (surface-1 + border-1 + rounded-md), `stat-xl` tabular-mono value (font-display, text-4xl, bold, tracking-tight), optional signed delta colored win/loss ALWAYS paired with `trending-up`/`trending-down` Lucide icon (never color-alone). Loading = the KIT-07 `Skeleton` tile variant, which reserves the identical box (CLS 0). Hero pair renders Vasiliy #1: Счёт 4.13 (↗+0.31) + K/D 3.39 (↘−0.12).
- **MiniStatGrid:** even `@container`-keyed grid (2 → 3 → 4 cols by container width), no orphan tile, metric-priority order (Игры → Убийства → ТК → Смерти, then Награда → Смерти от ТК for the "many" volume). Each value tabular mono; empty = reserved-height placeholder («Нет статистики»), not a collapse. Reflows to 2-col at 360px.
- **TierChip:** calls `tierFor(metric, value, baseline)` with `baseline` passed EXPLICITLY (D-04); renders the level name + entry threshold («≥1.0 НОРМА», «≥2.4 ХОРОШО», «≥4.0 ОТЛИЧНО», or «НИЖЕ» for low) with the tier color paired with the word + Pips. Walks all four levels by feeding values into each `SS_BASELINE.rotation.score` band.
- **TierScale + Pips:** the four-zone scale with the active zone marked (tier color + level word + filled Pips + `aria-current`), inactive zones muted labels. `Pips` (the discrete 4-pip meter: low=1/base=2/good=3/elite=4) lives inside the TierScale slice (leaf-granularity, D-02) and is re-exported for TierChip.
- **Sparkline (D-03):** dependency-free DOM bars (`<span>`) in a fixed-height (`h-10`) flex row; each bar's height is a computed `%` via inline style (sanctioned dynamic-dimension escape), the fill a tier-token class (literal so the `@source` scan emits it) colored by the bar's own score tier. The bars sit in an `aria-hidden` div inside a `<figure>`; an `sr-only` `<figcaption>` carries the value summary (never color-alone). Mount grow is `scaleY` (origin-bottom) under `motion-safe:` / dropped under `motion-reduce:`. Proven CLS 0 across empty / few / many / clamped.
- **Fixtures:** added KIT-03 metric labels (statScore/Kd/Games/Kills/Tk/Deaths/Bounty/DeathsTk/Empty), tier threshold + scale-aria templates, and the Sparkline summary template to `_fixtures/STRINGS` (RU+EN parity).
- **Barrel graduation:** appended `StatTile, MiniStatGrid, TierChip, TierScale, Pips, Sparkline` (+ `MiniStat` type) in a distinct KIT-03 region; `_fixtures`/`_state-matrix`/`tierFor`/Smoke stay internal.

## Task Commits

1. **Task 1: StatTile + MiniStatGrid** — `8b458a4` (feat)
2. **Task 2: TierChip + TierScale/Pips + dependency-free Sparkline** — `552b3ad` (feat)
3. **Task 3: Graduate KIT-03 into the barrel + design-review fixes** — `96bfbfd` (feat)

_Note: the plan-metadata commit (this SUMMARY) follows; STATE.md/ROADMAP.md are owned by the orchestrator (worktree mode)._

## Files Created/Modified

- `StatTile/StatTile.tsx` — hero stat tile, stat-xl tabular, signed delta + trend icon (never color-alone)
- `MiniStatGrid/MiniStatGrid.tsx` — even @container grid, no orphan tiles, metric priority, empty placeholder
- `TierChip/TierChip.tsx` — population-derived tier chip, baseline explicit, level name + threshold + Pips
- `TierScale/TierScale.tsx` — four-zone scale + nested Pips discrete meter, active zone = color+word+pips+aria-current
- `Sparkline/Sparkline.tsx` — dependency-free DOM-bar microchart, figure aria-hidden + sr-only summary, CLS 0
- `src/index.ts` — barrel: KIT-03 family graduated (append-only)
- `_fixtures/strings.ts` — KIT-03 metric/tier/sparkline copy (RU+EN)
- `tests/cls.spec.ts` — Sparkline empty-vs-many fixed-height proof

## Decisions Made

- **Tier color = existing semantic tokens, not new `--color-tier-*`:** the design system never shipped tier tokens; the four levels map onto loss/warn/info/win (ascending quality), held literal in `tv()`. Adding new tokens would be an architectural change — out of scope; the color is redundant with the Pips count + level word.
- **Sparkline dependency-free (D-03):** DOM bars, computed-% height via inline style (sanctioned escape), tier-token fill. NO recharts/visx/d3.
- **Pips nested in TierScale (D-02 leaf-granularity):** re-exported for the sibling TierChip.
- **MiniStatGrid reflows by `@container`** (2/3/4 cols), caller keeps the stat count even.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] KIT-03 copy added to _fixtures/STRINGS**
- **Found during:** Task 1 (StatTile/MiniStatGrid stories need RU+EN metric labels)
- **Issue:** STRINGS carried data-trust / nav copy but no stat-metric labels (Игры/Убийства/ТК/Смерти/Награда), tier-threshold template, or sparkline summary template — the Copywriting Contract did not enumerate the KIT-03 vocabulary.
- **Fix:** added `statScore/Kd/Games/Kills/Tk/Deaths/Bounty/DeathsTk/Empty`, `tierThreshold`, `tierScaleAria`, `sparklineSummary` (all RU+EN) to STRINGS.
- **Files modified:** packages/design/src/shared/uikit/_fixtures/strings.ts
- **Verification:** all KIT-03 stories render RU+EN from STRINGS; structural `satisfies Record<string, Bilingual>` holds.
- **Committed in:** `8b458a4` (Task 1)

**2. [Rule 1 - Bug] TierScale Pips leaked the tier color onto "off" pips**
- **Found during:** Task 3 (per-family visual design-review — the Pips matrix showed 4 filled pips for every level)
- **Issue:** the `pip` tv carried the level color in a `level` variant and `bg-border-2` in `on:false`. With `/lite` (no tailwind-merge) BOTH classes emit and CSS source order decides — so the level color won on off pips, defeating the discrete meter (low should show 1 filled, not 4).
- **Fix:** moved the tier color into `compoundVariants` gated on `on:true`; an off pip is `bg-border-2` alone. Now low=1 / base=2 / good=3 / elite=4 filled.
- **Files modified:** packages/design/src/shared/uikit/TierScale/TierScale.tsx
- **Verification:** re-screenshot at 1280px confirms graduated pip fill; full Playwright suite 153/153 green.
- **Committed in:** `96bfbfd` (Task 3)

**3. [Rule 1 - Bug] TierChip leftover `levelLabel` destructure**
- **Found during:** Task 3 (lint/typecheck sweep)
- **Issue:** an earlier edit removed `levelLabel` from `Props` but left it in the function destructure — an unused-binding / missing-prop TS error (Ladle/Vite does not typecheck, so the catalog passed regardless).
- **Fix:** removed the leftover binding.
- **Files modified:** packages/design/src/shared/uikit/TierChip/TierChip.tsx
- **Verification:** `vp check` lint (type-check) clean over 84 files; `pnpm check` exit 0.
- **Committed in:** `96bfbfd` (Task 3)

**4. [Rule 1 - Bug] MiniStatGrid story tiles overlapped in the narrow matrix cell**
- **Found during:** Task 3 (visual design-review — labels overlapped values)
- **Issue:** the MiniStatGrid (a wide multi-column block) was rendered inside a narrow 3-col `StateMatrix` cell, collapsing the `@container` reflow to ~50px columns and overlapping tile content.
- **Fix:** rendered each data-volume state in a full-width labelled row (same `data-state-cell` hook the catalog spec asserts) instead of inside the cramped StateMatrix grid.
- **Files modified:** packages/design/src/shared/uikit/MiniStatGrid/MiniStatGrid.stories.tsx
- **Verification:** re-screenshot at 1280px + 360px confirms clean even tiles, no overlap, 2-col reflow at 360px.
- **Committed in:** `96bfbfd` (Task 3)

**5. [Rule 1 - Bug] Sparkline used a non-namespace `duration-base` utility**
- **Found during:** Task 2 (motion gate review)
- **Issue:** `motion-safe:duration-base` referenced `--duration-base`, which lives in DESIGN.md's motion block but NOT in Tailwind's `--transition-duration-*` namespace, so the utility silently no-op'd.
- **Fix:** switched to stock `duration-200` + `ease-out` (`--ease-out` IS in the `--ease-*` namespace).
- **Files modified:** packages/design/src/shared/uikit/Sparkline/Sparkline.tsx
- **Verification:** build clean; grow visible; 0 arbitrary values.
- **Committed in:** `96bfbfd` (Task 3)

---

**Total deviations:** 5 auto-fixed (1 missing-critical, 4 bugs). All four bugs were caught by the per-family design-review / lint sweep, exactly the gate's purpose. No scope creep — every fix closes a stated acceptance criterion (never-color-alone Pips, baseline-explicit TierChip, even MiniStatGrid, motion-reduce Sparkline).
**Impact on plan:** all auto-fixes necessary for correctness; the family ships as specified.

## Issues Encountered

- **Worktree path inode (recurring, Wave 0-4):** Read resolves via `.agents/...` but Write/Edit require the `.claude/...` worktree path (same inode/symlink). Used `.claude/`-prefix for all Write/Edit.
- **`vp check --fix` format drift (recurring):** the formatter reformatted my 9 in-scope files (kept) but also touched out-of-scope `.design/support.js`, `AGENTS.md`, `DESIGN.md`, `package.json` (pre-existing drift) — reverted those four before committing; they did not enter any commit.
- **`playwright screenshot` CLI fires before story hydration:** the CLI capture rendered a blank dark frame (no `[data-storyloaded]` wait). Used a small `@playwright/test` chromium script that waits for `[data-storyloaded]` for the design-review captures.
- **design.md lint 86 warnings / errors=0 (recurring tolerance):** all warnings are pre-existing DESIGN.md schema (button/badge sub-tokens, weak-fill self-pairing, unused chart-5/grid-line) — none introduced by KIT-03 (0 arbitrary values across all 5 slices). `chart-5`/`grid-line` remain unused because the tier coloring is semantic, not chart-palette.

## Design Review (per-family, 7 pillars)

**Verdict: APPROVE** (4 findings raised → all fixed → re-reviewed).
- **Pillar 1 (tokens/contrast):** 0 arbitrary / raw-hex across all 5 slices (grep clean); tier color = literal semantic tokens; `design.md lint` errors=0.
- **Pillar 2 (CLS):** StatTile loading = Skeleton tile (identical box); MiniStatGrid empty = reserved placeholder; Sparkline fixed `h-10` proven equal across empty/many (`cls.spec`). All motion is transform/opacity under motion-safe, dropped under motion-reduce.
- **Pillar 3 (a11y / charts):** axe 0 serious/critical on all 14 KIT-03 stories; Sparkline is `<figure>` + `aria-hidden` bars + `sr-only` `<figcaption>` summary; tier color ALWAYS paired with the level word + Pips (never color-alone); StatTile delta paired with trend icon.
- **Pillar 4/5 (states / responsive):** StatTile value-only / +delta / −delta / loading; MiniStatGrid few/many/empty (even, no orphan) reflowing 2-col @360px; TierChip/TierScale all four levels; Sparkline ×4 data-volume. Threshold labels not clipped at 360px.
- **Pillar 6 (domain):** dark-only gunmetal; tabular-mono numerals; mock numbers obey the Score/K-D formulas (Vasiliy #1, Score 4.13 отлично / K/D 3.39 норма) and never outrank the real leaders; Pips discrete meter (1/2/3/4) is the genuine non-color signal; RU+EN natural.
- **Validation Gaps:** CWV (LCP/INP) N/A (static fixture catalog, no fetch/route; CLS 0 by reservation); SEO (Pillar 7) N/A (uikit primitives, not public routes); back/scroll-restore + SSE N/A (no routing/data layer); multi-breakpoint 1920/2560 screenshots — chromium-only locally (reflow proven programmatically @360 + @container).

## Verification (plan `<verify>`)

- ✅ `pnpm exec ladle build` — green (5 KIT-03 slices, 14 stories in meta.json).
- ✅ `pnpm exec playwright test` — **153/153 green** (KIT-03 catalog axe serious/critical=0, 44px, keyboard; Sparkline CLS=0; prior KIT-01/04/07 specs intact).
- ✅ `tests/cls.spec.ts` — Sparkline empty vs many reserve identical height (CLS 0).
- ✅ Root `pnpm check` — **exit 0** (gen-theme idempotent, theme.css no drift; design.md lint errors=0; format 90 files clean; lint 84 files 0 errors).
- ✅ Barrel: `import { StatTile, MiniStatGrid, TierChip, TierScale, Pips, Sparkline } from "@solid-stats/design"` resolves alongside the prior families; helpers/Smoke/_fixtures absent.
- ✅ `grep -rE 'bg-\[|p-\[|text-\[|…|#[0-9A-Fa-f]{6}'` across all 5 slices — **0 arbitrary**.
- ✅ Sparkline: no charting dep imported (recharts/visx/d3 grep = comment only); aria-hidden chart + sr-only figcaption; tier-token fill (no inline hex); motion-reduce gate present.
- ✅ TierChip: `tierFor(metric, value, baseline, period)` with `baseline` passed explicitly.
- ✅ `solidstats-frontend-react-design-review` — **APPROVE** (7 pillars, 4 findings raised+fixed).

## Self-Check: PASSED

- 5/5 key component files present on disk (StatTile/MiniStatGrid/TierChip/TierScale/Sparkline `.tsx`).
- All 3 task commits exist (`8b458a4`, `552b3ad`, `96bfbfd`).
- Verification block: Playwright 153/153; root `pnpm check` exit 0; 0 arbitrary; barrel graduates the 6 KIT-03 names (helpers/Smoke/_fixtures absent).
- STATE.md / ROADMAP.md NOT touched (worktree mode — orchestrator updates after merge).

## Next Phase Readiness

- The KIT-03 stat-primitive family is importable from `@solid-stats/design` — surface-builders of Phases 4+ mount the headline-data vocabulary (hero tiles, mini-grid, tiers, microchart) with all numbers internally consistent via the single fixture source.
- **Tier→token literal map** + **dependency-free CLS-0 Sparkline** + **Pips discrete meter** are durable patterns for the Overview / Player-profile surfaces.
- v1.0 swap is mechanical: `baseline` is already an explicit prop (D-04), values are already props — replace `_fixtures` with the typed `server-2` client; the prop contract (baseline explicit, formatted values in) is the durable interface.
- **Note for KIT-02 (02-06 data-table):** the tier coloring + tabular-mono numerals + Pips meter established here are the per-cell vocabulary the sortable table rows will consume.

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-21*
