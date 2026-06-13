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

- `gsd-briefs/web.md` — the authoritative project brief (scope, quality bar, design direction).
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

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | When to Invoke |
|-------|----------------|
| `solidstats-frontend-react-conventions` | Любой компонент, роут, хук, слой FSD, server/client boundary, TanStack Query / Router, форма, стиль — архитектура и конвенции frontend (вобрал TanStack Start / React / TSX best practices). |
| `solidstats-frontend-react-code-review` | Педантичное код-ревью frontend; ruleset делегируется в conventions, формат отчёта — в shared-review-standards. |
| `solidstats-frontend-react-tests` | Написание или ревью frontend-тестов (Vitest для hooks/logic, Playwright для E2E) поверх shared-testing-standards. |
| `solidstats-shared-review-standards` | Общий фундамент формата код-ревью (severity-бакеты, формат отчёта, правила вердикта); подключается code-review skills, не используется самостоятельно. |
| `solidstats-shared-testing-standards` | Общая философия тестов (AAA, изоляция, детерминизм, test doubles, размещение файлов); подключается per-stack test skills. |
| `solidstats-shared-ts-standards` | TS/Node baseline (tsconfig, code style, ESLint/Oxlint, утилиты, TS test idioms); читается frontend-react-conventions, не вызывается напрямую. |
| `solidstats-shared-project-standards` | Универсальный baseline всех репо (GSD-обязательства, гигиена сессии, git-конвенции, cross-app границы, безопасность); авто-триггерится на каждой задаче. |
| `tanstack-start` | Any routing, SSR, server functions, data loading, or TanStack Start config |
| `openapi-to-typescript` | Generating or updating TypeScript types from `server-2` OpenAPI schema |
<!-- GSD:skills-end -->
