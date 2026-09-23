# Stats Overview Iterations

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
