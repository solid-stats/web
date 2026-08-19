<!-- markdownlint-disable MD013 MD041 -->

> **What this repo is.** `web` is the SolidStats browser UI — a React / TanStack Start
> frontend (public stats, Discord-authenticated request UX, moderator/admin screens)
> for the Solid Games community.
>
> **Boundary — what it owns / must NOT cross.** Owns: the frontend, UI state, and the typed
> API client generated from the `server-2` OpenAPI schema. Must NOT: access the database or
> S3 directly, or bypass the typed client with raw `fetch`. The platform source of truth and
> HTTP API are `server-2`'s; raw replay discovery is `replays-fetcher`'s; OCAP parsing is
> `replay-parser-2`'s. See the cross-app boundary map (§D) in the standards below.
>
> **Shared standards.** Cross-repo rules (skills-first, git, security, docs language, MCP
> lookup) live in `solid-stats/agent-instructions`, imported below. Stack-specific skills live
> in `solid-stats/skills` (`solidstats-shared-project-standards` and this repo's own skills).

@.agent-instructions/AGENTS.md

---

# AGENTS instructions

## Project

`web` is the browser UI and user experience for Solid Stats — a public SolidGames replay-statistics website and moderation interface. It consumes APIs from `server-2`. It does not parse replay files, crawl replay sources, or own PostgreSQL/RabbitMQ/S3 infrastructure.

Solid Stats is a multi-project product composed of:

- `replays-fetcher` — replay discovery, raw S3 object storage, ingestion staging.
- `replay-parser-2` — deterministic OCAP JSON parsing, parser contract, CLI/worker.
- `server-2` — PostgreSQL source of truth, APIs, canonical identity, auth, moderation, parse jobs, aggregate/bounty calculation.
- `web` — browser UI, public stats, authenticated request UX, moderator/admin screens, API consumption.

Read these planning files before planning or implementing:

- `plans/web/briefs/web.md` (in the `plans` repo) — the authoritative project brief (scope, quality bar, design direction).
- `.planning/` — sketches and planning artifacts.

## Product-Wide Standards

- Keep README and planning docs current when scope, commands, architecture, validation data, or workflow changes.
- End completed work with a clean git tree by committing intended results; do not delete completed work just to make status clean.
- Push back on requests that conflict with architecture, current logic, quality, maintainability, or proportional scope; explain the risk and propose safer alternatives.
- Check cross-application compatibility before execution. API/data model, canonical identity, auth, moderation, or UI-visible behavior changes require checking adjacent app docs/repos when available.
- If evidence is missing or contradictory, ask the user before proceeding.

## Quality Bar

`web` must feel instant, stable, and trustworthy before it feels decorative. Priority order: UX speed and continuity, accessibility, SEO, Core Web Vitals and bundle budgets, visual polish.

## Documentation Language

All project documentation must be written in English only.

## UI Prototype & Implementation

The SolidStats UI workflow has two separate stages: prototype first, implementation second.

- **Prototype stage (2026-08-19)** — create the short slice documents under
  `.visual-prototypes/`, then design and review the surface in the Penpot `App Design` file. Use a
  separate Penpot page for each application page and assemble screens from connected
  `SolidStats UIKit` instances and token references. GSD does not participate in this stage. Once
  accepted, keep the full `SUMMARY.md` locally and file its summary in the SolidStats MemPalace
  `design` room. See `.planning/PROJECT.md` for the decision log and Penpot file IDs.
- **SolidStats overlay** — `solidstats-frontend-react-design` adds this repo's inputs and rules:
  `DESIGN.md`, generated `theme.css`, the connected Penpot UIKit, `server-2` shapes, roles, data
  trust, replay-derived numbers, and RU/EN copy fit.
- **Implementation stage** — GSD may start here. Convert the accepted Penpot surface and local
  `SUMMARY.md` into the
  global `design` implementation surface spec / phase `CONTEXT` + `VALIDATION`, add the SolidStats
  overlay, then build the UIKit in Ladle: shared components are implemented, tested, and
  catalogued as colocated Ladle stories before pages compose them into routes. Ladle is mandatory
  for the UIKit; Penpot owns the earlier whole-page design/prototyping stage (see
  `.legacy/ladle-design/` for the retired catalog and `.planning/PROJECT.md` for the decision log).
- **UI review** — use `solidstats-frontend-react-design-review`'s production overlay on the built
  surface, after the global `design` production-review baseline; route code-level defects to
  `solidstats-frontend-react-code-review`. If GSD requires its own `UI-REVIEW.md` frontmatter or
  severity sections during implementation, preserve the GSD artifact format and map the production
  design-review findings into it.

The design-system source of truth is the repo-root `DESIGN.md` (exported to `src/styles/theme.css`);
the visual prototype lives in Penpot `App Design`, while its brief, iteration log, and accepted
summary live under `.visual-prototypes/`. `web` is a single-package repo (no `packages/design`
workspace) — the durable UIKit is colocated Ladle stories under
`src/shared/uikit/`, rebuilt from scratch (none exists yet; the retired one is archived at
`.legacy/ladle-design/` for reference only). The `.design/` directory is a frozen historical
archive (see `.design/README.md`), not portable code and not an active design source.

<!-- GSD:skills-start source:skills/ -->

## Project Skills

| Skill                                   | When to Invoke                                                                                                                                                                               |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `solidstats-frontend-react-conventions` | Любой компонент, роут, хук, слой FSD, server/client boundary, TanStack Query / Router, форма, стиль — архитектура и конвенции frontend (вобрал TanStack Start / React / TSX best practices). |
| `solidstats-frontend-react-code-review` | Педантичное код-ревью frontend; ruleset делегируется в conventions, формат отчёта — в shared-review-standards.                                                                               |
| `solidstats-frontend-react-tests`       | Написание или ревью frontend-тестов (Vitest для hooks/logic, Playwright для E2E) поверх shared-testing-standards.                                                                            |
| `solidstats-shared-review-standards`    | Общий фундамент формата код-ревью (severity-бакеты, формат отчёта, правила вердикта); подключается code-review skills, не используется самостоятельно.                                       |
| `solidstats-shared-testing-standards`   | Общая философия тестов (AAA, изоляция, детерминизм, test doubles, размещение файлов); подключается per-stack test skills.                                                                    |
| `solidstats-shared-ts-standards`        | TS/Node baseline (tsconfig, code style, ESLint/Oxlint, утилиты, TS test idioms); читается frontend-react-conventions, не вызывается напрямую.                                                |
| `solidstats-shared-project-standards`   | Универсальный baseline всех репо (GSD-обязательства, гигиена сессии, git-конвенции, cross-app границы, безопасность); авто-триггерится на каждой задаче.                                     |
| `tanstack-start`                        | Any routing, SSR, server functions, data loading, or TanStack Start config                                                                                                                   |
| `openapi-to-typescript`                 | Generating or updating TypeScript types from `server-2` OpenAPI schema                                                                                                                       |

<!-- GSD:skills-end -->
