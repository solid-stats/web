# Solid Stats — web

## What This Is

Solid Stats `web` is the browser UI for the SolidGames statistics product: public replay-stat
inspection, Steam-authenticated player correction flows, and moderator/admin screens. It consumes
`server-2` APIs and owns only frontend code, UI state, and the typed API client generated from
`server-2` OpenAPI. It does not parse replays, crawl replay sources, access PostgreSQL, or access S3.

The repo is now a single-package frontend repo. The active design workflow is:

1. design the surface directly in the live **Claude Design** project ("Solid Stats — Design
   System"), not as disposable in-repo prototype code;
2. pull the accepted design locally via `DesignSync` when a surface is ready to build;
3. convert the accepted design into an implementation surface spec;
4. build the real TanStack Start app in root `src/`.

This is the second design-workflow rebuild (2026-08-01). The first rebuild (2026-07-04) replaced the
package-based Ladle prototyping with in-repo `.visual-prototypes/` slices; that stage is itself now
superseded because iterating on prototypes as in-repo code (Ladle, and then hand-built
`.visual-prototypes/` slices) cost too much time and tokens relative to designing directly in Claude
Design. `.visual-prototypes/` is not deleted (nothing was ever built there) but is no longer the
active workflow; see `.visual-prototypes/README.md`.

The old package-based Ladle design milestone is superseded, not shipped. Its planning artifacts are
archived under `.planning/milestones/v0.1-superseded-*`; its code is archived at
`.legacy/ladle-design/` as reference for future UIKIT extraction only.

## Core Value

Make SolidGames statistics easy to inspect, filter, trust, and correct through a fast public website
and clear request/moderation flows.

## Active Structure

```text
web/
  DESIGN.md                     design-token source of truth
  scripts/gen-theme.mjs         DESIGN.md -> src/styles/theme.css
  src/styles/theme.css          generated Tailwind v4 @theme output
  .visual-prototypes/           superseded in-repo prototype workspace (unused, see README)
  .design/                      frozen visual/historical design archive (prior Claude Design rounds)
  .legacy/ladle-design/         retired package-based Ladle code archive
  .planning/milestones/         superseded/completed milestone archives
  .planning/                    GSD planning state
```

Active design work lives in the **Claude Design** project "Solid Stats — Design System"
(`303268bd-e46e-48db-9185-eb09277b7cc1`), not in this repo. Pull a surface into the repo with
`DesignSync` only once it is accepted and ready to spec.

`src/` is the active app root. When implementation starts, use the SolidStats frontend conventions:
`src/routes` for TanStack Router entries, `src/pages` for page implementations, and `src/shared` for
shared API, UIKIT, i18n, styles, types, and utilities.

## Requirements

- **Design workflow** — new pages, surfaces, app flows, and major layout recompositions are designed
  in the live Claude Design project, not as in-repo prototype code. `.visual-prototypes/` is
  superseded; do not start new slices there.
- **Implementation gate** — production implementation starts only after the relevant surface is
  accepted in Claude Design and pulled locally via `DesignSync`; implementation specs must cover use
  cases, roles, data shape, scenario endings, data volumes, component states, responsiveness,
  localization, cross-surface impact, and acceptance.
- **Design system** — `DESIGN.md` remains the token source of truth. `scripts/gen-theme.mjs`
  generates `src/styles/theme.css`; the generated CSS is never hand-edited.
- **Legacy boundary** — `.legacy/ladle-design/` is not part of the active package manager workspace,
  not part of `pnpm check`, and not a source to port directly into production routes.
- **UIKIT** — Ladle is mandatory for the UIKit: shared components are built, tested, and catalogued
  as colocated Ladle stories under `src/shared/uikit/`. It is only the earlier whole-page
  design/prototyping stage (deciding what a surface looks like before it's built) that Ladle no
  longer does — that moved to Claude Design.
- **Quality bar** — UX continuity, accessibility, SEO, Core Web Vitals, and visual polish remain
  launch-blocking for the real app.

## Context

- `server-2` owns canonical business state, HTTP APIs, Steam auth, moderation, parse jobs, aggregate
  stats, and bounty calculations.
- `replays-fetcher` owns replay discovery and raw object storage.
- `replay-parser-2` owns deterministic OCAP parsing.
- `web` consumes the `server-2` typed API and must not cross those boundaries.

The SolidStats visual direction remains dense, mobile-first esports operations UI: dark-only
gunmetal, one cyan accent, Lucide icons, tabular numerals, data-trust states, RU/EN copy, and stable
dimensions.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single-package root app | The package split was only supporting the retired Ladle design milestone | Active |
| `.visual-prototypes/` first | Disposable visual slices are cheaper than production-like surface prototypes | Superseded 2026-08-01 |
| Design in Claude Design | Iterating on prototypes as in-repo code (Ladle, then `.visual-prototypes/`) cost too much time and tokens; design directly in the live Claude Design project instead | Active |
| `v0.1` superseded archive | Preserve the incomplete Ladle milestone without marking it shipped | Active |
| `.legacy/ladle-design/` archive | Preserve useful UIKIT work without keeping it active | Active |
| `DESIGN.md` at repo root | One token source across prototypes and implementation | Active |
| `src/styles/theme.css` generated by `gen-theme.mjs` | `@google/design.md` export still drops line-height; in-repo generator remains needed | Active |
| Ladle mandatory for the UIKit | Components need a real isolation harness, tests, and colocated stories regardless of how a page is designed | Active |
| New web brief update is separate | Product-scope changes should not be mixed with this structural workflow rebuild | Pending follow-up |

## Out of Scope

- Updating the product brief and feature scope from the new web brief; do this as a separate step.
- Porting `.design/hifi/*` or `.legacy/ladle-design/*` code directly into production.
- Backend, parser, ingest, database, S3, RabbitMQ, or infrastructure changes.
- Light theme, payments/reward UI, comparison views, nomination pages, and global search unless the
  next authoritative web brief changes scope.

## Evolution

Update this document when repo structure, active workflow, quality gates, or cross-app boundaries
change. Keep product-scope changes tied to the authoritative web brief update.
