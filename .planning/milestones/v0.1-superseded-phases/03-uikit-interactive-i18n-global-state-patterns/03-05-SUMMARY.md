---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 05
subsystem: ui
tags: [ark-ui, dialog, popover, overlay, focus-trap, wcag-3.3.6, tailwind-variants, lingui, ladle, playwright, a11y, tsx]

# Dependency graph
requires:
  - phase: 03-04
    provides: "the tv()-per-Ark-part slice idiom + StateMatrix/StateCell + the shared Button (close/confirm/cancel actions) + the runtime i18n catalog seam"
  - phase: 03-01
    provides: "the Wave-0 keyboard.spec RED scaffolds (Dialog Esc-close + return-focus + trap-free Tab) + the runtime Lingui harness"
provides:
  - "Dialog — the MODAL overlay over Ark Dialog: Ark owns the focus trap, the focus RETURN to the trigger on close, Esc-close, scroll-lock + inert/aria-hidden background; the slice adds the per-part tv() recipe (surface-1 + border-2 + rounded-xl + --shadow-lg over an `overlay` scrim), a real Dialog.Title heading, the icon-only close (≥44px, injected closeAria), controlled open + uncontrolled defaultOpen (the forced-open axe cell), lazyMount + unmountOnExit"
  - "Popover — the NON-modal sibling over Ark Popover (surface-1 + border-2 + rounded-lg + --shadow-md): focus-managed, returns focus, Esc-closes, NO trap; same controlled/uncontrolled props"
  - "the destructive-confirmation pattern story (WCAG 3.3.6) Phases 8–9 compose: loss-toned confirm + Trash2 icon + verb+noun label, focus defaults to the safe cancel action"
affects: [03-06, 03-07, KIT-06, surfaces, request-flow, moderation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "tv()-per-Ark-part recipe extended from the form family (Field/Input/Select/Stepper/FileUpload) to the overlay family (Dialog/Popover) — className per part, never asChild for styling"
    - "overlays animate via the bare `transition` utility (NOT arbitrary `transition-[opacity,transform]`) + data-[state] opacity/scale — CLS = 0 (the default transition omits width/height), motion-reduce drops it"
    - "the forced-open StateMatrix axe cell uses Ark UNCONTROLLED `defaultOpen` (the Select Rule-1 lesson — controlled `open` pins every instance); the interactive Playground stays controlled and is the lone keyboard.spec target (portalled Matrix overlays intercept events)"
    - "Playwright overlay keyboard tests poll for focus-settle-inside before Esc/Tab and poll the live activeElement hook for restoreFocus — the dismissable-listener-arm + restoreFocus races are made deterministic, not slept on"

key-files:
  created:
    - "packages/design/src/shared/uikit/Dialog/Dialog.tsx — Ark Dialog.Root(open/defaultOpen/lazyMount/unmountOnExit) → asChild Trigger(data-dialog-trigger) → Portal → Backdrop/Positioner/Content/CloseTrigger(injected closeAria)/Title/Description; Ark owns trap/return/Esc/inert; i18n-free (plain string props)"
    - "packages/design/src/shared/uikit/Dialog/dialog.ts — per-part tv() (backdrop `overlay` scrim, positioner, content surface-1+border-2+rounded-xl+shadow-lg, title 18px/600, body, icon-only close ≥44px); transform/opacity-only, motion-reduce"
    - "packages/design/src/shared/uikit/Dialog/Dialog.stories.tsx — Matrix (one forced-open cell) + DestructiveConfirm (WCAG 3.3.6) + Playground (the keyboard.spec target)"
    - "packages/design/src/shared/uikit/Dialog/index.ts — slice barrel (Dialog graduates; recipe internal)"
    - "packages/design/src/shared/uikit/Popover/Popover.tsx — Ark Popover.Root → asChild Trigger(data-popover-trigger) → Portal → Positioner/Content/Title/Description; Ark owns return-focus/Esc/no-trap; i18n-free"
    - "packages/design/src/shared/uikit/Popover/popover.ts — per-part tv() (positioner z-modal, content surface-1+border-2+rounded-lg+shadow-md, title, body); no decorative arrow (avoids arbitrary-value CSS custom props, YAGNI); transform/opacity-only"
    - "packages/design/src/shared/uikit/Popover/Popover.stories.tsx — Matrix forced-open cell + Playground"
    - "packages/design/src/shared/uikit/Popover/index.ts — slice barrel (Popover graduates; recipe internal)"
  modified:
    - "packages/design/src/index.ts — KIT-06 Overlay Wave-5 barrel region (Dialog, Popover)"
    - "packages/design/src/shared/uikit/_fixtures/strings.ts — KIT-06 overlay copy (dialogClose/formSubmit/formCancel, dialog/confirmDelete/popover keys — RU primary/EN parity; flows into both runtime catalogs + the typed-key union)"
    - "packages/design/tests/keyboard.spec.ts — Dialog Wave-0 RED block turned GREEN (Esc + return-focus + trap-free Tab + portal-paints tree-shake guard) + a new Popover block (Esc + return-focus + NON-modal no-trap)"

key-decisions:
  - "Ark owns ALL overlay a11y (trap/return/Esc/inert for Dialog; return/Esc/no-trap for Popover) — the slice is purely the tv() recipe + data-* hooks + controlled props (RESEARCH Don't-Hand-Roll; a11y.md prefer the Ark primitive). Verified live: X-close, backdrop-click, and Esc all close; focus returns to the trigger; the modal traps Tab, the popover does not."
  - "Overlays animate via the bare `transition` utility, NOT `transition-[opacity,transform]` — the arbitrary bracket-list form breaches the no-arbitrary-values rule (styling.md); the default `transition` property set omits width/height so CLS stays 0 (Rule 1 fix applied to both recipes)."
  - "The Popover ships NO decorative arrow — the Ark arrow's size/bg/border are raw-literal CSS custom props (`[--arrow-size:…]`) that would breach no-arbitrary-values; a plain floating surface is fully KIT-06-compliant (YAGNI, component-shape.md)."
  - "The destructive-confirm confirm button is the secondary Button tinted with `border-loss-border!`/`text-loss!` (the merge-free `/lite` `!`-override) + a Trash2 icon + the `confirmDeleteConfirm` verb+noun label; focus defaults to the safe cancel via `autoFocus` (WCAG 3.3.6, T-03-05-02 mitigate) — axe-clean contrast confirmed."
  - "The overlay keyboard specs gate on focus-settle-inside before pressing Esc/Tab and poll the live activeElement for the trigger hook on restoreFocus — Ark's `closeOnEscape` dismissable listener arms as focus lands in the content, so a global keydown in the open frame races it; polling makes it deterministic under parallel load (no fixed sleeps)."

patterns-established:
  - "the overlay slice mirrors the form-family slice shape: tv()-per-part recipe + Ark-owned behaviour + data-* hook + controlled open/onOpenChange (+ uncontrolled defaultOpen for the forced-open axe cell) + i18n-free plain-string props resolved in the story"
  - "Playwright overlay keyboard oracles: poll focus-inside before the key event; poll the activeElement data-hook for restoreFocus; assert the modal traps Tab vs the non-modal escapes (inverse oracles) — the race-free pattern Menu/Tabs (Wave 6) reuse"

requirements-completed: [KIT-06, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05]

coverage:
  - id: D1
    description: "Dialog — modal: focus trap inside, focus returns to the trigger on close, Esc closes, `overlay` scrim, inert background, localized real-heading title, icon-only close with injected aria; controlled open + lazyMount + unmountOnExit"
    requirement: "KIT-06"
    verification:
      - kind: e2e
        ref: "tests/keyboard.spec.ts#KIT-06 Dialog keyboard behaviour (Plan 03-05 GREEN) — Esc closes + focus returns to trigger; trap-free Tab cycle stays scoped; portal content paints"
        status: pass
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-06-overlay--dialog--matrix|playground|destructive-confirm axe clean (serious/critical) + 44px + keyboard-reachable"
        status: pass
    human_judgment: false
  - id: D2
    description: "Popover — non-modal: focus-managed, returns focus, Esc closes, NO trap (Tab leaves the panel); surface-1 + border-2 + rounded-lg + --shadow-md"
    requirement: "KIT-06"
    verification:
      - kind: e2e
        ref: "tests/keyboard.spec.ts#KIT-06 Popover keyboard behaviour (Plan 03-05 GREEN) — Esc closes + focus returns; Tab escapes the panel (no trap)"
        status: pass
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-06-overlay--popover--matrix|playground axe clean + 44px"
        status: pass
    human_judgment: false
  - id: D3
    description: "Destructive-confirmation pattern (WCAG 3.3.6) — loss-toned confirm + Trash2 icon + verb+noun label, focus defaults to the safe cancel; the forced-open axe gate uses Ark defaultOpen (no Ladle hack); both overlays animate transform/opacity only (CLS = 0)"
    requirement: "QUAL-03"
    verification:
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-06-overlay--dialog--destructive-confirm axe clean (loss contrast) + 44px"
        status: pass
    human_judgment: true
    rationale: "Visual correctness of the destructive-confirm treatment (loss tone + icon pairing, focus-on-cancel affordance) and the RU-longest title/body clip at the 360 floor is a design-review judgment the axe/44px gate does not assert."

# Metrics
duration: ~25min
completed: 2026-06-25
status: complete
---

# Phase 03 Plan 05: KIT-06 Dialog + Popover Summary

**The first overlay-family slice group — `Dialog` (modal: Ark-owned focus trap, return-focus, Esc, scrim, inert background, localized real-heading title, icon-only close) and `Popover` (non-modal: focus-managed, returns focus, Esc, NO trap), each a thin tv()-per-Ark-part recipe + data-* hooks + controlled props, plus the WCAG 3.3.6 destructive-confirmation pattern story Phases 8–9 compose. Turns the Wave-0 Dialog RED keyboard specs (Esc closes + focus returns to trigger; trap-free Tab) GREEN.**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-06-25
- **Tasks:** 3
- **Files:** 8 created, 3 modified

## Accomplishments
- Built `Dialog` over Ark Dialog (Root/Trigger/Portal/Backdrop/Positioner/Content/Title/Description/CloseTrigger) — Ark owns the focus trap, focus-return-to-trigger, Esc-close, scroll-lock and inert/aria-hidden background; the slice adds the per-part tv() recipe (`overlay` scrim, surface-1 + border-2 + rounded-xl + --shadow-lg, 18px/600 title, ≥44px icon-only close with an injected `closeAria`), the `data-dialog`/`data-dialog-trigger` hooks, controlled `open`/`onOpenChange` + uncontrolled `defaultOpen`, `lazyMount` + `unmountOnExit`. No i18n inside (plain string props).
- Built `Popover` over Ark Popover as the non-modal sibling (surface-1 + border-2 + rounded-lg + --shadow-md) — focus-managed, returns focus, Esc-closes, NO trap; same controlled/uncontrolled props and `data-popover`/`data-popover-trigger` hooks. No decorative arrow (avoids arbitrary-value CSS custom props).
- Shipped the destructive-confirmation pattern story (WCAG 3.3.6): the confirm is the secondary Button tinted `loss` + a Trash2 icon + the `confirmDeleteConfirm` verb+noun label, and focus defaults to the safe cancel via `autoFocus` — an accidental Enter cancels, never deletes.
- Turned the Plan-03-01 Dialog Wave-0 RED block GREEN (Esc closes + focus returns to the trigger + trap-free Tab cycle + a portal-paints tree-shake guard) and added the Popover keyboard block (Esc + return-focus + NON-modal no-trap, the inverse-of-Dialog oracle).
- Graduated `Dialog` + `Popover` into the barrel — this opens the KIT-06 overlay family (Menu/Tabs land in Wave 6).

## Task Commits

1. **Task 1: Dialog — Ark Dialog per-part recipe, trap/return/Esc/scrim, localized title** — `605f653` (feat)
2. **Task 2: Popover — Ark Popover per-part recipe, focus-managed, no trap** — `e9d3adf` (feat)
3. **Task 3: Dialog + Popover stories (forced-open + destructive-confirm), barrel, keyboard specs GREEN** — `6e212a2` (feat)

## Decisions Made
- **Ark owns all overlay a11y.** The slice is purely the tv() recipe + data-* hooks + controlled props; trap/return/Esc/inert (Dialog) and return/Esc/no-trap (Popover) are Ark's. Verified live in-browser (X-close, backdrop-click, and Esc all close; focus returns to the trigger; modal traps Tab, popover does not).
- **Bare `transition`, not `transition-[opacity,transform]`.** The arbitrary bracket-list form breaches no-arbitrary-values (styling.md); the default `transition` property set omits width/height, so CLS stays 0. Applied to both recipes.
- **No Popover arrow.** Its Ark size/bg/border are raw-literal CSS custom props that would breach no-arbitrary-values; a plain floating surface is fully KIT-06-compliant (YAGNI).
- **Race-free overlay keyboard oracles.** Ark's `closeOnEscape` dismissable listener arms as focus lands in the content; a global keydown in the open frame races it. The specs poll focus-settle-inside before Esc/Tab and poll the live activeElement hook for restoreFocus — deterministic, no fixed sleeps.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Toolchain] `tsc --noEmit` verify step is not available in this repo**
- **Found during:** all `<verify>` blocks (Tasks 1–3)
- **Issue:** the plan calls `tsc --noEmit`, but this repo has no `typescript`/`tsc` — the gate is Vite+ (`vp check`, fmt + lint, no type-check stage).
- **Fix:** used `pnpm exec vp check packages` + wrote types by construction; ran `pnpm --filter @solid-stats/design test` (unit, 154) + `ladle:build` + the Playwright keyboard/catalog/cls e2e.
- **Verification:** `vp check` green (147 files, 0 lint errors); 154 unit tests pass; `ladle:build` green; KIT-06 e2e GREEN.
- **Committed in:** n/a (process adjustment)

**2. [Rule 1 - Bug] Arbitrary `transition-[opacity,transform]` → standard `transition` utility**
- **Found during:** Task 2 (writing the Popover recipe, surveyed against the established transition idiom)
- **Issue:** the research Dialog example animated via an arbitrary bracket-list `transition-[opacity,transform]`, which breaches the no-arbitrary-values rule (styling.md — the repo uses only `transition-colors`/`transition-opacity`).
- **Fix:** switched both `dialog.ts` and `popover.ts` to the bare `transition` utility (a standard utility whose default property set omits width/height — CLS still 0). The Dialog fix landed in the Task-2 commit alongside the Popover recipe (same class of defect).
- **Verification:** `vp check` green; cls e2e shows no overlay layout shift; the open/close fade renders.
- **Committed in:** `e9d3adf` (Task 2 commit)

**3. [Rule 2 - Missing critical] New i18n keys for the overlay story copy**
- **Found during:** Task 3 (stories)
- **Issue:** the dialog title/body/close-aria, the form submit/cancel actions, the destructive-confirm title/body/verb+noun label, and the popover trigger/title/body are required copy the catalog did not yet carry.
- **Fix:** added `dialogClose`/`formSubmit`/`formCancel`/`dialogTitle`/`dialogBody`/`confirmDeleteTitle`/`confirmDeleteBody`/`confirmDeleteConfirm`/`popoverTrigger`/`popoverTitle`/`popoverBody` to STRINGS (RU primary / EN parity) — they flow into both runtime catalogs + the typed-key union via the existing derive.
- **Verification:** `catalogs.test.ts` parity + key-set + no-drift tests pass (154 unit total).
- **Committed in:** `6e212a2` (Task 3 commit)

**4. [Rule 1 - Test robustness] Overlay keyboard specs hardened against the dismissable-arm + restoreFocus races**
- **Found during:** Task 3 (Dialog/Popover keyboard specs — first run RED on Esc-close + focus-return)
- **Issue:** a global `page.keyboard.press("Escape")` fired in the same frame as the open raced ahead of Ark's `closeOnEscape` listener arming (the dialog stayed open); and `restoreFocus` lands a frame after the close, so an immediate identity check against the captured trigger handle failed. The Dialog trap test also flaked under parallel load (first Tab fired before focus settled inside).
- **Fix:** poll for focus-settle-inside before pressing Esc/Tab; poll the live `document.activeElement` for the trigger `data-*` hook on restoreFocus; reframed the Popover no-trap oracle to assert focus ESCAPES the panel (the inverse of the Dialog trap, fixture-robust for a panel with no focusable children).
- **Verification:** the KIT-06 Dialog + Popover blocks pass 15/15 across `--repeat-each=3` and in the full parallel suite.
- **Committed in:** `6e212a2` (Task 3 commit)

### Out-of-scope discovery (deferred, NOT fixed)

**DEF-03-05-01 — pre-existing FileUpload keyboard-spec story-id mismatch (Plan 03-04).** The three `KIT-05 FileUpload keyboard dropzone (Plan 03-04 GREEN)` tests reference story id `kit-05-form--file-upload--playground`, but the Ladle id from the title `"KIT-05 Form / FileUpload"` is `kit-05-form--fileupload--playground` (no hyphen). `FILE_UPLOAD_STORY` is committed with the wrong id in HEAD by Plan 03-04 — so those three tests have been RED since 03-04 (the 03-04 SUMMARY's GREEN claim did not hold). Per the executor SCOPE BOUNDARY this is a pre-existing failure in the KIT-05 slice's spec block, not caused by the KIT-06 changes. Logged to `deferred-items.md` (one-token fix for a `/gsd-fast` or the next plan touching `keyboard.spec.ts`). Not fixed here.

---

**Total deviations:** 4 auto-fixed (1 Rule 3 toolchain, 2 Rule 1, 1 Rule 2) + 1 deferred out-of-scope.
**Impact on plan:** no scope creep — all changes stayed inside `files_modified` (plus the deferred-items.md log + this SUMMARY); the threat model's T-03-05-02 (destructive-confirm focus-on-safe) is satisfied verbatim.

## Issues Encountered
- **Ark `closeOnEscape` arms with focus, not at mount.** Esc only closes once focus has settled inside the content (the dismissable listener arms there). Diagnosed live (a temporary throwaway story compared controlled vs uncontrolled + each close path — X-close and backdrop-click worked immediately, only the same-frame global Esc raced). Resolved with focus-settle polling in the specs; the component is correct (controlled and uncontrolled both close on Esc once focus is inside). Throwaway debug story removed before commit.

## Known Stubs
None — Dialog + Popover are fully wired over Ark; story fixtures are author-controlled presentational copy (v0.1 Ladle, no network/server-2). The destructive-confirm is a presentational pattern story (no real deletion) by design — Phases 8–9 compose the real flow.

## Threat Flags
None — no new network endpoint, auth path, or trust boundary. Portal mounts to `document.body` (a structural/styling note, not a security surface); story strings are JSX-auto-escaped author fixtures (T-03-05-01 accept). T-03-05-02 (destructive-confirm default-focus-on-safe) is mitigated as planned.

## Next Phase Readiness
- KIT-06 overlay family is OPENED (Dialog, Popover graduated). Menu + Tabs land in Wave 6 — their Wave-0 RED scaffolds in `keyboard.spec.ts` stay RED by design until then, and reuse the race-free overlay keyboard oracle this plan established.
- The Dialog is the modal Phases 8–9 compose for confirmations; the destructive-confirm pattern (focus-on-cancel, loss + verb+noun) is the reusable template.
- DEF-03-05-01 (FileUpload spec story-id) is carried in `deferred-items.md`.

## Self-Check: PASSED
- All 8 created files present on disk; all 3 task commits (`605f653`, `e9d3adf`, `6e212a2`) in git history; no debug artifacts left in the tree.

---
*Phase: 03-uikit-interactive-i18n-global-state-patterns*
*Completed: 2026-06-25*
