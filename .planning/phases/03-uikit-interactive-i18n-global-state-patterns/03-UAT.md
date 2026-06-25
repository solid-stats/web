---
status: issues
phase: 03-uikit-interactive-i18n-global-state-patterns
source: [03-VERIFICATION.md, 03-UAT-VISUAL-FINDINGS.md]
started: 2026-06-25T09:01:43Z
updated: 2026-06-25
---

## Current Test

complete — all 5 tests adjudicated (test 1 passed; tests 2–5 found issues, captured as GAP-01..17 below).

## Tests

### 1. SC#4 typed-key gate (KIT-08)
expected: |
  The `lingui.d.ts` `Register { messageIds: keyof typeof STRINGS }` augmentation makes a
  missing/misspelled message id a compile error. Because `vp check` is oxlint+oxfmt only
  (no type-aware checker; the repo has no `tsc` per the Phase-1 toolchain decision), this
  must be confirmed by a type-aware run. Introduce a bad id (e.g. in a `.stories.tsx` or a
  `_fixtures/bad-id.ts`) and run a type-aware check (`tsgolint`, an oxlint typeCheck pass,
  or a `tsc --noEmit` if added). Expect a type error on the unknown id; no silent pass.
  Decision to record: whether to wire a permanent CI type-aware gate (tsgolint is already in
  node_modules/.bin) + a `@ts-expect-error` regression oracle, or accept SC#4 as structural-only.
result: passed
resolution: |
  RESOLVED — the permanent CI type-aware gate was wired (quick task 260625-t1o). The root
  `vite.config.ts` `lint.options.typeCheck:true` makes `pnpm check` (and CI) run the full
  TS-Go/tsgolint type check, so a missing/misspelled `i18n._({ id })` is now a hard error.
  Activating it surfaced 33 real latent type errors; all were fixed as classes and the repo
  is type-clean (`pnpm check` exits 0). A committed `@ts-expect-error` regression oracle
  (`packages/design/src/shared/uikit/_i18n/typed-key.oracle.ts`) guards the contract: it is
  GREEN while the augmentation holds and turns RED (unused-directive, TS2578) if the id ever
  widens back to `string` — proven live (flip-to-real-key → RED, restore → GREEN). CI
  (`.github/workflows/check.yml`) runs `pnpm check` on every push + pull_request. Decision:
  a PERMANENT CI type-aware gate, NOT structural-only.

### 2. Bilingual toggle — every story renders RU↔EN (SC#2, QUAL-05)
expected: |
  In `ladle dev`, the `locale` global control toggles RU↔EN and EVERY catalogued story
  re-renders in the chosen language (default RU). No clipped or awkward RU wording; the
  RU-longest strings (e.g. the FileUpload dropzone prompt) fit at the 360px mobile floor.
result: issues
gaps: [GAP-01]

### 3. KIT-05 form family — visual design-review pass (QUAL-01/02/03)
expected: |
  Field (visible label + inline aria-live error + CircleAlert icon), Input, Select (cyan
  active option paired with the check indicator), Stepper (tabular-mono value, ≥44px
  inc/dec), FileUpload (focusable dropzone + Browse, per-file accepted/rejected rows, SVG
  rejected with a why+fix message) all read correctly: consistent recipe, visible focus
  rings, ≥44px hit targets feel right, never color-alone, RU-longest fits at the 360 floor.
result: issues
gaps: [GAP-05, GAP-06, GAP-07, GAP-09, GAP-10, GAP-11, GAP-12, GAP-13, GAP-14, GAP-15]

### 4. KIT-06 overlay family — visual design-review pass (QUAL-01/03/04)
expected: |
  Dialog (scrim + focus trap + return-focus + Esc + the destructive-confirmation pattern),
  Popover (non-modal, no trap), Menu (cyan active item, ≥44px), Tabs (cyan active tab paired
  with the underline, no layout shift on selection — CLS=0), Tooltip (focus+hover, respects
  reduced-motion, never the only meaning carrier) all behave and look correct on keyboard
  and pointer, bilingually.
result: issues
gaps: [GAP-02, GAP-08, GAP-16]

### 5. SURF-18 — AsyncBoundary + ToastManager visual pass (QUAL-01/04)
expected: |
  AsyncBoundary renders all six states (loading/empty/error/offline/reconnecting/stale) by
  reusing the existing Phase-2 primitives, with the same reserved box height as the ready
  slot (no layout shift — CLS=0). ToastManager stacks, auto-dismisses, and every dismiss
  control has a visible/accessible name (no unnamed ✕).
result: issues
gaps: [GAP-03, GAP-04]

## Summary

total: 5
passed: 1
issues: 4
pending: 0
skipped: 0
blocked: 0
gaps_total: 17
gaps_open: 17

## Gaps

> Source: human visual UAT of KIT-05 / KIT-06 / SURF-18 (tests 2–5), each finding re-verified against source
> (4 design-review agents) and the contested ones re-verified live in-browser at Ladle :61000. Full evidence +
> per-finding verdicts (incl. REFUTED) in `03-UAT-VISUAL-FINDINGS.md`.
> Close via `/gsd-plan-phase 3 --gaps` → `/gsd-execute-phase 3 --gaps-only`, with a re-run in-browser design-review.
>
> VERIFIED-WORKING (do NOT touch): Select typeahead (S3 — Ark built-in; the EN-keyboard-vs-RU-options confusion),
> Select menu grows wider than trigger for long options (S2 — `min-w` + `max-w:none`), Select trigger placeholder.

### GAP-01 — RU↔EN language toggle never renders; EN is unreachable from the UI (SC#2 fails)
status: open
severity: high
requirements: [KIT-08, QUAL-05]
evidence: |
  `config.mjs` declares the toggle as `addons.control.defaultState.locale`, but in Ladle 5.1.1
  `addons.control.defaultState` is only a per-STORY args seed — it is never injected into
  `globalState.control` (which is built from the active story's own args and wiped on each story switch).
  So `globalState.control.locale` is always undefined → `components.tsx` `toLocale` falls back to `ru`
  forever. Runtime-confirmed: the Controls panel shows only a story's own args (e.g. AsyncBoundary `kind`),
  no global "Language" control; on a no-args story it is empty. Structural verification missed this because
  the `components.tsx` wiring (toLocale/activate/I18nProvider) is correct — nothing ever creates the control.
fix: |
  Replace the `control.defaultState.locale` declaration with a real persistent control: a custom Ladle
  toolbar addon, OR read a `?locale=` query param directly in the `GlobalProvider` (keep the `toLocale`
  guard + the `useEffect` `i18n.activate`). Verify the toggle shows on a no-args story (`smoke--tokens`)
  and that flipping it re-renders EVERY story bilingually.

### GAP-02 — Overlay/Toast entrance animations do not play at runtime (dead `data-[state]` mount transition)
status: open
severity: high
requirements: [KIT-06, QUAL-01]
evidence: |
  User-observed + runtime-confirmed (`prefers-reduced-motion:false`): Dialog/Menu/Popover/Tabs/Toast show no
  entrance animation. The recipe classes (`transition duration-150 data-[state=closed]:scale-95/opacity-0`)
  exist, but the content mounts directly in `data-state="open"` (opacity 1 / transform none on mount) so the
  closed→open frame is never rendered. The source pass wrongly REFUTED this from "the class is present".
  Separately, the overlays hardcode `duration-150` (not even an emitted token) instead of the design-system
  motion tokens `--duration-base`/`--ease-out` (DESIGN.md Motion).
fix: |
  Make the mount enter-transition real for the whole family at once — `@starting-style` (Tailwind `starting:`
  variant) or Ark's present/animation API so the element renders a closed frame before flipping to open; also
  the exit. Route all overlay/Toast motion through the `--duration-*`/`--ease-*` tokens under `motion-safe:`
  with the `motion-reduce:` opt-out. Verify enter+exit actually animate in-browser.

### GAP-03 — AsyncBoundary CLS not 0 across content-region states; the CLS test is false-green
status: open
severity: high
requirements: [SURF-18, QUAL-04]
evidence: |
  Measured intrinsic heights of the content-region states (the comparable set): LoadingTable 203 / Empty 222.5
  / Error 234 / ReadyTable 202 — loading↔ready off by 1px, empty/error off by 20–32px. The status BANNERS
  (offline/reconnecting/stale = 40px) are a DIFFERENT block role and must NOT be height-compared (the SURF-18
  spec line "all six states the same reserved height as ready" over-claimed and is itself a defect). The `cls`
  story cages every state in `h-64` and `cls.spec.ts` measures the cage → equality passes trivially
  (false-green). The 1px is the framed Skeleton card hairline vs the story's hand-rolled ready table.
fix: |
  (a) Make `readyContent()` reuse the real KIT-02 `Table`/Skeleton geometry so loading≡ready byte-for-byte,
  and decide whether empty/error must reserve the content-region min-height for CLS=0; (b) rewrite the test to
  measure the routed `[data-async-boundary]` primitive within the content-region group, not the `h-64` cage;
  (c) re-scope the spec's "all six states same height" claim to the content-region states (banners excluded).

### GAP-04 — ToastManager: flush stacking (no gap), overlap/fan-out broken, no expiry indicator
status: open
severity: high
requirements: [SURF-18, QUAL-01]
evidence: |
  Runtime: fired 4 toasts → heights 70px, tops 504/574/644/714, gaps [0,0,0]; `transform:none`,
  `transitionDuration:0s` on every toast. The group declares `--gap:12px` + `overlap:true` but the items apply
  neither the gap nor the overlap transforms → no at-rest spacing, no enter/exit animation, and nothing to fan
  out on hover. Auto-dismiss DOES fire (so expiry works, but there is no visible time-to-expiry); `max:4` with
  no "+N more" overflow surface.
fix: |
  Make stacking real: either `overlap:false` with a proper flex `gap`, or wire Ark's overlap transforms so the
  stack offsets at rest and fans out on hover/focus. Add the enter/exit animation (shares GAP-02 motion policy).
  Decide scope for a visible time-to-expiry affordance (transform/opacity-only, CLS=0) and a "+N more" overflow.

### GAP-05 — FileUpload renders TWO previews for an image (our bug: `type=".*"` catch-all)
status: open
severity: high
requirements: [KIT-05]
evidence: |
  `FileUpload.tsx` renders `<ItemPreview type="image/*">` (the `<img>`) AND `<ItemPreview type=".*">` (the
  `ImageUp` fallback) as siblings. Ark filters by `file.type.match(props.type)`; `.*` is a catch-all that ALSO
  matches images, so both render for any image. Ark provides no negative filter — this is our misuse.
fix: |
  Render the non-image fallback only for non-image files — branch a single `ItemPreview`'s content on
  `file.type`, or gate the fallback so it never co-renders with the image preview.

### GAP-06 — FileUpload row controls are hand-rolled, duplicate the `control` recipe, and are not in the Button catalog
status: open
severity: medium
requirements: [KIT-05, KIT-07]
evidence: |
  The retry `<button>` and the Ark `ItemDeleteTrigger` use a bespoke `itemDeleteTrigger` recipe
  (`fileUpload.ts`) re-implementing the ≥44px hit area + focus ring that `control.ts` already owns; the square
  icon-buttons are not catalogued in Base→Button. (This off-system/confusing control is also why the human
  thought accepted files couldn't be removed — the delete control exists but reads as ambiguous.)
fix: |
  Add an icon-only size/variant to the shared `control`/Button recipe, catalog it in Button's StateMatrix, and
  route the retry + (via `asChild`) the Ark `ItemDeleteTrigger` through Button; delete the duplicate recipe.
  Also: forward `disabled` to the row controls (dead `data-[disabled]` branch today).

### GAP-07 — Field: required field has no visible required marker (and `fieldRequired` copy is unused)
status: open
severity: medium
requirements: [KIT-05, QUAL-03]
evidence: |
  `required` only sets `aria-required` on the Ark control — there is no visible `*`/marker, so a required field
  is indistinguishable from an optional one (worse than color-alone). The specced `fieldRequired` copy
  ("Обязательное поле"/"Required") exists but is never consumed.
fix: |
  Render a required affordance in the Field label (visible `*` + visually-hidden "required" text, or append the
  `fieldRequired` string), driven by the existing `required` prop; never the asterisk in color alone.
  Also link `helperText` to the control via `aria-describedby` (only the error is linked today).

### GAP-08 — Dialog: excessive empty space at the top (close button consumes a leading row above the title)
status: open
severity: medium
requirements: [KIT-06]
evidence: |
  Not padding (`p-6` is on-spec). The `CloseTrigger` (44px, `self-end`) is the FIRST flex child in the
  `flex-col gap-4` content stack, so it occupies its own row ABOVE the title → ~44px+gap of dead space on top.
fix: |
  Position the close button in the content's top-right corner (absolute within the content) so it does not
  consume a leading row; keep `p-6`/`gap-4` for the title/body. Tokens only.

### GAP-09 — Select: an empty listbox (zero options) renders nothing — no empty-state
status: open
severity: medium
requirements: [KIT-05]
evidence: |
  Runtime: the empty-options Select content has `optionCount:0` and empty `innerText` — opened, it is ~10px of
  blank padding with no "ничего нет" message and no icon. (Distinct from the trigger placeholder, which works.)
fix: |
  Render a first-class empty-state row inside the listbox when options are empty (message + icon, never blank).

### GAP-10 — Select: a selected value cannot be reset/cleared (no clear control)
status: open
severity: medium
requirements: [KIT-05]
evidence: |
  Runtime: the Select renders only the trigger button — no Ark `ClearTrigger` (`hasClearTrigger:false`). Once a
  value is chosen there is no way to clear it back to the placeholder.
fix: |
  Render Ark's `ClearTrigger` (with an accessible name) when a value is selected and the field is clearable;
  decide whether clearable is the default or an opt-in prop.

### GAP-11 — Stepper: the Playground is not interactive (value pinned, no state)
status: open
severity: medium
requirements: [KIT-05]
evidence: |
  Runtime: clicking "Увеличить" leaves the value at 10 (spinbutton + input unchanged) — the Playground is
  controlled by the `value` arg with no `onValueChange`/internal state, so inc/dec/keyboard are no-ops and UX
  cannot be exercised in the catalog.
fix: |
  Give the Playground real `useState` so inc/dec/keyboard mutate the displayed value (and clamp at min/max).

### GAP-12 — Input/Select story wrappers overflow the 360px floor (`w-90` + `p-4` = 392px)
status: open
severity: low
requirements: [QUAL-02]
evidence: |
  The controls are `w-full` (fluid, safe). The overflow is the story harness: the `w-90` (360) demo block sits
  inside the story root `p-4` (32) = 392px in a 360 viewport. Repeated across the KIT-05 stories.
fix: |
  Change the `w-90` demo wrappers to `w-full max-w-90` (or drop `w-90`) so 360 + padding ≤ viewport. Fix the
  class across all four KIT-05 stories.

### GAP-13 — FileUpload: unbounded row width, unrealistic "many" fixture, no scroll-in-card on the file list
status: open
severity: low
requirements: [KIT-05]
evidence: |
  The file name already truncates (`flex-1 truncate`), but the row container has no `max-w`/`w-full` bound, and
  `itemGroup` has no capped-window/scroll — a realistic list grows unbounded. The Matrix "many" fixture is only
  3 files (masks the unbounded-list defect); `itemStatus` recipe slot is dead code.
fix: |
  Constrain the row to its field width (`w-full` so truncate engages), cap `itemGroup` height with
  `overflow-y-auto`, and make the "many" fixture ~30 files. Remove or wire the dead `itemStatus` slot.

### GAP-14 — Field: caption barely distinct from the label (same color token)
status: open
severity: low
requirements: [KIT-05]
evidence: |
  Label and caption differ by weight/uppercase/tracking (on-spec) but share the same `text-muted` color, so
  they read too similarly. Spec forbids `text-subtle` for meaningful copy, so any change is a DESIGN.md token
  decision (a distinct caption color), not an arbitrary value.
fix: |
  Optional/low: if more separation is wanted, introduce a distinct caption color token in DESIGN.md; otherwise
  accept the spec-correct weight/case/tracking delta.

### GAP-15 — Select: long-option menu has no viewport max-width cap at 360
status: open
severity: low
requirements: [KIT-05]
evidence: |
  The menu correctly grows wider than the trigger for long options (verified — `min-w` + `max-w:none`), but
  with no `max-width` a very long option can overflow the viewport at the 360 floor.
fix: |
  Add a viewport-aware `max-width` cap to the listbox content so it never exceeds the 360 floor; keep the grow.

### GAP-16 — A11y / dead-code sweep surfaced during verification
status: open
severity: low
requirements: [QUAL-03]
evidence: |
  AsyncBoundary `loading` wraps an `aria-hidden` Skeleton with no `aria-live`/`role=status` (screen-reader
  silence during load); ToastManager `message()` coerces a non-string title to "" (icon-only, textless toast);
  Tabs `Indicator` slot is rendered but unsized (dead slot). (Field `aria-describedby` + FileUpload `disabled`
  forwarding are folded into GAP-07/GAP-06.)
fix: |
  Add a polite `aria-live`/status text to the AsyncBoundary loading state; guard ToastManager against empty
  titles; drive or remove the Tabs `Indicator` slot.

### GAP-17 — Deferred to v1.0 (reserve now, do not build)
status: open
severity: low
requirements: [KIT-05]
evidence: |
  FU4 (full image lightbox/preview) and FU7 (server-sync state model: ожидает синхронизации / идёт /
  ожидает после удаления / синхронизировано) are v1.0 app concerns — but the FU7 four-state vocabulary is not
  yet reserved in the data-trust token/i18n set, and the `itemStatus` slot is unused.
fix: |
  Do not build the lightbox/sync wiring now. DO reserve the FU7 i18n keys + reuse the `itemStatus` slot so v1.0
  composes rather than invents. Keep the v0.1 thumbnail legible.
