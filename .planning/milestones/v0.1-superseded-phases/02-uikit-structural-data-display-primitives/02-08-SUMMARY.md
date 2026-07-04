---
phase: 02-uikit-structural-data-display-primitives
plan: 08
subsystem: ui
tags: [nav-shell, kit-01, three-zone-navbar, container-queries, a11y, sr-only, steam-oauth, tailwind-variants, gap-closure]

# Dependency graph
requires:
  - phase: 02-uikit-structural-data-display-primitives (02-04 Nav-shell)
    provides: "the original SkipLink / NavBar / MobileTabBar / AppShell slices, the data-state forced-pseudo matrix, the before:-edge active marker, keyboard.spec + responsive.spec"
  - phase: 02-uikit-structural-data-display-primitives (02-07 Button/Link base)
    provides: "the shared Button/Link control recipe (≥44px hit area + ONE canonical focus-visible ring + cursor-pointer + variant tokens) that the reworked nav controls consume"
provides:
  - "GAP-01: three-zone NavBar — [Brand] [section links] [right utility cluster: search · language · account/sign-in], right cluster pinned via ml-auto"
  - "GAP-02: universal account control — every signed-in role (player/moderator/admin) gets the SAME account entry; signed-out gets Steam sign-in; role extras (queue/admin) ADD to the cluster"
  - "GAP-03: raised container breakpoint @5xl (~1024px) + a mid-width condense (section labels icon-only below @5xl) so no width shows a cramped/overflowing bar"
  - "GAP-04: MobileTabBar = 4 primary section tabs + a dedicated 5th account/sign-in tab slot (not navItemsFor().slice(0,4))"
  - "GAP-05: reveal-safe SkipLink (clip-path:inset(50%) not legacy clip) + keyboard.spec asserts the computed clip/clip-path reveal so it cannot pass while clipped"
  - "NavAccount type + SteamLogo (sanctioned inline brand SVG) graduated from the NavBar slice"
affects: [02-09-data-table-fixes, phase-04-overview-surface, phase-08-authenticated-surfaces, phase-09-all-surfaces]

# Tech tracking
tech-stack:
  added: []  # no new packages — Steam mark is a local inline SVG; lucide-react already present
  patterns:
    - "Three-zone header layout: a left brand slot + a center role-invariant section nav + a right ml-auto utility cluster; the account control is a discriminated NavAccount union ({kind:'account'} | {kind:'signin'}) the consumer threads in"
    - "Container-query condense: section-link labels are `hidden @5xl:inline` so the bar is icon-only between the mobile floor and the raised desktop breakpoint, never cramped"
    - "Reveal-safe visually-hidden recipe: hide via clip-path:inset(50%) (modern) NOT legacy clip:rect — Tailwind's not-sr-only only resets clip-path, so a legacy clip paints nothing on focus (paint-blind a11y bug)"

key-files:
  created:
    - packages/design/src/shared/uikit/NavBar/SteamLogo.tsx
  modified:
    - packages/design/.ladle/tailwind.css
    - packages/design/src/shared/uikit/SkipLink/SkipLink.tsx
    - packages/design/src/shared/uikit/NavBar/NavBar.tsx
    - packages/design/src/shared/uikit/NavBar/NavBar.stories.tsx
    - packages/design/src/shared/uikit/NavBar/navFixtures.ts
    - packages/design/src/shared/uikit/NavBar/index.ts
    - packages/design/src/shared/uikit/_fixtures/strings.ts
    - packages/design/src/shared/uikit/MobileTabBar/MobileTabBar.tsx
    - packages/design/src/shared/uikit/MobileTabBar/MobileTabBar.stories.tsx
    - packages/design/src/shared/uikit/AppShell/AppShell.tsx
    - packages/design/src/shared/uikit/AppShell/AppShell.stories.tsx
    - packages/design/tests/keyboard.spec.ts
    - packages/design/tests/responsive.spec.ts

key-decisions:
  - "Account is a discriminated NavAccount union threaded by the consumer (accountFor(role)), not derived inside NavBar — keeps the shell role-agnostic (NO RBAC, v1.0) while making the universal-account model explicit"
  - "navItemsFor(role) now returns ONLY the public sections (role-invariant); account + role-extras moved OUT of the section list into the right cluster (GAP-02 root fix)"
  - "Raised breakpoint = @5xl (Tailwind's default container-query named scale: --container-5xl = 64rem/1024px) — the theme reset zeroes --color/--font/--text/… but NOT --container-*, so the named container scale survives; @5xl is a token, not an arbitrary @[...]"
  - "GAP-05 fix = the minimal clip-path:inset(50%) swap (not deleting the custom .sr-only) so the Sparkline figcaption hide behaviour is untouched; verified the figcaption still hides"
  - "Mobile 5th tab uses SHORT labels (tabAccount/tabSignIn) distinct from the desktop long labels (navAccount/navSignInSteam)"

patterns-established:
  - "Pattern 1: NavAccount discriminated union for the account/sign-in control — the same shape drives the NavBar right cluster (secondary/primary variant) and the MobileTabBar 5th tab (Link/Button)"
  - "Pattern 2: reveal-safe sr-only — any visually-hidden-until-focused control must hide via clip-path, never legacy clip; the keyboard.spec asserts the computed reveal so the regression class cannot return green"

requirements-completed: [KIT-01, QUAL-02, QUAL-03]

# Metrics
duration: 14min
completed: 2026-06-23
status: complete
---

# Phase 02 Plan 08: KIT-01 Nav-shell Rework (GAP-01…GAP-05) Summary

**The shipped nav-shell (02-04) is reworked to match the binding hi-fi `.design/hifi/shell.jsx`: a three-zone NavBar with the right-pinned utility cluster, a UNIVERSAL account entry for every signed-in role (+ Steam sign-in when out), a raised `@5xl` desktop breakpoint with a mid-width icon-only condense, a 5-tab MobileTabBar with a dedicated account/sign-in tab, and a reveal-safe SkipLink whose keyboard.spec now asserts the computed clip/clip-path so the paint-blind a11y bug cannot return green.**

## Performance
- **Duration:** ~14 min (start 17:11Z → end 17:25Z)
- **Tasks:** 3 (all auto)
- **Files:** 14 (1 created, 13 modified)

## Accomplishments
- **GAP-05 SkipLink reveal:** the custom `.sr-only` in `.ladle/tailwind.css` now hides via `clip-path: inset(50%)` (was the legacy `clip: rect(0,0,0,0)` that `not-sr-only` never resets — the link kept its 44px box but painted nothing on focus). `SkipLink.tsx` adds `focus:px-4` so the revealed chip's text doesn't touch the edge. `keyboard.spec.ts` now asserts `getComputedStyle(...).clipPath === "none"` AND `.clip === "auto"` on focus — a paint-blind regression fails the gate.
- **GAP-01 three-zone NavBar:** `[Brand]` (a consumer-passed word-mark node, ghost Link) · `[section links]` (role-invariant, center) · `[right cluster]` pinned via `ml-auto` — search (icon-only ghost Button, aria-labelled), language toggle (ghost Button + lang code, aria-labelled), and the account control.
- **GAP-02 universal account:** `accountFor(role)` returns the SAME account entry (`<Button variant="secondary">` + user glyph + navAccount) for player/moderator/admin, and the Steam sign-in (`<Button variant="primary">` + SteamLogo) for signed-out. `roleExtrasFor(role)` (moderator→queue, admin→admin) ADD to the cluster — they never replace the account entry. `navFixtures` was split so `items` = public sections only.
- **GAP-03 raised breakpoint + condense:** AppShell reflow moved from `@md` (448px, cramped) to `@5xl` (~1024px, fits); NavBar section labels are `hidden @5xl:inline` (icon-only below, full labels at `@5xl`), so no intermediate width overflows. A mid-width (800px) responsive.spec assertion proves no overflow + still-collapsed.
- **GAP-04 5-tab MobileTabBar:** a dedicated `accountTab` slot (the 5th tab) — the account entry (Link) when signed-in, the Steam sign-in (Button) when out — separate from the 4 section tabs (overview·players·bounty·replays; squads/commanders absent matches the hi-fi). responsive.spec asserts exactly 5 tabs incl. the account/sign-in tab.
- **SteamLogo:** the one sanctioned inline brand SVG (Lucide has no brand marks), re-created from the hi-fi (D-11 — never ported), `fill="currentColor"` + `aria-hidden` (no raw hex; inherits the control's token color).

## Task Commits
1. **Task 1: GAP-05 reveal-safe SkipLink + strengthened keyboard.spec** — `4a4efef` (fix)
2. **Task 2: GAP-01/02 three-zone NavBar + universal account cluster** — `a9cbfac` (feat)
3. **Task 3: GAP-03/04 raised @5xl breakpoint + 5-tab MobileTabBar + AppShell slots** — `fc01efd` (feat)

## Decisions Made
- **NavAccount is a discriminated union threaded by the consumer** (`accountFor(role)`), not derived inside NavBar — the shell stays role-agnostic (NO RBAC, v1.0) while the universal-account model is explicit in the prop contract.
- **`navItemsFor(role)` returns only public sections** now (role-invariant); the account + role-extras moved into the right cluster. This is the GAP-02 root fix — they used to leak into the section row.
- **Raised breakpoint = `@5xl`** (Tailwind's default container-query named scale, `--container-5xl` = 64rem/1024px). The theme reset zeroes `--color-*`/`--font-*`/etc. but NOT `--container-*`, so the named container scale survives — `@5xl` is a token, not an arbitrary `@[...]`.
- **GAP-05 = the minimal `clip-path` swap** (not deleting the custom `.sr-only`) so the Sparkline figcaption hide is untouched (verified still hidden, catalog axe green).
- **Mobile 5th tab uses SHORT labels** (`tabAccount`/`tabSignIn`) distinct from the desktop long labels (`navAccount`/`navSignInSteam`).

## Design Review — diff vs the binding hi-fi `.design/hifi/shell.jsx` (verdict: APPROVE)

Seven-pillar review, diffing the reworked nav-shell against the binding hi-fi (D-11). Verified via real-width Playwright screenshots (1280 desktop NavBar/AppShell, 360 MobileTabBar):

| hi-fi nav-shell semantic | reworked implementation | verdict |
|---|---|---|
| three clusters `[Brand] [nav-links] [nav-right: search · language · account/sign-in]` | three zones; right cluster pinned `ml-auto`; search + language (RU/EN) + account | MATCH |
| `signedIn ? account : steam sign-in` — universal account | `accountFor(role)`: account (secondary) for every signed-in role, Steam sign-in (primary) signed-out; queue/admin ADD | MATCH (extended 4-role model, fixed — per the user decision, not the hi-fi `signedIn` boolean) |
| mobile bar up to a normal desktop breakpoint (not @md) | raised to `@5xl` (~1024px) + icon-only condense below it | MATCH |
| `SHELL_TAB` = overview·players·bounty·replays + a 5th `signedIn ? Account : Sign-in` | 4 section tabs + dedicated `accountTab` 5th slot (account / Steam sign-in) | MATCH (squads absent on mobile matches the hi-fi) |
| SkipLink reveals on focus | reveal-safe `clip-path`; keyboard.spec asserts the computed reveal | MATCH |

- **Pillar 1 (tokens/contrast):** 0 arbitrary values / raw hex across all nav-shell slices (grep clean — the SteamLogo path `d=` is SVG geometry, not a CSS hex; `fill=currentColor`). `design.md lint` errors=0 (86 pre-existing warnings). `@5xl` is a container token.
- **Pillar 3 (a11y):** axe serious/critical = 0 across the catalog; icon-only search + language controls carry `aria-label` (navSearchAria/navLanguageAria); ≥44px on every control via the shared `control` recipe; never color-alone (active = cyan + `aria-current` + `before:`-edge); SkipLink reveal-on-focus (2.4.1/2.4.12).
- **Pillar 4/5 (states/responsive):** ×7 forced states preserved; roles ×4 RU+EN; reflow container-keyed at the raised `@5xl`; no-h-scroll at 360px + 800px mid-width; 5-tab mobile asserted.
- **Pillar 6 (domain):** dark-only gunmetal; cyan the single accent (active marker + primary Steam button); Lucide-only (+ the one sanctioned Steam SVG); RU reads naturally, no clipping at 360px.

## Deviations from Plan
None — plan executed as written. The AppShell `@5xl` breakpoint raise and the `accountTab` threading (nominally split across Task 2/3 boundaries) were landed together in Task 3 because AppShell renders NavBar + MobileTabBar and could not be left half-threaded between commits; the NavBar three-zone rework itself is the Task 2 commit, the breakpoint/5th-tab the Task 3 commit.

## Known Stubs
None — every control is wired through the shared Button/Link recipe with real labels/handlers-as-href; the role model is fixture-driven (catalog-only, NO RBAC — the documented v1.0 seam, threat T-02-08-01 accepted). The `forcedState` matrix cells mirror the ghost recipe's real tokens (GAP-20 fake-matrix audit is explicitly a separate deferred follow-up, status: open — no NEW fake forced cells were added here).

## Verification (plan `<verify>`)
- ✅ `pnpm exec ladle build` — green.
- ✅ `pnpm exec playwright test` — **218/218** (axe serious/critical=0; SkipLink computed-clip reveal; NavBar three zones + universal account; 5-tab mobile incl. account/sign-in; raised @5xl reflow + mid-width no-overflow; 360px no-h-scroll).
- ✅ `pnpm exec vitest run` — **95/95** (STRINGS RU+EN parity incl. the 6 new keys).
- ✅ Root `pnpm check` — **exit 0** (gen-theme + theme.css no-drift; design.md lint errors=0; vp format/lint/types clean).
- ✅ `grep 'clip: rect' .ladle/tailwind.css` — ZERO active rule (only the explanatory comment names it).
- ✅ `grep 'ml-auto' NavBar.tsx` — matches; `grep '@5xl' AppShell.tsx` — matches; `grep '@\['` AppShell.tsx — ZERO.
- ✅ No-arbitrary-values/raw-hex grep across NavBar/MobileTabBar/AppShell/SkipLink — ZERO.
- ✅ design-review APPROVE with the `.design/hifi/shell.jsx` diff (above).

## Issues Encountered
- **Flaky stale-preview race (catalog spec).** The first full matrix run reported 2 spurious trustbadge failures (axe + 44px) from Playwright `reuseExistingServer` reusing a leftover `ladle preview` on a pre-rebuild bundle (the same artifact noted in 02-07). Re-running in isolation and after killing the stale preview → green. No code change.
- **Out-of-scope working-tree changes left untouched:** a pre-existing uncommitted `.ladle/config.mjs` (Ladle width presets) and unrelated `.agents/skills/*` deletions / STATE.md / skills-lock.json were present before this work and are intentionally NOT staged (scope discipline).

## User Setup Required
None.

## Next Phase Readiness
- The reworked AppShell/NavBar/MobileTabBar are the structural frame later surfaces mount into — three zones, universal account, raised breakpoint, 5-tab mobile, reveal-safe skip link, all reviewed against the binding hi-fi.
- `NavAccount` + `SteamLogo` are exported; `accountFor`/`roleExtrasFor`/`publicSections` are the durable fixture seam the v1.0 app swaps for route-tree + signed-in-role data.
- 02-09 (data-table fixes) runs next on the same tree and shares `_fixtures/strings.ts`, `tests/responsive.spec.ts`, `src/index.ts` — this plan confined its edits to additive insertions in those shared files.

## Self-Check: PASSED
- `packages/design/src/shared/uikit/NavBar/SteamLogo.tsx` exists on disk.
- All 3 task commits present: `4a4efef`, `a9cbfac`, `fc01efd`.
- Playwright 218/218, Vitest 95/95, `pnpm check` exit 0 — actually run (not claimed).

---
*Phase: 02-uikit-structural-data-display-primitives*
*Completed: 2026-06-23*
