# Players List Wireframe Brief

## Job

Help a public visitor find a player, scan the ranking, and notice recent Score
dynamics before opening a profile.

## Current Pass

- Low-fidelity structure first, explicitly requested by the user on 2026-10-21.
  Hi-fi starts only after the structure is broadly agreed.
- One RU mobile success screen, 390 by 844, on App Design / Players.
- Reuse Overview's current player identity and ranking-row components. Do not
  change their masters or the Overview page.
- Data order for the eventual table: rank, player and squad, games, kills,
  deaths, K/D, Score. Recent dynamics are an additional field.
- Narrow screens show four weeks. The broader-screen range is not decided here.
- On mobile, keep the existing identity/Score row; place the four-week chart
  before Score and the four supporting statistics below it.

## Priority And Direction

Compact page identity and period, search, provisional sorting control,
then the player list. Use connected components and existing tokens without
adding a visual direction, decorative sections, or new design-system families.
This is a structural proposal, not hi-fi approval.

## Data And Actions

Four illustrative rows include a long nickname, a player without a squad,
different weekly patterns, and descending Score. Supporting values are fixtures,
not an assertion about the current API. K/D equals kills divided by deaths,
rounded to two decimals. Weekly bars illustrate relative changes; the exact
weekly aggregation contract remains open before hi-fi acceptance.

Visible action placeholders: search by player, choose period, change sorting,
open player/squad, and load more. Pagination mechanics are provisional.
Filters are out of scope, as clarified by the user on 2026-10-21.
Statistics remain public for every role.

## Visual Inputs

- `DESIGN.md` and generated `src/styles/theme.css`.
- App Design `5954a801-37cf-8094-8008-81f63a8ba3d3`, Overview board
  `c174ef54-f585-8039-8008-ab36eb0f78a0` and its v11 player digest.
- Existing `v11 / DigestRow / Player / Full` and compact player identity.
- Connected SolidStats UIKit `3be9e5e1-190f-8090-8008-724cff55ab11`.

## Checklist Intake

[Checklist Design](https://www.checklist.design/browse), accessed 2026-10-21:
Table, Search, Navigation, and Responsiveness inform grouping, scan order,
control placement, and content fit in this pass. The index retrieval returned
no checklist body; no item-level checklist verification is claimed.

## Readiness And Later Passes

This first wireframe tests composition and realistic populated rows only.
Later wireframe passes must resolve 360px, EN, wider layouts, zero/few/many
results, long content, no weekly data, loading, errors, freshness, scope and
sorting states. These remain prototype work, not implementation deferrals.
Actual keyboard behavior, API wiring, accessibility semantics, SEO, and
performance belong to implementation after an accepted hi-fi summary.

## Non-Goals

No production code, profile design, Overview repair, shared-master edits,
complete page acceptance, or accepted `SUMMARY.md` in this pass.
