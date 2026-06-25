---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 06
subsystem: ui
tags: [ark-ui, menu, tabs, tooltip, overlay, roving-tabindex, wcag-2.4.12, reduced-motion, tailwind-variants, lingui, ladle, playwright, a11y, tsx]

# Dependency graph
requires:
  - phase: 03-05
    provides: "the tv()-per-Ark-part overlay slice idiom (Dialog/Popover) + the forced-open StateMatrix axe cell (Ark defaultOpen) + the interactive-Playground-as-the-lone-keyboard-target shape + the race-free overlay keyboard oracle (focus-settle polling, the Ark-v5 colon-id attribute-locator)"
  - phase: 03-01
    provides: "the Wave-0 keyboard.spec RED scaffolds (Menu aria-expanded/controls + Tabs roving-tabindex) + the runtime Lingui i18n harness + StateMatrix/StateCell"
provides:
  - "Menu — the trigger-menu over Ark Menu: Ark owns aria-expanded/aria-controls, the roving keyboard highlight (arrow/Home/End/type-ahead/wrap), Esc-close, and the no-trap dismiss; the slice adds the per-part tv() recipe (popover surface-1 + border-2 + rounded-lg + --shadow-md, ≥44px items with surface-3 hover, the Ark-highlighted item cyan + surface-3 — never color-alone), the data-menu/data-menu-trigger hooks, controlled open + uncontrolled defaultOpen"
  - "Tabs — the roving-tabindex tab set over Ark Tabs: Ark owns the arrow roving tabindex (exactly one tab in the page tab order) + Home/End + the panel aria-association; the active tab is cyan PAIRED with a border-primary underline (never color-alone) and the canonical focus ring keeps the focused tab visible/unclipped under a sticky bar (WCAG 2.4.12); controlled value/onValueChange + panels keyed by value; TabData graduates"
  - "Tooltip — the focus+hover supplementary-hint over Ark Tooltip: appears on focus AS WELL AS hover, drops its animation under prefers-reduced-motion, is NOT a label substitute and never the only carrier of meaning (the consuming surface pairs it with a visible label); controlled open + uncontrolled defaultOpen"
affects: [03-07, KIT-06, surfaces, player-profile, moderation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "the overlay slice idiom (tv()-per-Ark-part + Ark-owned behaviour + data-* hook + controlled open/value + i18n-free plain-string props) extended from Dialog/Popover to Menu/Tabs/Tooltip — COMPLETING the KIT-06 overlay family"
    - "cyan-active-paired-with-a-structural-marker, never color-alone: the active tab maps `data-[selected]` to BOTH `text-primary` AND a `border-primary` bottom underline (the marker rides the same selected state so it can never be dropped leaving colour alone); the resting tab reserves the underline slot (border-transparent) so selecting it swaps colour, not height (CLS = 0)"
    - "Tabs roving-tabindex keyboard oracle: CLICK the first tab to arm Ark's roving focus tracker (a bare Playwright `.focus()` lands DOM focus but does not register the tablist roving entry, so ArrowRight no-ops), then poll the focused+selected state to settle before ArrowRight and poll the selected-tab text after — deterministic under parallel load, no fixed sleeps"
    - "the focus-not-obscured (2.4.12) oracle mirrored from the Table GAP-10 inset-ring check onto Tabs: the focused tab paints a visible focus ring on its OWN box (the canonical `focus-visible:shadow-(--shadow-ring)`), so a sticky bar can never clip it"

key-files:
  created:
    - "packages/design/src/shared/uikit/Menu/menu.ts — per-part tv() (positioner z-modal, content popover surface, item min-h-11 + surface-3 hover + data-[highlighted] cyan, itemGroup, separator); transform/opacity-only, motion-reduce"
    - "packages/design/src/shared/uikit/Menu/Menu.tsx — Ark Menu.Root(open/defaultOpen/lazyMount/unmountOnExit) → asChild Trigger(data-menu-trigger) → Portal → Positioner/Content(data-menu)/Item(value/onSelect); Ark owns roving/aria/Esc; i18n-free; typed MenuItemData items"
    - "packages/design/src/shared/uikit/Menu/index.ts — slice barrel (Menu + MenuItemData graduate; recipe internal)"
    - "packages/design/src/shared/uikit/Menu/Menu.stories.tsx — Matrix (one forced-open cell, Ark defaultOpen) + Playground (the keyboard.spec target); QUAL-05 RU-longest item row"
    - "packages/design/src/shared/uikit/Tabs/tabs.ts — per-part tv() (list border-b baseline, trigger min-h-11 + canonical ring + data-[selected] cyan text + border-primary underline, indicator, content); border-transparent resting slot (CLS 0)"
    - "packages/design/src/shared/uikit/Tabs/Tabs.tsx — Ark Tabs.Root(value/defaultValue/onValueChange) → List/Trigger(value)/Indicator → Content(value) keyed panels; Ark owns roving tabindex + panel aria; i18n-free; typed TabData"
    - "packages/design/src/shared/uikit/Tabs/tabs.test.ts — pure-logic contract: cyan-active PAIRED with the structural underline (never color-alone), the reserved transparent slot, ≥44px, the ONE canonical visible ring (2.4.12), cursor-pointer"
    - "packages/design/src/shared/uikit/Tabs/index.ts — slice barrel (Tabs + TabData graduate; recipe internal)"
    - "packages/design/src/shared/uikit/Tabs/Tabs.stories.tsx — Matrix (first-active + later-active forced cells, controlled value) + Playground (the keyboard.spec target)"
    - "packages/design/src/shared/uikit/Tooltip/tooltip.ts — per-part tv() (positioner z-modal, content small surface-1/border-2 with motion-reduce dropping the animation, empty arrow slot — no arbitrary-value arrow); transform/opacity-only"
    - "packages/design/src/shared/uikit/Tooltip/Tooltip.tsx — Ark Tooltip.Root(open/defaultOpen/lazyMount/unmountOnExit) → asChild Trigger(data-tooltip-trigger) → Portal → Positioner/Content(data-tooltip); focus+hover (Ark default); head comment — NOT a label substitute, never the only meaning carrier; i18n-free"
    - "packages/design/src/shared/uikit/Tooltip/tooltip.test.ts — pure-logic contract: reduced-motion drop, transform/opacity-only (CLS 0), tokenised surface (no arbitrary values)"
    - "packages/design/src/shared/uikit/Tooltip/index.ts — slice barrel (Tooltip graduates; recipe internal)"
    - "packages/design/src/shared/uikit/Tooltip/Tooltip.stories.tsx — Matrix (one forced-open cell) + Playground; the tooltip paired with a visible Button label (never the only carrier)"
  modified:
    - "packages/design/src/index.ts — KIT-06 Overlay Wave-6 barrel region (Menu, Tabs, Tooltip + MenuItemData/TabData) — COMPLETES the KIT-06 overlay family"
    - "packages/design/src/shared/uikit/_fixtures/strings.ts — KIT-06 Menu/Tabs/Tooltip story copy (menuTrigger/menuItem*/menuItemLongest, tabsLabel*/tabsPanel*, tooltipTrigger/tooltipContent — RU primary / EN parity; flows into both runtime catalogs + the typed-key union)"
    - "packages/design/tests/keyboard.spec.ts — Menu aria-expanded/controls + Tabs roving-tabindex Wave-0 RED blocks turned GREEN; added the Tabs focus-not-obscured (2.4.12) + cyan-not-alone underline oracles; the Ark-v5 colon-id attribute-locator + the roving-arm-via-click + focus-settle polling fixes"

key-decisions:
  - "Ark owns ALL Menu/Tabs/Tooltip a11y — aria-expanded/aria-controls + roving highlight + Esc + no-trap (Menu), arrow roving tabindex + panel aria-association (Tabs), focus+hover + dismiss + aria-describedby (Tooltip). The slice is purely the tv() recipe + data-* hooks + controlled props (RESEARCH Don't-Hand-Roll; a11y.md prefer the Ark primitive). The ONLY asChild use is slotting the shared Button into the Menu/Tooltip trigger (the canonical ring + ≥44px floor), never asChild for styling."
  - "Cyan is NEVER color-alone. The Menu-highlighted item is cyan + a surface-3 fill (the highlight state); the active Tabs trigger is cyan + a border-primary underline. Both pair the colour with a structural/state marker on the SAME Ark data-attribute (`data-[highlighted]` / `data-[selected]`), so the marker can never be dropped leaving colour alone (a11y.md)."
  - "The Tabs underline reserves a transparent slot on the resting trigger (`border-b-2 border-transparent`), so selecting a tab swaps the border COLOUR, not the trigger HEIGHT — CLS stays 0 (QUAL-04 / styling.md)."
  - "The Tooltip ships NO painted arrow (the Popover precedent) — a connector arrow's Ark size/bg/border are raw-literal CSS custom props that would breach no-arbitrary-values (styling.md). The anatomy slot is held empty (YAGNI)."
  - "The Tooltip is a SUPPLEMENT, never the only meaning carrier — every story trigger is a real labelled Button whose text stands on its own; the tooltip only adds a hint. Documented in the component head comment (a11y.md; 03-UI-SPEC KIT-06)."

patterns-established:
  - "the cyan-active-paired-with-a-structural-marker recipe (text-primary + a border/fill marker on the same selected/highlighted Ark data-attribute, with a reserved transparent slot for CLS 0) — the reusable never-color-alone treatment for any future active/selected control"
  - "the Tabs roving-tabindex Playwright oracle (click-to-arm-the-roving + poll-focused-and-selected-to-settle + poll-the-selected-text-after-arrow) — the race-free keyboard pattern for Ark roving-focus widgets under parallel load"

requirements-completed: [KIT-06, QUAL-01, QUAL-02, QUAL-03, QUAL-05]

coverage:
  - id: M1
    description: "Menu — Ark Menu trigger menu: aria-expanded false→true on open, aria-controls names the live panel, the roving keyboard highlight (Ark), ≥44px items, surface-3 hover, the highlighted item cyan + surface-3 (never color-alone), Esc-close, no trap; controlled open + forced-open axe cell"
    requirement: "KIT-06"
    verification:
      - kind: e2e
        ref: "tests/keyboard.spec.ts#KIT-06 Menu disclosure semantics (Plan 03-06 GREEN) — aria-expanded toggles false→true + aria-controls points at the live panel (Ark-v5 attribute-id locator)"
        status: pass
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-06-overlay--menu--matrix|playground axe clean (serious/critical) + 44px + keyboard-reachable"
        status: pass
    human_judgment: false
  - id: M2
    description: "Tabs — Ark Tabs roving tabindex: ArrowRight rotates the active tab, exactly one tab in the page tab order, the active tab carries aria-selected + cyan PAIRED with a border-primary underline (never color-alone), the focused tab's ring is visible on its own box (2.4.12 unclipped); panels aria-associated"
    requirement: "KIT-06"
    verification:
      - kind: e2e
        ref: "tests/keyboard.spec.ts#KIT-06 Tabs roving tabindex (Plan 03-06 GREEN) — ArrowRight rotates the active tab + one tabbable + focus-ring-on-own-box (2.4.12) + structural-underline-not-color-alone"
        status: pass
      - kind: unit
        ref: "src/shared/uikit/Tabs/tabs.test.ts — cyan PAIRED with the structural marker, reserved transparent slot, ≥44px, the ONE canonical visible ring"
        status: pass
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-06-overlay--tabs--matrix|playground axe clean + 44px"
        status: pass
    human_judgment: false
  - id: M3
    description: "Tooltip — Ark Tooltip focus+hover: appears on focus as well as hover, drops the animation under prefers-reduced-motion, never the only carrier of meaning (paired with a visible label), not a label substitute; forced-open axe cell"
    requirement: "KIT-06"
    verification:
      - kind: unit
        ref: "src/shared/uikit/Tooltip/tooltip.test.ts — motion-reduce drop + transform/opacity-only (CLS 0) + tokenised surface (no arbitrary values)"
        status: pass
      - kind: automated_ui
        ref: "tests/catalog.spec.ts#kit-06-overlay--tooltip--matrix|playground axe clean + 44px"
        status: pass
    human_judgment: true
    rationale: "That the tooltip is never the ONLY carrier of meaning (the visible label stands alone) and the reduced-motion behaviour read correctly in-browser is a design-review judgment the axe/44px gate does not assert."

# Metrics
duration: ~12min
completed: 2026-06-25
status: complete
---

# Phase 03 Plan 06: KIT-06 Menu + Tabs + Tooltip Summary

**The second overlay-family slice group — `Menu` (trigger menu: Ark-owned aria-expanded/controls + roving highlight + Esc + no-trap, ≥44px items, the highlighted item cyan + surface-3 never color-alone), `Tabs` (roving-tabindex set: arrow-key rotation, the active tab cyan PAIRED with a border-primary underline, the focused tab's ring unclipped under a sticky bar per 2.4.12, panels aria-associated), and `Tooltip` (focus+hover, reduced-motion, never the only meaning carrier) — each a thin tv()-per-Ark-part recipe + data-* hooks + controlled props. Turns the Wave-0 Menu aria-expanded/controls + Tabs roving-tabindex RED keyboard specs GREEN and COMPLETES the KIT-06 overlay family.**

## Performance

- **Duration:** ~12 min
- **Completed:** 2026-06-25
- **Tasks:** 3
- **Files:** 14 created, 3 modified

## Accomplishments
- Built `Menu` over Ark Menu (Root/Trigger/Positioner/Content/Item) — Ark owns aria-expanded/aria-controls, the roving keyboard highlight (arrow/Home/End/type-ahead/wrap), Esc-close and the no-trap dismiss; the slice adds the per-part tv() recipe (popover surface-1 + border-2 + rounded-lg + --shadow-md, ≥44px items with surface-3 hover, the `data-[highlighted]` item cyan + surface-3 fill — never color-alone), the `data-menu`/`data-menu-trigger` hooks, controlled `open`/`onOpenChange` + uncontrolled `defaultOpen`, lazyMount + unmountOnExit. Typed `MenuItemData` items; i18n-free.
- Built `Tabs` over Ark Tabs (Root/List/Trigger/Indicator/Content) — Ark owns the arrow roving tabindex (exactly one tab in the page tab order), Home/End, and the panel aria-association; the active trigger is cyan (`text-primary`) PAIRED with a `border-primary` underline on the same `data-[selected]` state (never color-alone), the resting trigger reserves a transparent underline slot (CLS 0), and the canonical `focus-visible:shadow-(--shadow-ring)` keeps the focused tab visible and unclipped under a sticky bar (WCAG 2.4.12). Controlled `value`/`onValueChange` + panels keyed by value; typed `TabData`; i18n-free.
- Built `Tooltip` over Ark Tooltip (Root/Trigger/Positioner/Content) — appears on focus AS WELL AS hover (Ark default), drops the animation under `prefers-reduced-motion`, ships no arbitrary-value arrow, and is documented as NOT a label substitute and never the only carrier of meaning. The story pairs it with a visible Button label. Controlled `open` + uncontrolled `defaultOpen`; i18n-free.
- Pinned two pure-logic recipe contracts: `tabs.test.ts` (cyan-active paired with the structural underline never color-alone, the reserved transparent slot, ≥44px, the ONE canonical visible ring) and `tooltip.test.ts` (reduced-motion drop, transform/opacity-only, tokenised surface).
- Turned the Plan-03-01 Menu (aria-expanded/controls) + Tabs (roving-tabindex) Wave-0 RED blocks GREEN, and added the Tabs focus-not-obscured (2.4.12) + cyan-not-alone underline oracles (mirroring the Table GAP-10 inset-ring check).
- Graduated `Menu` + `Tabs` + `Tooltip` (+ `MenuItemData`/`TabData`) into the barrel — this COMPLETES the KIT-06 overlay family (Dialog, Popover, Menu, Tabs, Tooltip).

## Task Commits

1. **Task 1: Menu — Ark Menu per-part recipe, aria-expanded/controls, ≥44px items, cyan active** — `1796c32` (feat)
2. **Task 2: Tabs + Tooltip — roving-tabindex tab set + focus/hover reduced-motion tooltip** — `6f5a0e4` (feat)
3. **Task 3: Menu/Tabs/Tooltip stories (forced-open), barrel, Menu+Tabs keyboard specs GREEN** — `f4ab6ee` (feat)

## Decisions Made
- **Ark owns all Menu/Tabs/Tooltip a11y.** The slice is purely the tv() recipe + data-* hooks + controlled props; the only `asChild` use is slotting the shared Button into the Menu/Tooltip trigger (the canonical ring + ≥44px floor), never `asChild` for styling.
- **Cyan is never color-alone.** The Menu-highlighted item pairs cyan with a surface-3 fill; the active Tabs trigger pairs cyan with a `border-primary` underline — both ride the same Ark data-attribute so the marker can never be dropped leaving colour alone.
- **The Tabs underline is a reserved transparent slot** (`border-b-2 border-transparent`) so selecting a tab swaps the border colour, not the trigger height — CLS stays 0.
- **No Tooltip arrow** (the Popover precedent) — its Ark size/bg/border are raw-literal CSS custom props that would breach no-arbitrary-values; the anatomy slot is held empty (YAGNI).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Toolchain] `tsc --noEmit` verify step is not available in this repo**
- **Found during:** all `<verify>` blocks (Tasks 1–3)
- **Issue:** the plan calls `pnpm --filter @solid-stats/design exec tsc --noEmit`, but this repo has no `typescript`/`tsc` — the gate is Vite+ (`vp check`, fmt + lint, no type-check stage). This is the same toolchain mismatch the 03-05 SUMMARY recorded.
- **Fix:** used `pnpm exec vp check packages` + wrote types by construction; ran `pnpm --filter @solid-stats/design test` (unit) + `ladle:build` + the Playwright keyboard/catalog e2e.
- **Verification:** `vp check` green (161 files formatted, 154 lint-clean); 173 unit tests pass; `ladle:build` green; KIT-06 Menu/Tabs e2e GREEN.
- **Committed in:** n/a (process adjustment)

**2. [Rule 2 - Missing critical] New i18n keys for the Menu/Tabs/Tooltip story copy**
- **Found during:** Task 3 (stories)
- **Issue:** the menu trigger/item labels, the tab labels + panel bodies, and the tooltip trigger/content are required story copy the catalog did not yet carry. (`strings.ts` was not in `files_modified`, but the same Rule-2 pattern the 03-05 plan used — story copy is critical functionality the stories cannot render without.)
- **Fix:** added `menuTrigger`/`menuItemView`/`menuItemCompare`/`menuItemLongest`/`tabsLabel{Overview,Matches,Squads}`/`tabsPanel{Overview,Matches,Squads}`/`tooltipTrigger`/`tooltipContent` to STRINGS (RU primary / EN parity) — they flow into both runtime catalogs + the typed-key union via the existing derive.
- **Verification:** the `_i18n` catalog parity + key-set + no-drift tests pass (173 unit total).
- **Committed in:** `f4ab6ee` (Task 3 commit)

**3. [Rule 1 - Test bug] The Menu keyboard spec used a `#id` locator that breaks on Ark-v5 colon ids**
- **Found during:** Task 3 (running the Menu keyboard block — first run RED)
- **Issue:** the Plan-03-01 RED scaffold located the menu panel via `page.locator(\`#${controlsId}\`)`, but Ark v5 ids carry `:` colons (`menu:_r_0_:content`) which are not a valid CSS id selector — `querySelectorAll` threw. (The Select block already documents + uses the attribute-id workaround.)
- **Fix:** switched to the attribute-id locator `page.locator(\`[id="${controlsId}"]\`)` (the Select-block precedent). Same class of defect, same fix.
- **Verification:** the Menu block passes; aria-expanded false→true + aria-controls→live-panel both GREEN.
- **Committed in:** `f4ab6ee` (Task 3 commit)

**4. [Rule 1 - Test robustness] The Tabs roving-tabindex spec did not arm Ark's roving focus, and raced the move under parallel load**
- **Found during:** Task 3 (Tabs keyboard block — passed in isolation, RED under the full parallel suite)
- **Issue:** a bare Playwright `.focus()` on the first tab lands DOM focus but does NOT register the tablist's roving entry in Ark, so the subsequent ArrowRight no-opped (the active tab stayed `Обзор`). Even after arming via `.click()`, a synchronous read raced the selection move (the controlled story re-renders a frame after `onValueChange`) under parallel-load.
- **Fix:** click the first tab to arm Ark's roving tracker, poll the focused+selected state to settle before ArrowRight, and poll the selected-tab text after — the race-free pattern (the overlay focus-settle idiom from Plan 03-05), no fixed sleeps. Diagnosed live with a throwaway probe (click+arrow moved `Обзор`→`Матчи`); probe removed before commit.
- **Verification:** the Tabs block passes 9/9 across `--repeat-each=3` and in the full parallel suite.
- **Committed in:** `f4ab6ee` (Task 3 commit)

### Out-of-scope discovery (NOT fixed)

**The `cls.spec.ts` AsyncBoundary Wave-0 RED scaffold still fails** (SURF-18, Wave 7) — `all six states reserve the same box height as the ready slot`. This is the pre-existing RED-by-design scaffold the plan + the execute prompt explicitly say NOT to touch until Wave 7; `cls.spec.ts` is untouched by this plan. The known timing-sensitive Select arrow-nav `End` flake did NOT recur in the final runs (no `--repeat-each` rescue needed).

---

**Total deviations:** 4 auto-fixed (1 Rule 3 toolchain, 1 Rule 2 copy, 2 Rule 1 test fixes) + 1 expected out-of-scope RED (AsyncBoundary, untouched).
**Impact on plan:** no scope creep — all changes stayed inside `files_modified` plus `strings.ts` (the Rule-2 story copy, the 03-05 precedent) and this SUMMARY; the threat model's T-03-06-01/02 (author-controlled fixtures, tooltip-never-the-only-meaning) hold verbatim.

## Issues Encountered
- **Ark v5 roving focus needs a real focus-entry, not a bare `.focus()`.** Ark's Tabs roving tracker arms when focus genuinely enters the tablist (a click / a Tab-into), not on a programmatic `.focus()` — diagnosed live with a throwaway probe (click→ArrowRight moved the tab; `.focus()`→ArrowRight did not). Resolved in the spec with click-to-arm + focus-settle polling; the component is correct (live keyboard ArrowRight rotates the tab). Throwaway probe removed before commit.

## Known Stubs
None — Menu, Tabs, Tooltip are fully wired over Ark; story fixtures are author-controlled presentational copy (v0.1 Ladle, no network/server-2). The tooltip is a presentational supplement (paired with a visible label) by design.

## Threat Flags
None — no new network endpoint, auth path, or trust boundary. Portals mount to `document.body` (a structural/styling note, not a security surface); story strings are JSX-auto-escaped author fixtures (T-03-06-01 accept). T-03-06-02 (tooltip never the only meaning carrier) is satisfied as planned. T-03-SC (npm installs) — no installs this plan.

## Next Phase Readiness
- KIT-06 overlay family is COMPLETE (Dialog, Popover, Menu, Tabs, Tooltip graduated). Plan 03-07 (Wave 7) lands the AsyncBoundary / global-state patterns — its `cls.spec.ts` Wave-0 RED scaffold stays RED by design until then.
- The cyan-active-paired-with-a-structural-marker recipe and the Tabs roving-tabindex Playwright oracle are the reusable patterns for any future active/selected control + Ark roving widget.

## Self-Check: PASSED
- All 14 created files present on disk; all 3 task commits (`1796c32`, `6f5a0e4`, `f4ab6ee`) in git history; no debug artifacts left in the tree (the throwaway Tabs probe was removed before commit).

---
*Phase: 03-uikit-interactive-i18n-global-state-patterns*
*Completed: 2026-06-25*
