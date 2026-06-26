---
phase: 03-uikit-interactive-i18n-global-state-patterns
verified: 2026-06-26T08:00:00Z
status: passed
score: 26/26
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: human_needed
  previous_score: 9/9 (original SCs only; 17 visual gaps open)
  gaps_closed:
    - GAP-01 — RU↔EN toggle never renders (EN unreachable); fixed: ?locale= URL-param source
    - GAP-02 — Overlay entrance animations dead (mount flush in data-state=open); fixed: .uikit-overlay-motion keyframe policy
    - GAP-03 — AsyncBoundary CLS false-green test (h-64 cage measured, not routed primitive); fixed: real oracle + Table geometry for ready slot
    - GAP-04 — Toast flush stacking / no enter-exit; fixed: Toast.Root + overlap:false + .uikit-toast-motion
    - GAP-05 — FileUpload two previews per image (.*  catch-all); fixed: single ItemPreview branched on file.type
    - GAP-06 — FileUpload row controls off-catalog (duplicate itemDeleteTrigger recipe); fixed: icon-only Button size, asChild routing, disabled forwarded
    - GAP-07 — Required Field no visible marker; fixed: * glyph + sr-only requiredText in Field label
    - GAP-08 — Dialog dead row above title (CloseTrigger first flex child); fixed: absolute right-3 top-3
    - GAP-09 — Empty-options Select blank listbox; fixed: emptyText in-listbox empty-state node
    - GAP-10 — No Select clear control; fixed: opt-in clearable prop + Ark ClearTrigger
    - GAP-11 — Stepper Playground pinned (no onValueChange); fixed: useState keyed on value arg
    - GAP-12 — KIT-05 story wrappers 392px at 360 floor; fixed: w-full max-w-90 across 4 stories
    - GAP-13 — FileUpload unbounded list / 3-file fixture; fixed: itemGroup max-h-64 overflow-y-auto + ~30-file fixture
    - GAP-14 — Field caption same color as label; resolved: DESIGN.md token decision recorded (shared text-muted intentional, hierarchy via typography)
    - GAP-15 — Select long-option overflows 360 floor; fixed: max-w-80 on listbox content slot
    - GAP-16 — a11y/dead-code sweep (AsyncBoundary no aria-live; ToastManager empty title; Tabs dead Indicator); fixed: role=status on loading, empty-title guard, Indicator removed
    - GAP-17 — RESERVE (not build): FU7 i18n vocab + itemStatus slot reserved for v1.0; verified NOT built
  gaps_remaining: []
  regressions: []
---

# Phase 03: UIKIT Interactive, i18n & Global-State Patterns — Verification Report

**Phase Goal:** Ship the interactive UIKIT — KIT-05 form family (Field, Input, Select, Stepper, FileUpload), KIT-06 overlay family (Dialog, Popover, Menu, Tabs, Tooltip), KIT-08 typed RU/EN i18n harness + Ladle language switcher, SURF-18 global-state patterns (AsyncBoundary + Toast manager) — all under QUAL design-review gates, presentational in Ladle (v0.1, no app/routes/network).

**Verified:** 2026-06-26T08:00:00Z
**Status:** passed — all 17 visual gaps closed, all automated gates green, all gap fixes regression-locked
**Re-verification:** Yes — after gap-closure batch (03-08..03-15), closing GAP-01..GAP-17 from the visual UAT pass

---

## Gate Commands (per orchestrator + confirmed clean tree)

| Command | Result |
|---------|--------|
| `pnpm check` (gen-theme drift + design.md lint + vp check tsgo/oxlint/oxfmt) | PASSED — 0 errors, 169 files |
| `pnpm --filter @solid-stats/design test` (Vitest unit) | PASSED — 192 passed |
| `pnpm --filter @solid-stats/design test:e2e` (Playwright) | PASSED — 374 passed |
| `git status` (working tree) | Clean — 49 commits ahead of origin |

---

## Goal Achievement

### Observable Truths — Original Success Criteria (SC#1–SC#9)

All 9 original truths from the pre-gap-closure verification remain VERIFIED with no regression. See the prior verification for evidence details (gap-closure plans are additive — they fixed visual/UX issues without regressing structural goals).

| # | Truth | Status |
|---|-------|--------|
| SC#1 | Every story resolves strings bilingually; locale control switches copy | VERIFIED (unchanged) |
| SC#2 | Locale toggle persistent and global (now via ?locale= URL param) | VERIFIED (upgraded: was structurally present but non-functional → now runtime-proven by i18n-toggle.spec.ts) |
| SC#3 | RU catalog has ICU plural form | VERIFIED (unchanged) |
| SC#4 | Missing/misspelled message id is a tsc type error | VERIFIED (unchanged) |
| SC#5 | No shared/uikit primitive imports @lingui or _i18n | VERIFIED (unchanged) |
| SC#6 | KIT-05 form family exported from index.ts | VERIFIED (unchanged) |
| SC#7 | KIT-06 overlay family exported from index.ts | VERIFIED (unchanged) |
| SC#8 | SURF-18 global-state patterns exported from index.ts | VERIFIED (unchanged) |
| SC#9 | 374 e2e pass / 0 failed (QUAL gate) | VERIFIED (count grew from 344 to 374 as gap-closure plans added regressions) |

### Observable Truths — Gap-Closure Additions (GAP-01..GAP-17)

| # | Gap | Truth | Status | Evidence |
|---|-----|-------|--------|----------|
| G01 | GAP-01 | RU↔EN toggle is functional — `?locale=en` flips every story to EN, including no-args stories | VERIFIED | `readLocaleFromUrl()` in `components.tsx:35`; `toLocale` guard; `i18n-toggle.spec.ts` 3/3 green |
| G02 | GAP-02 | Opening Dialog/Menu/Popover/Tooltip actually animates closed→open (first frame opacity<1) | VERIFIED | `.uikit-overlay-motion` CSS keyframe in `uikit.css:93`; no overlay hardcodes `duration-150`; `motion.spec.ts` asserts first-frame opacity under `reducedMotion:"no-preference"` |
| G03 | GAP-03 | AsyncBoundary CLS oracle measures `[data-async-boundary]` (not h-64 cage); loading ≡ ready byte-for-byte | VERIFIED | `cls.spec.ts:229-230` locators on `[data-async-boundary='loading']`/`'ready'`; `readyContent` uses real KIT-02 Table; SURF-18 spec re-scoped in 03-UI-SPEC.md |
| G04 | GAP-04 | Toasts stack with gap>0 at rest and each plays enter/exit transition (transitionDuration>0) | VERIFIED | `uikit-toast-motion` in `uikit.css:181`; `overlap:false`; `translateY(var(--y))`; `motion.spec.ts` asserts toast gap + transition |
| G05 | GAP-05 | Accepted image renders exactly ONE preview (the `<img>`), never two siblings | VERIFIED | `FileUpload.tsx:145` branches on `file.type.startsWith("image/")`; `file-upload-preview.spec.ts` counts `[data-part="item-preview"]` = 1 per row |
| G06 | GAP-06 | FileUpload retry/delete route through Button (icon-only size), duplicate recipe deleted, disabled forwarded | VERIFIED | `control.ts:27` `size: "icon"` (`min-w-11`); `Button variant="ghost" size="icon"` in FileUpload.tsx; `itemDeleteTrigger` slot removed from `fileUpload.ts`; `form-affordances.spec.ts` asserts font-semibold signature |
| G07 | GAP-07 | Required Field shows visible `*` marker paired with sr-only requiredText — never asterisk in color alone | VERIFIED | `Field.tsx:75-78` conditional `requiredMarker` slot; `field.ts` `requiredMarker` slot with `text-loss`; `form-affordances.spec.ts` asserts marker visibility and sr-only text |
| G08 | GAP-08 | Dialog close is absolute top-right — no dead row of ~44px above the title | VERIFIED | `dialog.ts:51` content is `relative`; `dialog.ts:55` close is `absolute right-3 top-3`; `overlay-form-interaction.spec.ts` asserts title inset ≈ 25px (was ~85px) |
| G09 | GAP-09 | Empty-options Select shows in-listbox empty-state (message + icon) — never blank ~10px | VERIFIED | `Select.tsx:42-45` `emptyText` prop; `select.ts:30` `empty` slot; `role="presentation"` node; `overlay-form-interaction.spec.ts` asserts visible empty-state text |
| G10 | GAP-10 | Clearable Select renders accessible-named ClearTrigger that resets to the placeholder | VERIFIED | `Select.tsx:57` `clearable` prop (opt-in); `Select.tsx:111-112` Ark ClearTrigger with `aria-label={clearAria}`; `overlay-form-interaction.spec.ts` asserts clear + placeholder restored |
| G11 | GAP-11 | Stepper Playground is interactive — inc/dec/keyboard mutate the value and clamp at min/max | VERIFIED | `Stepper.stories.tsx:76-83` `useState` keyed on `value` + `onValueChange={setCurrent}`; `overlay-form-interaction.spec.ts` asserts value changes + increment disabled at max |
| G12 | GAP-12 | KIT-05 story 360-demo wrappers use `w-full max-w-90` — no horizontal overflow at 360 floor | VERIFIED | Input.stories.tsx:57, Select.stories.tsx:169, Stepper.stories.tsx:79, FileUpload.stories.tsx:164 all `w-full max-w-90 … data-floor-demo`; `form-layout-sweep.spec.ts` asserts right edge ≤ 360 |
| G13 | GAP-13 | FileUpload rows width-bound (truncate engages); itemGroup capped (`max-h-64 overflow-y-auto`); ~30-file fixture | VERIFIED | `fileUpload.ts` itemGroup `max-h-64 overflow-y-auto`; FileUpload.tsx rows `w-full min-w-0`; `FileUpload.stories.tsx:42` `MANY_FILES = Array.from({ length: 30 })` |
| G14 | GAP-14 | Caption-color decision recorded in DESIGN.md; theme.css drift gate green; no arbitrary values | VERIFIED | `DESIGN.md:557` "Form helper/caption text shares the label's `text-muted` — intentional (GAP-14)"; `field.ts` helperText slot unchanged; drift gate clean |
| G15 | GAP-15 | Select listbox has `max-w-80` viewport cap; grow-wider-than-trigger (min-w-(--reference-width)) preserved | VERIFIED | `select.ts:47-48` `min-w-(--reference-width) max-w-80`; `form-layout-sweep.spec.ts` asserts listbox width ≤ 320 |
| G16 | GAP-16 | AsyncBoundary loading announces via `role="status"`; ToastManager drops empty-title toasts; Tabs Indicator removed | VERIFIED | `AsyncBoundary.tsx:114` `<span className="sr-only" role="status">`; `ToastManager.tsx:95` guard `if (text === "") return null`; `Tabs.tsx:68` comment confirms Indicator removed |
| G17 | GAP-17 | FU7 sync vocab RESERVED in strings.ts; itemStatus slot wired as optional renderItemStatus; NO lightbox/sync built | VERIFIED | `strings.ts:182` `uploadSyncPending`, etc. (RU+EN, unconsumed); `FileUpload.tsx:77` `renderItemStatus?: (file: File) => ReactNode` (optional, guarded); no sync state model, no lightbox |

**Score:** 26/26 truths VERIFIED (9 original SCs + 17 gap-closure truths)

---

## Regression Spec Inventory (gap-closure plans)

All 6 new Playwright specs exist, ran RED on pre-fix code (per SUMMARY TDD evidence), and pass GREEN in the 374-test suite:

| Spec | Closes | RED commit | Tests |
|------|--------|-----------|-------|
| `tests/i18n-toggle.spec.ts` | GAP-01 | `4d348b3` | 3 |
| `tests/cls.spec.ts` (rewritten AsyncBoundary block) | GAP-03 | `a175199` | 3 |
| `tests/file-upload-preview.spec.ts` | GAP-05 | `dba759d` | 3 |
| `tests/motion.spec.ts` | GAP-02, GAP-04 | `aae3ee3` | 4 |
| `tests/form-affordances.spec.ts` | GAP-06, GAP-07 | `89bd07c` | 4 |
| `tests/overlay-form-interaction.spec.ts` | GAP-08, GAP-09, GAP-10, GAP-11 | `9cedcff` | 4 |
| `tests/form-layout-sweep.spec.ts` | GAP-12, GAP-13, GAP-15, GAP-16 | `3fb5a4b` | 4 |

---

## Required Artifacts — Gap-Closure Additions

| Artifact | Status | Notes |
|----------|--------|-------|
| `packages/design/.ladle/components.tsx` | VERIFIED | `readLocaleFromUrl()` + `toLocale` guard + keyed `i18n.activate` effect |
| `packages/design/.ladle/config.mjs` | VERIFIED | Dead `addons.control` block removed; URL-param source documented |
| `packages/design/tests/i18n-toggle.spec.ts` | VERIFIED | 3 tests; GREEN in 374 suite |
| `packages/design/tests/cls.spec.ts` | VERIFIED | AsyncBoundary block rewrote to `[data-async-boundary]`; 3 new tests + 5 unchanged blocks |
| `packages/design/tests/motion.spec.ts` | VERIFIED | Overlay enter-frame + toast gap + reduced-motion; 4 tests |
| `packages/design/tests/file-upload-preview.spec.ts` | VERIFIED | Single-preview + image-branch; 3 tests |
| `packages/design/tests/form-affordances.spec.ts` | VERIFIED | Required marker + helper aria-describedby + catalogued controls + disabled-forwarding |
| `packages/design/tests/overlay-form-interaction.spec.ts` | VERIFIED | Dialog/Select/Stepper interaction fixes; 4 tests |
| `packages/design/tests/form-layout-sweep.spec.ts` | VERIFIED | 360-floor wrappers + FileUpload list + Select cap + a11y sweep; 4 tests |
| `packages/design/src/styles/uikit.css` | VERIFIED | `.uikit-overlay-motion` + `.uikit-overlay-motion-fast` + `.uikit-overlay-backdrop-motion` + `.uikit-toast-motion` keyframe policy; `@media (prefers-reduced-motion: reduce)` opt-out |
| `packages/design/src/shared/uikit/Dialog/dialog.ts` | VERIFIED | Content `relative`; close `absolute right-3 top-3`; `uikit-overlay-motion` class |
| `packages/design/src/shared/uikit/Menu/menu.ts` | VERIFIED | `uikit-overlay-motion` class; no `duration-150` |
| `packages/design/src/shared/uikit/Popover/popover.ts` | VERIFIED | `uikit-overlay-motion` class; no `duration-150` |
| `packages/design/src/shared/uikit/Tooltip/tooltip.ts` | VERIFIED | `uikit-overlay-motion uikit-overlay-motion-fast`; contract test updated in `tooltip.test.ts` |
| `packages/design/src/shared/uikit/Toast/Toast.tsx` | VERIFIED | `live?: boolean` prop; `uikit-toast-motion` applied via Ark Toast.Root composition |
| `packages/design/src/shared/uikit/ToastManager/ToastManager.tsx` | VERIFIED | `overlap:false`; `Toast.Root` wraps leaf; empty-title guard; `live={false}` on composed leaf |
| `packages/design/src/shared/uikit/Button/control.ts` | VERIFIED | `size: "icon"` (`min-w-11`, no horizontal padding, centered) |
| `packages/design/src/shared/uikit/FileUpload/FileUpload.tsx` | VERIFIED | Single `ItemPreview` branched on `file.type.startsWith("image/")`; `Button` icon row controls; `renderItemStatus` optional slot reserved |
| `packages/design/src/shared/uikit/FileUpload/fileUpload.ts` | VERIFIED | `itemDeleteTrigger` duplicate recipe removed; `itemStatus` slot remains (for renderItemStatus) |
| `packages/design/src/shared/uikit/Field/Field.tsx` | VERIFIED | `requiredText?: string` prop; `requiredMarker` slot with `*` glyph + `sr-only` |
| `packages/design/src/shared/uikit/Field/field.ts` | VERIFIED | `requiredMarker` recipe slot (`text-loss`, `text-[0.6rem]`) |
| `packages/design/src/shared/uikit/Select/Select.tsx` | VERIFIED | `emptyText`, `clearAria`, `clearable` props; Ark `ClearTrigger`; empty-state node |
| `packages/design/src/shared/uikit/Select/select.ts` | VERIFIED | `control`, `empty`, `clearTrigger` slots; `max-w-80` on content; `min-w-(--reference-width)` preserved |
| `packages/design/src/shared/uikit/Stepper/Stepper.stories.tsx` | VERIFIED | `StepperPlayground` with `useState(value)` + `onValueChange={setCurrent}` |
| `packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.tsx` | VERIFIED | `loadingText?: string` prop; `<span className="sr-only" role="status">` in loading branch |
| `packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.stories.tsx` | VERIFIED | `readyContent` uses real KIT-02 `Table`; `h-64` cage removed from content-region cells |
| `packages/design/src/shared/uikit/Tabs/Tabs.tsx` | VERIFIED | Ark `Indicator` slot removed (dead; per-trigger underline is the structural marker) |
| `packages/design/src/shared/uikit/_fixtures/strings.ts` | VERIFIED | `selectEmpty`, `selectClear` (03-13); `uploadSyncPending`/`uploadSyncing`/`uploadSyncComplete`/`uploadSyncWaiting` reserved unconsumed (GAP-17) |
| `packages/design/playwright.config.ts` | VERIFIED | `LADLE_E2E_PORT` env-overridable (03-09 port-collision fix) |
| `.planning/phases/03-uikit-interactive-i18n-global-state-patterns/03-UI-SPEC.md` | VERIFIED | SURF-18 CLS claim re-scoped: content-region states vs banner block role (03-09) |
| `DESIGN.md` | VERIFIED | GAP-14 caption-color decision recorded; drift gate green |

---

## Key Link Verification — Gap-Closure Additions

| From | To | Via | Status |
|------|----|-----|--------|
| `components.tsx readLocaleFromUrl()` | `i18n.activate(locale)` | `toLocale` guard → keyed `useEffect` | WIRED |
| `uikit.css .uikit-overlay-motion` | Dialog/Menu/Popover/Tooltip recipes | Single class on each recipe's content slot | WIRED |
| `uikit.css .uikit-toast-motion` | `Toast.tsx` leaf (via `Toast.Root` in ToastManager) | Ark `Toast.Root` applies stacking vars; leaf consumes `translateY(var(--y))` | WIRED |
| `control.ts size="icon"` | `FileUpload.tsx` retry + delete controls | `Button variant="ghost" size="icon"` + `asChild` on `ItemDeleteTrigger` | WIRED |
| `Field.tsx required+requiredText` | `field.ts requiredMarker` slot | Conditional `{required ? <span className={styles.requiredMarker()}>…` | WIRED |
| `Select.tsx emptyText` | `select.ts empty` slot | `{options.length === 0 && emptyText && <div role="presentation" className={styles.empty()}>…}` | WIRED |
| `Select.tsx clearable+clearAria` | Ark `ClearTrigger` | `{clearable ? <ArkSelect.ClearTrigger … aria-label={clearAria}>…` | WIRED |
| `strings.ts uploadSyncPending` (FU7 vocab) | (RESERVED — unconsumed) | `renderItemStatus?: (file: File) => ReactNode` optional prop in FileUpload.tsx | RESERVED — correctly not wired in v0.1 |

---

## Requirements Coverage

| Requirement | Source Plans | Status | Notes |
|-------------|-------------|--------|-------|
| KIT-05 — Form family | 03-01..03-04, 03-10, 03-12, 03-13, 03-14 | SATISFIED | GAP-05/06/07/09/10/11/12/13 closed; all 5 form components export correctly; form-affordances + overlay-form-interaction + form-layout-sweep + file-upload-preview guard it |
| KIT-06 — Overlay family | 03-05..03-06, 03-11, 03-13, 03-14 | SATISFIED | GAP-02/08 closed; all 5 overlay components export; motion policy + overlay-form-interaction guard it |
| KIT-07 — Feedback primitives | Phase 2 (complete); 03-12 (icon Button) | SATISFIED | Phase 2 delivered KIT-07; 03-12 added icon-only Button size composing into the shared control recipe |
| KIT-08 — Typed i18n harness + switcher | 03-07, 03-08 | SATISFIED | GAP-01 closed; SC#2 now runtime-proven; i18n-toggle.spec.ts + typed-key oracle guard it |
| SURF-18 — AsyncBoundary + ToastManager | 03-07, 03-09, 03-11, 03-14 | SATISFIED | GAP-03/04/16 closed; cls.spec (real oracle) + motion.spec + form-layout-sweep guard it |
| QUAL-01 — Scenario endings ×5 | All phases (gate) | SATISFIED | AsyncBoundary 6-state switch; ToastManager stacking + enter/exit; motion.spec GREEN |
| QUAL-02 — Responsiveness / 360 floor | All phases (gate) | SATISFIED | GAP-12/15 closed; form-layout-sweep asserts 360-floor wrapper bounds |
| QUAL-03 — WCAG 2.2 AA (axe, 44px, never-color-alone) | All phases (gate) | SATISFIED | GAP-06/07/16 closed; form-affordances required-marker (non-color-alone); catalog.spec axe + 44px gate 374/374 green |
| QUAL-04 — CLS = 0 | All phases (gate) | SATISFIED | GAP-03 false-green fixed (real cls oracle); toast stacking via transform only; cls.spec GREEN |
| QUAL-05 — RU + EN i18n | All phases (gate) | SATISFIED | GAP-01 closed (EN now reachable); i18n-toggle.spec asserts bilingual re-render |

---

## Anti-Patterns Scan (gap-closure files)

Files modified by the gap-closure batch were scanned.

| Pattern | Finding | Severity |
|---------|---------|----------|
| `TBD/FIXME/XXX` | None found in any gap-closure file | Clean |
| Unreferenced `TODO` | `Tooltip/tooltip.ts` had a "Remove once Lingui adds the types export condition" comment — references a known upstream condition (not an audit hole) | Informational |
| `return null` / empty | `ToastManager.tsx:95` `if (text === "") return null` — this IS the GAP-16 guard, not a stub | Intentional guard |
| Hardcoded empty data | GAP-17 `renderItemStatus === undefined ? null` — correctly gated on the optional prop | Correct reserve pattern |
| `console.log` | None found in production code | Clean |
| Debt markers in modified files | None unreferenced | Clean |

---

## Human Verification Required

None — all 17 visual gaps are now regression-locked by Playwright behavioral tests that:
- FAIL on pre-fix code (TDD discipline confirmed per commit evidence)
- Assert RUNTIME behavior (computed opacity/transform, measured geometries, rendered text, DOM counts) — not just source-code presence

The one type of verification that remains inherently human (visual aesthetics) is accepted as out of scope given the project's MVP mode and the fact that every observable functional defect found in the UAT pass has been addressed and locked.

---

## Summary

Phase 03 originally delivered all 9 observable success criteria. A visual UAT pass found 17 gaps (GAP-01..GAP-17). Eight gap-closure plans (03-08..03-15) addressed every gap:

- **5 blockers/majors closed with code + regression tests:** GAP-01 (i18n toggle), GAP-02 (overlay motion), GAP-03 (CLS false-green), GAP-04 (toast stacking), GAP-05 (double preview), GAP-06/07 (form control affordances), GAP-08/09/10/11 (overlay + form interaction)
- **5 minors closed with code + regression tests:** GAP-12 (story 360 wrappers), GAP-13 (FileUpload bounded list), GAP-15 (Select max-w cap), GAP-16 (a11y/dead-code sweep)
- **1 minor closed as design decision:** GAP-14 (caption color — shared text-muted intentional, recorded in DESIGN.md)
- **1 low correctly handled as RESERVE:** GAP-17 (FU7 vocab + itemStatus slot reserved for v1.0 — NOT built; verified no lightbox/sync wiring exists)

All automated gates pass: `pnpm check` 0 errors, Vitest 192 passed, Playwright 374 passed (grew from 344 → 374 as 7 new regression specs were added). Working tree is clean with 49 commits ahead of origin.

All 9 original requirements (KIT-05, KIT-06, KIT-08, SURF-18, QUAL-01..05) satisfied. No gaps remain.

---

_Verified: 2026-06-25T08:41:41Z (initial SC#1-SC#9); 2026-06-25T14:29:05Z (SC#4 closure); 2026-06-26T08:00:00Z (GAP-01..17 gap-closure re-verification)_
_Verifier: Claude (gsd-verifier)_
