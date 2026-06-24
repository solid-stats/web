# Phase 3: UIKIT — Interactive, i18n & Global-State Patterns - Discussion Log (Assumptions Mode)

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the analysis.

**Date:** 2026-06-24
**Phase:** 03-uikit-interactive-i18n-global-state-patterns
**Mode:** assumptions
**Areas analyzed:** Ark UI adoption, i18n harness (KIT-08), global-state patterns (SURF-18), Toast manager

## Assumptions Presented

### Ark UI Adoption (KIT-05 / KIT-06)
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Add `@ark-ui/react`; wrap each headless primitive in a thin `tv()`-styled `shared/uikit` slice (props-down, no business/i18n imports). Inventory: Input/Select/Stepper/FileUpload/Field + Dialog/Menu/Tabs/Tooltip/Popover. Interactive state shown two ways — static `StateMatrix` grid (axe/44px gate) + interactive Ladle `Playground`; Playwright keyboard specs extended (no-trap Tab, Esc-close, aria-expanded, live-region). | Likely | `package.json` (Ark not yet installed); PROJECT.md L108-109; conventions `architecture.md`; `Button`/`Toast` `tv()` precedent; `_state-matrix/StateMatrix.tsx` |

### i18n Harness (KIT-08)
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Typed ICU catalog (refactor `_fixtures/strings.ts` STRINGS) + Ladle-global language switch + React context; NOT a routing i18n library (no `/ru` `/en` in v0.1); ICU plurals exercised now; graduates to v1.0. Library left open. | Likely | `localization.md` (typed keys/ICU/parity, library open); `_fixtures/strings.ts` typed seed; 01-CONTEXT D-12; 02-CONTEXT D-07 |

### Global-State Patterns (SURF-18)
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Compose existing primitives (Skeleton/EmptyState/ErrorState/DataTrustBanner) into the six states via recipes, plus at most one thin `AsyncBoundary` wrapper; do not rebuild primitives. | Unclear | `DataTrustBanner.tsx` `reserved`/`BannerKind`; `Skeleton`/`EmptyState`/`ErrorState` reservation + roles; REQUIREMENTS.md L66 ("reusable PATTERNS"); architecture.md DRY |

### Toast Manager
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Build trigger/portal/queue on Ark UI `createToaster`, wrapping the existing `Toast/Toast.tsx` visual leaf; interactive Ladle Playground (portal to `document.body`). | Likely | `Toast/Toast.tsx` "VISUAL primitive ONLY" header; 02-CONTEXT Deferred Ideas; a11y.md "prefer the Ark UI primitive" |

## Corrections Made

### i18n Harness (KIT-08) — library choice
- **Original assumption:** Library left open; analyzer leaned toward a lightweight `intl-messageformat` + typed map.
- **User decision:** **Lingui** (chosen over `intl-messageformat`+typed-map and `typesafe-i18n`).
- **Reason:** Full ICU + compile-time typing + clean TanStack Start graduation; "batteries included" by v1.0. Adopted in framework-agnostic core mode for v0.1.

### Global-State Patterns (SURF-18) — shape (resolved the Unclear item)
- **Original assumption:** Unclear whether recipes-only, recipes + one wrapper, or dedicated components.
- **User decision:** **Recipes + one `AsyncBoundary` wrapper** (the recommended option).
- **Reason:** Gives Phases 4–9 a single state→primitive seam without duplicating the reviewed Phase-2 primitives.

### Ark UI adoption + Toast + slice inventory
- Accepted as locked decisions without change.

## External Research

Not run in this session. Three execution-mechanics items forwarded to `gsd-phase-researcher` (see
CONTEXT.md `<specifics>`): Ark UI version/API surface, Lingui × Ladle no-app integration, and the
Ladle 5.1.1 global-control / forced-open-state mechanism.
