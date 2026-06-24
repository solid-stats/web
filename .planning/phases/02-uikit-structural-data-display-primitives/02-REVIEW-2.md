---
phase: 02-uikit-structural-data-display-primitives
reviewed: 2026-06-24T08:01:25Z
depth: deep
files_reviewed: 17
files_reviewed_list:
  - packages/design/src/shared/uikit/Table/TableRow.tsx
  - packages/design/src/shared/uikit/Table/TableRow.test.ts
  - packages/design/src/shared/uikit/Table/Th.tsx
  - packages/design/tests/keyboard.spec.ts
  - packages/design/tests/responsive.spec.ts
  - packages/design/src/styles/uikit.css
  - packages/design/.ladle/tailwind.css
  - packages/design/src/shared/uikit/Skeleton/Skeleton.tsx
  - packages/design/src/shared/uikit/AppShell/AppShell.tsx
  - packages/design/src/shared/uikit/Button/index.ts
  - packages/design/src/shared/uikit/NavBar/NavBar.tsx
  - packages/design/src/shared/uikit/MobileTabBar/MobileTabBar.tsx
  - packages/design/src/shared/uikit/CompactRow/CompactRow.tsx
  - packages/design/src/styles/theme.css
  - scripts/gen-theme.mjs
  - DESIGN.md
  - packages/design/package.json
findings:
  critical: 0
  blocker: 0
  warning: 0
  info: 2
  total: 2
status: resolved
resolution:
  reviewed_verdict: approve
  all_findings_fixed: true
  low_findings_fixed:
    - "IN-01 (--shadow-selected orphan-token comment overstated runtime use) — fixed in f9ebd49: gen-theme.mjs + TableRow.tsx comments now state it is the documented table-row.selected design-of-record value, NOT consumed at runtime (the shipped marker is --shadow-selected-marker on the inset-shadow slot). Token kept as design-of-record; DESIGN.md/theme.css untouched."
    - "IN-02 (RowStates story used border-collapse vs production border-separate) — fixed in 5ba186b: story table now uses `border-separate border-spacing-0` matching Table.tsx, so the GAP-09 alignment test asserts the as-shipped geometry."
  gate_after_fix: "Vitest 97, Playwright 252, pnpm check exit 0."
---

# Phase 02 — UIKIT Structural / Data-Display Primitives — Code Review (Round 2)

**Reviewed:** 2026-06-24T08:01:25Z
**Depth:** deep
**Files Reviewed:** 17 (committed delta vs `3ff55ca`)
**Status:** issues_found (2 × 🔵 Low only)

## Quality gate

✅ `vp check` (Oxlint + Oxfmt + tsgo) — **0 errors** across all reviewed files (the only 30 warnings are in the frozen `.design/` hi-fi reference, out of scope per AGENTS.md).
✅ Vitest sync oracles — `TableRow.test.ts` + `control.test.ts` **17/17 pass**.
✅ Playwright — `keyboard.spec.ts` + `responsive.spec.ts` **47/47 pass** (incl. the WCAG 2.4.7 selected+focused composition, the GAP-09 colgroup-alignment, the GAP-10 inset-ring, and the GAP-21 container-ceiling tests).
✅ `theme.css` regenerates **byte-identical** from `gen-theme.mjs` — not hand-edited, generation pipeline consistent.
✅ Styling token discipline — no arbitrary Tailwind values; `max-w-(--container)` and the shadow utilities all resolve to `@theme` tokens.
✅ a11y — `never-color-alone` preserved (`aria-selected` + marker, `aria-current` + cyan + edge bar); inset focus ring unclippable under the sticky header.

## Summary

This is a clean, well-engineered round. Every load-bearing claim in the focus areas was **verified against the real toolchain, not just read**:

- **(a) Inset-shadow vs shadow slot composition.** Compiled Tailwind v4.3.1 confirms `inset-shadow-(--shadow-selected-marker)` → `--tw-inset-shadow: inset var(...)` and `shadow-(--shadow-row-focus)` → `--tw-shadow: var(...)`, both folded into `box-shadow: var(--tw-inset-shadow), …, var(--tw-shadow)`. The new `--shadow-selected-marker` token correctly **omits** the `inset` keyword (the utility prepends it). A selected+focused row paints BOTH layers — the WCAG 2.4.7 Playwright test proves it at runtime.
- **(b) `FORCED_STATE` / `ROW_FORCED_STATE` mirror the live recipes.** The sync tests are **strong oracles, not tautologies**: they extract the recipe's real pseudo-prefixed utilities (`pseudo(row(),"hover"|"focus-within")`, `pseudo(control(v),"active"|"focus-visible")`) and assert set-equality against the `!`-stripped forced map. A drifted map (a changed hover fill, a re-introduced fake `pressed`, a moved ring) fails the test. The old drifted local `state` variants (`translate-y-px bg-surface-2` invented presses, plain non-`!` utilities that lost by stylesheet order under `/lite`) are genuinely removed.
- **(c) Strengthened keyboard oracles.** No weak `y>0` and no `Math.round` masking remain. The GAP-09 alignment test compares **unrounded** cell `x` with a `< 0.5px` tolerance; the WCAG 2.4.7 test parses the serialized `box-shadow` segments and asserts both the `2px 0px 0px 0px inset` marker and the `0px 0px 0px 2px inset` ring are present; the GAP-10 test asserts the ring is `inset` (regression to an outset/clippable ring fails).
- **(d) Container-ceiling wiring.** Token-driven (`max-w-(--container)` → `max-width: var(--container)` = 1760px, no arbitrary value). The assertion proves the **CAP** (content width < `<main>` width on wide screens + symmetric gutters), not mere fit.
- **(e) Token discipline + exported `uikit.css` layering.** `.sk-sweep` correctly moved to the package-exported `src/styles/uikit.css` (with `package.json` `./uikit.css` export + Ladle `@import`), keeping `theme.css` the single generated token source. The graduation-note in `Skeleton.tsx` correctly warns a consumer must import `@solid-stats/design/uikit.css`.
- **(f) Touched-component regressions.** The Skeleton `items-center`+`h-full` → `items-stretch`+`self-stretch` fix is correct (explicit cross-axis reserve). The NavBar/MobileTabBar/Th GAP-20 refactors correctly route through the shared `FORCED_STATE`/`control` map.

Only two cosmetic 🔵 Low items, neither blocking.

## Blockers 🔴

_none_

## High 🟠

_none_

## Medium 🟡

_none_

## Info 🔵

### IN-01: `--shadow-selected` (inset-bearing) token is orphaned at runtime

**File:** `packages/design/src/styles/theme.css:115`, `scripts/gen-theme.mjs:317-323`, `DESIGN.md:214`
**Issue:** After the GAP-09 fix, no live component consumes `shadow-(--shadow-selected)` — the only references are the generated `theme.css` definition and a code comment in `TableRow.tsx:89`. The `gen-theme.mjs` comment claims `--shadow-selected` is "still referenced in the design-system component recipe," but the package `src` has no such consumer; the marker is now `--shadow-selected-marker`. The DESIGN.md `table-row.selected.boxShadow` recipe (line 392) does document the inset value as the design-of-record, so the token isn't strictly dead from the spec's perspective — but it ships an unused runtime custom property and the `gen-theme.mjs` justification overstates its current use.
**Fix:** Either keep it intentionally and tighten the comment ("retained as the documented design-system `table-row.selected` value of record; not consumed at runtime — the row uses `--shadow-selected-marker`"), or drop the `selected:` elevation entry from `DESIGN.md` and re-export so `theme.css` emits only `--shadow-selected-marker`. No behavior impact either way; this is hygiene on a generated artifact.

### IN-02: `RowStates` story renders the table with `border-collapse` while production `Table` uses `border-separate`

**File:** `packages/design/src/shared/uikit/Table/Table.stories.tsx:195` (the harness the GAP-09 alignment test in `keyboard.spec.ts:114` drives), vs `Table.tsx:123` (`border-separate border-spacing-0`)
**Issue:** The `RowStates` matrix table uses `className="w-full table-fixed border-collapse"`, but the real `Table` (and the `TableRow` GAP-08 comment, which reasons about the `border-separate` model) renders `border-separate`. The selected marker is an inset box-shadow with no layout impact under either border model, so the test stays valid and all 47 specs pass — but the catalog cell the GAP-09 alignment test asserts against does not exercise the production border model, slightly weakening the "columns stay aligned" guard's fidelity to what actually ships.
**Fix:** Align the `RowStates` story `<table>` to the production `border-separate border-spacing-0` so the catalog matrix and the real table share the same border model (and the alignment test asserts the as-shipped geometry). Story-only, no production-code change.

---

## Out of scope (pre-existing)

- `package.json` (repo root) has an uncommitted working-tree change that only **reorders** `engines` / `packageManager` keys to the bottom of the file (formatter churn) — not part of this work and explicitly instructed to ignore.
- `DESIGN.md` has uncommitted markdown-table re-alignment whitespace churn — instructed to ignore; the only committed DESIGN.md delta is the single `selected` / `selected-marker` elevation token (reviewed under IN-01).
- `scripts/gen-theme.mjs` `counts`/`bump(...)` is an informational log line, not a hard assertion — a drifted count would not fail generation. Pre-existing pattern; the `bump("shadow", 4→5)` was correctly updated to match the 5 emitted vars, so no action needed.

## Non-Findings Checked

- **Contract Adversary** — `inset-shadow-(--shadow-selected-marker)` ⊕ `shadow-(--shadow-row-focus)` slot composition: compiled with Tailwind 4.3.1 and confirmed they land on `--tw-inset-shadow` / `--tw-shadow` respectively and both serialize into `box-shadow`. No collision under the merge-free `/lite` build. The `package.json` `./uikit.css` export map is well-formed (ordered before `.`); Ladle `@import` and the Skeleton graduation-note keep catalog and consumer compiling the same `.sk-sweep`.
- **Edge / Failure Hunter** — checked the latent edge where `forcedNavClass`/`forcedTabClass` apply the forced `!`-important utilities regardless of an item's `disabled` resolution: the `NavBar`/`MobileTabBar` story matrices only combine `forcedState` with non-disabled items (`FORCED_STATES = [enabled, hover, pressed, focused]`, the `disabled` cell passes `forcedState=undefined`), so the disabled+forced-hover combination is never reached — no reachable consequence, suppressed per the noise filter. The `keyboard.spec` `clip === "auto"` assertion is a valid guard against re-introducing legacy `clip` (which `not-sr-only` provably never resets) — green today because the `.sr-only` recipe correctly uses `clip-path: inset(50%)` only; not a tautology.
- **Acceptance Auditor** — the GAP-20 sync tests prove the maps mirror the recipes (set-equality on extracted pseudo-utilities), not just that the code runs. The UI truths (selected+focused both paint, ring inset/unclipped, container caps & centers, 5-tab GAP-04, 44px GAP-13) are confirmed by the 47 passing Playwright assertions, not implied — `vitest run` and `playwright test` were both executed during this review.

## Validation Gaps

- The full CI matrix (Firefox / WebKit / forced-colors / axe / Lighthouse / bundle budgets) was **not** run here — only Chromium `keyboard.spec` + `responsive.spec` (47/47) plus the Vitest sync suite and `vp check`. The composition/regex/token claims are toolchain-verified; cross-browser `box-shadow` serialization (the WCAG 2.4.7 segment-parse) was validated on Chromium only, matching the spec's `always-on chromium` project comment.

## Verdict

**APPROVE** — round-2 work is correct, well-tested, and on-convention. All four round-1 fixes (the inset/shadow two-slot composition + the non-inset `--shadow-selected-marker` token, the exported `uikit.css`, the strengthened GAP-09/GAP-10 oracles, the skeleton stretch) and both GAP additions (GAP-20 shared `FORCED_STATE` mirrors, GAP-21 token-driven container ceiling) are verified end-to-end. The two 🔵 Low items are generated-artifact hygiene and a story/production border-model mismatch — cosmetic, non-blocking.

---

_Reviewed: 2026-06-24T08:01:25Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep — skill chain read in full: solidstats-shared-review-standards, solidstats-shared-testing-standards, solidstats-frontend-react-code-review, solidstats-frontend-react-conventions (+ references: project-patterns, styling, a11y, performance, component-shape, tests, typescript), solidstats-frontend-react-tests_
