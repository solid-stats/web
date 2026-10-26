# Players List Iterations

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
