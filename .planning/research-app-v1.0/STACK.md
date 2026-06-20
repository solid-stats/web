# Stack Research

**Domain:** Public esports/gaming replay-statistics website + moderation UI (TanStack Start / React SSR, dense, dark-only, RU/EN, server-driven 10k–100k-row tables, SSE realtime)
**Researched:** 2026-06-20
**Confidence:** HIGH (core stack fixed by brief; versions verified against npm registry + official docs)

> **Scope note.** The product stack is already fixed by the brief (TanStack Start + Router + Query +
> Table, Nano Stores, Tailwind v4, Ark UI, typed ICU i18n, `openapi-typescript`, Node-in-Docker).
> This file does NOT re-litigate those — it makes them implementation-ready (current versions,
> pinning posture) and resolves the brief's deferred sub-choices to a single recommendation each.
> All versions verified against the live npm registry on 2026-06-20; FREE sources only (no Context7 /
> paid MCP, per project rule).

## Recommended Stack

### Core Technologies (fixed by brief — versions pinned)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@tanstack/react-start` | `1.168.x` | Framework + SSR/streaming + server fns | Brief-fixed rendering layer; URL-first, SEO-capable SSR. **Requires Node ≥ 22.12** (registry `engines`) |
| `@tanstack/react-router` | `1.170.x` | URL-first nav, code splitting, preload, scroll restoration | Ships with Start; owns the list→detail→Back contract (scroll + search-param restoration) |
| `@tanstack/react-query` | `5.101.x` | Server-state cache, SWR, prefetch | Loader-prefetch into Query cache = no blocking reload on Back; freshness via SSE overlay |
| `@tanstack/react-table` | `8.21.x` | Headless sort/filter/cursor/column model | Server-driven table state for 10k–100k rows; pairs with Virtual for row windowing |
| `@tanstack/react-virtual` | `3.14.x` | Row/column virtualization | Renders only visible rows; **separate package** from Table — Table is headless, Virtual does the windowing |
| `react` / `react-dom` | `19.2.x` | UI runtime | React 19 (Actions, `use`, improved SSR/streaming) — required peer for current TanStack Start |
| `nanostores` + `@nanostores/react` | `1.3.x` / `1.1.x` | Lightweight client-only state | Only for state that is NOT URL/router/query (theme, density toggle, transient UI). Tiny, framework-agnostic |
| `tailwindcss` + `@tailwindcss/vite` | `4.3.x` | Styling + `@theme` tokens | v4 CSS-first `@theme`; tokens generated from `DESIGN.md` → `src/styles/theme.css`. Use the **Vite plugin**, not PostCSS |
| `@ark-ui/react` | `5.37.x` | Accessible headless primitives | Dialogs/menus/tabs/selects/tooltips/popovers with WCAG-grade a11y; unstyled → Tailwind tokens |
| `typescript` | `5.9.x` | Type system | `noUncheckedIndexedAccess` on (brief). **Do NOT adopt TS 6.x yet** — see What NOT to Use |

### Supporting Libraries (deferred-choice resolutions — see next section for rationale)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@lingui/core` `@lingui/react` | `6.4.x` | Typed ICU i18n runtime | All RU/EN strings; ICU plural/format; SSR-safe `I18nProvider` |
| `@lingui/cli` `@lingui/vite-plugin` `@lingui/swc-plugin` | `6.4.x` | Extract/compile catalogs, macro transform | Build-time catalog compile; macros via `@lingui/react/macro` |
| `openapi-typescript` | `7.13.x` | Generate TS types from `server-2` OpenAPI | Dev dependency; regenerate on schema change; CI stale check |
| `openapi-fetch` | `0.17.x` | Typed thin fetch client over generated types | The "typed thin client" the brief mandates; standardizes auth/error handling |
| `openapi-react-query` | `0.5.x` | TanStack Query wrapper over `openapi-fetch` | `$api.useQuery` / `useSuspenseQuery` / `queryOptions` for SSR prefetch |
| `eventsource` | `4.1.x` | Spec-compliant SSE client (custom headers + reconnect) | SSE transport; replaces native `EventSource` (which can't send auth headers) |
| `lucide-react` | `1.21.x` | Single SVG icon family | Design-system mandate; **v1 is a breaking rename** — pin and use the codemod |

### Development Tools

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| `vite` | `7.x` | Build/dev server | TanStack Start is Vite-based. **Do NOT jump to Vite 8** until Start + Tailwind + Lingui plugins confirm support — `8.0.x` is bleeding-edge (see What NOT to Use) |
| `@ladle/react` | `5.1.x` | Component catalog / story harness | Repo already chose Ladle; faster than Storybook, Vite-native, colocated `*.stories.tsx` in `src/shared/uikit/` |
| `vitest` | `3.x` | Unit runner (hooks/logic) | Vite-native, shares config. **Pin to 3.x** — `4.x` is new-major; adopt after ecosystem (jsdom/plugins) settles |
| `@playwright/test` | `1.61.x` | E2E + component visual + a11y | CI matrix: Chromium/Firefox/WebKit + mobile viewports + reduced-motion/forced-colors |
| `@axe-core/playwright` | `4.11.x` | a11y assertions inside Playwright | Serious/critical violations block merge (brief CI-05) |
| `@vitejs/plugin-react` | `5.x` | React fast-refresh / JSX | Pair with the Vite major you pin |

## Deferred-Choice Resolutions

### 1. Typed ICU i18n → **Lingui v6** (`@lingui/*` 6.4.x) — Confidence: HIGH

**Pick Lingui over FormatJS/react-intl.** Rationale:
- **Typed message IDs**: Lingui v6 ships a "Typed Message IDs" path — compile-time-checked keys, which
  is exactly the brief's "typed ICU" requirement. react-intl has weaker first-class typing of IDs.
- **ICU MessageFormat** native (plurals, select, number/date formatting) — covers RU plural rules
  (one/few/many/other) which the stats UI needs ("N реплеев", kills/teamkills counts).
- **Build-time compiled catalogs**: `@lingui/cli` extracts + compiles; the `@lingui/swc-plugin`/
  `@lingui/vite-plugin` does the macro transform — strings ship as compiled, no runtime parse cost,
  which protects INP/bundle budgets vs react-intl's heavier runtime.
- **SSR-safe**: `@lingui/core` is universal (browser/Node), `I18nProvider` works under TanStack Start
  SSR; activate the locale per-request from the `/ru` `/en` route segment in the root loader.
- **Macro import path**: in v6 use `@lingui/react/macro` (the older standalone `@lingui/macro` is the
  legacy path — do not install it for new code).

**Wiring**: locale lives in the route (`/$locale/...` or split `/ru` `/en` trees); root `beforeLoad`
redirects `/` by `Accept-Language` + persisted Nano Store choice; SSR sets the active catalog before
render so HTML is localized (SEO + no hydration flash). Date/number formatting via `Intl` through
Lingui formatters; ops/mod UTC hint via a secondary formatter.

**Why not react-intl (`react-intl` 10.x / `@formatjs/intl` 4.x)**: heavier runtime, message IDs are
strings without the same compile-time guarantee, and the DX (no macro-extracted inline messages) is a
worse fit for a typed-strict codebase. Keep as fallback only if a hard FormatJS dependency appears.

### 2. OpenAPI toolchain → **openapi-typescript + openapi-fetch + openapi-react-query** — Confidence: HIGH

The canonical three-package stack from the `openapi-ts` project (one maintainer org, designed to
compose):
1. `openapi-typescript` (dev) generates `src/shared/api/schema.d.ts` from the live `server-2` schema.
2. `openapi-fetch` (runtime, ~6kb) is the typed thin client — `createClient<paths>()` with a base
   middleware for Steam-session auth, error-code mapping, and the masked-data conventions. **This is
   the brief's "typed thin client over generated types," not scattered `fetch`.**
3. `openapi-react-query` (runtime, ~1kb) wraps it for TanStack Query: `$api.useQuery`,
   `useSuspenseQuery`, `useInfiniteQuery` (cursor pagination), and `$api.queryOptions(...)` — the
   `queryOptions` form is what loaders call via `queryClient.ensureQueryData` for SSR prefetch into
   the cache (the Back-restoration contract).

> npm package versions: `openapi-react-query` is at `0.5.4` on npm (the docs site's "7.x" refers to
> the monorepo/openapi-typescript line, not this package's own version). Pin the package version, not
> the doc-site number.

**Stale-types CI check**: regenerate into a temp file and `diff` against the committed schema; non-zero
diff fails CI. Concretely — `openapi-typescript <live-or-snapshot schema> -o /tmp/schema.d.ts` then
`git diff --no-index src/shared/api/schema.d.ts /tmp/schema.d.ts` (or `--exit-code`). **Flag**: the
generation source is the live `server-2` OpenAPI URL — the exact URL, auth, and whether CI hits a
running backend or a committed `openapi.json` snapshot is a `server-2`-dependent decision to lock in
the foundation phase. Snapshot-in-repo (committed `openapi.json`, bumped by a script) is the
lower-flake CI posture; the live URL is for local regen.

### 3. Row virtualization → **TanStack Virtual 3.14.x, windowed rows over the Table model** — Confidence: HIGH

TanStack Table stays headless (no built-in virtualization); pair it with `@tanstack/react-virtual`.
Accessible-table tuning for 10k–100k server-driven rows:
- **Single scroll container** with `useVirtualizer({ count, getScrollElement, estimateSize, overscan })`;
  keep `estimateSize` exact (fixed dense row height from `DESIGN.md`) so the scrollbar and Back
  scroll-restoration are stable (no measurement jitter → no CLS).
- **Reserve total height** via the virtualizer's `getTotalSize()` spacer so the layout never shifts as
  windows mount (CLS ≤ 0.02 budget).
- **A11y**: render real `<table>`/`<tr>` semantics inside the window (not divs), keep `aria-rowcount` =
  full server count and `aria-rowindex` per row so screen readers announce position despite windowing;
  ensure keyboard focus on a row scrolls it into view (`scrollToIndex`).
- **Server-driven**: virtualization is view-only — paging/cursor stays server-side; combine windowing
  with `useInfiniteQuery` cursor fetches triggered near the end of the rendered window.
- **Back restoration**: persist `scrollOffset` + first-visible index in router/history state (ephemeral,
  not URL) and call `scrollToOffset` on restore — this is the launch-blocking virtualized-position
  requirement.

### 4. SSE client → **`eventsource` (v4.x) polyfill, not native EventSource** — Confidence: MEDIUM-HIGH

Use the `eventsource` npm package (v4.1.0, actively maintained, spec-compliant for Node + browser)
rather than the platform `EventSource`. Reasons:
- Native `EventSource` **cannot send custom headers** (no `Authorization`/session header) and offers no
  control over reconnect backoff — both needed for auth-gated streams and a controlled reconnect UX.
- `eventsource` supports custom headers, configurable reconnection, and a `fetch`-based transport;
  it also works under TanStack Start's Node server side if a server-side subscription is ever needed.
- **Reconnect policy**: exponential backoff with jitter, cap, and a "Переподключение → Связь потеряна"
  state surfaced via the design-system `badge-freshness` (already specced in `DESIGN.md`). Use the
  `Last-Event-ID` header for resume.
- **Merge discipline (CLS)**: SSE updates must not insert/reorder content above the viewport — use the
  brief's "new updates available" affordance for large recalcs and auto-merge only small off-viewport
  deltas. This is page-specific policy, not a transport choice.

**Why not `@microsoft/fetch-event-source`**: still works (v2.0.1) and is a common pick, but it is
effectively in maintenance/semi-abandoned with a stale API surface; `eventsource` v4 is the better-
maintained, spec-aligned choice today. **Flag**: the exact SSE event contract, classification, and
per-page merge rules depend on the `server-2` event schema (deferred in the brief).

### 5. Catalog / unit / E2E harness → **Ladle 5 + Vitest 3 + Playwright 1.61** — Confidence: HIGH

- **Ladle 5.1.x** (already chosen) for the component catalog — Vite-native, much lighter than Storybook,
  colocated `*.stories.tsx` in `src/shared/uikit/`. Doubles as the surface where Playwright component/
  visual review runs (per the design-review skill).
- **Vitest 3.x** for hooks/logic units (Vite config reuse, fast). **Pin 3.x, not 4.x** — Vitest 4 is a
  fresh major (jsdom/happy-dom + plugin ecosystem still catching up); adopt later as a deliberate bump.
- **Playwright 1.61.x** for E2E + critical journeys + a11y (`@axe-core/playwright`). Minimal config:
  one `playwright.config.ts` with the CI projects matrix (Chromium/Firefox/WebKit + Pixel/iPhone
  viewports + reduced-motion + forced-colors), `webServer` pointed at the seeded `server-2`, and the
  list→detail→Back / SSE / scroll-restoration specs as the launch gate.
- Minimal posture: no Storybook, no separate Cypress — Playwright covers component + E2E + visual smoke.

### 6. Tailwind v4 `@theme` from generated SoT → **`@tailwindcss/vite` + generated `theme.css`** — Confidence: HIGH

- `DESIGN.md` is the token source of truth → `scripts/gen-theme.mjs` emits `src/styles/theme.css` as a
  `@theme { --color-*: …; --text-*: …; }` block (already scaffolded in the repo).
- Import order: `@import "tailwindcss";` then `@import "./theme.css";`. Emit `--*: initial;` in the
  `@theme` so Tailwind's stock palette is dropped and **only** the SolidStats dark tokens exist
  (already documented in `DESIGN.md`).
- Use the **Vite plugin** (`@tailwindcss/vite`), not the PostCSS path — faster, the v4-recommended
  integration for Vite apps.
- Enforce "no arbitrary values" (`bg-[#fff]`, `p-[7px]`) via lint so the token system stays the SoT.
- `@google/design.md lint`/`diff` stays the token/contrast gate; the official `export --format
  css-tailwind` is the future migration target but currently drops `line-height`, so keep
  `gen-theme.mjs` until that exporter is fixed (per `DESIGN.md`).

## Installation

```bash
# Core (runtime)
npm install @tanstack/react-start @tanstack/react-router @tanstack/react-query \
  @tanstack/react-table @tanstack/react-virtual react react-dom \
  nanostores @nanostores/react @ark-ui/react lucide-react \
  @lingui/core @lingui/react openapi-fetch openapi-react-query eventsource

# Dev dependencies
npm install -D typescript@5 vite@7 @vitejs/plugin-react \
  tailwindcss @tailwindcss/vite \
  @lingui/cli @lingui/vite-plugin @lingui/swc-plugin \
  openapi-typescript \
  @ladle/react vitest@3 @playwright/test @axe-core/playwright
```

> Node runtime: **≥ 22.12** (TanStack Start `engines`); use Node 22 LTS in the Docker image.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Lingui v6 | react-intl / FormatJS 10.x | Only if a hard FormatJS dependency or existing FormatJS catalogs must be reused |
| `eventsource` v4 | `@microsoft/fetch-event-source` | If you specifically need its POST-body SSE pattern; otherwise avoid (semi-abandoned) |
| `eventsource` v4 | native `EventSource` | Only for unauthenticated public streams with no custom reconnect/header needs |
| openapi-react-query | hand-written Query hooks over openapi-fetch | If you need bespoke cache keys Query-wrapper can't express; rare |
| Ladle | Storybook 8 | If a plugin/addon only Storybook has becomes essential (heavier, slower) |
| Vitest 3 (pin) | Vitest 4 | After jsdom/plugin ecosystem confirms 4.x stability — deliberate later bump |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **vanilla-extract** | Explicitly dropped by the deepened brief — superseded by Tailwind v4 `@theme` | Tailwind v4 tokens from `DESIGN.md` |
| **Context7 / any paid MCP** | Project rule (`feedback-no-paid-mcp`) — FREE doc sources only | WebFetch/WebSearch on official docs, llms.txt, GitHub |
| **TypeScript 6.x** (`6.0.3` on npm) | Brand-new major; ecosystem/type-defs (TanStack, Vite plugins) not validated against it yet | Pin TS `5.9.x` |
| **Vite 8.x** (`8.0.x` on npm) | Bleeding-edge major; TanStack Start + Tailwind + Lingui plugins not confirmed on 8 | Pin Vite `7.x` |
| **Vitest 4.x** | New major; happy-dom/jsdom + plugin ecosystem still settling | Pin Vitest `3.x` |
| **`@lingui/macro` (standalone)** | Legacy import path; folded into `@lingui/react/macro` in v6 | `@lingui/react/macro` |
| **Native `EventSource` for auth streams** | Can't send headers; no reconnect control | `eventsource` v4 |
| **SSG for catalog/detail data** | TanStack Start has no runtime ISR; route space (100k rows, replay IDs, owner-changing slugs) isn't build-time enumerable | SSR + nginx `proxy_cache` microcache + SSE freshness; prerender static shell only |
| **Light-theme tokens / arbitrary Tailwind values** | Design system is dark-only; arbitrary values break the token SoT | Generated dark `@theme`; lint arbitrary values out |
| **lucide-react un-pinned** | v1 is a breaking icon rename (`latest` jumped to 1.x) | Pin `1.21.x`; run the lucide codemod if migrating any v0 names |
| **Hand-written API DTO types** | `server-2` owns the schema; duplicate DTOs drift | `openapi-typescript` generated types as SoT |

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `@tanstack/react-start` 1.168 | React 19.2, Node ≥ 22.12 | Registry `engines.node ">=22.12.0"`; use Node 22 LTS in Docker |
| `@tanstack/react-table` 8.21 | `@tanstack/react-virtual` 3.14 | Table is headless; Virtual does windowing — separate installs |
| `tailwindcss` 4.3 | `@tailwindcss/vite` 4.3 | Keep Tailwind + Vite-plugin majors in lockstep; Vite plugin (not PostCSS) |
| `@lingui/*` 6.4 | `@lingui/react/macro`, Vite 7 | All `@lingui/*` packages pinned to the same `6.x` minor |
| `openapi-fetch` 0.17 | `openapi-react-query` 0.5 | Compose via one `createClient`; both peer on `@tanstack/react-query` 5 |
| `vitest` 3 / `vite` 7 | `@vitejs/plugin-react` 5 | Keep Vite-ecosystem majors aligned; don't mix Vite 7 with plugin-react built for 8 |

## Flags for Roadmap (server-2-schema-dependent)

- **OpenAPI generation source** — exact live `server-2` URL vs committed `openapi.json` snapshot, auth,
  and CI posture (running backend vs snapshot) — locks in the foundation phase.
- **SSE event contract** — event types, classification, reconnect/`Last-Event-ID` semantics, and
  per-page merge rules all depend on the `server-2` event schema.
- **Cursor pagination shape** — `useInfiniteQuery` cursor handling depends on `server-2`'s cursor/page
  envelope.
- **lucide-react v1** — verify no icon names referenced in `DESIGN.md` were renamed/removed in v1
  before scaffolding (trending-up, trending-down, clock, badge-check, x-circle, circle, circle-dot,
  wifi-off, refresh-cw, circle-check, circle-help, triangle-alert).

## Sources

- npm registry (`npm view <pkg> version` / `dist-tags` / `engines`), 2026-06-20 — all version numbers — HIGH
- https://lingui.dev/introduction — Lingui v6 ICU, typed message IDs, Vite plugin, SSR, `@lingui/react/macro` — HIGH
- https://openapi-ts.dev/openapi-react-query/ — openapi-react-query wrapper, hooks, queryOptions — HIGH
- https://openapi-ts.dev/ — openapi-typescript overview — HIGH
- https://lucide.dev/guide/packages/lucide-react + iconsearch.info lucide v1 migration guide — v1 breaking rename + tree-shaking — MEDIUM
- TanStack Start registry `engines` (Node ≥ 22.12) — HIGH
- Repo `DESIGN.md` + `PROJECT.md` brief — fixed-stack decisions, token SoT, Tailwind v4 wiring — HIGH

---
*Stack research for: SolidStats `web` (esports replay-statistics SSR frontend)*
*Researched: 2026-06-20*
