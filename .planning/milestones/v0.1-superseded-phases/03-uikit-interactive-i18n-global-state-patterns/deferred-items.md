# Phase 03 — Deferred Items

Out-of-scope discoveries logged during execution (not fixed in the owning plan; carried forward).

## Discovered in Plan 03-05 (KIT-06 Dialog + Popover)

### DEF-03-05-01 — Pre-existing FileUpload keyboard-spec story-id mismatch (Plan 03-04) — ✅ RESOLVED 2026-06-25

- **Resolution:** Fixed during Phase-03 execution (orchestrator, between Wave 5 and Wave 6). Corrected the two story-id occurrences `kit-05-form--file-upload--playground` → `kit-05-form--fileupload--playground` (const + comment); the `[data-file-upload]` data-hook selectors were already correct and left untouched. The 3 `KIT-05 FileUpload keyboard dropzone` tests now pass (e2e: 308 passed, FileUpload absent from failures). Committed as `fix(03-04)`.
- **File:** `packages/design/tests/keyboard.spec.ts`
- **Symptom:** The three `KIT-05 FileUpload keyboard dropzone (Plan 03-04 GREEN)` tests fail
  with `waitForSelector` timeouts — the block references story id
  `kit-05-form--file-upload--playground`, but the Ladle id derived from the story title
  `"KIT-05 Form / FileUpload"` is `kit-05-form--fileupload--playground` (no hyphen in
  `fileupload`). `FILE_UPLOAD_STORY = "kit-05-form--file-upload--playground"` is committed in
  HEAD by Plan 03-04 — so these tests have been RED since 03-04 landed (the 03-04 SUMMARY's
  "GREEN" claim did not hold post-merge).
- **Why deferred:** Pre-existing failure in the KIT-05 FileUpload slice's spec block, unrelated
  to the KIT-06 Dialog/Popover changes this plan owns. Per the executor SCOPE BOUNDARY, only
  issues directly caused by the current task's changes are auto-fixed.
- **Fix (one-token):** change the three `file-upload` occurrences in the FileUpload `FILE_UPLOAD_STORY`
  const + its `waitForSelector` selectors (`[data-file-upload]` is the data-hook — that part is
  correct; only the STORY ID `kit-05-form--file-upload--playground` → `--fileupload--`) so the
  block targets the real story id. Verify with
  `pnpm --filter @solid-stats/design test:e2e -- keyboard.spec.ts -g "FileUpload"`.
- **Suggested owner:** a `/gsd-fast` quick-fix or the next plan that touches `keyboard.spec.ts`.
