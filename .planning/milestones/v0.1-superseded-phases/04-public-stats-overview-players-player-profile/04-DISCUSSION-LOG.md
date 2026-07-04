# Phase 4: Public Stats - Overview, Players & Player Profile - Discussion Log (Assumptions Mode)

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the analysis.

**Date:** 2026-06-28
**Phase:** 04-public-stats-overview-players-player-profile
**Mode:** assumptions
**Areas analyzed:** Surface Placement, Shared Data And Tier Model, Loading, Trust, And Responsive Composition

## Assumptions Presented

### Surface Placement

| Assumption | Confidence | Evidence |
|------------|------------|----------|
| Phase 4 should add page/surface-level Ladle slices inside `packages/design`, not new domain-specific components under `shared/uikit`; those surfaces should compose existing UIKIT primitives. | Confident | `.planning/ROADMAP.md`, `.planning/phases/02-uikit-structural-data-display-primitives/02-CONTEXT.md`, `.agents/skills/solidstats-frontend-react-conventions/references/patterns/architecture.md`, `packages/design/src/shared/uikit/` |

### Shared Data And Tier Model

| Assumption | Confidence | Evidence |
|------------|------------|----------|
| Build one Phase 4 mock-data source that extends/reuses the existing roster and tier helpers as the canonical source for Overview, Players, and Player Profile; do not import `.design/hifi/*` or create separate per-surface fixtures. | Confident | `packages/design/src/shared/uikit/_fixtures/roster.ts`, `packages/design/src/shared/uikit/_fixtures/tiers.ts`, `.design/CLAUDE.md`, `.planning/ROADMAP.md` |

### Loading, Trust, And Responsive Composition

| Assumption | Confidence | Evidence |
|------------|------------|----------|
| The trio should share `AppShell`, `AsyncBoundary`, `FreshnessPill`, `ProvenanceLine`, `AutoTable/Table`, `CompactRow`, `Select`, and `Tabs`; desktop "virtualization" should be demonstrated as the existing fixed-height/spacer visual contract, while real TanStack virtual/data engines stay out of Phase 4. | Confident | `packages/design/src/shared/uikit/AppShell/AppShell.tsx`, `packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.tsx`, `packages/design/src/shared/uikit/FreshnessPill/FreshnessPill.tsx`, `packages/design/src/shared/uikit/ProvenanceLine/ProvenanceLine.tsx`, `packages/design/src/shared/uikit/Table/Table.tsx`, `packages/design/src/shared/uikit/Table/AutoTable.tsx`, `.design/CLAUDE.md` |

## Corrections Made

No corrections — all assumptions confirmed.

## External Research

No external research was needed; the codebase and planning context provided enough evidence.
