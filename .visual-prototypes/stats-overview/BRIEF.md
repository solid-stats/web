# Stats Overview Brief

## Job

Give a public visitor an immediate, trustworthy SG statistics digest and clear
paths into players, squads, bounty, rotations, commander statistics, and replay
evidence.

## Scope

- One public, signed-out-first Overview page. Authentication changes only the
  surrounding account affordance; statistics content is the same for all roles.
- SG only. MACE and SM are excluded from this design iteration and will be
  designed separately. The period selector does not select a project.
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
  and displayed with a decimal point, at most two fractional digits, and no
  trailing zero (for example `1.28`, `-2.93`, `5.4`). Score color follows its
  level: red, white, green, or cyan; it is not a positive/negative delta.
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
- Squad Score is average kills divided by average attendance, as confirmed
  by the user on 2026-10-04. Display at most two decimals under `Score`;
  do not use
  the obsolete backend net-kills total or infer an average of player Scores.
  Both averages use the same selected replay scope. Prototype values remain
  illustrative; production must supply the target calculation.
- Include long squad names and tags, unknown side, one squad, ten squads, and
  200+ squads.

### Bounty leaderboard

- SG-only priority targets, sorted by reward for one enemy kill. The user
  confirmed this replacement of the accumulated-points digest on 2026-10-06.
- Reward is `clamp(targetAdjustedScore / rotationMean, 0, 3)`; no squad
  multiplier. Show two fractional digits inside an amber reward block.
- At All time, label this card as current-rotation targets. A historical
  rotation uses its own targets. Accumulated earned points remain a separate
  Bounty-page concern.
- A non-positive or missing rotation mean cannot yield a trustworthy reward:
  show reward unavailable, not a fabricated zero.
- Use the same compact player identity as the player and replay sections.
- Include zero reward, capped reward, tied rounded rewards, and a long name.

### Recent replays

- Show a bounded recent slice with replay ID, mission, map, localized date/time,
  processing state, winner, top player, and top squad where available. Remove
  the kills column. Top player and top squad use shared identity components.
- Desktop and mobile use the same processing-state and winner components.
  Winner labels have the winning side's data color, not generic success green,
  and no decorative outcome icon. EAST red is paired with its side name and
  win label; processing failures remain separately labelled errors.
- Tablet uses dense flex rows; hide map and top identities before sacrificing
  mission, processing state, outcome, or date. Mobile uses compact summaries.
- Include parsed, parsing, failed, and unknown-outcome examples plus long
  mission and map names.
- Volume boards: zero, one, five, and many replays.

### Trust and provenance

- Show the compact freshness badge directly below the page title:
  Up to date, Data is going stale, Connection lost, or Reconnecting.
  Its age describes the displayed data snapshot, not the last replay date.
  Do not show last-replay timestamps or processed-replay totals in the header.
- Stale/offline and parse states use icon plus label, never color alone.
- The current `server-2` contract does not expose the complete target Overview
  payload or `adjustedScore`. This is a production contract dependency, not
  permission to regress the prototype to the old formula.

## Visual Inputs

- Canonical tokens: [`DESIGN.md`](../../DESIGN.md) and generated
  `src/styles/theme.css`.
- Component source: connected Penpot `SolidStats UIKit`
  (`3be9e5e1-190f-8090-8008-724cff55ab11`).
- Shared page-shell composites live on `App Design / Components`: Brand,
  NavigationLink, Header, BottomTab, BottomNavigation, LocaleControl,
  SessionControl, AccountMenu, ScopeControl, StateFeedback (Empty / Error), and
  ReplayBadge (Win / Unknown / Processed / Processing).
  Screens use bound instances;
  these composites retain their connected UIKit buttons and Lucide icons.
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

- Page header: compact period control aligned with the title; secondary
  freshness badge and period context occupy the second desktop row. Keep the
  selector label readable, its icon and chevron close to its content, and
  narrow-screen labels beside the leading icon. Show the opened selector with
  its selected all-time option and secondary rotation options.
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
- Freshness uses the canonical four-state badge recipe and snapshot age.
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
| Bounty row | Rank, target identity, per-kill reward | Open target or Bounty |
| Replay row | ID, mission, map, state, outcome, time | Open replay or all replays |
| Freshness | Connection/freshness state and snapshot age | Read status |

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
- Loading: skeleton slots derived from the Success components, matching both
  horizontal and vertical geometry. Do not add redundant loading text.
- Empty: no qualifying data, with a recovery action appropriate to the scope.
- Stale/offline: exactly the same cached Success rows, values, order, columns,
  supporting data, and formatting remain visible with a persistent explanation.
- System error: identify the failed section without replacing healthy sections.
- When no replays exist, replace all data sections with one centered feedback
  region and one recovery action. At All time, offer Refresh and explain that
  data will appear after replay processing.
  A narrower period cannot recover data absent from All time. Change period
  remains appropriate for a rotation-specific empty state; the scope selector
  stays available. Do not repeat the recovery action in every empty card.
- A player-ranking error exposes Try again while retaining healthy squads,
  Bounty, and replay evidence. Mobile retains its recent replay cards.
- StateFeedback centers its icon, message, explanation, and optional action
  inside the containing region, visually distinguishing feedback from data.
  Cards and text hug their content; a background never determines a state's
  height or stretches against a parent that hugs the same content.
  Visible state-icon strokes reference the semantic color tokens.
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
- Header variants cross Desktop / Compact with Guest / Authenticated. The
  authenticated account name is `Afgan0r`; its menu exposes My requests and
  Sign out. Discord account identity does not imply ownership of player stats.

### Component states

- Scope selector, mobile segments, row links, and "View all":
  enabled, hover, pressed, focused, selected where applicable, disabled, and
  loading.
- Player nickname, squad name, and known side are independent links. Rows do
  not become nested anchors. Known absence and metadata failures are text.
- Cards are fluid within the canonical grid. Data regions have bounded visible
  height only when content can exceed the Overview summary limit.
- Header links hug their icon and localized label. A flexible spacer separates
  public navigation from account actions. Wide header content aligns with the
  same centered 1760px container as the rankings.
- The bottom navigation has five equal fluid columns, content-sized tab
  internals, and a compact cyan selected state. Its 60px height and the 56px
  header height are canonical chrome density tokens, not arbitrary card sizes.

### Canvas organization

- `01 · Responsive / RU | EN / width`: success screens ordered from 390 to
  3440, with matching width columns in both locale rows.
- `02 · States / RU | EN / 390 | 1440 / state`: Loading, Empty, Error, Offline
  in a consistent horizontal sequence.
- `03 · Scenarios`: complete pages for each uneven one-versus-ten result,
  excessive strings, historical side modes, and alternate compact segments.
- `04 · Interactions`: period selection, data-freshness examples, and shared
  identity/navigation states in a stable order after sections 01–03.
- Section, locale, width, and state are ordered name prefixes. Every screen
  stays at the canvas root; do not wrap the matrix in structural groups.
  Penpot's SVG workspace uses its thumbnail rendering path for root boards.
  See the [workspace renderer](https://github.com/penpot/penpot/blob/develop/frontend/src/app/main/ui/workspace/shapes.cljs).
  No standalone Matrix labels clutter the root; screen IDs remain stable.
- Loading, Empty, and Error retain only their visible state content rather
  than hidden copies of successful tables. Data-limit fixtures are complete
  application pages so their effect on neighboring sections can be reviewed.
  Export one screen or region at a time.

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

- Inventing a new visual language outside the canonical design system.
- MACE/SM summaries or a mixed-game Overview.
- Full player, squad, bounty, rotation, commander, or replay-detail design.
- Production API wiring, framework behavior, accessibility implementation,
  tests, SEO, or performance work.
- Porting archived JSX/CSS or preserving its obsolete score and mock data.
