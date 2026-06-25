---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 11
subsystem: ui
tags: [motion, gap-closure, gap-02, gap-04, overlay, toast, ark-ui, prefers-reduced-motion, cls-zero, keyframes, data-state, playwright, a11y, tsx, css]

# Dependency graph
requires:
  - phase: 03-05
    provides: "the Dialog/Popover recipes (per-part tv() slots, data-[state] open/closed frames, motion-reduce: opt-out) the motion policy replaces"
  - phase: 03-06
    provides: "the Menu/Tooltip recipes completing the KIT-06 overlay family the policy is applied across"
  - phase: 03-07
    provides: "the ToastManager (createToaster + ToastViewport render-prop over the existing Toast leaf) + the Toast visual leaf whose stacking/enter-exit this plan makes real"
provides:
  - "ONE overlay+toast motion policy: a shared `.uikit-overlay-motion` keyframe-animation recipe (styles/uikit.css) driven by Ark's [data-state], reading the @theme --duration-*/--ease-* tokens, animating transform/opacity only (CLS=0), dropped under prefers-reduced-motion. Applied identically across Dialog/Menu/Popover/Tooltip (tooltip on the fast role); the backdrop scrim uses an opacity-only sibling. The overlay enter (closed→open) now ACTUALLY plays at runtime."
  - "Real toast stacking: the Toast leaf rendered through the Ark Toast.Root so it receives zag's per-toast stacking vars; overlap:false + the .uikit-toast-motion recipe applies translateY(var(--y)) so fired toasts show a real gap>0 at rest (the 12px gap + each toast height) and play a shared-token opacity enter/exit. Reduced-motion drops the fade, keeps the essential stacking layout."
  - "A runtime motion regression spec (packages/design/tests/motion.spec.ts) that FAILS on the pre-fix dead mount transition / flush toasts and asserts the reduced-motion opt-out — the guard against GAP-02/GAP-04 regressing."
affects: [surfaces, overview, player-profile, moderation, request-steppers, 04, 05, 06, 07, 08, 09]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "the [data-state]-driven CSS keyframe ANIMATION as the overlay enter/exit mechanism (NOT a Tailwind transition + @starting-style): Ark mounts overlay content directly in data-state=open, so a transition needs a cross-frame property delta to fire and @starting-style did not run in this Ark/Chromium matrix; a CSS animation runs as soon as its rule first applies to the connected element, so the enter plays even on a direct-to-open mount"
    - "ONE shared motion recipe in the hand-authored exported uikit.css (the .sk-sweep precedent) reading the @theme motion tokens via plain CSS var() — the policy lives in CSS keyed on Ark's [data-state]/[data-part], so the recipes only carry a single class (uikit-overlay-motion / uikit-toast-motion), not a per-component motion class soup"
    - "real toast stacking via the Ark Toast.Root: render the existing presentational leaf INSIDE Toast.Root (the leaf is the surface, the Root is the positioned stacking element) so the leaf receives zag's --y/--offset/--index vars; the consumer applies translateY(var(--y)) (Ark sets the vars, never the transform). overlap:false (stacked) guarantees a gap>0 at rest"
    - "a stacking transform + an enter animation co-exist by keeping the enter OPACITY-only on the stacked element — a transform-animating enter would clobber the resting translateY(var(--y)) and collapse the stack"

key-files:
  created:
    - "packages/design/tests/motion.spec.ts — the GAP-02 + GAP-04 runtime motion regression: overlay enter renders the closed→open frame (first-frame opacity<1) + runs the token-driven enter keyframes; toasts stack with a gap>0 at rest + run the shared enter animation; reduced-motion drops the non-essential enter (animation:none). Animation-plays blocks override the harness's forced reducedMotion:reduce via test.use({ contextOptions: { reducedMotion: 'no-preference' } }) (the typed per-test path in Playwright 1.61)"
  modified:
    - "packages/design/src/styles/uikit.css — the ONE motion policy: .uikit-overlay-motion (enter/exit keyframes on Ark [data-state], --duration-base/--ease-out, transform/opacity only) + .uikit-overlay-motion-fast (tooltip fast role) + .uikit-overlay-backdrop-motion (opacity-only scrim) + .uikit-toast-motion (translateY(var(--y)) stacking + opacity enter/exit); all dropped under prefers-reduced-motion (the toast keeps the essential stacking transform)"
    - "packages/design/src/shared/uikit/Dialog/dialog.ts — backdrop → .uikit-overlay-backdrop-motion; content → .uikit-overlay-motion (replaced the dead `transition duration-150 data-[state] scale/opacity` block)"
    - "packages/design/src/shared/uikit/Menu/menu.ts — content → .uikit-overlay-motion (same shared policy)"
    - "packages/design/src/shared/uikit/Popover/popover.ts — content → .uikit-overlay-motion (same shared policy)"
    - "packages/design/src/shared/uikit/Tooltip/tooltip.ts — content → .uikit-overlay-motion .uikit-overlay-motion-fast (the fast duration role)"
    - "packages/design/src/shared/uikit/ToastManager/ToastManager.tsx — render the leaf through Ark Toast.Root (.uikit-toast-motion); createToaster overlap:true→false (stacked, real gap); pass live={false} so the leaf drops its redundant role=status (the Root owns the live region)"
    - "packages/design/src/shared/uikit/Toast/Toast.tsx — add the live?: boolean prop (default true): the leaf's role=status is dropped when composed inside the Ark Toast.Root, kept for the standalone catalog leaf"

key-decisions:
  - "Mechanism: a [data-state]-driven CSS keyframe ANIMATION, NOT the planned Tailwind `starting:`/@starting-style transition. Verified at runtime that @starting-style did not fire in this Ark 5.37 / Chromium matrix — the overlay content mounts directly in data-state=open (lazyMount+unmountOnExit), the element is connected + styled past the starting frame in a single paint, so 0 animations ran and opacity read 1 on the first frame. A CSS animation runs as soon as its rule first applies to the connected element, so the enter plays regardless of a cross-frame property delta. This is the plan's sanctioned fallback ('if @starting-style is not viable in this Ark/browser matrix, use Ark's present/animation API — pick ONE mechanism and apply it family-wide')."
  - "The motion policy lives in the hand-authored exported uikit.css (the .sk-sweep precedent), NOT in the recipe tv() class strings. It reads the @theme motion tokens via plain CSS var(), keyed on Ark's [data-state] — so the four recipes carry a single class each (no per-component starting:/data-[state] motion soup), the timing is token-driven, and theme.css (generated) is untouched."
  - "SUPERSEDES the Plan 03-07 decision 'the manager renders the leaf with NO Ark Toast.Root parts'. That choice was the GAP-04 root cause: without the Ark Toast.Root the leaf never received zag's stacking vars, so overlap:true/gap:12 had nothing to attach to and toasts stacked flush. Task 3 now renders the leaf INSIDE Toast.Root (the leaf stays the unchanged visual surface — no re-expression, D-06 preserved) so it receives --y/--offset/--index; the consumer applies translateY(var(--y))."
  - "Stacking model: overlap:false (Option A in the plan) — guaranteed gap>0 at rest without depending on a hover fan-out. zag's stacked --y = calc(--lift * --offset) where --offset includes the 12px gap + accumulated heights."
  - "The reduced-motion opt-out moved from the merge-free `motion-reduce:transition-none` (which lost to CSS source order in tailwind-variants/lite and left a live 150ms transition — a latent a11y bug surfaced during RED) to a `@media (prefers-reduced-motion: reduce) { animation: none }` rule that cannot be out-ordered. The toast keeps its essential stacking transform under reduced motion (only the fade drops)."
  - "a11y: the Ark Toast.Root owns role=status, so the composed leaf drops its nested role=status via live={false} (no double SR announce); the standalone catalog leaf keeps it."

patterns-established:
  - "overlay enter/exit via a [data-state]-keyed CSS keyframe animation in uikit.css reading @theme motion tokens — the reusable family-wide motion mechanism for any Ark-state-driven surface that mounts directly in its open state"
  - "compose a presentational feedback leaf inside Ark Toast.Root to get real stacking (Ark sets the --y/--offset vars, the consumer applies translateY) while keeping the leaf unchanged — the reusable shape for animating a queued/stacked toast"
  - "co-existing resting transform + enter animation: keep the enter opacity-only on a transform-positioned element so the animation never clobbers the layout transform"

requirements-completed: [KIT-06, SURF-18, QUAL-01]

# Metrics
metrics:
  tasks_completed: 3
  files_created: 1
  files_modified: 7
  commits: 4
  tests_added: 4
  duration_minutes: 55
  completed: 2026-06-25

status: complete
---

# Phase 3 Plan 11: One Motion Policy (GAP-02 + GAP-04) Summary

One token-driven motion policy now makes the whole overlay+toast family actually animate at runtime, and toast stacking is real — guarded by a regression spec that fails on the dead pre-fix mount transition.

## What shipped

- **GAP-02 closed** — Dialog/Menu/Popover/Tooltip share ONE `.uikit-overlay-motion` recipe (styles/uikit.css), a `[data-state]`-driven CSS keyframe animation reading the `--duration-base`/`--ease-out` @theme tokens (tooltip on `--duration-fast`). The overlay enter (closed→open) now plays at runtime — verified the content starts at opacity 0 and ramps in — where before it mounted flush in `data-state=open` with no enter frame. No overlay hardcodes `duration-150`. Transform/opacity only (CLS=0); reduced-motion drops it via a `@media (prefers-reduced-motion: reduce)` rule.
- **GAP-04 closed** — the Toast leaf renders through the Ark `Toast.Root` so it receives zag's per-toast stacking vars; `overlap:false` + `.uikit-toast-motion` applies `translateY(var(--y))`, so fired toasts show a real gap>0 at rest (measured ~82px between adjacent toasts: the 12px gap + toast height) and play a shared-token opacity enter/exit.
- **Regression guard** — `packages/design/tests/motion.spec.ts`: overlay enter-frame + token-driven animation, toast gap+animate, and reduced-motion suppression, all asserted against RUNTIME geometry/computed style.

## Verification

- `pnpm check` — green (0 errors).
- `pnpm --filter @solid-stats/design test:e2e` — 348 passed, 0 failed (motion.spec stable across 3 repeat runs; full suite incl. catalog axe / keyboard / cls clean).

## Deviations from Plan

### Mechanism change (documented, plan-sanctioned)

**1. [Rule 3 — blocking] `@starting-style` not viable → CSS keyframe animation fallback**
- **Found during:** Task 2.
- **Issue:** The plan's primary mechanism (Tailwind `starting:`/@starting-style enter frame) did not fire in this Ark 5.37 / Chromium matrix — runtime probe showed 0 running animations and opacity 1 on the first frame after open, because Ark mounts the content directly in `data-state=open` (lazyMount+unmountOnExit) and the element is connected + styled past the starting frame in a single paint, so no transition ever started.
- **Fix:** Switched to the plan's explicit fallback — a `[data-state]`-driven CSS keyframe animation (`.uikit-overlay-motion` in uikit.css), which runs as soon as its rule first applies to the connected element. One mechanism, applied family-wide.
- **Files:** packages/design/src/styles/uikit.css, the four overlay recipes, packages/design/tests/motion.spec.ts (oracle adapted to read animation, not transition).
- **Commit:** c713f56.

### Auto-fixed issues

**2. [Rule 1 — bug] broken reduced-motion opt-out (latent a11y bug)**
- **Found during:** Task 1 RED (probe).
- **Issue:** `motion-reduce:transition-none` on the overlay recipes never collapsed the transition — under `prefers-reduced-motion: reduce` the content's computed `transition-duration` stayed `0.15s` (the merge-free `tailwind-variants/lite` let `transition-none` lose to CSS source order). The opt-out was dead.
- **Fix:** Moved the opt-out into a `@media (prefers-reduced-motion: reduce) { animation: none }` rule in uikit.css, which cannot be out-ordered. Verified reduced-motion now yields `animationName: none` / 0 running animations.
- **Commit:** c713f56.

**3. [Rule 2 — a11y] nested `role="status"` after composing the leaf in Ark Toast.Root**
- **Found during:** Task 3.
- **Issue:** The Ark `Toast.Root` sets `role="status"`; the leaf also set `role="status"` → a redundant nested live region (double SR announce).
- **Fix:** Added a `live?: boolean` prop to the leaf (default true for standalone catalog use); the manager passes `live={false}` so only the Root's live region announces.
- **Commit:** e60c415.

### Scope notes

- `ToastManager.stories.tsx` was listed in the plan's `files_modified` but needed no change — the Playground already had the trigger buttons + a mounted viewport. The motion test's only load-timing fix lives in the spec (wait for the interactive trigger buttons rather than Ladle's `[data-storyloaded]`, which flips before the React story tree is interactive).

## Out-of-scope discoveries (NOT fixed — observation)

- During the full-suite RED run, `kit-01-nav-shell--appshell--*` (44px target) and `kit-05-form--select--matrix` (axe) failed once under heavy parallel load, then passed on every subsequent run (local config has retries:0). These are pre-existing parallel-load flakes unrelated to this plan's presentational motion change — not fixed here.

## Self-Check: PASSED

- FOUND: packages/design/tests/motion.spec.ts
- FOUND: commits aae3ee3 (RED), c713f56 (overlay policy), e60c415 (toast stacking)
- `pnpm check` green; `pnpm --filter @solid-stats/design test:e2e` 348 passed.
