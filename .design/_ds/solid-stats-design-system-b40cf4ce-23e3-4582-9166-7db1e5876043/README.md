# Solid Stats — Design System

> Tactical operations terminal for **SolidGames** statistics. Dense, dark-first,
> mobile-first esports-ops UI for a public stats site and moderation backoffice.

This repository is the brand + UI design system for **Solid Stats**, the public
statistics and moderation product for the **SolidGames** community. Use it to
generate on-brand interfaces, mocks, and assets — for production or throwaway
prototypes.

---

## 1. Product Context

**SolidGames** is a tactical milsim community whose matches are recorded as **OCAP
JSON** replays (Operation Capture & Playback — the Arma-style mission recorder;
OCAP files carry `entities`, `events`, `missionName`, `worldName`, `Markers`,
etc.). **Solid Stats** replaces an old Google-Forms + file-browsing workflow with
a polished web app for inspecting, filtering, trusting, and **correcting** those
derived statistics.

The product is four applications. Only one has a UI:

| App | Role | Has UI? |
|-----|------|---------|
| **`web`** | Public stats site + player/moderator/admin interface (TanStack Start + React/TSX, vanilla-extract, Ark UI, Lucide icons) | **Yes — this is the design system's target** |
| `server-2` | Source of truth: Fastify API, PostgreSQL, Steam OAuth, roles, moderation, bounty/aggregate calc | No |
| `replay-parser-2` | Rust OCAP parser → normalized events + aggregates | No |
| `replays-fetcher` | Discovers replay files → S3 `raw/` + ingest staging | No |

### What the product tracks
Players (with **nickname history** & multiple SteamIDs under one *canonical
player*), **squads** (with membership timelines), **rotations** (admin-defined
date periods), **commander-side stats** ("KS" = commander of a side, win/loss/**unknown**
for legacy data), per-replay **kills / teamkills / deaths / K-D / vehicle kills**,
and **bounty points** (per-rotation points for valid enemy kills, weighted by the
victim's individual + squad effectiveness in the *previous* rotation — points, never money).

### Primary surfaces (`web`)
Public (no login): Stats Overview · Player list/profile · Squad list/profile ·
Rotation pages · Commander-side stats · Bounty leaderboards · Replay detail.
Authenticated (Steam OAuth): correction-request flows (identity, add/remove kills,
add/remove teamkills, remove player from replay, commander dispute) with draft
autosave + evidence upload. Staff: moderator request queue/detail (approve/reject
with comment, immutable audit timeline), admin role + rotation management, ops/job
visibility.

### Hard product constraints that shape the design
- **Mobile-first.** Dense tables get phone-specific compact layouts; desktop keeps
  full productivity tables with a density toggle.
- **Dark-only.** A single gunmetal-ink theme — no light mode.
- **RU + EN** from the start → **all type must carry Cyrillic.**
- **WCAG 2.2 AA** minimum (4.5:1 text, 3:1 large/UI), visible focus, ≥44px touch
  targets, never color-alone meaning.
- **Functional, not marketing.** Tables/rankings/microcharts over big dashboard
  charts. No decorative gradients, blobs, nested cards, or emoji-as-icons.
- **Provenance everywhere:** last-updated, source/replay links, `unknown`,
  `conflict`, and `stale` states are first-class UI.

### Sources given
- Project briefs (read into `briefs/`): `web.md`, `server-2.md`,
  `replay-parser-2.md`, `replays-fetcher.md`, `v2-backend-parity-and-full-run.md`.
- **No existing codebase, Figma, logo, or visual tokens were provided** — the briefs
  explicitly defer "exact visual identity tokens (palette, type, spacing, density,
  elevation, state colors)" to implementation. **This system defines them.** See
  Caveats for what that means for the reader.

---

## 2. Content Fundamentals

The voice is **operational and laconic** — a command readout, not a marketing site.
The brief's own words: *"simple, beautiful, and laconic,"* *"dense but readable,"*
*"feel instant, stable, and trustworthy before it feels decorative."*

- **Tone:** precise, neutral, confident. State facts and status. No hype, no
  exclamation, no growth-marketing copy. The product *reports*; it doesn't *sell*.
- **Person:** address the user as **you** ("Track your request status"); the system
  refers to itself implicitly, not as "we." Staff-facing copy is imperative and
  terse ("Approve", "Reject", "Mark reviewed", "Retry job").
- **Casing:**
  - **Sentence case** for headings, buttons, and body ("Bounty leaderboard",
    "Submit request", "Open replay").
  - **UPPERCASE with letter-spacing** only for *labels / column headers / overlines*
    ("ROTATION", "K/D", "STATUS", "SOLID STATS") — set in the label or mono role.
  - **lower / mono** for IDs, slugs, checksums, timers (`#replay-48213`, `12:04.7`).
- **Numbers are the content.** Always tabular, right-aligned in tables, with explicit
  units and signed deltas (`+12`, `−3`, `1.84 K/D`). Unknown is the literal word
  **`Unknown`** in an amber badge, never `0` or `—` alone.
- **Status language is a fixed vocabulary:** `Pending` · `Approved` · `Rejected` ·
  `Reopened` (requests); `Known` · `Unknown` · `Conflict` (data trust);
  `Up to date` · `Stale` · `Offline` · `Reconnecting` (freshness);
  `Queued` · `Parsing` · `Failed` · `Retried` (jobs).
- **Provenance is copy, not decoration:** "Updated 4 min ago", "From replay
  #48213", "Manually filled by moderator", "Last 4 of SteamID: ••••3071".
- **Bilingual discipline:** every string is i18n-keyed (RU/EN); never hardcode UI
  text. Dates/times localize; ops contexts also expose UTC in a tooltip.
- **No emoji.** Ever, as structural UI. Icons are Lucide SVGs (see §4).
- **Errors** are actionable and sit by the field: distinguish *your-action* errors
  ("Add at least one linked replay") from *system* errors (with a request/debug ID
  and a contact path).

**Examples**
- Empty state: `No squads match these filters. Clear filters to see all 1,204 squads.`
- Stale banner: `Showing cached stats from 9 min ago — live connection lost. Reconnecting…`
- Bounty explainer: `142 pts · victim effectiveness ×1.8 · squad effectiveness ×1.3 · Rotation 14`
- Request success: `Request #4471 submitted. A moderator will review it — track status in My requests.`

---

## 3. Visual Foundations

**Direction: "Tactical Operations Terminal."** A gunmetal-ink command surface where
data is the hero. Sharp, technical, calm under density. See
[`colors_and_type.css`](colors_and_type.css) for every token.

### Color
- **Neutrals are blue-tinted gunmetal**, not pure gray/black — a layered ink scale:
  `--bg-0` (deepest backdrop) → `--bg-1` (sticky bars) → `--surface-1` (cards) →
  `--surface-2` (table headers, inputs) → `--surface-3` (hover/active row). Surfaces
  step *up* in lightness as they come forward.
- **One signal accent — cyan** (`--primary` `#36C5E0`). It
  means *interactive / active / brand*: links, active nav, primary buttons, focus,
  selected rows, sparkline strokes. Used sparingly so it stays meaningful.
- **Semantics carry the palette range** so the UI is never one-note: **green** =
  win/positive delta, **red** = loss/teamkill/danger, **amber** = unknown/conflict/warning,
  **blue** = info. Each has a `-weak` tint (badge/row backgrounds) and `-border`.
- **Never color-alone:** every semantic colour is paired with an icon and/or label
  (a win is a green ▲ + "W", an unknown is an amber `?` + "Unknown").
- **Imagery color vibe:** cool, desaturated, slightly contrasty — map thumbnails and
  squad emblems read like recon imagery, not glossy marketing photos. Real assets go
  in drop-in image slots; we never fabricate stock or illustration.

### Type — see §1 (Cyrillic required)
- **Display: `Saira`** (aerospace/HUD grotesk) for headings and big stat readouts —
  600/700, tight tracking.
- **UI body: `IBM Plex Sans`** — engineered, highly legible, technical character.
- **Mono: `IBM Plex Mono`**, tabular figures, for *all* stats, ranks, IDs, slugs,
  timers, checksums. Tabular numerals everywhere numbers align.
- Uppercase labels get `--ls-label` (0.06em); brand/overline get `--ls-caps` (0.12em).

### Spacing, density & layout
- **4px grid** (`--space-*`). Dense defaults: 8/12/16 dominate; 24/32 separate major
  regions. Desktop tables expose a **density toggle** (comfortable ↔ compact rows).
- Max content width `--container` (1240px); top nav on desktop (`--nav-h` 56px),
  bottom tab bar on mobile (`--tabbar-h` 60px). Sticky table headers + filter
  toolbars; **reserve space for all async content — CLS budget is ≤0.02.**
- Right-align numeric columns; left-align identity columns; sticky first column on
  mobile tables.

### Radii, borders & elevation
- **Sharp, technical radii:** 2px chips, 4px inputs/buttons, 6–8px cards, 12px
  dialogs. Nothing pill-soft except avatars and toggle pills.
- **Hairline borders (`--border-1`) are the primary separator** — this is a
  table/ops product, so structure comes from 1px lines + surface steps, not heavy
  shadow. `--border-2` frames focus-within and emphasized panels.
- **Shadows are restrained** and reserved for things that truly float — menus,
  popovers, dialogs, toasts (`--shadow-md/-lg`). Cards on dark use border + surface,
  not drop shadow.

### Motion, hover & press
- **Fast and functional:** `--dur-fast` 120ms / `--dur-base` 170ms, `--ease-out`.
  No bounce, no parallax, no decorative motion. Animate `transform`/`opacity` only.
- **Hover:** surface lifts one step (`--surface-1` → `--surface-3`) and/or border
  brightens to `--border-2`; primary buttons go `--primary` → `--primary-hover`.
- **Press:** color deepens (`--primary-press`) + a 1px translate-down / `scale(0.99)`.
- **Focus:** always visible — `--ring` (2px offset ring in primary) on every
  interactive control; `--ring-glow` for inputs.
- **`prefers-reduced-motion`:** drop all non-essential animation; keep instant state.

### Transparency & blur
- Used purposefully: `-weak` token tints (13–15% alpha) for badge/row fills; scrim
  `--overlay` behind dialogs; optional subtle backdrop-blur on the sticky top nav
  and bottom tab bar only. Never blur content regions.

### Data trust as a visual layer
Provenance/unknown/conflict/stale states are designed components (badges, inline
hints, banners), not afterthoughts — they appear in tables, profiles, replay
timelines, and bounty breakdowns.

---

## 4. Iconography

- **Single icon family: [Lucide](https://lucide.dev)** — mandated by the brief
  ("use Lucide as the single SVG icon family"). Outline SVGs, **2px stroke**, round
  caps/joins, `currentColor` so they inherit text color and theme automatically.
- **Sizes:** 16px (inline / dense table), 18–20px (buttons, nav), 24px (section
  headers, empty states). Keep stroke visually 2px — don't scale a 16px icon up.
- **Loading:** in this system Lucide is linked from CDN
  (`https://unpkg.com/lucide@latest`) and rendered via `data-lucide="name"` +
  `lucide.createIcons()`, or as inline `<svg>`. For production, install the
  `lucide-react` package and tree-shake. See `assets/icon-reference.html` for the
  domain icon mapping.
- **Domain mapping** (consistent meanings across the product):
  `crosshair`→kills · `skull`→deaths · `users`→squad · `user`→player ·
  `shield`→commander/KS · `target`→bounty · `repeat`→rotation · `film`→replay ·
  `flag-triangle-right`→request · `gavel`→moderation · `badge-check`→approved ·
  `x-circle`→rejected · `circle-help`→unknown · `triangle-alert`→conflict/warning ·
  `wifi-off`→offline · `refresh-cw`→reconnect/retry · `trophy`→leaderboard ·
  `trending-up`/`trending-down`→deltas.
- **No emoji and no ad-hoc Unicode glyphs** as UI icons. Arrows for deltas use
  Lucide `trending-up/down` or `arrow-up/down`, not `▲▼` text (except inside dense
  mono stat cells where a `▲`/`▼` is acceptable as a typographic delta marker).
- **No hand-drawn / generated illustration.** Where a real raster asset belongs
  (map thumbnail, squad emblem, evidence image, player avatar) we use a drop-in
  **image slot** placeholder for the user to fill.

---

## 5. Index / Manifest

Root files:
- **`README.md`** — this file.
- **`colors_and_type.css`** — the token source of truth (color + type + spacing +
  radii + motion). Import this anywhere.
- **`SKILL.md`** — Agent-Skills-compatible entry point for using this system.
- **`briefs/`** — the original product briefs (context; reader may not have repo access).
- **`assets/`** — brand wordmark, icon reference, and drop-in image-slot helper.
- **`preview/`** — the Design System tab cards (color, type, spacing, component specimens).
- **`ui_kits/web/`** — high-fidelity, interactive recreation of the Solid Stats
  `web` product (the only UI surface). See its own `README.md`.

There are **no `slides/`** — no slide template was provided, so none were created.

---

## 6. Caveats & how to make this perfect

- **This visual identity was authored, not extracted.** No logo, codebase, Figma, or
  token sheet existed; the briefs deferred them. The direction (dense esports ops,
  dark, Lucide, tabular numerals, RU/EN) is faithfully followed, but the
  **specific palette, type pairing, and logo are proposals** — your call to ratify.
- **Fonts (Saira / IBM Plex Sans / IBM Plex Mono) load from Google Fonts CDN.** All
  three carry full Cyrillic, which the RU/EN requirement demands. For production,
  self-host the woff2 files under `fonts/`. *If you'd prefer a different display or
  body face, tell me — this is the easiest thing to swap.*
- **The logo is a typographic placeholder wordmark** (`assets/logo-solidstats.html`),
  since none was provided. Replace with the real mark when available.
- **Imagery uses drop-in slots, not fabricated art** — drag in real map thumbnails,
  squad emblems, and avatars.

**My ask:** Please confirm (1) the **cyan-on-gunmetal** direction and (2) the
**Saira + IBM Plex** type pairing — or point me at a reference you like better — and
send a **real logo** if one exists. With those locked I'll tighten every card and the
UI kit to be pixel-perfect.
