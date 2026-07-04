# Phase 2: UIKIT — Structural & Data-Display Primitives - Context

**Gathered:** 2026-06-20 (assumptions mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the durable, reviewed UIKIT component catalog for everything that *displays* stats — the
nav shell, the data-table family, stat primitives, the data-trust components, and feedback
primitives — each as a colocated Ladle story on the real stack (Tailwind v4 `@theme` + dark-only)
passing design-review. Requirements KIT-01, KIT-02, KIT-03, KIT-04, KIT-07; quality gates
QUAL-01..06 applied per component.

**In scope:** presentational primitives that consume the Phase 1 `@theme` tokens and render from
fixture data passed as props — the nav shell (KIT-01), the data-table family (KIT-02), stat
primitives incl. tier chips and the microchart (KIT-03), data-trust components (KIT-04), and
feedback primitives (KIT-07) — plus the shared domain-consistent fixtures and a placeholder RU+EN
string map that the stories render from.

**Out of scope (Phase 3 / later / v1.0):** Ark UI form & overlay primitives (KIT-05, KIT-06), the
typed i18n harness + language switcher (KIT-08), and the reusable global-state patterns (SURF-18)
are all **Phase 3**. The `Toast` trigger/portal/queue manager is Phase 3 (Phase 2 ships only its
visual primitive). Any real data wiring, the `@tanstack/react-table` row/sort engine, the
`@tanstack/react-virtual` virtualizer, cursor pagination against a server, and SSR are the **v1.0
app milestone**. No surface composition (Overview, Players, profiles) — that is Phases 4+.
</domain>

<decisions>
## Implementation Decisions

### Component Scope & Build Strategy
- **D-01:** Phase 2 ships **presentational-only primitives** — no `@tanstack/react-table` and no
  `@tanstack/react-virtual` this milestone. The data table demonstrates its full visual contract as
  markup + `@theme` tokens + fixture rows passed as props: sticky-header-scroll-in-card, sortable
  `Th` (arrow + `aria-sort`, plain button — no overlay), a density toggle (container class; `ROW_H`
  comfortable 52 / compact 44), a **virtualization-ready** row model (fixed row height + spacer rows
  above/below the visible window), cursor/pagination affordances, and a mobile compact-row layout
  (top-N + "show more · N", secondary columns dropped, no horizontal scroll). The TanStack row/sort
  engine and the virtualizer are wired in the v1.0 app milestone when real server data exists; what
  graduates into a route is the *visual contract* (colgroup, sticky header, reserved scroll height
  for CLS = 0). *Evidence: design-only milestone (REQUIREMENTS.md L5, Out-of-Scope L91); the hi-fi
  already proves the row model dependency-free (`.design/hifi/players.jsx` L11, L170-213); no such
  dep is installed in the workspace.*
- **D-02:** Component inventory & slice structure (fine granularity). Each is its own PascalCase
  slice at `packages/design/src/shared/uikit/<Component>/` with `index.ts` + a colocated
  `*.stories.tsx`, exported through `packages/design/src/index.ts` (the Smoke-story precedent +
  `architecture.md` slice rules):
  - **KIT-01 (nav shell):** `AppShell` (skip-link → header → `main`/landmarks → mobile tab-bar,
    role-aware slots), `NavBar` (desktop top-nav, `--nav-h: 56px`, active section, cyan accent),
    `MobileTabBar` (bottom tabs, 44px targets), `SkipLink`.
  - **KIT-02 (data-table):** `Table`, sortable `Th`, `TableRow`, `DensityToggle`, `CompactRow`
    (mobile), `Pagination` / `CursorAffordance`. Recipes: `table-header` / `table-row` /
    `table-row-zebra` / `table-cell-numeric` (DESIGN.md L370-391).
  - **KIT-03 (stat primitives):** `StatTile` (hero Score / K-D, tabular-mono, tier-colored),
    `MiniStatGrid` (even grid, no orphan tiles), `TierChip` / `TierScale` / `Pips`, `Sparkline`.
  - **KIT-04 (data-trust):** `FreshnessPill`, `ProvenanceLine`, `KnownBadge` / `UnknownBadge` /
    `ConflictBadge`, `StaleBanner` / `OfflineBanner` / `ReconnectingBanner`, `InlineReviewRow`.
  - **KIT-07 (feedback):** `Skeleton`, `EmptyState`, `ErrorState`, `Toast` (visual primitive only),
    `Badge` / `Pill` (incl. `badge-outcome-*` L295, `badge-status-*` L309).

### Stat Primitives & Microchart
- **D-03:** `Sparkline` and any weekly perf bars are a **custom token-driven primitive** — DOM bars
  or inline SVG filled with `var(--color-*)`/tier tokens — with **no charting dependency** (no
  recharts / visx / d3). The chart is `aria-hidden` with the value exposed in an adjacent accessible
  label/tooltip, and honors `prefers-reduced-motion`. *Evidence: "microcharts only, no chart-heavy
  dashboards" (PROJECT.md L98); the hi-fi renders bars dependency-free (`.design/hifi/players.jsx`
  L28-40, `.design/hifi/player.jsx` L234-266); a charting lib breaks CLS = 0 and imports a second
  color system, violating no-arbitrary-values.*
- **D-04:** Tier chips/scale/pips are **population-derived** — levels (ниже / норма / хорошо /
  отлично) computed from `SS_BASELINE` for the active period, never hardcoded cutoffs. Each shows
  the level name + its entry threshold (e.g. `≥2.4 ХОРОШО`), passed `baseline` explicitly (never
  mutating a global). *Evidence: `.design/CLAUDE.md` L97-101, `.design/hifi/tiers.js`.*

### Data-Trust Components (KIT-04)
- **D-05:** Data-trust components implement the **shipped A/C model only**, not the unbacked "B"
  coverage panel. `ProvenanceLine` = model **A** ("посчитано из N реплеев · freshness · Как
  считается"; recipe `provenance-line` DESIGN.md L406). `FreshnessPill` = model **C** (4 states
  «Актуально / Данные устаревают / Связь потеряна / Переподключение»; recipe `badge-freshness` L330;
  tokens `--color-freshness-*`). `Known/Unknown/Conflict` badges render the literal word in amber
  with a Lucide icon — **never color-alone**, never `0`/`—` for Unknown (recipes L412-432). The real
  Unknown that has backing today is `commander_side_stats.unknown_outcomes` (the КС surface), **not**
  per-player coverage; the per-player coverage/conflict panel ("B") is **not built** — it is not in
  the data model. `InlineReviewRow` is the quiet amber "на проверке" row inside the SteamID list it
  describes (recipe `inline-review-row` L433) — a workflow footnote, never a filled banner; its
  request data belongs to the authenticated surfaces (Phase 8). Banners reserve their space and never
  rely on color alone. *Evidence: `.design/CLAUDE.md` L108-137.*

### Fixtures & Phase-2 i18n
- **D-06:** Domain-consistent fixtures live in **one shared module inside the package**
  (`packages/design/src/shared/uikit/_fixtures/`), imported by every stat/table/tier story. It
  exports the `SS_BASELINE` tier model, the canonical formulas
  (`Счёт = (kills − TK) ÷ (games + deaths-from-TK)`, `K/D = (kills − TK) ÷ (deaths + deaths-from-TK)`),
  and a single canonical roster: the 10 Overview players **verbatim** at the top plus a deterministic
  generated tail down to negative Score, with **Vasiliy #1 everywhere**. *Evidence: QUAL-06 +
  ROADMAP Phase 2 SC#5; `.design/CLAUDE.md` L94-95 (formulas), L169-174 ("Vasiliy stays #1").*
- **D-07:** Phase-2 stories render copy from a **hardcoded bilingual RU+EN placeholder string map**
  co-located with the fixtures — verbatim to the `theme.css` annotations — **not** a real i18n
  harness. The typed ICU harness + language switcher (KIT-08) is Phase 3 (D-12 deferred the i18n
  display strings there); QUAL-05's "RU + EN sanity-checked" is satisfied now via the placeholder
  map (the seed the Phase-3 harness replaces), matching the Smoke-story precedent. *Evidence:
  01-CONTEXT.md D-12; REQUIREMENTS.md traceability L120 (KIT-08 = Phase 3); ROADMAP Phase 2 SC#4.*

### Per-Component Review Conventions
- **D-08:** Every story demonstrates the component states (enabled / hover / pressed / focused /
  selected / disabled / loading), the ×4 data-volume states (empty / few / many / limit-reached) for
  any list/table/field, and the ×5 scenario endings where applicable; defines the click zone (whole
  row beats text); and is axe-clean, keyboard-operable, with 44px targets and never color-alone. The
  exact Ladle mechanism for showing those states is a research item (see Claude's Discretion +
  Specific Ideas). *Evidence: QUAL-01..03; `.design/CLAUDE.md` L33-43.*

### Claude's Discretion
- The exact Ladle story-state mechanism (Ladle args/controls vs. a static state-matrix grid vs. a
  "Tweaks"-panel pattern à la `.design/hifi/tweaks-panel.jsx`) and how forced pseudo-states
  (`:hover`/`:focus`/`:active`) are demonstrated — left to the researcher/planner (research item #1).
- The a11y verification harness inside Ladle (Ladle's built-in axe addon vs. a separate
  Playwright-against-Ladle run) — left to the researcher/planner (research item #2).
- `Sparkline` implementation as DOM bars vs. inline SVG — both are token-driven and dependency-free;
  planner's call.
- Leaf-level granularity (e.g. whether `Th` / `Pips` are their own slices or live inside their
  parent component) — the planner reconciles against `architecture.md` slice rules; D-02 is the
  intended shape, not a rigid file count.

### Folded Todos
None — `todo.match-phase 2` returned zero matches.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` — Phase 2 section + success criteria #1-5 (the goal-backward truth set).
- `.planning/REQUIREMENTS.md` — KIT-01..04, KIT-07, QUAL-01..06 exact wording (L29-36, L70-75); the
  Phase-2/3 traceability split (L113-121); Out-of-Scope (L86-95).
- `.planning/phases/01-workspace-design-system-foundation/01-CONTEXT.md` — locked Phase 1 decisions:
  D-07 (story path `packages/design/src/shared/uikit/<Component>/`), D-08 (Ladle config + self-hosted
  fonts), D-10/D-12 (which tokens exist; the i18n-string + KIT-08 deferral), D-11 (`.design/` frozen
  EXCEPT `.design/CLAUDE.md` + `.design/MIGRATION.md`).

### Design system & binding domain truth
- `DESIGN.md` — the authored component recipes (`badge-outcome-*` L295, `badge-status-*` L309,
  `badge-freshness` L330, `table-*` L370-391, `stat-tile` L393, `provenance-line` L406,
  `badge-known/unknown/conflict` L412-432, `inline-review-row` L433) and the `## Components` /
  Do's-and-Don'ts section (L639+). Token source of truth — no arbitrary values.
- `.design/CLAUDE.md` — BINDING per-surface design rules + domain truth: Score / K-D formulas
  (L94-95), population tiers `SS_BASELINE` (L97-101), the data-trust A/C-not-B model (L108-137), the
  list loading/virtualization model (L150-184), "Vasiliy stays #1" (L169-174), component-states +
  click-zone checklist (L33-43). Stays live and authoritative.
- `packages/design/src/styles/theme.css` — the generated tokens actually available to components
  (data-trust tokens at L135-158).

### Visual reference (reference only — never ported, per 01-CONTEXT D-11)
- `.design/hifi/shell.jsx` (nav shell → KIT-01), `.design/hifi/players.jsx` + `.design/hifi/overview.jsx`
  (tables + sparkline → KIT-02/03), `.design/hifi/player.jsx` (hero tiles / mini-stat grid → KIT-03),
  `.design/hifi/tiers.js` (population-tier model), `.design/hifi/squad-row-variants.jsx`,
  `.design/hifi/kit.css`, `.design/hifi/tweaks-panel.jsx` (the state-toggle panel pattern).

### Established conventions (the rule sources the planner enforces)
- `.claude/skills/solidstats-frontend-react-conventions/SKILL.md` + `references/patterns/architecture.md`
  (`shared/uikit` slice rules, props-down primitive boundary), `references/patterns/styling.md`
  (`@theme` consumption, no-arbitrary-values), `references/patterns/component-shape.md`,
  `references/patterns/a11y.md`, `references/patterns/performance.md` (CLS budget).
- `.claude/skills/solidstats-frontend-react-design/SKILL.md` + `references/pipeline.md`
  (brief→spec→Ladle→review→graduate; Ladle-as-durable-catalog), `references/spec-template.md`
  (the per-component spec format: states / data volumes / breakpoints), `references/design-system.md`
  (breakpoint + container token set).
- `.claude/skills/solidstats-frontend-react-design-review/SKILL.md` — the design-review gate each
  component must pass.
- `packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx` + `packages/design/src/index.ts` +
  `packages/design/package.json` — the established story/export/dep pattern Phase 2 follows.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `DESIGN.md` component recipes (L295-439) — every KIT-04 / KIT-02 / KIT-03 primitive already has a
  token recipe; `theme.css` (L135-158) already ships the resolved `--color-freshness-*`,
  `--color-known/unknown/conflict-*`, `--color-provenance-*` tokens. Components have tokens to
  consume today.
- `.design/hifi/tiers.js` — the `SS_BASELINE` / `SS_TIER` population-tier model, reusable as the
  fixtures seed (rebuilt natively, not imported from the frozen hi-fi).
- `.design/hifi/players.jsx`, `player.jsx` — dependency-free proofs of the row model (fixed `ROW_H`,
  spacer-row virtualization, sticky header, sortable `Th`, density, mobile top-N) and the microchart
  (DOM/positioned bars), to rebuild on the real stack.
- `packages/design/src/shared/uikit/Smoke/` — the established colocated-story pattern (+ the empty
  barrel `src/index.ts` that components graduate into).

### Established Patterns
- FSD `shared/uikit` colocation: one PascalCase slice owns its component + `*.stories.tsx`
  (conventions `architecture.md`); `shared/uikit` is generic primitives only — props-down, no
  imports of pages/business/localization.
- Tailwind v4 `@theme` consumed via `@tailwindcss/vite`, `theme.css` imported once, **no arbitrary
  values** (conventions `styling.md`; DESIGN.md Do's-and-Don'ts).
- Single canonical fixture source so Score/K-D and tiers stay internally consistent across tiles,
  tables, and chips ("Vasiliy #1 everywhere").

### Integration Points
- `packages/design/src/index.ts` — the barrel every later phase imports `@solid-stats/design`
  through; Phase 2 graduates the primitives into it.
- The colocated Ladle stories are the durable catalog Phases 4-9 compose surfaces from.
- The shared `_fixtures` module is the single seam the stat/table/tier stories share; in v1.0 the
  same components swap fixtures for the typed `server-2` client.
</code_context>

<specifics>
## Specific Ideas

Two items forwarded to the planning researcher (`gsd-phase-researcher`) — not blocking, not user
decisions; they resolve execution mechanics, not the locked decisions above:

1. **Ladle 5.1 × Tailwind v4 per-story state ergonomics.** Decide how to demonstrate the component
   states (enabled / hover / pressed / focused / selected / disabled / loading) and the ×4
   data-volume states in a single story: Ladle args/controls vs. a static state-matrix grid vs. the
   hi-fi "Tweaks"-panel pattern (`.design/hifi/tweaks-panel.jsx`), and whether forced pseudo-states
   need a Ladle addon or manual class toggles. No precedent beyond the single static `Smoke` story —
   verify against the current `@ladle/react@5.1.x` API.
2. **axe / keyboard / 44px verification harness inside Ladle (QUAL-03).** Confirm the Phase-2 a11y
   execution path — Ladle's built-in axe addon vs. a separate Playwright-against-Ladle run — since
   `packages/design` has no Playwright/axe wired yet. The design-review skill assumes axe-core runs
   in review.
</specifics>

<deferred>
## Deferred Ideas

- **Per-player coverage/conflict data-trust panel ("B").** Not in the data model (an unparsed replay
  has no extracted roster, so "whose games" is structurally unknowable; conflict has no per-player
  key). Revisit only if production drops/queues games at a player-visible rate. *(`.design/CLAUDE.md`
  L130-137.)*
- **Typed ICU i18n harness + language switcher (KIT-08), Ark UI form & overlay primitives
  (KIT-05/06), and the reusable global-state patterns (SURF-18)** → Phase 3.
- **`Toast` trigger / portal / queue manager** → Phase 3 (Phase 2 ships only the toast visual
  primitive).
- **TanStack Table row/sort engine + `@tanstack/react-virtual` virtualizer + cursor pagination
  against a server** → v1.0 app milestone (D-01).

### Reviewed Todos (not folded)
None — `todo.match-phase 2` returned zero matches.
</deferred>
