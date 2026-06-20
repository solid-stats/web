# Pitfalls Research

**Domain:** Public esports/gaming replay-statistics website + moderation interface — TanStack Start (React/TSX) SSR, mobile-first, dark-only, dense server-driven tables at 10k–100k rows, SSE realtime, Steam-OAuth, nginx microcache, RU/EN, consuming `server-2` via generated OpenAPI types.
**Researched:** 2026-06-20
**Confidence:** HIGH on framework-specific mechanics (verified against TanStack Start/Router official docs, nginx docs, openapi-typescript repo). MEDIUM where prevention depends on `server-2` contracts not yet pinned (draft API, RBAC matrix, SSE event shape, cache-purge events).

> Scope note: this catalog is deliberately specific to THIS stack and the launch-blocking requirements (list→detail→Back continuity, CWV budgets CLS ≤ 0.02 / INP ≤ 200ms / LCP ≤ 2.5s, WCAG 2.2 AA, SEO crawl traps, cache/auth bleed, data-trust states). Generic web advice is omitted.

---

## Critical Pitfalls

### Pitfall 1: Scroll/virtualized-position restoration breaks on list→detail→Back (the launch-blocking journey)

**What goes wrong:**
After Back, the table jumps to the top, re-fetches with a loading flash, or restores the *window* scroll but not the *virtualized row* position — so a user who scrolled to row 8,000 lands at row 0 or at a blank virtual gap. With `@tanstack/react-virtual` the virtualizer mounts at offset 0, the browser/router tries to set `scrollTop`, but the virtual content height isn't materialized yet, so the scroll clamps and the position is lost.

**Why it happens:**
TanStack Router's automatic scroll restoration captures and restores window/element scroll positions via `sessionStorage`, but a virtualizer does not derive its rendered window from `scrollTop` alone — it needs `initialOffset` seeded from the restored value. The documented pattern is to read `useElementScrollRestoration({ getElement: () => window })` and pass `scrollEntry?.scrollY` into the virtualizer's `initialOffset`. Skip that wiring and restoration silently half-works. Compounding causes: (a) restoring scroll before TanStack Query has rehydrated the list rows (height = 0 at restore time), (b) a custom scrollable container (sticky-header table body) that isn't the window and needs its own `useElementScrollRestoration({ getElement })` + a `data-scroll-restoration-id`, (c) a `getKey` that includes volatile query params so the saved entry never matches on return.

**How to avoid:**
- Use TanStack Router's built-in scroll restoration; for the virtualized body wire `useElementScrollRestoration` → virtualizer `initialOffset` exactly as the docs show (window virtualizer for the main list; element virtualizer + explicit scroll-restoration id for a scroll container).
- Keep ephemeral state (scroll, virtual offset, density) OUT of the URL (PROJECT decision) but ensure the restoration **key** is stable across the round-trip: a `getKey` keyed on pathname (+ curated/allowlisted params), NOT the full querystring, so Back matches.
- Guarantee list data is in the Query cache on Back with no blocking reload: loader-prefetch into the Query cache + a `staleTime` long enough that Back is a cache hit, not a refetch. Prefetch detail on hover/intent so the forward nav is warm too.
- Restore AFTER rows exist: don't let the virtualizer estimate from 0 height. Seed `count` from cached data (or cached total) before first paint.

**Warning signs:**
- Back lands at top, or at a blank region, or flashes a skeleton.
- Position holds for a non-virtualized list but breaks once virtualization is enabled.
- Restoration works on desktop (window scroll) but not mobile (sticky-body scroll container) or vice versa.
- `sessionStorage` scroll entries exist but keys don't match between forward and back nav.

**Phase to address:**
The phase that builds the first server-driven virtualized table (Public Stats — player/squad list). This journey is launch-blocking and must be a Playwright gate from the first table, not retrofitted.

---

### Pitfall 2: SSR hydration mismatch from locale/date/auth/responsive content (violates the "no hydration mismatch" launch requirement)

**What goes wrong:**
Server HTML differs from the first client render → React throws a hydration error, the subtree re-renders client-side (loading flash + CLS), and console errors fire — which is an explicit launch blocker (CI-06 blocks merge on console errors). Highest-risk sources here, all present in this product: localized RU/EN dates/numbers via `Intl` (server timezone ≠ user timezone), relative "last updated 3m ago" provenance timestamps using `Date.now()`, `nanoid`/random keys, responsive-only branches (mobile tabs vs desktop nav rendered from a guessed width), and auth-dependent chrome (login button vs avatar) when the session is read differently on server and client.

**Why it happens:**
TanStack Start's own hydration-errors guide names exactly these causes: **Intl (locale/time zone), `Date.now()`, random IDs, responsive-only logic, feature flags, and user preferences.** SSR runs in the server's locale/timezone; the client re-renders in the user's. Naively formatting dates or branching on `window.matchMedia` at module/first-render time guarantees divergence.

**How to avoid (per the official guidance):**
- Wrap genuinely client-only/unstable UI in `<ClientOnly>` (exported from `@tanstack/react-router`) with a layout-stable fallback — but use sparingly, because anything inside `ClientOnly` is NOT in SSR HTML and thus not SEO-indexable (see Pitfall 7).
- For timezone/locale: set a cookie with the client time zone (and chosen language) on first visit; SSR formats using that cookie (UTC fallback until set) so server and client agree. This dovetails with the `/ru` `/en` routing — locale comes from the route, not from client-only detection.
- Render relative timestamps as a stable absolute value in SSR HTML and upgrade to "x ago" after mount (or compute from a server-provided `now`), never `Date.now()` during render.
- Read the session on the server (loader) and pass it down so server and client render the same auth chrome; don't branch on a client-only auth store for the first paint.
- Reserve responsive layout via CSS, not JS width branches, for anything in initial HTML.

**Warning signs:**
- "Hydration failed / text content did not match" or "Expected server HTML to contain…" in console.
- A header/date/auth control visibly flips or re-lays-out ~100ms after load.
- Errors appear only in a non-UTC timezone or only when logged in.

**Phase to address:**
App Foundation (SSR shell, i18n routing, session bootstrap, the date/number formatting utilities and the cookie-locale mechanism). Lock a "no hydration mismatch" Playwright/console-error gate here so every later page inherits it.

---

### Pitfall 3: CLS budget (0.02) blown by SSE merges, late fonts, tables, skeletons, and unsized media

**What goes wrong:**
The 0.02 CLS budget (must not exceed 0.05 on critical journeys) is extremely tight — far stricter than the "good ≤ 0.1" web default. It's blown by: SSE inserting/reordering rows above the viewport while the user reads; a web font swapping and reflowing tabular stat columns (FOUT); skeletons whose dimensions don't equal the final content; replay images/avatars without intrinsic `width`/`height`; a "new updates available" banner or stale-data label that pushes content down when it appears; and number columns that change width because numerals aren't tabular.

**Why it happens:**
Budget is ~5× stricter than industry default, so habits that pass elsewhere fail here. SSE realtime + a "show live data" product is the dominant risk: any merge that changes layout above the fold counts. Fonts are second: a non-`size-adjust`ed swap reflows dense tables.

**How to avoid:**
- SSE merges follow the PROJECT contract: never reorder/insert above the current viewport; use a "new updates available" affordance for above-fold changes, auto-merge only for off-screen/below-fold small changes, and require confirmation for large recalcs. Reserve the banner's space (fixed-height slot) so its appearance is 0 shift.
- Self-host the UI font with `font-display: optional` or `swap` + `size-adjust`/`ascent-override` matched to the fallback so the swap doesn't reflow; preload only the one critical face. Use tabular numerals (already a design rule) so number cells don't re-width on update.
- Every skeleton, row, avatar, image, chart, toolbar, and filter control has fixed/reserved dimensions equal to final content (already a design rule — enforce it in review and with a CLS Playwright gate). Give images explicit `width`/`height` or `aspect-ratio`.
- Stale/offline/provenance labels render in a pre-reserved slot, never injected as new flow content.

**Warning signs:**
- Lighthouse/CrUX CLS creeps above 0.02 on list or replay pages.
- Visible row jump when an SSE event lands; banner appearance nudges the table.
- Layout settles late after font load (watch the LCP/CLS waterfall).

**Phase to address:**
Cross-cutting: font/skeleton/image discipline in App Foundation; SSE-merge CLS rules in the realtime phase; a CLS regression gate (CI-07) wired before the first list ships.

---

### Pitfall 4: INP > 200ms under heavy filter/sort/virtualize on 10–100k rows

**What goes wrong:**
Typing in a filter or toggling a sort blocks the main thread — re-deriving/re-keying tens of thousands of rows, re-running TanStack Table's row model, or doing client-side filtering on a 100k dataset — and INP blows past 200ms. The press feels stuck; on mobile it's worse.

**Why it happens:**
Treating 10–100k rows as a client-side data grid. TanStack Table will faithfully recompute large row models synchronously inside the input handler. Even with server-driven data, large `data` arrays, non-memoized `columns`, unstable `getRowId`, or `useState` per keystroke trigger synchronous re-render storms.

**How to avoid:**
- Filtering/sorting/cursor are server-driven (PROJECT decision) — do NOT ship client-side filtering of the full set. Debounce filter input, push state to the URL/loader, let `server-2` return the page.
- Wrap state updates that cascade into table re-renders in `useTransition`/`startTransition` (React 18/19) so typing stays responsive and the heavy recompute is interruptible.
- Memoize `columns` and `data`, give TanStack Table a stable `getRowId`, and keep `manualFiltering`/`manualSorting`/`manualPagination` ON so it doesn't recompute models locally.
- Virtualize rows (`@tanstack/react-virtual`) so DOM node count stays bounded regardless of result size; keep per-row render cheap (no heavy formatting in the row body — precompute).
- Keep interaction handlers short; defer non-critical work (PROJECT perf rule). Move any CPU-heavy transform off the main thread or chunk it.

**Warning signs:**
- Input lag when filtering large lists; INP regressions in the Lighthouse/CWV gate.
- Long tasks (>50ms) in the performance panel tied to keystrokes or sort clicks.
- Frame drops scrolling the virtualized body on mid-range phones.

**Phase to address:**
The first server-driven table phase (Public Stats). Establish the manual-mode + transition + virtualization pattern as the table baseline; INP budget enforced in CI from there.

---

### Pitfall 5: SEO crawl traps from volatile filter/search/sort/cursor URLs + wrong canonical/noindex/hreflang for `/ru` `/en`

**What goes wrong:**
Every filter/sort/search/cursor combination is a unique crawlable URL → Googlebot drowns in near-duplicate parameterized pages (crawl-budget waste, index bloat, duplicate-content dilution) — an explicit SEO requirement to avoid. Separately, `/ru` and `/en` versions of the same page compete unless `hreflang` + self-referential canonicals are correct; a wrong canonical (e.g. all locales canonicalizing to one) de-indexes the other language.

**Why it happens:**
Server-driven tables put shareable state in the URL (correct for sharing) but that same property generates infinite volatile permutations. Teams forget that "shareable" ≠ "indexable." Locale canonical/hreflang is fiddly and easy to get backwards.

**How to avoid:**
- Curated indexable filter/category URLs only (e.g. a canonical rotation page, a canonical squad page); arbitrary search/sort/cursor states get `noindex` + a canonical pointing at the clean base URL. This is a stated requirement — implement it as a per-route metadata policy, not ad hoc.
- Self-referential `rel=canonical` per indexable page; reciprocal `hreflang` pairs for `/ru` ↔ `/en` plus `x-default`. Each locale page canonicalizes to ITSELF, not to the other locale.
- `robots.txt` + meta `noindex` to keep crawlers off cursor/param permutations; descriptive link text (no "read more").
- Curated `ItemList`/`BreadcrumbList`/`VideoGame` structured data only on the curated indexable surfaces.

**Warning signs:**
- Search Console "Crawled — currently not indexed" / "Duplicate without user-selected canonical" exploding; crawl stats dominated by `?sort=&cursor=` URLs.
- Both language versions indexed for the same query, or one language vanishing from the index.

**Phase to address:**
SEO phase, but the canonical/noindex/hreflang policy must be a reusable route-metadata primitive defined when public routes are first built (Public Stats), then audited in the SEO phase.

---

### Pitfall 6: Segmented sitemaps for large replay-ID URL sets done wrong (single oversized sitemap)

**What goes wrong:**
All replay detail URLs in one sitemap → it exceeds the 50,000-URL / 50 MB per-sitemap limit and Google ignores it; or it's regenerated on every request and times out; or it's stale and new replays never get discovered.

**Why it happens:**
Replay-ID URL space is large and grows continuously (non-enumerable at build time — the same reason SSG is rejected for this data). A single static sitemap can't represent it.

**How to avoid:**
- Sitemap index pointing to segmented child sitemaps (≤ 50k URLs each), generated server-side from `server-2` data, paginated/segmented by ID range or date. This is a stated requirement — build it as a dynamic route, cached behind the nginx microcache with a sane TTL, not regenerated per hit.
- Include `lastmod`; segment so newly ingested replays land in a fresh segment crawlers re-check.

**Warning signs:**
- Search Console "Sitemap could not be read" / "too large"; replay pages not getting discovered/indexed.
- Sitemap endpoint slow or memory-heavy under crawl.

**Phase to address:**
SEO phase (depends on replay detail pages existing). Flag for deeper research: exact segmentation key and TTL.

---

### Pitfall 7: nginx `proxy_cache` microcache leaks authenticated content OR serves stale public data without labeling

**What goes wrong:**
Two failure modes, both serious. (a) **Auth bleed:** an authenticated response (with a logged-in user's avatar/session-tinted HTML, or a `Set-Cookie`) gets stored in the shared microcache and served to other users — a session/identity leak. (b) **Silent stale:** public data served from cache (or `proxy_cache_use_stale` after a backend error) without the explicit "stale/offline/served-after-error" label the product contract requires, so users trust outdated stats as live.

**Why it happens:**
nginx by default will NOT cache a response carrying `Set-Cookie`, but teams override this with `proxy_ignore_headers Set-Cookie;` to raise hit rates and thereby cache per-user responses; or the `proxy_cache_key` omits auth/locale state so one variant serves all. `stale-while-revalidate` / `serve-stale-on-error` is desired for resilience, but the UI must surface it.

**How to avoid:**
- Cache key includes path **+ locale (`/ru` vs `/en`) + an allowlist of shareable query params** ONLY (the PROJECT decision). Never include unallowlisted params; never key public cache by auth.
- Hard separation: authenticated/account/mod/admin and any route that varies by session is `proxy_cache_bypass` / `proxy_no_cache` (never cached). Do NOT `proxy_ignore_headers Set-Cookie` on cacheable public routes; strip/avoid `Set-Cookie` on public SSR responses so they're safe to share.
- Public SSR HTML must be identical for all anonymous users — no per-user data baked into cacheable HTML (read session client-side or in a non-cached island).
- When data is stale/served-after-error (`proxy_cache_use_stale` fires) the response must drive the explicit stale label; pair short TTL + `proxy_cache_background_update` + `proxy_cache_lock` with the SSE freshness overlay and visible stale banners.

**Warning signs:**
- A logged-in user sees another user's name/avatar, or a logged-out user sees logged-in chrome.
- `Set-Cookie` present on a cached public response; `proxy_ignore_headers Set-Cookie` in config on a public location.
- Cache HIT rate suspiciously high on authenticated routes; stale data shown with no banner.

**Phase to address:**
The rendering/caching phase (and the `infrastructure` repo for the nginx config). Add a Playwright/integration check: an authenticated request must never produce a cacheable response, and two anonymous users must get identical cached HTML. This is security-grade — gate it.

---

### Pitfall 8: `openapi-typescript` types drift from the live `server-2` schema (no built-in `--check`)

**What goes wrong:**
Generated types lag the live `server-2` OpenAPI schema; the frontend compiles green against stale DTOs but breaks at runtime against the real API (renamed field, changed enum, new required param). The PROJECT requires CI to FAIL on stale types — but `openapi-typescript` has **no built-in check/verify flag** (tracked open issue #1615), so a naive setup silently never detects drift.

**Why it happens:**
Teams assume `openapi-typescript` can diff like a formatter. It can't — it only writes. Without an explicit CI step, regeneration is forgotten and drift accumulates. Also: generating from a hand-committed schema file instead of the live backend schema means you validate against a stale snapshot, not reality.

**How to avoid:**
- CI step: pull the schema from the **live/reachable `server-2`** (the stated primary source), regenerate, then `git diff --exit-code <generated-file>` (or compare hashes) and FAIL if it changed. This is the standard pattern since there's no `--check`.
- Treat generated types as the single source of truth (no hand-written DTOs); enable `noUncheckedIndexedAccess` (PROJECT) so indexed access from generated maps is guarded.
- Validate untrusted runtime payloads at the boundary (the types are compile-time only; a stale or lenient schema still lets bad data through) — especially for SSE event bodies and upload responses.
- Consider `oasdiff` for breaking-change awareness across schema versions.

**Warning signs:**
- "Cannot find property X" only after a `server-2` deploy; runtime `undefined` where types promised a value.
- CI green but staging breaks against real API; generated file hasn't changed in many `server-2` releases.

**Phase to address:**
App Foundation (the typed thin client + generation pipeline + the stale-types CI gate). This is APP-11/APP-12/APP-15 and must be a CI gate from day one.

---

### Pitfall 9: Virtualization breaks keyboard navigation and screen readers (WCAG 2.2 AA failure)

**What goes wrong:**
Virtualized rows only render the visible window, so: screen readers announce a wrong/empty row count and can't perceive off-screen rows; `Tab`/arrow focus moves to a row, the user scrolls, the focused node unmounts and focus is lost (jumps to `<body>`); `Ctrl+F`/find-in-page misses unrendered rows; `aria-rowcount`/`aria-rowindex` are absent so position is unknowable. This fails WCAG 2.2 AA — a launch quality bar, and axe serious/critical violations block merge (CI-05).

**Why it happens:**
Virtualization optimizes paint by destroying DOM, which is exactly the DOM assistive tech relies on. The default "windowed" `<div>` soup has no table semantics. Sort/filter state changes aren't announced.

**How to avoid:**
- Provide ARIA grid/table semantics: `role="grid"`/`table` with `aria-rowcount` = TOTAL rows (not rendered), `aria-rowindex` per row reflecting true position, `aria-colindex` on cells. Use Ark UI primitives where they cover the interaction.
- Manage focus across virtualization: keep a roving tabindex / focus model that survives row unmount; restore focus to the logical row after scroll; never let focus fall to `<body>`. Ensure focus isn't hidden behind sticky headers/toolbars (PROJECT a11y rule) — scroll the focused row into the non-occluded area.
- Announce sort/filter state changes via live regions (PROJECT requires table sort/filter state announced correctly); don't convey sort direction by icon color alone.
- Keyboard path for pagination/cursor, density toggle, and row actions; 44×44 targets; no keyboard traps.
- Test with axe in Playwright AND real keyboard/SR passes — axe alone won't catch focus-loss-on-scroll.

**Warning signs:**
- Screen reader says "row 1 of 20" on a 50k-row table; arrowing past the rendered window does nothing.
- Focus vanishes (lands on body) after scrolling a virtualized list; find-in-page misses content.
- Sort toggle gives no SR announcement.

**Phase to address:**
The first virtualized-table phase, jointly with the accessibility gate. This is a known-hard intersection — flag for deeper research and a dedicated SR/keyboard test pass, not just axe.

---

### Pitfall 10: Request-draft autosave races + 7-day TTL semantics handled client-side

**What goes wrong:**
Debounced autosave to a `server-2` draft resource races: two in-flight saves land out of order and the older one wins (lost edits); a save fires after the user navigated away or after the draft expired (writing to a dead/expired draft → 404/409 the UI doesn't handle); two tabs autosave the same draft and clobber each other; the draft is created on the *wrong* trigger (on mount instead of "after first meaningful edit") spamming empty drafts. TTL treated as client-side ("hide after 7 days") instead of trusting `server-2`'s expiry, so the UI shows a draft the server already purged.

**Why it happens:**
Drafts are `server-2` resources, not local state (PROJECT decision) — so autosave is a distributed write problem, not a local one. Debounce alone doesn't order or cancel. 7-day TTL is a server semantic; mirroring it client-side drifts.

**How to avoid:**
- Per-draft save mutation that is serialized/cancellable: cancel the prior in-flight save (AbortController) and/or use optimistic + last-write-wins with a server `updatedAt`/version (reject stale writes server-side; handle the 409). Use TanStack Query mutation with a single-flight key per draft.
- Create the draft only after first meaningful edit (PROJECT), not on form mount; show explicit save/saving/error states (PROJECT).
- Treat TTL/expiry as authoritative from `server-2`: on resume, fetch the draft; if 404/expired, surface "draft expired" and start clean — don't compute 7 days locally.
- SSR-prefetch drafts (PROJECT) so the form isn't hydration-only filled (ties back to Pitfall 2).
- Handle rate-limit / duplicate / cooldown / conflict states from `server-2` (REQ-06) in the autosave path, not just on final submit.

**Warning signs:**
- Edits lost after fast typing; "draft saved" then content reverts; duplicate empty drafts in the queue.
- 404/409 on autosave after idle or across tabs; draft visible past its server expiry.

**Phase to address:**
Authenticated Player UX (request flows + drafts). Flag for deeper research: exact draft API, conflict/versioning behavior, and 7-day cleanup semantics (already a noted follow-up).

---

### Pitfall 11: Masked-SteamID leakage (full ID exposed despite the masking rule)

**What goes wrong:**
SteamID must be shown only masked (last four digits) — but the full ID leaks via: the API response carrying the full ID into client state/HTML where it's masked only in the rendered string (full value sits in the DOM, network tab, SSR HTML, or Query cache); a profile link/avatar URL containing the full SteamID; structured data / meta tags echoing it; logs or error payloads including it; or a sort/filter param exposing it.

**Why it happens:**
Masking treated as a display concern (slice the string in the component) while the full value still flows through SSR HTML, the cache, and the network — visible to anyone with devtools. The privacy guarantee is about exposure, not just rendering.

**How to avoid:**
- Mask at the source: ideally `server-2` returns the already-masked form for public surfaces (cross-app check). If the full ID must reach the client for an authenticated/owner context, never put it in cacheable public SSR HTML, public structured data, link hrefs, or anonymous-visible Query cache.
- Audit network responses, SSR HTML, JSON-LD, meta tags, and any URL for full SteamID on public pages. Don't log it client-side.
- Treat it like PII in the cache-key/cache-bleed analysis (Pitfall 7): a masked public page is cacheable; a page with the real ID is not.

**Warning signs:**
- Full SteamID visible in view-source, the network tab, the Query devtools cache, a profile link, or JSON-LD on a public page.

**Phase to address:**
Player Profile / Public Stats phase, with a cross-app check on what `server-2` returns. Add a Playwright/grep assertion that public HTML never contains a full SteamID.

---

### Pitfall 12: Unknown / Conflict / provenance state collapsed into "normal" (legacy commander-side data shown as fact)

**What goes wrong:**
Legacy commander-side games with unknown outcomes get rendered as a real win/loss (or silently dropped from win-rate denominators), conflicting parse/ingest data is shown as a single authoritative value, and "last updated"/source provenance is missing — so the product reads as untrustworthy or, worse, asserts wrong facts. This directly violates the trust contract (visible provenance, explicit filterable Unknown, explicit Conflict).

**Why it happens:**
Frontends model the happy path: a result is a boolean, a number is a number. Three-state (known / unknown / conflict) and provenance metadata are extra work that's easy to defer, and the legacy data's "unknown" looks like a null to coerce away.

**How to avoid:**
- Model Unknown and Conflict as first-class states in the data layer and the design system (PROJECT/design rules: unknown badges, conflict badges, parse/status context, last-updated) — not as `null` coerced to 0/false.
- Unknown commander outcomes must be an explicit, **filterable** status (PROJECT) and excluded from win/loss denominators correctly (don't count unknowns as losses).
- Surface provenance everywhere it exists: last-updated, source/replay links, parse state; explain bounty/squad-effectiveness breakdowns rather than showing opaque numbers.
- Verify the three-state + provenance fields actually exist in the `server-2` contract before designing the UI (cross-app check); don't invent them.

**Warning signs:**
- A legacy game shows a confident W/L; win-rate denominators don't match known+unknown accounting.
- No last-updated/provenance anywhere; conflict resolved silently to one value.

**Phase to address:**
Data-modelling in App Foundation (state types) + each public stats surface. Commander-side stats phase owns the unknown/filter behavior specifically.

---

### Pitfall 13: Steam-OAuth return-to flow and 403/RBAC handling broken

**What goes wrong:**
After an inline login prompt → Steam OAuth round-trip, the user lands on the home page or a generic dashboard instead of back in the exact flow they started (the half-filled request, the event they clicked) — the PROJECT requires returning the user to the original flow. Or: an `open redirect` via an unvalidated `returnTo` param. Or: RBAC computed only from a coarse role, so a mod route renders then 403s after data loads (flash of unauthorized content), or capabilities aren't honored so buttons appear that the API rejects. Unauthorized routes show a generic 403 instead of the required contextual 403 with missing-rights + recovery actions.

**Why it happens:**
OAuth redirects lose in-flight UI state; `returnTo` is easy to implement insecurely. RBAC is driven by roles PLUS explicit capabilities from session/API (PROJECT) — coarse role-only checks diverge from what the API actually permits.

**How to avoid:**
- Persist the originating flow (request draft already exists server-side; persist the entrypoint/return target) and resume after OAuth. Validate `returnTo` against an allowlist of same-origin internal paths — never reflect an arbitrary URL.
- Drive RBAC UI from roles + capabilities from session/API data (PROJECT/RBAC-01); gate rendering on capability, not just role, so no button appears for an action the API will 403.
- Resolve auth/capability in the route loader (server) so an unauthorized route renders the contextual 403 up front, not after a flash of content. Contextual 403 shows missing rights + recovery (PROJECT).
- Handle 401 (re-auth) distinctly from 403 (insufficient rights) with stable error codes (API assumptions).

**Warning signs:**
- Login dumps the user to home, losing their request context; `returnTo` accepts external URLs.
- Mod/admin page flashes content then 403s; a control 403s on click instead of being hidden/disabled.
- Generic 403 with no recovery path.

**Phase to address:**
Authenticated Player UX (OAuth return-to) and Moderation/Admin (RBAC + contextual 403). Cross-app check on the capability shape from `server-2`.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Client-side filter/sort over the full row set | Fast to build, no server contract needed | INP blowup + memory at 10–100k rows; total rewrite to server-driven | Never for the 10–100k tables; OK only for tiny fixed lists (<~200 rows) |
| Skipping `useElementScrollRestoration`→`initialOffset` wiring, relying on default scroll | Looks fine for short non-virtual lists | Launch-blocking Back journey silently broken once virtualized | Never on virtualized lists |
| `proxy_ignore_headers Set-Cookie` to raise cache hit rate | Higher HIT %, less origin load | Authenticated-content/session leak | Never on cacheable public routes |
| Committing a static OpenAPI snapshot instead of pulling live `server-2` schema in CI | No backend dependency in CI | Validates against a stale contract; drift undetected | Only as a pinned fallback WITH a separate live-schema drift job |
| Masking SteamID in the component only | One-line change | Full ID still in HTML/cache/network → privacy breach | Never; mask at/near source |
| `ClientOnly`-wrapping content to "fix" a hydration error | Error disappears fast | Content drops out of SSR HTML → not indexable; CLS on mount | Only for genuinely client-only, non-SEO, non-LCP UI |
| Mirroring the 7-day draft TTL client-side | No extra fetch | Shows drafts the server purged; resume fails | Never; trust server expiry |
| Treating Unknown/Conflict as `null`→0/false | Simpler types | Asserts wrong facts; breaks trust contract; rework | Never |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `server-2` OpenAPI | Hand-writing DTOs / static schema snapshot; assuming `openapi-typescript --check` exists | Generate from live schema; `git diff --exit-code` drift gate; generated types are SoT |
| nginx `proxy_cache` | Caching `Set-Cookie`/auth responses; cache key missing locale | Bypass cache for auth/account/mod/admin; key on path+locale+allowlisted params; strip Set-Cookie on public SSR |
| Steam OAuth (via `server-2`) | Unvalidated `returnTo`; losing in-flight flow | Allowlist same-origin `returnTo`; persist+resume the originating flow |
| SSE | Merging above-viewport → CLS; no reconnect/stale UI; unvalidated event bodies | Below-fold auto-merge / above-fold "updates available"; visible reconnect/stale states; validate event payloads at boundary |
| TanStack Query + SSR | Refetch on Back (blocking reload); not dehydrating loader data | Loader-prefetch into Query cache, sufficient `staleTime`, dehydrate/rehydrate so Back is a cache hit |
| Image/avatar/replay media | Unsized media → CLS; full SteamID in URL | Explicit width/height/aspect-ratio; no PII in asset URLs |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Non-virtualized large table | DOM bloat, slow scroll, high memory | `@tanstack/react-virtual` + bounded DOM | ~1k+ rows; severe at 10k+ |
| Synchronous filter/sort in input handler | INP > 200ms, input lag | server-driven + debounce + `useTransition` | Noticeable at a few thousand rows |
| Unmemoized `columns`/`data`, unstable `getRowId` | Whole-table re-render per keystroke | Memoize; stable row id; manual modes | Any non-trivial table |
| Restoring scroll before data hydrated | Back lands top/blank | Seed `count` from cache; `initialOffset` from restoration entry | Always on virtualized Back |
| Font swap reflowing tabular columns | Late layout settle, CLS | Self-host + `size-adjust`/`font-display`; tabular nums | Any web-font dense table |
| SSE high-frequency merges re-rendering the list | Jank, CLS, INP on a live page | Batch/throttle merges; off-screen-only auto-merge; stable keys | Busy rotations / live recalcs |
| Single-region origin + microcache as SPOF | Total outage if origin/nginx down | Documented post-v1 second node/CDN (noted follow-up) | Origin incident |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Auth content in shared microcache | Session/identity leak across users | Never cache auth routes; never `proxy_ignore_headers Set-Cookie` on public; key excludes auth |
| Full SteamID in public HTML/cache/URL | Privacy-rule breach | Mask at source; audit HTML/JSON-LD/links/network; no PII in cache |
| Open redirect via `returnTo` | Phishing / credential redirect | Allowlist same-origin internal paths only |
| RBAC by role only, not capability | Action surfaced that API forbids; privileged action attempted | Gate on capabilities from session/API; resolve in loader |
| Trusting generated types as runtime validation | Bad/mismatched payload crashes/poisons UI | Validate untrusted payloads (SSE, uploads) at the boundary |
| External evidence links rendered unsafely | Reflected/redirect/XSS via user-supplied URL | Safe external-link handling: `rel="noopener noreferrer nofollow"`, scheme allowlist, interstitial where stated |
| Request visibility not enforced client+server | Requester-only/staff-only data exposed | Enforce on `server-2`; UI never assumes hidden = secure |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Back loses table state/scroll | Re-finds their place; abandons | Launch-blocking restoration (Pitfall 1) |
| SSE jumps content under the reading user | Loses place, distrust | "Updates available" affordance; no above-fold reorder |
| Stale/cached data shown as live | Trusts wrong stats | Explicit stale/offline/served-after-error labels |
| Unknown shown as a real outcome | Believes a wrong fact | First-class Unknown badge + filter |
| Validation only on submit, no live update | Frustrating fix loop | Errors after submit, then live-update per field (PROJECT) |
| Icon-only control without accessible name | SR users blocked; ambiguous | Accessible name always; tooltip ≠ name |
| `/` doesn't language-redirect / switcher not persisted | Wrong-language landing | Browser-language redirect + persisted switcher (PROJECT) |
| Skeleton ≠ final dimensions | Layout jump on load | Reserve exact final space |

## "Looks Done But Isn't" Checklist

- [ ] **List→detail→Back:** Often missing virtualized-row restoration / no-blocking-reload — verify with a deep-scroll Playwright test that asserts row position AND no refetch/CLS/console error on Back.
- [ ] **SSR page:** Often missing hydration-mismatch coverage for non-UTC timezone + logged-in state — verify console is clean in both, in CI.
- [ ] **CLS:** Often passes "good (0.1)" but fails the 0.02 budget — verify against 0.02 with SSE active and fonts cold.
- [ ] **Large table:** Often missing axe-clean ≠ SR-usable — verify keyboard-through-virtualization, `aria-rowcount`=total, focus survives scroll.
- [ ] **OpenAPI types:** Often "generated once" — verify CI pulls LIVE schema and fails on `git diff`.
- [ ] **Microcache:** Often missing auth-bypass proof — verify an authed request is never cacheable and two anon users get byte-identical HTML.
- [ ] **SEO:** Often missing noindex/canonical on volatile param URLs and correct `/ru`↔`/en` hreflang — verify rendered `<head>` per route class.
- [ ] **Sitemap:** Often a single oversized file — verify sitemap index + ≤50k-URL segments for replays.
- [ ] **Draft autosave:** Often missing race/expiry handling — verify out-of-order saves, expired-draft resume, two-tab edit.
- [ ] **SteamID:** Often masked in UI only — verify full ID absent from HTML/JSON-LD/links/network on public pages.
- [ ] **403/RBAC:** Often role-only + generic 403 — verify capability gating and contextual 403 with recovery, resolved before content paints.
- [ ] **OAuth return-to:** Often dumps to home — verify resume into the exact originating flow; `returnTo` allowlisted.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Auth content cached/leaked | HIGH | Purge cache immediately; add auth bypass + Set-Cookie strip; rotate any leaked session; add the never-cache-authed CI gate |
| Broken Back restoration shipped | MEDIUM | Wire `useElementScrollRestoration`→`initialOffset`, fix restoration key, ensure cache-hit-on-Back; add the deep-scroll Playwright gate |
| CLS regression | LOW–MEDIUM | Size offenders, reserve SSE/banner slots, fix font swap; add CLS gate at 0.02 |
| OpenAPI drift caused runtime break | LOW | Regenerate from live schema, fix call sites, add `git diff` CI gate so it can't recur |
| Virtualization a11y failure | MEDIUM–HIGH | Add ARIA grid semantics + focus model + live-region announcements; dedicated SR/keyboard test pass (axe insufficient) |
| Full SteamID leaked | MEDIUM | Mask at source, scrub HTML/JSON-LD/links, purge cached public pages containing it |
| Draft race lost edits | MEDIUM | Single-flight cancellable saves + server version/last-write-wins; handle 409/expiry |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1 Scroll/virtual restoration | First server-driven table (Public Stats) | Deep-scroll Playwright Back test: row position + no reload/CLS/console error |
| 2 Hydration mismatch | App Foundation (SSR/i18n/session) | Console-clean SSR in non-UTC TZ + logged-in, in CI |
| 3 CLS budget | App Foundation + Realtime | CLS ≤ 0.02 gate with SSE active, fonts cold |
| 4 INP on large tables | First server-driven table | INP ≤ 200ms gate; no long tasks on filter/sort |
| 5 SEO crawl traps + hreflang | Public Stats (policy) → SEO phase (audit) | Per-route `<head>`: noindex/canonical on volatile; reciprocal hreflang |
| 6 Segmented sitemaps | SEO phase (after replay detail) | Sitemap index + ≤50k segments validate in Search Console |
| 7 Microcache auth bleed / silent stale | Rendering/caching + `infrastructure` | Authed never cacheable; two anon = identical HTML; stale label present |
| 8 OpenAPI drift | App Foundation | CI pulls live schema + `git diff --exit-code` fails on drift |
| 9 Virtualization a11y | First virtualized table + a11y gate | axe-clean AND SR/keyboard pass; `aria-rowcount`=total; focus survives scroll |
| 10 Draft autosave races/TTL | Authenticated Player UX | Out-of-order save, expired-draft resume, two-tab tests |
| 11 Masked-SteamID leakage | Player Profile / Public Stats | Public HTML/JSON-LD/links/network contain no full SteamID |
| 12 Unknown/Conflict/provenance | App Foundation types + Commander phase | Unknown filterable & excluded from denominators; provenance visible |
| 13 OAuth return-to + RBAC/403 | Auth UX + Moderation/Admin | Resume to origin flow; capability-gated; contextual 403 pre-paint; `returnTo` allowlisted |

## Sources

- TanStack Router — Scroll Restoration (official): https://tanstack.com/router/latest/docs/guide/scroll-restoration — `useElementScrollRestoration({ getElement: () => window })` → virtualizer `initialOffset`; custom `getKey`; positions persisted to sessionStorage and restored after route render. [HIGH]
- TanStack Start — Hydration Errors (official): https://tanstack.com/start/latest/docs/framework/react/guide/hydration-errors — named causes: Intl (locale/time zone), `Date.now()`, random IDs, responsive-only logic, feature flags, user preferences; fixes: `<ClientOnly>` + fallback, cookie-based client time zone (UTC until set), selective SSR. [HIGH]
- TanStack Start — Selective SSR (official): https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr — `ssr: false`/`'data-only'` render the pendingComponent fallback server-side (content not in SSR HTML → SEO caveat). [HIGH]
- nginx — ngx_http_proxy_module (official): https://nginx.org/en/docs/http/ngx_http_proxy_module.html — responses with `Set-Cookie` are not cached by default; `proxy_ignore_headers Set-Cookie` overrides it (the auth-bleed footgun); `proxy_cache_key`, `proxy_cache_use_stale`, `proxy_cache_background_update`, `proxy_cache_lock`, `proxy_no_cache`/`proxy_cache_bypass`. [HIGH]
- openapi-typescript — repo + issue #1615 "Check/verify functionality for CLI": https://github.com/openapi-ts/openapi-typescript and https://github.com/openapi-ts/openapi-typescript/issues/1615 — no built-in `--check`; CI must regenerate then `git diff --exit-code`. [HIGH]
- GetPageSpeed — NGINX Proxy Cache & Microcaching guide: https://www.getpagespeed.com/server-setup/nginx/nginx-proxy-cache-microcaching — microcache TTL + SWR + cache-lock patterns and the Set-Cookie leak warning. [MEDIUM]
- Project brief `plans/web/briefs/web.md` and `.planning/PROJECT.md` — product contracts (CWV budgets, trust states, cache posture, draft TTL, RBAC, masking, i18n routing). [HIGH, project SoT]

---
*Pitfalls research for: TanStack Start esports replay-stats web app*
*Researched: 2026-06-20*
