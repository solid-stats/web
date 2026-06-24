---
status: diagnosed
phase: 02-uikit-structural-data-display-primitives
source: [02-VERIFICATION.md]
started: 2026-06-21T14:30:00Z
updated: 2026-06-24T00:00:00Z
---

## Current Test

number: 2
name: Visual inspection of the merged component catalog at representative breakpoints
expected: |
  Open Ladle (cd packages/design && pnpm ladle) and review at least NavBar,
  MobileTabBar, AppShell (360px mobile / 1280px desktop), Table (row states + the
  CLS skeleton-match), TierChip (tier levels), Sparkline (data volumes), and
  FreshnessPill (4 states). Confirm: dark-only gunmetal palette with cyan only on
  active/focus; tier level name + entry threshold visible (not clipped) and never
  color-alone; hover/pressed/focused/selected states perceivably distinct; no clipped
  RU text at the 360px floor; numerals are tabular-mono.
awaiting: gap closure — KIT-01 nav-shell (5 gaps logged in ## Gaps; target = extended 4-role model, fixed)

## Tests

### 1. Full Playwright matrix green on the merged main tree
expected: 203 tests pass, 0 failures; axe serious/critical = 0 across all KIT-01/02/03/04/07 stories; CLS=0 on DataTrustBanner/Skeleton/Table/Sparkline; keyboard full-row table traversal; responsive 360px no-h-scroll for AppShell/MobileTabBar/CompactRow.
result: passed
note: Discharged by the orchestrator after the wave-6 merge — `cd packages/design && pnpm exec ladle build && pnpm exec playwright test` → 203 passed (9.6s) on gsd/v0.1-milestone @ f603735 (the fast-forward-merged tree, identical to each plan's in-worktree green). This closes both VERIFICATION behavior_unverified_items (CLS=0 runtime, responsive 360px runtime).

### 2. Visual inspection of the component catalog at representative breakpoints
expected: Dark-only gunmetal palette; cyan only on active/focus; tier level name + entry threshold visible; all interactive targets perceivably distinct in hover/pressed/focused/selected states; no clipped RU text at 360px; tabular-mono numerals.
result: issues
note: KIT-04/07/03 visually OK. KIT-01 nav-shell (5 gaps) AND KIT-02 data-table (9 gaps) both diverged from the binding hi-fi references `.design/hifi/shell.jsx` / `players.jsx` (D-11) — logged below. KIT-01 target: keep the 4-role model but fix it (universal account per signed-in role, right cluster, Brand, mobile account tab, breakpoint). KIT-02: density auto (drop DensityToggle) + Pagination model pending decision + real table bugs (selected-breaks-layout, focused==enabled, loading-shows-data, compact DataVolumes broken, nick↔squad gap, border-overflow scroll).

## Summary

total: 2
passed: 1
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

> Source: visual UAT of KIT-01 against `.design/hifi/shell.jsx` (binding nav-shell semantics, D-11).
> Target nav model (user decision): **extended 4-role model, fixed** — not the simpler hi-fi `signedIn` boolean.
> Close via `/gsd-plan-phase 2 --gaps` → `/gsd-execute-phase 2 --gaps-only`, with a re-run design-review that diffs against the hi-fi shell.

### GAP-01 — NavBar is a flat single-row list; missing the three-cluster shell + right-aligned account
status: failed
severity: high
requirements: [KIT-01, QUAL-02]
evidence: |
  `NavBar.tsx` renders one `<nav className="flex items-center gap-1">` with every item in a single
  left-to-right row. The hi-fi `shell.jsx` nav-inner has THREE clusters:
  `[Brand] [nav-links] [nav-right: search · language · account/sign-in]`, with `nav-right` pinned to the
  right edge. The implementation dropped the Brand, the search control, the language toggle, and the
  right-cluster layout entirely — so the account/sign-in control cannot be right-aligned (user finding 2).
fix: |
  Give NavBar a three-zone layout: Brand slot (left) | role-aware section links (center) | right utility
  cluster (`ml-auto`) holding search + language toggle + the account/sign-in control. All token utilities,
  no arbitrary values. AppShell passes the brand/search/lang/account slots through.

### GAP-02 — Account/profile is player-only; moderator & admin have no account entry
status: failed
severity: high
requirements: [KIT-01]
evidence: |
  `NavBar/navFixtures.ts` `ROLE_EXTRAS` gives only `player` an account-ish item (`my-requests`);
  `moderator` gets `queue`, `admin` gets `admin`, and NEITHER gets a profile/account entry. In the hi-fi,
  the account button is universal for any `signedIn` user, independent of role (user finding 1).
fix: |
  Every signed-in role (player, moderator, admin) gets the universal account/profile entry, rendered in the
  NavBar right cluster (GAP-01). Keep the role-specific extras as ADDITIONS (moderator → queue, admin → admin)
  per the chosen extended-role model — they do not replace the account entry. `signed-out` → sign-in (Steam).

### GAP-03 — Desktop↔mobile breakpoint too low; nav overflows at 640/768px
status: failed
severity: high
requirements: [KIT-01, QUAL-02]
evidence: |
  `AppShell.tsx` switches to the desktop NavBar at `@md` (container 448px: `hidden @md:block` / `@md:hidden`).
  With 6 section links + Brand + the right cluster, the desktop bar does not fit at 640px or 768px container
  width (user findings 3, 4). The hi-fi keeps the mobile tab-bar up to a normal desktop breakpoint.
fix: |
  Raise the desktop-nav container breakpoint (the bar should appear only when it fits — evaluate `@4xl/@5xl`),
  and add a mid-width condense/overflow strategy for the NavBar (icon-priority + an overflow "More" menu) so
  no width between mobile and full-desktop shows a cramped/overflowing bar.

### GAP-04 — MobileTabBar drops the account/sign-in tab; signed-in users (incl. admin) can't reach their account on mobile
status: failed
severity: high
requirements: [KIT-01]
evidence: |
  The story helper `tabsFor` = `navItemsFor(role).filter(!disabled).slice(0,4)` keeps only the first 4 public
  sections and discards every role/account extra. The hi-fi mobile bar is overview·players·bounty·replays
  PLUS a 5th tab `signedIn ? Account : Sign-in` (user findings 6, 7). (Squads absent on mobile MATCHES the
  hi-fi — `SHELL_TAB` has no squads tab — so finding 5 is per-reference, not a gap.)
fix: |
  Mobile model = 4 primary public section tabs + a 5th account/sign-in tab (account when signed in, Steam
  sign-in when out). Deep admin/moderation routes themselves are Phase 9 — but the account entry point must
  exist here. Give MobileTabBar a dedicated account-tab slot rather than slicing the section list.

### GAP-05 — SkipLink stays INVISIBLE on focus (legacy `clip` never reset) — real a11y defect; test is green-but-broken
status: failed
severity: high
requirements: [KIT-01, QUAL-03]
evidence: |
  Diagnosed live (Playwright computed-style + screenshot, SkipLink/Matrix on the built preview). On focus the
  link IS `position:fixed; top:16; left:16; width:155; height:44; z-index:50; opacity:1` with the focus ring —
  BUT computed `clip: rect(0px, 0px, 0px, 0px)` PERSISTS (`clip-path` resets to `none`, the legacy `clip` does
  not), so it paints nothing → invisible (screenshot: empty top-left corner). Root cause: the custom `.sr-only`
  in `.ladle/tailwind.css` (`@layer base`, added Plan 02-01) uses the legacy `clip: rect(0,0,0,0)`; Tailwind's
  `not-sr-only` only resets the modern `clip-path`, never the legacy `clip`. `keyboard.spec.ts` asserts only
  `boundingBox().height >= 44`, but `clip` is paint-time not layout, so the box stays 44px and the test passes
  GREEN while the link is visually gone. (The earlier "low / demonstrates poorly" triage was WRONG — this is a
  real WCAG 2.4.1 Bypass-Blocks reveal failure.)
fix: |
  CSS — make the visually-hidden recipe reveal-safe: either DELETE the redundant custom `.sr-only`
  (Tailwind v4's own clip-path-based `sr-only`/`not-sr-only` IS generated via `@import "tailwindcss"` —
  confirmed present in the build — and reveals correctly), or change the custom rule's `clip: rect(0,0,0,0)`
  → `clip-path: inset(50%)` so `not-sr-only`'s `clip-path:none` resets it on focus. Verify the Sparkline
  `<figcaption>` sr-only still hides. Also restore the chip's `px-4` on reveal — `not-sr-only` zeroes padding,
  so the revealed text currently touches the edges.
  TEST — strengthen `keyboard.spec.ts` so it CANNOT pass while clipped: assert the computed `clip` is `auto`
  (and/or `clip-path` is `none`) on focus, or add a real paint/visibility check (`toBeInViewport` + non-empty
  render). boundingBox-height alone is what hid this bug.

---

## Gaps — KIT-02 data-table (visual UAT)

> Source: visual UAT of KIT-02 against `.design/hifi/players.jsx` (binding table semantics, D-11), with
> live Playwright screenshots of Table/RowStates, Table/DataVolumes, CompactRow/Mobile, CompactRow/DataVolumes.
> Same root pattern as KIT-01: the family diverged from the hi-fi, and the per-family design-review missed it
> (it did not diff against `players.jsx`).
> Close via `/gsd-plan-phase 2 --gaps` → `/gsd-execute-phase 2 --gaps-only` with a re-run design-review vs the hi-fi.

### GAP-06 — DensityToggle removed; density is automatic by screen/container (hi-fi divergence)
status: failed
severity: high
requirements: [KIT-02]
evidence: |
  hi-fi `players.jsx` L318: `const density = (device === 'desktop' && !winMobile) ? 'comfortable' : 'compact'`
  — density is DERIVED from device/screen; there is NO density toggle. The implemented `DensityToggle`
  (controlled segmented control) is an invented component. User decision: drop it; density auto.
fix: |
  Remove the `DensityToggle` component, its story, and its barrel export. Make the table density derive
  automatically from the container/screen (comfortable at desktop width ≥ `@md`-class, compact below) — keyed
  off `@container` per styling.md, the same way AppShell reflows. Keep `ROW_H` 52/44 and the controlled
  `density` prop on `Table` (the auto-resolver feeds it), but no user-facing toggle.

### GAP-07 — Pagination diverges from hi-fi: no pages, no total, a stray «Это всё» text marker
status: failed
severity: high
requirements: [KIT-02]
decision: KEEP the pager, make it real (user decision — option B, not the hi-fi no-pager model)
evidence: |
  hi-fi `players.jsx` has NO Prev/Next pager (desktop = capped virtualized scroll + total in caption; mobile =
  show-more). The implemented `Pagination` (Назад/Дальше + a «Это всё» end marker) shows neither page numbers
  nor total, and renders a bare «Это всё» text instead of a disabled control (user finding 4).
fix: |
  Keep a Pagination pager but make it real: show a "N–M из total" range / page indicator, and render the
  end-of-list state as a DISABLED Next button (never a bare «Это всё» text marker). Prev disabled at the
  start. Controlled props (no engine, D-01). Surface the total here AND/OR in the table caption.

### GAP-08 — every table (and the skeleton) has a stray ~1–2px scroll; the skeleton must never scroll
status: failed
severity: medium
requirements: [KIT-02, QUAL-04]
evidence: |
  `Table.tsx` reserves the viewport at `height = HEADER_H(44) + visibleRows*ROW_H` but the rendered content is
  header + rows + per-row/`thead` `border-b` (1px each) under `border-collapse`, so the content exceeds the
  reserved height by the border total → a permanent tiny scrollbar (user finding 5). The `Skeleton` table
  variant (its own bordered rows inside the same viewport) overflows the same way — the skeleton should NEVER
  scroll.
fix: |
  Make the reserved viewport height account for borders (border-box math / add the header+row border total, or
  drop the inner borders from the height-bearing boxes) so header + N rows fit EXACTLY with no overflow, for
  both the data table and the `Skeleton` table variant. Re-confirm `cls.spec` still holds (skeleton box ==
  data box) AND assert no scrollbar (scrollHeight <= clientHeight) on both.

### GAP-09 — SELECTED row breaks the table-fixed column layout
status: failed
severity: high
requirements: [KIT-02, QUAL-03]
evidence: |
  Screenshot (Table/RowStates): only the SELECTED row is broken — its cells shift right, columns stop
  following the `<colgroup>`, Счёт/K-D get clipped at the edge. Root cause: `TableRow` row recipe gives the
  selected row a `position: relative` `<tr>` with an absolutely-positioned `before:` cyan bar; a `<tr>` that
  actually contains an abspos child gets promoted in a way that breaks `table-fixed` cell widths (only the
  selected row has the `::before`, so only it breaks). NavBar/MobileTabBar use the same `before:` bar safely
  because they are flex, not table rows.
fix: |
  Render the selected left-edge marker WITHOUT positioning the `<tr>`: use an inset box-shadow
  (`box-shadow: inset 2px 0 0 var(--color-primary)`) on the row (or first cell), and drop `relative` +
  `before:` from the `<tr>`. Keep the three redundant signals (primary-weak fill + edge marker +
  aria-selected). Verify columns stay aligned with the colgroup.

### GAP-10 — FOCUSED row state is identical to ENABLED; no visible row focus
status: failed
severity: high
requirements: [KIT-02, QUAL-03]
evidence: |
  Screenshot (Table/RowStates): the FOCUSED cell is pixel-identical to ENABLED. `TableRow` row recipe maps
  `focused: ""` (empty), and the base carries NO `focus-within:` styling (the code comment claims a
  focus-within lift, but no such utility is present). So neither the catalog forced-state nor real keyboard
  focus changes the row — only the inner anchor gets a ring (user finding 8).
fix: |
  Give the row a real focus treatment: add `focus-within:` row styling (surface lift + the focus ring not
  obscured by the sticky header, WCAG 2.4.12) so live keyboard focus is visible on the row, and map the
  forced `focused` catalog state to the SAME utilities so the matrix cell shows it. Remove the misleading
  comment.

### GAP-11 — Table/RowStates "loading" cell shows real data, not the Skeleton
status: failed
severity: medium
requirements: [KIT-02, QUAL-04]
evidence: |
  Screenshot (Table/RowStates): the LOADING cell renders a real header + Vasiliy data row. In the story the
  loading cell calls `dataTable(ROSTER.slice(0,1), …)` WITHOUT the `loading` flag, so the Table never swaps in
  the `Skeleton` variant (user finding 9). (The DataVolumes/Endings/Cls stories DO render the skeleton — only
  RowStates is wrong.)
fix: |
  Render the 7th row-state with the actual loading skeleton — pass `loading` to the Table (or render
  `<Skeleton variant="table">` directly) so the catalog shows the shimmer placeholder, not data.

### GAP-12 — CompactRow/DataVolumes is broken: no rows render (narrow StateMatrix cells)
status: failed
severity: high
requirements: [KIT-02, QUAL-02]
evidence: |
  Screenshot (CompactRow/DataVolumes): every cell (few/many/limit/single) is an empty tall box — no rows
  render, the «Игроки · 3» caption wraps onto three lines (user finding 1 "нет таблицы, сломана"). Cause: the
  `CompactList` is placed inside narrow `StateMatrix`/`StateCell` grid cells; the wide row content cannot lay
  out there. This is the SAME class the Table stories already fixed by switching to full-width labelled
  sections — CompactRow/DataVolumes was left in the shared grid.
fix: |
  Render the CompactRow data-volume states as full-width labelled sections at a real mobile width (≤ 384px
  column), not inside the shared `StateMatrix` grid — mirror the Table DataVolumes/RowStates full-width
  pattern.

### GAP-13 — CompactRow/Mobile: huge vertical gap between nickname and squad
status: failed
severity: medium
requirements: [KIT-02, QUAL-02]
evidence: |
  Screenshot (CompactRow/Mobile): a large empty gap sits between the player name and the squad line. The name
  anchor carries `min-h-11` (44px) for the touch target, which inflates the name block and pushes the squad
  ~44px down (user finding 2). The hit area should come from the row, not by inflating the inline name.
fix: |
  Keep the ≥44px hit area on the ROW (the anchor already stretches via `after:inset-0`), and drop `min-h-11`
  from the inline name so name + squad stack tightly. Tighten the row's vertical rhythm.

### GAP-14 — few vs limit-reached are visually indistinguishable
status: failed
severity: low
requirements: [KIT-02, QUAL-02]
evidence: |
  Table/DataVolumes (and CompactRow): the `few` and `limit` cells both render a small row count with no
  distinguishing affordance (user finding 6). "limit-reached" carries no "all N shown / end of list" cue vs
  "few of many".
fix: |
  Make the data-volume states read differently: `few` = a few of a larger set (caption shows N of total);
  `limit-reached` = the end is reached / all shown (an explicit end cue). Fold into the total-in-caption work
  (GAP-07) and the show-more / end-of-list affordance.

---

## Gaps — KIT-03 / KIT-04 / KIT-07 + base primitives (visual UAT)

### GAP-15 — Skeleton has no sweep shimmer; it only pulses opacity (hi-fi divergence)
status: failed
severity: medium
requirements: [KIT-07, QUAL-04]
evidence: |
  `Skeleton.tsx` uses `motion-safe:animate-pulse` (an opacity fade). On the dark gunmetal (`surface-2` on
  `surface-1`) the change is barely perceptible (user: "невнятный … просто фон меняет цвет, нет бегущей
  строки"). hi-fi `players.css` uses a SWEEP shimmer: `.sk::after { animation: sk-sweep 1.25s ... }
  @keyframes sk-sweep { 100% { transform: translateX(100%) } }` + reduced-motion off — a moving shine bar.
fix: |
  Replace the opacity pulse with a sweeping shine: a gradient `::after`/overlay translated via
  `transform: translateX(...)` (transform-only → performance.md compliant), `motion-reduce:` → static. Apply
  to all Skeleton variants (text/tile/table); this also fixes the dull loading look on Table + StatTile.

### GAP-16 — StatTile loading skeleton does not reserve the delta row → CLS when delta tiles load
status: failed
severity: medium
requirements: [KIT-03, QUAL-04]
evidence: |
  A `StatTile` WITH a `delta` renders label + value + a delta line. Its loading placeholder is the Skeleton
  "tile" variant (`label line + value block` only — no delta row), so a delta-bearing tile is TALLER than its
  skeleton → layout shift on load (user finding). CLS = 0 requires the skeleton to match the specific tile.
fix: |
  Reserve the delta row in the tile skeleton when the tile has a delta (a `withDelta` skeleton prop/variant),
  or have StatTile always reserve the delta line height. Add a `cls.spec` assertion: delta-tile skeleton box
  height == final delta-tile box height.

### GAP-17 — Sparkline has no hover tooltip on the value bars
status: deferred
severity: medium
requirements: [KIT-03]
decision: DEFER to Phase 3 — implemented there with the KIT-06 tooltip primitive (user decision). NOT in the Phase-2 gap cycle.
depends_on: KIT-06 tooltip primitive (Phase 3)
evidence: |
  `Sparkline.tsx` bars are decorative `aria-hidden` DOM bars with no per-bar hover affordance; the value only
  reaches a screen reader via the sr-only figcaption. A sighted user hovering a bar sees nothing (user
  finding). Note: tooltip/popover is a KIT-06 Phase-3 overlay primitive (REQUIREMENTS KIT-06) — no real
  tooltip primitive exists yet.
fix: |
  Interim (this phase): a native `title` per bar (week + value) for a basic hover. Full: wire each bar to the
  Phase-3 KIT-06 tooltip when it lands (per-point week/value). Decide interim-now vs defer to Phase 3.

### GAP-18 — Badge outcome copy: RU is asymmetric («П» vs «пор.»); user wants W/L unified
status: failed
severity: low
requirements: [KIT-07, QUAL-05]
evidence: |
  `_fixtures/strings.ts`: `outcomeWin = { ru: "П", en: "W" }`, `outcomeLoss = { ru: "пор.", en: "L" }`. The RU
  pair is inconsistent in form (a bare letter "П" vs an abbreviation "пор." with a period). User asks for
  "W/L для обоих языков" — i.e. the English W/L shorthand in both locales.
fix: |
  Copy decision (user): unify outcome labels to "W" / "L" for BOTH ru and en (gaming shorthand), OR fix the RU
  pair to a symmetric form ("П"/"П" style). Apply the chosen copy in `_fixtures/strings.ts`; keep QUAL-05
  parity intent documented (shorthand is intentional non-translation).

### GAP-19 — No shared Button / Link base primitive; ~7 components hand-roll inline buttons/anchors (DRY)
status: failed
severity: medium
requirements: [KIT-01, KIT-02, KIT-07]
decision: INTRODUCE NOW in this Phase-2 gap cycle (user decision) — build the Button/Link base + refactor the hand-rolled controls onto it. (Typography showcase story: delivered inline outside the gap cycle on user request.)
evidence: |
  There is NO base `Button`/`Link` primitive. Interactive controls are hand-rolled with duplicated class
  strings across the catalog: NavBar/MobileTabBar items, `Th` sort button, DensityToggle segments, Pagination
  pagers, Toast action, EmptyState/ErrorState action anchors, CompactList show-more. Each re-implements the
  ≥44px hit area + the `focus-visible:shadow-(--shadow-ring)` ring + surface/hover tokens. Drift already
  visible (Toast action uses `outline` ring; others use `shadow-(--shadow-ring)`). User P.S.: "почему нет
  базовых элементов? кнопки, ссылки…".
fix: |
  Introduce a shared interactive base — `Button` (variants: primary/secondary/ghost/segment, sizes, ≥44px,
  one canonical focus ring) + `Link`/anchor — and refactor the hand-rolled controls onto it. This is a larger
  refactor; needs a scope decision (do it in the gap cycle vs a dedicated base-primitives plan). Typography
  stays token recipes (DS-01) — optionally add a Typography showcase story. Tooltip/forms are Phase 3
  (KIT-05/06), not this gap.

### GAP-20 — NavBar / MobileTabBar / Table story matrices use fake forced-state cells (catalog misrepresents hover/pressed/focused)
status: resolved
resolved: 2026-06-24 (commits a4a3aeb, cb9861c). Nav item / tab / Th route through the shared control recipe, so their matrices now reuse control.ts FORCED_STATE (exported from the Button barrel); the stale variant-agnostic local overrides were dropped. TableRow has its own tv() recipe, so a per-component ROW_FORCED_STATE mirrors it verbatim (!-important, merge-free-safe) guarded by a pure-Vitest TableRow.test.ts sync test. Gate: Vitest 97, Playwright 226, pnpm check exit 0.
severity: medium
requirements: [KIT-01, KIT-02, QUAL-02]
decision: AUDIT + FIX AFTER buttons (user decision, 2026-06-23). The Button matrix carried this defect and was fixed in the 02-07 follow-up (commit 4a2cddf); these three stories share the same pattern and are deferred to a follow-up pass.
evidence: |
  Same root cause as the Button matrix bug fixed in 4a2cddf. The `StateMatrix` forced
  "hover/pressed/focused" cells in `NavBar.stories.tsx`, `MobileTabBar.stories.tsx` and `Table.stories.tsx`
  apply a hardcoded, variant-agnostic className override (the Button one used `bg-surface-3` for every
  "hover"), NOT each item's real recipe tokens. With the merge-free `tv()/lite` build a plain override
  often loses to the base by stylesheet order, so a forced cell can render the resting style or a wrong
  colour. Net: the catalog matrices misrepresent the real `:hover` / `:active` / `:focus-visible` per item,
  and a design-review reading those cells passes on fake states (verified for Button: primary "hover"
  rendered grey `surface-3`, never the real cyan `primary-hover`). Detect:
  `grep -rl 'FORCED\|forcedState' packages/design/src/shared/uikit --include='*.stories.tsx'`
  → NavBar, MobileTabBar, Table (Button now fixed).
fix: |
  Apply the Button fix pattern (02-07 follow-up): the forced cells must render each item's REAL
  per-state tokens as a literal mirror of the live recipe, made deterministic in the merge-free build
  (`!`-important) and asserted in sync by a unit test (see `control.ts` `FORCED_STATE` +
  `control.test.ts`) — OR drop the in-Ladle forced matrix and force real pseudo-states in the Playwright
  catalog instead. Re-run the design-review against the corrected matrices. Note: NavBar/MobileTabBar items
  now render through `Button`/`Link` (02-07), so their states may already route through the fixed `control`
  recipe — confirm whether a separate forced map is still needed or the stale local override can just be
  deleted.

### GAP-21 — responsive.spec asserts only 3 widths (360 / 800 / 1280); the canonical 6-width review matrix + the large-screen container ceiling are untested
status: resolved
resolved: 2026-06-24 (commits 2a2f78f, 8a5a5c9). responsive.spec parametrized to the canonical 360/768/1024/1280/1920/2560 tiers + 390/414 spot-checks + 3440 cap-check (the 800 @5xl dead-zone probe retained). The 1760 container ceiling was NOT wired (the --container token existed but no component consumed it) — AppShell <main> now wraps content in a token-driven `mx-auto w-full max-w-(--container)` box ([data-main-content]); the test asserts it caps at ~1760, is strictly narrower than <main>, and centers at 1920/2560/3440. Gate: Vitest 97, Playwright 252, pnpm check exit 0.
severity: medium
requirements: [QUAL-02, KIT-01, KIT-02]
decision: AUDIT + WIDEN AFTER the gap-closure wave (user decision, 2026-06-24). `responsive.spec.ts` is actively rewritten by 02-08 (and touched again by 02-09/02-11) in this wave, so widening it now would conflict with the running executor; deferred to a dedicated follow-up test pass — same handling as GAP-20.
evidence: |
  `packages/design/tests/responsive.spec.ts` pins exactly three viewport widths: `MOBILE = 360`
  (the QUAL-02 floor), `MID = 800` (a deliberate below-`@5xl` dead-zone probe for the nav-collapse
  reflow, GAP-03) and `DESKTOP = 1280` (above `@5xl`). The design-system canonical design/review
  widths are **360 · 768 · 1024 · 1280 · 1920 · 2560** + 390/414 mobile spot-checks + a 3440 ultrawide
  cap-check (`solidstats-frontend-react-design/references/design-system.md` §"Breakpoints / design +
  test widths"). So 768, 1024, **1920 (the modal default desktop, ~54% of users)**, 2560, the 3440
  ultrawide cap, and the 390/414 spot-checks have NO automated coverage. Critically, the design-system
  invariant that the data container caps at 1760 and centers (must NOT stretch into the gutter) on
  ≥1920 has no test at all. The divergence became visible after the Ladle width-picker fix (commit
  d57f2f2): the catalog now offers 8 review widths while the Playwright gate asserts at 3.
fix: |
  Through `solidstats-frontend-react-tests` (Playwright tier): widen the responsive matrix to the
  canonical tiers (360 / 768 / 1024 / 1280 / 1920 / 2560, plus 390/414 mobile spot-checks where a
  reflow boundary warrants it) — parametrize rather than hand-copying `test.describe` blocks. Add an
  explicit container-ceiling assertion for the data surfaces (Table/AppShell main): at ≥1920 the
  content container width caps at ~1760 and is centered (gutters grow, content does not), and at 3440
  it does not stretch past the ceiling. Keep the existing 800 dead-zone probe — it guards the `@5xl`
  nav switch and is not redundant with the canonical tiers. Note: container-query components key off
  `@5xl`, so most per-component reflow is already exercised by 360/800/1280; the new widths primarily
  guard the large-screen ceiling and the tablet (768/1024) band.

---

## Gaps — round 2 (visual UAT, 2026-06-24)

> Source: a second visual UAT pass over the Ladle catalog after the round-1 gap closure (GAP-01..21).
> Two real defects (CompactRow / TableRow) fixed in-session; three were design-system questions resolved
> by user decision. Code edits were direct (not via `/gsd-execute-phase`), gated by the design-package
> Vitest + Playwright suites.

### GAP-22 — CompactRow metric columns glue together (Счёт↔K/D nearly touch)
status: resolved
resolved: 2026-06-24 — `CompactRow.tsx` metric column `w-14` (56px) → `w-18` (72px). The value content
  (Pips ≈30px + gap + a 4-glyph tabular value «4.13» ≈31px) ≈ 65px was WIDER than the 56px box; with
  `items-end` the overflow spilled left into the `gap-3`, collapsing the visual Счёт↔K/D gap to ~2.8px
  (measured live). `w-18` contains the content and restores an ~18.8px gap; columns stay aligned across rows.
severity: medium
requirements: [KIT-02, QUAL-02]
evidence: |
  Live measurement (CompactRow/DataVolumes, Chrome DevTools): metric box width 56px, inner content
  (Pips+value) 65.2px → content overflows the box left by 9.2px; adjacent score-content-right (286) vs
  kd-content-left (288.8) ⇒ only ~2.8px between the two metrics (user finding "колонки склеиваются").
  Root cause is the under-width fixed column, NOT missing cell padding (padding would not help — the box is
  narrower than its content).
fix: |
  Done: widen the `CompactMetric` column to `w-18` (72px) so Pips+value fit with a clean inter-column gap.
  Post-fix measurement: box 72px, visual content gap 18.8px. (Note: the desktop `Table` cells already carry
  `px-3` on wide fixed columns and were never affected — this was CompactRow-only, per user clarification.)

### GAP-23 — Table row focus lift fires on pointer click (focus-within, not focus-visible)
status: resolved
resolved: 2026-06-24 — `TableRow.tsx` row recipe `focus-within:bg-surface-3 focus-within:shadow-(--shadow-row-focus)`
  → `has-[:focus-visible]:…` (i.e. `:has(:focus-visible)`). The sync test (`TableRow.test.ts`) prefix and the
  `keyboard.spec.ts` comments/messages were updated in step. Gate: TableRow Vitest 6/6, keyboard Playwright 9/9.
severity: medium
requirements: [KIT-02, QUAL-03]
evidence: |
  User finding: the row focus treatment triggers when clicking INSIDE the row. `:focus-within` matches on any
  descendant `:focus`, including the name anchor taking POINTER focus on a mouse click, so a mouse user got
  the keyboard-style row lift on every click. The anchor itself already gates its ring on `focus-visible:`,
  so the row was inconsistent with it. Confirmed live: programmatic `.focus()` (what the keyboard spec uses)
  DOES match `:focus-visible`, so `:has(:focus-visible)` keeps the keyboard tests green while dropping the
  mouse-click false positive.
fix: |
  Done: key the row lift off `has-[:focus-visible]` so it paints only on keyboard / non-pointer focus,
  mirroring the anchor's own `focus-visible:shadow-(--shadow-ring)` ring. ROW_FOCUS / ROW_FORCED_STATE.focused
  (the resolved utilities) are unchanged — only the live prefix changed; the GAP-20 sync contract still holds.

### GAP-24 — Button: no square `icon` size; no compact (<44px) tier
status: deferred
severity: low
requirements: [KIT-01, KIT-02]
decision: DEFER (user, 2026-06-24) — agreed both will be needed but NOT built now; add when a concrete dense
  surface requires it. Recorded in MemPalace (wing `web`, room `design-system-backlog`).
evidence: |
  User questions: "кнопки-иконки не нужны?" and "две кнопки sm/md … точно хватит? … нужны будут низкие кнопки".
  Icon-only already works via the existing Button (Lucide child + mandatory `aria-label`, documented in
  Button.tsx), but there is no dedicated SQUARE `icon` size (equal padding + `min-w-11` to pair the 44px floor),
  so an icon button renders rectangular `px-4`. And sm/md differ only in padding/font while both hold `min-h-11`
  (44px a11y floor) — a compact <44px tier would be needed for dense toolbars/tables, but the only dense use
  today (the sort-header Th) already runs `size="sm"` at the 44px floor.
fix: |
  Deferred. When built: add an `icon` size (square, `min-w-11`) + a catalog story; consider a `compact` low
  tier (with the documented WCAG target-size trade-off) only once a real dense surface needs it.

### GAP-25 — Catalog taxonomy: Button under "Base", Typography under "Foundations"
status: resolved
resolved: 2026-06-24 — no change (user accepted the rationale). Foundations = token primitives (Typography is a
  token scale, DS-01), Base = interactive components (Button); the split is the standard design-system taxonomy
  and grows naturally as more items land. Optional future rename `Base → Components` for clarity; not done now.
severity: low
requirements: [KIT-02]
evidence: |
  User question: "почему кнопки и типографика в разных блоках (Base / Foundations)? не логичнее оба в Base?"
  The two groups currently hold one item each, which reads as arbitrary, but the semantic split is correct —
  Typography is a token scale (a foundation), not a component.
fix: |
  None required. Optionally rename the "Base" Ladle group to "Components"; merging Typography into "Base" was
  rejected (it is a token foundation, not a base component).

### GAP-26 — Nav role model: admin sees «админка», moderator sees «очереди» — one panel or two?
status: resolved
resolved: 2026-06-24 — user decision: "админка включает в себя очереди" (the admin panel subsumes the moderation
  queue). The current `navFixtures.ts` model is therefore correct as-is — `admin → админка` (queues live inside
  it), `moderator → очереди`, both as additions to the universal account entry (GAP-02). No code change.
severity: low
requirements: [KIT-01]
evidence: |
  User question: "почему у админа админка, а у модератора очереди? разве у них не обоих одна админка?" Surfaced
  the role-model question of whether admin ⊇ moderator. Resolved by defining админка ⊇ очереди, so a separate
  admin "очереди" nav entry is unnecessary (admin reaches the queue through the admin panel).
fix: |
  None required. Decision recorded; `navFixtures.ts` unchanged. The real app builds the nav from the route tree
  + signed-in role in v1.0 — this fixture documents the intended role model.
