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
