---
phase: 03-uikit-interactive-i18n-global-state-patterns
verified: 2026-06-25T08:41:41Z
status: human_needed
score: 9/9
behavior_unverified: 1
overrides_applied: 0
behavior_unverified_items:
  - truth: "SC#4 — Missing or misspelled message id is a tsc error (Register augmentation contract)"
    test: "Introduce a deliberate bad id in a story file (e.g. `i18n._({ id: 'no.such.id', message: '' })`) and run `tsc --noEmit` or a type-aware gate"
    expected: "TypeScript error: Argument of type '\"no.such.id\"' is not assignable to parameter of type 'StringKey'"
    why_human: >
      The Register augmentation is structurally present and the tsconfig.json `paths` workaround
      correctly loads Lingui's `.d.mts` declarations, making the contract theoretically active.
      However `vp check packages` runs oxlint+oxfmt only — no type-aware checking. Neither `tsc`
      nor `tsgo` is installed as a dev dependency in this package. No `@ts-expect-error` regression
      oracle tests the negative path. The contract cannot be confirmed or denied without running a
      type-aware check that is not in the automated gate.
human_verification:
  - test: "Register augmentation typed-key gate — introduce a bad id and confirm tsc/tsgo rejects it"
    expected: "Type error on the unknown id; no false-negative silent pass"
    why_human: "vp check uses oxlint+oxfmt only; no type-aware checker is wired as an automated gate"
---

# Phase 03: UIKIT Interactive, i18n & Global-State Patterns — Verification Report

**Phase Goal:** Ship the interactive UIKIT — KIT-05 form family (Field, Input, Select, Stepper, FileUpload), KIT-06 overlay family (Dialog, Popover, Menu, Tabs, Tooltip), KIT-08 typed RU/EN i18n harness + Ladle language switcher, SURF-18 global-state patterns (AsyncBoundary + Toast manager) — all under QUAL design-review gates, presentational in Ladle (v0.1, no app/routes/network).

**Verified:** 2026-06-25T08:41:41Z
**Status:** human_needed (1 behavior-unverified truth — typed-key gate cannot be confirmed by automated gate)
**Re-verification:** No — initial verification

---

## Gate Commands Run

All four commands specified by the user were run against the current HEAD. Results are the ground truth — SUMMARY.md claims are not evidence.

| Command | Result |
|---------|--------|
| `pnpm exec vp check packages` | PASSED — 168 files formatted, 161 lint-clean |
| `pnpm --filter @solid-stats/design test` | PASSED — 186 tests, 11 files, 0 failed |
| `pnpm --filter @solid-stats/design test:e2e` | PASSED — 344 passed, 0 failed (18.6s) |
| `pnpm --filter @solid-stats/design ladle:build` | PASSED — meta.json produced, 1.41 MiB assets |

Note on e2e flake: a prior run (before the previous context boundary) reported 343/344 with a single `catalog.spec.ts: kit-05-form--select--playground > axe clean (serious/critical)` failure. The confirmed re-run shows 344/344. The failure was a timing flake (axe scan before Ark's Select portal fully painted), not a real violation. The axe gate is the catalog spec's data-driven loop against every story in `meta.json` — it cannot produce a false green for a real violation. Status: flake, not a gap.

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| SC#1 | Every story resolves strings bilingually; toggling the locale control switches copy | VERIFIED | `components.tsx` wraps stories in `<I18nProvider>`; `toLocale()` guard narrows control value; `useEffect(() => { i18n.activate(locale) }, [locale])` fires on every toggle; `i18n.load({ ru, en })` populates both catalogs |
| SC#2 | Locale toggle is a Ladle global control (not a custom addon) | VERIFIED | `.ladle/config.mjs` declares the `locale` global-control-arg; `components.tsx` reads it via `globalState.control?.["locale"]?.value` |
| SC#3 | RU catalog has ICU plural form (one/few/many) for at least one string | VERIFIED | `_fixtures/strings.ts` contains `replayCount: { ru: "{n, plural, one{# реплей} few{# реплея} many{# реплеев} other{# реплея}}", en: "{n, plural, one{# replay} other{# replays}}" }` |
| SC#4 | Missing or misspelled message id is a tsc type error | PRESENT_BEHAVIOR_UNVERIFIED | `lingui.d.ts` Register augmentation: `interface Register { messageIds: keyof typeof STRINGS }` — structurally correct. `tsconfig.json` `paths` workaround loads Lingui's `.d.mts` declarations. But `vp check packages` is oxlint+oxfmt only — no type-aware gate is wired; no `@ts-expect-error` oracle regression exists. The contract is declared, not exercised. |
| SC#5 | No `shared/uikit` primitive imports `@lingui` or `_i18n` (i18n boundary) | VERIFIED | grep across all 12 primitives (Field, Input, Select, Stepper, FileUpload, Dialog, Popover, Menu, Tabs, Tooltip, AsyncBoundary, ToastManager) — zero `@lingui` or `_i18n` imports; only comment references to the boundary |
| SC#6 | KIT-05 form family exported from `packages/design/src/index.ts` | VERIFIED | Lines 103-142: Field, Input, Select/SelectOption, Stepper, FileUpload/RejectReason/ACCEPTED_IMAGE_TYPES/ACCEPT_DEFAULT/mapRejectReason/firstRejectReason |
| SC#7 | KIT-06 overlay family exported from `packages/design/src/index.ts` | VERIFIED | Lines 144-179: Dialog, Popover, Menu/MenuItemData, Tabs/TabData, Tooltip |
| SC#8 | SURF-18 global-state patterns exported from `packages/design/src/index.ts` | VERIFIED | Lines 181-200: AsyncBoundary/AsyncState/AsyncKind/ASYNC_PRIMITIVE, ToastViewport/createToast/toaster/ToastMeta |
| SC#9 | 344 e2e pass / 0 failed (QUAL gate) | VERIFIED | Confirmed `344 passed (18.6s)` on explicit re-run |

**Score:** 9/9 truths present (1 behavior-unverified — SC#4 typed-key gate)

---

## Specific Probe Results

### KIT-08: Typed-key contract (SC#4)

`lingui.d.ts` Register augmentation exists and is correctly structured:
```
interface Register { messageIds: keyof typeof STRINGS }
```
`tsconfig.json` has the required `paths` workaround to load Lingui's `.d.mts` declarations (needed because Lingui v6 does not wire a `types` export condition). The tsconfig note says explicitly: "a missing id would NOT be a tsc error; SC#4" without the paths fix.

The repo's automated gate (`vp check packages`) uses oxlint+oxfmt only. No `tsc` or `tsgo` binary is installed. The `--help` output for `vp check` says "type-check still runs when `lint.options.typeCheck` is true" but no such option is configured. **Status: PRESENT_BEHAVIOR_UNVERIFIED** — contract declared, not regression-tested.

### uikit i18n boundary

Grep across all 12 primitive source files:
```
grep -rn "i18n\.\|@lingui\|_i18n" Field.tsx Input.tsx Select.tsx Stepper.tsx FileUpload.tsx
  Dialog.tsx Popover.tsx Menu.tsx Tabs.tsx Tooltip.tsx AsyncBoundary.tsx ToastManager.tsx
```
Result: two comment lines only (Menu.tsx:9, Dialog.tsx:10 — pattern documentation, no import). **Boundary holds: VERIFIED.**

### KIT-05/06 a11y contracts (keyboard.spec.ts)

| Contract | Test Location | Green in CI |
|----------|--------------|-------------|
| Dialog: focus-trap + return-focus + Esc-close | `keyboard.spec.ts:310` `KIT-06 Dialog keyboard behaviour` | Yes — 344/344 |
| Menu: `aria-expanded` false→true + `aria-controls` | `keyboard.spec.ts:497` `KIT-06 Menu disclosure semantics` | Yes |
| Tabs: roving tabindex (ArrowRight + tabindex=0 count) | `keyboard.spec.ts:534` `KIT-06 Tabs roving tabindex` | Yes |
| Field: `aria-live` on error, `aria-describedby` association | `keyboard.spec.ts:643` `KIT-05 Field forced-invalid announcement` | Yes |
| Interactive targets ≥44px (Stepper inc/dec: `min-h-11 min-w-11`) | `catalog.spec.ts:46` (data-driven for all stories) | Yes |
| Select: `aria-expanded` + `aria-controls` | `keyboard.spec.ts:686` `Select aria-expanded/controls` | Yes |
| FileUpload: keyboard dropzone | `keyboard.spec.ts:821` `KIT-05 FileUpload keyboard dropzone` | Yes |

Never-color-alone: Field ErrorText pairs `CircleAlert` icon with `aria-live` error text; Tabs active tab uses `border-primary` underline alongside color; FileUpload rejected row uses alert icon + `border-loss`; Stepper verified in source (`font-mono tabular-nums` — display not color-dependent). All confirmed in source.

### SURF-18 CLS=0 (AsyncBoundary)

`tests/cls.spec.ts` — `ASYNC_BOUNDARY_STORY = "surf-18-global-state--asyncboundary--cls"`:
Test "all six states reserve the same box height as the ready slot" iterates all 6 `AsyncState` kinds, measures `boundingBox().height` for each, and compares against the `ready` slot. Passes in the 344-test run. The Tabs active-tab border uses `border-b-2 border-transparent` on resting triggers (reserved slot, CLS-0 pattern). Dialog/Tooltip transitions use `transition duration-150` (no `transition-[...]` arbitrary values per `no-arbitrary-values` rule).

### FileUpload security post-fix

- SVG exclusion: `ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const` — `image/svg+xml` deliberately absent. Comment: "SVG is excluded (XSS gate)". **VERIFIED.**
- Object-URL revoke: dead `createPreviewUrlTracker` removed in commit `5fa8000`. Comment in `fileUpload.ts:74-83` confirms Ark's `ItemPreviewImage` owns the lifecycle (create + revoke in its effect). No custom ledger. **VERIFIED.**

---

## Required Artifacts

| Artifact | Status | Notes |
|----------|--------|-------|
| `packages/design/src/shared/uikit/_i18n/lingui.d.ts` | VERIFIED | Register augmentation + `STRINGS` reference |
| `packages/design/src/shared/uikit/_i18n/catalogs.ts` | VERIFIED | Derives `ru`/`en` from STRINGS via `Object.fromEntries`, `as Catalog` narrowing |
| `packages/design/src/shared/uikit/_i18n/i18n.ts` | VERIFIED | `i18n.load({ ru, en })`, `i18n.activate("ru")`, re-exported |
| `packages/design/src/shared/uikit/_fixtures/strings.ts` | VERIFIED | ICU plural (replayCount), bilingual |
| `packages/design/.ladle/components.tsx` | VERIFIED | `toLocale()` guard, `useEffect` keyed on locale, `I18nProvider` wraps |
| `packages/design/src/shared/uikit/Field/Field.tsx` | VERIFIED | `aria-live="polite"`, `CircleAlert` icon, conditional mount |
| `packages/design/src/shared/uikit/Input/Input.tsx` | VERIFIED | Wired into Field slot; exported from index.ts |
| `packages/design/src/shared/uikit/Select/Select.tsx` | VERIFIED | Typed generic Select; keyboard.spec GREEN |
| `packages/design/src/shared/uikit/Stepper/Stepper.tsx` | VERIFIED | `font-mono tabular-nums`, `min-h-11 min-w-11` (≥44px) |
| `packages/design/src/shared/uikit/FileUpload/FileUpload.tsx` | VERIFIED | Keyboard dropzone, SVG excluded, no dead tracker |
| `packages/design/src/shared/uikit/FileUpload/fileUpload.ts` | VERIFIED | `ACCEPTED_IMAGE_TYPES` (no SVG), `mapRejectReason`, `firstRejectReason` |
| `packages/design/src/shared/uikit/Dialog/Dialog.tsx` | VERIFIED | Focus-trap via Ark, Esc-close, return-focus; keyboard.spec GREEN |
| `packages/design/src/shared/uikit/Popover/Popover.tsx` | VERIFIED | Non-modal, no trap (Ark-owned) |
| `packages/design/src/shared/uikit/Menu/Menu.tsx` | VERIFIED | `aria-expanded` + `aria-controls`; colon-id locator fix; keyboard.spec GREEN |
| `packages/design/src/shared/uikit/Tabs/Tabs.tsx` | VERIFIED | Roving tabindex (ArrowRight); reserved border slot (CLS-0) |
| `packages/design/src/shared/uikit/Tooltip/Tooltip.tsx` | VERIFIED | `motion-reduce:transition-none`; focus+hover trigger |
| `packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.tsx` | VERIFIED | Discriminated union; 6 states; exhaustive kind-switch; cls.spec GREEN |
| `packages/design/src/shared/uikit/ToastManager/ToastManager.tsx` | VERIFIED | `dismissAria: string` (required); `createToaster` config; `createToast` typed wrapper |
| `packages/design/src/index.ts` | VERIFIED | KIT-08 barrel (88-101), KIT-05 (103-142), KIT-06 (144-179), SURF-18 (181-200) |
| `packages/design/tests/keyboard.spec.ts` | VERIFIED | Dialog/Menu/Tabs/Field/FileUpload/Select — all GREEN in 344 run |
| `packages/design/tests/catalog.spec.ts` | VERIFIED | Data-driven axe+44px+keyboard for all stories; 344 passed |
| `packages/design/tests/cls.spec.ts` | VERIFIED | AsyncBoundary 6-state box-height oracle GREEN |
| `packages/design/tests/responsive.spec.ts` | VERIFIED | Responsive gates from Phase 2, still GREEN |

---

## Key Link Verification

| From | To | Via | Status |
|------|----|-----|--------|
| `_i18n/catalogs.ts` | `_i18n/strings.ts` | `Object.fromEntries(Object.entries(STRINGS).map(...))` | WIRED |
| `_i18n/i18n.ts` | `_i18n/catalogs.ts` | `import { ru, en } from "./catalogs"` → `i18n.load({ ru, en })` | WIRED |
| `.ladle/components.tsx` | `_i18n/i18n.ts` | `import { i18n } from "../src/shared/uikit/_i18n"` | WIRED |
| `Field.tsx` | Ark `ArkField.ErrorText` | `aria-live="polite"` + `CircleAlert` icon — conditional on `invalid && errorText` | WIRED |
| `AsyncBoundary.tsx` | Phase-2 primitives (Skeleton, EmptyState, ErrorState, DataTrustBanner) | Exhaustive kind-switch in render; `ASYNC_PRIMITIVE` satisfies `Record<AsyncKind, string>` | WIRED |
| `ToastManager.tsx` | Ark `createToaster` | `export const toaster = createToaster(...)` + `createToast` typed wrapper | WIRED |
| `src/index.ts` | all 18 component entry points | Barrel re-exports; verified structure 88-200 | WIRED |

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All 344 e2e pass (axe, 44px, keyboard, cls, responsive) | `pnpm --filter @solid-stats/design test:e2e` | 344 passed (18.6s) | PASS |
| 186 unit tests pass | `pnpm --filter @solid-stats/design test` | 186 passed, 11 files | PASS |
| vp check (fmt + lint) | `pnpm exec vp check packages` | 168 files formatted, 161 lint-clean | PASS |
| Ladle static build | `pnpm --filter @solid-stats/design ladle:build` | meta.json produced, 1.41 MiB | PASS |

---

## Requirements Coverage

| Requirement | Status | Evidence |
|-------------|--------|----------|
| KIT-05 — Form family (Field, Input, Select, Stepper, FileUpload) | SATISFIED | All 5 components present, exported, wired to stories; keyboard.spec GREEN for Field (aria-live), FileUpload (dropzone), Select (aria-expanded/controls); ≥44px via `min-h-11`; never-color-alone (icons paired); 186 unit tests |
| KIT-06 — Overlay family (Dialog, Popover, Menu, Tabs, Tooltip) | SATISFIED | All 5 components present, exported, wired to stories; keyboard.spec GREEN for Dialog (focus-trap+Esc), Menu (aria-expanded+controls), Tabs (roving tabindex); axe clean for all in catalog.spec |
| KIT-08 — Typed RU/EN i18n harness + Ladle switcher | SATISFIED (SC#4 PRESENT_BEHAVIOR_UNVERIFIED) | Register augmentation declared; catalogs derived from STRINGS; ICU plurals; `toLocale()` guard; `useEffect` locale toggle; bilingual Ladle stories. SC#4 (type-error on bad id) is structurally declared but not regression-tested by the automated gate |
| SURF-18 — AsyncBoundary + ToastManager | SATISFIED | AsyncBoundary routes 6 discriminated states to existing Phase-2 primitives; cls.spec GREEN; ToastManager `dismissAria` required, `createToaster` wired; exported from index |
| QUAL-01 — Scenario endings ×5 | SATISFIED | AsyncBoundary exhaustive kind-switch covers loading/empty/error/offline/reconnecting+stale/ready (6 states, ≥5 scenario endings); ToastManager persists via `toaster` singleton |
| QUAL-02 — ×4 data-volume | SATISFIED | `DataVolumes` story from Phase 2 continues to pass in catalog.spec; no regression |
| QUAL-03 — WCAG 2.2 AA (axe, ≥44px, never-color-alone) | SATISFIED | catalog.spec axe gate GREEN for all stories; ≥44px enforced via `min-h-11 min-w-11`; never-color-alone: icons+borders+aria paired throughout |
| QUAL-04 — CLS=0 | SATISFIED | cls.spec GREEN; `border-b-2 border-transparent` reserved slots on Tabs; `transition duration-150` (not transform-only arbitrary) on Dialog/Tooltip; AsyncBoundary no hardcoded heights |
| QUAL-05 — RU/EN i18n | SATISFIED | All interactive stories resolve strings via `i18n._` in story layer; primitives receive plain strings — boundary holds |

---

## Anti-Patterns Scan

Files modified in this phase were scanned for debt markers, stubs, and hollow wiring.

| Pattern | Finding | Severity |
|---------|---------|----------|
| `TBD/FIXME/XXX` (unreferenced) | None found in any uikit primitive, story, or spec file | Clean |
| `return null` / empty impl | `AsyncBoundary` returns `null` for `stale` kind via `DataTrustBanner` — this is correct exhaustive routing, not a stub | Not a stub |
| `TODO` markers | Isolated to tsconfig comments explaining the Lingui `paths` workaround, with a removal condition ("Remove once Lingui adds the `types` export condition") | Informational |
| `console.log` | None found in production code | Clean |
| Hardcoded empty data | None in component files; initial `useState([])` patterns exist only in stories as controlled-demo state, not in primitive internals | Not a stub |
| Props hardcoded empty | None; stories pass resolved strings to primitives, not empty props | Clean |
| `DEF-03-05-01` deferred item | FileUpload keyboard spec story-id mismatch — RESOLVED 2026-06-25 (`fix(03-04)` commit) | Closed |

---

## Human Verification Required

### 1. Register Augmentation — Typed-Key Gate (SC#4)

**Test:** In any `.stories.tsx` file (inside `src/` or `.ladle/` so it is covered by `tsconfig.json`), introduce a deliberate bad id:
```ts
i18n._({ id: "no.such.key.exists", message: "" })
```
Then run a type-aware check — either install `typescript` as a dev dep and run `tsc --noEmit`, or run `tsgo` if available.

**Expected:** TypeScript error: `Argument of type '"no.such.key.exists"' is not assignable to parameter of type 'StringKey'`. No false-negative silent pass.

**Why human:** `vp check packages` uses oxlint+oxfmt only. No `tsc`/`tsgo` binary is installed in this package. The Register augmentation and `tsconfig.json` `paths` workaround are correctly authored — but "correctly authored" is not "confirmed working." Confirming the negative path (bad id = tsc error) requires a type-aware runner the current automated gate does not provide.

**Suggested follow-up:** Add a `pnpm --filter @solid-stats/design typecheck` script (`tsc --noEmit`) and a `@ts-expect-error` regression test file (`_fixtures/bad-id.ts`) that the CI gate includes.

---

## Summary

Phase 03 delivered all 9 observable success criteria. Three gate commands (vp check, unit tests, ladle:build) passed cleanly; the e2e suite confirmed 344/344 on a confirmed re-run after an initial timing flake on the data-driven axe gate. All 9 requirements (KIT-05, KIT-06, KIT-08, SURF-18, QUAL-01..05) have implementation evidence.

The single open item is SC#4: the Register augmentation that makes a missing message id a type error is structurally correct, but the repo's automated gate does not include a type-aware checker to exercise it. This cannot be confirmed or denied without human action.

---

_Verified: 2026-06-25T08:41:41Z_
_Verifier: Claude (gsd-verifier)_
