# Players List Iterations

## Figma UIKit Select Draft

- Date: 2026-11-18. [Select](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=121-160)
  contains reusable Trigger and Option component sets. Trigger variants
  use linked Secondary Button instances with the native label and a
  chevron in the Trailing icon slot. The period example
  shows closed and open states with the same trigger width, a Lucide chevron
  and a checked selected option. Triggers and options use content-based
  height with a 44 px minimum. Period labels illustrate the composition.

## Figma UIKit Foundations And Player Search

- Date: 2026-11-18. The [UIKit page](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=10-2)
  has the SolidStats token collections, typography and effect styles. Lucide
  is a connected external library. Wireframe controls and player-specific
  row, metric and header masters live in
  [Players / Local components](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=56-2692).
- [Button](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=60-2)
  has Primary, Secondary and Ghost across five states. It hugs content, with
  a 44 × 44 px minimum target and 16 px horizontal padding. The matrix and
  layout examples share one content-sized panel. The Leading icon and
  Trailing icon slots are independently optional and empty by default.
  Each accepts one 20 × 20 px Lucide icon. Button Auto Layout owns the
  8 px gap. The panel shows leading only, trailing only and both.
  The existing implementation annotation predates the two-slot design.
- [Input](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=64-2)
  hugs its contents with a 44 px minimum. Its Focus state shares Button's
  cyan 2 px outline with a 2 px offset. Input uses that treatment for focus
  of any origin. Button shows it for Focus visible.
- [Search field](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=88-53)
  uses a leading Lucide search icon and a full-height Secondary submit
  button. The button's left border forms the divider. A filled field shows
  a clear icon before submit. Empty and filled, input focus and submit
  focus-visible specimens all measure 44 px and derive their height through
  Auto Layout. The user accepted the divider treatment and requested removal
  of the comparison board. This is component-level acceptance.
- Input v1 follow-up: applied `text-muted` to enabled placeholders, including
  the nested Input in Search field. Added `border-control` and
  `border-control-hover` from `DESIGN.md` to the Figma palette and applied
  them to the enabled Input. Invalid and Invalid + Focus use the 1 px
  `border-control-invalid` (`#B84A59`) border. Invalid + Focus adds the 2 px
  `loss` offset ring with a 2 px gap. The Input matrix has twelve specimens
  and retains the implementation annotation.
- Added [Field](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=97-40)
  with a sentence-case label, required marker, replaceable control, helper
  text and a separate error message. The panel starts with one labeled Input
  matrix showing Empty and Filled across Default, Hover, Focus, Disabled,
  Invalid and Invalid + Focus. The filled specimens retain the same value
  and helper when the error appears. Concrete usage examples follow the
  matrix, starting with Search field. The existing Input and Field decisions
  are recorded in SolidStats memory.

## 2560px Viewport Trial

- Date: 2026-11-17. Added a 2560px viewport using the same 1440px content
  cap under review at 1920px, centered with 560px gutters. The table retains
  16px column gaps, sixteen weekly bars, and the final numeric-limit row.
- Inspected the native screenshot and checked the container and track widths.
  This is a trial, not acceptance of a global maximum content width.

## Mobile Rank Alignment

- Date: 2026-11-17. Aligned the mobile rank header and values to the right,
  matching wider tables. Verified all seven rows and the mobile screenshot;
  the rank track remains 34px wide.

## Truncation In Numeric Limit Row

- Date: 2026-11-17. Extended both the player and squad names in the final
  numeric-limit row so they truncate at every current viewport, including
  the widest 1920px specimen. Both retain one fixed-height line.
- Verified truncation settings in all five views and inspected the widest
  row, where both ellipses are visible.

## Numeric Limit Row In The List

- Date: 2026-11-17. Moved the numeric-limit example after the six player
  rows and before the loading continuation at all five viewport sizes.
- Removed its background and applied the same player and squad link styles
  as ordinary rows. The maximum-value examples remain intact.
- Verified the row order and styles at every size and inspected the mobile
  screenshot. The example remains synthetic, not a real player record.

## Mobile Column Gaps At 8px

- Date: 2026-11-17. User requested 8px mobile column gaps. Updated the shared
  identity/history/Score row and its header; wider tables retain 16px.
- Preserved the approved space-between supporting-stat row. Adjusted its
  left inset to follow the nickname, retaining both identity/Games and
  Score/K-D edge anchors.
- Inspected the native 360px screenshot and verified actual 8px gaps and
  both anchors in all seven rows, including the numeric-limit test. Row
  heights remain 121px. Weekly bar gaps stay 4px.

## Header-Based Widths And Visible Numeric Limits

- Date: 2026-11-17. User refined the sizing rule: keep each fixed numeric
  column at its header width unless the expected value is wider. The same
  width governs header and body cells. No blanket spare width.
- User explicitly retained content-sized groups with space-between only in
  the mobile supporting-stat row, preserving both established edge anchors.
- Measured header text and numeric specimens in the actual wireframe fonts.
  Deaths stays 42px, its header width; Score and K/D are 42px to fit 99,99.
  Vehicle headers use intentional two-line copy. All tabular gaps remain 16px.
- User requested visible maximum-value examples and specified 99,99 for
  Score/K-D. Added a shaded "Проверка ширины / Тестовые максимумы" row to
  each table, not a real player or a statistically coherent record.
- Other maxima are agent proposals, not accepted data limits: rank/games
  9999; kills/deaths/vehicle kills 99999; vehicles destroyed 9999; teamkills
  and deaths from teamkills 999; Bounty 999999. They remain visible for review.
- Measured every visible numeric test value against its actual cell width;
  all fit. Native screenshots inspected at all five sizes. Test rows retain
  the same height as real rows: 121px mobile, 77px otherwise.
- Current views have four weeks at 360/768, thirteen at 1024, sixteen at
  1280/1920. Tablet again includes vehicle kills and teamkills; 1024 again
  shows the full summary. Ellipsis handles flexible identity widths.
- The 1440px cap remains a local 1920 trial. Common sizing rules live in
  DESIGN.md; no production token or generated CSS was changed.

## Shared Table Sizing And A 1440px Cap Trial

- Date: 2026-11-17. User required 16px column gaps and numeric tracks sized
  to expected values plus a small allowance, with flexible text columns
  taking remaining space. Explicit follow-up: this applies to all tables.
  Recorded the product-wide rule in DESIGN.md without changing token values.
- User separately approved trying a 1440px content cap on the 1920 specimen.
  Header/content are centered with 240px gutters. The global 1760px token is
  unchanged; the cap remains a local experiment awaiting visual acceptance.
- Applied one fixed numeric-track scheme to tablet/laptop/desktop masters.
  Mobile also uses 16px gaps and fixed metric tracks, retaining the left
  identity/Games and right Score/K-D anchors. Weekly gaps remain 4px.
- Following the existing removal priority, current specimens show: 360 core
  with four weeks; 768 core plus Bounty with four weeks; 1024 all except
  vehicles destroyed with four weeks; 1280 and 1920 full summary with sixteen
  weeks. Hidden component fields and older bars remain available for wider
  variants; no fixture values were deleted.
- All five native screenshots inspected. Read-back checks across thirty rows
  confirm actual 16px column gaps, 4px weekly gaps, no horizontal overflow and
  unchanged row heights (121px mobile, 77px others). Header/data tracks agree
  in the desktop cap trial. Production numeric ranges remain to be checked
  against real data; these widths are design choices, not a data-limit claim.
- Earlier per-size approvals predate this global correction. Revised density
  and visibility are presented for review; the whole page is not accepted.

## Uniform Weekly Bar Gaps

- Date: 2026-11-17. User specified 4px between weekly bars at every width.
- Bound all five chart masters to the same 4px spacing variable. Desktop
  chart width shrank from 312 to 252px; its header track matches, and identity
  absorbs the released 60px. Bar widths and values remain unchanged.
- Read-back verified actual 4px gaps in all 30 charts across 360, 768, 1024,
  1280 and 1920px. Inspected the corrected desktop screenshot. This revises
  D3's proposed 8px chart gap; other sizes already used 4px.

## D3 — Desktop At 1920px

- Date: 2026-11-17. User accepted 1280 with lgtm and requested the next size.
  Proceeded to the next primary review width, 1920px; 1536 remains an
  intermediate token breakpoint, not a separately approved specimen.
- [1920px proposal](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=35-783):
  frame `35:783`, 1920 by 798px. Header and content use Fill with maxWidth
  1760 and centered parent alignment, producing equal 80px side gutters.
- Desktop row/header masters: `35:10` / `35:44`. Full summary, 16px gaps,
  wider numeric tracks, 408px identity and 312px history. Sixteen bars retain
  their values, with 12px bar width and 8px gaps for the wider view.
- Native full-frame screenshot and structure verified: all thirteen column
  tracks align for six rows, no horizontal overflow, all rows remain 77px,
  text and bar heights match 1280, link/no-squad styling and single-line
  truncation persist. Fonts remain IBM Plex Sans/Mono; no rasterized UI.
- Smaller components were not modified. The 1280 frame only received its
  acceptance name. Status: 1920 is a proposal awaiting feedback.

## D2 — Roomier Full Summary At 1280px

- Date: 2026-11-17. User said lgtm after the column-order changes and requested
  the next size. Marked the 1024px structure accepted; exact breakpoint
  thresholds, hi-fi and remaining states are still outside this acceptance.
- [1280px proposal](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=34-565):
  frame `34:565`, 1280 by 798px. New wide-row/header masters `34:10` / `34:44`.
  Full metrics and sixteen-week charts are unchanged. Distribute extra width
  into 12px column gaps, wider numeric tracks and a 260px identity column.
- Compared all six rows against 1024: all text and bar heights match, each
  row remains 77px high, and every header track aligns with its data cells.
  Link underlines, plain no-squad labels and one-line ellipsis are preserved.
- Inspected the native full-frame screenshot: no horizontal overflow or
  flattened UI images; IBM Plex Sans/Mono retained. Smaller row masters and
  frames were not changed, except the 1024 acceptance label.
- Status: 1280 proposal awaiting user feedback.

## Metric Order And Vehicle Labels

- Date: 2026-11-17. Applied the user's metric order and full vehicle labels.
  After clarification, Teamkills stays immediately after Vehicles destroyed.
- Full order: Games, Kills, Vehicle kills, Vehicles destroyed, Teamkills,
  Deaths, Deaths from teamkills, Bounty, K/D, Weekly history, Score.
  The tablet uses the same relative order for its visible columns. Mobile's
  core order already agrees and was not changed.
- Renamed headers to "Убийств из техники" and "Уничтожено техники". Expanded
  their tracks to 64 and 80px so labels fit in two lines. Identity remains
  flexible: 180px on tablet, 148px at 1024. Weekly charts retain 4/16 bars.
- Updated shared row/header masters together. Native screenshots and read-back
  confirm matching columns in all twelve rows, preserved data, no horizontal
  overflow and unchanged 77px row heights.
- The initial label request failed at the transport layer. A successful read
  confirmed unchanged labels before the combined update was applied.

## Compact Title And Freshness Group

- Date: 2026-11-17. User requested placing freshness below the title inside
  the title/period container, removing its extra full-width row.
- At 360, 768 and 1024px, grouped title and snapshot age vertically beside
  the period selector. The heading shrank from 70 to 56px; following controls
  moved upward by 14px through normal auto layout. Player rows are unchanged.
- Inspected heading renders at all three widths and the complete 1024px
  composition; no horizontal overflow. Frame heights are now 1116px for
  mobile and 798px for both wider specimens.

## D1 — Full Summary At 1024px

- Date: 2026-11-17. User said lgtm and requested the next size. Recorded
  acceptance of the current smaller wireframe structures, not hi-fi, all
  states, runtime behavior or exact breakpoint thresholds.
- [1024px proposal](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=29-299):
  frame `29:299`, 1024 by 812px. Full SG summary adds deaths from teamkills
  and vehicles destroyed; history reaches sixteen individual weeks.
- New full-row main `28:10` and header `28:44` derive from the tablet family.
  All six rows are linked instances; thirteen header tracks match every row.
  Content width is 976px, with 180px for identity and 188px for history.
- Preserved visible long-name and long-squad fixtures, one-line ellipsis,
  underlined links and plain no-squad labels. All rows remain 77px high.
  Older weekly bars and additional summary figures are illustrative;
  the latest four bars and existing figures match the smaller specimens.
- Native 1024px screenshot inspected: no frame overflow, 96 bars, matching
  columns, correct identity decorations and no flattened UI images.
  IBM Plex Sans/Mono fonts verified. Mobile and tablet retain their previous
  dimensions and equal row heights; their row masters were not changed.
- Status: D1 is a proposal awaiting visual acceptance. No production code,
  skeleton transition or runtime CLS verification was added.

## Player And Squad Link Affordances

- Date: 2026-11-17. User approved the truncation result and requested
  underlining player/squad links, excluding the no-squad label.
- Added shared Player-link and Squad-link text styles to both row masters.
  The four "Без отряда" instances retain the plain label style.
- Inspected native screenshots and identity-node read-back for both frames:
  all 12 player names and eight squad names are underlined; four absence
  labels are not. Identity text remains 20px high with ending truncation.
  Frame sizes remain 360 by 1130 and 768 by 812px. These are visual link
  affordances; destination navigation is not implemented in the wireframe.

## One-Line Identity And Stable Row Geometry

- Date: 2026-11-17. User rejected growing identity text because loaded rows
  would shift after replacing skeletons. The two-line nickname reservation
  proposal was also rejected. Accepted: one nickname line, one squad line,
  and ellipsis for overflow; the user explicitly confirmed truncation.
- Updated nickname and squad text in both shared row components. Each has a
  fixed 20px text box, flexible width and ending truncation. Full fixture text
  remains in component properties; ellipsis is rendered, not manually typed.
- Retained spaced and unspaced long nicknames and added a long squad in both
  specimens. Native screenshots confirm ellipsis, no wrapping and intact
  adjacent metrics. All six mobile rows measure 121px; all six tablet rows
  measure 77px. Frames return to 360 by 1130 and 768 by 812px respectively.
- Skeletons must match the loaded-row geometry at each width. No skeleton
  variant or live loading transition was implemented in this pass; equal
  static heights are not a measured runtime CLS result.
- This supersedes the previous wrapping proposal while preserving the user's
  accepted mobile composition and the unaccepted tablet proposal status.

## Visible Long-Name Examples — Mobile And Tablet

- Date: 2026-11-17. User pointed out that the displayed nickname did not
  demonstrate overflow behavior. Earlier stress tests were removed before
  review, so they did not make that design choice visible to the user.
- Kept two long-name fixtures in both frames: a multiword Russian name and
  an unspaced Latin nickname. Both wrap to two lines at the current 188px
  identity width. No truncation or ellipsis is applied; this is a proposal.
- Native screenshots inspected for mobile 360 and tablet 768: names remain
  visible, squad labels move below them and rows grow without overlapping
  following rows. No nodes exceed either frame. Final heights are 1170px
  mobile and 852px tablet; frame and component IDs remain unchanged.
- The long examples remain in the deliverables for user review, rather than
  being restored to shorter fixtures after validation.

## Mobile Acceptance And Tablet T1

- Date: 2026-11-17. User explicitly accepted the 360px wireframe and requested
  tablet next. Retained only the 360px mobile specimen, frame `13:10`, renamed
  to mark accepted structure. Hi-fi, remaining states and the entire page are
  not accepted by this checkpoint.
- [Tablet T1](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=22-167):
  Players page `0:1`, frame `22:167`, 768 by 812px. Six rows reuse the mobile
  identities and core figures. Navigation and controls use horizontal flow.
- Proposed table includes core metrics, Bounty, teamkills, kills from vehicles
  and four weekly bars. Vehicles destroyed and deaths from teamkills are the
  first omissions per the existing priority. This does not approve a column
  breakpoint or its exact threshold. Bounty and Score figures remain mock data.
- Added tablet row `21:10` and header `21:30` on UIKit. Identity fills available
  width; numeric tracks have intentional widths shared with the header. Heights
  follow content. The six rows stay connected to the tablet main component;
  accepted mobile component `12:34` was not changed.
- Corrected toolbar overflow after switching its direction: search fills the
  remaining width, game-type/sort controls hug content, toolbar height hugs.
- Final native screenshot inspected at 768px. No nodes outside the frame or
  absolute-positioned children; all eleven header tracks match all six rows;
  24 bars and six underlined Score actions. A long-name stress case grew its
  row from 77 to 117px and moved the following row without collision; restored
  the review fixture before final screenshot.
- Mobile read-back confirms 360 by 1130px, six original linked rows and
  preserved left alignment for Games. Only its outer width and frame name
  changed for the acceptance checkpoint.
- Status: mobile structure accepted; tablet proposal awaits user feedback.

## Figma F1.3 — Identity And Games Share A Left Edge

- Date: 2026-11-17. User accepted trying the first proposed alternative:
  Games aligned left with nickname/squad, remaining metrics aligned right.
- Changed only alignment inside the first metric group in shared row `12:34`.
  Content-sized groups and space-between remain. Score and K/D retain their
  shared right edge.
- Verified both anchors, intrinsic widths and remaining right alignment in
  all six rows at 360 and 390px; inspected the final 390px native screenshot.
- Two initial transport failures prevented editing and reading. Account access
  recovered; a successful read confirmed the old alignment before the edit
  was retried. Final read-back and screenshot confirm the applied result.
- Status: visual alternative for user feedback, not final page acceptance.

## Figma F1.2 — Intrinsic Metric Widths

- Date: 2026-11-17. User rejected F1.1's oversized visible gap before K/D
  and specified content-sized groups, space-between and right-aligned text.
- Cause confirmed in the shared row: the first three metric instances used
  Fill width with left-aligned text, while K/D had a fixed 48px width.
- Changed all four groups to Hug width, right-aligned values and labels,
  and SPACE_BETWEEN on their parent. K/D retains Score's right edge without
  a fixed-width exception. The change propagates through the shared row.
- Verified all six rows at 360 and 390px: intrinsic widths, right alignment,
  equal inter-group gaps, and matching Score/K-D right edges. Inspected the
  final native 390px screenshot. No new frames or components were needed.

## Figma F1.1 — K/D Beneath Score

- Date: 2026-11-17. User requested that K/D visually sit below Score.
- Updated the shared Player row `12:34`: K/D uses the same 48px column width
  as Score, with its value and label right-aligned. Other metrics retain
  left alignment and distribute the remaining width.
- Verified all six linked rows at 360 and 390px: Score and K/D share the
  same right edge and K/D sits below Score. Inspected the final 390px native
  screenshot. The frame and component identities are unchanged.
- This correction is user-directed; the overall page remains a draft.

## Figma F1 — Mobile Structure Trial

- Date: 2026-11-17. User authorized Figma and then narrowed the first pass to
  mobile only. Existing UIKit and Players pages were empty on inspection.
- Artifact: [Players F1](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=13-10),
  page `0:1`, frame `13:10`, final 390 by 1130px. No desktop frame was created.
- Rough grayscale composition: title and period, snapshot age, player search,
  SG/Mace/SM and sorting, six sample rows, continuation status and navigation.
  Weekly history precedes Score; games, kills, deaths and K/D sit below identity.
  No extra filters, global Score legend or explanation modal.
- UIKit page `10:2`: Control `12:25`, Segment `12:27`, selected Segment `12:29`,
  Metric `12:31`, Player row `12:34`. All six player rows remain instances of
  the same main component. Text properties expose identity, rank and Score;
  nested Metric instances expose their labels and values.
- Collection `VariableCollectionId:12:2` contains scoped grayscale wireframe
  colors and spacing, separate from production DESIGN.md. Shared text styles
  use IBM Plex Sans and IBM Plex Mono. No flattened UI images were imported.
- Verified the same frame at 390 and 360px by changing only its outer width:
  native screenshots inspected, no horizontal frame overflow, 24 weekly bars,
  and no absolute-positioned descendants. A long-name stress case at 360px
  grew the name from 20 to 60px and its row from 121 to 161px; following rows
  moved in flow without collision. Restored the review name and 390px width.
- Corrected Score underline loss using a dedicated shared Score-action text
  style; final read-back confirms all six Score values are underlined.
- K/D fixture arithmetic agrees with current server-2 parity-formulas.ts.
  Read-only source check used server-2 origin/master after fetch, commit
  4951b7d. Weekly Score is (kills - teamkills) / games in that source;
  totalScore is kills - teamkills. Neither establishes the old adjustedScore
  contract. Mock Score values and bar heights are explicitly illustrative;
  four-level classification was not applied.
- Page scrolling, sticky header and infinite scroll remain design intent;
  this is not a working interaction prototype. Six rows do not define a batch.
  EN, missing history, loading/error/empty variants and detailed interaction
  states remain later passes. User acceptance is pending.

## Wireframe v1 — Mobile Structure

- Scope: one RU 390 by 844 populated screen; four player rows.
- Requirements: Overview row reuse, four-week dynamics on narrow screens,
  supporting games/kills/deaths/K-D, and Score as the ranking metric.
- Baseline: Players page was empty. Overview and shared masters are read-only.
- Review contract: assess the whole bounded wireframe for content order,
  mobile density, long-name fit, correct K/D, four visible weekly bars per row,
  component linkage, bounds, collision, and persisted state.
- Later prototype passes: other widths/locales and absent/loading/error data.
- Artifact: App Design `5954a801-37cf-8094-8008-81f63a8ba3d3`, Players page
  `8a03bbe6-579f-808e-8008-81f69a4eb7b7`, board
  `dcf4be56-82af-804f-8008-d2bc116a0a16` (`WF v1 / Players / RU / 390`).
- Snapshot: persisted file revision 438, modified 2026-10-21T10:00:23.132993Z.
  Render SHA-256:
  `edcd9b2c73a3133edb42cd2f0d2b96c2e87adab6a9f615a09779087aa0360b8c`.
  Geometry SHA-256:
  `52f995f53489562164758ea2b3eba50361775d5f513e0db16a51aaeb4ea391e5`.
- Deterministic checks: one 390 by 844 board, four 342 by 88 row wrappers,
  sixteen visible weekly bars, no visible node outside the board, correct
  fixture K/D, descending Score. Existing components remain connected;
  mutations target new instances only. No shared master or Overview edits.
- Review depth: bounded local pass. Independent omission maps obtained before
  sharing the lead's ledger. Whole-result reviews completed by
  `players_wireframe_contract_review` and `players_wireframe_visual_review`,
  each requested GPT-6.1 Sol / high with fresh context. Both approve this
  bounded sketch with no Blocker or Important findings.
- Coverage ledger: intent/content, composition, source fidelity, fixture cases,
  current-width fit, static controls, component linkage, persistence, and
  evidence integrity assigned to both reviewers. Broader responsive/state
  coverage remains a later wireframe pass. Public delivery and actual runtime
  behavior are not applicable to this static structural proposal.
- Finding `r1.A1` (duplicate `r1.B1`), optional Polish: Ghost_9's no-squad label
  retains the underline used by squad links, implying a squad destination.
  Locator: `Secondary link`, `dcf4be56-82af-804f-8008-d2bc1c7090aa`, x84/y594.
  Independently confirmed from the render, source reference and mutation scripts
  by `players_wireframe_affordance`, requested GPT-6 Luna / medium, fresh context.
  Smallest refinement: plain muted absence text. No mandatory rule makes this
  blocking; no optional refinement applied pending user choice.
- Evidence boundary: preservation is supported by the instance-only mutation
  scripts and component IDs, without an independent pre/post master-tree diff.
- Gate: APPROVE for this first structural sketch. Both whole-result reviews,
  deterministic checks and candidate verification are complete. No material
  question remains within the bounded pass; no saturation wave is warranted.
- Decision: draft; awaiting user feedback on the structure. Review approval
  does not establish user acceptance or permission to start hi-fi.

## Wireframe v1.1 — Remove Unrequested Filters

- User correction, 2026-10-21: filters were never agreed; remove the button.
- Removed only the `Filters / placeholder` instance from the existing board.
  Other controls, content and geometry remain unchanged.
- Updated the brief to exclude filters and their future state variants.
- User explicitly waived independent reviews for each wireframe edit while
  the structure is being explored. No new review agents were dispatched.
- Verification: live board read-back confirms the filter instance is absent;
  fresh project-file metadata confirms App Design revision 439, modified
  2026-10-21T10:20:25.946173Z (previously 438). UIKit remains revision 137.
  The optional refreshed PNG export timed out; no new visual-review claim is
  made. The revision increment confirms the write flushed.
- Earlier `r1.A1` remains optional and untouched. The sketch remains a draft.

## Wireframe v2 — Rough Grayscale Structure

- Date: 2026-10-23. The user rejected the previous appearance as premature
  hi-fi and confirmed a return to a rough grayscale wireframe.
- Rebuilt the single mobile draft using plain text and neutral rectangles.
  Removed product colors, iconography, rounded component styling, underlined
  links and styled navigation. Overview supplies the information hierarchy;
  its finished components remain inputs for the later hi-fi stage.
- Retained period, search, sorting, four populated players, all requested
  statistics and four weekly placeholders per player. Filters remain excluded.
- Replaced the previous draft board on the Players page; no extra alternative
  boards were added. Overview and shared masters were not edited.
- Current board: `d3e567ab-6d33-8007-8008-d5008229b30e`,
  `WF v2 / Players / RU / 390 / Low-fi`, 390 by 844.
- The user-authorized rough-fidelity pass uses neutral primitives instead of
  connected production-style components. This is a local wireframe exception,
  not a change to the shared design system or implementation conventions.
- Per-change independent review remains waived by the user during wireframing.
  No review agents were dispatched.
- Verification: exported the persisted board and inspected the full 390 by 844
  render. Fresh file metadata reports App Design revision 440, modified
  2026-10-23T04:08:07.854608Z; UIKit remains revision 137. Geometry confirms
  one board, four 350 by 88 row blocks, sixteen weekly bars and no child outside
  the board. The render has plain grayscale styling and all requested fields.
- Earlier `r1.A1` no longer applies: the rough pass uses plain secondary text
  for every squad/absence label, with no link decoration.
- Decision: draft for discussion of composition only; no hi-fi acceptance.

## Wireframe v3 — Content-Driven Layout

- Date: 2026-10-23. Live inspection confirmed the user's correction: v2 had no
  auto layout and used fixed text boxes and absolute coordinates throughout.
- Rebuilt the rough layout with nested flex containers and a shared grid.
  Containers fill their parent or hug their content; all heights are content
  driven. Text fills the available width and grows vertically when wrapping.
- The list shares four tracks: auto rank, flexible identity, auto four-week
  chart, auto Score. Supporting statistics span the last three tracks and
  distribute available width equally. Controls and chart wrappers hug content.
- No absolutely positioned children remain. Only weekly bar geometry and
  1px separator thickness retain fixed child dimensions. The root width is
  the viewport input, not a fixed width copied into descendants.
- Current board: `d3e567ab-6d33-8007-8008-d50216932a89`,
  `WF v3 / Players / RU / Fluid`. Removed v2 after checking the new layout;
  the Players page contains one board. Overview and shared masters are untouched.
- Geometry checks on the same board:
  - 360px viewport: content/list width 320px, name width 187px.
  - 390px viewport: content/list width 350px, name width 217px.
  - 430px viewport: content/list width 390px, name width 257px.
  - All three: no child outside the board and no text outside its box.
- Content-growth check: a long name with spaces wraps from 19px to 37px high;
  list height grows from 424px to 442px and board height from 837px to 855px.
  Following content moves in normal flow. Restored the original fixture.
- Remaining later wireframe case: an extra-long identifier without break
  opportunities needs an explicit overflow treatment; auto-height alone does
  not wrap that string. The current underscored fixture fits at all three widths.
- Final geometry: 390 by 837, four fixtures, sixteen weekly bars, zero absolute
  children and no overflows. Fresh file metadata confirms App Design revision
  449, modified 2026-10-23T04:17:47.870313Z; UIKit remains revision 137.
- The user waiver of per-change independent review still applies. No agents
  were dispatched. Inspected the persisted full-board PNG at 390px: all fields
  are visible, columns align, and no unintended clipping or overlap is visible.
  The 360px and 430px checks above are geometry checks, not separate rendered
  screenshot approvals.
- Decision: draft; composition and hi-fi remain unaccepted.

## Wireframe v4 — Game Type, Toolbar And Score Level

- User feedback: missing SG/Mace/SM selection, empty space beside sorting,
  numeric Score alignment and a visible indicator for its four levels.
- Added the three game-type choices to the left of sorting in one fluid row.
  SG is selected; the type group fills available width and sorting hugs its
  content at the right edge. Search remains above this row.
- Right-aligned the Score heading and every numeric value. Supporting games,
  kills, deaths and K/D remain left-aligned as per-player attributes.
- Added a small grayscale "Ур. N/4" label beneath each Score. Fixture levels
  4, 3, 2 and 2 reuse the prior Overview color-level assignments; no new formula
  or hardcoded production thresholds were introduced. Four-week charts remain
  separate from the level label.
- Current board ID is unchanged: `d3e567ab-6d33-8007-8008-d50216932a89`;
  renamed to `WF v4 / Players / RU / Fluid`.
- Geometry checks at 360px and 430px: sorting ends at the toolbar's right edge;
  all numeric Score ink bounds share the same right edge (332px and 402px,
  respectively). All four supporting metric groups retain left alignment.
  No text or node overflow and no absolute children were found.
- The same Fill/Hug/grid layout remains in use. Score cells hug their two-line
  content and the four table tracks adapt to its intrinsic width.
- Persistence: fresh project-file metadata reports App Design revision 456,
  modified 2026-10-23T04:28:23.426989Z; UIKit remains revision 137.
- Per-change independent reviews remain waived during wireframing. The final
  PNG export timed out, and the final 390px read was rejected because the
  browser suspended the plugin tab. A safe bridge-read retry confirmed the
  missing heartbeat. After the user refocused the tab, the 390px live read and
  persisted PNG export succeeded. Full-board visual inspection confirms visible
  game types, sorting at the right edge, aligned numeric Score values and level
  labels, with no clipping or collisions. All numeric Score ink bounds end at
  x362px; sorting ends at the toolbar edge x370px. The 360px/430px checks above
  are geometry checks, not separate rendered screenshot approvals.
- Decision: draft; level-label presentation is proposed for user feedback.

## Wireframe v5 — Replace Redundant Scope Copy With Data Freshness

- User correction: game type is already visible and all time inherently
  includes the current rotation. Removed the redundant explanation.
- Inspected the current RU 390 Overview freshness composite and the legacy
  `FreshnessPill` reference. Retained the existing meaning: connection/data
  state plus age of the displayed snapshot, independent of the last replay.
- Added a compact neutral "Актуально" status rectangle and "· 4 мин" age
  directly beneath the title. Four minutes is illustrative fixture copy.
- The row and badge hug their content in normal layout flow. No absolute
  children were added; unrelated controls and player rows are untouched.
- Current board ID is unchanged: `d3e567ab-6d33-8007-8008-d50216932a89`,
  renamed to `WF v5 / Players / RU / Fluid`.
- Geometry checks at 360px and 430px confirm a 124 by 25 hugged freshness
  group, no old scope text, no child/text overflow, and preserved numeric
  Score alignment. The board height follows content and grows to 845px.
- Final 390px live geometry and persisted PNG confirm the intended placement,
  visible status and age, no redundant scope copy, and no clipping or overlap.
  Fresh metadata reports App Design revision 460, modified
  2026-10-23T04:51:47.010071Z; UIKit remains revision 137.
- Per-change independent review remains waived; no agents were dispatched.
- Decision: draft; hi-fi and the remaining freshness states stay outside this pass.

## Wireframe v6 — Shared Score Legend And Text Actions

- Applied the accepted Score entry-point decision from
  `drawer_frontend_decisions_09f4fe9ad28ccde0d60575a4`.
- Removed the four repeated "Ур. N/4" labels. All numeric Score values remain
  right-aligned and are persistently underlined to indicate an action.
- Added a single "Уровни Score" row above the list, with four ordered samples
  and an information action. Grayscale sample tones stand in for future tier
  colors and are also used on Score values; this is still a rough wireframe.
- Temporary thresholds 1/2/4 map the fixture values to levels 4/3/3/2.
  No scoring formula or production thresholds were implemented.
- User scope correction: the modal belongs to Base page and is deferred.
  No modal or separate explanation board was created on Players.
- Current board ID is unchanged: `d3e567ab-6d33-8007-8008-d50216932a89`,
  renamed to `WF v6 / Players / RU / Score entry`.
- Final settled geometry is 390 by 864px. At 360, 390 and 430px, the legend
  fills the available width, Score values share the column's right edge,
  supporting metrics remain left-aligned, no old level labels remain, and no
  child/text overflow or absolute children were found.
- The Unicode information glyph used a fallback with overflowing ink bounds.
  Replaced it with a simple "(i)" wireframe placeholder; geometry checks and
  the final PNG confirm the corrected fit.
- A temporary plugin disconnection interrupted the first responsive/export
  attempt. The connection recovered; all three width checks completed and
  the root was restored to 390px. The headless export route returned HTTP 400;
  the connected plugin export succeeded and the final full-board image was
  inspected for clipping, collisions, alignment and information visibility.
- Fresh file metadata confirms App Design revision 469, modified
  2026-10-23T05:42:14.089680Z; UIKit remains revision 137.
- Per-change independent reviews remain waived; no agents were dispatched.
- Decision: draft for user feedback; the modal and hi-fi remain deferred.

## Wireframe v7 — Remove The Separate Score Legend

- User feedback identified the entire "Уровни Score" legend row as redundant.
  Removed that row, its four samples and its information placeholder.
- The underlined numeric Score values remain the explanation entry point.
  No replacement control or modal was added. Base page still owns the deferred
  explanation surface.
- The existing auto layout moves the list and following content upward by
  34px. The settled board is 390 by 830px; all four Score values remain aligned
  to the same right edge. No absolute children or outside nodes were found.
- Current board ID is unchanged: `d3e567ab-6d33-8007-8008-d50216932a89`,
  renamed to `WF v7 / Players / RU / Score entry`.
- Inspected the final full-board 390px PNG: the legend is absent, the list
  follows controls, and the remaining content is visible without clipping.
  No new independent review was run, per the wireframe-stage waiver.
- Persistence: App Design revision 470, modified
  2026-10-23T05:46:49.386040Z; UIKit remains revision 137.
- This revises the shared-legend part of the earlier Score proposal.
  The source memory record remains unchanged; the current brief and user
  feedback take precedence over that earlier design direction.
- Decision: draft for continued wireframe discussion.

## Wireframe v8 — Infinite Scroll And A Longer List

- User explicitly chose infinite scroll after questioning the four-row sample
  and the manual continuation button. Removed "Показать ещё".
- Extended the fixture to ten players with descending Score, consistent K/D,
  ten distinct ranks including a two-digit rank, and forty weekly bars.
  Ten is a mock-data count, not an agreed page size or product limit.
- Replaced the button styling with the non-interactive status
  "Загружаем игроков…" at the loaded-list boundary. Updated the illustrative
  loaded count to 10 of 1,248. No production scrolling behavior was implemented.
- Kept normal document flow and the shared auto-column grid; no nested scroll
  container or absolute children were introduced.
- Current board ID is unchanged: `d3e567ab-6d33-8007-8008-d50216932a89`,
  renamed to `WF v8 / Players / RU / Infinite scroll`.
- The same board was checked at 360, 390 and 430px: ten players, no outside
  nodes or text overflow. Score values retain right alignment and supporting
  metrics retain their existing grouping. Restored the root to 390px.
- Final geometry is approximately 390 by 1,402px. The initial native PNG export
  timed out; the bridge remained responsive. Exported the full SVG and inspected
  a locally rasterized preview for order, clipping, collisions, long-list density
  and loading-status placement. The local preview uses font fallback and is
  layout evidence, not approval of product typography. Penpot's own measured
  text bounds passed at all three widths.
- Persistence: App Design revision 473, modified
  2026-10-23T06:03:23.522913Z; UIKit remains revision 137.
- Infinite-scroll decision captured and read back in
  `drawer_frontend_decisions_51988cce6f9edf8b1a5d43dc`.
  Batch size, prefetch distance, error recovery and live ranking updates were
  not decided. End-of-results and next-batch error visuals remain later
  wireframe states; the replay-list live-update rules were not imported.
- Per-change independent review remains waived during wireframing.
- Decision: draft for continued wireframe discussion.

## Wireframe v9 — Desktop And Width-Driven History

- Date: 2026-10-26. Added two rough RU desktop specimens on the existing
  Players page; the mobile board remains unchanged.
- Boards:
  - 1440px: 0df30c65-f663-8011-8008-d93dda2fe447,
    WF v9 / Players / RU / Desktop 1440.
  - 1024px: 0df30c65-f663-8011-8008-d93ec09a59db,
    WF v9 / Players / RU / Desktop 1024.
- Reused the ten mobile player identities, ranks, supporting statistics and
  Score values. Desktop displays supporting statistics in separate columns.
  A single grid shares tracks between headings and all data rows. Identity
  and history use flexible tracks; other tracks hug their content.
- Kept the rough grayscale exception. Desktop navigation sits in the top
  application header. Title, period and freshness precede a single controls
  row with search, SG/Mace/SM and sorting. No filters, legend or modal added.
- Direct user clarification: history grows with available space, capped at
  16 weeks. The specimens illustrate 16 at 1440px and 13 at 1024px; these are
  layout examples, not accepted production breakpoints. Four weeks remain
  the narrow-mobile case. Older bars are illustrative data, and the weekly
  aggregation contract is still open.
- Containers use Fill/Hug layout and content-driven heights. Chart bar heights
  and a minimum graphic width are specimen geometry, not a product contract.
  Both desktop boards are approximately 951px high.
- Recorded intended scrolling outside the product UI: page-owned scrolling,
  table headings sticky below the application header, no horizontal or nested
  table viewport, and browser-owned anchoring during width changes.
  No live scrolling behavior was implemented.
- Verified native full-board PNG exports at both widths after the final content
  reorder. Checked hierarchy, control order, column alignment, long nickname
  fit, row density, history count, loading-status placement and clipping.
- Geometry: no outside nodes, measured text overflow, absolute children or
  top-level board collisions at either width. All numeric Score values share
  the right edge within each board. Ten rows have 160 and 130 bars respectively.
  The mobile board remains approximately 390 by 1402px.
- Persistence: native final PNG exports confirm server-rendered contents.
  Last successful project metadata read showed App Design revision 482 before
  the final reorder; a later metadata request failed, so it is not cited as
  the final revision. UIKit remained revision 137 on that successful read.
- Per-change independent reviews remain waived by the user during wireframing.
- Decision: draft desktop composition for user feedback; no hi-fi acceptance.

## Wireframe v10 — Expanded Summary, Paused Checkpoint

- Date: 2026-10-26. The user paused work and requested a push to master.
  This checkpoint is incomplete and has no rendered-design acceptance.
- Loaded the side brainstorm decisions from
  codex://threads/01a177f3-743a-7fd2-9bf6-c0efa98a3122:
  - drawer_frontend_decisions_b3f5802681e8959b3762be75: all five additional
    metrics, the complete mobile core and the responsive removal priority.
  - drawer_frontend_decisions_8683374ef10efafc4f8093a2: supported visible-only
    sorting, with Score descending when the active sort becomes hidden.
  - drawer_frontend_decisions_ab686de515f2c9f4b3b94e66: each bar is Score for
    its individual week, not cumulative overall Score.
- Full SG summary now adds Bounty, teamkills committed, kills from vehicles,
  deaths caused by teamkills and vehicles destroyed. All values are fixtures;
  no API completeness or scoring/aggregation formula is asserted.
- Trial specimens in App Design / Players:

  | Width | Board ID | Columns | Rows | Weeks currently drawn |
  | --- | --- | --- | --- | --- |
  | 1920px | 834ad548-30af-8018-8008-d94a01395c04 | 13 | 10 | 4 (pending) |
  | 1440px | 0df30c65-f663-8011-8008-d93dda2fe447 | 13 | 10 | 13 |
  | 1024px | 0df30c65-f663-8011-8008-d93ec09a59db | 11 | 10 | 4 |

- Full board names are WF v10 / Players / RU / Desktop 1920 / Full,
  WF v10 / Players / RU / Desktop 1440 / Full, and
  WF v10 / Players / RU / Desktop 1024 / Reduced.
- At 1024px, the trial omits vehicles destroyed and deaths from teamkills,
  retaining Bounty, teamkills committed and kills from vehicles. This follows
  the accepted removal order after reducing history to four weeks.
  The number of breakpoint sets and their thresholds remain undecided.
- Bounty is intended only for SG. Mace/SM variants that omit it are not drawn.
  The mobile v8 board remains unchanged.
- Desktop identity and history use flexible tracks. Other tracks hug content.
  The 1920px specimen caps header/content width at 1760px. Header labels can
  wrap into two lines; no global Score legend or modal was added.
- An in-place edit of the occupied grid displaced cells. Rebuilt all three
  desktop tables from clean grids in bounded batches and removed the damaged
  tables. Rechecked header positions and row counts during reconstruction.
  A lost plugin heartbeat interrupted the first repair; connection recovered
  after the user confirmed that the active tab was responsive.
- Before the latest history update, geometry reads confirmed 13 shared tracks,
  header row 1, equal 54px header cells and no horizontal outside nodes on the
  1440px and 1920px replacements. The 1024px grid was then rebuilt with 11
  tracks and its flexible-track proportions adjusted; its final geometry has
  not been checked.
- Pause read-back confirms ten rows per board, approximately 948px board
  heights and the week counts in the table above. Fresh metadata reports App
  Design revision 501, modified 2026-10-26T12:15:43.631190Z.
  UIKit remains revision 137; no Overview or shared-master edits were made.
- Resume next:
  1. Re-read current Penpot state before mutation.
  2. Expand the 1920px history to the available count, expected to reach the
     16-week cap; the user paused before that operation.
  3. Check final geometry at all three widths: track/cell positions, text and
     node bounds, Score right alignment, chart counts and board collisions.
  4. Export and inspect native PNGs for all three final boards. No v10 final
     render was exported or visually approved before the pause.
  5. Review the trial column sets with the user; do not freeze breakpoint
     thresholds or begin hi-fi.
- Scrolling and sort-change rules are static annotations only. Live behavior,
  missing-week handling, formula details and production integration remain open.
- Per-change independent reviews remain waived during wireframing.
- Decision: paused draft; continue from this checkpoint.
