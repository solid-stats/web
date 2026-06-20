# Requirements: Solid Stats web — v0.1 Design Milestone

**Defined:** 2026-06-20
**Core Value:** Make SolidGames statistics easy to inspect, filter, trust, and correct through a fast public website and clear request/moderation flows.
**Milestone:** v0.1 — design the system, the UIKIT component library, and every surface as reviewed Ladle stories on the real stack. No routes/data wiring/SSR app — that is v1.0.

## v1 Requirements

Design-milestone scope. Each maps to roadmap phases. **"Designed"** = spec (×5 scenario endings, ×4 data-volume states, breakpoints keyed off container, role model, data shape, component states) → Ladle story on the real stack (Tailwind v4 `@theme` + Ark UI, dark-only) → passes design-review (`design.md lint`, axe, real-width screenshots, CLS = 0). Hi-fi is reference only; surfaces are built fresh, never ported.

### Workspace & Build

- [x] **WS-01**: Repo is a pnpm workspace (pnpm 11 + Node 25) with `packages/design` and a `packages/app` skeleton, resolved by `pnpm-workspace.yaml`.
- [x] **WS-02**: `packages/design` is an importable package (`@solid-stats/design`) exporting the `@theme` and the UIKIT.
- [ ] **WS-03**: Root `DESIGN.md` → `packages/design` `theme.css` via `scripts/gen-theme.mjs` (single-source; `theme.css` never hand-edited). The existing `src/styles/theme.css` is relocated.
- [ ] **WS-04**: Ladle is wired to the real stack (dark-only, the generated `@theme`), with the colocated `*.stories.tsx` convention in `packages/design`.
- [ ] **WS-05**: The lint/format/type-check toolchain per `solidstats-frontend-react-conventions` runs green across the workspace; `design.md lint` gates `DESIGN.md`.

### Design System

- [ ] **DS-01**: Tailwind v4 `@theme` is generated from `DESIGN.md` tokens (colors, typography incl. line-height, spacing, radii); no arbitrary token values anywhere.
- [ ] **DS-02**: Dark-only gunmetal palette, one cyan interactive accent, Exo 2/IBM Plex type, tabular mono numerals, Lucide icons — encoded as token recipes.
- [ ] **DS-03**: The data-trust vocabulary is a first-class token/component set: freshness states (Актуально / Данные устаревают / Связь потеряна / Переподключение), provenance line, Known/Unknown/Conflict.

### Component Library (UIKIT)

Each as a colocated Ladle story with component states (enabled / hover / pressed / focused / selected / disabled / loading) and the click zone defined (whole row beats text).

- [ ] **KIT-01**: Layout & nav shell — top nav (desktop) + mobile tabs, role-aware slots, skip links, landmarks.
- [ ] **KIT-02**: Data-table primitives — sticky-header scroll-in-card, density toggle, sortable headers, cursor/pagination affordances, virtualization-ready row model, mobile compact-row layout (no horizontal scroll).
- [ ] **KIT-03**: Stat primitives — hero stat tiles (Score, K/D), even mini-stat grid, tier chips/pips with population-derived levels, sparkline microchart.
- [ ] **KIT-04**: Data-trust components — freshness pill, provenance line, Unknown/Conflict badges, stale/offline/reconnecting banners (space reserved, never color-alone).
- [ ] **KIT-05**: Form primitives (Ark UI) — inputs, selects, steppers, file/evidence upload, inline validation with visible labels/errors and live-region behavior.
- [ ] **KIT-06**: Overlay primitives (Ark UI) — dialog, menu, tabs, tooltip, popover; keyboard-accessible, focus-managed, no traps.
- [ ] **KIT-07**: Feedback primitives — skeletons (exact final dimensions, CLS = 0), empty states, error states, toasts, badges/pills.
- [ ] **KIT-08**: Language switcher + RU/EN i18n harness (typed keys; RU sanity-checked).

### Surfaces — Public (designed in Ladle)

- [ ] **SURF-01**: Stats Overview — tables/leaderboards/microcharts with entry points to players, squads, rotations, commander, bounty.
- [ ] **SURF-02**: Players list — search/filter, tier-colored columns, period selector, loading model (instant vs aggregate skeleton), virtualized desktop / top-N mobile.
- [ ] **SURF-03**: Player profile — identity + nick history, hero stats, squad/status, rotation/bounty/history/replay tabs, provenance.
- [ ] **SURF-04**: Squads list — search/filter, row layouts.
- [ ] **SURF-05**: Squad profile — identity, membership timeline, rotation stats, explainable squad effectiveness.
- [ ] **SURF-06**: Commander-side stats — wins/losses, filterable Unknown legacy outcomes, rotation/player/side filters.
- [ ] **SURF-07**: Bounty leaderboards — per-rotation, points-not-money, explainable formula breakdown (victim + squad effectiveness + rotation context).
- [ ] **SURF-08**: Replay detail — summary/roster + progressive event timeline (grouped mobile / dense desktop table), event→request entrypoints, provenance.

### Surfaces — Authenticated player

- [ ] **SURF-09**: Auth / Steam session UI — logged-in/out chrome, inline login prompt with return-to-flow.
- [ ] **SURF-10**: Request submission — 5 guided steppers (identity, add/remove kills, add/remove teamkills, remove player from replay, commander dispute), linked entities, evidence (image + link), draft autosave states, live-after-submit validation, success state.
- [ ] **SURF-11**: Request status / history — list + detail for the requester.

### Surfaces — Moderation / admin / ops

- [ ] **SURF-12**: Moderator request queue — filter by status/type/date, risk-plus-age default sort, mobile-usable / desktop-efficient.
- [ ] **SURF-13**: Request detail / review — submitted text, attachments, linked entities, current stats, immutable audit timeline, approve/reject with required comment, reopen.
- [ ] **SURF-14**: Admin role management.
- [ ] **SURF-15**: Admin rotation management.
- [ ] **SURF-16**: Ops — ingest conflicts / parse-job failures, limited audited actions.
- [ ] **SURF-17**: RBAC & error states — contextual 403 with missing-rights recovery, role-aware nav, 404/500.

### Surfaces — Cross-cutting

- [ ] **SURF-18**: Global state patterns — loading / empty / error / offline / reconnecting / stale, designed as reusable patterns across surfaces.

### Quality gates (applied to every surface in design-review)

- [ ] **QUAL-01**: Scenario endings ×5 (success / error system-vs-user / loading / onboarding / empty) and data-volume states ×4 (empty / few / many / limit-reached) per list, table, and field.
- [ ] **QUAL-02**: Responsiveness explicit at every breakpoint, keyed off the container (no device-frame trap); verified at the real mobile-floor width.
- [ ] **QUAL-03**: WCAG 2.2 AA (axe clean; visible focus; keyboard; 44px targets; never color-alone; logical headings) — targeted AAA where practical.
- [ ] **QUAL-04**: CLS = 0 — space reserved for media / tables / skeletons / SSE; tabular numerals; self-hosted fonts.
- [ ] **QUAL-05**: RU + EN, every string i18n-keyed, RU sanity-checked (no clipped or awkward wording).
- [ ] **QUAL-06**: Mock data internally consistent with the domain formulas (Score / K/D, population tiers) and the data-trust model.

## v2 Requirements (deferred to the v1.0 app milestone)

Built when `packages/app` graduates the designs into routes. Full set defined in the v1.0 milestone (research parked at `.planning/research-app-v1.0/`). Headline:

- App foundation: TanStack Start scaffold, typed `server-2` client + stale-types CI gate, i18n routing, Query/SSR, SSE, CI matrix.
- All public surfaces wired to server-driven 10k–100k-row tables with list→detail→Back restoration.
- Steam OAuth + the 5 request flows with server-backed drafts; moderation/admin/ops with RBAC.
- SEO (SSR, canonical, segmented sitemaps, structured data); CWV budgets; Playwright + axe + Lighthouse + bundle budgets vs a seeded `server-2`.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Porting `.design/hifi/*` code | Fake-stack plain CSS; surfaces are rebuilt natively — hi-fi is reference only |
| Routes / data wiring / SSR app | That is the v1.0 app milestone; v0.1 is design-only (Ladle) |
| Light theme | Design system is dark-only by decision |
| Payment / reward UI | Bounty is points/statistics only |
| Comparison views, nomination pages, global search | v2 product surfaces |
| Backend / parser / ingest / infra | Owned by server-2 / replay-parser-2 / replays-fetcher / infrastructure |

## Traceability

Each WS/DS/KIT/SURF requirement maps to exactly one home phase. QUAL-01..06 are per-surface
design-review gates applied within every UIKIT/surface phase (Phases 2–9), not a standalone phase —
listed as "Phases 2–9 (gate)".

| Requirement | Phase | Status |
|-------------|-------|--------|
| WS-01 | Phase 1 | Complete |
| WS-02 | Phase 1 | Complete |
| WS-03 | Phase 1 | Pending |
| WS-04 | Phase 1 | Pending |
| WS-05 | Phase 1 | Pending |
| DS-01 | Phase 1 | Pending |
| DS-02 | Phase 1 | Pending |
| DS-03 | Phase 1 | Pending |
| KIT-01 | Phase 2 | Pending |
| KIT-02 | Phase 2 | Pending |
| KIT-03 | Phase 2 | Pending |
| KIT-04 | Phase 2 | Pending |
| KIT-07 | Phase 2 | Pending |
| KIT-05 | Phase 3 | Pending |
| KIT-06 | Phase 3 | Pending |
| KIT-08 | Phase 3 | Pending |
| SURF-18 | Phase 3 | Pending |
| SURF-01 | Phase 4 | Pending |
| SURF-02 | Phase 4 | Pending |
| SURF-03 | Phase 4 | Pending |
| SURF-04 | Phase 5 | Pending |
| SURF-05 | Phase 5 | Pending |
| SURF-06 | Phase 6 | Pending |
| SURF-07 | Phase 6 | Pending |
| SURF-08 | Phase 7 | Pending |
| SURF-09 | Phase 8 | Pending |
| SURF-10 | Phase 8 | Pending |
| SURF-11 | Phase 8 | Pending |
| SURF-12 | Phase 9 | Pending |
| SURF-13 | Phase 9 | Pending |
| SURF-14 | Phase 9 | Pending |
| SURF-15 | Phase 9 | Pending |
| SURF-16 | Phase 9 | Pending |
| SURF-17 | Phase 9 | Pending |
| QUAL-01 | Phases 2–9 (gate) | Pending |
| QUAL-02 | Phases 2–9 (gate) | Pending |
| QUAL-03 | Phases 2–9 (gate) | Pending |
| QUAL-04 | Phases 2–9 (gate) | Pending |
| QUAL-05 | Phases 2–9 (gate) | Pending |
| QUAL-06 | Phases 2–9 (gate) | Pending |

**Coverage:**

- v1 requirements: 40 total (WS ×5, DS ×3, KIT ×8, SURF ×18, QUAL ×6)
- Mapped to phases: 40/40 ✓ (34 WS/DS/KIT/SURF to a single home phase; 6 QUAL gates applied across Phases 2–9)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-20*
*Last updated: 2026-06-20 after roadmap traceability mapping (9 phases, v0.1 design milestone)*
</content>
