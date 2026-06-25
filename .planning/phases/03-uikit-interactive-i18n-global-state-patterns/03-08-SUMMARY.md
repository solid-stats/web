---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 08
subsystem: design-system / i18n
tags: [i18n, ladle, gap-closure, KIT-08, QUAL-05, GAP-01]
requires:
  - "KIT-08 runtime i18n instance (i18n.ts / catalogs.ts) — the read side"
  - "Ladle catalog harness (playwright.config.ts globalSetup → ladle build → preview)"
provides:
  - "A working persistent RU↔EN language toggle in Ladle (the ?locale= URL query param)"
  - "i18n-toggle.spec.ts — a Playwright-against-Ladle regression guarding GAP-01"
affects:
  - "Every catalogued Ladle story that resolves copy via i18n._() now re-renders bilingually"
tech-stack:
  added: []
  patterns:
    - "Persistent + global locale source via the URL query param (not a Ladle control addon)"
    - "Untrusted ?locale= value narrowed through the existing toLocale guard (RU fallback)"
key-files:
  created:
    - packages/design/tests/i18n-toggle.spec.ts
  modified:
    - packages/design/.ladle/components.tsx
    - packages/design/.ladle/config.mjs
decisions:
  - "Chose the ?locale= URL query param (Task 2 preferred option) over a custom Ladle toolbar/global addon: persistent (lives in the URL), global (independent of any story's args), trivially drivable from the test (&locale=en), and lowest-risk (no new addon file)."
metrics:
  duration: ~25m
  completed: 2026-06-25
status: complete
---

# Phase 3 Plan 08: GAP-01 — Ladle RU↔EN language toggle Summary

Wired a real persistent, global locale source (the `?locale=` URL query param) the Ladle
GlobalProvider reads on every story, replacing the dead `control.defaultState.locale`
declaration that Ladle 5.1.1 never injected into `globalState.control` — so EN is now
reachable from the UI and every `i18n._()`-resolving story re-renders bilingually (SC#2).

## What changed

- **`packages/design/tests/i18n-toggle.spec.ts` (new, RED→GREEN).** A Playwright-against-Ladle
  regression: RU-default on a no-source load, EN-flip via `&locale=en` on the `kit-06-overlay--tabs--matrix`
  story (asserting the real rendered `role="tab"` copy «Обзор»→"Overview", never the STRINGS object),
  and an EN drive proving the switch is global by routing through the no-args `smoke--tokens` story.
- **`packages/design/.ladle/components.tsx` (GREEN).** Added `readLocaleFromUrl()` — reads
  `new URLSearchParams(window.location.search).get("locale")`, SSR/no-window-safe (RU fallback),
  routed through the existing `toLocale` guard into the existing keyed `i18n.activate` effect.
  The `I18nProvider` wrap and the `fonts.css → tailwind.css` import-once order are untouched.
  The unused `globalState` provider arg was dropped (the source is now the URL, not `globalState.control`).
- **`packages/design/.ladle/config.mjs` (GREEN).** Removed the misleading `addons.control` block
  (it implied a working toggle that never injected the locale); documented the URL-param source in
  its place. `theme:{enabled:false}` and the `width` addon are untouched.

## Why the read side was already correct

`components.tsx` already narrowed the locale via `toLocale` (a real runtime guard, never an
unchecked `as`) and activated it in a keyed effect; `catalogs.ts` already derives RU+EN parity
catalogs from `STRINGS`. Nothing created the source the provider read — this plan created it.
The Lingui `I18nProvider` re-renders its children on `i18n.activate`, so each story's
`i18n._({ id })` re-resolves in the active locale.

## TDD Gate Compliance

- **RED** `4d348b3` — `test(03-08): add failing i18n RU↔EN toggle regression` (RU-default passes;
  EN-flip + no-args tests FAIL on the dead `control.defaultState` code, the documented GAP-01 bug).
- **GREEN** `1e18843` — `feat(03-08): wire ?locale= URL source for the Ladle i18n toggle`
  (the spec goes green; the toggle flips RU↔EN globally).
- REFACTOR: none needed.

## Verification

- `pnpm check` — green: design.md lint 0 errors, oxfmt pass, `vp check` (Oxlint + tsgo type-aware)
  found no warnings/lint/type errors in 164 files. No `any`, no unchecked `as`.
- `pnpm --filter @solid-stats/design test:e2e` — **347 passed, 0 failed**, including the new
  `i18n-toggle.spec.ts` (3/3 green).

## Deviations from Plan

- **[Plan premise corrected — story choice]** The plan named `kit-01-nav-shell--navbar--matrix` /
  `navOverview` as the bilingual probe. The NavBar stories render **hardcoded** `STRINGS.x.ru` / `.x.en`
  fixtures (the language is baked into the story, not resolved through the runtime `i18n._()`), so the
  locale toggle could never change NavBar copy. Switched the catalogued-story assertion to
  `kit-06-overlay--tabs--matrix`, which resolves `tabsLabelOverview` («Обзор»/"Overview") through
  `i18n._({ id })` — the only mechanism the toggle actually drives. This is the correct, observable
  proof of GAP-01; it does not change the plan's intent (assert real bilingual re-render on a real
  story + a no-args story).

## Operational note (not a code defect)

The e2e harness uses `reuseExistingServer: !isCI`. A stale Ladle `preview` server lingering on
port 61000 from a prior run will serve an **old `build/`**, masking a correct fix as a failure
(several catalog axe/i18n tests went RED against the stale bundle, then all passed once the stale
server was killed). When re-running locally, ensure no orphan `ladle preview` holds port 61000.

## Self-Check: PASSED

- `packages/design/tests/i18n-toggle.spec.ts` — FOUND
- `packages/design/.ladle/components.tsx` — FOUND (modified)
- `packages/design/.ladle/config.mjs` — FOUND (modified)
- Commit `4d348b3` (RED) — FOUND
- Commit `1e18843` (GREEN) — FOUND
