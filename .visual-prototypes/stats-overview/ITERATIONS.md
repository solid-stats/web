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
