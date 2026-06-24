---
phase: 02-uikit-structural-data-display-primitives
reviewed: 2026-06-24T00:00:00Z
depth: deep
files_reviewed: 14
files_reviewed_list:
  - DESIGN.md
  - scripts/gen-theme.mjs
  - packages/design/src/styles/theme.css
  - packages/design/.ladle/tailwind.css
  - packages/design/src/shared/uikit/Table/TableRow.tsx
  - packages/design/src/shared/uikit/CompactRow/CompactRow.tsx
  - packages/design/src/shared/uikit/CompactRow/CompactRow.stories.tsx
  - packages/design/src/shared/uikit/Skeleton/Skeleton.tsx
  - packages/design/src/shared/uikit/Skeleton/Skeleton.stories.tsx
  - packages/design/src/shared/uikit/StatTile/StatTile.stories.tsx
  - packages/design/src/shared/uikit/_fixtures/strings.ts
  - packages/design/tests/cls.spec.ts
  - packages/design/tests/keyboard.spec.ts
  - packages/design/tests/responsive.spec.ts
findings:
  critical: 0
  warning: 5
  info: 3
  total: 8
status: issues_found
---

# Review — Phase 02 gap-closure (plans 02-10 + 02-11), scoped delta vs `bac4c3d`

**Scope:** The 14 listed source files, diffed against `bac4c3d69a31ad26fe314b9e20082f7649e92d9f`. This is the `@solid-stats/design` Ladle catalog package (`private`, no production app consumer yet). Reviewed at deep depth with the SolidStats frontend review chain (shared-review-standards §C buckets / §D format / §E verdict; frontend-react-conventions styling / a11y / component-shape / performance / typescript / localization / tests). Severity uses the §C buckets — emoji map: 🔴 Blocker, 🟠 High, 🟡 Medium, 🔵 Low.

**Skill chain read (confirmation):** `solidstats-shared-review-standards`, `solidstats-frontend-react-code-review`, `solidstats-frontend-react-conventions` (SKILL + references: styling.md, a11y.md, performance.md, component-shape.md, localization.md, tests.md, typescript.md, project-patterns.md), `solidstats-frontend-react-tests`, `solidstats-shared-testing-standards`, `solidstats-shared-ts-standards`, `solidstats-shared-project-standards`.

## Quality gate

✅ Token discipline — `gen-theme.mjs` regenerates `theme.css` byte-identical (ran it: no git diff); the two new `--shadow-selected` / `--shadow-row-focus` tokens flow `DESIGN.md elevation.* → resolveRefs → theme.css` (no inline hex, no hand-edit, `shadow=7` count matches). No arbitrary Tailwind values introduced in the diff.
✅ Motion — Skeleton sweep + selected/focus markers animate `transform`/are static box-shadows; `prefers-reduced-motion: reduce` drops the sweep to a static block (performance.md / styling.md Motion).
✅ i18n — `outcomeWin/Loss` intentional non-translation is documented (GAP-18) and RU/EN parity holds (both keys present, identical by design); consumed by Badge stories (not dead).
⚠️ a11y focus — the selected-row focus indicator can be silently dropped on a selected+focused row (finding 1); the GAP-10 "ring not clipped under sticky header" test does not actually prove the clip claim (finding 3).
⚠️ Graduation — the Skeleton sweep animation lives only in the Ladle harness CSS, not in the package's shipped style surface (finding 2).

## Blockers 🔴

_none_

## High 🟠

1. `packages/design/src/shared/uikit/Table/TableRow.tsx:65-66,97` [a11y / styling] — **A selected row that is also keyboard-focused loses one of its two markers.** GAP-09 moved the selected left-edge marker to `shadow-(--shadow-selected)` and GAP-10 added the focus-within frame as `shadow-(--shadow-row-focus)`. Both are Tailwind v4 `shadow-*` utilities, so both write the **same** `--tw-shadow` custom property — they cannot coexist in `box-shadow` (only `inset-shadow-*` writes the separate `--tw-inset-shadow` slot). Under the **merge-free `tailwind-variants/lite`** build (which this file uses and which styling.md explicitly warns about), both classes are emitted and CSS source order alone decides which `--tw-shadow` wins. So when a `selected` row receives keyboard focus (every row has a focusable name anchor → reachable), the row shows **either** the cyan focus ring **or** the selected left-edge marker, never both. If the selected marker wins, the keyboard user gets **no visible focus indication on the selected row** (WCAG 2.4.7), with no test covering the selected+focused intersection. The previous implementation avoided this because `selected` used a `before:` bar (not `box-shadow`), so it did not collide with the focus shadow.
   **Fix:** put the two markers on different shadow slots so they compose. Make the focus frame an inset *ring* and the selected marker an inset *shadow*, e.g. emit the selected marker via Tailwind's `inset-shadow-(--shadow-selected)` (→ `--tw-inset-shadow`) and keep the focus frame on `shadow-(--shadow-row-focus)` (→ `--tw-shadow`); `box-shadow` composes `var(--tw-inset-shadow), … var(--tw-shadow)` so both paint. Add a Playwright assertion for the selected+focused cell (focus a selected row's anchor and assert the computed `box-shadow` carries both the inset marker and the ring). `[conv: a11y — visible focus; styling — tailwind-variants/lite merge-free]`

2. `packages/design/src/shared/uikit/Skeleton/Skeleton.tsx:53` + `packages/design/.ladle/tailwind.css:48-100` [styling / architecture] — **The Skeleton sweep animation is defined only in the Ladle harness, so a shipped uikit primitive's behavior breaks on graduation.** `.sk-sweep` (the keyframe + the `::after` gradient) lives in `.ladle/tailwind.css`, whose own header documents it is the *Ladle-only* Tailwind root (Ladle sets the Vite root into `node_modules`, so this file exists purely for the catalog build). The `Skeleton` component is a `src/shared/uikit/` primitive intended to graduate into the production TanStack Start app, which imports **only `theme.css`** — and `theme.css` (generated, utilities-free) carries no `.sk-sweep`. On graduation every Skeleton (text / tile / table — the comment says "applied to EVERY variant") silently degrades to a static `bg-surface-2` block with no shimmer, i.e. the GAP-15 "visible loading cue" disappears in production. This couples a shipped primitive to the test harness — the conventions treat `theme.css` as the single style source and a uikit primitive must own its own styling, not borrow a class that only exists in the catalog. Not a *current* production break (no app consumes the package yet, `private: true`), hence High not Blocker — but it ships a primitive whose core behavior is harness-only.
   **Fix:** move the `.sk-sweep` recipe out of the Ladle-only root into a styles source the package actually exports and that the production Tailwind build will scan/emit (or express the sweep as a `@theme` keyframe + a real exported utility), so the same class compiles in both the catalog and the app. At minimum, leave an explicit graduation note in the component so the gap is closed before the first real consumer. `[conv: styling — theme.css is the single token/style source; architecture — uikit primitive self-contained]`

## Medium 🟡

3. `packages/design/tests/keyboard.spec.ts:182-187` [tests] — **The GAP-10 "ring not obscured by the sticky header (WCAG 2.4.12)" assertion does not test what it claims.** The test names the sticky-header-clip invariant but only asserts `rowBox.y > 0` (the row sits below the viewport top). That proves nothing about whether the inset focus ring is clipped by the sticky `<thead>` (`Table.tsx` `thead.sticky top-0 z-10`) — a row well below the top with an *outset* ring under a sticky header would still pass. The justification for choosing an *inset* ring (the whole GAP-10 rationale) is therefore unverified; a regression to an outset/clippable ring would not fail this test. Per testing-standards §G this is a weak oracle for the behavior it asserts.
   **Fix:** assert the inset property directly — read the row's computed `box-shadow` on focus and assert it contains `inset`, and/or scroll the table so the focused row is partially under the sticky header and assert the ring's painted top edge is still within the row's client box (or that the row's top is below the sticky `<thead>`'s bottom). `[conv: tests — strong oracle / visibility is a paint assertion]`

4. `packages/design/tests/keyboard.spec.ts:114-139` [tests] — **The GAP-09 column-alignment guard reads `boundingBox().x` rounded to the integer pixel, which can hide a sub-pixel colgroup shift.** `Math.round(box?.x ?? -1)` collapses a ≤0.5px shift to equality, so the very class of regression GAP-09 was meant to prevent (the selected row's columns drifting under `table-fixed`) could pass if it manifested as a fractional offset. The `?? -1` fallback also silently turns a missing box into a sentinel that would only fail by luck of array-length mismatch.
   **Fix:** compare unrounded `x` with a tight tolerance (e.g. `Math.abs(sel - en) < 0.5`) and assert each cell's box is non-null explicitly rather than substituting `-1`. `[conv: tests — strong oracle]`

## Low 🔵

5. `packages/design/src/shared/uikit/Skeleton/Skeleton.tsx:142` [styling/correctness] — the tile skeleton row pairs `flex items-center` (which does **not** stretch children) with an `h-full` shimmer bar; `h-full` (`height:100%`) does the stretching, so it works, but the combination is non-obvious and relies on `h-full` overriding the default `align-items` behavior. The companion zero-width non-joiner (a literal U+200C, rendered in source as `{"\u200C"}`) that establishes the line box is undocumented as the height driver beyond the block comment. Consider an explicit `self-stretch` on the bar (or `items-stretch` on the row) to make the reserve mechanism self-evident; cls.spec covers the resulting height, so this is cosmetics/clarity only. `[conv: component-shape — readability]`

6. `packages/design/src/shared/uikit/Table/TableRow.tsx:22-23` [naming] — the `RowState` union and the doc comment still say "×7 row states" / list `loading` in the JSDoc ("`loading` is the Skeleton variant"), but the `RowState` type enumerates six members and the GAP edits did not touch the count. Minor stale-comment drift introduced around the focused-state rework; align the comment with the actual union. `[conv: component-shape — comments]`

7. `packages/design/src/shared/uikit/CompactRow/CompactRow.tsx:55-58` [comments] — the GAP-13 comment is a 4-line essay justifying the removal of a single utility class (`min-h-11`). Per shared-review-standards §A (signal over volume) and component-shape.md (don't make the reader jump around), the rationale is fine but over-long for the change; the `responsive.spec` GAP-13 test already encodes the intent. Trim to one line. `[conv: component-shape]`

## Out of scope (pre-existing)

- `packages/design/src/shared/uikit/CompactRow/CompactRow.tsx:150` — `expandable && rows.length > topN ? … : null` parses as `(expandable && (rows.length > topN)) ? … : null` (a guarded ternary returning `null`), so it does not leak `false` into JSX — not a finding. Noted only because component-shape.md flags `&&`-in-JSX and a future reader might "fix" it; line is unchanged by this wave.

## Non-Findings Checked

- **Token discipline (Contract Adversary).** Ran `node scripts/gen-theme.mjs`: `theme.css` regenerates with no diff, and `--shadow-selected` / `--shadow-row-focus` resolve from `DESIGN.md elevation.*` via the shared `resolveRefs` (`{colors.primary}` → `#36C5E0`). No arbitrary Tailwind values, no hand-edited theme, no second token file — styling.md "tokens are generated, never hand-written" holds.
- **Transform-only + motion-reduce (Edge Hunter).** `.sk-sweep::after` animates `transform: translateX` only (never width/height/top/left) and the overlay is `position:absolute; inset:0`, so it never changes the reserved box (CLS = 0); `@media (prefers-reduced-motion: reduce)` zeroes the animation. Compliant — the only issue is *where* it is defined (finding 2), not *what* it animates.
- **StatTile delta CLS parity (GAP-16).** Verified the skeleton's three rows (`text-2xs` / `text-4xl` / `text-sm`) reproduce StatTile's exact line-box heights: theme.css pairs each `--text-*--line-height` as a **unitless** multiplier, so the line box = `font-size × ratio` independent of `font-display` vs default family. `gap-1 p-4` frame matches StatTile. cls.spec asserts both the delta and plain box-height equalities — parity holds.
- **i18n W/L non-translation (Acceptance Auditor).** `outcomeWin/Loss` are `ru === en` by design (GAP-18), documented in-fixture, RU/EN parity satisfied (key present in both), and consumed by Badge stories. localization.md "a key exists in both locales" is met; the intentional shorthand is not a missing translation.
- **`noUncheckedIndexedAccess` / typing.** `ROSTER[0]!` in StatTile.stories is a fixture story (non-null on a known-non-empty literal) — acceptable in catalog story scope, not shipped logic. No `any`, no unexplained `as`, no hand-written DTO in the diff.

## Validation Gaps

- **Visual / browser truths not run.** The CLS box-equality, the keyboard focus-ring paint, the selected-marker paint, the sweep-vs-reduced-motion, and the 360px no-scroll claims are Playwright `*.spec.ts` assertions I read but did **not execute** (no browser run in this static review). The reduced-motion sweep, the actual focus-ring composition (finding 1), and the sticky-header clip (finding 3) need the verify/browser pass to confirm.
- **Blast radius not mapped beyond the package** — no production app imports `@solid-stats/design` yet, so the finding-2 graduation impact is forward-looking, asserted from the package's own export surface, not from a live consumer.

## Verdict

**REQUEST CHANGES** — two 🟠 High findings must be fixed before this code is relied on by a real consumer:
- **Mandatory (1):** the selected+focused row dropping its focus ring or selected marker (`box-shadow` slot collision under merge-free `/lite`) — a WCAG 2.4.7 regression with no test coverage.
- **Mandatory (2):** the Skeleton sweep being defined only in the Ladle-only CSS root — the shimmer silently dies on graduation into production.

The 🟡 test-strength findings (3, 4) should be fixed so the GAP-09/GAP-10 guards actually prove their claims; the 🔵 items are optional cleanup.

---

_Reviewed: 2026-06-24_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
