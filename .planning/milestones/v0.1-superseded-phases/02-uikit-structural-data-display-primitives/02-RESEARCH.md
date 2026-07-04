# Phase 2: UIKIT — Structural & Data-Display Primitives - Research

**Researched:** 2026-06-20
**Domain:** Ladle 5.1 component-catalog ergonomics × Tailwind v4 · a11y/CLS verification harness inside `packages/design` · dependency-free microcharts · domain-consistent fixtures
**Confidence:** HIGH (execution mechanics verified against live Ladle/Playwright/axe docs + the installed stack; visual contract is already locked upstream)

## Summary

The visual contract, component inventory, tokens, copy, and domain truth for Phase 2 are **already locked** by `02-CONTEXT.md` (D-01..D-08), `02-UI-SPEC.md` (approved 6/6), `DESIGN.md`, and `.design/CLAUDE.md`. This research does **not** re-derive any of that. It resolves the five unresolved *execution mechanics* the planner needs: (1) how one Ladle story demonstrates the ×7 component states + ×4 data-volume states + forced pseudo-states; (2) the concrete axe/keyboard/44px verification harness to wire into `packages/design` (currently bare of any test tooling); (3) the Sparkline technique; (4) CLS-0 mechanics for skeletons + tables; (5) the Validation Architecture that VALIDATION.md will consume.

The two priority items resolve cleanly. **State demonstration:** the recommended uniform mechanism is a **static state-matrix grid inside each story** (one labelled cell per state) as the primary, screenshot-and-axe-friendly surface, *plus* Ladle's native `args`/`argTypes` controls for interactive exploration of the live prop space. Forced pseudo-states (`:hover`/`:active`/`:focus-visible`) are shown via a **`data-state` attribute convention** that the component's `tailwind-variants` recipe keys off (e.g. `data-[state=hover]:bg-surface-3`) — NOT via real pointer simulation, and NOT via arbitrary values. This stays inside the no-arbitrary-values rule and Tailwind v4's `@source ../src` scan. **Verification harness:** Ladle's *built-in* axe addon is a dev-time interactive aid only — the **gate** is `@playwright/test` + `@axe-core/playwright` driving the built Ladle catalog, iterating every story via the `meta.json` + `?story=…&mode=preview` + `[data-storyloaded]` pattern. Keyboard-operability and 44px-target checks are Playwright geometry/focus assertions in the same spec. Pure tier/formula fixture-consistency is Vitest. This matches the `solidstats-frontend-react-tests` runner split exactly (Vitest = pure logic; Playwright-against-Ladle = components/a11y) and resolves how SC#4 + QUAL-03 are actually verified.

**Primary recommendation:** Each `<Component>` slice ships `index.ts` + `*.stories.tsx`, where the story renders a **static state-matrix** (the durable visual/axe surface) and exposes `args`/`argTypes` for live prop exploration; forced pseudo-states come from a `data-state` prop wired into the component's `tv()` recipe. Wire **Vitest** (fixtures/tier math) + **`@playwright/test` + `@axe-core/playwright`** (per-story axe + keyboard + 44px geometry, iterating `meta.json`) into `packages/design` as the Phase-2 harness. Sparkline = DOM bars (`% height` + `var(--color-chart-*)`), `aria-hidden` chart + `<figure>` hidden text summary, `motion-reduce:` honored, fixed height for CLS=0.

## Architectural Responsibility Map

Phase 2 is a single-tier deliverable — a **presentational primitive catalog** rendered in Ladle from fixtures. There is no browser-routing tier, no SSR/frontend-server tier, no API/backend tier, no DB tier in scope (D-01: engines and server data are the v1.0 app milestone). The map below assigns each Phase-2 capability to its owner *within the catalog*, which is what prevents misassignment (e.g. putting sort/density *logic* into a primitive instead of leaving it a controlled prop).

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Render nav shell / table / tiles / data-trust / feedback from props | `shared/uikit` primitive (displays) | — | Props-down generic primitives; no business/page/localization imports (architecture.md "Uikit vs feature UI") `[CITED: architecture.md]` |
| Sort state, density, selection, pagination position | Controlled prop (parent owns) | — | D-01: no engine this phase; the prop contract is the durable interface that swaps to TanStack/server in v1.0 `[CITED: 02-CONTEXT.md D-01]` |
| Tier level derivation from population | `_fixtures` lib (pure fn, `baseline` passed explicitly) | Vitest unit | D-04: population-derived, never hardcoded, never mutate a global `[CITED: .design/CLAUDE.md L97-101]` |
| Bilingual copy | `_fixtures` placeholder string map | — | D-07: hardcoded RU+EN map, NOT an i18n harness (that is Phase 3 KIT-08) `[CITED: 02-CONTEXT.md D-07]` |
| Forced pseudo-state display (hover/active/focus) | `data-state` prop → `tv()` recipe variant | Ladle args | No real pointer in a static catalog cell; keeps tokens-only `[VERIFIED: ladle.dev/docs/controls]` |
| State-matrix + live-control demonstration | Ladle story (the catalog harness) | — | The story IS the unit + the design catalog (frontend-tests "story is the unit") `[CITED: solidstats-frontend-react-tests]` |
| axe / keyboard / 44px verification | Playwright + `@axe-core/playwright` against built Ladle | Vitest (pure) | Ladle's built-in axe addon is interactive-only; the gate is Playwright-against-Ladle `[VERIFIED: ladle.dev/docs/a11y + visual-snapshots]` |

## Standard Stack

### Core (already installed in `packages/design` — do NOT re-add)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@ladle/react` | 5.1.1 | The durable component catalog + the test isolation harness | Phase-1 locked; `solidstats-frontend-react-design` mandates Ladle as the durable UIKit catalog `[VERIFIED: package.json]` |
| `tailwindcss` | 4.3.1 | `@theme`-token utilities, no arbitrary values | Phase-1 locked `[VERIFIED: package.json]` |
| `@tailwindcss/vite` | 4.3.1 | Tailwind v4 Vite plugin feeding Ladle | Phase-1 locked `[VERIFIED: package.json]` |
| `react` / `react-dom` | 19.2.0 | Component runtime | Phase-1 locked `[VERIFIED: package.json]` |

### Supporting (new dev-deps Phase 2 must add to `packages/design`)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `tailwind-variants` | latest (verify) | Variant/state/slot class composition (button, badge, table row, freshness pill) — owns the `data-state` → class mapping | Any component with variants/states/sizes; mandated by styling.md over hand-concatenated class strings `[CITED: styling.md]` |
| `vitest` | 4.1.9 | Pure-logic unit tests: tier derivation, Score/K-D formula consistency, the RU+EN map shape | The runner split: Vitest = hooks/pure logic `[VERIFIED: npm — solidstats-frontend-react-tests]` |
| `@playwright/test` | 1.61.0 | Drive the built Ladle catalog one story at a time (axe, keyboard, 44px geometry, screenshot) | The runner split: Playwright = components/a11y via the Ladle story harness `[VERIFIED: npm — solidstats-frontend-react-tests]` |
| `@axe-core/playwright` | 4.11.3 | axe-core injected into each story page; serious/critical block | Free MPL-2.0 engine the design-review checklist names explicitly `[VERIFIED: npm — design-review checklist.md L42]` |
| `lucide-react` | latest (verify) | The only icon family (nav, freshness, badges, deltas, sort arrows) | DESIGN.md "Shapes"; Lucide is the locked icon set `[CITED: 02-UI-SPEC.md]` |

> **Optional, planner's call:** `sync-fetch` (the Ladle visual-snapshots example uses it to read `meta.json` synchronously at spec-collection time). A native `fetch` in a global-setup that writes the story list to a temp file, or Playwright's own request fixture, avoids the extra dep. Prefer no new dep if `meta.json` can be read in `globalSetup`.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static state-matrix grid in the story | Ladle `args`/`argTypes` controls *only* | Controls are great for interactive exploration but show ONE state at a time — a screenshot/axe pass can't see all 7 states, and a reviewer must click. Use BOTH: matrix is the durable surface, controls are the explorer. `[VERIFIED: ladle.dev/docs/controls]` |
| Static state-matrix grid | The hi-fi "Tweaks"-panel (`tweaks-panel.jsx`) | The Tweaks panel is a heavy `postMessage`-host-coupled overlay built for the frozen plain-CSS prototype harness; porting it violates D-11 (`.design/hifi/*` is reference only) and duplicates what Ladle args already give for free. Reject. `[CITED: 01-CONTEXT.md D-11]` |
| `@axe-core/playwright` (gate) | Ladle's built-in a11y addon as the gate | Ladle's addon is an **interactive dev aid** (sidebar panel), not a CI assertion — it does not fail a build. Keep it `enabled` for authoring, but the gate must be Playwright+axe. `[VERIFIED: ladle.dev/docs/a11y]` |
| DOM bars for Sparkline | inline SVG `<rect>`/`<polyline>` filled with `var(--color-chart-*)` | Both are token-driven and dependency-free; D-03 leaves the choice to the planner. DOM bars match the hi-fi proof exactly (`% height` + `bottom`); SVG is crisper for a continuous line. Either is acceptable — pick one and apply uniformly. `[CITED: 02-CONTEXT.md D-03]` |
| Real pointer pseudo-state | Playwright `:hover` via `page.hover()` for the screenshot | Works for a screenshot but not for a *static catalog cell* a reviewer reads at a glance, and can't show hover+focus simultaneously. The `data-state` attribute convention shows all forced states side by side, no pointer. `[VERIFIED: design pattern]` |

**Installation:**
```bash
pnpm --filter @solid-stats/design add -D vitest @playwright/test @axe-core/playwright
pnpm --filter @solid-stats/design add tailwind-variants lucide-react
# verify exact latest versions before locking:
npm view tailwind-variants version
npm view lucide-react version
```

**Version verification:** `@ladle/react@5.1.1`, `tailwindcss@4.3.1`, `@tailwindcss/vite@4.3.1`, `react@19.2.0` confirmed installed `[VERIFIED: packages/design/package.json]`. `vitest@4.1.9`, `@playwright/test@1.61.0`, `@axe-core/playwright@4.11.3` confirmed current on npm 2026-06-20 `[VERIFIED: npm view]`. `tailwind-variants` and `lucide-react` must have their exact versions confirmed by the planner before locking (a `checkpoint:human-verify` is appropriate — see Package Legitimacy Audit).

## Package Legitimacy Audit

> Phase 2 adds external dev/runtime packages, so this audit is required. The five candidates are all well-established; the two not yet present in the lockfile (`tailwind-variants`, `lucide-react`) should be confirmed at install time.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `@ladle/react` | npm | ~4 yrs | ~200k/wk | github.com/tajo/ladle | OK | Already installed (Phase 1) |
| `tailwindcss` | npm | ~7 yrs | ~20M/wk | github.com/tailwindlabs/tailwindcss | OK | Already installed |
| `vitest` | npm | ~3 yrs | ~12M/wk | github.com/vitest-dev/vitest | OK | Approved |
| `@playwright/test` | npm | ~4 yrs | ~12M/wk | github.com/microsoft/playwright | OK | Approved |
| `@axe-core/playwright` | npm | ~4 yrs | ~700k/wk | github.com/dequelabs/axe-core-npm | OK | Approved (named in design-review checklist) |
| `tailwind-variants` | npm | ~2 yrs | ~1M/wk | github.com/heroui-inc/tailwind-variants | OK | Approved (mandated by styling.md) — confirm version at install |
| `lucide-react` | npm | ~3 yrs | ~5M/wk | github.com/lucide-icons/lucide | OK | Approved (locked icon set) — confirm version at install |

**Packages removed due to [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** none. (Download/age figures above are approximate from training knowledge and were not re-queried against the registry this session; the planner should let the install step confirm exact versions. None are obscure or new — all are first-tier ecosystem packages with known repos.)

## Architecture Patterns

### System Architecture Diagram

```
                         ┌─────────────────────────────────────────────┐
                         │  _fixtures/  (single shared module, D-06)     │
                         │  • SS_BASELINE tier model (per period)        │
                         │  • Score/K-D formulas → canonical roster      │
                         │    (10 Overview players verbatim + tail;       │
                         │     Vasiliy #1 everywhere)                    │
                         │  • RU+EN placeholder string map (D-07)        │
                         └───────────────┬─────────────────────────────┘
                                         │ imported as props (rows, baseline, strings)
                                         ▼
   theme.css @theme ──utilities──►  <Component> slice  (shared/uikit/<Component>/)
   (--color-*, --text-*,            ┌──────────────────────────────────┐
    --color-freshness-* …)          │ index.ts  → default export       │
        │                           │ <Component>.tsx → tv() recipe,    │
        │ compound border tokens    │   data-state variant, props-down  │
        │ (1px solid …) via          │ <Component>.stories.tsx:          │
        │ inline style reading var() │   • static STATE-MATRIX grid ◄── the durable visual + axe surface
        ▼                           │   • Story.args / argTypes  ◄────── live prop explorer
   inline style={{ borderColor }}   └───────────────┬──────────────────┘
                                                     │ graduates into
                                                     ▼
                                       packages/design/src/index.ts (barrel)
                                                     │
                          ┌──────────────────────────┴───────────────────────┐
                          ▼                                                    ▼
         ladle build → static catalog + meta.json            Vitest (pure fixtures/tier math)
                          │
        Playwright iterates meta.json stories
        ?story=<key>&mode=preview → [data-storyloaded]
                          │
        ┌─────────────────┼──────────────────┬─────────────────┐
        ▼                 ▼                  ▼                 ▼
   @axe-core/playwright  keyboard nav    44px geometry     (screenshot — optional)
   (serious/critical    (Tab/Enter/      (boundingBox
    block)               arrows)          ≥ 44×44)
```

### Recommended Project Structure
```
packages/design/
├── .ladle/
│   ├── config.mjs        # addons.a11y.enabled = true (dev aid); existing Vite/Tailwind wiring
│   └── tailwind.css      # @import theme.css; @source ../src  (Phase-1 fact — DO NOT touch)
├── playwright.config.ts  # NEW — webServer: ladle build+serve OR ladle dev; testDir
├── vitest.config.ts      # NEW — pure-logic units
├── tests/
│   ├── a11y.spec.ts      # NEW — iterate meta.json: axe + keyboard + 44px per story
│   └── globalSetup.ts    # NEW — (optional) read meta.json story list
└── src/
    ├── index.ts          # barrel — components graduate here
    └── shared/uikit/
        ├── _fixtures/                 # D-06 single shared module
        │   ├── index.ts               # SS_BASELINE, roster, formulas, strings
        │   ├── tiers.ts               # population-derived tier fn (Vitest target)
        │   ├── roster.ts              # canonical 10 + generated tail
        │   ├── strings.ts             # RU+EN placeholder map
        │   └── _fixtures.test.ts      # Vitest: formula + tier + Vasiliy-#1 consistency
        ├── _state-matrix/             # NEW shared story helper (StateMatrix grid, StateCell)
        ├── AppShell/  NavBar/  MobileTabBar/  SkipLink/        # KIT-01
        ├── Table/  Th/  TableRow/  DensityToggle/  CompactRow/  Pagination/   # KIT-02
        ├── StatTile/  MiniStatGrid/  TierChip/  TierScale/  Pips/  Sparkline/ # KIT-03
        ├── FreshnessPill/  ProvenanceLine/  KnownBadge/ UnknownBadge/ ConflictBadge/
        │   StaleBanner/  OfflineBanner/  ReconnectingBanner/  InlineReviewRow/   # KIT-04
        └── Skeleton/  EmptyState/  ErrorState/  Toast/  Badge/  Pill/           # KIT-07
```

> The `_state-matrix/` shared helper is the key DRY move: a single `<StateMatrix>` / `<StateCell label>` pair that every story reuses to lay out its ×7 states uniformly. This makes the matrix consistent across all 30+ slices and gives the Playwright spec a predictable structure to assert against. (`shared/uikit` may host a generic primitive like this; it imports nothing page/business/localization — architecture.md compliant.) `[CITED: architecture.md]`

### Pattern 1: The uniform per-story state matrix + args explorer
**What:** Each story default-exports a static grid of labelled cells (one per applicable state) AND declares `args`/`argTypes` for live exploration.
**When to use:** Every primitive (D-08 mandates the ×7 states + ×4 data volumes per story).
**Example:**
```tsx
// Source: ladle.dev/docs/controls (args/argTypes API) + design pattern
// FreshnessPill.stories.tsx
import type { Story, StoryDefault } from "@ladle/react";
import { StateMatrix, StateCell } from "../_state-matrix";
import { FreshnessPill } from "./FreshnessPill";
import { STRINGS } from "../_fixtures";

export default { title: "KIT-04 Data-trust / FreshnessPill" } satisfies StoryDefault;

// 1) The durable visual + axe surface: all content states at once.
export const Matrix: Story = () => (
  <StateMatrix>
    <StateCell label="up-to-date"><FreshnessPill state="up-to-date" /></StateCell>
    <StateCell label="stale"><FreshnessPill state="stale" /></StateCell>
    <StateCell label="offline"><FreshnessPill state="offline" /></StateCell>
    <StateCell label="reconnecting"><FreshnessPill state="reconnecting" /></StateCell>
  </StateMatrix>
);

// 2) The live explorer: Ladle renders a control panel for these.
export const Playground: Story<{ state: FreshnessState }> = ({ state }) => (
  <FreshnessPill state={state} />
);
Playground.args = { state: "up-to-date" };
Playground.argTypes = {
  state: {
    options: ["up-to-date", "stale", "offline", "reconnecting"],
    control: { type: "inline-radio" },
  },
};
```

### Pattern 2: Forced pseudo-states via a `data-state` attribute + tv() recipe (NO arbitrary values, NO real pointer)
**What:** The component reads an optional `data-state` (or a `forcedState` prop that sets it) and its `tailwind-variants` recipe maps each forced state to the SAME utilities the real `:hover`/`:active`/`:focus-visible` would apply. The matrix renders one cell per forced state.
**When to use:** Any interactive primitive (nav item, table row, sortable Th, buttons inside Toast/Pagination) where the ×7 states include hover/pressed/focused.
**Example:**
```tsx
// Source: tailwind-variants + Tailwind v4 data-* variant; styling.md (tokens only)
import { tv } from "tailwind-variants";

const navItem = tv({
  base: "flex items-center gap-2 px-3 min-h-11 rounded-md text-text-muted",
  variants: {
    // real interaction:
    // (hover/active/focus utilities live here too via group/peer or direct pseudo)
    state: {
      enabled:  "",
      hover:    "bg-surface-1 text-text-primary",        // == hover:bg-surface-1 …
      pressed:  "bg-surface-2 translate-y-px",
      focused:  "outline-none ring-2 ring-primary",      // == focus-visible ring
      selected: "text-primary",                          // + cyan edge marker, aria-current
      disabled: "text-text-subtle opacity-60 pointer-events-none",
    },
  },
});
// In the live component, also apply hover:/active:/focus-visible: utilities so REAL
// interaction works; data-state is the DEMO override the matrix uses.
```
- Tailwind v4 scans `src/**` only because `.ladle/tailwind.css` declares `@source ../src` (Phase-1 fact). Every utility used in a `tv()` recipe and every `data-[state=…]` variant must appear as a literal class string in a `.tsx` under `src/` so the scanner emits it. Do not build class names dynamically by concatenation — `tv()` keeps them literal. `[CITED: 02-CONTEXT.md research-focus; styling.md]`
- This is **not** an arbitrary value: `ring-primary`, `bg-surface-1`, `min-h-11`, `translate-y-px` are all token/stock-scale utilities. `[CITED: styling.md]`

### Pattern 3: Compound data-trust border token via inline style reading the custom property (sanctioned escape hatch)
**What:** `--color-freshness-*-border` resolves to `1px solid rgba(...)` — a compound value not expressible as a single Tailwind utility. Consume it via `style={{ borderColor / border: "var(--color-freshness-stale-border)" }}` reading the CSS variable. This is the **one sanctioned** inline-style escape hatch (Smoke-story precedent), NOT an arbitrary value.
**When to use:** `FreshnessPill`, and any KIT-04 component consuming `--color-*-border` / `--color-*-fill` / `--color-*-text` compound tokens.
**Example:**
```tsx
// Source: packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx (precedent)
<span
  className="rounded-full px-3 py-1 text-xs font-medium"
  style={{
    backgroundColor: "var(--color-freshness-stale-fill)",
    color: "var(--color-freshness-stale-text)",
    border: "var(--color-freshness-stale-border)",   // compound "1px solid …"
  }}
>
  Данные устаревают
</span>
```
- The reviewer/linter must NOT flag this as an arbitrary value: it reads a `@theme` token via `var()`, the explicitly-sanctioned path in styling.md ("a genuine escape hatch … reads a CSS variable from `@theme`, not a hardcoded literal"). `[VERIFIED: Smoke.stories.tsx + styling.md]`

### Pattern 4: Dependency-free Sparkline (DOM bars), aria-hidden chart + accessible summary
**What:** Bars are `<i>`/`<span>` with `style={{ height: \`${pct}%\` }}` inside a fixed-height flex row, filled by a `tier-*` / `chart-*` token class. The chart wrapper is `aria-hidden`; an adjacent visually-hidden text node carries the value summary inside a `<figure>`.
**When to use:** `Sparkline`, weekly perf bars (KIT-03, D-03). No recharts/visx/d3.
**Example:**
```tsx
// Source: .design/hifi/players.jsx L28-40 (Trend) + a11y.md (figure + hidden summary)
<figure className="flex items-end gap-0.5 h-8" aria-hidden="true">
  {weeks.map((v, i) => (
    <i key={i} className={`flex-1 rounded-xs bg-chart-1`}
       style={{ height: `${Math.max(pct(v), 8)}%` }} />
  ))}
</figure>
<figcaption className="sr-only">Недельный счёт: {weeks.join(", ")}</figcaption>
```
- Height is set via inline `style` reading a *computed percentage*, which is a legitimate dynamic value (a11y/perf escape hatch for a computed dimension), not a themable color/spacing token — styling.md permits "a dynamic computed value" via inline style. The bar *fill* must still be a token class (`bg-chart-1` / `tier-*`), never an inline hex. `[CITED: styling.md; .design/CLAUDE.md D-03]`
- Animate `transform`/`opacity` only; gate any grow animation behind `motion-reduce:` (or render static under `prefers-reduced-motion`). Fixed wrapper height → CLS=0. `[CITED: performance.md; a11y.md]`
- `sr-only` must exist as a utility — confirm Tailwind v4 ships it or add a `.sr-only` in the base layer (planner: verify; Tailwind v4 includes `sr-only`).

### Pattern 5: CLS-0 table + skeleton (colgroup + fixed ROW_H + reserved scroll height)
**What:** The table uses `<table>` with a `<colgroup>` of fixed `<col>` widths; rows are fixed-height (`ROW_H` 52/44); the scroll viewport reserves its final height; the loading skeleton reproduces the exact colgroup + header + N×ROW_H so swapping skeleton→data shifts nothing.
**When to use:** `Table`, `Skeleton` (table variant), `TableRow` loading state (KIT-02, KIT-07; SC#3).
**Example:**
```tsx
// Source: .design/CLAUDE.md L160-168 (skeleton same colgroup+header+reserved height, CLS≈0)
<div className="overflow-y-auto" style={{ height: VIEWPORT_H }}>{/* reserved */}
  <table className="w-full table-fixed">
    <colgroup>{COLS.map((c) => <col key={c.key} style={{ width: c.w }} />)}</colgroup>
    <thead className="sticky top-0 bg-surface-2">…</thead>
    <tbody>
      {loading
        ? Array.from({ length: ROWS_VISIBLE }).map((_, i) => (
            <tr key={i} style={{ height: ROW_H }}><SkeletonRow /></tr>))
        : rows.map((r) => <TableRow key={r.id} row={r} style={{ height: ROW_H }} />)}
    </tbody>
  </table>
</div>
```
- The **virtualization-ready** row model (D-01): top/bottom spacer rows of computed height frame the visible window, so the v1.0 virtualizer drops in without changing the visual contract. Spacer heights are computed dynamic values (inline style), not tokens. `[CITED: 02-CONTEXT.md D-01; .design/CLAUDE.md L150-168]`
- Selected row = `bg-primary-weak` + an inset 2px cyan left-edge marker (a `border-l-2 border-primary` or `box-shadow inset`) + `aria-selected` — never fill-only. `[CITED: 02-UI-SPEC.md KIT-02]`

### Anti-Patterns to Avoid
- **Arbitrary Tailwind values** (`bg-[#36C5E0]`, `p-[7px]`, `text-[13px]`, `w-[317px]`) — banned; a missing value means a missing token. Exception: a *computed dynamic dimension* (bar height %, spacer height, reserved viewport height) via inline `style`, and the *compound data-trust border token* via `var()`. `[CITED: styling.md]`
- **Porting `.design/hifi/*` code** (incl. `tweaks-panel.jsx`, `tiers.js`) — reference only; rebuild natively. `[CITED: 01-CONTEXT.md D-11]`
- **A charting dependency** (recharts/visx/d3) — breaks CLS, imports a second color system. `[CITED: D-03]`
- **`@tanstack/react-table` / `@tanstack/react-virtual`** this phase — D-01 defers them; sort/density/selection are controlled props. `[CITED: D-01]`
- **`0` or `—` for Unknown** — Unknown is the literal amber word + icon, never color-alone, never a placeholder dash. `[CITED: D-05; checklist.md Pillar 6]`
- **RTL render-and-assert-DOM tests** — banned by the runner split; component behavior is Playwright-against-Ladle. `[CITED: solidstats-frontend-react-tests]`
- **Color-alone semantics** — every semantic color pairs with a Lucide icon and/or text. `[CITED: a11y.md]`
- **Animating layout properties** (width/height/top/left/margin) — `transform`/`opacity` only. `[CITED: performance.md, styling.md]`
- **Mutating a global tier baseline** — pass `baseline` explicitly to tier calls. `[CITED: D-04]`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Variant/state → class mapping | A bespoke `cn()`-with-if-chains recipe layer or class-string concatenation | `tailwind-variants` (`tv()`) | Mandated by styling.md; owns conflict resolution, slots, the `data-state` variant — and keeps class strings literal for Tailwind's source scan `[CITED: styling.md]` |
| Story state controls | A hand-built control panel / the hi-fi Tweaks `postMessage` overlay | Ladle `args`/`argTypes` | Native, free, type-safe; the Tweaks panel is frozen-prototype-only (D-11) `[VERIFIED: ladle.dev/docs/controls]` |
| a11y assertions | Manual axe-rule reimplementation | `@axe-core/playwright` | The free MPL-2.0 engine the design-review checklist names; serious/critical block `[VERIFIED: checklist.md L42]` |
| Story enumeration for tests | A hardcoded list of story keys | Ladle `meta.json` + iterate | Stays in sync automatically; the documented Ladle test pattern `[VERIFIED: ladle.dev visual-snapshots]` |
| Icons | Inline SVG paths / emoji | `lucide-react` | The single locked icon family `[CITED: 02-UI-SPEC.md]` |
| Accessible chart | A `<canvas>` chart / ARIA-labelled bar graph | `aria-hidden` DOM/SVG bars + `<figure>` hidden text summary | a11y.md pattern; avoids a charting dep `[CITED: a11y.md; D-03]` |

**Key insight:** Phase 2's entire value is a *reviewed, consistent* catalog. Every "don't hand-roll" here protects consistency — one variant engine, one icon set, one a11y engine, one fixture source — so 30+ slices behave identically under review and the v1.0 swap-to-server is mechanical.

## Common Pitfalls

### Pitfall 1: Tailwind v4 silently drops a `data-state` utility from the build
**What goes wrong:** A `data-[state=hover]:bg-surface-3` (or a `tv()` variant) renders nothing because the class string never reached Tailwind's source scanner.
**Why it happens:** Ladle's Vite root is its bundled app dir in `node_modules`, so Tailwind's auto content-detection misses `packages/design/src`; only the explicit `@source ../src` in `.ladle/tailwind.css` makes the scan work (Phase-1 fact). A class built by string concatenation, or living in a file outside `src/`, won't be emitted.
**How to avoid:** Keep every class literal (let `tv()` hold them), keep all stories/components under `src/`, never compute class names. After adding a new `data-state` variant, visually confirm it renders in `ladle dev`.
**Warning signs:** A state cell looks identical to `enabled`; a utility works in one story but not another.

### Pitfall 2: Ladle's built-in axe addon mistaken for the CI gate
**What goes wrong:** Team assumes "axe is wired" because the addon shows a panel, but nothing blocks merge.
**Why it happens:** `addons.a11y.enabled` is an interactive dev aid, not an assertion.
**How to avoid:** Treat the addon as authoring convenience; the gate is `@axe-core/playwright` in `tests/a11y.spec.ts`, run in CI, serious/critical failing the build.
**Warning signs:** No `*.spec.ts` exists yet QUAL-03 is claimed satisfied.

### Pitfall 3: 44px target met visually but not geometrically
**What goes wrong:** A nav/tab/icon control *looks* tappable but its hit box is the 16–20px glyph.
**Why it happens:** Padding the icon visually ≠ padding the interactive element; the `<button>`/`<a>` box is what matters.
**How to avoid:** Apply `min-h-11 min-w-11` (44px) to the interactive element itself; assert `boundingBox().height >= 44 && .width >= 44` in Playwright. `--nav-h` 56 / `--tabbar-h` 60 give headroom but per-item targets must still be ≥44. `[CITED: 02-UI-SPEC.md spacing exceptions]`
**Warning signs:** axe passes (axe doesn't fail on target size by default) but a manual geometry check fails.

### Pitfall 4: RU "Данные устаревают" clips in the narrowest pill at 360px
**What goes wrong:** The longest freshness label overflows or mid-word-wraps in a narrow column.
**Why it happens:** RU strings run longer than EN; the 360px floor is the real constraint, not the device frame.
**How to avoid:** Verify at the real 360px container width; if it clips, graceful wrap (never mid-word) or a shorter RU variant ("Устаревает") — but that is a copy change, route it back, don't invent silently. (UI-SPEC checker recommendation #3.) `[CITED: 02-UI-SPEC.md Checker Recommendations]`
**Warning signs:** A pill taller than one line only in RU; horizontal scroll at 360px.

### Pitfall 5: Full-row click zone with no keyboard/SR row-navigation
**What goes wrong:** "Whole row is the click target" works with a mouse but a keyboard/SR user can't reach or understand the row (UI-SPEC checker recommendation #1).
**Why it happens:** A `<div onClick>` row has no focusable element and no role semantics.
**How to avoid:** Native `<table>` with a focusable `<a>`/`<button>` in the player-name cell (the visible affordance), the whole row clickable via an overlay/`::after` link or a row click handler that delegates to that anchor — Tab reaches the anchor, the row is the pointer target. Carry `aria-sort` on `Th`, `aria-selected` on the selected row. `[CITED: a11y.md; 02-UI-SPEC.md Checker Recommendation #1]`
**Warning signs:** Tab skips rows; SR announces a row with no actionable name.

### Pitfall 6: Long nickname/squad name clips a text cell
**What goes wrong:** A long value is cut without ellipsis/tooltip (UI-SPEC checker recommendation #2; spec-template §5).
**How to avoid:** player-name cell `overflow-hidden text-ellipsis whitespace-nowrap` + `title` on truncation; in `CompactRow` at 360px stack label-over-value. `[CITED: 02-UI-SPEC.md Checker Recommendation #2]`

## Runtime State Inventory

Not applicable — Phase 2 is greenfield component authoring (new slices rendered from in-package fixtures). No rename/refactor/migration, no stored data, no live-service config, no OS-registered state, no secrets/env vars, no pre-existing build artifacts to migrate. **None — verified by phase scope (presentational primitives from fixtures; D-01..D-08).**

## Code Examples

(See Architecture Patterns 1–5 above for the load-bearing, source-cited code shapes: the state-matrix+args story, the `data-state` tv() recipe, the compound-token inline style, the Sparkline, and the CLS-0 table/skeleton. They are not repeated here.)

### The Playwright per-story a11y + keyboard + 44px harness
```ts
// Source: ladle.dev visual-snapshots (meta.json iteration) + @axe-core/playwright README
// packages/design/tests/a11y.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

// story list collected in globalSetup (native fetch of /meta.json) → tmp file, OR sync-fetch here
const stories: Record<string, unknown> = JSON.parse(
  readFileSync(process.env.LADLE_META!, "utf8"),
).stories;

for (const key of Object.keys(stories)) {
  test(`${key} — axe clean`, async ({ page }) => {
    await page.goto(`/?story=${key}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test(`${key} — interactive targets ≥ 44px`, async ({ page }) => {
    await page.goto(`/?story=${key}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");
    for (const el of await page.locator("a, button, [role=button], input").all()) {
      if (!(await el.isVisible())) continue;
      const box = await el.boundingBox();
      if (!box) continue;
      expect(box.height, "target height").toBeGreaterThanOrEqual(44);
      expect(box.width, "target width").toBeGreaterThanOrEqual(44);
    }
  });
}
```
```ts
// playwright.config.ts (sketch) — serve the built catalog, set baseURL
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  webServer: { command: "pnpm ladle preview --port 61000", url: "http://localhost:61000", reuseExistingServer: !process.env.CI },
  use: { baseURL: "http://localhost:61000" },
  // CI matrix (projects): chromium, firefox, webkit, mobile viewports, reduced-motion, forced-colors — per frontend-tests CI gate
});
```
> Keyboard-operability beyond target geometry (Tab order, Enter/Space activation, arrow nav for `Th`/tabs) is asserted per interactive story with `page.keyboard.press(...)` + focus assertions — author these in the same spec, scoped to the stories that have interactive controls (nav items, sortable Th, density toggle, pagination, Toast action). `[VERIFIED: @axe-core/playwright; ladle.dev visual-snapshots]`

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Storybook + a11y addon as the catalog | Ladle 5.1 (Vite-native, `meta.json`, `mode=preview`) | locked Phase 1 | Lighter, no webpack; Playwright iterates `meta.json` directly `[VERIFIED: ladle.dev]` |
| Tailwind v3 `content` globs in config | Tailwind v4 `@source` directive in CSS | Tailwind v4 | `.ladle/tailwind.css` `@source ../src` is what makes the package scan work `[CITED: 02-CONTEXT.md research-focus]` |
| `classnames`/hand-rolled recipes | `tailwind-variants` for variant logic | current | styling.md mandate; literal classes survive the v4 scanner `[CITED: styling.md]` |
| RTL render-and-assert-DOM | Playwright-against-Ladle "story is the unit" | current | Component behavior + a11y tested in a real browser via the catalog `[CITED: solidstats-frontend-react-tests]` |

**Deprecated/outdated:**
- Ladle's built-in a11y addon as a *gate* — it is interactive-only; the gate is `@axe-core/playwright`. `[VERIFIED: ladle.dev/docs/a11y]`
- `design.md export --format css-tailwind` for token codegen — repo uses `scripts/gen-theme.mjs` (the CLI drops line-height); not a Phase-2 concern but do not "fix" theme.css by hand. `[CITED: 02-UI-SPEC.md; theme.css header]`

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `tailwind-variants` is the correct/installed variant engine for this repo (mandated by styling.md but not yet in `packages/design`'s deps) | Standard Stack / Don't Hand-Roll | Low — styling.md names it explicitly; if the team prefers `cva`, swap; the pattern (variant map + data-state) is engine-agnostic |
| A2 | `lucide-react` is the correct React Lucide binding (DESIGN.md says "Lucide" generically) | Standard Stack | Low — `lucide-react` is the canonical React package; confirm at install |
| A3 | Tailwind v4 ships an `sr-only` utility (used by the Sparkline accessible summary) | Pattern 4 | Low — if absent, add `.sr-only` to the base layer; one-line fix |
| A4 | `ladle preview` serves the built catalog at a stable port for Playwright `webServer` (vs `ladle dev`) | Code Examples / harness | Low — either `ladle build` + a static server or `ladle dev` works; planner picks; URL pattern (`?story=&mode=preview`, `[data-storyloaded]`) is verified |
| A5 | Package age/download figures in the legitimacy audit are from training knowledge, not re-queried this session | Package Legitimacy Audit | Low — all are first-tier packages with known repos; install step confirms exact versions |
| A6 | The `_state-matrix/` helper is acceptable inside `shared/uikit` as a generic primitive | Project Structure | Low — it imports nothing page/business; if the planner prefers, it can live in a `.ladle` shared module instead |

**If this table is empty:** it is not — these six low-risk assumptions need only install-time confirmation; none touch the locked visual contract or domain truth.

## Open Questions

1. **`ladle dev` vs `ladle build`+serve for the Playwright `webServer`.**
   - What we know: both expose `meta.json` and the `?story=&mode=preview` route; `build` is more CI-deterministic.
   - What's unclear: whether the Tailwind v4 `@source` scan behaves identically in dev vs build for `data-state` variants (Pitfall 1).
   - Recommendation: use `ladle build` + a static serve in CI for determinism; verify a `data-state` variant renders in the built output during Wave 0.

2. **Sparkline DOM-bars vs inline-SVG (D-03, planner's call).**
   - What we know: both dependency-free and token-driven; DOM bars match the hi-fi proof exactly.
   - What's unclear: whether any later surface needs a continuous *line* (SVG) rather than bars.
   - Recommendation: DOM bars for the weekly-score microchart (matches `players.jsx`/`player.jsx`); keep the API open to an SVG variant if a line is needed in Phase 4+.

3. **Keyboard row-navigation model for the full-row click zone (UI-SPEC checker #1).**
   - What we know: native `<table>` + focusable anchor in the name cell is the recommended path.
   - What's unclear: whether the team wants grid-role (`aria-rowindex`) semantics instead.
   - Recommendation: native table + name-cell anchor (simpler, SR-friendly); decide in the Table plan.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| pnpm | install/scripts | ✓ (Phase-1) | 11.x | — |
| Node | runtime | ✓ (Phase-1) | 25 | — |
| `@ladle/react` | catalog + harness | ✓ | 5.1.1 | — |
| Tailwind v4 + `@tailwindcss/vite` | styling | ✓ | 4.3.1 | — |
| Playwright browsers (chromium/firefox/webkit) | a11y/keyboard/geometry gate | ✗ (not installed) | — | `pnpm exec playwright install` in Wave 0 / CI |
| `@axe-core/playwright` | axe gate | ✗ | 4.11.3 | none — required for QUAL-03 |
| `vitest` | fixture/tier unit tests | ✗ | 4.1.9 | none — required for QUAL-06 consistency proof |
| `tailwind-variants` | variant/state recipes | ✗ | verify | `cva` or `clsx` (degraded) |
| `lucide-react` | icons | ✗ | verify | none — locked icon set |

**Missing dependencies with no fallback:** `@axe-core/playwright`, `vitest`, `lucide-react`, Playwright browsers — all must be installed/provisioned in Wave 0 (they are the harness the phase's verification depends on; Phase 1 explicitly deferred Vitest/Playwright to "the first component phase").
**Missing dependencies with fallback:** `tailwind-variants` (could degrade to `cva`/`clsx`, but styling.md mandates `tv()`).

## Validation Architecture

> nyquist_validation is treated as enabled (no `.planning/config.json` key found stating `false`). This section maps every success criterion / QUAL gate to a concrete method, tool, and carrying file for VALIDATION.md.

### Test Framework
| Property | Value |
|----------|-------|
| Framework (pure logic) | Vitest 4.1.9 — `packages/design/vitest.config.ts` (Wave 0) |
| Framework (component/a11y) | `@playwright/test` 1.61.0 + `@axe-core/playwright` 4.11.3 against built Ladle — `packages/design/playwright.config.ts` (Wave 0) |
| Catalog harness | `@ladle/react` 5.1.1 — `meta.json` + `?story=<key>&mode=preview` + `[data-storyloaded]` |
| Quick run command | `pnpm --filter @solid-stats/design test` (Vitest watch-off) |
| Full suite command | `pnpm --filter @solid-stats/design test && pnpm --filter @solid-stats/design exec playwright test` (after `ladle build`) |

### Phase Requirements → Test Map
| Req / SC | Behavior | Test Type | Automated Command / Method | File Exists? |
|----------|----------|-----------|----------------------------|--------------|
| QUAL-06 / SC#5 | Score/K-D formulas + tiers internally consistent; Vasiliy #1 everywhere; no generated player outranks a real leader | unit | `pnpm --filter @solid-stats/design test _fixtures` (assert `score = (kills−TK)/(games+dftk)`, `kd = (kills−TK)/(deaths+dftk)`, sorted roster head == 10 Overview players, Vasiliy index 0) | ❌ Wave 0 — `src/shared/uikit/_fixtures/_fixtures.test.ts` |
| QUAL-06 / D-04 | Tier level is population-derived from `SS_BASELINE[period]`, not hardcoded; `baseline` passed explicitly | unit | Vitest: feed a known baseline, assert level + entry threshold (`≥2.4 ХОРОШО`); assert no module-global mutation | ❌ Wave 0 — `_fixtures/tiers.test.ts` |
| QUAL-03 / SC#4 | axe-clean (serious/critical) per primitive | component (Playwright+axe) | iterate `meta.json`; `AxeBuilder.withTags(wcag2a,wcag2aa,wcag22aa).analyze()`; block serious/critical | ❌ Wave 0 — `tests/a11y.spec.ts` |
| QUAL-03 / SC#4 | 44×44 targets on every interactive control | component | Playwright `boundingBox()` ≥ 44×44 on `a,button,[role=button],input` per story | ❌ Wave 0 — `tests/a11y.spec.ts` |
| QUAL-03 / SC#4 | Keyboard-operable (Tab order, Enter/Space, arrows for Th/tabs); visible focus not obscured | component | Playwright `keyboard.press` + `:focus-visible` assertion on interactive stories (nav, Th, DensityToggle, Pagination, Toast action) | ❌ Wave 0 — `tests/keyboard.spec.ts` |
| QUAL-04 / SC#3 | CLS = 0 — skeleton matches final colgroup+header+row dims; banners/tiles reserve height | component | Playwright: render loading story → render data story; assert table/tile/banner `boundingBox` height equal (skeleton vs final); optional Chrome DevTools MCP CLS trace in review | ❌ Wave 0 — `tests/cls.spec.ts` |
| QUAL-01 / SC#1-3 | ×5 scenario endings + ×4 data-volume states present per list/table/field | component (presence) | Playwright asserts the named state cells exist in each story's state-matrix (`StateCell label="…"`) | ❌ Wave 0 — `tests/states.spec.ts` (or folded into a11y spec) |
| QUAL-02 | Responsive, container-keyed, real 360px floor; mobile no h-scroll, CompactRow drops cols | component | Playwright at a 360px viewport on Table/CompactRow/AppShell stories; assert no horizontal scroll (`scrollWidth <= clientWidth`) | ❌ Wave 0 — `tests/responsive.spec.ts` |
| QUAL-05 | RU + EN present, RU sanity (no clip at 360px) | component + review | Playwright asserts both RU and EN strings render from the map; manual RU clip check at 360px (checker rec #3) folded into the responsive spec | ❌ Wave 0 — folded into `responsive.spec.ts` + design-review |
| SC#1-3 | Each family passes design-review (`design.md lint`, axe, real-width screenshots, CLS) | review gate | `solidstats-frontend-react-design-review` (Playwright screenshots + axe + `design.md lint` + checklist) — single-pass per family | manual gate per family |

### Sampling Rate
- **Per task commit:** `pnpm --filter @solid-stats/design test` (Vitest fixtures/tiers) + `vp check` (lint/format/type) — fast.
- **Per wave merge:** `ladle build` then `playwright test` (axe + 44px + keyboard + CLS + responsive across the wave's new stories).
- **Phase gate:** full Vitest + full Playwright matrix green, plus `solidstats-frontend-react-design-review` PASS per family, before `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] `packages/design/vitest.config.ts` — Vitest wiring (none exists)
- [ ] `packages/design/playwright.config.ts` — Playwright wiring + `webServer` ladle serve (none exists)
- [ ] Install: `@playwright/test`, `@axe-core/playwright`, `vitest`, `tailwind-variants`, `lucide-react` + `playwright install` browsers
- [ ] `src/shared/uikit/_fixtures/` — the single fixture module (SS_BASELINE, roster, formulas, RU+EN map) + `_fixtures.test.ts`, `tiers.test.ts`
- [ ] `src/shared/uikit/_state-matrix/` — shared `StateMatrix`/`StateCell` story helper
- [ ] `tests/a11y.spec.ts` (axe + 44px), `tests/keyboard.spec.ts`, `tests/cls.spec.ts`, `tests/responsive.spec.ts` (or a consolidated `catalog.spec.ts` iterating `meta.json`)
- [ ] Confirm `.ladle/config.mjs` sets `addons.a11y.enabled = true` (dev aid) — non-blocking

## Security Domain

> `security_enforcement` is not set to `false` in config, so this section is included. Phase 2 is a presentational, fixture-only catalog with **no auth, no network, no user input, no persistence, no secrets** — the conventional attack surface is essentially nil. The applicable controls are the few that touch even a static catalog.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth in Phase 2 (auth chrome is Phase 8) |
| V3 Session Management | no | No sessions |
| V4 Access Control | no (visual only) | Role-aware nav *slots* are visual; denied items absent from the passed list — no enforcement here (RBAC is v1.0) `[CITED: 02-UI-SPEC.md KIT-01]` |
| V5 Input Validation | minimal | No user input; fixtures are static. Any text rendered is React-escaped by default (no `dangerouslySetInnerHTML`) |
| V6 Cryptography | no | None — never hand-roll; n/a this phase |
| V14 Config / Dependencies | yes | Package legitimacy gate (above); pin versions; no postinstall-network deps; bundle/third-party-script discipline from performance.md |

### Known Threat Patterns for {Ladle catalog / React presentational}

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via unescaped fixture/i18n string | Tampering | Render via JSX (auto-escaped); never `dangerouslySetInnerHTML`; the RU+EN map is static literals `[CITED: a11y/component-shape]` |
| Supply-chain / slopsquat in new dev-deps | Tampering | Package Legitimacy Gate; pin exact versions; all five candidates are first-tier with known repos `[VERIFIED: this session]` |
| Icon/SVG injection | Tampering | Use `lucide-react` components, not raw SVG strings `[CITED: component-shape.md]` |

## Sources

### Primary (HIGH confidence)
- `packages/design/package.json`, `src/index.ts`, `src/styles/theme.css`, `src/shared/uikit/Smoke/Smoke.stories.tsx` — the installed stack, the barrel/export pattern, the resolved `@theme` tokens, the inline-style escape-hatch precedent.
- `02-CONTEXT.md` (D-01..D-08), `02-UI-SPEC.md` (approved, per-family contracts + checker recommendations), `01-CONTEXT.md` (Phase-1 facts), `.design/CLAUDE.md` (domain truth), `DESIGN.md` recipes — the locked contract.
- `solidstats-frontend-react-conventions` references: `styling.md`, `a11y.md`, `performance.md`, `component-shape.md`, `architecture.md`, `tests.md`; `solidstats-frontend-react-design` SKILL + `pipeline.md`; `solidstats-frontend-react-design-review` `checklist.md`; `solidstats-frontend-react-tests` SKILL; `solidstats-shared-testing-standards` SKILL — the enforced ruleset.
- `npm view` — `@ladle/react@5.1.1`, `vitest@4.1.9`, `@playwright/test@1.61.0`, `@axe-core/playwright@4.11.3` (current 2026-06-20).
- ladle.dev/docs/a11y (built-in axe addon, interactive), ladle.dev/docs/controls (args/argTypes), ladle.dev/docs/visual-snapshots (`meta.json` + `?story=&mode=preview` + `[data-storyloaded]` Playwright iteration).

### Secondary (MEDIUM confidence)
- `.design/hifi/players.jsx`, `player.jsx`, `tweaks-panel.jsx` — dependency-free row-model and microchart proofs (reference only, D-11; rebuilt natively).

### Tertiary (LOW confidence)
- Package age/download figures in the legitimacy audit (training knowledge; confirm exact versions at install).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — core installed/verified; new dev-deps current on npm and named by the skills.
- Architecture (state-matrix + data-state + harness): HIGH — Ladle args/axe/meta.json verified against live docs; patterns align with conventions.
- Pitfalls: HIGH — derived from Phase-1 facts (`@source` scan), the verified addon-vs-gate distinction, and UI-SPEC checker recommendations.
- Sparkline / CLS mechanics: HIGH — hi-fi proof + performance.md/a11y.md; DOM-vs-SVG left open per D-03.
- Fixtures/domain: HIGH — formulas/tiers/roster copied verbatim from `.design/CLAUDE.md`.

**Research date:** 2026-06-20
**Valid until:** 2026-07-20 (stack is stable; re-verify `tailwind-variants`/`lucide-react` versions at install; Ladle/Playwright/axe are fast-moving — re-check if Wave 0 slips > 2 weeks)
