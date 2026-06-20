# Roadmap: Solid Stats web — v0.1 Design Milestone

## Overview

This milestone designs the whole of Solid Stats `web` as an importable design system in Ladle —
no routes, no data wiring, no SSR app (that is v1.0). It starts at the buildable base: the pnpm
workspace, the `DESIGN.md` → `@theme` token pipeline, and Ladle wired to the real stack. On that
foundation it builds the UIKIT — first the structural/data-display primitives (nav, tables, stat
tiles, data-trust, feedback), then the interactive layer (Ark UI forms + overlays) and the RU/EN
i18n harness with the reusable global-state patterns. With the system and UIKIT in place, every
surface is designed end-to-end (spec → Ladle story → design-review) in dependency order: public
stats (overview → players → profile → squads → commander/bounty → replay), then the authenticated
request flows, then moderation/admin/ops. Each surface passes the same six quality gates (×5
scenario endings, ×4 data volumes, responsiveness, WCAG 2.2 AA, CLS = 0, RU+EN, domain-consistent
mock data). `.design/hifi/*` is visual reference only — every surface is built fresh on the real
stack.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Workspace & Design-System Foundation** - pnpm workspace, `DESIGN.md` → `@theme`, Ladle wired, toolchain green
- [ ] **Phase 2: UIKIT — Structural & Data-Display Primitives** - nav shell, data tables, stat primitives, data-trust, feedback
- [ ] **Phase 3: UIKIT — Interactive, i18n & Global-State Patterns** - Ark UI forms/overlays, RU/EN harness, reusable loading/empty/error/offline patterns
- [ ] **Phase 4: Public Stats — Overview, Players & Player Profile** - the hi-fi-anchored core stats trio (loading model, tiers, provenance)
- [ ] **Phase 5: Public Stats — Squads** - squads list + squad profile (membership timeline, explainable effectiveness)
- [ ] **Phase 6: Public Stats — Commander-side & Bounty** - КС wins/losses with Unknown legacy outcomes, explainable bounty leaderboards
- [ ] **Phase 7: Public Stats — Replay Detail** - summary/roster + progressive event timeline, event→request entrypoints
- [ ] **Phase 8: Authenticated Player — Auth, Requests & Status** - Steam session chrome, 5 guided request steppers, status/history
- [ ] **Phase 9: Moderation, Admin & Ops** - request queue + review, role/rotation management, ops, RBAC error states

## Phase Details

### Phase 1: Workspace & Design-System Foundation

**Goal**: The buildable base every later phase imports — a pnpm workspace whose `packages/design` package exports a Tailwind v4 `@theme` generated from the root `DESIGN.md`, with Ladle rendering on the real stack and the toolchain green.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: WS-01, WS-02, WS-03, WS-04, WS-05, DS-01, DS-02, DS-03
**Success Criteria** (what must be TRUE):

  1. `pnpm-workspace.yaml` resolves `packages/design` (importable as `@solid-stats/design`) and a `packages/app` skeleton on pnpm 11 + Node 25; a fresh `pnpm install` succeeds.
  2. `scripts/gen-theme.mjs` regenerates `packages/design` `theme.css` (the `@theme` block + `--*: initial` reset) from the root `DESIGN.md` alone — `theme.css` is never hand-edited, and the dark-only gunmetal palette / one cyan accent / Saira+IBM Plex type / tabular-mono numerals / Lucide are encoded as token recipes with no arbitrary token values.
  3. The data-trust vocabulary (freshness Актуально / Данные устаревают / Связь потеряна / Переподключение, provenance line, Known/Unknown/Conflict) exists as first-class tokens.
  4. Ladle is wired to the real stack (dark-only, the generated `@theme`) with the colocated `*.stories.tsx` convention, and a smoke story proves tokens render.
  5. `design.md lint` passes on `DESIGN.md` (contrast + token references) and the lint/format/type-check toolchain per `solidstats-frontend-react-conventions` runs green across the workspace.

**Plans**: 4/5 plans executed
**Wave 1**

- [x] 01-01-PLAN.md — Workspace scaffold + Node/pnpm pins + both package skeletons (WS-01, WS-02)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Resolve Vite+ `vp check` toolchain + self-hosted font assets (WS-05, QUAL-04)
- [x] 01-03-PLAN.md — Token pipeline: relocate OUT_PATH + data-trust `@theme` emit, drift gate (WS-03, DS-01, DS-02, DS-03)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-04-PLAN.md — Ladle wired to the real stack + the one smoke story (WS-02, WS-04)

**Wave 4** *(blocked on Wave 3 completion)*

- [ ] 01-05-PLAN.md — Workspace green gate + `.design/` freeze (WS-05)

### Phase 2: UIKIT — Structural & Data-Display Primitives

**Goal**: The durable, reviewed component catalog for everything that *displays* stats — the nav shell, the data-table family, stat primitives, the data-trust components, and feedback primitives — each as a colocated Ladle story.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: KIT-01, KIT-02, KIT-03, KIT-04, KIT-07, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06
**Success Criteria** (what must be TRUE):

  1. Nav shell (desktop top nav + mobile tabs, role-aware slots, skip links, landmarks) and the data-table family (sticky-header scroll-in-card, density toggle, sortable headers, cursor/pagination affordances, virtualization-ready rows, mobile compact-row with no horizontal scroll) are Ladle stories passing design-review.
  2. Stat primitives (hero Score/K/D tiles, even mini-stat grid, population-derived tier chips/pips, sparkline) and data-trust components (freshness pill, provenance line, Unknown/Conflict badges, stale/offline/reconnecting banners — space reserved, never color-alone) are catalogued and reviewed.
  3. Feedback primitives (skeletons at exact final dimensions, empty/error states, toasts, badges/pills) render with CLS = 0.
  4. Every primitive demonstrates its component states (enabled / hover / pressed / focused / selected / disabled / loading) and a defined click zone (whole row beats text), and is axe-clean, keyboard-operable, 44px targets, RU+EN sanity-checked.
  5. Tier/stat mock fixtures are internally consistent with the Score / K/D formulas and population tiers (`SS_BASELINE`).

**Plans**: TBD
**UI hint**: yes

### Phase 3: UIKIT — Interactive, i18n & Global-State Patterns

**Goal**: The interactive half of the UIKIT — Ark UI form and overlay primitives plus the typed RU/EN i18n harness — and the reusable global-state patterns (loading / empty / error / offline / reconnecting / stale) that every surface composes.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: KIT-05, KIT-06, KIT-08, SURF-18, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05
**Success Criteria** (what must be TRUE):

  1. Form primitives (inputs, selects, steppers, file/evidence upload) over Ark UI have visible labels/errors, inline validation, and live-region behavior; overlay primitives (dialog, menu, tabs, tooltip, popover) are keyboard-accessible and focus-managed with no traps.
  2. The language switcher + typed-ICU RU/EN harness drives every catalogued string, with RU sanity-checked for clipped/awkward wording.
  3. Global state patterns (loading / empty / error / offline / reconnecting / stale) exist as reusable, reviewed Ladle stories that reserve space (CLS = 0) and never rely on color alone.
  4. The ×5 scenario endings and ×4 data-volume states are demonstrable per interactive component, and all pass axe / keyboard / 44px-target checks.

**Plans**: TBD
**UI hint**: yes

### Phase 4: Public Stats — Overview, Players & Player Profile

**Goal**: The core public-stats trio — Stats Overview, the Players list, and the Player profile — designed end-to-end on the real stack, sharing one loading model, tier system, and provenance/freshness layer.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: SURF-01, SURF-02, SURF-03, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06
**Success Criteria** (what must be TRUE):

  1. Stats Overview is a Ladle story with tables/leaderboards/microcharts and entry points to players, squads, rotations, commander, and bounty; it passes design-review at all breakpoints.
  2. Players list is designed with search/filter, tier-colored columns, the period selector (default = active rotation), the loading model (rotation = instant; all-time = warm SSR instant / cold skeleton / in-session short skeleton), desktop virtualization and mobile top-N + "show more · N" — no horizontal scroll, CLS = 0.
  3. Player profile is designed with identity + nick history, hero Score/K/D, squad/status, rotation/bounty/history/replay tabs, and the provenance line + freshness pill — full-width stacked sections, headline data high.
  4. All three surfaces share the same shell, tier system, freshness/provenance, and i18n; mock data is single-sourced and internally consistent with the Score / K/D formulas and population tiers (Vasiliy stays #1 everywhere).
  5. Each surface renders all ×5 scenario endings and ×4 data-volume states, is axe-clean and keyboard-operable, and reads naturally in RU + EN.

**Plans**: TBD
**UI hint**: yes

### Phase 5: Public Stats — Squads

**Goal**: The squads pair — Squads list and Squad profile — designed end-to-end, including the explainable squad-effectiveness model and membership timeline.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: SURF-04, SURF-05, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06
**Success Criteria** (what must be TRUE):

  1. Squads list is a Ladle story with search/filter and row layouts consistent with the Players list shell/tier/freshness conventions; passes design-review at all breakpoints.
  2. Squad profile is designed with identity, a membership timeline, rotation stats, and an explainable squad-effectiveness breakdown — full-width stacked sections, no near-empty strips.
  3. Both surfaces render all ×5 scenario endings and ×4 data-volume states with reserved space (CLS = 0) and the data-trust layer present.
  4. Mock data is internally consistent with the domain formulas; RU + EN read naturally; axe-clean and keyboard-operable.

**Plans**: TBD
**UI hint**: yes

### Phase 6: Public Stats — Commander-side & Bounty

**Goal**: The commander-side stats and bounty leaderboards — both explainable, with honest Unknown handling and a transparent points (not money) formula breakdown.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: SURF-06, SURF-07, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06
**Success Criteria** (what must be TRUE):

  1. Commander-side stats are designed with wins/losses, rotation/player/side filters, and filterable Unknown legacy outcomes (backed by `commander_side_stats.unknown_outcomes`) rendered as a first-class state, never color-alone.
  2. Bounty leaderboards are designed per-rotation as points (not money), with an explainable formula breakdown (victim + squad effectiveness + rotation context).
  3. Both surfaces render all ×5 scenario endings and ×4 data-volume states with CLS = 0 and the provenance/freshness layer present.
  4. Mock data is internally consistent with the domain model; RU + EN read naturally; axe-clean, keyboard-operable, 44px targets.

**Plans**: TBD
**UI hint**: yes

### Phase 7: Public Stats — Replay Detail

**Goal**: The replay-detail surface — a summary/roster plus a progressive event timeline that adapts (grouped on mobile, dense table on desktop) and offers event→request entrypoints.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: SURF-08, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06
**Success Criteria** (what must be TRUE):

  1. Replay detail is a Ladle story with a summary/roster header and a progressive event timeline — grouped layout on mobile, dense desktop table — with the provenance layer present.
  2. Per-event entrypoints into the correction-request flows are designed (links forward to Phase 8 surfaces), with the click zone and states defined.
  3. The surface renders all ×5 scenario endings and ×4 data-volume states (incl. long/empty rosters and event lists) with reserved space (CLS = 0) and no mobile horizontal scroll.
  4. Mock event/roster data is internally consistent with the domain model; RU + EN read naturally; axe-clean and keyboard-operable.

**Plans**: TBD
**UI hint**: yes

### Phase 8: Authenticated Player — Auth, Requests & Status

**Goal**: The authenticated player experience — Steam-session chrome, the 5 guided correction-request steppers, and the requester's status/history view — all designed as reviewed Ladle stories.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: SURF-09, SURF-10, SURF-11, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06
**Success Criteria** (what must be TRUE):

  1. Auth/Steam session UI is designed for logged-in and logged-out chrome with an inline login prompt that preserves return-to-flow.
  2. The 5 request steppers (identity, add/remove kills, add/remove teamkills, remove player from replay, commander dispute) are designed with linked entities, evidence (image + link), draft-autosave states, live-after-submit validation, and a success state — honoring Error Prevention (Reversible / Checked / Confirmed) per WCAG 3.3.6.
  3. Request status/history is designed as a list + detail for the requester.
  4. Every surface renders all ×5 scenario endings and ×4 data-volume states with CLS = 0; forms have visible labels/errors and live-region feedback; axe-clean, keyboard-operable, 44px targets.
  5. Mock data is internally consistent with the domain model; RU + EN read naturally (SteamID masked to last four).

**Plans**: TBD
**UI hint**: yes

### Phase 9: Moderation, Admin & Ops

**Goal**: The staff surfaces — the moderator request queue and review, admin role and rotation management, ops visibility, and the RBAC/error states — designed as reviewed Ladle stories with role-aware behavior.
**Mode:** mvp
**Depends on**: Phase 8
**Requirements**: SURF-12, SURF-13, SURF-14, SURF-15, SURF-16, SURF-17, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06
**Success Criteria** (what must be TRUE):

  1. The moderator request queue is designed with filter by status/type/date, a risk-plus-age default sort, and is mobile-usable / desktop-efficient; request detail/review shows submitted text, attachments, linked entities, current stats, an immutable audit timeline, approve/reject with a required comment, and reopen.
  2. Admin role management and rotation management are designed surfaces with their CRUD and component states defined.
  3. Ops (ingest conflicts / parse-job failures with limited audited actions) is designed, and the RBAC/error states (contextual 403 with missing-rights recovery, role-aware nav, 404/500) are designed across roles.
  4. Every surface renders all ×5 scenario endings and ×4 data-volume states with CLS = 0, uses real `<h2>/<h3>` section headings, and is axe-clean and keyboard-operable.
  5. Mock data is internally consistent with the domain model; RU + EN read naturally.

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Workspace & Design-System Foundation | 4/5 | In Progress|  |
| 2. UIKIT — Structural & Data-Display Primitives | 0/TBD | Not started | - |
| 3. UIKIT — Interactive, i18n & Global-State Patterns | 0/TBD | Not started | - |
| 4. Public Stats — Overview, Players & Player Profile | 0/TBD | Not started | - |
| 5. Public Stats — Squads | 0/TBD | Not started | - |
| 6. Public Stats — Commander-side & Bounty | 0/TBD | Not started | - |
| 7. Public Stats — Replay Detail | 0/TBD | Not started | - |
| 8. Authenticated Player — Auth, Requests & Status | 0/TBD | Not started | - |
| 9. Moderation, Admin & Ops | 0/TBD | Not started | - |
