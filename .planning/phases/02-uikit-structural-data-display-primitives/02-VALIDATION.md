---
phase: 2
slug: uikit-structural-data-display-primitives
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-20
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Derived from
> `02-RESEARCH.md` § Validation Architecture. Task IDs in the Per-Task map are assigned by
> the planner; rows here are the requirement→test contract those tasks must satisfy.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework (pure logic)** | Vitest 4.1.9 — `packages/design/vitest.config.ts` (Wave 0 installs) |
| **Framework (component / a11y)** | `@playwright/test` 1.61.0 + `@axe-core/playwright` 4.11.3 against the built Ladle catalog — `packages/design/playwright.config.ts` (Wave 0 installs) |
| **Catalog harness** | `@ladle/react` 5.1.1 — iterate `meta.json` + `?story=<key>&mode=preview` + `[data-storyloaded]` |
| **Quick run command** | `pnpm --filter @solid-stats/design test` (Vitest, watch off) |
| **Full suite command** | `ladle build` then `pnpm --filter @solid-stats/design exec playwright test` (+ Vitest) |
| **Estimated runtime** | ~15–40 s (Vitest seconds; Playwright matrix dominated by browser launch + catalog iteration) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --filter @solid-stats/design test` (Vitest fixtures/tiers) + `vp check` (lint / format / type) — fast.
- **After every plan wave:** `ladle build` then `playwright test` (axe + 44px + keyboard + CLS + responsive across the wave's new stories).
- **Before `/gsd-verify-work`:** full Vitest + full Playwright matrix green, plus `solidstats-frontend-react-design-review` PASS per family.
- **Max feedback latency:** ~40 s (full suite).

---

## Per-Task Verification Map

> Requirement→test contract from `02-RESEARCH.md`. The planner assigns the concrete Task IDs
> (`2-PP-TT`) and writes the matching `<acceptance_criteria>` / `<verify>` into each task; the
> executor fills Status during execution.

| Req / SC | Behavior | Test Type | Automated Command / Method | File (Wave 0) | Status |
|----------|----------|-----------|----------------------------|---------------|--------|
| QUAL-06 / SC#5 | Score/K-D formulas + tiers internally consistent; Vasiliy #1 everywhere; no generated player outranks a real leader | unit | Vitest: assert `score = (kills−TK)/(games+dftk)`, `kd = (kills−TK)/(deaths+dftk)`, roster head == 10 Overview players, Vasiliy index 0 | `src/shared/uikit/_fixtures/_fixtures.test.ts` | ⬜ pending |
| QUAL-06 / D-04 | Tier level population-derived from `SS_BASELINE[period]`, not hardcoded; `baseline` passed explicitly; no global mutation | unit | Vitest: known baseline → assert level + entry threshold (`≥2.4 ХОРОШО`) | `_fixtures/tiers.test.ts` | ⬜ pending |
| QUAL-03 / SC#4 | axe-clean (serious/critical) per primitive | component | iterate `meta.json`; `AxeBuilder.withTags(wcag2a,wcag2aa,wcag22aa).analyze()`; block serious/critical | `tests/a11y.spec.ts` | ⬜ pending |
| QUAL-03 / SC#4 | 44×44 targets on every interactive control | component | Playwright `boundingBox()` ≥ 44×44 on `a,button,[role=button],input` per story | `tests/a11y.spec.ts` | ⬜ pending |
| QUAL-03 / SC#4 | Keyboard-operable (Tab order, Enter/Space, arrows for Th/tabs); focus visible, not obscured | component | Playwright `keyboard.press` + `:focus-visible` assertion on interactive stories | `tests/keyboard.spec.ts` | ⬜ pending |
| QUAL-04 / SC#3 | CLS = 0 — skeleton matches final colgroup+header+row dims; banners/tiles reserve height | component | Playwright: loading story vs data story → assert equal `boundingBox` height | `tests/cls.spec.ts` | ⬜ pending |
| QUAL-01 / SC#1-3 | ×5 scenario endings + ×4 data-volume states present per list/table/field | component (presence) | Playwright asserts named `StateCell` cells exist per story state-matrix | `tests/states.spec.ts` (or folded) | ⬜ pending |
| QUAL-02 | Responsive, container-keyed, 360px floor; mobile no h-scroll, CompactRow drops cols | component | Playwright at 360px on Table/CompactRow/AppShell; assert `scrollWidth <= clientWidth` | `tests/responsive.spec.ts` | ⬜ pending |
| QUAL-05 | RU + EN present; RU sanity (no clip at 360px) | component + review | Playwright asserts RU and EN strings render; manual RU clip check at 360px | `responsive.spec.ts` + design-review | ⬜ pending |
| SC#1-3 | Each family passes design-review (`design.md lint`, axe, real-width screenshots, CLS) | review gate | `solidstats-frontend-react-design-review` per family | manual gate per family | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `packages/design/vitest.config.ts` — Vitest wiring (none exists today)
- [ ] `packages/design/playwright.config.ts` — Playwright wiring + `webServer` ladle serve
- [ ] Install dev-deps: `@playwright/test`, `@axe-core/playwright`, `vitest`, `tailwind-variants`, `lucide-react` + `pnpm exec playwright install` browsers
- [ ] `src/shared/uikit/_fixtures/` — single fixture module (SS_BASELINE, canonical roster, Score/K-D formulas, RU+EN string map) + `_fixtures.test.ts`, `tiers.test.ts`
- [ ] `src/shared/uikit/_state-matrix/` — shared `StateMatrix` / `StateCell` story helper (the ×7 states + ×4 data-volume grid)
- [ ] `tests/` Playwright specs (a11y/44px, keyboard, cls, responsive) or one consolidated `catalog.spec.ts` iterating `meta.json`
- [ ] Confirm `.ladle/config.mjs` `addons.a11y.enabled = true` (dev aid, non-blocking)

*Phase 1 explicitly deferred Vitest/Playwright to "the first component phase" — that is this phase. All of the above is genuine Wave 0 setup, not pre-existing infrastructure.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Per-family design-review PASS (visual fidelity, real-width screenshots, token correctness) | SC#1-3, QUAL-01..05 | Visual judgment beyond axe/geometry automation | Run `solidstats-frontend-react-design-review` against each family's stories at the project breakpoints |
| RU "Данные устаревают" no-clip in narrowest pill at 360px | QUAL-05 | Visual clip check (checker rec #3) | Inspect the freshness pill RU state at 360px in the built catalog |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or a Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (test tooling + fixtures + state-matrix helper)
- [ ] No watch-mode flags in CI commands
- [ ] Feedback latency < 40 s
- [ ] `nyquist_compliant: true` set in frontmatter once Wave 0 lands

**Approval:** pending
