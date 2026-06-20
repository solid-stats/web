# Phase 2: UIKIT — Structural & Data-Display Primitives - Pattern Map

**Mapped:** 2026-06-20
**Files analyzed:** ~70 (5 Wave-0 enablers + `_fixtures` module + `_state-matrix` helper + ~32 component slices × `index.ts`+`.stories.tsx` + barrel + config touches)
**Analogs found:** 1 strong in-repo analog (`Smoke.stories.tsx`) covering every story file; tokens analog (`theme.css`); frozen reference (hi-fi) for the row-model/sparkline/tier shapes to REBUILD; net-new harness/fixtures/helper have NO analog → point at RESEARCH code shapes.

> **Read-this-first for the planner.** Phase 2 is **presentational-only** (D-01: no `@tanstack/react-table`, no `@tanstack/react-virtual`, no server data — everything renders from fixtures passed as props). There is exactly **one** in-repo component-authoring precedent: `packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx`. Every component story imitates its shape (story = named exported render fn, real `@theme` utilities only, compound data-trust border tokens via inline `style={{…var()…}}`, Cyrillic copy verbatim). The test harness, the `_fixtures` module, and the `_state-matrix` helper are **net-new** — no analog exists; build them from the RESEARCH code shapes (Patterns 1–5 + the Playwright spec, RESEARCH L163-405) and `.design/hifi/*` semantics (rebuilt natively, NEVER imported — D-11).

---

## File Classification

### Wave 0 — enablers (net-new; NO in-repo analog)

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `packages/design/package.json` | config | n/a | itself (current deps + exports map + scripts) | self (edit-in-place: add dev-deps + `test`/`test:e2e` scripts) |
| `packages/design/vitest.config.ts` | test config | n/a | none in `packages/design` | no analog → RESEARCH "Test Framework" + Validation Architecture |
| `packages/design/playwright.config.ts` | test config | n/a | none | no analog → RESEARCH L395-404 (config sketch) |
| `packages/design/tests/a11y.spec.ts` | spec test | n/a (drives built Ladle) | none | no analog → RESEARCH L356-393 (the harness) |
| `packages/design/tests/keyboard.spec.ts` | spec test | n/a | none | no analog → RESEARCH L487, L405 |
| `packages/design/tests/cls.spec.ts` | spec test | n/a | none | no analog → RESEARCH L488 |
| `packages/design/tests/responsive.spec.ts` | spec test | n/a | none | no analog → RESEARCH L490-491 |
| `packages/design/tests/globalSetup.ts` (optional) | test config | reads `meta.json` | none | no analog → RESEARCH L364, L50 |
| `packages/design/.ladle/config.mjs` | config | n/a | itself | self (confirm `addons.a11y.enabled=true` dev aid — non-blocking) |
| `packages/design/.ladle/tailwind.css` | config | n/a | itself | **DO NOT TOUCH** — `@source ../src` is the Phase-1 scan seam (D-11 + Pitfall 1) |

### `_fixtures` module (D-06; net-new; semantics from frozen hi-fi, rebuilt)

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/shared/uikit/_fixtures/index.ts` | shared fixture (lib) | static data | none (FSD lib seam) | no analog → re-export of tiers/roster/strings |
| `src/shared/uikit/_fixtures/tiers.ts` | shared fixture (pure fn) | population-derived tier | `.design/hifi/tiers.js` (REBUILD, don't import) | semantics-match (frozen, D-11) |
| `src/shared/uikit/_fixtures/roster.ts` | shared fixture (data) | canonical roster | `.design/CLAUDE.md` L94-95, L169-174; hi-fi `SS_ROSTER` | semantics-match |
| `src/shared/uikit/_fixtures/strings.ts` | shared fixture (data) | RU+EN map | `Smoke.stories.tsx` FRESHNESS_STATES; UI-SPEC Copywriting Contract | role-match |
| `src/shared/uikit/_fixtures/_fixtures.test.ts` | spec test (Vitest, pure) | n/a | none | no analog → RESEARCH L483 |
| `src/shared/uikit/_fixtures/tiers.test.ts` | spec test (Vitest, pure) | n/a | none | no analog → RESEARCH L484 |

### `_state-matrix` shared story helper (net-new)

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/shared/uikit/_state-matrix/index.ts` + `StateMatrix.tsx` (+`StateCell`) | shared display primitive | children-as-slots | `Smoke.stories.tsx` (grid layout w/ tokens) | role-match → RESEARCH Pattern 1 (L163-198), L161 |

### Component slices — every one: `index.ts` (entry) + `<Component>.stories.tsx` (colocated story)

All component-story files share **one** analog: `Smoke.stories.tsx`. Data flow for every component is **fixtures-as-props** (presentational, D-01). Role = `displays` slice (most are display-only; nav items / sortable `Th` / density toggle / pagination / toast-action / provenance-link carry an interactive control → still `shared/uikit` primitive, props-down).

| Family | Slices (each = a `shared/uikit/<Component>/` slice) | Role | Data Flow | Analog | Match |
|--------|-----------------------------------------------------|------|-----------|--------|-------|
| KIT-01 nav shell | `AppShell` · `NavBar` · `MobileTabBar` · `SkipLink` | layout / displays + nav control | role-aware slots-as-props | `Smoke.stories.tsx` (story) + `.design/hifi/shell.jsx` (markup ref, rebuild) | story exact / markup semantics-match |
| KIT-02 data-table | `Table` · `Th` · `TableRow` · `DensityToggle` · `CompactRow` · `Pagination`/`CursorAffordance` | displays + controlled controls | rows/sort/density/selection as **controlled props** | `Smoke.stories.tsx` (story) + `.design/hifi/players.jsx` L11,28-40,170-213 (row-model ref, rebuild) | story exact / row-model semantics-match |
| KIT-03 stat primitives | `StatTile` · `MiniStatGrid` · `TierChip` · `TierScale` · `Pips` · `Sparkline` | displays | fixtures + `baseline` as props | `Smoke.stories.tsx` (story) + `.design/hifi/players.jsx` L18-40 / `player.jsx` L234-266 (pips/bars ref) | story exact / chart semantics-match |
| KIT-04 data-trust | `FreshnessPill` · `ProvenanceLine` · `KnownBadge`/`UnknownBadge`/`ConflictBadge` · `StaleBanner`/`OfflineBanner`/`ReconnectingBanner` · `InlineReviewRow` | displays | strings/state as props | `Smoke.stories.tsx` (freshness pills + compound-token escape hatch — **direct precedent**) | **exact** |
| KIT-07 feedback | `Skeleton` · `EmptyState` · `ErrorState` · `Toast` (visual only) · `Badge` · `Pill` | displays + Toast-action control | variant/strings as props | `Smoke.stories.tsx` (story) + DESIGN.md badge recipes L295-329 | story exact / recipe-driven |
| barrel | `packages/design/src/index.ts` | barrel | n/a | itself (currently `export {}`) | self (replace with `export *`/named graduations) |

> **Slice-granularity note (D-02 / UI-SPEC research item #4):** D-02 is the *intended* shape, not a rigid file count. `Th`/`Pips` MAY live inside their parent (`Table`/`TierScale`) per `architecture.md` slice rules — planner reconciles. Whatever the leaf split, each slice keeps `index.ts` + colocated `*.stories.tsx` and graduates through the barrel.

---

## Pattern Assignments

### Every `<Component>.stories.tsx` (story file)

**Analog:** `packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx` (the ONLY in-repo story precedent).

**Story shape — named exported render function, real `@theme` utilities only** (Smoke L50-88):
```tsx
// stories export a named render fn (Ladle picks them up); no default-export component needed
export const Tokens = () => (
  <div className="flex flex-col gap-6">
    <h1 className="font-display text-4xl font-bold text-text-primary tracking-tight">…</h1>
    <div className="bg-surface-1 border border-border-1 rounded-lg p-4 flex flex-col gap-3">…</div>
  </div>
);
```
Phase-2 stories ADD: a `default` export `{ title: "KIT-04 Data-trust / FreshnessPill" } satisfies StoryDefault`, a `Matrix` story (the durable axe surface) and a `Playground` story (`args`/`argTypes`) per RESEARCH Pattern 1 (L163-198). The Smoke file has neither today — it predates the harness; do not copy its title-less single-export shape, copy its *markup discipline*.

**Tokens-only utility discipline** (Smoke L53-69): `font-display`/`font-body`/`font-mono`, `text-4xl`, `font-bold`, `text-text-primary`, `tracking-tight`, `bg-surface-1`, `border-border-1`, `rounded-lg`, `p-4`, `gap-6`, `tabular-nums` — all stock/token utilities, **zero arbitrary values**. Mirror exactly (styling.md L27-42).

**Cyrillic copy renders verbatim** (Smoke L53, L59-64): RU strings inline in JSX (auto-escaped). Phase-2 pulls them from `_fixtures/strings.ts` instead of inline literals (D-07), but the precedent that Cyrillic resolves on the self-hosted fonts is Smoke.

---

### KIT-04 data-trust stories — the EXACT analog (compound-token escape hatch)

**Analog:** `Smoke.stories.tsx` L16-86 — this is the load-bearing precedent for the *whole* data-trust family.

**Compound border token via inline `style` reading the custom property** (Smoke L73-85) — the ONE sanctioned inline-style escape hatch (styling.md L40-42 "reads a CSS variable from `@theme`, not a hardcoded literal"):
```tsx
const FRESHNESS_STATES = [
  { label: "Актуально",          fill: "var(--color-freshness-up-to-date-fill)",
    text: "var(--color-freshness-up-to-date-text)", border: "var(--color-freshness-up-to-date-border)" },
  { label: "Данные устаревают",  fill: "var(--color-freshness-stale-fill)", … },
  { label: "Связь потеряна",     fill: "var(--color-freshness-offline-fill)", … },
  { label: "Переподключение",    fill: "var(--color-freshness-reconnecting-fill)", … },
] as const;

<span
  className="font-body text-xs font-medium rounded-full px-3 py-1"
  style={{ backgroundColor: state.fill, color: state.text, border: state.border }}  // border = compound "1px solid …"
>{state.label}</span>
```
**Why inline:** `--color-freshness-*-border` resolves to `1px solid rgba(...)` (theme.css L138, L141, L144, L147) — a compound value not expressible as one Tailwind utility. Apply the SAME pattern to `--color-known/unknown/conflict-*-border` (theme.css L150,153,156) and the freshness/known/unknown/conflict `-fill`/`-text` tokens. Add the Lucide icon + literal word (DESIGN.md L412-432) so it is never color-alone.

**Available data-trust tokens** (theme.css L135-158 — confirmed resolved, components have tokens TODAY): `--color-freshness-{up-to-date,stale,offline,reconnecting}-{fill,text,border}`, `--color-{known,unknown,conflict}-{fill,text,border}`, `--color-provenance-{fg,link}`.

**Recipes to mirror** (DESIGN.md): `provenance-line` L406-411 (`посчитано из N реплеев · <freshness> · Как считается`, `·` separator, cyan link), `badge-freshness` L330-354 (4 states + icons `circle`/`circle-dot`/`wifi-off`/`refresh-cw`), `badge-known` L412-418 (`circle-check`), `badge-unknown` L419-425 (`circle-help`, amber), `badge-conflict` L426-432 (`triangle-alert`, amber), `inline-review-row` L433-439 (`triangle-alert` + `на проверке` + request link, transparent bg — a footnote, never a banner).

---

### KIT-02 data-table stories — controlled-prop row model (rebuild from frozen hi-fi)

**Analogs:** `Smoke.stories.tsx` (story shape) + `.design/hifi/players.jsx` (row-model SEMANTICS only — frozen, NEVER imported/ported per D-11; rebuild natively on the real stack).

**Fixed-height row model + tier-colored numeric cell** (`players.jsx` L11, L22-25 — rebuild as tokens/`tv()`):
```js
const ROW_H = { comfortable: 52, compact: 44 };   // → reserved scroll height, virtualization-ready, CLS=0
// TierNum: pip meter + value; color PAIRED with pips, never color-alone
```
**Sparkline/trend bar shape** (`players.jsx` L28-40 — DOM bars, `% height` inline style, tier-colored, `aria-hidden`):
```js
const h = Math.max(Math.round((Math.max(v, 0) / max) * 100), 8);
<i className={`stb tierc tier-${tier}`} style={{ height: `${h}%` }} title={v.toFixed(2)} />
```
Rebuild as RESEARCH Pattern 4 (L248-264): bar *fill* is a token class (`bg-chart-1`/`tier-*`), bar *height* is a computed `%` via inline style (legitimate dynamic value, styling.md), wrapper `aria-hidden` + `<figcaption className="sr-only">` summary, `motion-reduce:` honored.

**CLS-0 table contract** (RESEARCH Pattern 5, L266-286): `<table className="w-full table-fixed">` + `<colgroup>` of fixed `<col>` widths + `<thead className="sticky top-0 bg-surface-2">` + reserved viewport height; skeleton reproduces the exact colgroup+header+N×ROW_H. Selected row = `bg-primary-weak` + inset 2px cyan left-edge (DESIGN.md `table-row.selected` L383-385: `boxShadow: inset 2px 0 0 primary`) + `aria-selected` — never fill-only.

**Recipes** (DESIGN.md): `table-header` L370-376 (`surface-2`, `text-muted`, uppercase, sticky, `border-1` bottom), `table-row` L377-385, `table-row-zebra` L386-387 (`bg-1`), `table-cell-numeric` L388-391 (tabular-nums, right-aligned).

**Sort/density/selection/pagination are CONTROLLED PROPS** (D-01; architecture.md "reusable primitive … controlled props"): the parent owns sort state; `Th` is a plain `<button>` + Lucide arrow + `aria-sort` (no overlay/menu); `DensityToggle` switches `ROW_H` via a controlled prop. This prop contract is the durable interface that swaps to TanStack/server in v1.0 — do not bake in an engine.

---

### KIT-03 stat-primitive stories — population-derived tiers

**Analogs:** `Smoke.stories.tsx` (story) + `.design/hifi/tiers.js` (tier SEMANTICS, rebuild) + `players.jsx` L18-25 / `player.jsx` L234-266 (pips/zones/bars ref).

**Tier derivation — population-driven, `baseline` passed EXPLICITLY, never mutate a global** (`tiers.js` L18-25 — rebuild as a pure fn in `_fixtures/tiers.ts`):
```js
tier(metric, v, baseline) {                      // ← pass baseline in (D-04), don't read a window global
  const b = baseline.by[period][metric];
  return v >= b.elite ? 'elite' : v >= b.good ? 'good' : v >= b.base ? 'base' : 'low';
}
level: { low: 1, base: 2, good: 3, elite: 4 }    // filled pips out of 4
```
`SS_BASELINE` values to rebuild (tiers.js L9-12): `rotation: { score:{base:1.00,good:2.40,elite:4.00}, kd:{base:1.00,good:3.40,elite:6.80} }`, `alltime: { score:{base:1.00,good:3.00,elite:5.00}, kd:{base:1.00,good:5.00,elite:10.00} }`. `TierChip`/`TierScale` show level name + entry threshold (`≥2.4 ХОРОШО`); `Pips` = discrete level indicator. Color tier-derived, paired with the level word (never color-alone).

**`StatTile`** (recipe `stat-tile` DESIGN.md L393-403): `surface-1`+`border-1`+`rounded-md`; value = `stat-xl` (Exo 2, 48px, tabular); signed delta colored `win`/`loss` + `trending-up`/`trending-down` Lucide icon.

---

### KIT-01 nav shell stories

**Analogs:** `Smoke.stories.tsx` (story) + `.design/hifi/shell.jsx` (markup ref, rebuild).

**Pattern:** role-aware `slots`/`items` as props (denied items simply absent from the passed list — no RBAC, no routes, v1.0); landmark order `SkipLink → <header> → <nav aria-label> → <main id> → mobile <nav>`; nav-item ×7 states via `data-state` + `tv()` recipe (RESEARCH Pattern 2, L200-227); `min-h-11 min-w-11` (44px) on the interactive element itself (Pitfall 3, L326-329); `--nav-h` 56 / `--tabbar-h` 60. Lucide 18-20px. Active section = cyan + `aria-current="page"` (never color-alone).

---

### KIT-07 feedback stories

**Analogs:** `Smoke.stories.tsx` (story) + DESIGN.md badge recipes.

**Recipes** (DESIGN.md): `badge-outcome-win`/`-loss` L295-308 (`trending-up`/`-down`, W/L), `badge-status-pending`/`-approved`/`-rejected` L309-329 (`clock`/`badge-check`/`x-circle`), `card` L356-362. `Skeleton` reserves exact final dims (CLS=0, animate `opacity` only, `motion-reduce:` → static). `Toast` = visual primitive only (4 semantic variants; NO trigger/portal/queue — Phase 3). `rounded-xs` for badges, `rounded-full` for pills only. Always icon + label.

---

### `package.json` (config edit-in-place)

**Analog:** itself (current file). Preserve the exports map (L6-12: `./theme.css` + `.` → `src/index.ts`) and existing scripts (L13-16). ADD dev-deps (`vitest`, `@playwright/test`, `@axe-core/playwright`) + runtime/style deps (`tailwind-variants`, `lucide-react`) per RESEARCH L40-69; ADD `test`/`test:e2e` scripts. Confirm `tailwind-variants` + `lucide-react` exact versions at install (RESEARCH L71, Package Legitimacy Audit; a `checkpoint:human-verify` is appropriate). Do NOT add `vite` as a direct dep (vite.config.ts L8-10: Ladle owns the single bundled Vite).

### `src/index.ts` (barrel edit-in-place)

**Analog:** itself (currently `export {};` L5). Replace `export {}` with named re-exports as components graduate (CONTEXT integration point L200-203). The Smoke catalog story is intentionally NOT a barrel export — keep it that way.

---

## Shared Patterns

### Variant/state → class mapping — `tailwind-variants` (`tv()`)
**Source:** styling.md L38-39 (mandate); RESEARCH Pattern 2 (L200-227).
**Apply to:** any component with variants/states/sizes (nav item, badge, freshness pill, table row, sortable `Th`, density toggle, toast). Owns the `data-state` → utility mapping for forced pseudo-states in the state matrix. Keeps class strings **literal** so Tailwind v4's `@source ../src` scanner emits them (Pitfall 1, L314-318). Never hand-concatenate; never compute class names.
```tsx
const navItem = tv({
  base: "flex items-center gap-2 px-3 min-h-11 rounded-md text-text-muted",
  variants: { state: {
    enabled: "", hover: "bg-surface-1 text-text-primary", pressed: "bg-surface-2 translate-y-px",
    focused: "outline-none ring-2 ring-primary", selected: "text-primary",
    disabled: "text-text-subtle opacity-60 pointer-events-none",
  } },
});
```

### Inline-`style` escape hatch — compound `@theme` tokens via `var()`
**Source:** `Smoke.stories.tsx` L73-85 + styling.md L40-42.
**Apply to:** all KIT-04 components consuming `--color-*-border`/`-fill`/`-text` (compound `1px solid …` borders) AND the Sparkline computed bar height. This is the ONLY sanctioned inline style — it reads a `@theme` var, it is NOT an arbitrary value. Reviewer/linter must not flag it.

### Tokens-only, no arbitrary values
**Source:** styling.md L27-42; DESIGN.md Do's & Don'ts; `Smoke.stories.tsx` (every class).
**Apply to:** every file. Banned: `bg-[#…]`, `p-[7px]`, `text-[13px]`, raw hex, inline `style` for themable props. Exceptions: computed dynamic dimension (bar/spacer/viewport height) via inline style; compound data-trust border via `var()`. A missing value = a missing token, not an inline literal.

### Lucide-only icons, never color-alone
**Source:** component-shape.md L47-51; styling.md L49-51, L61; a11y (UI-SPEC L101).
**Apply to:** every semantic color → pair with a Lucide component (PascalCase local) + text. `aria-hidden` decorative icons; accessible name on icon-only controls. `Unknown` = literal amber word + icon, NEVER `0`/`—` (RESEARCH L293).

### FSD `shared/uikit` slice discipline
**Source:** architecture.md L46-89.
**Apply to:** every component slice. PascalCase slice folder; `index.ts` entry; entry component default-export matching the file name; consumers import from `index.ts` never internals; generic primitives only — NO imports of pages/business/localization (props-down). `_fixtures` + `_state-matrix` are acceptable generic helpers inside `shared/uikit` (import nothing page/business — RESEARCH L161, A6).

### CLS-0 / reserved dimensions
**Source:** component-shape.md L54-57; styling.md L57; RESEARCH Pattern 5 (L266-286).
**Apply to:** `Table`, `Skeleton`, `StatTile`, all banners, `Sparkline`, `Toast`. Reserve final dimensions; skeleton matches colgroup+header+row dims; animate `transform`/`opacity` only, `motion-reduce:` honored.

### Single canonical fixture source ("Vasiliy #1 everywhere")
**Source:** `.design/CLAUDE.md` L94-95 (formulas), L169-174 (roster); D-06.
**Apply to:** every stat/table/tier story imports from `_fixtures`. Formulas: `Счёт = (kills − TK) ÷ (games + deaths-from-TK)`, `K/D = (kills − TK) ÷ (deaths + deaths-from-TK)`. Roster = 10 Overview players verbatim at top + deterministic generated tail to negative Score; Vasiliy stays #1; no generated player outscores a real leader. Vitest proves consistency.

---

## No Analog Found

These are **net-new** to `packages/design` (no test tooling, fixtures, or state helper exists today). Use the RESEARCH code shapes, NOT a guessed pattern:

| File | Role | Data Flow | Reason / Where to look |
|------|------|-----------|------------------------|
| `vitest.config.ts` | test config | n/a | Phase 1 deferred Vitest. → RESEARCH "Test Framework" table + L500 |
| `playwright.config.ts` | test config | n/a | No Playwright wired. → RESEARCH L395-404 (config sketch); `ladle build`+serve for CI determinism (Open Q1) |
| `tests/a11y.spec.ts` | spec test | iterates `meta.json` | The axe+44px gate is net-new. → RESEARCH L356-393 (full harness: `?story=&mode=preview` + `[data-storyloaded]` + `AxeBuilder.withTags(wcag2a,wcag2aa,wcag22aa)`, block serious/critical) |
| `tests/keyboard.spec.ts` / `cls.spec.ts` / `responsive.spec.ts` | spec test | n/a | → RESEARCH Validation Architecture L487-491 (per-criterion method) |
| `src/shared/uikit/_state-matrix/` | shared display helper | children-slots | The `StateMatrix`/`StateCell` DRY grid is net-new. → RESEARCH Pattern 1 (L163-198) + L161 |
| `src/shared/uikit/_fixtures/tiers.ts` | pure tier fn | population-derived | `tiers.js` is FROZEN reference (D-11) — rebuild natively, `baseline` passed explicitly (D-04), no global mutation |
| `src/shared/uikit/_fixtures/roster.ts` | canonical roster | static | No roster in-repo (hi-fi `SS_ROSTER` is frozen) — rebuild from `.design/CLAUDE.md` L94-95, L169-174 semantics |
| `src/shared/uikit/_fixtures/*.test.ts` | Vitest pure | n/a | → RESEARCH L483-484 (assert formulas, sorted head == 10 Overview, Vasiliy index 0, tier thresholds) |

> **Hi-fi files are frozen reference, never ported** (`.design/hifi/players.jsx`, `player.jsx`, `shell.jsx`, `tiers.js`, `tweaks-panel.jsx`): D-11 + RESEARCH L290. They are dependency-free PROOFS of the row model / sparkline / nav shell / tier model — rebuild their *shape* on the real stack (Tailwind v4 `@theme` + `tv()` + Lucide), do NOT import or copy their plain-CSS/`window.SS_*` code. The hi-fi "Tweaks"-panel is explicitly rejected (RESEARCH L57) — Ladle `args` replaces it.

---

## Metadata

**Analog search scope:** `packages/design/src/**` (the one component precedent + barrel + tokens + Ladle/Vite wiring), `DESIGN.md` (recipes L288-447), `.design/hifi/*` + `.design/CLAUDE.md` (frozen reference — domain truth), the `solidstats-frontend-react-conventions` (architecture/component-shape/styling) + `solidstats-frontend-react-design` (pipeline) skill references.
**Files scanned:** ~14 (Smoke story, barrel, package.json, vite.config, theme.css, `.ladle/config.mjs` + `tailwind.css` + `components.tsx`, DESIGN.md recipes, hi-fi players/player/tiers, `.design/CLAUDE.md`, 5 skill references).
**Pattern extraction date:** 2026-06-20
**Artifact language:** English (AGENTS.md); Russian only as quoted literal domain copy.
