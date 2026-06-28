# Phase 4: Public Stats - Overview, Players & Player Profile - Context

**Gathered:** 2026-06-28 (assumptions mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Design the core public-stats trio end-to-end in the durable Ladle catalog: Stats Overview,
Players list, and Player profile. The three surfaces share one loading model, tier system, and
provenance/freshness layer, and must pass the v0.1 design-review gates as real-stack prototypes
in `packages/design`.

**In scope:** Ladle surface prototypes for SURF-01, SURF-02, and SURF-03; shared Phase 4 mock data;
composition of existing UIKIT primitives; the required scenario endings, data-volume states,
responsive behavior, role states, RU/EN strings, data-trust layer, and domain-consistent stats.

**Out of scope:** TanStack Start routes, SSR/data loaders, real `server-2` API wiring, typed
OpenAPI client generation, TanStack Table/Virtual engines, and backend/parser/ingest changes. Those
belong to the v1.0 app milestone.
</domain>

<decisions>
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
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and prior decisions
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria for SURF-01, SURF-02, SURF-03, and
  QUAL gates.
- `.planning/REQUIREMENTS.md` — SURF-01..03 exact requirements, QUAL-01..06, and v0.1 design-only
  boundary.
- `.planning/PROJECT.md` — milestone split, ownership boundary, locked stack, quality bar, and
  design direction.
- `.planning/STATE.md` — current phase position and accumulated decisions from completed phases.
- `.planning/phases/01-workspace-design-system-foundation/01-CONTEXT.md` — workspace, token,
  Ladle, and `.design/` reference boundary decisions.
- `.planning/phases/02-uikit-structural-data-display-primitives/02-CONTEXT.md` — structural/data
  UIKIT decisions, tier/data-trust rules, table visual contract, fixtures, and Phase 4 deferral.
- `.planning/phases/03-uikit-interactive-i18n-global-state-patterns/03-CONTEXT.md` — interactive
  primitives, Lingui harness, `AsyncBoundary`, and global-state decisions.

### Design and domain truth
- `DESIGN.md` — token source of truth and component recipes; no arbitrary values.
- `.design/CLAUDE.md` — binding per-surface design notes, Score/K/D formulas, `SS_BASELINE`, data
  trust A/C model, list loading model, and "Vasiliy stays #1" rule.
- `.design/hifi/Stats Overview.html`, `.design/hifi/overview.jsx`,
  `.design/hifi/data-overview.js` — Overview visual/data reference only; never port code.
- `.design/hifi/Players.html`, `.design/hifi/players.jsx`,
  `.design/hifi/data-players.js` — Players visual/data reference only; never port code.
- `.design/hifi/Player Profile.html`, `.design/hifi/player.jsx`,
  `.design/hifi/data-player.js` — Player Profile visual/data reference only; never port code.
- `.design/hifi/tiers.js` and `.design/hifi/shell.jsx` — tier and shell visual references only.

### Existing implementation seams
- `packages/design/src/shared/uikit/_fixtures/roster.ts` — existing roster, overview players, and
  Score/K/D helpers to extend.
- `packages/design/src/shared/uikit/_fixtures/tiers.ts` — existing `SS_BASELINE` and tier helpers.
- `packages/design/src/shared/uikit/_i18n/catalogs.ts` and
  `packages/design/src/shared/uikit/_i18n/i18n.ts` — current RU/EN Lingui harness.
- `packages/design/src/shared/uikit/AppShell/AppShell.tsx` and
  `packages/design/src/shared/uikit/AppShell/AppShell.stories.tsx` — shared shell and story pattern.
- `packages/design/src/shared/uikit/Table/Table.tsx`,
  `packages/design/src/shared/uikit/Table/AutoTable.tsx`, and
  `packages/design/src/shared/uikit/Table/Table.stories.tsx` — table visual contract and existing
  no-real-engine boundary.
- `packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.tsx` — shared state-to-primitive
  seam for Phases 4-9.
- `packages/design/src/shared/uikit/FreshnessPill/FreshnessPill.tsx` and
  `packages/design/src/shared/uikit/ProvenanceLine/ProvenanceLine.tsx` — data-trust components.
- `packages/design/src/shared/uikit/Select/Select.tsx` and
  `packages/design/src/shared/uikit/Tabs/Tabs.tsx` — existing period/filter and profile-tab
  primitives.
- `packages/design/src/index.ts` — design package public export seam.

### Required skills and standards
- `.agents/skills/solidstats-shared-project-standards/SKILL.md` — GSD, boundaries, docs language,
  and git/session rules.
- `.agents/skills/solidstats-frontend-react-design/SKILL.md` plus
  `references/pipeline.md`, `references/spec-template.md`, and `references/design-system.md` —
  surface design pipeline and acceptance contract.
- `.agents/skills/solidstats-frontend-react-conventions/SKILL.md` plus relevant pattern files:
  `architecture.md`, `component-shape.md`, `domain-rules.md`, `styling.md`, `localization.md`,
  `a11y.md`, and `performance.md`.
- `.agents/skills/solidstats-frontend-react-design-review/SKILL.md` — design-review gate for the
  completed Phase 4 surfaces.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `packages/design/src/shared/uikit/_fixtures/roster.ts` already provides `ROSTER`,
  `OVERVIEW_PLAYERS`, `scoreOf`, and `kdOf`; it is the seed for one shared Phase 4 fixture source.
- `packages/design/src/shared/uikit/_fixtures/tiers.ts` already provides `SS_BASELINE` and
  `tierFor(metric, value, baseline, period)`.
- `AppShell`, `AutoTable` / `Table`, `CompactRow`, `Pagination`, `StatTile`, `MiniStatGrid`,
  `TierChip`, `TierScale`, `Sparkline`, `FreshnessPill`, `ProvenanceLine`, `TrustBadge`,
  `AsyncBoundary`, `Skeleton`, `EmptyState`, `ErrorState`, `Select`, and `Tabs` are the main
  building blocks for Phase 4 surface composition.
- The Lingui `_i18n` harness is already in the design package and should receive any new surface
  strings at RU/EN parity.

### Established Patterns
- v0.1 design work happens in `packages/design` as durable Ladle stories on the real stack.
- `shared/uikit` contains generic primitives only. Domain surfaces should compose those primitives
  without making player/overview/profile concepts part of UIKIT.
- The table family is presentational and virtualization-ready, not backed by TanStack Table/Virtual
  in this milestone.
- Data-trust is visible provenance + freshness + honest Known/Unknown/Conflict where supported; no
  unbacked per-player coverage panel.

### Integration Points
- Phase 4 surfaces connect to the existing design package export seam and Ladle catalog, not to the
  app route tree.
- The shared Phase 4 fixture source connects Overview, Players, and Player Profile so ranks, tiers,
  Score/K/D, freshness, and provenance cannot drift.
- The v1.0 app milestone later graduates these surface compositions into TanStack Start routes and
  replaces fixtures with the typed `server-2` client.
</code_context>

<specifics>
## Specific Ideas

No user corrections or additional product references were added. The binding visual references are
the frozen `.design/hifi/*` files named above; they guide composition and priority, not code.
</specifics>

<deferred>
## Deferred Ideas

- TanStack Start routes, SSR, route metadata, `/ru` / `/en` route wiring, and cache-backed Back
  restoration — v1.0 app milestone.
- Real `server-2` data access, OpenAPI-generated client usage, server-driven filtering/sorting,
  cursor pagination, and SSE freshness wiring — v1.0 app milestone.
- Real TanStack Table / TanStack Virtual integration — v1.0 app milestone.

### Reviewed Todos (not folded)

None — `todo.match-phase 4` returned zero matches.
</deferred>

---

*Phase: 04-public-stats-overview-players-player-profile*
*Context gathered: 2026-06-28*
