---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 04
subsystem: ui
tags: [ark-ui, file-upload, dropzone, object-url, security, tailwind-variants, lingui, ladle, playwright, a11y, tsx]

# Dependency graph
requires:
  - phase: 03-02
    provides: "Field wrapper (label/error/required/disabled broadcast seam) + the shared Button + the StateMatrix/StateCell story helper"
  - phase: 03-01
    provides: "the runtime Lingui i18n harness + STRINGS→catalog migration"
provides:
  - "FileUpload — image-evidence + external-link upload over Ark FileUpload, nesting under Field: keyboard-accessible focusable dropzone, explicit Browse button (shared Button), per-file accepted (preview+name+remove/retry) and rejected (why+fix) rows"
  - "the client-side security surface: ACCEPT_DEFAULT allowlists PNG/JPEG/WebP and EXCLUDES SVG (stored-XSS gate), reject-reason mapping where wrong-type wins over size. Preview object URLs are created AND revoked by Ark's ItemPreviewImage itself (no blob leak; the slice owns no URL lifecycle)"
  - "RejectReason graduated so callers type the rejection-copy map by it"
affects: [03-05, 03-06, 03-07, KIT-05, forms, surfaces, request-flow]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "tv()-per-Ark-part recipe with className per part (never asChild) — extended from Field/Input/Select/Stepper to FileUpload"
    - "pure security logic split out of the component (ACCEPT_DEFAULT, mapRejectReason/firstRejectReason) so Vitest pins it node-env without a DOM mount (runner split — component DOM is Playwright's job)"
    - "preview object-URL lifecycle delegated entirely to Ark's ItemPreviewImage (create + revoke in its effect cleanup); the slice owns no URL ledger"

key-files:
  created:
    - "packages/design/src/shared/uikit/FileUpload/FileUpload.tsx — Ark FileUpload.Root/Dropzone/Trigger(Button)/ItemGroup/Context; accepted + rejected per-file rows; icon-only remove/retry with injected aria; Ark owns the preview object-URL lifecycle; i18n-free (plain string props)"
    - "packages/design/src/shared/uikit/FileUpload/fileUpload.ts — per-part tv() recipe + the pure security logic (ACCEPT_DEFAULT png/jpeg/webp SVG-excluded, mapRejectReason/firstRejectReason)"
    - "packages/design/src/shared/uikit/FileUpload/fileUpload.test.ts — the security contract (SVG exclusion, reject mapping incl. wrong-type-wins)"
    - "packages/design/src/shared/uikit/FileUpload/FileUpload.stories.tsx — StateMatrix (idle/dragover/accepted/rejected/oversize) + Playground under Field"
    - "packages/design/src/shared/uikit/FileUpload/index.ts — slice barrel (FileUpload + RejectReason graduate; recipe + logic stay internal)"
  modified:
    - "packages/design/src/index.ts — KIT-05 Wave-4 barrel region (FileUpload, RejectReason)"
    - "packages/design/tests/keyboard.spec.ts — FileUpload dropzone focus + Browse keyboard coverage"
    - "packages/design/src/shared/uikit/_fixtures/strings.ts — FileUpload copy (uploadDropzone RU-longest, uploadBrowse, uploadRejected/{max}, uploadOversize, uploadTooMany, uploadRemoveAria, uploadRetryAria — RU primary/EN parity)"

key-decisions:
  - "Client validation is defense-in-depth UX only — the authoritative gate is server-2 in v1.0 (documented in the barrel + recipe comments; this no-app phase has exactly one real client trust surface)"
  - "SVG is excluded from ACCEPT_DEFAULT as the stored-XSS gate (T-03-04-01); wrong-type rejection wins over size so the security reason is the one the user sees and fixes first (T-03-04-03)"
  - "object-URL lifecycle is owned ENTIRELY by Ark's ItemPreviewImage (create + revoke in its effect cleanup) — the slice keeps no tracker; the earlier pure createPreviewUrlTracker was dead code (the component never called it) and was removed (T-03-04-02)"
  - "FileUpload validation logic is pure and node-env unit-tested (no React mount) per the repo runner split; the dropzone DOM/keyboard coverage lives in Playwright keyboard.spec"

patterns-established:
  - "the security-relevant client logic of a primitive is extracted as pure functions so it is unit-pinned independently of the component DOM; lifecycle the headless lib already owns (Ark's preview object-URL create+revoke) is NOT re-tracked — a parallel ledger the component never drives is dead code, not a guard"
  - "icon-only Ark controls (remove/retry) take their accessible NAME as a resolved string prop the story injects — the primitive never invents copy"

requirements-completed: [KIT-05, QUAL-01, QUAL-02, QUAL-03, QUAL-05]

coverage:
  - id: D1
    description: "FileUpload — keyboard-accessible focusable dropzone (Enter/Space opens the picker) + explicit Browse button + per-file accepted/rejected rows, drag-over announced not color-only, nests under Field"
    requirement: "KIT-05"
    verification:
      - kind: e2e
        ref: "tests/keyboard.spec.ts#KIT-05 FileUpload dropzone focus + Browse"
        status: pass
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-05-form--fileupload--matrix axe clean (serious/critical) + 44px"
        status: pass
    human_judgment: false
  - id: D2
    description: "Client security validation — PNG/JPEG/WebP accept + SVG disallowed (XSS gate), reject-reason mapping (wrong-type wins over size). The object-URL leak guard is Ark-owned (ItemPreviewImage create+revoke), not a slice tracker"
    requirement: "KIT-05"
    verification:
      - kind: unit
        ref: "src/shared/uikit/FileUpload/fileUpload.test.ts — SVG exclusion, mapRejectReason/firstRejectReason (object-URL revoke is Ark-owned, covered by the Playwright pass)"
        status: pass
    human_judgment: false
  - id: D3
    description: "FileUpload Ladle stories — StateMatrix (idle/dragover/accepted/rejected/oversize) + Playground, bilingual under Field, RU-longest dropzone prompt at the 360 floor"
    requirement: "QUAL-01"
    verification:
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-05-form--fileupload--matrix|playground (axe + 44px + keyboard-reachable)"
        status: pass
    human_judgment: true
    rationale: "Visual correctness of the per-file accepted/rejected row treatment, the structural drag-over cue, and the RU-longest clip at 360 is a design-review judgment the axe/44px gate does not assert."

# Metrics
duration: ~25min (across one interrupted + one finalize pass)
completed: 2026-06-25
status: complete
---

# Phase 03 Plan 04: KIT-05 FileUpload Summary

**Image-evidence upload over Ark FileUpload — a keyboard-accessible focusable dropzone with an explicit Browse button, per-file accepted/rejected rows, and the one genuine client security surface of this no-app phase: SVG-excluded PNG/JPEG/WebP allowlist (stored-XSS gate) and reject-reason mapping (wrong-type wins). The preview object-URL lifecycle is owned by Ark's `ItemPreviewImage` (create + revoke in its effect), not the slice.**

## Performance

- **Duration:** ~25 min (a rate-limit interrupted the first run mid-Task-3; the implementation was complete and green, finalized in a wrap-up pass)
- **Completed:** 2026-06-25
- **Tasks:** 3
- **Files:** 5 created, 3 modified

## Accomplishments
- Built FileUpload over Ark FileUpload (Root/Dropzone/Trigger/ItemGroup/Context) nesting under Field — focusable dropzone, explicit Browse button (the shared Button), per-file accepted (preview + name + remove/retry) and rejected (why+fix) rows, icon-only controls with injected accessible names, no i18n inside the primitive (plain string props).
- Shipped the client-side security logic as pure functions: `ACCEPT_DEFAULT` (png/jpeg/webp, SVG excluded = XSS gate) and `mapRejectReason`/`firstRejectReason` (wrong-type wins over size, unknown codes fold to `other`). The preview object-URL lifecycle is delegated entirely to Ark's `ItemPreviewImage` (create + revoke in its effect cleanup) — no slice-level tracker.
- Pinned the security contract in Vitest (node env, no DOM): SVG exclusion and reject mapping incl. wrong-type-wins precedence. The DOM-level object-URL revoke is Ark's contract, covered by the Playwright pass.
- Shipped the FileUpload StateMatrix (idle/dragover/accepted/rejected/oversize) + Playground stories under Field, axe-clean + 44px in the catalog gate; added the dropzone focus/Browse keyboard coverage.
- Graduated FileUpload + RejectReason into the barrel — this completes the KIT-05 form family (Field, Input, Select, Stepper, FileUpload).

## Task Commits

1. **Task 1: FileUpload — keyboard dropzone + Browse + per-file state over Ark FileUpload** — `7ea8b2e` (feat)
2. **Task 2: FileUpload validation contract — SVG exclusion, reject mapping, object-URL revoke** — `4f715ed` (test)
3. **Task 3: FileUpload stories, barrel graduation, dropzone keyboard spec** — `3e061a7` (feat)

## Decisions Made
- **Client validation is defense-in-depth UX only.** The authoritative accept/size/scan gate is server-2 in v1.0; the client allowlist + size message are immediate user feedback, not a trust boundary (security.md). Documented in the recipe + barrel comments.
- **SVG is the XSS gate.** `ACCEPT_DEFAULT` excludes `image/svg+xml`; a wrong-type rejection wins over an oversize one so the security reason is the one the user sees and fixes first.
- **Object-URL lifecycle is Ark-owned.** Ark's `ItemPreviewImage` creates the preview blob URL in a `useEffect` and revokes it in that effect's cleanup (`createFileUrl` → `revokeObjectURL`), and never exposes the per-file URL to the slice — so there is nothing for the component to track. (The plan's `createPreviewUrlTracker` was wired but never called — dead code asserting nothing about the component; it and its isolated test were removed during code-review fixes.)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Toolchain] `tsc --noEmit` verify step is not available in this repo**
- **Found during:** all `<verify>` blocks
- **Issue:** the plan calls `tsc --noEmit`, but this repo has no `typescript`/`tsc` — the gate is Vite+ (`vp check`, fmt + lint, no type-check stage).
- **Fix:** used `pnpm exec vp check packages` + wrote types by construction; ran `pnpm --filter @solid-stats/design test` (unit) + `ladle:build` + the Playwright keyboard/catalog e2e.
- **Verification:** `vp check` green (139 files, 0 lint errors); 143 unit tests pass; `ladle:build` green (FileUpload.stories compiles).
- **Committed in:** n/a (process adjustment)

**2. [Rule 2 - Missing critical] New i18n keys for the FileUpload story copy**
- **Found during:** Task 3 (stories)
- **Issue:** the dropzone prompt, Browse label, the why+fix rejection sentence (`{max}` interpolation), the size/count reject reasons, and the icon-only remove/retry accessible names are required copy the catalog did not yet carry.
- **Fix:** added `uploadDropzone`/`uploadBrowse`/`uploadRejected`/`uploadOversize`/`uploadTooMany`/`uploadRemoveAria`/`uploadRetryAria` to STRINGS (single i18n source → both catalogs + typed-key union), RU primary / EN parity.
- **Verification:** `catalogs.test.ts` parity test passes.
- **Committed in:** `3e061a7` (Task 3 commit)

### Process note (orchestrator)
- The first executor pass was interrupted by a transient server-side rate-limit during Task 3, after Tasks 1–2 were already committed (`7ea8b2e`, `4f715ed`) and Task 3's code was authored and green on disk. The orchestrator verified the gates (`vp check`, vitest 143, `ladle:build` all green) and committed Task 3 (`3e061a7`) + this SUMMARY + tracking — no code was re-authored, only finalized.

---

**Total deviations:** 2 (1 Rule 3 toolchain, 1 Rule 2 missing critical) + 1 process note
**Impact on plan:** no scope creep — all changes stayed inside `files_modified`; the security contract matches the plan's threat model verbatim.

## Issues Encountered
- **Vitest runner split.** The plan's "mount → unmount → spy revokeObjectURL" can't run under the repo's node-env Vitest (no DOM/RTL). The original attempt pinned a pure `createPreviewUrlTracker` via an injected URL spy — but the component never called `tracker.create()` (Ark owns the real preview URL), so the tracker was dead code and the test proved nothing about the component. Code-review fix: removed the dead tracker, its test, and the false "object-URL revoke" guarantee; the DOM-level revoke is Ark's contract, covered by the Playwright keyboard.spec.

## Known Stubs
None — FileUpload is fully wired; story fixtures are author-controlled presentational data (v0.1 Ladle, no network/server-2). The accept/size client checks are deliberately defense-in-depth; the real gate is server-2 in v1.0.

## Next Phase Readiness
- KIT-05 form family is COMPLETE (Field, Input, Select, Stepper, FileUpload) and graduated into the barrel.
- The KIT-06 overlay keyboard scaffolds (Dialog/Menu/Tabs) stay RED by design — Waves 5–6 turn them GREEN.
- FileUpload is the request-flow evidence primitive Phases 8–9 compose.

## Self-Check: PASSED

---
*Phase: 03-uikit-interactive-i18n-global-state-patterns*
*Completed: 2026-06-25*
