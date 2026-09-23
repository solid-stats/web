# Stats Overview Brief

## Job

Give a public visitor an immediate, trustworthy SG statistics digest and clear
paths into players, squads, bounty, rotations, commander statistics, and replay
evidence.

## Scope

- One public, signed-out-first Overview page. Authentication changes only the
  surrounding account affordance; statistics content is the same for all roles.
- SG only. MACE and SM remain on their dedicated rating surfaces.
- SG all-time is the default scope and includes the current rotation live. Past
  rotations remain available as secondary scopes.
- RU and EN boards at every target width, with long labels and localized dates.
- Prototype boards at 390px mobile, 834px tablet, 1440px desktop, 2560px wide
  desktop, and 3440px ultrawide. The content container remains capped by the
  canonical 1760px token.
- Static boards for success, loading, empty, stale/offline, and system error.
  Show the state set at both mobile and desktop widths in both locales.
  Interaction and accessibility mechanics are deferred to implementation.

## Priority

1. Page identity, SG scope, all-time/rotation context, and data freshness.
2. Top players, ranked by adjusted Score.
3. Top squads and SG bounty context.
4. Recent replay evidence.
5. Navigation into complete rankings and public evidence surfaces.

The first viewport must begin with useful ranking data. It must not become a
marketing hero or a row of decorative KPI cards.

## Data

### Player leaderboard

- Primary metric: `adjustedScore`, sorted by full-precision value descending
  and displayed to three decimal places.
- Supporting columns: games, kills, and weekly trend where the selected scope
  supports it. Show eight weeks at tablet and desktop widths and four weeks on
  narrow mobile screens. Do not repeat the trend as Score-tier bars.
- Raw score is secondary explanatory data for an implementation tooltip or
  popover; it is not a competing primary column.
- Include a long nickname, no-squad player, tied rounded values, a negative
  score, and a teamkill-heavy edge case.
- Volume boards: zero, one, ten, and 200+ players. Overview shows a bounded top
  slice and total count; it never renders the full population inline.

### Squad leaderboard

- Preserve the reference's ranked squad digest and side context. Put a small
  circle in each squad row using its rotation-side color, alongside the written
  side label; use a neutral color when the side is unknown.
- Use the squad leaderboard's own score contract. Never label a squad value as
  player `adjustedScore`.
- Include long squad names and tags, unknown side, one squad, ten squads, and
  200+ squads.

### Bounty leaderboard

- SG-only, so it remains a stable third Overview segment/card.
- Show total bounty values to two decimal places and link to the full bounty
  surface.
- Include zero bounty, tied rounded totals, and a long player name.

### Recent replays

- Show a bounded recent slice with replay ID, mission, map, localized date/time,
  parse state, and known/unknown outcome where available.
- Include parsed, parsing, failed, and unknown-outcome examples plus long
  mission and map names.
- Volume boards: zero, one, five, and many replays.

### Trust and provenance

- Replace the historical generic "Up to date" treatment with
  `Last replay: <date/time>` and `Replays counted: <n>`.
- Stale/offline and parse states use icon plus label, never color alone.
- The current `server-2` contract does not expose the complete target Overview
  payload or `adjustedScore`. This is a production contract dependency, not
  permission to regress the prototype to the old formula.

## Visual Inputs

- Canonical tokens: [`DESIGN.md`](../../DESIGN.md) and generated
  `src/styles/theme.css`.
- Component source: connected Penpot `SolidStats UIKit`
  (`3be9e5e1-190f-8090-8008-724cff55ab11`).
- Active prototype file: Penpot `App Design`
  (`5954a801-37cf-8094-8008-81f63a8ba3d3`), page `Overview`.
- Structural reference: frozen
  [Stats Overview hi-fi](../../.design/hifi/Stats%20Overview.html). It is visual
  reference only; its JSX, CSS, fixtures, formula, and default rotation are not
  portable implementation inputs.
- Product authority: `plans/web/briefs/web.md`,
  `plans/product/SCORE-DECISIONS.md`, and
  `plans/product/LEADERBOARD-UX-DECISIONS.md` in the adjacent `plans` repo.

### Reference traits to preserve

- Mobile: segmented Players / Squads / Bounty leaderboard, followed by recent
  replays. The shared brand header matches desktop, while the compact bottom
  navigation has five aligned icon-and-label tabs including Bounty.
- Desktop: a three-column top-player, squad, and bounty digest with aligned
  headers and ten rows per card, followed by a full-width replay table.
- Card detail: integrated icon headers, secondary identity lines, one weekly
  player trend, side-color squad markers, bounty targets, and labeled replay
  states. Use the English product term `Bounty` in both locales.
- Dense operational scan path, compact table rows, restrained gunmetal
  surfaces, cyan interactive accent, tabular numeric typography, thin borders,
  and no decorative card elevation.
- Responsive composition changes by information need; mobile is not a vertical
  copy of desktop.

### Required adaptations

- Historical Rotation 14 default becomes SG all-time, with rotations as
  secondary scopes.
- Historical raw Score becomes sample-size-adjusted Score for players.
- Historical generic freshness becomes replay-based provenance.
- Current canonical tokens and connected UIKit replace archived ad hoc values.

## Direction

- **Subject:** competitive community statistics with visible replay evidence.
- **Audience:** returning SolidGames players scanning rankings quickly, plus
  public visitors entering through search or shared links.
- **Visual world:** a restrained operations console, not military cosplay and
  not a generic SaaS dashboard.
- **Layout:** preserve the accepted responsive split: segmented mobile
  leaderboard and desktop multi-column digest.
- **Typography:** display face for page and section hierarchy, body face for
  labels, and mono tabular numerals for ranks, scores, counts, and timestamps.
- **Color:** background, stepped surfaces, primary text, muted text, border, and
  cyan interaction; semantic outcomes always add an icon or label.
- **Density:** compact and data-heavy without sacrificing row identity or touch
  targets.
- **Motion:** no prototype motion. Implementation may use only short state
  transitions that do not delay scanning or shift layout.
- **Signature:** the same ranking content changes presentation deliberately:
  focused segmented browsing on mobile and a comparative digest on desktop.

## Checklist Intake

- [Table, Tabs, Loading, Skeleton, Card, Navigation, and Responsiveness](https://www.checklist.design/browse):
  apply now to hierarchy, column legibility, selected state, loading geometry,
  responsive mode changes, and data-volume boards. Keyboard behavior and
  production semantics are deferred.
- [Accessibility](https://www.checklist.design/design-system/accessibility):
  focus appearance and non-color state communication apply to static state
  boards. ARIA, keyboard, screen reader, and automated checks are deferred.

## Selectel Readiness

### Object and actions map

<!-- markdownlint-disable MD013 -->

| Object | Visible data | Actions |
| --- | --- | --- |
| Scope | SG all-time or rotation, optional dates | Open selector; choose scope |
| Player row | Rank, player, squad, Score, stats, trend | Open player or full ranking |
| Squad row | Rank, squad, tag, side, members, score | Open squad or full ranking |
| Bounty row | Rank, player, total bounty | Open context or full ranking |
| Replay row | ID, mission, map, state, outcome, time | Open replay or all replays |
| Freshness | Last replay and counted replay total | Read status |

<!-- markdownlint-enable MD013 -->

### Data-volume states

- Every leaderboard covers empty, one, typical top ten, and abundant source
  data.
- Overview lists are bounded summaries with total counts and explicit
  "View all" paths.
- Long identity values truncate only where the full value remains available
  through the detail path or implementation tooltip. Critical state labels
  wrap rather than clip.
- Tables remain inside their cards. Page-level horizontal overflow is invalid.

### Scenario endings

- Success: all sections populated with fresh data.
- Loading: stable skeleton geometry matching the final cards and rows.
- Empty: no qualifying data, with a path to another scope or replays.
- Stale/offline: cached data remains visible with a persistent explanation.
- System error: identify the failed section without replacing healthy sections.
- Onboarding is not applicable: Overview is public and useful without setup.

### Cross-surface intersections

- Player, squad, bounty, rotation, commander, and replay pages.
- Shared shell navigation, scope selector, rows, freshness, status badges, and
  loading patterns must remain consistent with their UIKit definitions.
- Score explanation and numeric formatting must match Player Leaderboard and
  Player Profile.

### Roles

- Signed-out visitor, player, moderator, and admin see the same public data.
- Role differences stay in shell/account navigation. No duplicate page boards.

### Component states

- Scope selector, mobile segments, row links, and "View all":
  enabled, hover, pressed, focused, selected where applicable, disabled, and
  loading.
- Table/list rows use the whole row as detail target where nesting allows it.
- Cards are fluid within the canonical grid. Data regions have bounded visible
  height only when content can exceed the Overview summary limit.

### Responsive widths

- 390px: one active leaderboard segment, compact rows, recent replays below,
  and no horizontal page scroll.
- 834px: tablet navigation and compact data density. Prefer the segmented
  composition over cramped sibling cards.
- 1440px: aligned player, squad, and bounty cards in one row, then a full-width
  replay table.
- 2560px and 3440px: center the 1760px container. Sections must not stretch
  into low-density empty slabs.

### Developer and QA notes

- Record state triggers and fallback behavior in the prototype notes, outside
  the visible design canvas.
- Keep player adjusted Score and squad score distinct in notes and fixtures.
- Production verification later covers 360, 390, 414, 768, 1024, 1280, 1920,
  2560, 3440, and 3840 widths, keyboard, axe, CLS, localization, SEO, and Core
  Web Vitals.

## Non-Goals

- Redesigning the accepted composition or inventing a new visual language.
- MACE/SM summaries or a mixed-game Overview.
- Full player, squad, bounty, rotation, commander, or replay-detail design.
- Production API wiring, framework behavior, accessibility implementation,
  tests, SEO, or performance work.
- Porting archived JSX/CSS or preserving its obsolete score and mock data.
