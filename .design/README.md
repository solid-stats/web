# `.design/` — frozen archive, not the active design source

**Active design work happens in Penpot `App Design`
(`5954a801-37cf-8094-8008-81f63a8ba3d3`).** Everything in this directory is a point-in-time export
or reference kept for history. See `.planning/PROJECT.md` for the current workflow and its decision
log. Treat all workflow instructions inside this archive as historical, not current.

## Canonical source of truth

- **Tokens**: repo-root [`/DESIGN.md`](../DESIGN.md), regenerated into `src/styles/theme.css` by
  [`scripts/gen-theme.mjs`](../scripts/gen-theme.mjs). `theme.css` is a pure build output, never
  hand-edited.
- **Design/prototyping**: Penpot `App Design`, with local documents under `.visual-prototypes/` and
  accepted summaries also filed in SolidStats MemPalace.
- **Implementation**: `src/` (single-package repo; no `packages/design` workspace). A Ladle
  component-isolation harness may return later but is not required — see `.legacy/ladle-design/`.

## What's in this archive

| Path | What it is |
| ------ | ------------ |
| `CLAUDE.md` | Historical per-surface notes from the retired workflow. Do not update it or treat it as current authority. |
| `MIGRATION.md` | Historical only — the reverted 2026-06-20 pnpm-workspace migration. See the banner at its top. |
| `_ds/` | Raw export from an **earlier, different** Claude Design project (UUID `b40cf4ce-...`, not the current live project `303268bd-...`). The one-time seed the original `DESIGN.md` was authored from. The live project has since grown a full `preview/` foundation layer (buttons, badges, inputs, spacing, type scale) that never existed here. |
| `hifi/`, `wireframes/` | Visual output from that earlier Claude Design round (Overview, Player Profile, Players, Squads). Fake-stack plain CSS on the `support.js` canvas harness — reference only, never portable code. |
| `app/` | An earlier, smaller Overview-only snapshot of the same files as `hifi/` (confirmed by diff: `hifi/ui.jsx` and `hifi/kit.css` are later, larger revisions of `app/`'s versions). Superseded by `hifi/`; kept only for history. |
| `uploads/legacy-fnx-site/` | Snapshots of the pre-Solid-Stats fan stats site Solid Stats replaces. Feature/data-parity reference, not design output. |
| `uploads/sketches/` | Pasted screenshots and hand-drawn sketches from design sessions. |
| `support.js` | The Claude Design canvas rendering harness for `hifi/`/`wireframes/`/`app/`. Fake stack, not part of the real app. |

The dead `--container: 1240` token survives only in this frozen archive — `/DESIGN.md` supersedes it
with the `--container` 1760 ceiling + `--container-prose` 720. Nothing live sources it.
