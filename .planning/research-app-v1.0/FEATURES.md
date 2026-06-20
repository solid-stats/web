# Feature Research

**Domain:** Public game/esports replay-statistics website + Steam-auth correction/dispute system + moderation/admin/ops interface (SolidGames OCAP/Arma community)
**Researched:** 2026-06-20
**Confidence:** MEDIUM-HIGH

> Scope note: this file does **not** restate the brief. It compares the brief's v1 scope against
> how real comparable products behave (op.gg, Dotabuff/OpenDota/STRATZ, Tracker.gg, Leetify, OCAP
> replay viewers, and esports dispute systems), to sharpen requirements and surface gaps. Each
> feature maps back to a brief requirement group (`APP / STAT / AUTH·REQ / MOD·ADMIN·OPS·RBAC /
> UX / SEO / CI`) or is flagged as a gap the brief under-specifies.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Missing any of these and the product reads as broken or untrustworthy versus op.gg / Dotabuff / Tracker.gg.

| Feature | Why Expected | Complexity | Maps to | Notes |
|---------|--------------|------------|---------|-------|
| **Dense, server-driven stat/leaderboard tables** with sort, filter, cursor paging | Every analog (op.gg leaderboards, Dotabuff/STRATZ tables) is fundamentally a sortable ranked table. Users land expecting to sort by a column and filter to their cohort. | HIGH | STAT-01/02/04/08/14 | 10k–100k rows ⇒ server-side everything + virtualization. Tabular numerals are non-negotiable for scan-ability. |
| **Player profile** = identity header + recent-history + per-mode/rotation aggregates | op.gg, Dotabuff, Leetify, Tracker all anchor on a profile page; it is the single most-visited surface and the primary share target. | MEDIUM | STAT-03 | Brief's mobile order (header → key stats → squad context → tabs) matches op.gg/Leetify convention. Nickname history is an analog gap most sites lack — keep it. |
| **Squad/team profile** with membership + aggregate stats | Team pages are standard in Dota/CS trackers; squad is the social unit of the SolidGames community. | MEDIUM | STAT-04/05 | Membership-over-time timeline is richer than analogs (which mostly show current roster). |
| **Match/replay detail page** with summary + participant roster + per-side outcome | The canonical "what happened in this game" page (Dotabuff/OpenDota match page, OCAP recording). Deep-link target from every list and the main SEO surface. | HIGH | STAT-12, SEO-08 | Must SSR the summary+roster (SEO + LCP); timeline loads progressively. |
| **Progressive event timeline on the match page** (kills, teamkills, key events) | OCAP's core feature is a filterable realtime event log; Dotabuff/OpenDota match pages have combat/event breakdowns. Community already knows the OCAP event model. | HIGH | (Replay Pages §) | Mobile = grouped timeline sections; desktop = dense filterable event table. Progressive load protects LCP. |
| **Scoped search inside a list** (player name, squad name) | Even without global search, users expect to type a name in the relevant table. op.gg's entire entry flow is "search a name." | LOW-MEDIUM | STAT-02/04 | Per-surface, server-side; NOT a global command palette (see anti-features). |
| **Rotation / season filter context** across stat surfaces | Dota's "patch", CS's "season/act" — players compare within a competitive period, not all-time only. Rotation is SolidGames' season analog. | MEDIUM | STAT-06 | Rotation is both a canonical page AND a cross-surface filter — the brief gets this right; analogs usually only do the filter. |
| **Steam OAuth sign-in + visible session state** | Steam login is the universal identity primitive for these communities; users expect "log in with Steam," not email/password. | MEDIUM | AUTH-01/02 | Inline login prompts that return to the original flow (op.gg/Tracker pattern of claiming/linking a profile). |
| **Empty / loading / error / offline / stale states** on every data surface | Mature trackers degrade gracefully; a blank table or spinner-forever reads as "site is down." | MEDIUM | UX-08 | Skeletons must reserve layout (CLS budget). This is a quality gate, not decoration. |
| **Localized dates/times + RU/EN UI** | RU-majority audience; analogs localize. Ops contexts need UTC hint. | MEDIUM | SEO-07, i18n | Brief's `/ru` `/en` + browser-redirect is correct; ICU plurals for "N kills" etc. |
| **Indexable, SSR'd public pages with unique meta** | Trackers get most traffic from search ("<player> stats"). Client-only rendering = no traffic. | MEDIUM | SEO-01..08 | Replay pages especially must be in segmented sitemaps. |

### Differentiators (Competitive Advantage)

These are where Solid Stats beats generic trackers. They align directly with the Core Value ("inspect, filter, **trust**, and correct").

| Feature | Value Proposition | Complexity | Maps to | Notes |
|---------|-------------------|------------|---------|-------|
| **Visible data provenance / freshness on every surface** (last-updated, source replay links, parse status) | Generic trackers hide freshness; Dotabuff only surfaces "may take minutes" in an FAQ. Making last-updated + source-replay first-class is a trust moat for a community replacing Google Forms. | MEDIUM | STAT-15 | Data-observability practice (timestamp + lineage visible to consumer) applied to consumer UI. Pair with SSE freshness signal + explicit stale banner. |
| **Explicit Unknown & Conflict states as first-class, filterable values** | Analogs silently drop or guess missing data (OpenDota: "subject to availability"; Dotabuff guesses roles). Solid Stats instead *shows* unknowns (legacy commander-side outcome) and lets users filter them. Honest > pretty. | MEDIUM | STAT-15, Commander §, Trust § | Requires a tri-state model (known / unknown / conflict) threaded through tables, badges, filters, and aggregates. Design-system already mandates first-class Unknown/Conflict states. |
| **Explainable bounty** — formula breakdown (victim effectiveness + squad effectiveness + rotation context) | Leetify's whole pitch is an *explained* rating; opaque scores breed distrust and dispute volume. Showing *why a kill scored N* preempts disputes and teaches the system. | MEDIUM-HIGH | Bounty §, STAT-08 | Depends on `server-2` exposing component data. "Points, not money" disclaimer must be unmissable. |
| **Explainable squad effectiveness** (inputs surfaced, not an opaque number) | Same trust logic; squad effectiveness feeds bounty, so hiding it compounds opacity. | MEDIUM | Squad § | Surface on both squad and bounty pages. |
| **List → detail → Back continuity** (state, scroll, virtual-row, filters, cache restored, no blocking reload) | The single launch-blocking UX requirement. Generic SPA trackers lose your filtered/scrolled position on Back — a constant low-grade frustration. Nailing this is a felt-quality differentiator. | HIGH | STAT-09/10, UX-09, CI-04/07 | TanStack Router scroll restoration + Query cache preservation. This is *the* hard UX problem of the product. |
| **Guided, event-linked correction requests** (kills/teamkills/identity/remove-player/commander dispute carry replay+event+actor context) | No consumer tracker lets a player *correct* the data with structured, evidence-backed, audited requests. OpenDota only lets you re-parse; it can't dispute a result. This is the product's reason to exist. | HIGH | REQ-01..07, Requests § | Separate guided steppers per type (no generic free-form ticket). Live-updating validation after submit. |
| **Server-backed request drafts** (debounced autosave, SSR-prefetched, 7-day TTL) | Forms that lose work on refresh are abandoned. Drafts as `server-2` resources (not localStorage) survive device switches and SSR-hydrate cleanly. | MEDIUM-HIGH | REQ-05 | Autosave save/saving/error states; conflict behavior is a phase detail. |
| **Immutable audit timeline on requests + reopen of rejected** | Esports dispute systems emphasize *transparency* of the decision trail. An append-only history with all moderator comments visible to requester+staff builds procedural trust; reopen avoids dead-ends. | MEDIUM | MOD-02/03, REQ-07, Request Detail § | Append-only model; comments visible in history (not hidden mod-notes for v1). |
| **Risk-plus-age moderation queue** | Generic ticket queues are FIFO; risk+age prioritization (flag abnormal/high-impact first, age as fairness floor) matches how AI-assisted esports moderation routes disputes. | MEDIUM | MOD-01 | No bulk actions v1 (deliberate — auditable, proportional). |
| **Capability-driven RBAC UI with contextual 403 recovery** | Most admin UIs hard-code role checks and dead-end on 403. Driving UI from roles+capabilities (from session/API) and giving a 403 page *missing-rights context + recovery actions* is an ops-quality differentiator. | MEDIUM | RBAC-01, ADMIN/OPS | UI must hide/disable by capability, never rely on route guard alone. |
| **Ops visibility (ingest conflicts, parser/job failures) with limited audited actions** | Bridges the gap between "pretty public stats" and "the pipeline that produces them." Audited retry/mark-reviewed only where `server-2` supports it. | MEDIUM | OPS-01/02 | Read-mostly; actions gated on explicit backend support + auditability. |

### Anti-Features (Commonly Requested, Often Problematic)

These are deliberately **NOT** built. Several are already out-of-scope in the brief — documented here with the *why* so they don't creep back in.

| Feature | Why Requested | Why Problematic | Alternative (our approach) |
|---------|---------------|-----------------|----------------------------|
| **Marketing/news/landing portal composition** | "A homepage should sell the product." | This is a stats *operations* surface, not a fan/marketing site; portal composition dilutes scan-ability and CWV. | Functional stats overview as the home: tables, rankings, microcharts, entry points. (Brief OoS) |
| **Chart-heavy dashboards / big BI charts** | Charts "look impressive." | Heavy charts hurt LCP/INP/CLS, fight mobile-first density, and obscure the table-first scanning the audience actually wants. | Tables, leaderboards, compact rankings, microcharts only. (Brief Design Direction) |
| **Player/squad/rotation comparison views** | op.gg/Leetify "compare with friends" is popular. | Adds combinatorial UI + URL state + data-fetch surface before the core single-entity experience is even validated; explicitly a v2 surface. | Defer to v2. Single-entity profiles first. (Brief OoS) |
| **Global / command-palette search across the whole product** | "I want one search box for everything." | A cross-entity search index/ranking is its own large subsystem (relevance, typo-tolerance, crawl-trap risk) and not needed when each surface has scoped search. | Per-surface, server-side scoped search only. (Brief OoS) |
| **Light theme / light mode** | "Give users a choice." | Doubles the token surface and visual-QA matrix for zero audience demand; design system is dark-only by decision. | Dark-only. (Brief OoS) |
| **Financial reward / payout UI** | "Bounty sounds like money." | Turning points into money invites fraud, legal, and dispute load wildly out of scope; mis-reading bounty as cash is a real risk. | Points/statistics only, with an unmissable "not money" disclaimer. (Brief OoS) |
| **Annual/yearly nomination pages** | Communities love year-in-review awards. | Separate editorial surface with its own data model and seasonality; would delay v1 core. | v2 surface. (Brief OoS) |
| **Ad monetization / premium-gated stats** | Trackers monetize via ads + premium. | Tracker.gg's ad/premium model generates years of "I paid and still see ads / malicious ads" complaints and erodes the *trust* that is this product's core value. | No ads, no paywall on public stats. Community-funded. |
| **Bulk moderation actions (mass approve/reject)** | "Clear the queue faster." | Bulk decisions undermine the per-request audit trail and invite low-care moderation on a trust-critical system. | Single-request review with required comment + audit timeline; revisit post-v1. (Brief contract) |
| **Final review step in request steppers** | "Let users confirm before submit." | Adds friction to short guided flows; the live-updating post-submit validation already lets users fix errors in place. | Short steppers, submit-then-fix-live validation. (Brief contract) |
| **Auto-merging large SSE recalculations into the open view** | "Always show the freshest data." | Reordering/inserting above the viewport causes CLS and reading disruption — directly violates the CWV budget. | Page-specific merge: small local changes auto-merge w/ notice; large recalcs require explicit "new updates available" confirm. (Brief Realtime) |
| **Client-only rendering of detail pages** | "SPA is simpler." | Kills SEO (no indexable HTML) and LCP for the highest-traffic surfaces (replay/profile). | SSR meaningful HTML first; progressive client hydration for timeline/events. (Brief SEO/CWV) |
| **Public exposure of full SteamID / unmasked identity** | "Verify it's really them." | Privacy/harassment risk; full ID is PII-adjacent for the community. | SteamID masked to last 4 digits; public-safe identity only. (Brief Privacy) |
| **Indexing volatile filter/sort/cursor URL permutations** | "Index everything for SEO." | Creates crawl traps + duplicate content from infinite param combos, wasting crawl budget. | Curated indexable filter/category URLs; canonical/noindex for volatile states. (Brief SEO-06) |
| **Built-in interactive 3D/map replay playback (à la OCAP viewer)** | OCAP's signature is the interactive map playback; community knows it. | Heavy WebGL/canvas player is a large subsystem fighting LCP/bundle budgets and mobile-first density; OCAP already owns playback. | Event *timeline/table* + provenance links out to the OCAP viewer; `web` shows stats, not playback. (Implicit boundary) |

---

## Feature Dependencies

```
[APP foundation: Router + Query + Table + typed API client + SSR]
    └──required by──> EVERYTHING below

[Server-driven dense tables]  (STAT-14)
    └──required by──> [Player list] [Squad list] [Commander stats] [Bounty leaderboards] [Mod queue]
                          └──required by──> [List→detail→Back continuity]  (STAT-10)  ← the hard one
                                                └──requires──> Router scroll restoration + Query cache preservation

[Provenance/freshness/Unknown/Conflict model]  (STAT-15)
    └──threads through──> [all tables] [all profiles] [replay detail] [bounty breakdown]
    └──enhanced by──> [SSE freshness signal]  (STAT-11)

[Replay detail (SSR summary+roster)]  (STAT-12)
    └──required by──> [Progressive event timeline]
                          └──required by──> [Event-linked request entrypoints]

[Steam OAuth + session]  (AUTH-01/02)
    └──required by──> [Request submission]  (REQ-01)
                          └──requires──> [Server-backed drafts]  (REQ-05)
                          └──requires──> [Evidence upload + external links]  (REQ-02)
                          └──requires──> [Guided per-type steppers]  (REQ-04)
                                             └──enhanced by──> [Event-linked context from replay page]

[RBAC (roles+capabilities from session/API)]  (RBAC-01)
    └──required by──> [Mod queue] [Request review] [Role mgmt] [Rotation mgmt] [Ops views] [403 recovery]

[Request submission]  (REQ-01)
    └──required by──> [Moderation queue + review]  (MOD-01/02/03)
                          └──requires──> [Immutable audit timeline] + [reopen]  (REQ-07)

[Bounty explainability]  ──depends on──> server-2 exposing victim/squad/rotation components
[Squad effectiveness explainability]  ──feeds──> [Bounty explainability]

[SSE large-recalc merge]  ──conflicts──> [CLS budget]  → must use confirm-to-merge, never auto
```

### Dependency Notes

- **List→detail→Back continuity requires both Router scroll restoration and Query cache preservation.** It is the launch-blocking UX requirement and the single highest-risk feature; it cannot be retrofitted, so the table/routing/cache architecture must be designed for it from phase one.
- **Event-linked requests require the replay timeline, which requires the SSR'd replay detail.** Request flows that carry replay+event+actor context can only exist after the replay page surfaces those events. Sequence: replay summary → timeline → request entrypoints.
- **All moderation/admin/ops surfaces require RBAC from session/API.** Build the capability model before any gated screen; otherwise screens hard-code roles and the 403-recovery contract is impossible.
- **Bounty/squad explainability depend on `server-2` exposing component data.** If the API only returns a final score, explainability degrades to "Unknown" — a cross-app compatibility check is required before committing the differentiator.
- **SSE large-recalc merge conflicts with the CLS budget.** They are reconciled only by confirm-to-merge UX; auto-merge of large recalcs is an anti-feature.
- **Provenance/Unknown/Conflict is a cross-cutting model, not a screen.** It must be designed into the table cell, badge, filter, and aggregate primitives early, or it becomes a pervasive retrofit.

---

## MVP Definition

### Launch With (v1 — all launch-blocking per brief)

- [ ] **App foundation** (Router/Query/Table/Nano + typed OpenAPI client + SSR + i18n + SSE) — everything depends on it.
- [ ] **Public stats: player & squad lists + profiles** — the most-visited, highest-SEO-value surfaces; launch priority #1.
- [ ] **Server-driven dense tables (sort/filter/cursor/virtualization) at 10k–100k rows** — table stakes for any stats site.
- [ ] **List→detail→Back continuity** — the launch-blocking felt-quality requirement.
- [ ] **Provenance / freshness / Unknown / Conflict presentation** — the core trust differentiator.
- [ ] **Commander-side stats with filterable Unknown outcomes** — launch priority #2.
- [ ] **Bounty leaderboards with explainable formula + "not money" disclaimer** — launch priority #3 + trust differentiator.
- [ ] **Replay detail (SSR summary+roster) + progressive event timeline** — primary SEO/deep-link surface.
- [ ] **Steam OAuth + session** — gate for the request loop.
- [ ] **Guided correction requests (5 types) + server-backed drafts + evidence (image/link) + status/history + reopen** — the product's reason to exist.
- [ ] **Moderation: risk+age queue, request review, approve/reject w/ comment, immutable audit timeline** — closes the correction loop.
- [ ] **Admin: role mgmt, rotation mgmt; Ops: ingest/parser-job visibility + limited audited actions** — launch-blocking ops.
- [ ] **RBAC (roles+capabilities) + contextual 403 recovery.**
- [ ] **Cross-cutting quality gates** (WCAG 2.2 AA, CWV budgets, SEO, Playwright matrix vs seeded `server-2`).

### Add After Validation (v1.x)

- [ ] **On-demand cache purge** on moderation/ingest events — trigger: TTL+SSE staleness proves insufficient in practice.
- [ ] **In-app → richer notifications** — trigger: in-app-only status proves to miss too many requesters.
- [ ] **Bulk-ish moderation aids** (saved filters, queue presets — still per-request decisions) — trigger: queue volume.

### Future Consideration (v2+)

- [ ] **Comparison views** (player/squad/rotation) — defer until single-entity experience is validated.
- [ ] **Global / command-palette search** — defer until per-surface search proves insufficient and an index is justified.
- [ ] **Annual/yearly nomination pages** — separate editorial surface.
- [ ] **CDN / second origin node** — post-v1 SPOF mitigation for the single-region origin.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| App foundation (SSR + TanStack + typed client) | HIGH | HIGH | P1 |
| Server-driven dense tables (10k–100k) | HIGH | HIGH | P1 |
| Player/squad lists + profiles | HIGH | MEDIUM | P1 |
| List→detail→Back continuity | HIGH | HIGH | P1 |
| Provenance/freshness/Unknown/Conflict | HIGH | MEDIUM | P1 |
| Replay detail + progressive timeline | HIGH | HIGH | P1 |
| Steam OAuth + session | HIGH | MEDIUM | P1 |
| Guided requests + drafts + evidence | HIGH | HIGH | P1 |
| Moderation queue + review + audit | HIGH | MEDIUM | P1 |
| Bounty/squad explainability | HIGH | MEDIUM-HIGH | P1 |
| Commander-side stats (Unknown-aware) | MEDIUM-HIGH | MEDIUM | P1 |
| RBAC + 403 recovery | MEDIUM | MEDIUM | P1 |
| Ops visibility (ingest/jobs) | MEDIUM | MEDIUM | P1 |
| SEO (sitemaps, structured data, canonical) | HIGH | MEDIUM | P1 |
| On-demand cache purge | MEDIUM | MEDIUM | P2 |
| Comparison views | MEDIUM | HIGH | P3 |
| Global search | MEDIUM | HIGH | P3 |
| Nomination pages | LOW-MEDIUM | MEDIUM | P3 |

## Competitor Feature Analysis

| Feature | op.gg / Tracker.gg | Dotabuff / OpenDota / STRATZ | OCAP viewer | Our Approach |
|---------|--------------------|------------------------------|-------------|--------------|
| Dense sortable leaderboards | Yes (region/mode) | Yes (heroes/players) | Browse list only | Server-driven, 10k–100k, URL-shareable state |
| Player profile | Yes (core) | Yes (core) | n/a | Profile + nickname history + provenance tabs |
| Match/replay detail | Yes (match report) | Yes (match page, item timelines) | Recording page | SSR summary+roster + progressive event timeline |
| Event timeline | Limited (combat log) | Yes (combat/build, needs parse) | **Yes (filterable realtime log)** | Timeline/table; playback stays in OCAP |
| Data freshness shown | Hidden / FAQ-only | "may take minutes" in FAQ | Realtime during playback | **First-class last-updated + source links** |
| Unknown/missing handling | Silently dropped | "subject to availability"; guessed | Gaps in capture | **Explicit, filterable Unknown/Conflict** |
| User can correct the data | No (re-parse only on OpenDota) | Re-parse request only | No | **Guided, evidence-backed, audited correction requests** |
| Score explainability | Partial (Leetify explains) | Partial | n/a | **Explainable bounty + squad effectiveness** |
| Back-navigation state | Often lost | Often lost | n/a | **Restored (launch-blocking)** |
| Monetization | Ads + premium (complaint-heavy) | Plus/premium | Self-hosted | **None — trust over revenue** |
| Auth | Game/Riot account | Steam | None | Steam OAuth |

## Gaps vs Brief

Where comparing against real products sharpens or surfaces something the brief under-specifies:

1. **Freshness is described as a *state*, but per-surface staleness thresholds are unspecified.** Data-observability practice measures staleness as age vs an expected cadence. The brief should define, per query family, *when* data flips from fresh → stale → "served-stale-on-error" labeling. (Cross-app: depends on `server-2`/SSE cadence.) — *follow-up for STAT-15 + the SSE contract.*
2. **Conflict state has no defined resolution surface.** The brief makes Conflict a first-class badge but doesn't say where/how a conflict is *resolved* (is it a moderation action? an ops view? auto-resolved by `server-2`?). Analogs have no model to borrow; this needs an explicit decision. — *gap for MOD/OPS scope.*
3. **Bounty/squad explainability silently assumes `server-2` returns component breakdowns.** If the API returns only a final score, the differentiator collapses to Unknown. A cross-app compatibility check on the bounty/effectiveness payload is required before phasing this. — *blocking dependency.*
4. **Evidence handling (image upload) lacks a safety model in the brief beyond "moderate limits."** Real correction/dispute systems require identity verification + documentation handling; for user-uploaded images, malware/abuse scanning and safe external-link handling are implied but unspecified. — *follow-up (already flagged in brief's implementation details, restate as a security requirement).*
5. **Notifications are "in-app only for v1" — but the request lifecycle is async (draft → submit → review → decision → reopen).** Players who don't return won't see decisions. Worth an explicit acknowledgment that v1 accepts this and a v1.x trigger to expand. — *minor; documented above.*
6. **Rate-limit / duplicate / cooldown states are required (REQ-06) but the analog comparison shows these are exactly where trust erodes** (Tracker.gg's premium/ad complaints are fundamentally "the system didn't behave as told"). These error states deserve first-class, honest copy — not generic toasts. — *emphasis, not a new requirement.*
7. **No "claim your profile" flow.** Every analog ties a logged-in user to "their" entity (op.gg/Tracker claim). The brief's identity request implies linking, but the explicit *"this profile is me"* binding (used to scope which requests a player may file) isn't spelled out. — *possible gap in AUTH/REQ; confirm with `server-2` identity model.*

## Sources

- [OP.GG — LoL/CS2/PUBG stats, profiles, leaderboards, match history](https://op.gg/) — table-stakes profile/leaderboard/match-history composition; multi-game subdomain pattern. (MEDIUM)
- [Dotabuff — match pages & player profiles, TrueSight parsing, data freshness](https://www.dotabuff.com/pages/faq) and [blog: match page improvements](https://www.dotabuff.com/blog/2016-10-31-big-improvements-to-match-pages-and-player-profiles) — match-detail depth, parse-dependent data, "may take minutes" freshness. (MEDIUM)
- [OpenDota — request a parse](https://www.opendota.com/request) and [odota/core README](https://github.com/odota/core) — user-submitted parse requests, "subject to availability," replay-expiry limits (closest analog to user-driven data correction). (MEDIUM-HIGH)
- [Leetify — explained rating, match reports, benchmarks](https://leetify.com/) and [rating update blog](https://leetify.com/blog/leetify-rating-update/) — explainable-score differentiator; minutes-after-game freshness. (MEDIUM)
- [Tracker.gg — Valorant/LoL/Overwatch trackers](https://tracker.gg/valorant) and [premium/ad complaint forum](https://feedback.tracker.gg/) plus [malicious-ads writeup](https://zerothought.in/tracker-gg/) — ad/premium monetization as an anti-feature and trust-erosion case study. (MEDIUM)
- [OCAP2 — Arma 3 op capture & playback, filterable realtime event log](https://github.com/OCAP2/OCAP/blob/master/README.md) — the community's existing replay/event model; playback boundary (`web` shows stats, OCAP owns playback). (HIGH)
- [Riot Games / WIPO esports dispute resolution](https://competitiveops.riotgames.com/en-US/dispute-resolution-emea) and [esports ADR overview](https://www.arbtech.io/blog/dispute-resolution-in-the-esports-industry) — transparency/audit-trail expectations for dispute workflows. (MEDIUM)
- [AI automation for esports player support / dispute routing](https://converiqo.ai/blog/ai-automation-for-gaming-esports-tournament-management-player-support) — flag-abnormal-and-route-to-admin pattern informing risk+age queue. (LOW-MEDIUM)
- [IBM — stale data](https://www.ibm.com/think/topics/stale-data) and [Sifflet — data freshness](https://www.siffletdata.com/blog/data-freshness) and [DQOps — timeliness/freshness](https://dqops.com/docs/categories-of-data-quality-checks/how-to-detect-timeliness-and-freshness-issues/) — freshness-as-age vs expected-cadence model behind the provenance differentiator and gap #1. (MEDIUM)

---
*Feature research for: public game/esports replay-statistics + correction/moderation product (SolidGames `web`)*
*Researched: 2026-06-20*
