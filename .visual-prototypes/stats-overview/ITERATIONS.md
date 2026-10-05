# Stats Overview Iterations

## v10 — Freshness badge and opened scope selector

- User correction: restore the compact freshness badge under the page title.
  Last-replay information is unwanted; this supersedes v9's provenance row.
  The application top bar and ranking/replay content remain outside the edit.
- Baseline: App Design revision 266, web master `0f82c43`; fresh origin refs
  show 0 ahead / 0 behind. User-owned untracked design exports are preserved.
- Bounded result: all 28 existing page headers, new connected local freshness
  composites, and representative opened scope menus. The chrome-free data
  fixture has no header and remains untouched. Connected UIKit values do not
  change.
- Required coverage: existing RU/EN 390, 834, 1440, 2560, and 3440 headers;
  existing Loading, Empty, Error, and Offline headers at 390 and 1440;
  explicit stale and reconnecting intent in both locales; opened selectors at
  390 and 1440 in both locales. Snapshot age is distinct from replay dates.
- Check composition, copy fit, reference relationships, semantic colors plus
  labels/icons, cached-content continuity, component and token links, bounds,
  unchanged top bars/body, and server persistence. Static prototype intent is
  in scope; runtime keyboard, ARIA, motion, API wiring, SEO, and performance
  remain implementation work.
- Search depth: bounded change with two fresh whole-result Sol/high reviews.
  Reviewer A first derives an independent omission/boundary coverage map;
  both then inspect the full bounded result. Candidate findings receive a
  fresh independent verifier.
- Result: 40 headers across 41 Overview boards. The 28 existing headers now
  use connected freshness instances; 12 representative boards add Stale,
  Reconnecting, and Scope-open views in RU/EN at 390 and 1440. Ten localized
  freshness mains and two localized ScopeMenu mains live on Components.
  Initial loading has a separate updating recipe and makes no age claim.
- The opened selector contains selected SG All time and seven fictional
  rotations. Rotation 14 is marked current; Sep 15 through Oct 12 includes
  the Oct 5 fixture date. Date ranges remain illustrative prototype content.
- Findings and corrections:
  - `v10.bind`: restored 64 missing own paint-token records on freshness
    sources and consumers. Existing colors, geometry, and links were retained.
    `freshness_binding_verify` verified the candidate; `freshness_fix_verify`
    independently verified the correction (GPT-6 Luna / medium).
  - `v10.dates`: corrected seven menu date ranges on both localized mains
    and their four consumers. The persisted delta contains 42 text changes
    and 39 automatic text-width changes, with no position or paint change.
    `freshness_dates_verify` verified the candidate; `freshness_fix_verify`
    verified the correction (GPT-6 Luna / medium).
  - `v10.dot`: the stale circle-dot center was invisible because a 1.4 px
    inner stroke exceeded its 1.167 px diameter. `freshness_dot_verify`
    independently confirmed the canonical-recipe deviation. Centered strokes
    on two source ellipses and four consumer ellipses restore the dot without
    changing UIKit/Lucide links, geometry, or `color.warn` bindings.
  - `v10-A1`: optional tablet grouping refinement. RU/EN 834 headers leave
    2 px between badge and selector versus 14 px at 390. The spacing is an
    allowed token and causes no clipping. `freshness_spacing_verify`
    confirmed the measurement but found no mandatory minimum; left unchanged
    for user choice.
  - `v10.future`: rejected by `freshness_spacing_verify`; an active period's
    upcoming end date is coherent with its current label and as-of date.
  - `v10.menu-recipe`: both revision-288 whole-result reviewers found the
    floating selector shell used input/card paint instead of the canonical
    popover recipe. `freshness_menu_verify` confirmed the surface and border
    deviation, ruling out the brief's ranking-card elevation exception.
    The correction applies `color.surface-1`, `color.border-2`, and
    `shadow.md` to the two local mains and four consumers; radius and linked
    Card primitives are retained. The prior raw schema omitted shadow data;
    revision-288 SDK reads show empty shadow lists on all six shells.
    `freshness_menu_clip_verify` separately confirmed that the outer menu
    roots clipped the applied shadow. Disabling clipping on two mains and
    four consumers preserves the rounded Card clip and page viewport clip.
    `freshness_menu_fix_verify` independently confirms the final recipe,
    unchanged geometry/content/links, and visible exterior shadows in all
    four contexts (GPT-6 Luna / medium).
- Evidence: logical artifact `solidstats-overview-header-v10`, with locator
  `~/.codex/visualizations/2026/10/05/01a10b39-1b21-7a80-a19e-8932f234fae2/overview-header-v10/locator.json`.
  Current App Design revision 291; UIKit 137 and Lucide-icons 464 unchanged.
  The admitted manifest contains 40 current headers, four wide detail crops,
  four Scope-open contexts over actual ranking content, and five recipes in
  both locales. Native SVG exports and original Penpot markup groups are
  rasterized locally; no browser is used. Raw 950-record persistence checks
  reconcile tokens and finite geometry with the final snapshot. All 29
  baseline board geometries and non-header subtrees remain unchanged; the
  41-board root inventory has no collisions.
- Dot correction delta: exactly six raw records change only stroke alignment;
  four renders change only their 4-by-4 px center region. The other 36
  admitted header hashes were unchanged by that correction. Menu paint
  changes subsequently affect six shells only. Final overflow changes keep
  menu interiors pixel-identical and add exterior shadows; the other 36
  header hashes remain unchanged. Revision 291 expands the raw schema with
  `showContent`; prior records omit that field. Before clipping is proven by
  SDK reads and native SVG, rather than inferred from the schema expansion.
  Previously recorded raw fields have no changes from revision 290 to 291.
- Final gate: `freshness_pass_a` and `freshness_pass_b` (GPT-6.1 Sol / high)
  independently approve revision 291 after inspecting all 40 headers and
  contextual evidence. A first derives its own omission/boundary map.
  Neither finds a new mandatory deviation or required evidence gap. Both
  independently reconcile current hashes, raw records, recipes, bounds,
  and all 29 unchanged baseline non-header subtrees.
  `freshness_dot_fix_verify` (GPT-6 Luna / medium) confirms the isolated dot
  correction, including amber center pixels in all four current renders.
  The fresh whole-result round and independent menu fix verification pass.
- User acceptance remains pending. No accepted `SUMMARY.md`, implementation
  work, or accepted-design memory capture is created by this review.

## v9 — Page header reference polish

- Request: improve the Overview page header using the archived Stats Overview
  reference. The application top bar is explicitly outside the change.
- Baseline: App Design revision 257; web and plans remote refs refreshed on
  2026-10-05, both master checkouts equal their upstreams. Existing untracked
  `.design/generated/` and `.design/token-aliases.json` are user-owned.
- Bounded scope: the 28 page headers in the 29-board Overview inventory and
  their shared ScopeControl composite. The chrome-free 834 data fixture has
  no page header. Rankings, replay content, navigation,
  account controls, fixtures, and canonical token values remain unchanged.
- Reference relationships: title and compact period control share the first
  row; provenance and period context share the second desktop row. The
  selector's icon, label, and chevron form one readable control.
- Direction: retain SG all-time and replay-based provenance; strengthen the
  selected-period label, hug desktop control content, keep a full-width
  narrow control with its label beside the leading icon, and improve small
  provenance readability using existing typography tokens.
- Coverage: RU/EN; 390, 834, 1440, 2560, and 3440; success and existing
  loading/empty/error/offline boards; all current ScopeControl consumers.
  Check reference fidelity, grouping, alignment, density, text fit, token and
  component bindings, top-bar isolation, board collisions, and persistence.
- Stage: static prototype polish. Production keyboard behavior, API wiring,
  SEO, performance, and runtime accessibility remain deferred. Existing
  component-state recipes remain linked; no new interaction is introduced.
- Search depth: bounded local change. Two fresh whole-result reviews are
  required; no exhaustive whole-page audit or saturation wave is implied.
- Result: the desktop scope control hugs its content (RU 178 px, EN 143 px)
  at 36 px high. Its primary 13 px semibold label is readable beside the
  repeat icon. Narrow controls retain their full width and left-aligned
  label; the chevron stays at the trailing edge. Provenance uses 13 px on
  desktop and 12 px on narrow boards, with enough height for wrapped copy.
- Binding corrections: the source label's missing size token was restored.
  A later raw-data check found that consumer `fill-group` overrides blocked
  source color inheritance under
  [Penpot's synchronization rules](https://help.penpot.app/technical-guide/developer/data-guide/).
  All 28 control roots and 28 labels now carry
  their own canonical fill-token bindings; localized text, component links,
  dimensions, colors, and other properties were preserved.
- Evidence: logical artifact `solidstats-overview-header-v9`, with its local
  locator at `~/.codex/visualizations/2026/10/05/01a10b39-1b21-7a80-a19e-8932f234fae2/overview-header-v9/locator.json`.
  Final App Design revision 266; connected UIKit revision 137. The capsule
  contains 28 full native renders, current raw source/consumer records,
  geometry and token checks, and two post-fix renders that are pixel-identical
  to the reviewed views. Top bars, other content, and board bounds are
  unchanged across the 29-board inventory; no board collisions were found.
- Review ledger: source-size binding and consumer-fill binding were each
  independently verified and corrected. Fresh whole-result reviewers
  `header_bound_a` and `header_bound_b` (GPT-6.1 Sol / high) cover the complete
  bounded result; `header_bound_verify` (GPT-6 Luna / medium) independently
  confirms the persisted binding correction. Both whole-result reviews
  returned APPROVE for revision 266, with no retained findings or evidence
  gaps in the bounded prototype scope.
- Status: verified prototype update; user acceptance remains pending.

## v1 — 2026-09-21

- Goal: assemble the first reviewable Overview in Penpot from the connected
  SolidStats UIKit, preserving the existing brief's desktop and mobile split.
- Artifact: App Design, page `Overview` (the existing application page), file
  `5954a801-37cf-8094-8008-81f63a8ba3d3`.
- Primary boards: `Overview / RU / 1440 / Success` and
  `Overview / RU / 390 / Success`; English, tablet, wide and state boards belong
  to the same page.
- Composition: full-width player ranking; equal squad and bounty digests;
  recent replay evidence. Compact layouts use Players / Squads / Bounty
  segments, five ranking rows, and three replay cards.
- Data: fictional fixtures, SG all-time, including the current rotation.
  Player Score uses C = 12 and a synthetic pooled scope mean of 0.8. Default
  fixture players have zero teamkills and zero deaths by teamkill; scores are
  calculated from the displayed kills and games. Full-population aggregates
  are illustrative, not claims about live community statistics.
- Scope: this is a static visual prototype. No route or application code is
  implemented. Acceptance and `SUMMARY.md` remain pending user review.
- Token mechanics: the connected UIKit supplies bound component instances.
  Its 82 tokens are copied verbatim into active App Design token sets because
  applying a connected-library token directly to a new shape produced no
  binding or rendered value. DESIGN.md remains authoritative; these sets are
  a synchronized mirror, not an independent design system.
- Applicable checklist: [Checklist Design](https://www.checklist.design/browse),
  covering tables, tabs, navigation, cards, loading geometry and responsiveness.
  Production accessibility, keyboard behavior, SEO and performance remain
  deferred to implementation.
- Contract dependencies: the target Overview payload and adjusted Score API
  remain implementation work. No production API compatibility is claimed.
- Authority: web `29e78e7b1af6becafee69a6612ebf1656479b332`, DESIGN.md and this
  slice's existing BRIEF.md; plans
  `5e3ccb776b0c0e7da51112c3b0b498bb4ea11ac0`, web/briefs/web.md,
  product/SCORE-DECISIONS.md and product/LEADERBOARD-UX-DECISIONS.md.
- Decision: iterate; first user review pending.

### Boards and evidence

| Board | Penpot shape ID |
| --- | --- |
| RU desktop, 1440 | c174ef54-f585-8039-8008-ab36075352d9 |
| EN desktop, 1440 | c174ef54-f585-8039-8008-ab37e2e93070 |
| RU mobile, 390 | c174ef54-f585-8039-8008-ab36eb0f78a0 |
| EN mobile, 390 | c174ef54-f585-8039-8008-ab375d67c2cf |
| RU tablet, 834 | c174ef54-f585-8039-8008-ab3760cc8e73 |
| RU wide, 2560 | c174ef54-f585-8039-8008-ab37b654f7ad |
| RU ultrawide, 3440 | c174ef54-f585-8039-8008-ab37b9811904 |
| Mobile squads segment | c174ef54-f585-8039-8008-ab3765dbe6b7 |
| Mobile bounty segment | c174ef54-f585-8039-8008-ab376c3de657 |
| Loading | c174ef54-f585-8039-8008-ab380f414e0d |
| Empty rotation | c174ef54-f585-8039-8008-ab38113e765f |
| Initial request error | c174ef54-f585-8039-8008-ab38129a4bee |
| Offline cached snapshot | c174ef54-f585-8039-8008-ab381401de11 |
| Data edge cases | c174ef54-f585-8039-8008-ab38be7d4b36 |

Rendered exports were inspected at all five widths, both languages, and for
loading, empty, error, offline and edge data. Checks covered first-viewport
hierarchy, column alignment, numeric formatting, long nickname fit, surface
contrast, status meaning, card rhythm, and page overflow. The tablet adds games
and kills instead of wasting the available width. Wide and ultrawide player
tables measure exactly 1760px.

Corrections during review: token resolution, unknown-state amber styling,
numeric fixture consistency, replay column alignment, tablet density, right
alignment of scope controls, and shorter empty/error panels. AABB checks found
no top-level collisions; visible text stayed inside its page board.

Persistence was independently confirmed through authenticated, uncached
`get-file` RPC, including all five widths and review notes at server revision 19.
The read-only MCP file-list request stalled on a later check, so it was not
used as the final persistence authority. Exports also rendered the new boards.

### Remaining acceptance work

- User acceptance of the direction and any requested visual revisions.
- Exhaustive one/ten-squad and one-replay volume specimens, longer mission/map
  overflow examples, and the full page-level interaction-state matrix before
  final SUMMARY acceptance. Existing controls retain their UIKit variants.
- Four-week trends need a defined target payload; v1 shows no invented trend.
- Validate the squad metric contract before production fixture/API integration.
- Bottom navigation represents a viewport-fixed control; full-page boards show
  it at the bottom of the document for review. No live behavior is claimed.
- Only the newly created iteration log is committed in this pass; pre-existing
  untracked prototype and archive files remain untouched.

## v2 — Review correction in progress

The user rejected v1's simplified visual treatment, unchanged canvas background,
arbitrary frame placement, and a service-report board mixed into the designs.

- Set the actual Overview page canvas background to `#0A0D13`.
- Removed `Overview / Review notes` and the four standalone `Note /` boards.
  Their technical content stays in this log instead of the design canvas.
- Organized primary screens as width columns (390, 834, 1440, 2560, 3440) and
  RU/EN rows. Separate labeled bands contain compact states, ranking segments,
  and edge specimens. Missing language/width combinations stay unpopulated.
- Opened and visually inspected the actual archived Stats Overview HTML.
  It uses a three-column desktop digest, integrated card headers with icons,
  secondary identity lines, tier indicators, trends, and semantic badges.
- Found a material mismatch: BRIEF.md described a full-width player table with
  squad/bounty siblings below, but the actual desktop reference places all three
  rankings beside each other. The user chose the three-column composition.
- V1 is not accepted. Its prior geometry checks did not establish reference
  fidelity or a readable organization of the design canvas.

## v3 — 2026-09-23

- Restored the desktop digest to aligned Players, Squads, and Bounty columns,
  each with ten rows, an integrated icon header, secondary identity details,
  tier or trend indicators, and a direct path to the full ranking. The five-row
  replay table follows at full content width with mission, ID, map, parse
  state, known or unknown outcome, kills, top player, and time.
- Built the RU 1440 and EN 1440 screens, then centered the same composition in
  the canonical 1760px content container on RU 2560 and RU 3440 screens. The
  navigation bar spans each wide frame; its content aligns with the container.
- Updated RU and EN 390 player screens and the RU 834 tablet screen with squad
  context, tier coloring, and four-week trend marks. Separate RU 390 Squads and
  Bounty segments now use the same two-line row detail. Bounty totals show two
  decimal places.
- Kept the current SG all-time scope, current-rotation context, replay-based
  freshness, adjusted player Score, and connected UIKit instances. Fixture
  trends and totals remain illustrative. The target Overview payload and
  adjusted Score still need a production API contract.
- Exported the rebuilt 390, 834, 1440, 2560, and 3440 boards and inspected
  alignment, row density, text fit, semantic state labels, and clipped values.
  The first player Score, EN sign-in label, and bounty rank rendering needed
  specific corrections during this check.
- Verified the Penpot server advanced beyond the stalled revision 30 and
  contained the rebuilt ranking, replay, and mobile bounty shapes at revision
  67. Later visual refinements were also rendered by the server exporter.
- User review of the resulting design remains pending. The loading, empty,
  offline, error, and edge-case boards were retained from v1 and need a final
  content and reference-fidelity pass before acceptance or `SUMMARY.md`.

## v4 — 2026-09-23 review corrections

- Unified the compact brand header with desktop's SOLID STATS icon, typography,
  surface, and divider. Kept compact language and sign-in controls at the right.
- Expanded player trends to eight weekly bars on the 834, 1440, 2560, and 3440
  boards. The 390 boards retain four weeks. Removed the separate player Score
  tier bars on desktop, leaving one trend and the numeric Score.
- Changed every Russian borrowed bounty label to the product term `Bounty`.
- Added a rotation-side color circle beside each squad identity, including a
  neutral marker for an unknown side. The written side label remains visible.
- Rebuilt the compact bottom navigation as five evenly spaced tabs. Each tab
  has a Lucide icon and a label; Bounty is present, and the selected tab matches
  the Players, Squads, or Bounty specimen shown.
- Completed the EN success width matrix with 834, 2560, and 3440 boards. Both
  languages now have success boards at 390, 834, 1440, 2560, and 3440.
- Added RU and EN 1440 loading, empty, error, and offline boards and completed
  the EN 390 state set. Offline retains cached rankings and replay evidence;
  loading keeps card geometry stable; empty and page-level error explain the
  absence of data within the same three-column composition.
- Inspected server-rendered exports of the updated mobile, tablet, desktop,
  wide, squad, and state boards. Penpot briefly rendered stale text after shape
  edits; fixing text geometry and re-exporting confirmed the corrected copy.
  The remaining hidden `Parsed` cell in a replay TableRow is an internal UIKit
  placeholder and is not visible in the prototype export.
- User acceptance and `SUMMARY.md` remain pending. The prototype is still a
  static design, and its weekly values remain illustrative fixtures.

### New board IDs

| Board | Penpot shape ID |
| --- | --- |
| EN tablet, 834 | df7e9de9-3eae-8053-8008-aef9e10ce28c |
| EN wide, 2560 | df7e9de9-3eae-8053-8008-aefa52314ce5 |
| EN ultrawide, 3440 | df7e9de9-3eae-8053-8008-aefa552cb54a |
| RU desktop loading | df7e9de9-3eae-8053-8008-aefae8d7d146 |
| RU desktop empty | df7e9de9-3eae-8053-8008-aefb43422be2 |
| RU desktop error | df7e9de9-3eae-8053-8008-aefb501c51f2 |
| RU desktop offline | df7e9de9-3eae-8053-8008-aefb5e87e984 |
| EN desktop loading | df7e9de9-3eae-8053-8008-aefb5fb4581d |
| EN desktop empty | df7e9de9-3eae-8053-8008-aefb846840ec |
| EN desktop error | df7e9de9-3eae-8053-8008-aefb96dc73e5 |
| EN desktop offline | df7e9de9-3eae-8053-8008-aefbaa58983f |
| EN mobile loading | df7e9de9-3eae-8053-8008-aefdb7e05a7b |
| EN mobile empty | df7e9de9-3eae-8053-8008-aefdc0f272b5 |
| EN mobile error | df7e9de9-3eae-8053-8008-aefdcb20273c |
| EN mobile offline | df7e9de9-3eae-8053-8008-aefdd4ee3db0 |

## v5 — 2026-10-04 shared components and review corrections

- Replaced copied shell elements in 28 application frames with local bound Header,
  BottomNavigation, and ScopeControl instances from App Design / Components.
  Composites retain connected SolidStats UIKit buttons and Lucide instances.
- Added Brand, NavigationLink, BottomTab, LocaleControl, SessionControl, and
  AccountMenu as reusable dependencies. Header has Desktop / Compact and
  Guest / Authenticated variants. Authenticated identity is `Afgan0r`.
- Changed header links to content-driven flex widths. Header content shares
  the ranking container's left and right edges and its 1760px wide-screen cap.
- Replaced oversized bottom-tab tiles with five fluid columns, compact icon
  and label stacks, and cyan selected content. Chrome heights follow DESIGN.md:
  56px header and 60px bottom navigation.
- Corrected squad fixtures from player-like fractional ratings to illustrative
  net-kill totals. The source is `totalScore(kills, teamkills)` in server-2
  `src/modules/statistics/parity-formulas.ts`, verified from fresh
  `origin/master` at `02e5fdecdc43840db4403f0e65e10ce1382261dc`. Squad headings
  now say NET KILLS / УБ. − ТК; invented squad Score-tier bars are hidden.
  Player adjusted Score and Bounty retain their distinct contracts.
- Organized Overview into Responsive, States, and Scenarios groups, with locale,
  width, and state subgroups. Removed loose Matrix labels and retained all
  existing screen IDs. Success and state rows share consistent positions.
- Rendered desktop guest and compact authenticated headers, the RU mobile
  bottom navigation, and the account menu. Inspected alignment, localized text
  fit, content widths, icons, selected styling, and the account name.
  Server revision 111 confirmed the new Overview grouping and v5 marker.
- Checked whole-screen exports at RU 390 and 1440 and EN 834 and 3440.
  The exports exposed stale rendered text despite updated persisted values.
  Forced text layout refresh for 85 squad totals and compact EN player Scores;
  the wide EN render confirmed integer squad totals and retained three columns.
- Investigated reported Overview lag. Removed 7,572 hidden inherited table
  layers from desktop states in bounded batches; retained visible state
  content and shared component bindings. Removed redundant application chrome
  from the data-limits fixture. Subsequent small operations completed in
  5–8 seconds; smooth interactive panning remains unverified.
- Stopped concurrent full-frame exports after their timeout. Subsequent single
  screen exports completed in 9–13 seconds. Automatic structure checks found
  bound headers on all 28 application screens and bound bottom navigation on
  all 14 compact screens, with matching container edges at desktop widths.
  No loose Matrix labels or temporary text-measurement layers remain.
- Fresh server metadata reported App Design revision 126. A direct read
  confirmed the account name and integer score data, and confirmed that
  sampled removed table and fixture-chrome layers were absent.
- Decision: iterate. User acceptance and SUMMARY.md remain pending.

## v6 — 2026-10-04 canvas panning correction

- The user reported that panning still lagged severely after the hidden-layer
  cleanup, specifically while moving around the canvas. Export latency had
  not measured that interaction.
- Found that all 29 screen boards were nested in 11 structural groups.
  Penpot's SVG [workspace renderer](https://github.com/penpot/penpot/blob/develop/frontend/src/app/main/ui/workspace/shapes.cljs)
  selects the root-frame thumbnail wrapper for immediate root boards;
  structural groups take a different rendering path.
- Removed the 11 wrapper groups and restored all 29 boards to the canvas root.
  Kept section, locale, width, and state in ordered board-name prefixes.
  Verified that every board retained its ID, position, width, and height.
  The reading matrix and shared component instances remain intact.
- Rechecked the same Overview canvas. The user confirmed that panning became
  smooth immediately after removing the groups. This confirms the practical
  fix; the installed renderer implementation was not independently profiled.
- Decision: keep the root-board structure. Overall design acceptance and
  SUMMARY.md remain pending.

## v7 — 2026-10-04 empty and section-error states

### Review contract

- Boundary: the static Overview Empty and Error result at 390 and 1440 in RU
  and EN, plus the new shared StateFeedback Empty / Error variants on Components.
  Direct consumers are all eight state boards. The EN Bounty text-layout refresh
  also affects Success at 1440, 2560, and 3440 and Offline at 1440; review those
  four card crops alongside the EN desktop Error frame.
- Baseline: v6 at web commit `ac8d4f755cfeecf3b976790e5cd1cbcaa005e1cb`.
  Preserve its root-board reading matrix, shared shell, five icon-and-label
  bottom tabs, and accepted three-column desktop composition.
- Mandatory: use connected UIKit Cards, buttons, and icons plus bound local
  StateFeedback instances; match SG all-time empty copy to the selected scope;
  expose one suitable recovery action; keep healthy content visible during a local
  player-ranking failure; retain localized copy, numeric contracts, and fluid
  state-card sizing without clipping, collisions, or invalid geometry.
- Snapshot: App Design file `5954a801-37cf-8094-8008-81f63a8ba3d3`, Overview
  page `5954a801-37cf-8094-8008-81f63a8ba3d4`, Components page
  `df7e9de9-3eae-8053-8008-aefacb91105e`. Server revision 161 was read directly
  after the edits. Review evidence set `overview-v7-r1` contains 13 PNG exports,
  `checks.json`, full `geometry-bindings.json`, and SHA-256 `manifest.json` in
  the session's machine-local visualization directory.
- Search depth: bounded whole-result review with two independent Sol/high
  reviewers and independent candidate verification. This iteration does not
  reopen the entire product or require every state at every success width.
- Applicable checks: intent and state completeness; composition and responsive
  continuity; copy and numeric formatting; component/consumer bindings;
  geometry and server persistence; traceable evidence. Production keyboard,
  API behavior, runtime accessibility, tests, SEO, and performance are deferred
  to implementation. Authenticated shell variants were unchanged in v7.

### Changes and recovery evidence

- Rebuilt Empty panels around scope-consistent messages and one Refresh
  action. Removed repeated recovery buttons and obsolete hidden replay rows.
- Rebuilt Error as a player-ranking failure with Try again. Desktop retains
  ten squad and Bounty rows and five replay rows; mobile retains three replay
  cards and the All replays action.
- Added bound StateFeedback Empty / Error variants. Their Components specimens
  use an ordered vertical layout rather than overlapping at one position.
- State panels hug content: mobile ranking 144px, empty replays 88px, desktop
  player state 188px, and other desktop empty panels 132px. The persistent
  shell density stays at the canonical 56px / 60px heights.
- Removed the corrupted Card root and its hidden title/body descendants.
  Their circular background sizing had produced out-of-range text geometry;
  repairing client coordinates alone did not clear the rejected save queue.
  After a reload, a clean connected Card with a top-constrained background
  replaced it. The direct server read at revision 161 confirms all three old
  IDs are absent and the replacement and StateFeedback are present.
- Checked all Overview geometry: 29 boards remain at the canvas root, with no
  out-of-range coordinates. EN Bounty SVG exports contain ten dot-decimal
  targets and no comma-decimal targets at both Success 1440 and Error 1440.
  Numeric formulas and fixture values did not change in this iteration.
- Overall user acceptance and SUMMARY.md remain pending; this iteration does
  not authorize frontend implementation.

### Independent review and corrective round

- Round 1: `overview_review_a` and `overview_review_b`, both requested
  GPT-6.1 Sol / high / fresh context, reviewed all 13 renders and the full
  bounded result. A independently derived coverage before reconciling the
  author ledger. A approved; B raised three candidates.
- r1.1 / B1: suspected EN comma-decimal Bounty glyphs. Fresh Luna/medium
  `bounty_verify_r1` rejected the claim after inspecting the original pixels
  and enlarged crops. All five affected cards use dots; fixture values did
  not need another edit.
- r1.2 / B2: raw semantic icon strokes despite existing color tokens. Fresh
  Luna/medium `state_verify_r1` confirmed the missing hard bindings against
  the Penpot sync rule; instance recoloring guidance does not waive that rule.
  Applied `color.loss` and `color.text-muted` to 54 visible paths across both
  StateFeedback mains and their 16 screen instances, preserving appearance.
- r1.3 / B3: All-time Empty recommended another period as recovery. The same
  independent verifier confirmed that a narrower period cannot contain data
  absent from its All-time superset. Replaced period-specific explanations
  with processing/arrival copy and used Refresh / Обновить once per screen.
  This corrects the author's initial Change period choice; it does not change
  the user's accepted composition. The brief now distinguishes All-time and
  rotation-specific recovery.
- The two desktop Error frames contain 40 off-frame inherited placeholder
  texts. All have hidden cell ancestors and clipped row/card ancestry; none
  appears in the exports. No unrelated UIKit cleanup was applied.
- Round 2 evidence set `overview-v7-r2` refreshes all eight state renders and
  Components; the four unaffected Bounty crops retain their original pixels.
  Server revision 164 confirms the fixes. `overview_review_a_r2` and
  `overview_review_b_r2`, both fresh Sol/high, completed the whole bounded
  review. B approved; A found another mandatory badge-recipe omission.
- r2.1: the six mobile Error replay badges had labels without Lucide icons.
  r2.2: the first two replay cards exposed the outcome without an explicit
  counted/parsed state. Fresh Luna/medium `processing_verify_r2` independently
  confirmed both against the brief and canonical badge recipe, while noting
  that the labels already conveyed meaning without color alone.
- Added the shared ReplayBadge family on Components with Win, Unknown,
  Counted, and Processing variants. Each combines a connected UIKit Badge and
  a connected, token-bound Lucide icon. Penpot prevents adding children inside
  a connected component copy, so the local composite owns this composition.
  Its widths hug the localized labels; the specimen uses a canonical dark
  surface to show the translucent badge fills clearly.
- Both mobile Error boards use ten bound ReplayBadge instances in total.
  Counted / Учтён appears beside replay metadata, with outcome on the date
  row. Processing uses the same metadata position. The three replay cards,
  their heights, All replays action, footer, and root-board matrix remain.
- Round 3 evidence set `overview-v7-r3` adds the ReplayBadge specimen to the
  bounded contract: 14 primary renders. Two mobile Error renders and the new
  specimen are fresh; the other eleven retain their unaffected r2 pixels.
  Server revision 172 confirms 217 semantic color bindings and valid geometry.
  Both fresh Sol/high reviews found r3.1: the RU replay badge labels retained
  their localized text but inherited smaller EN dimensions after main-instance
  updates. A new native export showed clipping; fresh Luna/medium
  `badge_geometry_verify_r3` confirmed it against current geometry and pixels.
  The exact propagation mechanism remains a hypothesis.
- Corrected all ten consumers using native SVG text metrics, then restored
  auto-width labels and auto-sized badge skins/composites. RU text widths are
  78, 34, 69, and 72px; each composite adds its existing 26px left and 8px
  right padding. The right card inset is 12px. Adjacent metadata keeps an 8px
  gap; replay card heights and the shell remain unchanged.
- A controlled Win-main padding update preserved the localized text width.
  Returning the main padding did not return consumer padding automatically;
  explicitly restored both consumers to 26px before final evidence capture.
  This checks the present result without promising future propagation safety.
- Round 4 evidence set `overview-v7-r4` contains 14 primary renders plus two
  detail crops, two repeat exports, and fresh geometry/binding/persistence
  evidence. The two mobile Error renders and ReplayBadge specimen are fresh;
  eleven unaffected primary renders and two detail crops match r3 byte for byte.
  Server revision 175 confirms all ten badge geometries, 217 color bindings,
  no invalid Overview geometry, and absence of the corrupted Card subtree.
  Both mobile Error exports repeated after persistence are byte-identical.
  Manifest SHA-256:
  `068dd96fe81ec5c7cef8b2324df81e9d04795183bf498024c7d6b0c8ca20002e`.
  All rounds defer production behavior, keyboard, API, SEO, performance, and
  implementation tests.
- Round 4: `overview_review_a_r4` and `overview_review_b_r4`, both fresh
  GPT-6.1 Sol / high, approved the whole bounded result with no new candidates.
  A independently derived A1-A10 coverage before receiving the author ledger;
  reconciliation found no missing or unnecessary requirement. Both inspected
  all 14 primary renders and both detail crops and independently checked all
  23 manifest digests. No new candidate was retained.
- A follow-up process audit found that the impacted Luna geometry check had
  not been repeated after r4. Fresh GPT-6 Luna / medium verifier
  `badge_geometry_verify_r4` closed this gap on the same unchanged snapshot.
  It independently compared all 30 persisted root/skin/label records against
  component proof and all ten current consumer records: zero mismatches.
  Native RU/EN exports show complete labels without collisions; both repeat
  export hashes match. Resolution: r3.1 fixed for the static geometry claim.
- Fresh read-only receipts in `overview-v7-r4-closure` confirm the unchanged
  SDK geometry and server revision 175. No design mutation followed the two
  Sol approvals, so those whole-result reviews remain applicable. Earlier
  Bounty punctuation and StateFeedback copy/token investigations are unchanged;
  r4 Sol reviews rechecked their current pixels and bindings. The new Luna
  pass covers the localized replay sizing affected by r4.
  Closure receipt manifest SHA-256:
  `50ad30972d3ca04b50a886d0599dfe27f6a8f8323b18ed76c6c39f47e7d80cff`.

<!-- markdownlint-disable MD013 -->

| Coverage | Failure question and evidence | Owners | Snapshot | Outcome |
| --- | --- | --- | --- | --- |
| Intent and states | Do All-time Empty and local Error communicate truthful recovery while preserving healthy sections? Eight state renders and BRIEF. | A r4, B r4 | r4 / server 175 | Complete: pass |
| Composition and continuity | Do 390/1440 preserve hierarchy, density, alignment, localized fitting, and the 56px/60px shell? Eight renders and frame geometry. | A r4, B r4 | r4 / server 175 | Complete: pass |
| System and consumers | Are 18 StateFeedback and 14 ReplayBadge roots connected, token-bound, and content-sized? Component specimens and binding/geometry proof. | A r4, B r4 | r4 / server 175 | Complete: pass |
| Localized replay sizing | Do all ten badge labels fit after persistence, with matching root/skin/text geometry? Native exports, component proof, and server records. | Luna r4 | r4 / server 175 | Complete: r3.1 fixed |
| Data and copy | Are replay parse/outcome concepts distinct and five EN Bounty cards correctly formatted? Renders, detail crops, BRIEF, DESIGN.md. | A r4, B r4 | r4 / server 175 | Complete: pass |
| Artifact integrity | Do 29 root boards avoid collisions, visible text stay contained, and persisted badge geometry/color bindings match? Geometry and direct server proof. | A r4, B r4 | r4 / server 175 | Complete: pass |
| Evidence and handoff | Do hashes, unchanged-render reuse, repeat exports, and scoped acceptance claims agree? Manifest, checks, and iteration contract. | A r4, B r4 | r4 / server 175 | Complete: pass |

<!-- markdownlint-enable MD013 -->

- Aggregate decision: v7 is ready for the user's visual review. No supported
  Blocker, Important, or mandatory Polish deviation remains in this boundary.
  Overall Overview acceptance and SUMMARY.md remain pending. Server evidence
  proves actual geometry; sizing modes are SDK evidence. Future component
  propagation is not guaranteed by this static review.

## Iteration v8 — shared content and state parity

- Boundary: all 29 Overview root boards and directly affected Components
  composites. Prototype stage only; no application implementation or other
  page design. Baseline: web `f86a2c7`, plans `7cf9851`, server revision 175.
- Current user requirements supersede v7 approval: compact title/provenance;
  Processed terminology; identical Success/Offline data; exact two-axis
  Success/Loading geometry; one no-replay Empty message; centered feedback;
  compact local Error composition; trailing right alignment; shared ranking
  rows across responsive, scenario, and edge fixtures; squad side circle left
  of identity; squad Score rather than obsolete net kills.
- The user's supplied formula reference confirms squad Score as average kills
  divided by average attendance. Primary plans define player adjusted Score
  only. Do not substitute the player formula or old backend squad total.
- Evidence: immutable machine-local `overview-v8/baseline.json`, current user
  screenshots and copied-shape snapshots, fresh native renders and server
  receipts to be collected after edits. Preserve prior round evidence.
- Expected coverage: RU/EN Success at 390/834/1440/2560/3440; RU/EN Loading,
  Empty, Error, Offline at 390/1440; compact Squads/Bounty; actual row reuse in
  long-name, one-row, tied/negative Score and zero/tied Bounty fixtures;
  connected shared composites and authenticated Afgan0r shell.
- Checks: root-board collisions; finite geometry; visible containment; row and
  column parity for Loading; value/format/order parity for Offline; token and
  component bindings; persisted content identity. Static geometry is prototype
  evidence, not a claim that production CLS has been measured.
- Review depth: saturation, because shared rows and state transitions affect
  several consumer families. Two fresh Sol/high whole-result reviews, an
  independently derived coverage map, focused Luna checks and independent
  candidate verification, and a fresh closing omission pass remain pending.
- Production API calculation, runtime CLS, keyboard, accessibility, SEO, and
  performance remain implementation-stage deferrals. Overview acceptance and
  SUMMARY.md remain pending.
- Initial independent source/render review used persisted revision 209,
  `overview-v8/server-r3.json`, and all 29 native board exports recorded in
  `renders-r1.json`. Geometry, candidate, and token investigations are retained
  separately in the same machine-local evidence set. These are preliminary
  reviews, not completion approval.
- Confirmed candidates: v8.1 misplaced Edge Bounty header; v8.2 compact
  scenario segments incorrectly changing global navigation; v8.3 account-menu
  fixture drift; v8.4 stray root text artifact; v8.5 missing actual one-squad
  and one-replay specimens; v8.6 stale text glyphs despite updated content;
  v8.7 data-colored initial-loading indicators; v8.8 untranslated EN tablet
  fields; v8.9 missing token bindings on new shared text slots.
- Coordinated repair round 2 is in progress. Its current client changes are
  not yet reconciled with server persistence or fresh native exports. Browser
  suspension interrupted the token-binding operation; do not infer either
  successful completion or lost edits from the timeout. Resume from the
  existing client, inspect actual progress, and finish the remaining fixtures
  before recording the immutable round-2 snapshot.
- Fresh reviewers `overview_v8_r2_review_a` and
  `overview_v8_r2_review_b` are deriving independent coverage before receiving
  the author ledger. Both request GPT-6.1 Sol / high with fresh context. Final
  whole-result review, impacted mechanical rechecks, candidate closure, and
  the closing omission pass still remain pending.
- A subsequent autosave report identifies a different concrete failure:
  `main-instance-not-a-variant` and `invalid-variant-properties` in the existing
  StateFeedback variant container. The new localized mains and text labels
  had been appended as ordinary children of that container. Moving them into
  a separate ordinary specimen board restores the client's expected variant
  structure, but the rejected queue still prevents persistence; the server
  receipt remains at revision 215.
- Recovery artifact `overview-v8-r2-client-recovery-20261004` retains the four
  corrected localized mains, eight consumer captures, shared text-slot
  geometry/bindings, and reconstruction helpers. Its machine-local locator is
  `$CODEX_HOME/visualizations/2026/09/16/01a0a9c5-1326-72d0-9e98-b540f2ee00e6/overview-v8/recovery/locator.json`.
  All three retained payloads were re-read and their SHA-256 digests verified;
  Windows ACLs restrict the recovery directory to the user and SYSTEM.
  After clearing the rejected client queue, recreate the localized mains
  outside the existing VariantContainer, register their new component IDs,
  and remap the eight consumers. Do not replay the rejected container edits.
- Recovery continued with four ordinary localized feedback components at the
  Components canvas root. Direct server revision 217 confirms all four
  registrations; revision 218 confirms their eight Overview consumers.
- Server revision 219 retains the six EN tablet field additions, fresh RU
  Diamond Dogs text slots, neutral token bindings on the fifteen initial
  Loading indicators, and the shared text token updates. Scenario navigation
  and the Edge Bounty header are already correct in this persisted snapshot.
- Refreshing the five affected RU squad table copies timed out after the
  browser suspended the plugin tab. The revision-219 server receipt contains
  no replacement squad table heads. Do not replay the batch blindly: inspect
  `storage.refreshedR2` and the existing client after the tab wakes, then
  reconcile partial progress. The remaining table consumers, one-squad and
  one-replay specimens, current renders, and final independent review remain
  incomplete. Do not refresh the browser while this client work is pending.

### Revision 247 review candidate

- The interrupted five-table refresh completed and persisted at revision 220.
  Subsequent repairs reached revision 236: remaining table consumers, actual
  one-squad and one-replay Edge specimens, localized text, neutral Loading
  markers, and visible text-slot token bindings. The stale plugin client was
  refreshed only after server persistence was confirmed.
- Independent candidate verification confirmed v8.10 missing desktop player
  and squad population totals, v8.11 lost compact Offline rotation context,
  and v8.12 invisible Error icon geometry. The half-pixel Bounty segment box
  difference was rejected as a visible defect.
- Desktop shared player/squad headers and consumers now retain their All
  destination with localized totals. Compact Offline retains rotation context
  and adds a separate notice below the header without moving cached tables.
- Native rendering exposed v8.13: nested geometry replay left icon paths and
  text glyphs offset from their centered Heading frames. Independent source
  and pixel verification confirmed the clipping. Normalize all four localized
  feedback sources, center the absolute action labels with constraints, and
  instantiate all eight Empty/Error consumers directly from those sources;
  do not replay nested geometry over a fresh instance.
- Final candidate: server revision 247, source SHA-256
  `f14d169b35bd37b3eacda65180dd9a687bc368b078bbf0468517db5c92287a5a`.
  The machine-local `overview-v8/renders-r4.json` identifies all 29 native
  screen renders and 15 shared-component specimens. Older native renders are
  used only after exact persisted-subtree equality against revision 247.
- Deterministic client checks: 29 root boards, zero board intersections, zero
  invalid coordinates, and zero icon/glyph/action-center offsets in all eight
  feedback consumers. Source and native evidence remain distinct checks.
- Fresh reviewers `overview_v8_r4_review_a` and `overview_v8_r4_review_b`
  independently derived the whole-result coverage before the author ledger;
  requested routing is GPT-6.1 Sol / high / fresh context. Their final reviews,
  impacted focused verification, and closing omission pass remain pending.
  This candidate is not acceptance or permission to create SUMMARY.md.

### Revision 248 review candidate

- Round-4 Reviewer A blocked on v8.14 and v8.15; Reviewer B approved its
  individual inspected scope with no supported new findings. The independent
  focused verifier confirmed both remaining mandatory binding deviations.
  Aggregate approval was therefore withheld.
- v8.14: restore `color.text-muted` on both desktop Offline replay-provenance
  slots. Cached Success styling now remains intact; the persistent Offline
  notice keeps its separate semantic warning color.
- v8.15: bind the existing `font.size.2xs` token to all five standalone RU
  replay-provenance slots in mobile/tablet Success, mobile Error and the two
  mobile segment scenarios. Their 11px size and layout remain unchanged.
- Reviewer B independently inspected the half-pixel EN Offline Bounty-label
  measurement/raster difference. It does not clip, change content, move the
  segment frame, or alter data geometry; it remains a rejected consequential
  defect, not a claim of mathematically identical text bounding boxes.
- Server revision 248, source SHA-256
  `ab7fd745fb6ba14220fc246dcea96707135eca712e8bc4e8848d6d274d258f7b`.
  Machine-local `overview-v8/renders-r5.json` admits all 29 screen renders and
  15 component specimens: seven fresh native exports, 22 board subtrees
  proven exactly unchanged from revision 247, and an exactly unchanged
  Components page. `preflight-r5.json` confirms all seven bindings, unchanged
  text boxes, 29 roots, zero root intersections and zero invalid geometry
  across 29,015 shapes. Existing feedback checks remain valid through exact
  subtree equality, rather than assumption.
- Fresh reviewers `overview_v8_r5_review_a` and `overview_v8_r5_review_b`
  independently derived coverage from the raw requirements before receiving
  this ledger; requested routing is GPT-6.1 Sol / high / fresh context.
  Both whole-result reviews, fresh impacted provenance verification, and the
  closing omission/boundary pass remain pending. No user acceptance or
  SUMMARY.md is inferred.

### Round-5 remaining corrections

- Both whole-result reviewers completed the revision-248 review. They
  retained v8.16, a mandatory typography-token binding gap in nine local
  source or standalone text slots; Reviewer A also retained v8.17, the
  missing paired icon in all four persistent Offline notices.
- Fresh independent verification closed v8.14 and v8.15 and confirmed
  v8.16 and v8.17. A broader token scan raised additional inheritance
  candidates; those require checking the actual connected UIKit sources
  before admitting or rejecting them. The UIKit snapshot is revision 137.
- Server readback still confirms revision 248 and its exact recorded digest.
  The currently connected MCP client is older: the latest provenance
  bindings are absent and the compact Offline notice retains its earlier
  size. Product edits are held until that client is refreshed; saved server
  evidence remains valid. The completion and acceptance gates remain open.

### Revision 253 coordinated corrections and review candidate

- After the refreshed MCP client matched revision 248, apply v8.16 to the
  independently verified App Design anchors. The verification examined 148
  property groups across 840 consumer instances: 143 groups were confirmed;
  five proposed fill changes were rejected because the connected UIKit
  source already supplied the intended muted color. Bind 69 font-size,
  72 font-weight, and two fill properties at 72 App Design anchors. The
  connected UIKit remains at revision 137 and receives no edits.
- v8.17: replace the four plain Offline labels with instances of two shared
  RU/EN persistent notice sources. Each source pairs the connected Lucide
  wifi-off icon with the cached-data explanation. The row is centered,
  14px high, with a 14px icon on the left and an 8px gap; cached table and
  rotation-context positions remain unchanged. Normalize the icon source
  once, then instantiate it without replaying nested geometry.
- The token application normalized redundant text metadata and constraints.
  Do not claim byte-identical or metadata-only rendering equivalence.
  Export all 29 screens and 19 affected component specimens freshly; no
  revision-253 render is admitted through reuse of an older PNG.
- Server revision 253, source SHA-256
  `90af7a18705a986f27aa949847af3703e46f1c4b42d5934a63e76c7ea252c8b8`.
  Machine-local `overview-v8/renders-r6.json` identifies all 48 native PNGs
  with shape IDs, dimensions and digests. Its SHA-256 is
  `ac0de54d4467105b1eee37b59aae3e8b1303d5d94e8d50801226dcc892df0080`.
  `preflight-r6.json` confirms 29 root boards, zero root intersections,
  zero invalid coordinates across 29,077 shapes, all 143 requested bindings,
  and four notice rows with zero center offset and the intended icon order.
- `change-r6.json` is an intermediate operation record: its captured source
  geometry precedes the final icon-order correction. Use the persisted
  revision-253 source, preflight and native exports for final geometry.
- Fresh whole-result reviewers `overview_v8_r6_review_a` and
  `overview_v8_r6_review_b` derived coverage before receiving this ledger;
  requested routing is GPT-6.1 Sol / high / fresh context. Fresh focused
  verifiers inspect binding inheritance and Offline parity. Both whole
  reviews, focused closure, candidate adjudication and the closing
  omission/boundary pass remain open. A suspected mobile Bounty count,
  long replay-label evidence and Offline color applicability are being
  independently checked. This record does not imply acceptance or SUMMARY.md.

### Revision 253 review results and evidence reconciliation

- Both whole-result reviews completed the 29-screen and 19-component scope,
  after independently deriving coverage from the raw requirements. Aggregate
  completion remains blocked while the mobile Bounty count, generic feedback
  specimen, and long replay-label coverage are independently adjudicated.
- The focused binding verifier traced all 840 consumer chains through 2,909
  shapes. All 143 confirmed groups resolve to the intended token and effective
  value; all five rejected fill groups trace their 210 consumers to the
  connected UIKit's existing muted token. No consequential typography or
  geometry drift was found. Report SHA-256:
  `c21bad9ba14d6c115d6e4392c63ad54dba37e1db7c141781f21408786898f482`.
- Fresh Offline verification completed all 28 required source reads, four
  native Offline/Success comparisons and numeric pixel differences. Cached
  content, order, formats, rotation context and table/card geometry pass.
  The EN mobile Bounty tab has an inconsequential half-pixel label offset;
  sparse residual pixels do not alter data. Report SHA-256:
  `5a1623b12ab95fd358bf1818957183d23d42292f3f5143fd753bbb1114e0dc10`.
- The Offline color candidate v8.18 is rejected: the live-connection freshness
  pill recipe does not directly govern the separate persistent cached-data
  warning. Canonical amber permits warning/stale content, and the notice
  identifies the condition with both icon and copy.
- The selected NavigationLink color suspicion is withdrawn after source and
  pixel verification: its primary-weak fill has 13% opacity, and the native
  PNG has alpha 33. The isolated transparent preview was misleading; actual
  dark Header compositions retain legible cyan content.
- `renders-r6-final.json` supersedes the intermediate manifest's legacy
  digest fields. Its SHA-256 is
  `569e9e3154d5d2115c2340beef7464980db1bb0a24dd24573f833ee6c3f1a5db`.
  All 48 PNG bytes, IDs, dimensions and revision-253 source remain unchanged;
  both reviewers independently checked the definitive PNG digests.
- A scoped glyph-data preflight compares 3,040 visible text records, excluding
  3,876 hidden records under the shared content slots. Only three visible
  content/position-data mismatches remain, all in the old generic Empty
  specimen. This source check supplements its native evidence; it is not
  approval based on the text content field alone.

### Revision 257 feedback and long replay-label corrections

- Fresh candidate verification rejects the mobile Bounty count claim: the
  plans permit a full player ranking sorted by Bounty, including zero values.
  The fixture population is illustrative; no separate production eligibility
  contract is asserted. The selected-navigation and Offline color candidates
  are also rejected against their actual composition and recipe scope.
- Confirmed required corrections are the generic StateFeedback specimen's
  stale glyph data/left alignment and missing long mission/map coverage in
  the existing Edge replay card. No other page or connected UIKit is edited.
- Reflow the six generic feedback text nodes with centered alignment. Native
  evidence now shows the current Empty/Error messages, centered explanations
  and actions. The two component identities and main bounds are retained;
  this generic specimen has no current Overview consumers.
- Replace only the existing Edge mission/map fixture text with long stress
  labels. A bounded nonzero width nudge triggers fixed-text measurement, then
  restores the original 762px/657px widths. The native mission is 651.93px and
  map label 590.40px; both fit their original rows without touching badges.
- Server revision 257, source SHA-256
  `cb80df9cadb8052dab2a77d2fe10fab21067763608e6821bcc52f664a4fd3275`.
  `renders-r7-final.json` admits two fresh native exports and 46 earlier PNGs
  only after exact persisted subtree equality and exclusion of dependencies
  on the changed generic component. Tokens and connected UIKit revision 137
  are unchanged. The 29 screens remain canvas-root boards.
- Preflight retains all 143 bindings, finds no invalid coordinates, and compares
  3,040 visible text records with zero glyph-data mismatches. Hidden legacy
  content slots are excluded; no hidden text is deleted for this correction.
- This is a coordinated fix round. Two fresh whole-result Sol/high reviews,
  focused correction verification, candidate closure, and a fresh closing
  omission/boundary pass remain required. Acceptance remains with the user;
  no accepted SUMMARY.md or runtime verification is claimed.

### Revision 257 completed coordinated reviews

The bounded task remains the 29 Overview root boards and 19 directly affected
Components specimens. Two fresh GPT-6.1 Sol/high reviewers derived coverage
independently before the author ledger, inspected all 48 native images, then
reconciled the completed checks. Both approve the static prototype with zero
retained findings or unresolved required prototype checks. Their current
source and render evidence is revision 257; user acceptance remains separate.

<!-- markdownlint-disable MD013 -->

| Check | Owner and evidence | Outcome |
| --- | --- | --- |
| Whole bounded result and omissions | Fresh `overview_v8_r7_review_a` and `overview_v8_r7_review_b`; independent coverage artifacts and native inspection | Complete; no retained findings |
| Tokens and connected consumers | Fresh r6 binding verifier; 143 groups and 840 chains; r7 exact unchanged-source proof | Complete; bindings retained |
| Cached Offline parity | Fresh r6 Offline verifier; four native/source pairs; r7 unchanged-source proof and whole reviews | Complete; content, order, formats and context retained |
| Candidate adjudication | Fresh r6 candidate verifier; raw contract and refuting evidence | C1/C2/C4 rejected; C3/C5 corrected |
| Feedback and long replay labels | Fresh `overview_v8_r7_focus`; source, native exports and digest audit | Complete; both corrections verified |
| Artifact integrity | Lead preflight and independent A/B/focus checks; stable server readback, exact subtree admission | Complete; 29 root boards, zero collisions/invalid points/glyph mismatches |
| Closing omission/boundary pass | Fresh `overview_v8_r7_closing`, GPT-6 Luna/medium; raw coverage before completed ledger | Complete; no new material direction |

<!-- markdownlint-enable MD013 -->

The focused report initially transcribed one Edge digest character incorrectly.
Its author recomputed all 48 hashes into `digest-audit-r7.json`, corrected the
report and re-read it; the lead and Reviewer B independently matched both fresh
report digests to actual bytes. No source, PNG or reviewed revision changed.

Applicable static checks include intent, composition, reference relationships,
shared consumers, realistic content, responsive continuity, intended states,
persistence and evidence integrity. Live keyboard/ARIA, API/auth behavior,
production score delivery, runtime CLS/CWV, SSR/SEO and Ladle implementation
remain implementation-stage obligations. No static missing width or state is
excused through those deferrals. No accepted SUMMARY.md is manufactured.
Definitive r7 evidence digests:

- Manifest:
  `e7e02b5ad2e499e716f55b0f52032fd226ad7d937e15dea06d52f93a84c9674b`
- Review A:
  `34efb8399ed207a749d9a61750a700a8ee4e80e9825dcd7189ce8dbb6baebfdc`
- Review B:
  `88aa7539cc9291ea0afa8c9244216aaf82f4c6facfb1731f8f04604659c69b83`
- Focused verification:
  `a8e229b1d88eb53d16d051e89b9354ad2709647f5e23deb6b507a06d1f416d55`

### Revision 257 closing candidate adjudication

- The closing pass surfaced C-r7-copy-1, a possible Russian-copy issue in the
  one-player Edge explanation. Its initial independent verification was not
  admitted because mandatory source reads had been truncated. The same
  assignment then personally completed all 33 required files and reassessed
  applicability against the native board and product terminology.
- The verifier rejects a mandatory defect: this board explicitly identifies
  itself as a demonstration rather than an application page, its fixture notes
  are technical, and `raw score` is established product terminology. The
  explanation remains comprehensible for that audience. A smoother phrasing
  would be optional if later reused as customer-facing copy; no optional
  refinement is applied automatically.
- The final report preserves the provisional initial assessment and completed
  read audit. Its SHA-256 is
  `b5565f3eee25355475021c2a557b25bff9e134d8e1500eba638d8a1526a37d96`.
  No source or PNG changed during this adjudication; the existing whole-result
  reviews and focused checks still apply to revision 257.
- The closing reviewer personally completed its 28-file chain, compared its
  independently derived coverage with the completed ledger, and reconciled the
  final candidate verification. No supported material direction remains in the
  bounded static prototype. Earlier incomplete/provisional attempts remain
  explicitly recorded; their conclusions are not used as approval.
- The final server receipt exactly matches the reviewed revision-257 source.
  Static review is complete. User acceptance and implementation remain separate;
  neither an accepted SUMMARY.md nor runtime CLS verification is asserted.
- This closure produces no new accepted durable product decision. Temporary
  review status and raw evidence are retained locally rather than captured as
  project memory. Session lessons remain outside this task at the user's request.
- Closing report SHA-256:
  `4a71a568466ff04dd58715dc02424ec6e3d789ad591fd96083a67723f5187d1b`.
  The lead labelled one resolved boundary sentence as historical rationale;
  the independent outcome and completed read audit are unchanged.

### Retained evidence handoff

Logical artifact: `overview-v8-reviewed-prototype-20261005`.

<!-- markdownlint-disable MD013 -->

Stable machine-local locator: `$CODEX_HOME/visualizations/2026/09/16/01a0a9c5-1326-72d0-9e98-b540f2ee00e6/overview-v8/evidence-locator.json`.

<!-- markdownlint-enable MD013 -->

The locator records revision 257, source/render identities, exact local paths
and digests. All 262 retained files were re-read and digest-verified after
applying private Windows ACLs: inheritance disabled, host user owns every item,
and only the host user and SYSTEM have access. Locator SHA-256:
`027813f55ee47224c68ccd1da16fec3c55d1930c6709dce21096c88890acb341`.

Historical client recovery remains separately identified as superseded; never
restore those snapshots or replay their obsolete geometry helper. One-off
author/reviewer helper scripts were removed. No private source corpus, access
token or raw review report is committed to Git.
