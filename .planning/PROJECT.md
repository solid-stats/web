# Solid Stats — web

## What This Is

Solid Stats `web` is the public browser UI and moderation interface for the SolidGames
community: a fast, mobile-first React / TanStack Start application for inspecting, filtering,
and trusting replay statistics (players, squads, rotations, commander-side, bounty), plus
Steam-authenticated correction requests and moderator/admin workflows. It consumes `server-2`
APIs and owns only the frontend — it does not parse replays, crawl replay sources, or touch
PostgreSQL/RabbitMQ/S3.

## Core Value

Make SolidGames statistics easy to inspect, filter, trust, and correct through a fast public
website and clear request/moderation flows.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — greenfield. A design-system foundation exists, but no product feature has shipped.)

### Active

<!-- Current scope. Hypotheses until shipped and validated. Detail lives in REQUIREMENTS.md. -->

- [ ] **App foundation** — TanStack Start SSR app wired with Router, Query, Table, and Nano
  Stores (lightweight client state only); Tailwind v4 styling driven by `DESIGN.md` tokens;
  Ark UI accessible primitives; typed ICU RU/EN i18n; SSE transport; a typed thin API client
  over `openapi-typescript`-generated `server-2` types; Node-in-Docker deploy.
- [ ] **Public stats (no login)** — overview, player/squad lists + profiles, rotation views,
  commander-side stats, bounty leaderboards, and indexable replay detail; server-driven
  search/filter/sort/cursor tables at 10k–100k row scale; list → detail → Back restoration of
  table state, scroll, virtualized position, and cache with no blocking reload; visible
  provenance, unknown/conflict, and stale-data states.
- [ ] **Authenticated player UX** — Steam OAuth session; guided correction-request flows
  (identity, add/remove kills, add/remove teamkills, remove player from replay, commander
  dispute); `server-2`-backed drafts (debounced autosave, 7-day TTL); image + external-link
  evidence; request status/history; reopen of rejected requests.
- [ ] **Moderation / admin** — risk-plus-age request queue; request detail/review with an
  immutable audit timeline; approve/reject with required comment; role management; rotation
  management; ingest-conflict and parser/job-failure visibility with limited audited actions;
  RBAC driven by roles + capabilities from session/API data; contextual 403 recovery.
- [ ] **Cross-cutting quality** — WCAG 2.2 AA; Core Web Vitals budgets (LCP ≤ 2.5s, INP ≤
  200ms, CLS ≤ 0.02); SEO (SSR meaningful HTML, canonical, segmented sitemaps, structured
  data, `/ru` `/en` localized routes); Playwright CI matrix with axe, Lighthouse/budgets, and
  bundle budgets, run against a deterministic seeded `server-2`.

### Out of Scope

<!-- Explicit boundaries with reasoning to prevent re-adding. -->

- Rust parser implementation — owned by `replay-parser-2`.
- Replay-source crawling / ingest implementation — owned by `replays-fetcher` (via `server-2` APIs).
- Backend API implementation; PostgreSQL / RabbitMQ / S3 infrastructure — owned by `server-2`.
- Light theme / light mode — the design system is dark-only by decision.
- Financial reward / payment UI — bounty is points and statistics only, never money.
- Annual/yearly nomination statistics and nomination pages — separate v2 surface.
- Player/squad/rotation comparison views — v2.
- Global / command-palette search across the whole product — v1 search is scoped per table/surface.
- Google Forms; full marketing/news portal — replaced or deferred.
- vanilla-extract styling — superseded by Tailwind v4 (see Key Decisions).

## Context

- Greenfield frontend, one of four Solid Stats applications. Ownership boundary: `server-2` is
  the source of truth (PostgreSQL, APIs, canonical identity, Steam auth, moderation, parse
  jobs, aggregate/bounty calculation); `replays-fetcher` owns replay discovery and raw S3
  staging; `replay-parser-2` owns deterministic OCAP parsing. `web` consumes `server-2`'s
  typed API and crosses none of those boundaries.
- A design-system foundation is already in place and intact: the repo-root `DESIGN.md` is the
  token source of truth, exported to `src/styles/theme.css` via `scripts/gen-theme.mjs`; a
  frozen hi-fi visual reference lives in `.design/` (reference only, not portable code). There
  is no application scaffold yet — no root `package.json`. App scaffolding is the first roadmap
  phase, built on top of this foundation.
- Product feel: dense mobile-first esports operations UI — readable, laconic, fast to scan.
  Dark-only. Lucide as the single icon family. Tabular numerals for stats/ranks/timers/IDs. No
  decorative nested cards, ornamental gradients, or chart-heavy dashboards; prefer tables,
  rankings, and microcharts.
- Public data must read as trustworthy: visible last-updated/provenance, explicit Unknown and
  Conflict states (legacy commander-side outcomes are filterable Unknowns), explainable bounty
  and squad-effectiveness breakdowns, and SteamID shown masked (last four digits only).
- GSD is installed at global scope; project skills cover frontend conventions, design and
  design-review, tests, `openapi-typescript`, and TanStack Start. Documentation is English-only.

## Constraints

- **Tech stack**: TanStack Start (framework/SSR) + Router (URL-first nav, code splitting,
  preloading, scroll restoration) + Query (server-state cache, SWR, prefetch) + Table (sort/
  filter/cursor/virtualization); Nano Stores for lightweight client state only; Tailwind v4 for
  styling and tokens (generated from `DESIGN.md`; arbitrary token values like `bg-[#fff]`/
  `p-[7px]` disallowed); Ark UI headless primitives; typed ICU-capable i18n; `openapi-typescript`
  generated types; Node.js in Docker — fixed product decisions.
- **Cross-app boundary**: consume `server-2` only through a typed thin client over generated
  OpenAPI types; never raw scattered `fetch`, never direct DB/S3 access — ownership separation.
- **API typing**: `server-2` owns the versioned OpenAPI schema; `web` regenerates types from
  the live schema and fails CI when generated types are stale; `noUncheckedIndexedAccess` on —
  single source of truth for request/response typing.
- **Performance / Core Web Vitals**: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.02 (must not exceed 0.05
  on critical journeys) at p75; bundle budgets defined and enforced in CI — quality bar.
- **Accessibility**: WCAG 2.2 AA minimum, AAA-quality where practical — quality bar.
- **UX continuity (launch-blocking)**: list → detail → Back restores table state, scroll,
  virtualized row position, filters/sort/search, and cached data with no blocking reload,
  loading flash, hydration mismatch, console error, or layout shift.
- **Internationalization**: Russian and English from the start; localized public routes under
  `/ru/...` and `/en/...`; first visit to `/` redirects by browser language with a persisted
  switcher — product requirement.
- **Rendering / caching**: SSR for public SEO pages, fronted by an nginx `proxy_cache`
  microcache on the origin (short TTL + stale-while-revalidate + cache-lock + serve-stale-on-
  error); SSE supplies freshness with explicit stale labeling; no SSG for catalog/detail data
  (TanStack Start has no runtime ISR engine and the route space is not build-time enumerable) —
  thin build-time prerender for the static shell only.
- **Realtime**: SSE by default; WebSocket only where the client must send live messages; SSE
  merges must not cause CLS or move content above the viewport — page-specific auto/manual merge.
- **Privacy**: SteamID displayed only masked (last four digits).

## Key Decisions

<!-- Load-bearing decisions that constrain future work. Two rows reconcile stale entries in the
source brief's decision table against its more recent "Frontend Stack" / "Design Direction"
sections and the existing foundation. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Product name: Solid Stats | Replaces Google Forms + file-based stat browsing for the SolidGames community | — Pending |
| Framework: TanStack Start (React/TSX), SSR | URL-first, SEO-capable rendering layer for a stats product | — Pending |
| Router: TanStack Router | Route-level code splitting, preloading, scroll restoration | — Pending |
| Data fetching: TanStack Query | Server-state cache, SWR, prefetch, no blocking reload on Back | — Pending |
| Tables: TanStack Table | Sort/filter/cursor + virtualization for 10k–100k rows | — Pending |
| Client state: Nano Stores | Only state that does not belong in URL/router/query | — Pending |
| **Styling: Tailwind CSS v4** (vanilla-extract dropped) | Deepened brief supersedes the older "vanilla-extract" decision: "vanilla-extract is not used." Tokens generated into `@theme` from `DESIGN.md`; no arbitrary values | ✓ Foundation laid (`DESIGN.md` → `theme.css`) |
| UI primitives: Ark UI | Accessible headless dialogs/menus/tabs/selects/tooltips/popovers | — Pending |
| Icons: Lucide only | Single SVG icon family; no emoji as structural icons | — Pending |
| i18n: typed ICU, `/ru` + `/en` routes | RU+EN from the start, pluralization, localized formatting | — Pending |
| **Theme: dark-only** (no light mode) | Design Direction supersedes the "first-class light theme" row: light mode is explicitly out of scope; system is dark-only | ✓ Tokens dark-only |
| Rendering/cache: SSR + nginx `proxy_cache` microcache + SSE freshness | No runtime ISR in TanStack Start; non-enumerable routes (10–100k rows, replay IDs, owner-changing slugs) rule out SSG for data | — Pending |
| Runtime: Node.js in Docker behind origin nginx microcache | RU-majority audience co-located with origin; CDN is optional/post-v1 | — Pending |
| API typing: `openapi-typescript` from live `server-2` schema; CI fails on stale | `server-2` owns the schema; `web` never hand-writes DTOs | — Pending |
| API client: typed thin client over generated types | Standardizes auth/session, error codes, Query integration; no scattered fetch | — Pending |
| Auth: Steam OAuth via `server-2`; public stats without login | Public-first product; auth gates only requests/account pages | — Pending |
| Public route model: player/squad slug-only current-owner; replay by ID | Active slug owner is authoritative; historical slug stability not guaranteed | — Pending |
| Public tables: server-driven filter/sort/cursor for 10k–100k rows | Shareable state in URL; ephemeral state (scroll, density) outside URL | — Pending |
| Navigation: desktop top nav, mobile tabs for core public stats | Role-aware nav for authenticated/admin actions | — Pending |
| Launch priority: public player/squad stats → commander → bounty | Public stats quality first, then the authenticated/admin loop (all v1) | — Pending |
| Moderation: risk-plus-age queue, immutable audit timeline, reopen, no bulk v1 | Auditable, proportional v1 moderation | — Pending |
| Quality priority: UX continuity → accessibility → SEO → CWV/budgets → polish | "Instant, stable, trustworthy before decorative" | — Pending |
| CI gate: full Playwright matrix every PR + axe + Lighthouse/budgets + bundle budgets | Critical journeys, a11y, CWV, and bundle size block merge | — Pending |
| E2E data: deterministic seeded `server-2` backend | Local dev and E2E need a reachable backend; mocks are not the primary mode | — Pending |

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
*Last updated: 2026-06-20 after initialization*
