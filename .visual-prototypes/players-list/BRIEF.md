# Players List Wireframe Brief

## Job

Help a public visitor find a player, scan the ranking, and notice recent Score
dynamics before opening a profile.

## Current Pass

- Low-fidelity structure first, explicitly requested by the user on 2026-10-21.
  Hi-fi starts only after the structure is broadly agreed.
- Fidelity correction confirmed on 2026-10-23: use a rough grayscale wireframe
  with neutral rectangles and plain text. The previous styled pass was rejected
  as premature hi-fi. Assess structure before applying the product appearance.
- One RU mobile success layout on App Design / Players. The outer board is
  currently 390px wide; its height follows content.
- Reuse Overview's player identity and ranking-row information hierarchy.
  Its finished appearance is a later hi-fi input. Do not change its masters
  or the Overview page.
- Data order for the eventual table: rank, player and squad, games, kills,
  deaths, K/D, Score. Recent dynamics are an additional field.
- Narrow screens show four weeks. The broader-screen range is not decided here.
- Build actual responsive Penpot layouts: Fill widths, Hug heights, intrinsic
  controls and content-sized grid tracks. Use normal layout flow for children;
  manual coordinates are only for positioning the outer board on the canvas.
- Keep fixed dimensions only for intentional graphics, such as the weekly bars
  and separator thickness. Verify resizing the same board at 360, 390 and 430px.
- On mobile, keep the existing identity/Score row; place the four-week chart
  before Score and the four supporting statistics below it.

## Priority And Direction

Compact page identity and period, data freshness,
search, game-type selection and sorting,
then the player list. Game types are SG, Mace and SM; SG is selected in this
fixture. Place the flexible type selector to the left of the hugged sorting
control in one full-width row. Use neutral shapes for this rough structural
pass, as explicitly confirmed by the user. Product typography, colors, icons, component
styling and token binding return during hi-fi after composition is agreed.
This exception applies to the current wireframe only; no new UIKit family is
being designed. Independent reviews on every wireframe change remain waived
by the user during this exploration.

## Data And Actions

Ten illustrative rows include a long nickname, players without a squad,
different weekly patterns, and descending Score. Supporting values are fixtures,
not an assertion about the current API. K/D equals kills divided by deaths,
rounded to two decimals. Weekly bars illustrate relative changes; the exact
weekly aggregation contract remains open before hi-fi acceptance.

Visible action placeholders: search by player, choose game type and period,
change sorting and open player/squad. Continue the list with infinite scroll,
explicitly requested by the user. Remove the manual load-more button. The
10-row fixture is only a design sample, not the initial batch size or a limit.
Show a non-interactive loading status while the next rows arrive; the current
fixture reads "Загружаем игроков…". Batch size, loading distance and the
production mechanism remain undefined.
Filters are out of scope, as clarified by the user on 2026-10-21.
Statistics remain public for every role.

Under the title, show the compact data-freshness indicator and snapshot age
from the existing Overview pattern. The success fixture is "Актуально · 4 мин".
The age describes the displayed data snapshot, not the last replay date.
The other canonical states are stale, offline and reconnecting; their visual
variants remain a later wireframe pass. The redundant "SG / current rotation
included" explanation is removed: game type and period are already visible.

Only the numeric Score column is right-aligned, including its heading.
Supporting games, kills, deaths and K/D remain left-aligned within each player.
Score is a persistently underlined text action. Remove the repeated
"Ур. N/4" labels. The separate "Уровни Score" legend was removed in v7:
four unlabeled samples add a row without explaining the levels. Keep the
explanation entry on Score itself, with no replacement global control in this
pass. Score tones remain grayscale placeholders for future tier colors;
product colors and final contrast remain hi-fi work.

The accepted level names are "Ниже нормы / Норма / Хорошо / Отлично".
Temporary entry thresholds are 1, 2 and 4; the production formula remains
undefined. Score opens the selected player's explanation, including its level context.
The player name retains profile navigation.
The user explicitly deferred the modal itself to the Penpot Base page;
do not create an explanation board or modal on Players in this pass.
The deferred explanation uses a fixed linear 0–5 scale with boundaries
0, 1, 2, 4, 5 and segment proportions 1:1:2:1. Its current range grows only
in vertical thickness; out-of-range values retain their actual label and
an edge marker. Equal-width bands remain a later comparison candidate.
Decision source: drawer_frontend_decisions_09f4fe9ad28ccde0d60575a4
and the user's direct Base page instruction in the main design thread.

## Visual Inputs

- `DESIGN.md` and generated `src/styles/theme.css`.
- App Design `5954a801-37cf-8094-8008-81f63a8ba3d3`, Overview board
  `c174ef54-f585-8039-8008-ab36eb0f78a0` and its v11 player digest.
- Existing `v11 / DigestRow / Player / Full` and compact player identity.
- Connected SolidStats UIKit `3be9e5e1-190f-8090-8008-724cff55ab11`.
- Overview freshness composite `b7db8d92-bb09-80a6-8008-be25d719550a`
  and `.visual-prototypes/stats-overview/BRIEF.md` (Trust and provenance).
- Legacy `FreshnessPill.tsx` is a reference for the four status meanings;
  its production appearance is not applied to this rough wireframe.

## Checklist Intake

[Checklist Design](https://www.checklist.design/browse), accessed 2026-10-21:
Table, Search, Navigation, and Responsiveness inform grouping, scan order,
control placement, and content fit in this pass. The index retrieval returned
no checklist body; no item-level checklist verification is claimed.

## Readiness And Later Passes

This first wireframe tests composition and realistic populated rows only.
Later wireframe passes must resolve 360px, EN, wider layouts, zero/few/many
results, long content, no weekly data, initial loading, next-batch errors,
end of results,
stale/offline/reconnecting, scope and sorting states. These remain prototype
work, not implementation deferrals.
Actual keyboard behavior, API wiring, accessibility semantics, SEO, and
performance belong to implementation after an accepted hi-fi summary.

## Non-Goals

No production code, profile design, Overview repair, shared-master edits,
complete page acceptance, or accepted `SUMMARY.md` in this pass.
