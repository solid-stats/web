---
status: diagnosed
phase: 02-uikit-structural-data-display-primitives
source: [02-VERIFICATION.md]
started: 2026-06-21T14:30:00Z
updated: 2026-06-23T00:00:00Z
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
note: KIT-04/07/03/02 visually OK. KIT-01 nav-shell diverged from the binding hi-fi reference `.design/hifi/shell.jsx` (D-11) — 5 gaps logged below. Target model decided with the user: keep the 4-role model (signed-out/player/moderator/admin) but fix it (universal account/profile per signed-in role, right cluster, Brand, mobile account tab, corrected breakpoint).

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

### GAP-05 — SkipLink demonstrates poorly in the catalog (functionally correct)
status: failed
severity: low
requirements: [KIT-01, QUAL-03]
evidence: |
  `keyboard.spec.ts` is green: SkipLink is sr-only until focused, then visible and targets `#main` — so it
  WORKS. But the Matrix story shows nothing at rest, and in Ladle the first Tab lands in Ladle's own chrome,
  so the user tabbed and saw nothing (user finding 9). a11y addition beyond the hi-fi (which has no skip link).
fix: |
  Add a story cell that renders the focused/revealed state statically (or a visible hint "Tab to reveal"),
  so the catalog demonstrates the behavior without relying on iframe focus order. No change to the component
  contract. Lowest priority.
