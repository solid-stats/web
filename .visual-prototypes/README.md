# `.visual-prototypes/` — Superseded Visual Prototype Workspace

> **Superseded 2026-08-01.** This in-repo prototype workflow is no longer active. Design now happens
> directly in the live Claude Design project ("Solid Stats — Design System"), pulled locally via
> `DesignSync` once accepted — see `.planning/PROJECT.md`. Nothing was ever built in this directory
> under the workflow below; it is kept only as a record of the prior (2026-07-04) design-workflow
> rebuild. Do not start new prototype slices here. The `packages/design` paths mentioned below are
> also stale — the repo is a single-package app now (`src/`), from when this doc was written.

This directory was the prototype workspace for SolidStats web. It was the local override for
the global `design` skill's visual prototype workflow.

Use it before implementing a new page/surface, app flow, or major layout recomposition in
`packages/design`. The global `design` skill owns two separate UI stages:

1. prototype stage;
2. implementation stage.

GSD does not participate in prototyping. GSD may start after the relevant prototype scope is accepted
as `SUMMARY.md` and development of the real app begins.

Use the global standard structure for each slice:

```text
<slice-id>/
  BRIEF.md
  ITERATIONS.md
  SUMMARY.md
  screenshots/
  fixtures/        # optional
  src/ or index.html # optional
```

The prototype does not have to cover the whole app in one pass. Split it into slices by page, flow,
role, breakpoint family, or hard layout problem. Implementation for a slice starts only after that
slice has an accepted `SUMMARY.md`.

## What Belongs Here

- Static HTML/CSS/JS or lightweight JSX-on-a-page prototypes.
- A short non-GSD design brief for the current prototype slice.
- Fixture data shaped enough to make layout and data density honest.
- Iteration notes for accepted and rejected directions.
- Screenshots or screenshot references used for the human checkpoint.
- `SUMMARY.md` for each accepted slice.

## What Does Not Belong Here

- Production components or exports.
- GSD phase artifacts.
- Imports from `packages/design`.
- Ark behavior, keyboard behavior, accessibility gates, exact Tailwind merge checks, CLS tooling,
  SEO, or tests.
- Code that is ported directly into `packages/design`.

## Inputs

Use these as visual references, not runtime dependencies:

- root `DESIGN.md`;
- generated `packages/design/src/styles/theme.css`;
- the existing Ladle UIKIT in `packages/design/src/shared/uikit`;
- `.design/CLAUDE.md` for running domain/design rules;
- legacy `.design/hifi` only as historical visual reference.

Global checklist intake applies here: use relevant `checklist.design` page/component/flow/topic
checklists and the Selectel pre-handoff baseline, then add SolidStats-specific items for data trust,
roles, RU/EN copy, replay-derived numbers, and UIKIT adherence. After accepted `SUMMARY.md`, app
development starts from the global implementation surface spec plus the SolidStats overlay; production
review uses the global baseline plus the SolidStats overlay.

The existing `.design/` directory is a frozen Claude Design archive and is not the active
prototype workspace.

## Graduation

When a prototype slice is accepted, write `SUMMARY.md`:

- accepted composition;
- rejected alternatives;
- checklist coverage;
- required UIKIT/component changes;
- breakpoint behavior;
- state/data assumptions;
- screenshots used for approval.

Only that summary enters implementation. Prototype source stays disposable.
