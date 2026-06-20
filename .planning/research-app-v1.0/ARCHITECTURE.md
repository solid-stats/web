# Architecture Research

**Domain:** Public esports replay-statistics website + moderation interface (TanStack Start SSR, React/TSX, FSD layering)
**Researched:** 2026-06-20
**Confidence:** HIGH

This file answers one question: *how should a TanStack Start SSR stats app of this shape be
structured, and in what build order?* It is opinionated for THIS stack (decisions are already
fixed in `PROJECT.md` — TanStack Start/Router/Query/Table, Nano Stores, Tailwind v4, Ark UI,
`openapi-typescript`, nginx microcache, SSE). Every TanStack API named below was verified against
the official guide markdown in the TanStack repos (see Sources); versioned API names are quoted
exactly.

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│  EDGE / ORIGIN                                                         │
│  nginx proxy_cache microcache  (key = path + locale + allowlisted     │
│  query params; bypass when session cookie present; SWR + cache-lock + │
│  serve-stale-on-error)                                                 │
└───────────────┬───────────────────────────────────────┬──────────────┘
                │ public HTML/JSON (cacheable)           │ /sse (no-cache, passthrough)
┌───────────────▼───────────────────────────────────────▼──────────────┐
│  web — TanStack Start Node server (Docker)                            │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ app/ — Start entry, root route, router factory                 │  │
│  │   createRouter({ scrollRestoration, defaultPreload,            │  │
│  │     context:{queryClient}, dehydrate, hydrate })               │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ routes/ — file-based route tree ( /$locale/... )               │  │
│  │   beforeLoad (auth/locale) · loader (ensureQueryData) · meta   │  │
│  └───────────────┬────────────────────────────────────────────────┘  │
│                  │ loader prefetch → seeds ↓                          │
│  ┌───────────────▼────────────────────────────────────────────────┐  │
│  │ DATA LAYER (cross-cutting)                                      │  │
│  │   TanStack Query cache  ◄── dehydrate/hydrate across SSR        │  │
│  │   typed thin API client ──► generated openapi-typescript types │  │
│  │   SSE client ──► per-page merge into Query cache               │  │
│  └───────────────┬────────────────────────────────────────────────┘  │
│  ┌───────────────▼────────────────────────────────────────────────┐  │
│  │ FEATURE / ENTITY / SHARED (FSD)                                │  │
│  │   features (table+filters, request stepper, mod queue…)        │  │
│  │   entities (player, squad, rotation, replay, request…)         │  │
│  │   shared (uikit, lib, i18n, api-client, table-kit)             │  │
│  └────────────────────────────────────────────────────────────────┘  │
└───────────────┬───────────────────────────────────────────────────────┘
                │ typed thin client (never raw fetch, never DB/S3)
┌───────────────▼───────────────────────────────────────────────────────┐
│  server-2  (source of truth: PostgreSQL, OpenAPI, Steam auth,         │
│  moderation, aggregates, SSE event stream)                            │
└──────────────────────────────────────────────────────────────────────┘
```

**Data-flow direction is one-way and explicit:**
`route loader → queryClient.ensureQueryData → Query cache → component useSuspenseQuery → UI`.
SSE is a *side channel* that writes into the same Query cache; the UI never reads SSE directly.
URL is the only source of shareable table state; everything else (scroll, density, virtual offset)
lives in router scroll-restoration cache and Nano Stores.

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **App / router factory** | Build the router per-request, wire SSR dehydrate/hydrate, global scroll restoration, preload policy | `createRouter({ scrollRestoration: true, defaultPreload: 'intent', defaultPreloadStaleTime: 0, context: { queryClient }, dehydrate, hydrate })` |
| **Routes** | URL→data binding: `beforeLoad` (locale + session + RBAC gate), `loader` (prefetch), `head`/meta (SEO), `validateSearch` (typed shareable params) | File-based route tree under `routes/`; one loader per route calling the data layer |
| **Typed API client** | The single boundary to `server-2`. Wraps generated types, injects auth/session, normalizes stable error codes, exposes `queryOptions` factories | Thin wrapper over `openapi-fetch` + `openapi-typescript` types; **no** hand-written DTOs |
| **Query cache** | Server-state SoT on the client: SWR, gc, dehydration target. Avoids blocking reload on Back | `QueryClient`, `queryOptions()` factories per entity, `ensureQueryData`/`useSuspenseQuery` |
| **SSE client** | Subscribe to `server-2` freshness events, classify, merge into Query cache per page policy, surface freshness/stale state | `EventSource` wrapper → `queryClient.setQueryData` / `invalidateQueries` + a "new updates" affordance store |
| **Table kit** | Reusable server-driven table: TanStack Table state ↔ URL search params, cursor pagination, TanStack Virtual, density, scroll/virtual restoration glue | `shared/table-kit/` consumed by every list feature |
| **i18n** | Typed ICU strings, locale routing, localized formatters, SEO hreflang/canonical helpers | Typed ICU library + `/$locale` segment + formatter hooks |
| **uikit** | Dark-only, token-driven primitives (Ark UI headless + Tailwind v4 `@theme`), Lucide icons, tabular-numeral text | `shared/uikit/` (already catalogued as Ladle stories) |
| **Nano Stores** | *Only* ephemeral client state with no URL/router/query home: density toggle, "updates available" flag, transient UI | Tiny atoms; never server state |
| **nginx microcache** | Public SSR/JSON microcache, auth bypass, SWR, serve-stale | `infrastructure` repo config (not owned here, but architecture depends on it) |

---

## Recommended Project Structure

Feature-Sliced Design is the project convention. Layers top→bottom, imports only point **downward**
(`app → routes → features → entities → shared`). The `solidstats-frontend-react-conventions` skill is
the authority on exact slice rules; this is the architectural shape.

```
src/
├── app/                      # Composition root (Start entry, providers, router factory)
│   ├── router.tsx            # createRouter(): scrollRestoration, preload, dehydrate/hydrate, context.queryClient
│   ├── query-client.ts       # makeQueryClient() — new per request on server, singleton in browser
│   ├── providers/            # QueryClientProvider, i18n provider, SSE provider
│   └── ssr/                  # server entry, streaming, document shell, head defaults
├── routes/                   # File-based route tree — the URL→data binding layer (see Route Tree)
│   ├── __root.tsx
│   ├── $locale/              # /ru, /en localized public area
│   ├── (auth)/               # session-gated player area (ssr:true, session in beforeLoad)
│   └── (admin)/              # role-gated mod/admin/ops area (RBAC in beforeLoad)
├── features/                 # User-facing capabilities (compose entities + shared)
│   ├── stats-table/          # server-driven table + filters + cursor + virtualization
│   ├── request-stepper/      # guided correction-request flows
│   ├── mod-queue/            # risk+age queue
│   ├── request-review/       # approve/reject + audit timeline
│   └── auth-session/         # Steam OAuth UI, session reflection
├── entities/                 # Domain nouns: types, queryOptions, presenters, cards
│   ├── player/  squad/  rotation/  commander/  bounty/  replay/  request/  user/
│   │   └── api.ts            # queryOptions() factories over the typed client
├── shared/                   # Cross-cutting, depends on nothing above it
│   ├── api/                  # typed thin client + generated openapi types (gen output)
│   ├── table-kit/            # TanStack Table↔URL glue, virtual+scroll restoration helper
│   ├── sse/                  # EventSource wrapper + merge policies
│   ├── i18n/                 # typed ICU dict, locale routing, formatters, hreflang helpers
│   ├── seo/                  # meta/canonical/structured-data/sitemap builders
│   ├── uikit/                # Ark UI + Tailwind v4 primitives (+ colocated Ladle stories)
│   └── lib/                  # pure utils
├── styles/
│   └── theme.css             # generated from DESIGN.md (already exists)
└── server/                   # route handlers: /sitemap.xml, /robots.txt, /sse proxy, health
```

### Structure Rationale

- **`shared/api` is the only door to `server-2`** — enforces the cross-app boundary (no scattered
  `fetch`, no DB/S3). Everything above imports `queryOptions` factories, never the raw client.
- **`entities/*/api.ts` owns `queryOptions`** so loaders and components share *one* query definition
  (`ensureQueryData(playerQuery(id))` in the loader, `useSuspenseQuery(playerQuery(id))` in the
  component) — this identity is what makes Back restoration free (same cache key, already warm).
- **`routes/` is thin** — only URL parsing, `beforeLoad` gating, loader prefetch, and meta. Visual
  work lives in `features/`. Keeps route bundles splittable and SEO/meta auditable in one place.
- **`shared/table-kit` is built once, early** — the list→detail→Back contract is launch-blocking and
  identical across 6+ list surfaces; it must not be re-implemented per page.

---

## Route Tree

Locale is a path segment so every public URL is independently cacheable, indexable, and
hreflang-able. `/` is a redirect-only shell (browser-language → persisted choice).

```
/                                   → redirect to /$locale (browser lang / persisted), noindex
/sitemap.xml, /sitemap-*.xml        → segmented sitemap index (server handler)
/robots.txt                         → server handler

/$locale                            (locale validated in beforeLoad; sets i18n + <html lang>)
├── /                               overview (tables/leaderboards/microcharts)   [SSR, cached]
├── /players                        player list — server-driven table            [SSR, cached]
│   └── /players/$slug              player profile (slug = current owner)         [SSR, cached]
├── /squads                         squad list                                    [SSR, cached]
│   └── /squads/$slug               squad profile + membership timeline           [SSR, cached]
├── /rotations                      rotation list / canonical rotation pages      [SSR, cached]
│   └── /rotations/$id              rotation page (also a filter context elsewhere)
├── /commander                      commander-side stats (+ Unknown filter)       [SSR, cached]
├── /bounty                         bounty leaderboards (per-rotation)            [SSR, cached]
└── /replays/$replayId              replay detail (SSR summary + deferred events) [SSR, cached]

/$locale  (auth area — session required, ssr:true, beforeLoad loads session)
├── /account                        session/profile state
├── /requests                       my requests status/history
└── /requests/new/$type             guided stepper (identity | kills | teamkills | remove | dispute)

/$locale  (staff area — RBAC gate in beforeLoad: roles + capabilities)
├── /mod/queue                      risk+age request queue                        [no SSR cache]
├── /mod/requests/$id               request review + immutable audit timeline
├── /admin/roles                    role management
├── /admin/rotations                rotation management
└── /admin/ops                      ingest-conflict / parse-failure visibility
```

**Gating lives in `beforeLoad`, not components.** Public routes: `beforeLoad` validates `$locale`
only. Auth area: `beforeLoad` reads session → `redirect` to inline-login with return URL if absent.
Staff area: `beforeLoad` checks `capabilities` from session/API → `throw` a contextual 403 route
otherwise. This runs on the server during the initial request (verified: Start runs `beforeLoad`
server-side by default), so unauthorized HTML is never rendered or cached.

**Search params are typed and allowlisted** via `validateSearch` per list route (search/filter/sort/
cursor). The same allowlist is the nginx cache-key allowlist — volatile/unknown params are dropped
(canonical) to avoid crawl traps, and curated filter URLs get `index`; arbitrary combinations get
`noindex` + canonical to the clean URL.

**SSR posture per area:** public + auth-area routes use `ssr: true` (default). Staff/ops screens are
not SEO surfaces and not cached — keep `ssr: true` for a stable first paint but mark the routes
`no-store` at the proxy. Reserve `ssr: false` (Selective SSR) only for any future browser-only
widget; do **not** use SPA mode globally — it would forfeit SEO on the public surface.

---

## Data Flow

### Request flow (the canonical path — verified)

```
URL change / preload (intent)
   ↓
route.beforeLoad           (locale + session + RBAC, server on first request)
   ↓
route.loader               → queryClient.ensureQueryData(entityQuery(params))   ← typed thin client → server-2
   ↓                          (seeds the Query cache; SSR dehydrates it)
component render            → useSuspenseQuery(entityQuery(params))              ← reads the SAME cache key
   ↓
UI                          (no client refetch, no loading flash; data already present)
```

Two rules make this work and are non-negotiable:

1. **One `queryOptions` factory per entity**, imported by both loader and component. Same key ⇒ the
   loader's prefetch *is* the component's data.
2. **`defaultPreloadStaleTime: 0`** on the router so the router defers freshness entirely to Query
   (verified guidance: set to `0` when integrating Query so loaders run and Query owns staleness).
   Query's per-family `staleTime`/`gcTime` then govern SWR and how long Back-navigation stays warm.

### SSR hydration flow (verified)

```
server: makeQueryClient() per request → loaders ensureQueryData → router.dehydrate()
        returns { queryClientState: dehydrate(queryClient) } injected into HTML
   ↓
client: router.hydrate(dehydrated) → hydrate(queryClient, dehydrated.queryClientState)
        components mount with warm cache → zero client fetch on first paint (good LCP, no CLS)
```

`queryClient` is provided via `createRouter({ context: { queryClient } })` so loaders reach it
without imports. Browser uses a **singleton** QueryClient; server makes a **fresh** one per request
(prevents cross-request leakage).

### State boundaries (where each kind of state lives)

| State | Home | Why |
|-------|------|-----|
| search / filter / sort / cursor | **URL** (`validateSearch`) | shareable, SSR-rendered, cache-key input |
| server data (players, replays…) | **Query cache** | SWR, dehydration, Back warmth |
| scroll + virtualized offset | **router scroll-restoration cache** | ephemeral, per history entry |
| table density, "updates available" | **Nano Stores** | ephemeral client-only UI |
| session / capabilities | **route context** (from `beforeLoad`) | drives RBAC + nav |

---

## List→Detail→Back Restoration

This is the launch-blocking contract. It is assembled from four verified TanStack mechanisms, each
doing one job. Build `shared/table-kit` to encapsulate all four so every list gets it for free.

1. **Cached data survives Back** — because the list loader did
   `queryClient.ensureQueryData(listQuery(searchParams))` and the component reads the same
   `useSuspenseQuery(listQuery(searchParams))`. On Back, the cache entry is still within `gcTime`,
   so render is synchronous: **no blocking reload, no loading flash**. (Set list `gcTime` generously;
   `staleTime` can be short — SWR refreshes silently in the background without moving the viewport.)

2. **Table/filter/sort/cursor survive Back** — they live in the **URL** (`validateSearch`). Back
   restores the exact URL ⇒ exact same query key ⇒ exact same cached page. No separate persistence.

3. **Window/container scroll survives Back** — global
   `createRouter({ scrollRestoration: true })`. Default key is `location.state.__TSR_key` (per history
   entry), which is exactly what Back needs. Use `getScrollRestorationKey` only if you want scroll
   keyed by `pathname` instead of history entry.

4. **Virtualized row position survives Back** — the one piece TanStack Virtual can't infer. Verified
   manual pattern:

   ```tsx
   // shared/table-kit/VirtualTable.tsx
   const scrollRestorationId = `players-table:${serializedSearch}` // stable per list view
   const scrollEntry = useElementScrollRestoration({ id: scrollRestorationId })

   const parentRef = useRef<HTMLDivElement>(null)
   const virtualizer = useVirtualizer({
     count,
     getScrollElement: () => parentRef.current,
     estimateSize: () => ROW_H,
     initialOffset: scrollEntry?.scrollY,   // ← restores virtual position on Back
   })

   return (
     <div
       ref={parentRef}
       data-scroll-restoration-id={scrollRestorationId} // ← watcher caches this element's scroll
       className="overflow-auto"
     >
       {/* virtual rows */}
     </div>
   )
   ```

   `useElementScrollRestoration({ id })` + the matching `data-scroll-restoration-id` attribute let the
   router cache/restore a *nested* scroll container, and `initialOffset` feeds it back into the
   virtualizer before paint — so the user lands on the same row, not the top.

**CLS guard:** fixed `ROW_H`, reserved skeleton heights, and stable toolbar/filter dimensions so
restoration paints into already-reserved space (CLS budget ≤ 0.02). Restoration runs *before* paint
(verified), so there is no visible jump.

---

## SSE & Caching

### SSE transport + per-page merge

SSE is the freshness overlay on top of long-TTL caches. The architecture keeps it a **write-into-Query**
side channel so components never special-case "live vs loaded" data.

```
server-2 SSE  ──►  shared/sse EventSource wrapper  ──► classify event
                                                        ├─ small local delta  → queryClient.setQueryData (auto-merge)
                                                        │                        + bump "updated just now" freshness label
                                                        └─ large recalc / multi-table → set Nano Store "updates available"
                                                                                  flag; apply only on user action
                                                                                  (invalidateQueries) → no surprise reflow
```

Per-page merge policy (from the brief, made concrete):

- **Tables being read:** never auto-insert/reorder above the viewport. Default to a sticky *"N new
  updates — refresh"* affordance; apply on click via `invalidateQueries`. Prevents CLS + viewport jump.
- **Detail pages (player/replay):** small field updates auto-merge via `setQueryData` with a visible
  "updated Xs ago" stamp.
- **Bounty/aggregate recalcs:** treated as large → confirmation affordance, because they touch
  multiple queries.
- **Connection states** (connecting/offline/stale/error) are first-class, accessible (live region),
  and drive the stale-data banner.

`/sse` is excluded from the proxy cache (passthrough, `no-store`) and is **not** an SSR concern —
it attaches after hydration.

### SSR + nginx microcache interplay

| Concern | Decision |
|---------|----------|
| **Cache key** | `path + locale + allowlisted query params`. The allowlist === the route's `validateSearch` shareable set. Unknown params stripped (also the canonical/crawl-trap defense). |
| **Auth bypass** | If a session cookie is present → `proxy_cache_bypass` / `no-cache`. Public HTML is cached only for anonymous requests, so cached pages never embed a session. This is why **public rendering must not depend on authenticated data** (brief rule) — keep session reads out of public loaders. |
| **Freshness model** | Short TTL (minutes) + `proxy_cache_use_stale updating error timeout` + `proxy_cache_background_update on` + `proxy_cache_lock on`. SWR hides revalidation latency; SSE supplies sub-TTL freshness on the client. |
| **Stale labeling** | Served-stale / offline / post-error responses get an explicit stale label in-UI (driven by SSE connection + response freshness). |
| **Static shell** | Only landing frame / about / error pages are build-time prerendered (no runtime ISR in Start). Catalog/detail are SSR-through-microcache, never SSG (route space not enumerable). |
| **Purge (optional v1)** | Time-TTL + SSE is the baseline. On-demand purge (`ngx_cache_purge` or key eviction) on moderation/ingest events is a post-baseline optimization. |

`web` owns the loaders/headers and the SSE client; the nginx layer is provisioned in the
`infrastructure` repo. The architecture is correct only if both sides agree on the cache-key allowlist
and the auth-bypass cookie name — treat that as a documented cross-app contract.

---

## Cross-Cutting Concerns (establish EARLY)

These are not features; they are substrate. Every later phase depends on them, so they belong in the
foundation phase and must be right before the first product surface ships.

| Concern | Why it's cross-cutting | Established in |
|---------|------------------------|----------------|
| **Typed API client + generated types** | Every data read crosses it; stale-types CI gate blocks merges | Foundation |
| **i18n routing (`/$locale`) + typed ICU** | Locale is in every URL; SEO hreflang/canonical depend on it; retrofitting locale into routes later is a rewrite | Foundation |
| **Query cache + SSR dehydrate/hydrate wiring** | The backbone of the data flow and Back restoration | Foundation |
| **table-kit (URL↔table + virtual + scroll restoration)** | Launch-blocking contract reused by 6+ surfaces | Foundation / first list |
| **uikit + Tailwind v4 tokens + a11y primitives (Ark UI)** | WCAG 2.2 AA and dark-only consistency are quality gates on every screen | Foundation (tokens already exist) |
| **SEO builders (meta/canonical/structured data/sitemap)** | Public indexable surface depends on it; crawl-trap rules constrain route search params | Foundation, applied per public route |
| **SSE client + freshness/stale state model** | Touches every live surface; merge policy must exist before tables ship live data | Foundation, refined per page |
| **CWV/CLS discipline (reserved space, transform-only anim)** | Budgets enforced in CI per PR | Foundation, enforced continuously |

---

## Build Order

Dependency-ordered. Each tier must exist before the next; within a tier, items are parallelizable.

**Tier 0 — App foundation (must exist before any product surface)**
1. Start app scaffold: `package.json`, Vite, router factory, `app/ssr` server entry, Docker node target.
2. `shared/api`: `openapi-typescript` generation from live `server-2` schema + stale-types CI gate; typed thin client (auth/session injection, stable error codes).
3. Query wiring: `makeQueryClient` (per-request server / singleton browser), `context.queryClient`, router `dehydrate`/`hydrate`, `defaultPreload: 'intent'`, `defaultPreloadStaleTime: 0`, `scrollRestoration: true`.
4. i18n: `/$locale` route segment, `beforeLoad` locale validation, typed ICU dict, `/` redirect, formatters.
5. uikit baseline on existing Tailwind tokens + Ark UI primitives; a11y + dark-only conventions.
6. SEO substrate: head/meta helpers, `robots.txt`, sitemap-index handler, canonical/hreflang helper.
7. `shared/sse` EventSource wrapper + connection-state model (no page policies yet).
8. CI gates: Playwright matrix harness, axe, Lighthouse/bundle budgets, console-error gate.

**Tier 1 — `table-kit` + first public read surface (proves the launch-blocking contract end-to-end)**
9. `shared/table-kit`: TanStack Table ↔ `validateSearch` URL state, cursor pagination, TanStack Virtual, density (Nano Store), and the scroll/virtual restoration glue (§List→Detail→Back).
10. **Players** vertical first (list + `$slug` profile): the reference implementation of loader-prefetch → Query → Back restoration, provenance/Unknown/stale states, SSR + microcache, SEO meta. Everything after copies this shape.

**Tier 2 — Remaining public read surfaces (parallel, each reuses Tier-1 patterns)**
11. Squads (list + profile + membership timeline) · Rotations · Commander-side (+ Unknown filter) · Bounty leaderboards (+ effectiveness breakdown) · Overview page.
12. **Replay detail**: SSR summary + participants, **`defer` + `Await`** for progressive timeline/events (keeps LCP low), event→request entrypoints, indexable + segmented sitemap entries.
13. Per-page SSE merge policies (auto-merge vs "updates available") wired onto live tables/detail.

**Tier 3 — Auth + correction requests**
14. `features/auth-session`: Steam OAuth via `server-2`, session in `beforeLoad`, inline-login + return-URL, session-reflecting nav.
15. `features/request-stepper`: 5 guided flows; `server-2`-backed drafts (SSR-prefetched, debounced autosave, 7-day TTL); image + external-link evidence; live-after-submit validation; rate-limit/duplicate/cooldown/rejection states; reopen.

**Tier 4 — Moderation / admin / ops**
16. RBAC gate (capabilities in `beforeLoad`) + contextual 403 route.
17. `features/mod-queue` (risk+age) → `features/request-review` (approve/reject + comment + immutable audit timeline).
18. Admin roles · admin rotations · ops (ingest-conflict / parse-failure visibility, audited limited actions only).

**Why this order:** read surfaces validate the hardest, launch-blocking mechanism (Back restoration +
SSR microcache + SSE) on public, cacheable, login-free pages first — the lowest-risk place to get the
substrate right. Auth/requests/moderation reuse the same data flow, table-kit, and SSE plumbing, so
they become composition work rather than new architecture.

---

## Anti-Patterns

### Fetching in components instead of loaders
**What people do:** call `useQuery`/`fetch` inside the page component without a route loader.
**Why it's wrong:** component-level waterfalls, loading-flash, empty SSR HTML (bad LCP + SEO), and
Back navigation re-fetches → violates the launch-blocking contract.
**Instead:** `ensureQueryData(query)` in the loader + `useSuspenseQuery(query)` in the component,
sharing one `queryOptions` factory.

### Putting ephemeral state in the URL (or shareable state out of it)
**What people do:** push scroll/density into search params, or keep filters/sort in component state.
**Why it's wrong:** scroll in URL pollutes history and breaks restoration; filters in component state
aren't shareable or SSR-rendered and break Back.
**Instead:** shareable → URL (`validateSearch`); ephemeral → router scroll cache / Nano Stores.

### Letting SSE mutate the DOM directly / auto-reorder visible rows
**What people do:** patch the rendered list or push new rows on top while the user reads.
**Why it's wrong:** CLS + viewport jump (blows the CWV budget and the trust bar).
**Instead:** SSE writes into the Query cache; large/visible changes use an "updates available"
affordance applied on user action.

### Caching authenticated HTML at the proxy
**What people do:** let public loaders read session, then microcache the response.
**Why it's wrong:** a cached page can leak another user's session/state.
**Instead:** keep session out of public loaders; bypass the cache when a session cookie is present.

### Hand-writing DTOs or scattering `fetch`
**What people do:** type responses manually or call `server-2` from feature code.
**Why it's wrong:** drifts from the schema, breaks the cross-app boundary, no central auth/error
handling.
**Instead:** generated `openapi-typescript` types behind `shared/api`'s thin client only.

### SPA mode / `ssr:false` to "simplify"
**What people do:** disable SSR globally to dodge SSR bugs.
**Why it's wrong:** forfeits SEO and LCP on the entire public surface — the core product value.
**Instead:** keep `ssr: true`; use Selective SSR (`ssr: false`) surgically only for browser-only widgets.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| `server-2` REST | typed thin client over `openapi-typescript` (only via `shared/api`) | schema owned by `server-2`; CI fails on stale generated types |
| `server-2` SSE | `EventSource` → classify → merge into Query cache | `/sse` bypasses proxy cache; attaches post-hydration |
| Steam OAuth | via `server-2` only; session read in `beforeLoad` | inline-login + return-URL; public stats never gated |
| nginx microcache | HTTP cache headers + agreed cache-key allowlist + auth-bypass cookie | provisioned in `infrastructure` repo; cross-app contract |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| routes ↔ entities | loader calls `entity.api` `queryOptions` | one query def shared by loader + component |
| features ↔ entities/shared | import downward only (FSD) | features compose; never imported by entities/shared |
| SSE ↔ Query cache | `setQueryData` / `invalidateQueries` | UI reads only the Query cache, never SSE directly |
| URL ↔ table-kit | `validateSearch` ↔ TanStack Table state | URL is SoT for shareable table state |

---

## Sources

- TanStack Router — Scroll Restoration guide (`scrollRestoration`, `getScrollRestorationKey`, `useElementScrollRestoration`, `data-scroll-restoration-id`, `initialOffset`): https://github.com/TanStack/router/blob/main/docs/router/guide/scroll-restoration.md — **HIGH** (official repo markdown, verified verbatim)
- TanStack Router — Preloading guide (`defaultPreload: 'intent'`, `defaultPreloadStaleTime: 0` for external caches, `preloadRoute`): https://github.com/TanStack/router/blob/main/docs/router/guide/preloading.md — **HIGH**
- TanStack Router — External Data Loading guide (`queryClient.ensureQueryData` in loader + `useSuspenseQuery`, router `dehydrate`/`hydrate`, `context.queryClient`): https://github.com/TanStack/router/blob/main/docs/router/guide/external-data-loading.md — **HIGH**
- TanStack Router — Deferred Data Loading (`defer` + `Await` for progressive replay timeline): https://github.com/TanStack/router/blob/main/docs/router/guide/deferred-data-loading.md — **HIGH**
- TanStack Start — Selective SSR (`ssr: true/false`, `defaultSsr`, SPA-mode contrast): https://github.com/TanStack/router/blob/main/docs/start/framework/react/guide/selective-ssr.md — **HIGH**
- TanStack Query — Advanced SSR (per-request vs singleton QueryClient, dehydrate/hydrate, default `staleTime` for SSR): https://github.com/TanStack/query/blob/main/docs/framework/react/guides/advanced-ssr.md — **HIGH**
- Project brief `plans/web/briefs/web.md` and `.planning/PROJECT.md` (fixed stack/route/cache/realtime decisions) — **HIGH** (authoritative project source)

---
*Architecture research for: TanStack Start SSR esports stats + moderation app (FSD)*
*Researched: 2026-06-20*
