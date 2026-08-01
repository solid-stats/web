> **What this repo is.** `web` is the SolidStats browser UI — a React / TanStack Start
> frontend (public stats, Steam sign-in, authenticated-action UX, moderator/admin screens)
> for the Solid Games community.
>
> **Boundary — what it owns / must NOT cross.** Owns: the frontend, UI state, and the typed
> API client generated from the `server-2` OpenAPI schema. Must NOT: access the database or
> S3 directly, or bypass the typed client with raw `fetch`. The platform source of truth and
> HTTP API are `server-2`'s; raw replay discovery is `replays-fetcher`'s; OCAP parsing is
> `replay-parser-2`'s. See the cross-app boundary map (§D) in the standards below.
>
> **Shared standards.** Universal SolidStats project standards live in the `solid-stats/skills`
> repo (`solidstats-shared-project-standards`); read them alongside this file.

---

# AGENTS instructions

## Skills First

Before acting on any user request in this repository, scan available skills by name and description. If any skill has even a small chance of helping any part of the task, use it and read only the relevant instructions before proceeding.

When in doubt, prefer enabling the skill briefly and filtering it out over skipping it.

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

- **Prototype stage (2026-08-01)** — surfaces are designed directly in the live Claude Design
  project ("Solid Stats — Design System"), not as in-repo code. GSD does not participate in this
  stage. Pull an accepted surface into the repo with `DesignSync` only once it is ready to spec.
  `.visual-prototypes/` (an earlier, 2026-07-04 in-repo prototype workflow) and the package-based
  Ladle prototyping before it are both superseded — both cost too much time and tokens for the
  iteration this stage needs. See `.planning/PROJECT.md` for the decision log.
- **SolidStats overlay** — `solidstats-frontend-react-design` adds this repo's inputs and rules:
  `DESIGN.md`, generated `theme.css`, `.design/CLAUDE.md`, `server-2` shapes, roles, data trust,
  replay-derived numbers, and RU/EN copy fit.
- **Implementation stage** — GSD may start here. Convert the accepted Claude Design surface into the
  global `design` implementation surface spec / phase `CONTEXT` + `VALIDATION`, add the SolidStats
  overlay, then build the UIKit in Ladle: shared components are implemented, tested, and
  catalogued as colocated Ladle stories before pages compose them into routes. Ladle is mandatory
  for the UIKit — it is only the earlier whole-page design/prototyping stage that moved to Claude
  Design (see `.legacy/ladle-design/` for the retired catalog and `.planning/PROJECT.md` for the
  decision log).
- **UI review** — use `solidstats-frontend-react-design-review`'s production overlay on the built
  surface, after the global `design` production-review baseline; route code-level defects to
  `solidstats-frontend-react-code-review`. If GSD requires its own `UI-REVIEW.md` frontmatter or
  severity sections during implementation, preserve the GSD artifact format and map the production
  design-review findings into it.

The design-system source of truth is the repo-root `DESIGN.md` (exported to `src/styles/theme.css`);
the running per-surface companion notes live in `.design/CLAUDE.md`. `web` is a single-package repo
(no `packages/design` workspace) — the durable UIKit is colocated Ladle stories under
`src/shared/uikit/`, rebuilt from scratch (none exists yet; the retired one is archived at
`.legacy/ladle-design/` for reference only). The `.design/` directory is a frozen archive of prior
Claude Design rounds (see `.design/README.md`), not portable code and not the active design source;
the active design source is the live Claude Design project referenced in `.planning/PROJECT.md`.

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
