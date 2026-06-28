# Phase 04: public-stats-overview-players-player-profile - Research

**Researched:** 2026-06-28  
**Domain:** SolidStats v0.1 public stats surface design in `packages/design` Ladle catalog  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
## Implementation Decisions

### Surface Placement
- **D-01:** Phase 4 adds page/surface-level Ladle slices inside `packages/design`, not
  domain-specific components under `shared/uikit`. The surfaces compose the existing UIKIT
  primitives instead of expanding the primitive catalog with player-specific UI.
- **D-02:** The exact surface directory and export shape is left to the planner, but it must keep
  the UIKIT boundary intact: `shared/uikit` remains generic primitives only, while Overview,
  Players, and Player Profile are surface compositions.

### Shared Data And Tier Model
- **D-03:** Phase 4 uses one canonical mock-data source for Overview, Players, and Player Profile.
  It extends/reuses the existing roster and tier helpers (`ROSTER`, `OVERVIEW_PLAYERS`, `scoreOf`,
  `kdOf`, `SS_BASELINE`, `tierFor`) instead of importing `.design/hifi/*` or creating separate
  per-surface fixtures.
- **D-04:** Mock data must preserve the domain formulas and cross-surface consistency:
  `Score = (kills - TK) / (games + deaths-from-TK)`, `K/D = (kills - TK) / (deaths + deaths-from-TK)`,
  population-derived tiers, and Vasiliy as #1 everywhere.

### Loading, Trust, And Responsive Composition
- **D-05:** The trio shares the existing shell, state, trust, table, and interaction primitives:
  `AppShell`, `AsyncBoundary`, `FreshnessPill`, `ProvenanceLine`, `AutoTable` / `Table`,
  `CompactRow`, `Select`, and `Tabs`.
- **D-06:** Desktop "virtualization" is demonstrated as the existing fixed-height / spacer-row
  visual contract. Real `@tanstack/react-table`, `@tanstack/react-virtual`, server-driven
  filtering/sorting/pagination, and cache-backed Back restoration are documented for v1.0 but are
  not implemented in Phase 4.
- **D-07:** Mobile uses top-N / show-more patterns with no nested scroll and no horizontal scroll.
  Desktop may use capped scroll-in-card with sticky headers. Skeletons must reserve final geometry
  so all three surfaces maintain CLS = 0.

### the agent's Discretion
- The planner may choose the precise surface file layout, story names, and shared fixture module
  names, provided the UIKIT-vs-surface boundary above is preserved.
- The planner may choose how to split the three surfaces into plans and whether to introduce a
  shared Phase 4 surface harness for the scenario/data-volume matrix.

### Deferred Ideas (OUT OF SCOPE)
- TanStack Start routes, SSR, route metadata, `/ru` / `/en` route wiring, and cache-backed Back
  restoration — v1.0 app milestone.
- Real `server-2` data access, OpenAPI-generated client usage, server-driven filtering/sorting,
  cursor pagination, and SSE freshness wiring — v1.0 app milestone.
- Real TanStack Table / TanStack Virtual integration — v1.0 app milestone.
</user_constraints>

## Summary

Phase 04 is a v0.1 design-only phase: build durable Ladle surface prototypes for Stats Overview, Players list, and Player profile in `packages/design`, not TanStack Start routes or real API wiring. [VERIFIED: `.planning/phases/04-public-stats-overview-players-player-profile/04-CONTEXT.md`] The planner should keep all domain surface code outside `shared/uikit`; `shared/uikit` is already the generic primitive catalog and Phase 04 should compose it. [VERIFIED: `AGENTS.md`, `.agents/skills/solidstats-frontend-react-conventions/references/patterns/architecture.md`, `packages/design/src/index.ts`]

The most important planning dependency is the single mock/data model. `packages/design/src/shared/uikit/_fixtures/roster.ts` already defines `ROSTER`, `OVERVIEW_PLAYERS`, `scoreOf`, and `kdOf`; `packages/design/src/shared/uikit/_fixtures/tiers.ts` already defines `SS_BASELINE` and `tierFor`. [VERIFIED: codebase grep] Phase 04 should extend those seeds into one Phase 04 fixture layer for overview/list/profile, preserving Score, K/D, period tier baselines, freshness/provenance, and the invariant that Vasiliy remains rank #1 on every surface. [VERIFIED: `04-CONTEXT.md`, `.design/CLAUDE.md`, codebase grep]

**Primary recommendation:** Plan Phase 04 as five vertical slices: shared Phase 04 fixtures + surface harness, shared shell/state/trust composition, Stats Overview, Players list, Player profile, then a verification sweep. [VERIFIED: `04-CONTEXT.md`, `03-UI-SPEC.md`, `packages/design/tests/*`]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Phase 04 surface prototypes | Design package / Ladle catalog | Browser rendering | v0.1 explicitly ships reviewed Ladle stories in `packages/design`; app routes are deferred. [VERIFIED: `.planning/ROADMAP.md`, `04-CONTEXT.md`] |
| Shared stats mock model | Design package fixtures | Surface stories | Existing roster/tier helpers are internal fixture seeds; surfaces should import one canonical Phase 04 fixture source. [VERIFIED: `roster.ts`, `tiers.ts`, `04-CONTEXT.md`] |
| UI state matrix | Ladle stories | Playwright tests | Existing pattern uses story-level `StateMatrix`, `AsyncBoundary`, and Playwright-against-Ladle gates. [VERIFIED: `03-UI-SPEC.md`, `packages/design/tests/catalog.spec.ts`] |
| Loading/freshness/provenance | UIKIT primitives composed by surfaces | Future v1.0 Query/SSE | `AsyncBoundary`, `FreshnessPill`, `ProvenanceLine`, and `DataTrustBanner` exist now; real Query/SSE is deferred. [VERIFIED: `AsyncBoundary.tsx`, `FreshnessPill.tsx`, `ProvenanceLine.tsx`, `04-CONTEXT.md`] |
| Real routing, SSR, API client, server pagination | v1.0 app milestone | `server-2` API | CONTEXT marks these out of scope for Phase 04. [VERIFIED: `04-CONTEXT.md`] |

## Read First: Current Codebase Patterns

Planner/executor should read these files first, in this order:

| File | Why |
|------|-----|
| `.planning/phases/04-public-stats-overview-players-player-profile/04-CONTEXT.md` | Locked scope, deferred items, and Phase 04 decisions. [VERIFIED: codebase] |
| `.design/CLAUDE.md` | Binding public-stats design rules: formulas, loading model, profile/list composition, no mobile nested scroll. [VERIFIED: codebase] |
| `packages/design/src/shared/uikit/_fixtures/roster.ts` | Existing canonical roster, formulas, overview players, Vasiliy invariant seed. [VERIFIED: codebase] |
| `packages/design/src/shared/uikit/_fixtures/tiers.ts` | Existing population tier baseline and `tierFor` helper. [VERIFIED: codebase] |
| `packages/design/src/shared/uikit/AppShell/AppShell.tsx` | Shared shell, landmarks, container width, desktop/mobile nav reflow. [VERIFIED: codebase] |
| `packages/design/src/shared/uikit/Table/{AutoTable,Table,TableRow}.tsx` | Desktop table visual virtualization, fixed geometry, spacer-row contract. [VERIFIED: codebase] |
| `packages/design/src/shared/uikit/CompactRow/CompactRow.tsx` | Mobile top-N/show-more pattern with no nested scroll. [VERIFIED: codebase] |
| `packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.tsx` | Shared loading/empty/error/offline/stale seam. [VERIFIED: codebase] |
| `packages/design/src/shared/uikit/{FreshnessPill,ProvenanceLine}/` | Data-trust layer primitives. [VERIFIED: codebase] |
| `packages/design/src/shared/uikit/{Select,Tabs}/` | Period/filter and profile tab primitives. [VERIFIED: codebase] |
| `packages/design/tests/{catalog,cls,responsive}.spec.ts` | Existing verification harness to extend for Phase 04 stories. [VERIFIED: codebase] |

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SURF-01 | Stats Overview: tables/leaderboards/microcharts with entry points to players, squads, rotations, commander, bounty. | Compose `AppShell`, `StatTile`, `MiniStatGrid`, `AutoTable`, `Sparkline`, `FreshnessPill`, and `ProvenanceLine`; use one fixture source. [VERIFIED: `REQUIREMENTS.md`, `packages/design/src/index.ts`] |
| SURF-02 | Players list: search/filter, tier-colored columns, period selector, loading model, virtualized desktop / top-N mobile. | Use `Select`, `AutoTable` spacer-row visual contract, `CompactList`, `AsyncBoundary`, and period-aware `tierFor`. [VERIFIED: `REQUIREMENTS.md`, `AutoTable.tsx`, `CompactRow.tsx`, `tiers.ts`] |
| SURF-03 | Player profile: identity + nick history, hero stats, squad/status, tabs, provenance. | Use full-width stacked sections, `StatTile`, `MiniStatGrid`, `Tabs`, `FreshnessPill`, `ProvenanceLine`, and fixture identity/history data. [VERIFIED: `REQUIREMENTS.md`, `.design/CLAUDE.md`, `Tabs.tsx`] |
| QUAL-01 | ×5 scenario endings and ×4 data-volume states. | Reuse `StateMatrix` and story-specific matrix sections; existing stories already model these gates. [VERIFIED: `03-UI-SPEC.md`, `Table.stories.tsx`] |
| QUAL-02 | Responsive behavior at real breakpoints and mobile floor. | Existing responsive gate covers 360/390/414/768/1024/1280/1920/2560/3440. [VERIFIED: `packages/design/tests/responsive.spec.ts`] |
| QUAL-03 | WCAG 2.2 AA, axe clean, keyboard, 44px, never color-alone. | Existing catalog spec iterates every Ladle story for axe, target size, and keyboard reachability. [VERIFIED: `packages/design/tests/catalog.spec.ts`] |
| QUAL-04 | CLS = 0. | Existing primitives have CLS tests; Phase 04 needs new surface-level geometry checks for overview/list/profile loading/final swaps. [VERIFIED: `packages/design/tests/cls.spec.ts`] |
| QUAL-05 | RU + EN, all strings i18n-keyed, RU sanity-checked. | Lingui runtime harness and catalog parity are already in `packages/design/src/shared/uikit/_i18n`. [VERIFIED: `03-01-SUMMARY.md`, `catalogs.ts`] |
| QUAL-06 | Mock data consistent with Score/K/D, tiers, data-trust model. | Existing roster/tier tests and helpers are the source; planner should add Phase 04 fixture invariants. [VERIFIED: `roster.ts`, `tiers.ts`, `04-CONTEXT.md`] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- `web` owns frontend, UI state, and typed API consumption only; it must not access DB/S3 or bypass the typed API client. [VERIFIED: `AGENTS.md`]
- Internal repo docs and GSD `.planning/**` artifacts are English, regardless of Russian chat language. [VERIFIED: `AGENTS.md`]
- For this v0.1 milestone, no routes, data wiring, SSR app, or real API client work belongs in Phase 04. [VERIFIED: `.planning/ROADMAP.md`, `04-CONTEXT.md`]
- Use skills first; SolidStats conventions outrank legacy surrounding code. [VERIFIED: `AGENTS.md`, `solidstats-shared-project-standards/SKILL.md`]
- Do not expand `shared/uikit` with player-specific components; keep UIKIT generic and put surfaces in a separate design/surface area. [VERIFIED: `04-CONTEXT.md`, `architecture.md`]
- Token source is `DESIGN.md`; `packages/design/src/styles/theme.css` is generated and must not be hand-edited. [VERIFIED: `AGENTS.md`, `DESIGN.md`, `theme.css` header]
- Use Tailwind v4 token utilities, `tailwind-variants/lite`, Lucide icons, dark-only theme, no arbitrary values, and no color-only meaning. [VERIFIED: `styling.md`, `DESIGN.md`]
- Git commit is not authorized by this research task despite `commit_docs: true`; project standards require explicit user instruction before commits. [VERIFIED: `solidstats-shared-project-standards/SKILL.md`]

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.0 | Component runtime for design package stories | Existing package dependency. [VERIFIED: `packages/design/package.json`] |
| `@ladle/react` | 5.1.1 | Durable component/surface catalog and Playwright target | Existing v0.1 delivery vehicle. [VERIFIED: `package.json`, `packages/design/package.json`, `.planning/ROADMAP.md`] |
| Tailwind CSS | 4.3.1 | Token-backed styling via generated `@theme` | Existing design system stack. [VERIFIED: `package.json`, `theme.css`] |
| `tailwind-variants` | 3.2.2 | Component recipes via `/lite` merge-free build | Existing recipe pattern across UIKIT. [VERIFIED: `packages/design/package.json`, `styling.md`] |
| `@ark-ui/react` | 5.37.2 | Headless accessible interactive primitives | Existing Phase 3 dependency for Select/Tabs/Dialog/Menu/etc. [VERIFIED: `packages/design/package.json`, `03-01-SUMMARY.md`] |
| `@lingui/core`, `@lingui/react` | 6.4.0 | Runtime ICU i18n harness for RU/EN stories | Existing Phase 3 i18n seam. [VERIFIED: `packages/design/package.json`, `catalogs.ts`] |
| `lucide-react` | 1.21.0 | Only icon set | Existing dependency and design rule. [VERIFIED: `packages/design/package.json`, `DESIGN.md`] |

### Supporting
| Library / Tool | Version | Purpose | When to Use |
|----------------|---------|---------|-------------|
| Vitest | 4.1.9 | Pure helper/fixture invariant tests | Use for Score/K/D, tier, fixture consistency, and helper logic. [VERIFIED: `packages/design/package.json`, `solidstats-frontend-react-tests/SKILL.md`] |
| Playwright | 1.61.0 | Ladle story gates and critical interactions | Use for axe, keyboard, responsive, CLS, and story-level journeys. [VERIFIED: `packages/design/package.json`, `playwright.config.ts`] |
| `@axe-core/playwright` | 4.11.3 | Accessibility scanning | Existing catalog gate blocks serious/critical violations. [VERIFIED: `packages/design/package.json`, `catalog.spec.ts`] |
| `@google/design.md` | 0.3.0 | Design token lint/diff | Use for `DESIGN.md` lint; theme generation remains project script. [VERIFIED: `package.json`, `design-system.md`] |
| Vite+ `vp check` | ^0.2.1 | Format/lint/check gate | Root `pnpm check` uses it after token generation and design lint. [VERIFIED: `package.json`] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Presentational `AutoTable` + spacer-row visual contract | `@tanstack/react-table` + `@tanstack/react-virtual` | Real engines are explicitly deferred to v1.0; Phase 04 should only demonstrate visual virtualization. [VERIFIED: `04-CONTEXT.md`, `Table.tsx`] |
| Fixture-driven Ladle stories | TanStack Start routes/loaders | Routes/SSR/API are out of scope for v0.1. [VERIFIED: `04-CONTEXT.md`, `.planning/ROADMAP.md`] |
| Existing `StateMatrix`/Playwright gates | Manual screenshots only | Existing automated harness already covers axe, keyboard, responsive, and CLS primitives. [VERIFIED: `packages/design/tests/*`] |

**Installation:** No new packages are recommended for Phase 04. [VERIFIED: `04-CONTEXT.md`, `packages/design/package.json`]

## Package Legitimacy Audit

No external packages should be installed in Phase 04. [VERIFIED: `04-CONTEXT.md`] Existing Phase 3 packages were already installed and recorded in Phase 3 summaries. [VERIFIED: `03-01-SUMMARY.md`]

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| none | — | — | — | — | — | No install planned. [VERIFIED: `04-CONTEXT.md`] |

**Packages removed due to [SLOP] verdict:** none. [VERIFIED: no Phase 04 install planned]  
**Packages flagged as suspicious [SUS]:** none. [VERIFIED: no Phase 04 install planned]

## Architecture Patterns

### System Architecture Diagram

```text
Canonical Phase 4 fixture source
  -> derived stats helpers: scoreOf / kdOf / tierFor / provenance / freshness
  -> shared surface harness: AppShell + i18n + AsyncBoundary + StateMatrix
  -> Stats Overview story
       -> entry links/affordances to players/squads/rotations/commander/bounty
  -> Players list story
       -> period selector -> loading branch decision -> AutoTable desktop OR CompactList mobile
  -> Player profile story
       -> identity -> hero Score/K/D -> stacked sections -> Tabs history/replays/bounty
  -> Playwright/Vitest gates
       -> fixture invariants, axe, keyboard, responsive widths, CLS, RU/EN parity
```

### Recommended Project Structure

```text
packages/design/src/surfaces/public-stats/
├── _fixtures/                  # Phase 04 canonical mock graph; imports roster/tiers seeds
├── _harness/                   # optional story helpers: shell, state/data-volume matrices
├── StatsOverview/
├── PlayersList/
├── PlayerProfile/
└── index.ts                    # optional surface-level barrel, not shared/uikit
```

Use a surface directory under `packages/design/src`, not `packages/design/src/shared/uikit`, because player/profile concepts are domain surfaces rather than generic UI primitives. [VERIFIED: `04-CONTEXT.md`, `architecture.md`]

### Pattern 1: Single Fixture Graph
**What:** Build one Phase 04 fixture graph from existing `ROSTER`, `OVERVIEW_PLAYERS`, `scoreOf`, `kdOf`, `SS_BASELINE`, and `tierFor`. [VERIFIED: `roster.ts`, `tiers.ts`]  
**When to use:** Every surface story, every surface test, and every data-volume state. [VERIFIED: `04-CONTEXT.md`]  
**Planner task:** Add Vitest invariants: Vasiliy rank #1 in overview/list/profile; every rendered score and K/D equals the formulas; tier values derive from `SS_BASELINE.by[period]`; no generated tail player outranks the top seed. [VERIFIED: `04-CONTEXT.md`, `.design/CLAUDE.md`]

### Pattern 2: Surface Stories Compose UIKIT
**What:** Compose `AppShell`, `AutoTable`, `CompactList`, `StatTile`, `MiniStatGrid`, `Sparkline`, `FreshnessPill`, `ProvenanceLine`, `Select`, `Tabs`, and `AsyncBoundary` from the public package barrel. [VERIFIED: `packages/design/src/index.ts`]  
**When to use:** All three Phase 04 surfaces. [VERIFIED: `04-CONTEXT.md`]  
**Planner task:** Prefer stories that are full-page surface prototypes, plus focused matrix stories for endings/data volumes where needed. [VERIFIED: `solidstats-frontend-react-design/references/pipeline.md`, `03-UI-SPEC.md`]

### Pattern 3: Loading Model as Explicit State Matrix
**What:** Model rotation as instant ready; all-time as warm instant, cold aggregate skeleton, and in-session short skeleton. [VERIFIED: `.design/CLAUDE.md`, `04-CONTEXT.md`]  
**When to use:** Players list period selector and shared surface harness. [VERIFIED: `SURF-02` requirement]  
**Planner task:** Encode these as story controls/fixtures rather than client fetch logic. [VERIFIED: v0.1 design-only boundary in `04-CONTEXT.md`]

### Pattern 4: Desktop Table vs Mobile Top-N
**What:** Desktop may show capped scroll-in-card with sticky header and spacer rows; mobile uses `CompactList` top-N with show-more, no nested scroll and no horizontal scroll. [VERIFIED: `04-CONTEXT.md`, `CompactRow.tsx`, `.design/CLAUDE.md`]  
**When to use:** Players list and any Overview leaderboard/table. [VERIFIED: `SURF-01`, `SURF-02`]  
**Planner task:** Verify 360/390/414 widths for no overflow and use surface-level Playwright assertions for show-more labels. [VERIFIED: `responsive.spec.ts`]

### Pattern 5: Profile as Full-Width Stacked Sections
**What:** Identity, hero Score/K/D, provenance/freshness, squad/status, and tabs stack vertically; avoid mismatched side columns. [VERIFIED: `.design/CLAUDE.md`]  
**When to use:** Player profile. [VERIFIED: `SURF-03`]  
**Planner task:** Keep headline data high; do not bury Score/K/D or provenance below history. [VERIFIED: `.design/CLAUDE.md`]

### Anti-Patterns to Avoid
- **Adding player-specific widgets to `shared/uikit`:** violates the UIKIT boundary. [VERIFIED: `04-CONTEXT.md`, `architecture.md`]
- **Importing `.design/hifi/*`:** frozen hi-fi is visual reference only. [VERIFIED: `04-CONTEXT.md`, `.planning/REQUIREMENTS.md`]
- **Hardcoding tier cutoffs in surfaces:** tiers must derive from `SS_BASELINE` with explicit period. [VERIFIED: `tiers.ts`, `.design/CLAUDE.md`]
- **Real API/router implementation in Phase 04:** out of scope. [VERIFIED: `04-CONTEXT.md`]
- **Mobile nested scroll:** explicitly banned; use top-N/show-more. [VERIFIED: `04-CONTEXT.md`, `.design/CLAUDE.md`]
- **Skeletons with different final geometry:** breaks QUAL-04. [VERIFIED: `cls.spec.ts`, `AsyncBoundary.tsx`]

## Proposed Vertical MVP Slices

| Slice | Scope | Acceptance Focus |
|-------|-------|------------------|
| 04-01 Shared fixture/model/harness | Create Phase 04 canonical fixtures, derived view models, i18n key additions, story harness. | Vitest invariants for Score/K/D/tier/Vasiliy/provenance consistency; RU/EN key parity. [VERIFIED: `04-CONTEXT.md`, `roster.ts`, `tiers.ts`] |
| 04-02 Shared shell/loading/trust composition | Compose `AppShell`, `AsyncBoundary`, freshness/provenance, period controls, and state/data-volume matrix helpers. | Story harness proves ×5 endings and shared loading states without adding route/API logic. [VERIFIED: `03-UI-SPEC.md`, `AsyncBoundary.tsx`] |
| 04-03 Stats Overview | Tables/leaderboards/microcharts and entry affordances to later public stats areas. | SURF-01, no horizontal overflow, data trust visible, overview top players match fixture graph. [VERIFIED: `REQUIREMENTS.md`] |
| 04-04 Players list | Search/filter/period selector, desktop table visual virtualization, mobile top-N/show-more. | SURF-02, loading model matrix, no mobile horizontal scroll, CLS loading/final equality. [VERIFIED: `04-CONTEXT.md`, `.design/CLAUDE.md`] |
| 04-05 Player profile | Identity/nick history, hero Score/K/D, squad/status, tabs, provenance/freshness. | SURF-03, stacked layout, headline data high, tabs keyboard-operable. [VERIFIED: `.design/CLAUDE.md`, `Tabs.tsx`] |
| 04-06 Verification sweep | Playwright/Vitest additions and design-review readiness. | QUAL-01..06 mapped to automated checks plus visual-review checklist. [VERIFIED: `packages/design/tests/*`, `solidstats-frontend-react-tests/SKILL.md`] |

## Shared Data / Mock Strategy

- Create one Phase 04 domain fixture module that imports from `_fixtures/roster.ts` and `_fixtures/tiers.ts`, then exports surface-ready data for Overview, Players, and Profile. [VERIFIED: `04-CONTEXT.md`, `roster.ts`, `tiers.ts`]
- Keep raw counters and derived values together enough for tests to recompute `scoreOf` and `kdOf`; do not freeze derived strings only. [VERIFIED: `roster.ts`]
- Period-specific tiering must pass `period` explicitly to `tierFor(metric, value, SS_BASELINE, period)`. [VERIFIED: `tiers.ts`, `.design/CLAUDE.md`]
- Provenance should be present on every surface as replay count + freshness + "how computed" affordance; avoid the unsupported per-player coverage/conflict panel. [VERIFIED: `.design/CLAUDE.md`, `ProvenanceLine.tsx`]
- Vasiliy must be #1 in Overview, Players list, and Player profile hero context. [VERIFIED: `04-CONTEXT.md`, `roster.ts` comments]
- Data-volume fixtures should include empty, few, many, and limit-reached states for each list/table/field. [VERIFIED: `REQUIREMENTS.md`, `03-UI-SPEC.md`]

## UI / Accessibility / i18n / Responsive Constraints

- Build pages as full-width stacked sections and avoid two mismatched-height columns. [VERIFIED: `.design/CLAUDE.md`]
- Use real project breakpoints: 360, 390, 414, 768, 1024, 1280, 1920, 2560, and 3440 cap-check. [VERIFIED: `responsive.spec.ts`, `design-system.md`]
- Use container-driven reflow where components adapt; existing `AppShell`, `AutoTable`, and `CompactList` already model this. [VERIFIED: `AppShell.tsx`, `AutoTable.tsx`, `CompactRow.tsx`]
- Every interactive control must be keyboard-reachable, visible focus, named, and at least 44x44. [VERIFIED: `a11y.md`, `catalog.spec.ts`]
- Meaning must never be color-only; tier values use pips/labels and freshness uses icon+text. [VERIFIED: `FreshnessPill.tsx`, `TableRow.tsx`, `a11y.md`]
- Every string resolves through the existing Lingui runtime in stories/surfaces; shared primitives remain i18n-free. [VERIFIED: `03-01-SUMMARY.md`, `catalogs.ts`, `packages/design/src/index.ts`]
- RU copy needs visual sanity checks for narrow containers and long labels. [VERIFIED: `REQUIREMENTS.md`, `03-UI-SPEC.md`]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Generic shell/nav | Custom page chrome | `AppShell` | Existing landmark, skip-link, responsive nav contract. [VERIFIED: `AppShell.tsx`] |
| Async/loading/empty/error/offline/stale | Per-surface state wrappers | `AsyncBoundary` + existing feedback/data-trust primitives | Single SURF-18 seam already exists and has CLS tests. [VERIFIED: `AsyncBoundary.tsx`, `cls.spec.ts`] |
| Table geometry | Bespoke table/card layout | `AutoTable`, `Table`, `TableRow`, `CompactList` | Existing sticky-header, reserved-height, spacer-row, and mobile no-scroll contracts. [VERIFIED: `Table.tsx`, `CompactRow.tsx`] |
| Tier derivation | Fixed thresholds in UI | `tierFor` with `SS_BASELINE` | Population-derived tiers are existing fixture contract. [VERIFIED: `tiers.ts`] |
| Score/K/D math | Inline ad hoc formulas | `scoreOf`, `kdOf` and invariant tests | Existing formulas are canonical and already documented. [VERIFIED: `roster.ts`] |
| Tabs/select interactions | Custom tab/select widgets | `Tabs`, `Select` | Ark UI owns keyboard/focus behavior. [VERIFIED: `Tabs.tsx`, `Select.tsx`, `03-UI-SPEC.md`] |
| Microcharts | Heavy chart library | `Sparkline` | Existing dependency-free microchart primitive fits overview/list needs. [VERIFIED: `packages/design/src/index.ts`] |

**Key insight:** Phase 04 is a composition phase, not a primitive/framework phase; most risk is fixture drift, layout overflow, and incomplete state matrices, not missing libraries. [VERIFIED: `04-CONTEXT.md`, `03-UI-SPEC.md`]

## Common Pitfalls

### Pitfall 1: Accidentally Building v1.0 App Work
**What goes wrong:** Planner adds routes, loaders, API clients, TanStack Table/Virtual, or real pagination. [VERIFIED: `04-CONTEXT.md`]  
**How to avoid:** Keep tasks in `packages/design` Ladle stories and document real engines as v1.0 follow-up only. [VERIFIED: `.planning/ROADMAP.md`]

### Pitfall 2: Fixture Drift Between Three Surfaces
**What goes wrong:** Overview rank, Players rank, and Profile hero show inconsistent Score/K/D/tier values. [VERIFIED: `04-CONTEXT.md`]  
**How to avoid:** One fixture graph plus Vitest invariants. [VERIFIED: `roster.ts`, `tiers.ts`]

### Pitfall 3: False Virtualization
**What goes wrong:** Story claims virtualization but renders an uncontrolled long DOM or introduces a real virtualizer. [VERIFIED: `04-CONTEXT.md`]  
**How to avoid:** Demonstrate fixed-height viewport + spacer rows visually; name it "visual contract" in story comments. [VERIFIED: `Table.tsx`]

### Pitfall 4: Mobile Nested Scroll or Horizontal Overflow
**What goes wrong:** Desktop table pattern is reused on 360px mobile. [VERIFIED: `.design/CLAUDE.md`]  
**How to avoid:** Use `CompactList` top-N/show-more on mobile and add surface responsive tests. [VERIFIED: `CompactRow.tsx`, `responsive.spec.ts`]

### Pitfall 5: Trust Layer Reduced to a Badge
**What goes wrong:** Provenance/freshness appears only once or as decoration. [VERIFIED: `.design/CLAUDE.md`]  
**How to avoid:** Put `ProvenanceLine` + `FreshnessPill` near headline stats and table headers where relevant. [VERIFIED: `ProvenanceLine.tsx`, `FreshnessPill.tsx`]

### Pitfall 6: Hardcoded RU/EN or Awkward RU
**What goes wrong:** Surface copy bypasses Lingui or clips in narrow states. [VERIFIED: `localization.md`, `REQUIREMENTS.md`]  
**How to avoid:** Add keys to the existing catalog seed and run RU/EN story checks. [VERIFIED: `catalogs.ts`, `i18n-toggle.spec.ts`]

## Code Examples

### Recompute Derived Stats in Tests
```ts
// Source: packages/design/src/shared/uikit/_fixtures/roster.ts
expect(player.score).toBe(scoreOf(player));
expect(player.kd).toBe(kdOf(player));
```

### Period-Aware Tier Derivation
```ts
// Source: packages/design/src/shared/uikit/_fixtures/tiers.ts
const scoreTier = tierFor("score", player.score, SS_BASELINE, period);
const kdTier = tierFor("kd", player.kd, SS_BASELINE, period);
```

### Surface Loading Branch
```tsx
// Source: packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.tsx
<AsyncBoundary
  state={{
    kind: "loading",
    columns: [56, 200, 120, 132, 132],
    rows: 10,
    density: "comfortable",
    label: loadingLabel,
  }}
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Frozen `.design/hifi/*` as implementation source | Build fresh in `packages/design` on real stack | v0.1 roadmap | Planner must use hi-fi only as visual reference. [VERIFIED: `REQUIREMENTS.md`, `04-CONTEXT.md`] |
| Hand-maintained CSS theme | `DESIGN.md` -> `scripts/gen-theme.mjs` -> `theme.css` | Phase 1 | Planner must not hand-edit generated theme. [VERIFIED: `theme.css`, `STATE.md`] |
| Placeholder strings | Lingui runtime harness with RU/EN catalogs | Phase 3 | Surface copy should resolve through `i18n._`. [VERIFIED: `03-01-SUMMARY.md`, `catalogs.ts`] |
| Ad hoc global states | `AsyncBoundary` state-to-primitive seam | Phase 3 | Surface loading/error/offline/stale states should share one model. [VERIFIED: `AsyncBoundary.tsx`] |
| User density toggle | Container-derived `AutoTable` density | Phase 2 gap closure | Surfaces should not reintroduce a density toggle. [VERIFIED: `AutoTable.tsx`, `STATE.md`] |

**Deprecated/outdated:**
- Raw `.design/hifi` code imports: out of scope and explicitly forbidden. [VERIFIED: `04-CONTEXT.md`]
- Real `@tanstack/react-table` / `@tanstack/react-virtual` in Phase 04: deferred to v1.0. [VERIFIED: `04-CONTEXT.md`]
- Per-surface duplicate mock fixtures: conflicts with D-03/D-04. [VERIFIED: `04-CONTEXT.md`]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Research validity date is estimated as 30 days. [ASSUMED] | Metadata | Planner may rely on stale package/tooling context if Phase 04 is planned much later. |

## Open Questions (RESOLVED)

1. **Exact surface directory name**
   - What we know: surfaces must live in `packages/design`, outside `shared/uikit`. [VERIFIED: `04-CONTEXT.md`]
   - Resolution: use `packages/design/src/surfaces/public-stats/` for all Phase 4 surface code, including `_fixtures`, `_harness`, `StatsOverview`, `PlayersList`, `PlayerProfile`, and the internal surface barrel. [VERIFIED: architecture boundary, `04-01-PLAN.md`..`04-05-PLAN.md`]

2. **Whether to export surfaces from package root**
   - What we know: UIKIT exports from `packages/design/src/index.ts`; fixtures/helpers with underscore prefix stay internal. [VERIFIED: `packages/design/src/index.ts`]
   - Resolution: keep a public-stats surface barrel internal at `packages/design/src/surfaces/public-stats/index.ts`; do not export Phase 4 surfaces from `packages/design/src/index.ts` unless a concrete Phase 4 import requires the package-root seam. [VERIFIED: UIKIT boundary, `04-05-PLAN.md`]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node | package scripts | Required by engines | >=25 <26 in package metadata | Planner should keep existing engine. [VERIFIED: `package.json`] |
| pnpm | workspace scripts | Required by package manager metadata | 11.6.0 in metadata | None for repo workflow. [VERIFIED: `package.json`] |
| Ladle | surface stories | Yes | 5.1.1 | None; v0.1 delivery target. [VERIFIED: `packages/design/package.json`] |
| Vitest | fixture logic tests | Yes | 4.1.9 | None needed. [VERIFIED: `packages/design/package.json`] |
| Playwright | story gates | Yes | 1.61.0 | None needed. [VERIFIED: `packages/design/package.json`] |
| Graphify | graph context | Not available in this run | disabled | Continue with direct code/docs reads. [VERIFIED: `gsd-tools graphify status`] |

**Missing dependencies with no fallback:** none for planning. [VERIFIED: package metadata]  
**Missing dependencies with fallback:** graphify disabled; direct repo reads were used. [VERIFIED: `gsd-tools graphify status`]

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.9 + Playwright 1.61.0 + axe via `@axe-core/playwright` 4.11.3. [VERIFIED: `packages/design/package.json`] |
| Config file | `packages/design/playwright.config.ts`; Vitest config is in package tooling. [VERIFIED: `playwright.config.ts`, `packages/design/package.json`] |
| Quick run command | `pnpm --filter @solid-stats/design test` [VERIFIED: `.planning/config.json`, `packages/design/package.json`] |
| Full suite command | `pnpm check && pnpm --filter @solid-stats/design test && pnpm --filter @solid-stats/design test:e2e` [VERIFIED: `package.json`, `packages/design/package.json`] |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| SURF-01 | Overview renders leaderboards/microcharts/entrypoints with consistent data | Playwright story + Vitest fixture invariants | `pnpm --filter @solid-stats/design test && pnpm --filter @solid-stats/design test:e2e` | ❌ Wave 0 |
| SURF-02 | Players list loading, desktop visual virtualization, mobile top-N | Playwright responsive/CLS + Vitest fixture invariants | same | ❌ Wave 0 |
| SURF-03 | Player profile stacked layout, tabs, provenance/freshness | Playwright story/keyboard + Vitest fixture invariants | same | ❌ Wave 0 |
| QUAL-01 | ×5 endings and ×4 data volumes | Playwright stories | same | ❌ Wave 0 |
| QUAL-02 | breakpoint behavior/no horizontal scroll | Playwright responsive | same | ✅ existing harness, ❌ Phase 04 stories |
| QUAL-03 | axe/keyboard/44px | Playwright catalog spec | same | ✅ existing harness |
| QUAL-04 | CLS loading/final equality | Playwright CLS spec | same | ✅ existing primitive harness, ❌ Phase 04 surface checks |
| QUAL-05 | RU/EN parity and natural copy | Vitest + Playwright visual/manual sanity | same | ✅ existing i18n harness, ❌ Phase 04 keys |
| QUAL-06 | mock formula/tier consistency | Vitest | `pnpm --filter @solid-stats/design test` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm --filter @solid-stats/design test` plus targeted Playwright spec for touched story. [VERIFIED: `solidstats-frontend-react-tests/SKILL.md`]
- **Per wave merge:** `pnpm check && pnpm --filter @solid-stats/design test:e2e`. [VERIFIED: existing scripts]
- **Phase gate:** Full suite green and design-review at required breakpoints before `$gsd-verify-work`. [VERIFIED: `REQUIREMENTS.md`, design skill]

### Wave 0 Gaps
- [ ] `packages/design/src/surfaces/public-stats/_fixtures/*.test.ts` — covers Score/K/D/tier/Vasiliy/provenance invariants. [VERIFIED: no existing Phase 04 surface files]
- [ ] `packages/design/tests/public-stats-responsive.spec.ts` — covers Overview/Players/Profile no-overflow and mobile top-N. [VERIFIED: existing responsive pattern]
- [ ] `packages/design/tests/public-stats-cls.spec.ts` — covers Players all-time cold skeleton and profile/overview loading/final geometry. [VERIFIED: existing CLS pattern]
- [ ] Phase 04 story ids added to existing catalog via Ladle metadata so `catalog.spec.ts` auto-runs axe/44px/keyboard. [VERIFIED: `catalog.spec.ts`]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no for Phase 04 | Public design-only surfaces; auth routes are deferred. [VERIFIED: `04-CONTEXT.md`] |
| V3 Session Management | no for Phase 04 | No session implementation in v0.1 design surfaces. [VERIFIED: `04-CONTEXT.md`] |
| V4 Access Control | no for Phase 04 | Role-sensitive route/data gates are v1.0; public surfaces only. [VERIFIED: `04-CONTEXT.md`] |
| V5 Input Validation | yes, low | Search/filter/period controls are story-state only now; future route search uses `zod/v4-mini`. [VERIFIED: `routing.md`, `04-CONTEXT.md`] |
| V6 Cryptography | no | No crypto/secrets in design-only stories. [VERIFIED: `04-CONTEXT.md`] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Treating fixture/profile links as real trusted URLs | Spoofing / Tampering | Use inert story links or known safe hrefs; no real external fetch/previews in Phase 04. [VERIFIED: v0.1 boundary] |
| Full SteamID exposure | Information Disclosure | Public UI masks SteamID to last four when SteamID appears. [VERIFIED: `domain-rules.md`] |
| Raw backend/error strings in design states | Information Disclosure | Use localized stable copy and debug IDs only. [VERIFIED: `errors.md`, `AsyncBoundary.tsx`] |
| Future search/filter URL state not validated | Tampering | v1.0 route search params use typed `validateSearch` with `zod/v4-mini`. [VERIFIED: `routing.md`] |

## Sources

### Primary (HIGH confidence)
- `AGENTS.md` - repo boundary, documentation language, skills-first, design pipeline. [VERIFIED: codebase]
- `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md` - v0.1 milestone, Phase 04 scope, requirements, completed Phase 3 context. [VERIFIED: codebase]
- `.planning/phases/04-public-stats-overview-players-player-profile/04-CONTEXT.md` - locked Phase 04 decisions. [VERIFIED: codebase]
- `.planning/phases/03-uikit-interactive-i18n-global-state-patterns/03-UI-SPEC.md` and summaries - Phase 3 delivered seams and design precedent. [VERIFIED: codebase]
- `DESIGN.md`, `packages/design/src/styles/theme.css` - token system and generated theme. [VERIFIED: codebase]
- `packages/design/src/shared/uikit/**` - current UIKIT primitives and tests. [VERIFIED: codebase]
- `.agents/skills/solidstats-frontend-react-conventions/**`, `.agents/skills/solidstats-frontend-react-design/**`, `.agents/skills/solidstats-frontend-react-tests/SKILL.md` - project conventions. [VERIFIED: codebase]

### Secondary (MEDIUM confidence)
- `.planning/intel/API-SURFACE.md` - checked but empty/incomplete; not used as an authoritative source. [VERIFIED: codebase]

### Tertiary (LOW confidence)
- None. [VERIFIED: no web search used]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - versions read from committed package metadata. [VERIFIED: `package.json`, `packages/design/package.json`]
- Architecture: HIGH - Phase 04 context and conventions explicitly define design-only package boundary. [VERIFIED: `04-CONTEXT.md`, `architecture.md`]
- Pitfalls: HIGH - derived from locked Phase 04 decisions, `.design/CLAUDE.md`, and existing primitive/test contracts. [VERIFIED: codebase]

**Research date:** 2026-06-28  
**Valid until:** 2026-07-28 for v0.1 planning, unless Phase 04 context or package versions change. [ASSUMED]
