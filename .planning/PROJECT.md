# Solid Stats — web

## What This Is

Solid Stats `web` is the browser UI for the SolidGames statistics product: public replay-stat
inspection, Steam-authenticated player correction flows, and moderator/admin screens. It consumes
`server-2` APIs and owns only frontend code, UI state, and the typed API client generated from
`server-2` OpenAPI. It does not parse replays, crawl replay sources, access PostgreSQL, or access S3.

The repo is now a single-package frontend repo. The active design workflow is:

1. create `BRIEF.md` for the slice under `.visual-prototypes/`;
2. design and review the surface in the Penpot `App Design` file, using one Penpot page per
   application page and connected `SolidStats UIKit` instances;
3. record passes in `ITERATIONS.md`, accept the slice in `SUMMARY.md`, and file that summary in the
   SolidStats MemPalace `design` room;
4. convert the accepted summary into an implementation surface spec;
5. build the real TanStack Start app in root `src/`.

This is the third design-workflow rebuild (2026-08-19). The earlier package-based Ladle and
in-repo coded-prototype approaches were superseded because they made visual iteration too
expensive. The 2026-08-01 Claude Design workflow is preserved in the decision history but is no
longer active. `.visual-prototypes/` now stores only prototype documents; the visual artifact lives
in Penpot.

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
  .visual-prototypes/           active prototype briefs, iteration logs, and accepted summaries
  .design/                      frozen historical design archive
  .legacy/ladle-design/         retired package-based Ladle code archive
  .planning/milestones/         superseded/completed milestone archives
  .planning/                    GSD planning state
```

Active screen design lives in the Penpot file **App Design**
(`5954a801-37cf-8094-8008-81f63a8ba3d3`). Each application page gets its own Penpot page; state,
breakpoint, role, and flow variants are boards on that page. Screens use the shared
**SolidStats UIKit** library (`3be9e5e1-190f-8090-8008-724cff55ab11`) through connected component
instances and token references. The local `.visual-prototypes/<slice>/SUMMARY.md` remains the full
implementation handoff; its accepted summary is also filed in the SolidStats MemPalace `design`
room for recall.

`src/` is the active app root. When implementation starts, use the SolidStats frontend conventions:
`src/routes` for TanStack Router entries, `src/pages` for page implementations, and `src/shared` for
shared API, UIKIT, i18n, styles, types, and utilities.

## Requirements

- **Design workflow** — new pages, surfaces, app flows, and major layout recompositions use local
  `.visual-prototypes/` documents plus visual work in Penpot `App Design`.
- **Implementation gate** — production implementation starts only after the relevant surface is
  accepted in Penpot and recorded in a local `SUMMARY.md`; implementation specs must cover use
  cases, roles, data shape, scenario endings, data volumes, component states, responsiveness,
  localization, cross-surface impact, and acceptance. File the accepted summary in MemPalace.
- **Design system** — `DESIGN.md` remains the token source of truth. `scripts/gen-theme.mjs`
  generates `src/styles/theme.css`; the generated CSS is never hand-edited.
- **Legacy boundary** — `.legacy/ladle-design/` is not part of the active package manager workspace,
  not part of `pnpm check`, and not a source to port directly into production routes.
- **UIKIT** — Ladle is mandatory for the UIKit: shared components are built, tested, and catalogued
  as colocated Ladle stories under `src/shared/uikit/`. It is only the earlier whole-page
  design/prototyping stage (deciding what a surface looks like before it's built) that Ladle no
  longer does — that work lives in Penpot.
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
| ---------- | ----------- | --------- |
| Single-package root app | The package split was only supporting the retired Ladle design milestone | Active |
| `.visual-prototypes/` coded prototypes | Disposable coded slices were cheaper than production-like prototypes but still too expensive to iterate | Superseded 2026-08-01 |
| Design in Claude Design | Replaced coded prototypes with a live visual tool | Superseded 2026-08-19 |
| Design screens in Penpot `App Design` | Keep one durable visual artifact, one Penpot page per application page, and reuse the connected UIKit | Active |
| Local summary plus MemPalace recall | Keep the complete implementation handoff in the repo and make accepted decisions discoverable across sessions | Active |
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
