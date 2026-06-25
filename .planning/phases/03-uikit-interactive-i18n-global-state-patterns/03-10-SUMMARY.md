---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 10
subsystem: ui
tags: [file-upload, ark-ui, react, playwright, kit-05, gap-closure]

# Dependency graph
requires:
  - phase: 03-uikit-interactive-i18n-global-state-patterns
    provides: the KIT-05 FileUpload slice (Plan 03-04) with its Ark dropzone + accepted-row previews
provides:
  - FileUpload renders exactly one preview per accepted file (the <img> for an image, the icon fallback only for a non-image), closing GAP-05
  - a Playwright regression (tests/file-upload-preview.spec.ts) that fails on the pre-fix double-preview code
affects: [KIT-05, FileUpload, evidence-upload]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Branch a single Ark ItemPreview on file.type instead of stacking an image/* + .* catch-all pair (Ark filters by file.type.match(props.type); .* matches images too)."

key-files:
  created:
    - packages/design/tests/file-upload-preview.spec.ts
  modified:
    - packages/design/src/shared/uikit/FileUpload/FileUpload.tsx

key-decisions:
  - "Branch the accepted-row map on file.type.startsWith('image/') rather than relying on Ark's match(props.type) filter — Ark provides no negative filter, so the .* fallback can never be made image-exclusive."
  - "Keep the image branch on Ark's ItemPreviewImage so the object-URL create+revoke lifecycle stays owned by Ark (no hand-rolled URL ledger; threat T-03-10-01 untouched)."

patterns-established:
  - "Single-preview-per-file: a row renders exactly one Ark ItemPreview, selected in JSX by file.type, never two siblings differing only by the type filter."

requirements-completed: [KIT-05]

coverage:
  - id: D1
    description: "An accepted image file renders exactly one preview node (the <img>), never the <img> + the ImageUp fallback side by side."
    requirement: "KIT-05"
    verification:
      - kind: e2e
        ref: "packages/design/tests/file-upload-preview.spec.ts#an accepted image row renders exactly one preview node"
        status: pass
      - kind: e2e
        ref: "packages/design/tests/file-upload-preview.spec.ts#every accepted image row in the many cell renders exactly one preview"
        status: pass
    human_judgment: false
  - id: D2
    description: "The surviving preview is the image branch (the <img>), not the ImageUp placeholder — the fix kept the right branch."
    requirement: "KIT-05"
    verification:
      - kind: e2e
        ref: "packages/design/tests/file-upload-preview.spec.ts#the surviving preview is the image branch, not the fallback icon"
        status: pass
    human_judgment: false

# Metrics
duration: 22min
completed: 2026-06-25
status: complete
---

# Phase 03 Plan 10: FileUpload single-preview (GAP-05) Summary

**FileUpload now renders exactly one preview per accepted file — branched on `file.type` — instead of stacking the `<img>` and the `ImageUp` fallback for every image, guarded by a Playwright regression that fails on the pre-fix double-preview code.**

## Performance

- **Duration:** ~22 min
- **Tasks:** 2 (TDD: RED test + GREEN fix)
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments
- Root-caused GAP-05: the accepted-row map rendered two `ArkFileUpload.ItemPreview` siblings — `type="image/*"` (the `<img>`) and `type=".*"` (the `ImageUp` fallback). Ark's `ItemPreview` filters with `file.type.match(props.type ?? ".*")`, and `.*` is a catch-all that also matches an image, so BOTH rendered for any accepted image (verified directly in `@ark-ui/react` `file-upload-item-preview.js`).
- Fixed by branching the row map on `file.type.startsWith("image/")`: an image renders the `<img>` via `ItemPreviewImage` (Ark keeps its object-URL create+revoke lifecycle); a non-image renders the icon fallback alone — the two can never co-render.
- Added `tests/file-upload-preview.spec.ts` driving the `kit-05-form--fileupload--matrix` story: counts `[data-part="item-preview"]` nodes per accepted row (RED = 2 pre-fix, GREEN = 1) and asserts the surviving preview is the `<img>` (`[data-part="item-preview-image"]`).

## Task Commits

1. **Task 1: RED — failing single-preview regression** - `dba759d` (test)
2. **Task 2: GREEN — single ItemPreview branched on file.type** - `e8df979` (fix)

_TDD: the RED test asserted count 2 on the unfixed code; the GREEN commit flipped it to 1 and carried a test-timing hardening (auto-retrying `toHaveCount` for the async-hydrated `many` cell rows)._

## Files Created/Modified
- `packages/design/tests/file-upload-preview.spec.ts` - GAP-05 regression: exactly one preview per accepted image, and the survivor is the `<img>`.
- `packages/design/src/shared/uikit/FileUpload/FileUpload.tsx` - replaced the two-sibling ItemPreview shape with one preview branched on `file.type`.

## Decisions Made
- Branch on `file.type.startsWith("image/")` in JSX rather than tuning Ark's `match(props.type)` — Ark has no negative filter, so a `.*` fallback can never be made image-exclusive; an explicit ternary is the only way to guarantee one preview.
- Keep the image branch on `ItemPreviewImage` so Ark retains the blob-URL create+revoke lifecycle (no hand-rolled ledger; threat T-03-10-01 mitigation preserved — the SVG-exclusion allowlist is untouched, no new accept types, no package installs).

## Deviations from Plan

None — plan executed exactly as written. The GREEN commit also hardened the `many`-cell row gate to an auto-retrying `toHaveCount` (the controlled accepted rows hydrate asynchronously after `data-storyloaded`); this is a test-timing robustness change, not an assertion weakening — the count===1 contract is unchanged.

## Issues Encountered
- First post-fix full e2e run flaked: a batch of unrelated `responsive.spec.ts` (AppShell / MobileTabBar / CompactRow) tests failed once under preview-server contention while the catalog was warming. Two subsequent clean full-suite runs were green (`347 passed`, 0 failed), confirming the flake was server warm-up, not a regression from this change.
- The initial `many`-cell assertion used a synchronous `.count()` that raced Ark's async row hydration (sampled 0 rows). Fixed by switching to the auto-retrying `expect(rows).toHaveCount(3)` gate.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- GAP-05 closed; FileUpload accepted rows are single-preview and regression-guarded.
- No blockers introduced. `pnpm check` clean (0 errors); `pnpm --filter @solid-stats/design test:e2e` green (347 passed), including the new file-upload-preview spec and the KIT-05 FileUpload catalog axe/44px gates.

## Self-Check: PASSED

---
*Phase: 03-uikit-interactive-i18n-global-state-patterns*
*Completed: 2026-06-25*
