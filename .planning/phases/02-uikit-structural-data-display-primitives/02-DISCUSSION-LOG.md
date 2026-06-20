# Phase 2: UIKIT — Structural & Data-Display Primitives - Discussion Log (Assumptions Mode)

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the analysis.

**Date:** 2026-06-20
**Phase:** 02-uikit-structural-data-display-primitives
**Mode:** assumptions
**Calibration:** minimal_decisive (global Developer Profile: Vendor Choices = opinionated)
**Areas analyzed:** Component scope/granularity & slice inventory; Sparkline/microchart; Fixtures & Phase-2 i18n

## Assumptions Presented

### Component scope, granularity & slice inventory (KIT-01..04, KIT-07)
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Presentational-only primitives — no `@tanstack/react-table` / `react-virtual` this milestone; table is markup + tokens + fixture rows proving the virtualization-ready model | Confident | REQUIREMENTS.md L5 / L91 (design-only); `.design/hifi/players.jsx` L11, L170-213 (dep-free row model); no such dep installed |
| Slice inventory mapped to KIT-01..04, KIT-07 at `packages/design/src/shared/uikit/<Component>/`, exported via `src/index.ts` | Likely | DESIGN.md recipes L295-439 (1:1 with components); `architecture.md` L47-53 (one PascalCase slice); Smoke-story precedent |

### Sparkline / microchart approach (KIT-03)
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Custom token-driven `Sparkline` (DOM bars / inline SVG, `var(--color-*)`), no charting dep; `aria-hidden` + adjacent label | Confident | PROJECT.md L98 ("microcharts only"); `.design/hifi/players.jsx` L28-40, `player.jsx` L234-266 (dep-free bars); no recharts/visx/d3 in workspace; CLS = 0 |

### Mock-data fixtures & Phase-2 i18n strings (QUAL-06, QUAL-05)
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| One shared fixtures module (`shared/uikit/_fixtures/`): `SS_BASELINE`, Score/K-D formulas, single canonical roster (Vasiliy #1) | Likely | QUAL-06 + ROADMAP SC#5; `.design/CLAUDE.md` L94-95 (formulas), L169-174 ("Vasiliy #1") |
| Hardcoded bilingual RU+EN placeholder string map (not a real i18n harness) | Likely | 01-CONTEXT D-12 (i18n deferred to Phase 3); REQUIREMENTS L120 (KIT-08 = Phase 3); QUAL-05 still needs RU+EN now |

## Interaction Trail

1. **Routing (before discuss):** user chose the full design pipeline (discuss → ui-phase → plan)
   over UI-SPEC-only or skip.
2. **Confirm gate #1:** user answered free-text "4 раскрой подробнее" — requested a detailed
   expansion rather than confirm/correct.
3. **Detailed expansion delivered:** full per-component inventory (KIT-01..04, KIT-07), the
   "table without engine" concretely (what is built vs. deferred to v1.0), the sparkline/fixtures/
   i18n mechanics, and the two research items expanded as an explicit block 4.
4. **Confirm gate #2:** user answered "Да, фиксируем" — all assumptions accepted as-is.

## Corrections Made

No corrections — all assumptions confirmed after the detailed expansion. The user requested more
detail (not a change) and then accepted the full set.

## External Research

Not performed in discuss-phase. Two topics were flagged by the analyzer and **forwarded to
`gsd-phase-researcher`** (they resolve execution mechanics, not locked decisions; that agent has the
proper web/Context7 tooling and runs next in plan-phase):

- Ladle 5.1 × Tailwind v4 per-story state ergonomics (how to show component + data-volume states).
- axe / keyboard / 44px verification harness inside Ladle (built-in axe addon vs. Playwright-against-Ladle).
