---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 09
subsystem: uikit
tags: [cls, async-boundary, surf-18, qual-04, gap-closure, false-green, e2e]
requires:
  - "AsyncBoundary (SURF-18) routing to Skeleton/EmptyState/ErrorState/DataTrustBanner (Plan 03-07)"
  - "KIT-02 Table + KIT-07 Skeleton shared tableViewportHeight geometry (Plans 03-06/03-07)"
provides:
  - "A real (non-false-green) AsyncBoundary CLS oracle measuring the routed [data-async-boundary] primitive"
  - "loading ≡ ready byte-for-byte CLS = 0 in the AsyncBoundary content region"
  - "A re-scoped SURF-18 spec: content-region equality set vs the banner block role"
  - "LADLE_E2E_PORT override for isolated e2e preview runs"
affects:
  - packages/design/tests/cls.spec.ts
  - packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.stories.tsx
  - packages/design/playwright.config.ts
  - .planning/phases/03-uikit-interactive-i18n-global-state-patterns/03-UI-SPEC.md
tech-stack:
  added: []
  patterns:
    - "Measure the ROUTED primitive, not an equalizing wrapper cage, in CLS box-equality oracles"
    - "Reuse the real KIT-02 Table geometry for the ready slot so loading ≡ ready (no hand-rolled twin)"
    - "Env-overridable e2e preview port to avoid reusing a stale ladle dev server"
key-files:
  created:
    - .planning/phases/03-uikit-interactive-i18n-global-state-patterns/03-09-SUMMARY.md
  modified:
    - packages/design/tests/cls.spec.ts
    - packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.stories.tsx
    - packages/design/playwright.config.ts
    - .planning/phases/03-uikit-interactive-i18n-global-state-patterns/03-UI-SPEC.md
decisions:
  - "empty/error are intentionally content-sized (EmptyState/ErrorState min-h-48), NOT padded to the table region — the CLS-equality measured set is loading ≡ ready"
  - "status banners (offline/reconnecting/stale) are a separate 40px block role, not height-compared to the content region (their CLS guarantee is the DataTrustBanner reserved invariant)"
  - "GAP-03 fixed at THREE levels: the test (false-green), the code/story (1px gap), and the spec (over-claim)"
metrics:
  duration: "~25m"
  completed: 2026-06-25
  tasks: 3
  files_changed: 4
status: complete
---

# Phase 3 Plan 9: Close GAP-03 — AsyncBoundary CLS false-green + 1px loading↔ready gap Summary

Made the AsyncBoundary CLS proof real: the oracle now measures the routed `[data-async-boundary]` primitive (not the `h-64` cage), `loading ≡ ready` is byte-for-byte CLS = 0 (the ready slot now renders the real KIT-02 `Table` instead of a hand-rolled twin), and the SURF-18 spec is re-scoped to a true contract (content-region equality set vs the banner block role) — all guarded by a test that fails on the pre-fix code.

## What shipped (per task)

- **Task 1 — RED (test):** Rewrote the `AsyncBoundary CLS = 0` block in `cls.spec.ts` to measure the routed `[data-async-boundary="<state>"]` primitive instead of the `[data-async-cell]` `h-64` cage. Three tests: (1) `loading ≡ ready` exact box-height+width equality (the swap the user sees); (2) every content-region state reserves a non-zero routed box; (3) banners assert their own family invariant, NOT compared to the content region. Dropped the equalizing `h-64` cage from the `Cls` story's content-region cells so real intrinsic heights are measured. Commit `a175199`.
- **Task 2 — GREEN (code/story):** Rewrote `readyContent()` to render the real KIT-02 `Table` (one `READY_COLUMNS` source feeds both the loading `Skeleton` column widths and the ready `Table` model; comfortable density; `visibleRows = ROWS`). Both reserve `tableViewportHeight(ROWS, 52)` inside the identical bordered card, so the framed-card hairline that caused the 1px gap is now identical on both sides. AsyncBoundary leaf routing unchanged. Commit `bb419d1`.
- **Task 3 — spec re-scope:** Replaced the SURF-18 over-claim "every state reserves its final height (CLS = 0)" with the block-role-scoped contract: content-region states (`loading`/`empty`/`error`/`ready`) — `loading ≡ ready` byte-for-byte, `empty`/`error` intentionally content-sized; status banners a separate 40px `DataTrustBanner` block role. The empty/error decision is recorded explicitly and matches the Task-1 oracle + Task-2 story. Commit `6b6181e`.

## The false-green (called out per plan)

GAP-03 was a **FALSE-GREEN test**, not only a code defect. The old oracle measured the `[data-async-cell]` wrapper, which the `Cls` story forced to `h-64` (256px) for every state — so the height-equality assertion was trivially true and the over-claim "all six states the same reserved height as ready" never had teeth. Measuring the routed primitive surfaced both the real 1px divergence **and** the wrong block-role comparison. The fix lives at all three levels: the **test** (measure the real primitive), the **code/story** (real Table → `loading ≡ ready`), and the **spec** (block-role-scoped, true contract).

## Verification

- Measured intrinsic content-region heights via a temporary probe (since removed): pre-fix `loading=203 / ready=202` (the 1px gap), `empty=243.5 / error=234` (content-sized), banners `40`.
- RED proof: on the pre-fix story the `loading ≡ ready` test fails `Expected 202, Received 203`. GREEN after Task 2: all three AsyncBoundary tests pass with exact `.toBe` equality.
- `pnpm check` — 0 errors (format + Oxlint + tsgo clean; the 86 design.md-lint warnings are pre-existing unused-chart-color advisories, out of scope).
- `pnpm --filter @solid-stats/design test:e2e` — full suite **346 passed, 0 failed** (run on an isolated preview port); the 9 `cls.spec.ts` tests (5 untouched blocks + the 3 rewritten AsyncBoundary tests, 1 false-green removed) all green.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking test-infra] e2e preview port collided with the user's running `ladle dev` server**
- **Found during:** Task 1 RED verification.
- **Issue:** `playwright.config.ts` hardcodes port `61000` with `reuseExistingServer: !isCI`. A long-running `ladle dev` server (the user's, on `61000`, serving the **main checkout** source) was reused by playwright, so the worktree's story changes never reached the browser — every cell measured 256px (the stale `h-64` cage), masking the real RED.
- **Fix:** Made the port env-overridable (`LADLE_E2E_PORT`, default `61000`) so a run can spawn its own isolated preview against the worktree's fresh build without disturbing the dev server. All in-plan e2e runs used `LADLE_E2E_PORT=42767`.
- **Files modified:** `packages/design/playwright.config.ts`
- **Commit:** `a175199` (folded into the RED commit, since it was required to observe RED).
- **Note:** I deliberately did NOT kill the user's `ladle dev` server (out of scope, and destructive to their session).

**2. [Formatting] Banner-loop assertion reflowed by `vp check --fix`**
- The Task-1 banner `for…expect` one-liner tripped the formatter; reflowed and folded into the Task-2 commit so `pnpm check` stays green.

A generated, tracked artifact `.design/support.js` was regenerated by `pnpm check`'s design.md lint with no semantic change; restored to keep the tree clean (not part of this plan's scope).

## Known Stubs

None — the ready slot renders real KIT-02 `Table` content from `ROSTER`; no placeholder/empty data.

## Threat Flags

None — presentational story + test + doc only; no new network, auth, file-access, or schema surface. Matches the plan's threat register (T-03-09-01): the rewritten oracle measures the routed primitive and fails on the 1px regression, so a future false-green cannot silently recur.

## Self-Check: PASSED

All four modified files + the SUMMARY exist on disk; all three task commits (`a175199`, `bb419d1`, `6b6181e`) are present in git history.
