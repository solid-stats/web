# Players List Iterations

## Wireframe v1 — Mobile Structure

- Scope: one RU 390 by 844 populated screen; four player rows.
- Requirements: Overview row reuse, four-week dynamics on narrow screens,
  supporting games/kills/deaths/K-D, and Score as the ranking metric.
- Baseline: Players page was empty. Overview and shared masters are read-only.
- Review contract: assess the whole bounded wireframe for content order,
  mobile density, long-name fit, correct K/D, four visible weekly bars per row,
  component linkage, bounds, collision, and persisted state.
- Later prototype passes: other widths/locales and absent/loading/error data.
- Artifact: App Design `5954a801-37cf-8094-8008-81f63a8ba3d3`, Players page
  `8a03bbe6-579f-808e-8008-81f69a4eb7b7`, board
  `dcf4be56-82af-804f-8008-d2bc116a0a16` (`WF v1 / Players / RU / 390`).
- Snapshot: persisted file revision 438, modified 2026-10-21T10:00:23.132993Z.
  Render SHA-256:
  `edcd9b2c73a3133edb42cd2f0d2b96c2e87adab6a9f615a09779087aa0360b8c`.
  Geometry SHA-256:
  `52f995f53489562164758ea2b3eba50361775d5f513e0db16a51aaeb4ea391e5`.
- Deterministic checks: one 390 by 844 board, four 342 by 88 row wrappers,
  sixteen visible weekly bars, no visible node outside the board, correct
  fixture K/D, descending Score. Existing components remain connected;
  mutations target new instances only. No shared master or Overview edits.
- Review depth: bounded local pass. Independent omission maps obtained before
  sharing the lead's ledger. Whole-result reviews completed by
  `players_wireframe_contract_review` and `players_wireframe_visual_review`,
  each requested GPT-6.1 Sol / high with fresh context. Both approve this
  bounded sketch with no Blocker or Important findings.
- Coverage ledger: intent/content, composition, source fidelity, fixture cases,
  current-width fit, static controls, component linkage, persistence, and
  evidence integrity assigned to both reviewers. Broader responsive/state
  coverage remains a later wireframe pass. Public delivery and actual runtime
  behavior are not applicable to this static structural proposal.
- Finding `r1.A1` (duplicate `r1.B1`), optional Polish: Ghost_9's no-squad label
  retains the underline used by squad links, implying a squad destination.
  Locator: `Secondary link`, `dcf4be56-82af-804f-8008-d2bc1c7090aa`, x84/y594.
  Independently confirmed from the render, source reference and mutation scripts
  by `players_wireframe_affordance`, requested GPT-6 Luna / medium, fresh context.
  Smallest refinement: plain muted absence text. No mandatory rule makes this
  blocking; no optional refinement applied pending user choice.
- Evidence boundary: preservation is supported by the instance-only mutation
  scripts and component IDs, without an independent pre/post master-tree diff.
- Gate: APPROVE for this first structural sketch. Both whole-result reviews,
  deterministic checks and candidate verification are complete. No material
  question remains within the bounded pass; no saturation wave is warranted.
- Decision: draft; awaiting user feedback on the structure. Review approval
  does not establish user acceptance or permission to start hi-fi.

## Wireframe v1.1 — Remove Unrequested Filters

- User correction, 2026-10-21: filters were never agreed; remove the button.
- Removed only the `Filters / placeholder` instance from the existing board.
  Other controls, content and geometry remain unchanged.
- Updated the brief to exclude filters and their future state variants.
- User explicitly waived independent reviews for each wireframe edit while
  the structure is being explored. No new review agents were dispatched.
- Verification: live board read-back confirms the filter instance is absent;
  fresh project-file metadata confirms App Design revision 439, modified
  2026-10-21T10:20:25.946173Z (previously 438). UIKit remains revision 137.
  The optional refreshed PNG export timed out; no new visual-review claim is
  made. The revision increment confirms the write flushed.
- Earlier `r1.A1` remains optional and untouched. The sketch remains a draft.
