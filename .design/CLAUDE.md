# SolidStats — project notes

## Codebases (GitHub org: `solid-stats`, all default branch `master`)

The product is the **Solid Stats** statistics + moderation site for the **SolidGames** community. Repos in play:

- **`solid-stats/web`** *(private)* — the browser UI / UX we are designing for. TanStack Start + React/TSX, vanilla-extract, Ark UI, Lucide. **This is the design target.** Currently holds only briefs + planning/skills config — no frontend code committed yet.
- **`solid-stats/server-2`** — TypeScript/Fastify backend, PostgreSQL source of truth, APIs, Steam OAuth, moderation, aggregate/bounty calc. Publishes `openapi/server-2.openapi.json`.
- **`solid-stats/replay-parser-2`** — Rust OCAP parser → normalized events + aggregates. Has `schemas/` (parse-artifact / parse-result / parse-job JSON Schemas).
- **`solid-stats/replays-fetcher`** — replay discovery → S3 `raw/` + ingest staging.
- **`solid-stats/infrastructure`** — deployment / infra.
- **`solid-stats/plans`** — central planning repo; app briefs live here (`plans/web/briefs/`, `plans/product/`).
- **`solid-stats/skills`** — shared agent skills.

> Note (2026-06-11): the user said the data I pulled from `server-2`/`replay-parser-2` to reconcile the Stats Overview was **not correct** — do NOT treat the OpenAPI contract as authoritative for the mock data without confirming with the user first. The `Stats Overview` hi-fi was reverted to its prior state.

---

## External rule sources (binding references for review — added 2026-06-16 by user)

Use these as standing checklists when designing or reviewing ANY Solid Stats surface.

- **checklist.design** — https://www.checklist.design/ — per-component / per-flow UX
  checklists (table, navigation, searchbar, skeleton, modal, tabs, empty/loading
  states, responsiveness, dark mode). Run the relevant component checklist before
  calling a surface done.
- **Selectel / Daria Hutoryanskaya handoff checklist** —
  https://habr.com/ru/companies/selectel/articles/786008/ and its Notion template
  https://hutoryanskaya.notion.site/469807f09e0441d883558e5fc5814d043 (same author).
  The spine of pre-handoff review:
  1. **CRUD + object map** — every object's create/read/update/delete (+ special
     ops) is accounted for.
  2. **Data volume states (×4)** — design *empty / few / many / limit-reached* for
     every list, table, and field (long values truncate+tooltip or wrap; never clip).
  3. **Scenario endings (×5)** — success / error (system vs user) / loading /
     onboarding / empty-state.
  4. **Cross-feature impact** — how this surface's changes ripple into other screens.
  5. **Role model** — how the surface differs by signed-out / player / moderator / admin.
  6. **Component states** — enabled / hover / pressed / focused / activated+selected /
     disabled / loading for every atom; define click zone (whole row > text), and
     fixed-vs-fluid sizing.
  7. **Responsiveness** — explicit behaviour at every target breakpoint, not "described in words".

---

## Design rules & review checklist (binding — apply to EVERY page, every chat)

These were learned the hard way on the Player profile. Read them before designing or
editing any Solid Stats surface. They are the contract; the user can edit them.

> **Maintenance:** keep this doc actively updated. When the user establishes a new rule,
> corrects a recurring mistake, ratifies a decision, or changes direction, write it here
> (concise, imperative) rather than relying on chat memory — other chats only see this
> file. Date project-state notes; keep evergreen rules undated. Prune what's obsolete.

### Process — before writing code
1. **State the composition and the priority order out loud first**, then build. Do not
   pattern-match a comment to the smallest local patch — a fix that creates two new
   problems is a failure, even if it closes the one that was raised.
2. **Verify at the REAL width before saying "done".** The app previews inside device
   frames, so the iframe viewport ≠ content width and viewport media queries lie. For
   mobile, simulate the actual phone column (`.container{max-width:390px}`) and look.
   Most regressions (label collisions, orphan tiles, gutters) are visible in one glance
   at 390px and were missed only because I checked the wrong width.
3. Layout that adapts must key off the **container / parent context**, not the viewport
   (e.g. `.m-pf .pf-hero`, `.match-wrap .match-row`), because of the device-frame trap.
   Concretely: set `container-type: inline-size` on `.container` and use `@container`
   (not `@media`) for breakpoints — the tablet frame is 834px wide but the iframe
   viewport is wider, so viewport media queries silently never fire inside the frame.

### Layout / composition
4. **Never force two big mismatched-height columns side by side** — that is THE source
   of "air"/trailing-gap bugs. Lay pages as **full-width stacked sections**; only put
   things side by side when they are **equal by nature** (e.g. Score|K/D hero tiles, the
   two arsenal tables). Reference data that doesn't fill a column goes into a multi-column
   card, not a near-empty full-width strip.
5. **Section order follows information priority** (below). The headline data sits high,
   right after identity + the top stats — never buried at the bottom.
6. Tables scroll inside their own card; never spill onto a neighbour.
7. **Design the overflow / edge state, not just the happy path.** Every list must answer
   "what at 200 rows? at 0?". Pattern: long lists keep ALL entries but cap a **visible
   window and scroll** inside it (sticky header for tables), with the **total count in
   the label/caption** (`История ников · 15`, `по убийствам · 200`). Side-by-side tables
   reserve **fixed row slots** (faint placeholders when short) so they stay equal height
   for any data. Provide a **Tweaks → Data: typical / heavy** toggle so edge states are
   demonstrable, not hypothetical. Verify long text doesn't clip in the narrowest column
   (stack label-over-value there).

### Stat priority & meaning (player-facing)
7. Headline = **how the player performed over recent WEEKS** (not rotations).
8. Metric priority order: **Счёт → K/D → games → kills → TK → deaths → deaths-from-TK**,
   then bounty. Score and K/D are the two hero tiles; the rest are an even mini-stat grid
   (no orphan tiles — keep the count even for the column count).
9. **Formulas (exact):** `Счёт = (kills − TK) ÷ (games + deaths-from-TK)`;
   `K/D = (kills − TK) ÷ (deaths + deaths-from-TK)`. Mock numbers must be internally
   consistent with these.
10. **Tier levels (ниже / норма / хорошо / отлично) are population-derived**, computed
    from all players for the active period (rotation / all-time), held in `SS_BASELINE`
    so a backend can fill them. Do NOT hardcode fixed tier cutoffs. Show the level name +
    its entry threshold per zone (e.g. `≥2.4 ХОРОШО`); never cram 4 words into a narrow
    tile. Score reaches "отлично" in the sample; K/D tops out at "хорошо".

### Voice / DS (see the design-system skill for the full spec)
11. Dark-only gunmetal; cyan = the single interactive accent; Lucide icons only; tabular
    mono for all numbers; **never color-alone** (pair with icon/label). RU + EN, every
    string i18n-keyed — and **sanity-check the RU**: no clipped/●slipping labels, natural
    wording (the user has flagged awkward RU before).
12. **Data trust is systemic, not a transient badge.** Trust is built by always-present
    provenance — every number traceable to source replays (week → per-game → replay),
    transparent formulas, freshness ("updated 4 min ago"), and honest aggregate
    Known/Unknown/Conflict states about the DATA itself. Do NOT dress up a rare,
    short-lived workflow event as "the trust layer." A pending SteamID merge is a
    **workflow footnote**: render it as a **quiet inline row inside the SteamID list**
    it describes (amber "на проверке" + request link), never a filled banner and never a
    box pinned to the bottom of a stretched column (that floats). The editable per-request
    list (identity / kills / TK / commander disputes, many types & statuses) lives on a
    separate authenticated surface (My requests for the author; moderation queue for
    staff), not on the public profile.
13. **No nested scroll on mobile** — the page already scrolls. Capped windows that scroll
    inside a card are desktop-only; on mobile use top-N + a "show all · N" expander, and
    drop secondary table columns (e.g. max-dist) so tables fit the phone width with no
    horizontal scroll.
14. **Data-trust = what the backend can actually back (verified 2026-06-14 vs server-2 / replay-parser-2).**
    SHIPPED on the profile: **A** a provenance line under the headline stats
    (`посчитано из N реплеев · <freshness> · Как считается`) and **C** a live freshness
    pill with the DS vocabulary (`Актуально / Данные устаревают / Связь потеряна /
    Переподключение`). Both are FREE — `GET /stats/players/:id` already returns
    `provenance.lastUpdatedAt` + `stats.replayCount`; freshness state is a client/connection
    concern. Caveat: `lastUpdatedAt = max(recompute, identity-edit)` and `replayCount` =
    INCLUDED replays only. Do NOT build the per-player coverage/conflict panel (sketch "B"):
    **B1** (N of a player's replays unparsed/failed) and **B2** (per-event Conflict) are
    NOT in the data model — an unparsed replay has no extracted roster, so "whose games"
    is structurally unknowable; conflict has no per-player key today. **B3** "N of M" needs
    the same missing table; the free half ("computed from N replays") is already A. A real,
    free `Unknown` that DOES exist: `commander_side_stats.unknown_outcomes` — that's what
    backs the КС card's "2 legacy games have no recorded side outcome". Revisit B only if
    prod actually drops/queues games at a player-visible rate (then B1+B3 are one project).

### Player profile specifics (reference implementation: `hifi/player.jsx` + `player.css`)
- Player nick == sg.zone profile slug → link `https://sg.zone/profile/<nick>`.
- Weekly rows expand to per-game match rows (replay # · map · side · result · K-D · score).
- Don't reintroduce: a bounty card (bounty is a mini-stat), a full-width KS strip, a
  "rank/rotation N" line with no context, or the canonical/SO badge (removed as noise).

### Players list specifics (reference implementation: `hifi/players.jsx` + `players.css` + `data-players.js`)
- The list is the "View all" target of the Overview Top-players card and the breadcrumb
  root of the profile. Keep all three pages synced: same Shell (`active="players"`),
  tier system (`tiers.js`), freshness/provenance, i18n, and Tweaks
  (device/lang/dataset/fresh/signedIn).
- **Period drives the VOLUME, and volume drives the loading model** (confirmed w/ user
  2026-06-15, all-time ≈ **2040** players):
  - **Rotation** = the active cohort (hundreds; `dataset` typical≈160 / heavy≈420). SSR /
    cached → **instant, no loader.**
  - **Всё время** = the full ~2040-player community the backend must aggregate → a real
    async wait. It's a **cached materialized aggregate** (recomputed on a schedule — hence
    the freshness pill), so:
    – **landing on all-time first** (deep link / refresh; period is URL-hash-driven):
      cache warm → SSR returns it pre-rendered, **instant, no skeleton**, same as a
      rotation. Cache cold (mid-recompute) → shell + header + **skeleton** stream
      immediately and fill when ready ("Пересчитываем агрегат…").
    – **in-session switch** to all-time → a brief client fetch of the cached aggregate
      (short skeleton, ~700ms).
    Demo via Tweaks → All-time aggregate: warm / cold. Show a skeleton (same colgroup +
    header + reserved height, CLS≈0) for any wait; switching rotations is always instant.
  - **No pagination / infinite-scroll** (legacy has none, and it exists only to mask slow
    loads — moot under SSR). Desktop instead **virtualizes** the row window (only visible
    rows +overscan in the DOM) inside the capped sticky-header scroll card, so 2040 rows
    stay a light DOM. Mobile = top-20 + incremental "show more · N" (never dumps 2040).
- **Data is single-sourced & synced:** `SS_ROSTER.allTime` includes the 10 Overview
  players VERBATIM (same nick/squad/kills/games/score/spark) at the top, plus a
  deterministic generated tail down to **negative Score / K-D** (more TK than kills, like
  the live site). Deaths scale with games; Score & K/D use the canonical formulas +
  population tiers. Vasiliy stays #1 everywhere — never let a generated player outscore
  the real Overview leaders.
- Columns follow metric priority: Игрок → Игры → Убийства → ТК → Смерти → K/D → Счёт
  (Счёт + K/D are tier-colored with pips; rest neutral mono). Trend widens with width
  (4→10 weeks); tablet keeps every column (don't drop data when there's room).
- Period selector = a single dropdown (Ротация N … / Всё время), **default = active
  rotation** (synced with the Overview's "View all"). It drives the tier baseline via
  `SS_BASELINE.by[period]` — pass `baseline` explicitly to tier calls; don't mutate the
  global. **No "last 4 weeks" option here** — that window is a SQUAD-stats mechanic (see
  below), not the player list.
- Rows are **uniform** — no per-row background tints (an early "synced" cyan highlight was
  removed as meaningless to the user; all rows come from one source in prod).

### Squad stats (future page — not built yet; legacy semantics captured 2026-06-15)
- The "last 4 weeks" toggle belongs to **squad statistics only**. It is a window you can
  enable on top of ANY selected rotation (not just the latest), i.e. "last 4 weeks of
  rotation N".
- Squad stats "за всё время" actually always shows the **last 4 weeks**, not true
  all-time. Don't replicate that quirk onto player/overview surfaces.
