# Roadmap: Solid Stats web — next milestone intake

## Status

No active implementation milestone is open.

The previous `v0.1` Ladle design milestone was archived early on 2026-07-04 as a non-shipped,
superseded milestone:

- Archive summary: `.planning/milestones/v0.1-superseded-README.md`
- Roadmap snapshot: `.planning/milestones/v0.1-superseded-ROADMAP.md`
- Requirements snapshot: `.planning/milestones/v0.1-superseded-REQUIREMENTS.md`
- State snapshot: `.planning/milestones/v0.1-superseded-STATE.md`
- Phase artifacts: `.planning/milestones/v0.1-superseded-phases/`
- Blocking audit: `.planning/v0.1-MILESTONE-AUDIT.md`

`v0.1` was not completed, not shipped, and must not be tagged as a release.

## Next Milestone Direction

The repo is being rebuilt around a simpler two-stage UI workflow:

1. Create visual prototype slices in `.visual-prototypes/` using the global `design` workflow.
2. Promote accepted prototype summaries into implementation specs.
3. Implement the real TanStack Start app in the root `src/` tree.

The next GSD milestone should start after the new web brief and active implementation scope are
confirmed. It should not resume the archived package-based Ladle milestone.

## Active Phase List

No phases are active.

When the next milestone is created, continue phase numbering from the next meaningful milestone
plan instead of treating the archived v0.1 phases as active work.

## Backlog Notes

- Keep `DESIGN.md` as the design-token source of truth.
- Keep `src/styles/theme.css` generated from `scripts/gen-theme.mjs`.
- Use `.legacy/ladle-design/` only as a read-only reference for future UIKIT extraction.
- Do not port `.design/hifi/*` or `.legacy/ladle-design/*` directly into production routes.
