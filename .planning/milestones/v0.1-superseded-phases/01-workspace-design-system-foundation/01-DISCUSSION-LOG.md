# Phase 1: Workspace & Design-System Foundation - Discussion Log (Assumptions Mode)

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the analysis.

**Date:** 2026-06-20
**Phase:** 01-workspace-design-system-foundation
**Mode:** assumptions
**Calibration:** minimal_decisive (developer profile: opinionated vendors, terse, anti-scope-creep)
**Areas analyzed:** Workspace & Toolchain, Design Package & Ladle Catalog, Token Pipeline,
`.design/` Freeze Boundary

## Assumptions Presented

### Workspace & Toolchain
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Toolchain config at workspace root, packages thin; `gen-theme.mjs` + `design.md lint` as root scripts | Likely | `solidstats-shared-ts-standards` §A/§D; gen-theme.mjs L23-26 (`ROOT` anchor); REQUIREMENTS WS-05 ("across the workspace") |
| Lint/format/type-check = Vite+ `vp check` (Oxlint+Oxfmt+tsgo) | Confident (post-confirm) | `solidstats-frontend-react-conventions` (WS-05 points at it); `solidstats-shared-ts-standards` §C web override |
| `packages/app` = skeleton only, no routes/loaders/SSR | Confident | MIGRATION.md "Direction change"; ROADMAP Phase 1 #1; design `SKILL.md` pipeline stage 5 (graduate = v1.0) |

### Design Package & Ladle Catalog
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| `@solid-stats/design`; `exports` exposes `./theme.css` + UIKIT | Likely | REQUIREMENTS WS-02 |
| `theme.css` relocates to `packages/design/src/styles/theme.css` | Likely | REQUIREMENTS WS-03 |
| Stories at `packages/design/src/shared/uikit/<Component>/` (preserve `shared/`) | Likely | `pipeline.md` §3; MIGRATION.md D5 (corrected from first-pass `src/uikit/`) |
| Ladle inside `packages/design` (own `.ladle/config.mjs` + Vite + `@tailwindcss/vite`), no app/SSR; self-hosted fonts | Likely | `styling.md` L13-24; `pipeline.md` §"Ladle"; ROADMAP Phase 1 #4 |

### Token Pipeline (DESIGN.md → @theme)
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| `gen-theme.mjs` one-line `OUT_PATH` change; `DESIGN_PATH` unchanged | Likely | gen-theme.mjs L26, L329-330 (hardcoded old path) |
| `@theme` encodes colors/type/spacing/radii **+ breakpoints + containers + data-trust vocab** as first-class tokens; `design.md lint` gates | Confident | design `design-system.md` §"Responsive breakpoints"; gen-theme.mjs L291-315; ROADMAP Phase 1 #2-#3 |

### `.design/` Freeze Boundary
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Freeze `.design/` **except** `CLAUDE.md` + `MIGRATION.md`, which stay live/authoritative | Confident | design `SKILL.md` (companion-notes home); `pipeline.md` §5; MIGRATION.md step 5 |

## Corrections Made

### Toolchain identity (user)
- **Surfaced as:** a near-resolved fork — `solidstats-frontend-react-conventions` names Vite+
  `vp check`; the generic `solidstats-shared-ts-standards` names ESLint/Prettier/tsc but §C defers the
  web frontend to Vite+. WS-05 points at the conventions skill.
- **User decision:** confirmed **Vite+ `vp check`** ("Да, всё верно") over the ESLint/Prettier/tsc
  alternative.

### Story path (design-skill delta — Contradicted assumption)
- **Original assumption:** colocated stories at `packages/design/src/uikit/<Component>/` (first pass
  flattened the `shared/` segment, reasoning "the package IS the shared layer").
- **Correction:** `packages/design/src/shared/uikit/<Component>/` — `pipeline.md` §3 and MIGRATION.md
  D5 literally specify `src/shared/uikit/<Component>/`; the FSD `shared/` segment is preserved.
- **Reason:** the second analyzer pass (explicitly given the design-creation skill, which the first
  pass was not) found the literal skill text. Residual: Likely, planner reconciles vs `architecture.md`.

## External Research

No web/research agent was spawned (minimal_decisive + the dedicated `gsd-phase-researcher` covers it
in plan-phase). One additional **design-skill consultation** was run after the user flagged that the
first analyzer pass was not explicitly given `solidstats-frontend-react-design`:

- **Design-skill delta check** — Verdict: CHANGES FOUND. Contradicted the story path (above) and
  added three Phase-1 decisions the first pass omitted:
  - Breakpoints (`3xl: 120rem`, `4xl: 160rem`) + containers (`--container` 1760, `--container-prose`
    720) + the data-trust vocabulary are first-class `@theme` token recipes `design.md lint` gates.
  - `.design/CLAUDE.md` stays live/authoritative (domain truth + companion notes), not frozen.
  - `packages/app` skeleton must contain no routes/loaders/SSR — only workspace resolution +
    `@solid-stats/design` consumption.
  - Added canonical ref: `solidstats-frontend-react-design/references/spec-template.md`.

Two items left open for the planning researcher (recorded in CONTEXT.md `<specifics>`):
- `@google/design.md@0.3.0` lint as a root dev-dep + offline CI invocation.
- Ladle + Tailwind v4 (`@tailwindcss/vite`) exact wiring vs current docs.
