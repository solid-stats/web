# Solid Stats — web

## What This Is

Solid Stats `web` is the public browser UI and moderation interface for the SolidGames community:
a fast, mobile-first React / TanStack Start application for inspecting, filtering, and trusting
replay statistics (players, squads, rotations, commander-side, bounty), plus Steam-authenticated
correction requests and moderator/admin workflows. It consumes `server-2` APIs and owns only the
frontend — it does not parse replays, crawl replay sources, or touch PostgreSQL/RabbitMQ/S3.

The repo is a **pnpm workspace**: `packages/design` (the importable design system — tokens, the
UIKIT component library, and every surface as a Ladle story) and `packages/app` (the TanStack Start
application that consumes it), with `DESIGN.md` at the repo root as the shared token source of truth.
Work is sequenced in milestones: **v0.1 = the design** (system + UIKIT + all surfaces designed in
Ladle) → **v1.0 = the app** (those designs graduated into routes, data, and SSR).

## Core Value

Make SolidGames statistics easy to inspect, filter, trust, and correct through a fast public website
and clear request/moderation flows.

## Structure & Milestones

**Workspace (pnpm 11 · Node 25 — SolidStats canon):**

```
web/                     pnpm workspace root
  pnpm-workspace.yaml
  DESIGN.md              shared token source of truth (root)
  scripts/gen-theme.mjs  DESIGN.md → packages/design theme.css (DRY single-source)
  packages/design/       @solid-stats/design — @theme + UIKIT (Ladle catalog) + surfaces as stories
  packages/app/          the TanStack Start app — consumes @solid-stats/design
```

**v0.1 — Design milestone (current).** Build `packages/design`: tokens → Tailwind v4 `@theme`, the
durable UIKIT component library, and **all key surfaces as Ladle stories**, each via design →
design-review. No routes, no data wiring, no SSR app. `.design/hifi/*` is visual reference only —
every surface is built fresh on the real stack, never ported from the fake-stack mockups.

**v1.0 — App milestone (later).** Build `packages/app` on the finished design system: scaffold,
routes, data, SSR, i18n, SSE, the typed `server-2` client, CWV/SEO/CI gates. The app-focused
research already produced (stack, features, architecture, pitfalls) is parked at
`.planning/research-app-v1.0/` for this milestone.

## Requirements

### Validated

(None yet — greenfield. The `DESIGN.md` token system exists; no surface or app feature has shipped.)

### Active

<!-- Hypotheses until shipped and validated. v0.1 detail in REQUIREMENTS.md; v1.0 in the next milestone. -->

- [ ] **Design system & UIKIT** (v0.1) — `DESIGN.md` → `@theme`, a durable Ladle component library
  (tables, stat tiles, tier chips, freshness/provenance, Unknown/Conflict badges, nav shell, Ark UI
  primitives, skeletons), dark-only, tabular mono, Lucide.
- [ ] **All surfaces designed in Ladle** (v0.1) — every public, authenticated, and moderation/admin
  screen as a reviewed Ladle story with the ×5 scenario endings, ×4 data-volume states, breakpoints,
  roles, and the data-trust layer.
- [ ] **Public stats app** (v1.0) — overview, player/squad lists + profiles, rotation views,
  commander-side, bounty, indexable replay detail; server-driven 10k–100k-row tables;
  list→detail→Back restoration; provenance/Unknown/Conflict/stale states.
- [ ] **Authenticated player UX** (v1.0) — Steam OAuth session; 5 guided correction-request flows;
  `server-2` drafts (autosave, 7-day TTL); evidence upload; status/history; reopen.
- [ ] **Moderation / admin** (v1.0) — risk-plus-age queue; request review with immutable audit
  timeline; approve/reject; role + rotation management; ops/ingest/job-failure visibility; RBAC.
- [ ] **Cross-cutting quality** (both) — WCAG 2.2 AA; CWV (LCP ≤ 2.5s, INP ≤ 200ms, CLS = 0); SEO
  (SSR, canonical, sitemaps, structured data, `/ru` `/en`); Playwright + axe + Lighthouse + bundle
  budgets against a seeded `server-2`.

### Out of Scope

- Rust parser, replay crawling/ingest, backend API, PostgreSQL/RabbitMQ/S3 — owned by
  `replay-parser-2` / `replays-fetcher` / `server-2`.
- Light theme — design system is dark-only by decision.
- Financial reward / payment UI — bounty is points/statistics only.
- Annual/nomination stats; comparison views; global/command-palette search — v2 surfaces.
- Google Forms; full marketing/news portal — replaced or deferred.
- vanilla-extract styling — superseded by Tailwind v4.
- Porting the `.design/hifi/*` fake-stack code — surfaces are rebuilt natively; hi-fi is reference only.

## Context

- Greenfield frontend, one of four Solid Stats apps. Ownership boundary: `server-2` = source of truth
  (DB, APIs, canonical identity, Steam auth, moderation, parse jobs, aggregate/bounty calc);
  `replays-fetcher` = replay discovery + raw S3 staging; `replay-parser-2` = OCAP parsing. `web`
  consumes `server-2`'s typed API and crosses none of those boundaries.
- Design foundation in place: root `DESIGN.md` (token SoT, lint-clean) → `theme.css` via
  `scripts/gen-theme.mjs` (interim generator; migrate back to `design.md export` once its line-height
  drop is fixed). `.design/` holds the frozen Claude Design output — hi-fi mockups (Overview, Players,
  Player, Squads), wireframes, the `_ds` seed, and `.design/CLAUDE.md`: the binding per-surface design
  rules + domain knowledge (Score/KD formulas, population tiers, the list loading model, data-trust
  A/C). Hi-fi covers only the public stats surfaces and is reference only; commander/bounty/replay and
  all auth/request/moderation/admin screens are designed from scratch in v0.1.
- Product feel: dense mobile-first esports operations UI — readable, laconic, fast to scan. Dark-only
  gunmetal, one cyan accent, Lucide icons, tabular mono numerals. No decorative nested cards,
  gradients, or chart-heavy dashboards; tables, rankings, microcharts. Data-trust is a designed layer
  (provenance, freshness, Unknown/Conflict), not a badge. SteamID masked (last four).
- GSD is installed at global scope; project skills cover frontend conventions, design and
  design-review, tests, `openapi-typescript`, TanStack Start. Documentation is English-only.

## Constraints

- **Workspace / toolchain**: pnpm 11 (`>=11 <12`) + Node 25 (SolidStats canon; siblings use pnpm).
  Two packages — `packages/design`, `packages/app` — with `DESIGN.md` at the root. — org standard.
- **Tech stack** (brief-locked): TanStack Start + Router + Query + Table; Nano Stores for lightweight
  client state only; Tailwind v4 (tokens from `DESIGN.md`, no arbitrary values); Ark UI; typed ICU
  i18n; `openapi-typescript`; Node-in-Docker (the `packages/app` deploy unit).
- **Design pipeline**: every surface goes brief → spec (×5 endings, ×4 data volumes, breakpoints
  keyed off container, roles, data shape, component states) → Ladle prototype on the real stack →
  design-review gate → (v1.0) graduate to routes. — `solidstats-frontend-react-design`.
- **Cross-app boundary**: consume `server-2` only through a typed thin client over generated OpenAPI
  types; never raw `fetch`, never DB/S3. — ownership separation.
- **Performance / CWV**: LCP ≤ 2.5s, INP ≤ 200ms, **CLS = 0** (reserve space for everything) at p75;
  bundle budgets enforced in CI. — quality bar (design-review enforces zero shift).
- **Accessibility**: WCAG 2.2 AA minimum, targeted AAA. — quality bar.
- **UX continuity (launch-blocking, v1.0)**: list → detail → Back restores table state, scroll,
  virtualized position, filters/sort/search, and cache with no blocking reload or layout shift.
- **i18n**: RU + EN from the start; `/ru` `/en` routes; every string i18n-keyed; sanity-check RU.
- **Rendering** (v1.0): SSR for public SEO pages behind an nginx `proxy_cache` microcache; SSE
  freshness with explicit stale labeling; no SSG for catalog/detail (no runtime ISR, non-enumerable
  routes).
- **Privacy**: SteamID displayed only masked (last four digits).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Repo = pnpm workspace (`packages/design` + `packages/app`) | Design system is an importable package the app consumes; pnpm is the SolidStats canon | ✓ Decided |
| `DESIGN.md` stays at repo ROOT | Shared token source of truth across packages | ✓ Decided |
| Milestone split: v0.1 design → v1.0 app | Design all surfaces in Ladle first, then build the app on them | ✓ Decided |
| pnpm 11 + Node 25 | SolidStats `solidstats-shared-ts-standards` canon; siblings already use pnpm | ✓ Decided |
| `.design/hifi/*` = visual reference only | Fake-stack plain CSS; surfaces rebuilt natively (spec → Ladle), no porting | ✓ Decided |
| Styling: Tailwind CSS v4 (vanilla-extract dropped) | Brief's deepened stack supersedes the stale "vanilla-extract" row; tokens from `DESIGN.md` | ✓ Foundation laid |
| Theme: dark-only (no light mode) | Design system is dark-only; light mode out of scope | ✓ Tokens dark-only |
| `theme.css` generated by `gen-theme.mjs` (interim) | `design.md export` drops line-height; DRY single-source from `DESIGN.md`; migrate back when fixed | ✓ Working |
| Framework: TanStack Start + Router + Query + Table | URL-first SSR stats product (v1.0) | — Pending |
| UI primitives: Ark UI; icons: Lucide only; tabular mono | Accessible headless primitives; single icon family; numeric legibility | — Pending |
| i18n: typed ICU, `/ru` + `/en` | RU+EN from the start | — Pending |
| API typing: `openapi-typescript` from live `server-2`; CI fails on stale | `server-2` owns the schema; no hand-written DTOs | — Pending |
| Rendering: SSR + nginx microcache + SSE (v1.0) | No runtime ISR; non-enumerable routes rule out SSG for data | — Pending |
| Quality priority: UX continuity → a11y → SEO → CWV → polish | "Instant, stable, trustworthy before decorative" | — Pending |
| CI gate (v1.0): Playwright matrix + axe + Lighthouse/budgets + bundle budgets | Critical journeys, a11y, CWV, bundle size block merge | — Pending |
| E2E data: deterministic seeded `server-2` | Local dev + E2E need a reachable backend | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-20 after restructure to pnpm workspace + v0.1 design milestone*
