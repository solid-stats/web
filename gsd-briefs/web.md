# web - GSD New Project Brief

**Created:** 2026-04-24  
**Intended command:** `$gsd-new-project --auto @gsd-briefs/web.md`  
**Application:** `web`

This document initializes the Solid Stats frontend application only. It is one part of the product alongside `replays-fetcher`, `server-2`, and `replay-parser-2`.

## Product Context

Solid Stats is a public SolidGames statistics website and moderation interface. It replaces Google Forms and file-based stat browsing with a polished mobile-first web app for stats, profiles, requests, moderation, and admin workflows.

`web` owns the browser UI and user experience. It consumes APIs from `server-2`. It does not parse replay files directly, crawl replay sources, or own PostgreSQL/RabbitMQ/S3 infrastructure.

## Product-Wide GSD Workflow

Development across `replays-fetcher`, `replay-parser-2`, `server-2`, and `web` uses AI agents plus GSD workflow only.

The following standards apply product-wide:

- Keep README and planning docs current when scope, commands, architecture, validation data, or workflow changes.
- End completed work with a clean git tree by committing intended results; do not delete completed work just to make status clean.
- Push back on requests that conflict with architecture, current logic, quality, maintainability, or proportional scope; explain the risk and propose safer alternatives.
- Check cross-application compatibility before execution.

Compatibility checks are risk-based:

- Local-only changes can rely on local planning docs, AGENTS rules, and these `gsd-briefs`.
- Parser contract, ingest staging/source identity, RabbitMQ/S3 message, artifact shape, API/data model, canonical identity, auth, moderation, or UI-visible behavior changes require checking adjacent app docs/repos when available.
- If evidence is missing or contradictory, ask the user before proceeding.

## Core Value

Make SolidGames statistics easy to inspect, filter, trust, and correct through a fast public website and clear request/moderation flows.

## Product Quality Bar

`web` must feel instant, stable, and trustworthy before it feels decorative.

Priority order:

1. UX speed and continuity.
2. Accessibility.
3. SEO.
4. Core Web Vitals and bundle budgets.
5. Visual polish.

The main experience must preserve user context across navigation. A public visitor can open a stats/catalog view, scroll deep into a table, apply filters or sorting, open a detail page, press Back, and immediately return to the same table state and scroll position without a blocking reload or visible jump.

This quality bar applies to public stats pages first, then authenticated player flows, then moderator/admin workflows.

## Design Direction

- Brand/product name: Solid Stats.
- Visual direction: mobile-first esports ops.
- The site is a functional statistics product, not a marketing landing page.
- Prioritize dense but readable data, fast filtering, strong profiles, clear request flows, and efficient moderator/admin screens.
- Use a polished gaming/esports feel without sacrificing readability or accessibility.
- Public stats are available without login.
- Steam login is required for requests and account-specific pages.
- UI must support Russian and English from the start.
- The UI should be simple, beautiful, and laconic.
- Prefer dense but readable operational interfaces over marketing-heavy composition.
- Avoid decorative UI that harms scanability, table usability, accessibility, or Core Web Vitals.
- Do not use emoji as structural icons; use one consistent SVG icon family such as Lucide or an equivalent.
- Avoid nested cards, card-heavy decorative sections, one-note color palettes, and ornamental gradients/blobs.
- Use stable dimensions for tables, cards, media, skeletons, filters, toolbars, and controls.

## Frontend Stack

- TanStack-first React/TSX architecture.
- Prefer TanStack Start if the project needs an integrated full-stack/rendering framework; otherwise use TanStack Router plus the minimum server/rendering layer required by the chosen build setup.
- TanStack Router for URL-first navigation, route-level code splitting, preloading, and scroll restoration.
- TanStack Query for server-state caching, prefetching, stale-while-revalidate behavior, optimistic reads where safe, and avoiding blocking reloads on back navigation.
- TanStack Table for table state, sorting, filtering, pagination/cursor handling, and virtualization where row counts require it.
- Nano Stores only for lightweight client state that does not belong in the URL, router state, or TanStack Query cache.
- vanilla-extract for styling and design tokens unless a later phase documents a stronger alternative.
- `openapi-typescript` for generated API types from the `server-2` OpenAPI schema.

## Rendering, Caching, and Realtime Strategy

- SEO-important public pages must return meaningful HTML before client JavaScript runs.
- Use SSR, streaming, SSG, or ISR-style regeneration according to data freshness and framework support.
- Public detail pages should be renderable and indexable without relying on client-only fetching.
- Route-level bundles must split heavy catalog, table, detail, moderation, and admin code.
- Static assets should use long-lived immutable caching when content-hashed.
- Data fetching should use explicit cache lifetimes and stale policies per query type.
- List/detail navigation should prefetch detail data when likely and preserve list data in cache on return.
- Real-time updates should use SSE by default.
- WebSocket is reserved for flows where the client must send live messages to the server.
- SSE updates must not reorder or insert content above the current viewport in a way that causes layout shift.
- When live data changes while the user is reading a table, prefer a "new updates available" affordance or controlled merge over unexpected viewport movement.
- Reconnect, offline, timeout, and stale-data states must be visible, accessible, and testable.

## Users

### Public Visitor

- Views public stats without login.
- Searches players and squads.
- Opens player/squad/rotation/commander/bounty pages.

### Player

- Logs in through Steam OAuth via `server-2`.
- Submits correction/identity requests.
- Uploads evidence attachments.
- Tracks request status and moderator decisions.

### Moderator

- Reviews request queue.
- Opens request details, evidence, linked entities, and audit context.
- Approves/rejects with a comment.
- Manually fills old commander-side winner data when needed.

### Admin

- Manages moderator/admin roles.
- Manages rotations.
- Reviews parse job/failure status where exposed by `server-2`.

## v1 Scope

### Public Pages

- Stats overview.
- Player list with search/filtering.
- Player profile.
- Squad list with search/filtering.
- Squad profile.
- Rotation pages or rotation filter views.
- Commander-side stats.
- Bounty stats/leaderboards.

### Authenticated Player Pages

- Steam OAuth login/session UI.
- Request submission.
- Evidence attachment upload.
- Request status/history.

### Moderator/Admin Pages

- Request queue.
- Request detail/review.
- Request approval/rejection with comment.
- Admin role management.
- Admin rotation management.
- Ingest conflict/status and parser/job failure visibility if API is available.

### Critical Navigation Journey

This journey is a launch-blocking UX requirement:

1. User opens a public stats/catalog table.
2. User applies filters, sorting, search, and/or pagination/cursor state.
3. User scrolls deep into the result set.
4. User opens a detail page.
5. User presses browser Back.
6. The original table state, scroll position, virtualized row position, filters, sorting, search, and cached data are restored immediately.
7. No blocking reload, loading flash, hydration mismatch, console error, or layout shift is allowed.

### Out of Scope

- Rust parser implementation.
- Replay source crawling or ingest implementation.
- Backend API implementation.
- PostgreSQL/RabbitMQ/S3 infrastructure.
- Google Forms.
- Financial reward/payment UI.
- Supporting replay upload UX beyond the API-backed flows explicitly required by `server-2`.
- Annual/yearly nomination statistics and nomination pages; these are a separate v2 product surface.
- Full marketing/news portal unless later added.

## UX Requirements

### Mobile-First

- Mobile is the primary target.
- Public stats must be usable on phone screens.
- Dense tables need mobile-specific layouts such as compact rows, sticky context, filters, or responsive detail views.
- Desktop must still support large tables and moderator productivity.

### Accessibility

- Target WCAG 2.2 AA minimum, with AAA-quality behavior where practical.
- Visible focus states for all interactive controls.
- Keyboard navigation for menus, forms, dialogs, tabs, tables, filters, pagination, and moderation actions.
- No keyboard traps.
- Focus must not be hidden by sticky headers, toolbars, or fixed panels.
- Provide skip links and semantic landmarks.
- Use a logical heading hierarchy with one meaningful page H1.
- Sufficient color contrast: 4.5:1 for normal text, 3:1 for large text and UI graphics.
- Do not convey meaning by color alone.
- No icon-only buttons without accessible names; tooltips are not a substitute for accessible names.
- Form fields have visible labels, helper text where needed, and associated errors.
- Errors appear near fields, are announced accessibly, and include recovery guidance.
- Dynamic updates, upload/progress states, reconnect states, and async errors use appropriate live-region behavior without stealing focus.
- Route changes should manage focus for screen reader users.
- Table sort/filter state must be announced correctly.
- Touch targets should be at least 44x44 CSS pixels for primary controls where layout allows, and never below WCAG 2.2 minimum target-size requirements.

### Performance

- Use route-level splitting where useful.
- Use TanStack Query caching for stats.
- Avoid blocking public pages on unnecessary authenticated data.
- Keep filtering/searching responsive.
- Use skeleton/loading states for stats and request pages.
- Preserve list/table state, query cache, and scroll position across list-to-detail-to-back navigation.
- Virtualize large lists/tables where needed, while keeping keyboard navigation and screen reader behavior usable.
- Keep interaction handlers short; defer non-critical work so INP remains within budget.
- Reserve space for all async content to prevent layout shift.
- Avoid client-only rendering for SEO-critical content.
- Skeletons must reserve final layout space and avoid CLS.
- Filtering and searching should use debouncing or transitions where needed.
- CPU-heavy transforms should move off the main thread or be chunked when datasets require it.

### Core Web Vitals

- LCP must be 2.5s or lower at the 75th percentile target.
- INP must be 200ms or lower at the 75th percentile target.
- CLS should be 0.02 or lower and must not exceed 0.05 for critical journeys.
- No image, media, table, skeleton, font, hydration, or SSE update may cause avoidable layout shift.
- LCP content should be in initial HTML and should not wait for client-side fetches.
- Critical fonts and images should be loaded deliberately; avoid unnecessary preload usage.
- Animations must use transform/opacity and respect `prefers-reduced-motion`.
- Third-party scripts are blocked by default unless a phase explicitly justifies them.
- Bundle budgets must be defined and enforced in CI.

### SEO

- Public indexable pages need unique title tags and meta descriptions.
- Use canonical URLs for indexable pages.
- Provide sitemap and robots configuration.
- Use structured data where applicable, including `VideoGame`, `BreadcrumbList`, and `ItemList` when the page content supports it.
- Detail pages must have server-rendered meaningful content.
- Avoid creating crawl traps from volatile filter/search combinations.
- Non-indexable dynamic states should use explicit noindex/canonical strategy.
- Descriptive link text is required; avoid generic "read more" style links.
- Important pages must not depend on authenticated data for public rendering.

### Internationalization

- Russian and English required from the start.
- UI strings should not be hardcoded directly in components without an i18n path.
- Default can be Russian unless user/browser preference indicates otherwise.

## Key Screens

### Stats Overview

- Shows current/high-level stats.
- Entry points to players, squads, rotations, commander stats, and bounty stats.
- Public and fast.

### Player Profile

- Current display name.
- Nickname history.
- Steam/account link state where public-safe.
- Current/previous squad history.
- Rotation stats.
- Bounty-related stats.
- Links to relevant replays or stat details where API supports them.

### Squad Profile

- Current/known squad identity.
- Historical membership view where available.
- Squad rotation stats.
- Squad effectiveness inputs relevant to bounty scoring.

### Commander-Side Stats

- Commander-side games.
- Wins/losses where known.
- Unknown outcomes for legacy data.
- Filters by rotation/player/side where API supports it.

### Bounty Stats

- Per-rotation bounty leaderboards.
- Enemy-kill based points.
- Clear distinction that this is points/statistics only, not money.
- Ideally show why a kill was valuable: victim player effectiveness component plus squad effectiveness component when API provides it.

### Request Submission

- User chooses request type.
- User links relevant player/replay/squad/stat where possible.
- User writes description.
- User uploads evidence attachments.
- Form validates and shows upload/submit progress.
- Success state clearly shows created request and next step.

### Moderator Request Queue

- Filter by status/type/date.
- Shows requester, request type, affected entity, age, and priority/status.
- Mobile usable, desktop efficient.

### Request Detail

- Shows submitted text, attachments, linked entities, current stats/context, and audit history.
- Moderator can approve/reject with required comment.
- Approved corrections should make clear that `server-2` will recalculate aggregates.

## API Assumptions

`web` consumes `server-2` APIs for:

- Public stats.
- Player/squad/rotation/commander/bounty data.
- Steam OAuth/session.
- Request creation/status.
- Attachment upload.
- Moderator actions.
- Admin roles.
- Admin rotations.
- Ingest staging/conflict status where exposed by `server-2`.
- Job/failure visibility.

`web` must use `openapi-typescript` (https://github.com/openapi-ts/openapi-typescript) to generate TypeScript API types from the `server-2` OpenAPI 3.x schema. The generated types are the default source of truth for frontend API request/response typing.

Type safety rules:

- `server-2` owns the OpenAPI schema and keeps it versioned with API changes.
- `web` regenerates types when the OpenAPI schema changes and does not hand-write duplicate API DTO types.
- Generated API types should be used by API clients, TanStack Query hooks, request forms, moderation/admin screens, and public stats views.
- TypeScript should enable `noUncheckedIndexedAccess` for stricter generated-type safety.

## Suggested Requirements

### App Foundation

- **APP-01**: React/TSX project is configured with TanStack Router.
- **APP-02**: TanStack Query is configured for API data fetching and caching.
- **APP-03**: TanStack Table is configured for table state, sorting, filtering, pagination/cursor behavior, and virtualization where needed.
- **APP-04**: Nano Stores is configured only for lightweight client state that does not belong in URL/router/query state.
- **APP-05**: vanilla-extract is configured for styling and design tokens.
- **APP-06**: Rendering strategy supports meaningful server-rendered HTML for SEO-critical public pages.
- **APP-07**: Route-level code splitting and preloading are configured for public catalog/detail flows.
- **APP-08**: SSE infrastructure exists for real-time server-to-client updates.
- **APP-09**: WebSocket is not introduced unless a documented flow requires client-to-server live messaging.
- **APP-10**: RU+EN i18n foundation exists.
- **APP-11**: `openapi-typescript` is configured to generate API types from the `server-2` OpenAPI schema.
- **APP-12**: Frontend API clients and TanStack Query usage consume generated API types instead of duplicated hand-written DTO types.

### Public Stats

- **STAT-01**: Public visitor can view stats overview without login.
- **STAT-02**: Public visitor can search/filter players.
- **STAT-03**: Public visitor can open player profile.
- **STAT-04**: Public visitor can search/filter squads.
- **STAT-05**: Public visitor can open squad profile.
- **STAT-06**: Public visitor can view rotation-filtered stats.
- **STAT-07**: Public visitor can view commander-side stats.
- **STAT-08**: Public visitor can view bounty stats.
- **STAT-09**: Public stats list/table state is encoded in URL where shareable and restored from navigation/session state where ephemeral.
- **STAT-10**: Opening a detail page and pressing Back restores the previous list/table state, scroll position, virtualized row position, and cached data without a blocking reload.
- **STAT-11**: Real-time SSE updates can arrive while the user is on a stats list without causing CLS or unexpected viewport movement.

### Authenticated Player UX

- **AUTH-01**: User can start Steam OAuth login.
- **AUTH-02**: App reflects logged-in/logged-out session state.
- **REQ-01**: Logged-in player can submit correction/identity request.
- **REQ-02**: Request form supports evidence attachment upload.
- **REQ-03**: Player can view request status and decision.

### Moderation/Admin

- **MOD-01**: Moderator can view request queue.
- **MOD-02**: Moderator can review request detail and attachments.
- **MOD-03**: Moderator can approve/reject with comment.
- **ADMIN-01**: Admin can manage roles.
- **ADMIN-02**: Admin can manage rotations.
- **OPS-01**: Admin/moderator can view ingest conflicts/status and parser/job failures if API supports it.

### UX Quality

- **UX-01**: Mobile layouts are first-class for public stats.
- **UX-02**: Desktop layouts support efficient table-heavy workflows.
- **UX-03**: Forms have visible labels, inline validation, loading, success, and error states.
- **UX-04**: Interactive elements are keyboard accessible.
- **UX-05**: UI uses accessible contrast and focus states.
- **UX-06**: Route changes manage focus correctly for screen reader users.
- **UX-07**: Reduced-motion users do not receive non-essential animation.
- **UX-08**: Loading, empty, error, offline, reconnecting, and stale-data states are designed and implemented for critical screens.
- **UX-09**: No critical journey has avoidable CLS.
- **UX-10**: The visual system is simple, laconic, responsive, and operational rather than marketing-heavy.

### SEO and Metadata

- **SEO-01**: Public pages have unique titles and meta descriptions.
- **SEO-02**: Public detail pages render meaningful HTML before client JavaScript.
- **SEO-03**: Canonical URLs are defined for indexable pages.
- **SEO-04**: Sitemap and robots configuration exist.
- **SEO-05**: Structured data is added where content supports it.
- **SEO-06**: Filter/search URLs do not create crawl traps.

### CI, Playwright, and Quality Gates

- **CI-01**: Playwright is configured and required in CI.
- **CI-02**: Critical journeys are covered by Playwright before launch.
- **CI-03**: Browser matrix includes Chromium, Firefox, WebKit, mobile Chrome-like viewport, mobile Safari/WebKit viewport, reduced-motion mode, and high-contrast or forced-colors checks where feasible.
- **CI-04**: Playwright covers catalog render, search/filter/sort, list-to-detail-to-back restoration, query-cache preservation, SSE update behavior, loading/error states, keyboard navigation, and responsive smoke flows.
- **CI-05**: Accessibility checks run in Playwright with axe or an equivalent tool; serious and critical violations block merge.
- **CI-06**: Console errors during critical journeys block merge.
- **CI-07**: Scroll restoration, cache restoration, and CLS regressions block merge.
- **CI-08**: Lighthouse or equivalent budgets for performance, accessibility, and SEO block merge for critical pages.
- **CI-09**: Bundle budgets block merge when exceeded.
- **CI-10**: Smoke screenshot regression tests cover key desktop and mobile states without turning every minor visual change into a high-maintenance full visual gate.

## Suggested GSD Initialization Settings

- Granularity: Standard.
- Execution: Parallel where possible.
- Git tracking: Yes.
- Research: Yes.
- Plan Check: Yes.
- Verifier: Yes.
- Model profile: Balanced or Quality.

## Key Decisions

| Decision | Outcome |
|----------|---------|
| Product name | Solid Stats |
| Frontend stack | TanStack-first React + TSX |
| Router | TanStack Router |
| Data fetching | TanStack Query |
| Tables | TanStack Table |
| Rendering | Meaningful SSR/SSG/streaming for SEO-critical public pages |
| Realtime | SSE by default; WebSocket only for required client-to-server live messaging |
| API typing | `openapi-typescript` generated from the `server-2` OpenAPI schema |
| Client state | Nano Stores |
| Styling | vanilla-extract |
| Auth source | Steam OAuth through `server-2` |
| Public stats | Visible without login |
| Languages | Russian and English |
| Design direction | Mobile-first esports ops |
| Quality priority | UX continuity, then accessibility, then SEO |
| CI gate | Playwright critical journeys, axe, Lighthouse/budgets, bundle budgets, smoke screenshots |
| Parser ownership | `replay-parser-2` |
| Ingest ownership | `replays-fetcher` through `server-2` APIs only |
| Backend ownership | `server-2` |

## Follow-Up Details for Implementation Phases

- Exact visual identity tokens: palette, typography, spacing, component density.
- Exact i18n library.
- Whether to use TanStack Start or TanStack Router with another rendering/build layer.
- Exact OpenAPI schema URL/path, `openapi-typescript` generation command, output path, and stale-generated-types CI check.
- Exact mobile table patterns after API payloads are known.
- Whether replay ingest/job views are admin-only in v1 or deferred.
- Exact cache lifetimes and invalidation rules per query family.
- Exact SSE event contract, reconnect policy, and live-update merge behavior.
- Exact Playwright CI runtime budget and whether full browser matrix runs on every PR or some checks run on scheduled/nightly jobs.
