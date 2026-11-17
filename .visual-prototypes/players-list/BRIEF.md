# Players List Wireframe Brief

## Job

Help a public visitor find a player, scan the ranking, and notice recent Score
dynamics before opening a profile.

## Current Pass — Figma Mobile Trial

- On 2026-11-17 the user authorized a bounded, human-guided Figma trial and
  explicitly limited the first iteration to mobile, then requested tablet.
  Production work remains
  excluded. The earlier Penpot process is historical for this trial.
- Target: [Web App / Players](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=13-10).
  The user accepted the 360px mobile wireframe structure and requested keeping
  only that mobile specimen. Frame `13:10` is now 360px wide; no 390px specimen
  remains. This is not acceptance of hi-fi, states or the whole page.
- Accepted tablet structure: [T1, 768px](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=22-167).
  It adds Bounty, teamkills and kills from vehicles to the core columns with
  four weeks of history. Vehicles destroyed and deaths from teamkills are
  omitted in the accepted removal order. User said lgtm and requested the
  next size after the identity/link corrections. Exact switching thresholds
  remain undecided. Bounty values are illustrative.
- Accepted structure: [D1, 1024px](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=29-299).
  Full SG summary including deaths from teamkills and vehicles destroyed,
  with sixteen weeks of history. Identity currently has 148px and retains
  single-line ellipsis. User said lgtm and requested the next size.
- Accepted structure: [D2, 1280px](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=34-565).
  Same full summary and sixteen weeks, with wider numeric tracks, 12px
  inter-column gaps and 260px for identity. User said lgtm and requested next.
- Current proposal: [D3, 1920px](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=35-783).
  Centered 1760px content with 80px side gutters, 16px column gaps, 408px
  identity and sixteen bars in a 312px chart. Full metric order is unchanged.
- Both review frames now retain visibly long names with and without spaces.
  Accepted overflow behavior: reserve exactly one line for nickname and one
  for squad; truncate either with an ellipsis. Do not wrap identity text or
  grow rows after skeleton replacement. A long squad fixture remains visible.
  Skeleton and loaded rows must share the same geometry at each width.
  Current row heights are 121px at mobile 360 and 77px at tablet 768; these
  are wireframe measurements, not immutable production pixel tokens.
  Runtime skeleton replacement and CLS have not yet been tested.
- Nicknames and existing squad names are underlined links in both specimens.
  "Без отряда" is plain non-link text. Underlines preserve one-line truncation
  and stable identity geometry.
- Place title and snapshot age in one vertical group beside the period
  selector. Freshness sits immediately below "Игроки", not in a separate
  full-width row below the period control. Apply this to every size.
- Reuse the product decisions below. UIKit page contains only the components
  needed by this draft, with linked instances, auto layout and scoped wireframe
  variables. Wireframe colors are not new production tokens or a light-theme decision.
- Mobile alignment correction, 2026-11-17: K/D sits directly below Score in
  the same right-aligned column. All four supporting metric groups hug their
  content and use space-between distribution. In accepted mobile F1.3,
  Games is left-aligned with player identity; the other groups align right.
- First-release scope excludes live updates and elaborate caching. Revisit the
  historical live-connection state vocabulary when designing page states.
- Score values and chart heights are illustrative. Current backend parity
  formulas confirm K/D and weekly Score, but do not establish the old brief's
  adjustedScore model or approved four-level thresholds. Resolve that mapping
  before accepting numerical examples or the explanation surface.

## Previous Penpot Checkpoint

- Low-fidelity structure first, explicitly requested by the user on 2026-10-21.
  Hi-fi starts only after the structure is broadly agreed.
- Fidelity correction confirmed on 2026-10-23: use a rough grayscale wireframe
  with neutral rectangles and plain text. The previous styled pass was rejected
  as premature hi-fi. Assess structure before applying the product appearance.
- RU populated wireframes on App Design / Players: the existing 390px mobile
  layout plus desktop specimens at 1920px, 1440px and 1024px. Heights follow
  content. The expanded desktop iteration is paused before final validation.
- Reuse Overview's player identity and ranking-row information hierarchy.
  Its finished appearance is a later hi-fi input. Do not change its masters
  or the Overview page.
- The core remains rank, player and squad, games, kills, deaths, K/D, Score
  and recent dynamics. The expanded desktop iteration adds the accepted
  summary below; its trial column sets remain unaccepted.
- Narrow screens show four weeks. On desktop, show as many recent weeks as
  available chart width permits, capped at 16 (direct user instruction,
  2026-10-26). The count is content-driven, not a fixed desktop range.
- Build actual responsive Penpot layouts: Fill widths, Hug heights, intrinsic
  controls and content-sized grid tracks. Use normal layout flow for children;
  manual coordinates are only for positioning the outer board on the canvas.
- Keep fixed dimensions only for intentional graphics, such as the weekly bars
  and separator thickness. Mobile geometry was checked at 360, 390 and 430px;
  the expanded desktop pass still needs final checks at 1024px, 1440px and
  1920px after the pause.
- On mobile, keep the existing identity/Score row; place the four-week chart
  before Score and the four supporting statistics below it.

## Responsive Scrolling Contract

- The page owns vertical scrolling at every width. No horizontal table scroll
  and no internal table scrolling viewport.
- The table header sticks below the application header on mobile and desktop.
  The wireframe annotates this intent; it does not implement runtime scrolling.
- Reduce displayed content as width decreases. Weekly history adapts first;
  the mobile layout retains its four-week chart and grouped supporting stats.
- Leave anchoring during width changes and phone rotation entirely to the
  browser. Do not add custom anchor tracking or scroll compensation.
- Decision source: drawer_frontend_decisions_76ce9bb8504f9514125e3aed.

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

## Expanded Summary And Responsive Priority

Accepted metric order after identity: Games, Kills, Vehicle kills, Vehicles
destroyed, Teamkills, Deaths, Deaths from teamkills, Bounty, K/D, Weekly history,
Score. Omitted columns retain this relative order at narrower widths.
RU headings: "Убийств из техники" and "Уничтожено техники". The user explicitly
placed "ТК" after vehicles destroyed on 2026-11-17.

The accepted expanded summary adds all five metrics:

- total Bounty, for SG only; omit the column for Mace and SM;
- teamkills committed;
- deaths caused by teamkills;
- kills from vehicles;
- vehicles destroyed.

Preserve the complete mobile core, including kills, deaths and K/D. When space
decreases, shorten weekly history toward four weeks before removing secondary
metrics. Remove secondary metrics in this order: vehicles destroyed; deaths
caused by teamkills; kills from vehicles; teamkills committed; Bounty.

Column visibility uses predetermined sets at breakpoints. The number of sets,
their exact compositions and numeric thresholds remain open for wireframe
inspection; do not adopt the side discussion's proposed four sets as a spec.
The current viewport examples are trials, not accepted breakpoint boundaries.

Sorting offers only visible metrics from the supported sort types. If a new
breakpoint hides the active sort metric, switch to Score descending. The user
accepted that the player order changes; browser-owned scroll anchoring still
applies. Visibility does not make every metric sortable or add API sort types.

Decision sources: drawer_frontend_decisions_b3f5802681e8959b3762be75 and
drawer_frontend_decisions_8683374ef10efafc4f8093a2. These are product decisions;
the wireframe uses illustrative values and does not assert API completeness.

## Data And Actions

Ten illustrative rows include a long nickname, players without a squad,
different weekly patterns, and descending Score. Supporting values are fixtures,
not an assertion about the current API. K/D equals kills divided by deaths,
rounded to two decimals. Each weekly bar represents Score for that individual
week, not accumulated overall Score at the end of the week. The exact formula,
weekly aggregation and missing-week treatment remain open before hi-fi
acceptance. Meaning source: drawer_frontend_decisions_ab686de515f2c9f4b3b94e66.

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

The numeric Score column is right-aligned, including its heading. K/D is
right-aligned directly below Score, per the 2026-11-17 mobile correction.
Supporting metric groups are content-sized and distributed with space-between.
Mobile F1.3 left-aligns Games with player identity and right-aligns kills,
deaths and K/D. The user accepted this 360px wireframe structure on 2026-11-17.
Tablet T1 proposes a single table row with right-aligned numeric columns.
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
Later wireframe passes must resolve 360px, EN, remaining widths, zero/few/many
results, long content, no weekly data, initial loading, next-batch errors,
end of results,
stale/offline/reconnecting, scope and sorting states. These remain prototype
work, not implementation deferrals.
Actual keyboard behavior, API wiring, accessibility semantics, SEO, and
performance belong to implementation after an accepted hi-fi summary.

## Non-Goals

No production code, profile design, Overview repair, shared-master edits,
complete page acceptance, or accepted `SUMMARY.md` in this pass.
