---
status: verified
phase: 03-uikit-interactive-i18n-global-state-patterns
source: human UAT (visual pass — KIT-05 / KIT-06 / SURF-18) + independent source verification (4 design-review agents, 2026-06-25)
captured: 2026-06-25
verified: 2026-06-25
note: |
  Each human finding was re-checked against the actual component/recipe/story source through the
  design-review skill (SKILL + checklist + conventions references). Verdicts below are the verified
  outcome, NOT the raw report. Kept separate from 03-UAT.md while quick task 260625-t1o (type-aware
  gate) was unmerged in a worktree; fold into 03-UAT.md Gaps + plan a gap-closure batch after it merges.
---

# Phase 03 — verified UAT findings (KIT-05 / KIT-06 / SURF-18)

Verdict legend: CONFIRMED · REFUTED (doesn't hold vs source) · PARTIAL · ALREADY-HANDLED · SPEC-OMISSION (not specced; enhancement) · SCOPE-V1.0.

## Runtime verification (browser pass, Ladle @ :61000) — OVERRIDES the source pass where they differ

The source pass (4 agents reading code) was partly wrong about animation — corrected here by an actual browser pass with measurements. `prefers-reduced-motion` in the test browser = **false**, so animation absence is real, not a reduced-motion artifact.

- **Entrance animations DO NOT play at runtime — D2/M1/P1/T1/TM4 are CONFIRMED, not refuted.** The recipe classes exist, but the overlay content mounts directly in `data-state="open"` (opacity 1 / transform none on mount; the closed→open frame is never rendered). Likely root cause: a mount-time enter transition needs `@starting-style` (Tailwind `starting:` variant) or Ark's present/animation API — not just `data-[state=closed]:` from-state classes. (My stylesheet enumeration via `cssRules` is unreliable here — the Tailwind sheet is CORS-opaque — so trust the visual/behavioral evidence + the human's observation, not "the class is in the source".) Fix once, system-wide.
- **A1 — corrected framing (the "40→234 spread" was wrong: it mixed block types).** The status BANNERS (offline/reconnecting/stale = 40px) are a different block role and must NOT be height-compared to the content region — the SURF-18 spec line "all six states the same reserved height as ready" over-claimed and is itself a defect to fix. The meaningful CLS-equality set is the content-region states only: **LoadingTable 203 / Empty 222.5 / Error 234 / ReadyTable 202** (measured). So: (a) loading↔ready = the real **1px** the human caught (Skeleton framed-card hairline vs the story's hand-rolled ready table); (b) empty (222.5) and error (234) also diverge from ready (202) by 20–32px — open question whether empty/error should reserve the table region's min-height for CLS=0 or are intentionally content-sized. Separately, the `cls` story/test cages everything in `h-64` and measures the cage → false-green; the test must measure the routed `[data-async-boundary]` primitive within the content-region group, and the spec's "all six same height" claim must be re-scoped to the content-region states.
- **S1 RE-SCOPED → CONFIRMED [major].** The human meant the OPEN MENU (listbox) with zero options, not the trigger placeholder. Runtime: the empty-options content renders `optionCount:0`, `innerText:""` — an empty listbox with NO empty-state node (no "ничего нет" message, no icon), so an opened empty Select is ~10px of blank padding. (The trigger placeholder "Выберите…" is fine and separate — that part is refuted.) FIX: render a first-class empty-state row inside the listbox when options are empty (message + icon, never blank).
- **S7 (NEW, CONFIRMED):** Select has no `ClearTrigger` rendered (`hasClearTrigger:false`, only the trigger button) — a selected value cannot be reset/cleared.
- **TM1 escalated:** not just "no gap at rest" — the human confirms hovering does NOT fan the overlapped stack out either, so `overlap:true` is effectively broken stacking, not a deliberate fan-out-on-hover. Treat as a real defect.
- I1/S5 (360 overflow): could not reproduce via OS-window resize (Ladle min window ~500); the `w-90`+`p-4`=392 arithmetic + the human screenshots stand → minor, story-wrapper.
- **ST1 RE-VERIFIED → CONFIRMED [major].** Runtime: clicking "Увеличить" on the Stepper Playground leaves the value at 10 (spinbutton + input both unchanged) — the Playground is controlled by the `value` arg with no `onValueChange`/internal state, so inc/dec/keyboard are no-ops and UX can't be exercised. The source pass refuted this wrongly (saw a "Playground" with argTypes, assumed interactive). FIX: give the Playground real `useState` so inc/dec/keyboard mutate the displayed value.
- **S2 CONFIRMED ALREADY-HANDLED at runtime.** Appending a long option grows the open content beyond the trigger (`grewWithLongOption:true`, `min-width` = reference, `max-width:none`). Caveat [minor]: with `max-width:none` a very long option can overflow the viewport at the 360 floor — add a viewport-aware `max-width` cap.
- **S3 RE-VERIFIED → REFUTED (typeahead works).** Opened the interactive Playground Select (focus on content), dispatched key "м" → "Малден" became `data-highlighted`. Ark/Zag typeahead is live. The human couldn't exercise it because the forced-open Matrix cell isn't focused; in the real interactive Playground it works. No fix (optional: a brief note/test so UAT can see it).
- **TM1/TM4 RE-VERIFIED → CONFIRMED [major].** Fired 4 toasts: rendered flush (heights 70px, tops 504/574/644/714, **gaps [0,0,0]**), `transform:none`, `transitionDuration:0s` on every toast. The group declares `--gap:12px` + `overlap` but the items apply neither the gap nor the overlap transforms — so there is no at-rest spacing, no enter/exit animation, and (because the overlap transform mechanism is never engaged) nothing to fan out on hover. Auto-dismiss does fire (toasts disappear after their duration), so TM3 is specifically "no VISIBLE time-to-expiry", not "never expires".
- **The 360px overflow is a STORY-wrapper bug, not a component bug** — `w-90` (360) inside the story root `p-4` (32) = 392px in a 360 viewport. The controls themselves are `w-full` fluid. One class fix (`w-90` → `w-full max-w-90`) across the four KIT-05 stories resolves I1 + S5.
- **Two "blockers" split:** A2 (language toggle) is a CONFIRMED real blocker. A1 (AsyncBoundary 1px) is real but downgraded to major — the leaf is correct; the story fixtures + the CLS test are the defect, and the test is false-green.

## Blockers

- **GAP-A2 [blocker — SC#2/UAT#2] CONFIRMED.** The RU↔EN toggle never renders. `config.mjs` declares it as `addons.control.defaultState.locale`, but in Ladle 5.1.1 `addons.control.defaultState` is read in exactly ONE place (`history.ts` URL cleanup) and is NEVER seeded into `globalState.control` — that object is populated only from the CURRENT story's own `args`/`argTypes` and is wiped on every story switch. So `globalState.control.locale` is always `undefined` → `toLocale` falls back to `ru` → EN is unreachable from the UI. Structural verification missed it because `components.tsx` wiring (toLocale/activate/I18nProvider) is correct — but nothing ever creates the control it reads. FIX: a real persistent control — a custom toolbar addon, or read a `?locale=` query param in the `GlobalProvider` (keep `toLocale` + the `useEffect` activate). Verify on a no-args story (`smoke--tokens`). No re-research needed; the Ladle source is conclusive.
- **GAP-FU5-as-observed [blocker] → REFUTED-as-stated, but real symptom.** Accepted files DO have a remove control (`ArkFileUpload.ItemDeleteTrigger`, FileUpload.tsx:149). The human couldn't remove one because the Matrix story is controlled (`acceptedFiles={files}` with no `onFileChange`, so Ark's delete reducer can't mutate the fixture) AND the duplicate-preview/off-system button (FU3/FU1) made the row confusing. FIX is FU3+FU1 + a live Playground that actually drops a file; not a missing-control fix.

## 05 — KIT-05 form family

- **GAP-F1 [major] CONFIRMED.** Required field has no visible marker — `required` only sets `aria-required`; the specced `fieldRequired` copy (03-UI-SPEC.md:142) is never consumed (Field.tsx:61). Worse than color-alone — nothing-alone. FIX: render a required affordance in the label (visible `*` + visually-hidden "required", or the copy string), never the asterisk in color alone.
- **GAP-F2 [minor] PARTIAL.** Label vs caption differ by weight/uppercase/tracking (on-spec, field.ts:21-24) but share the same `text-muted` color, so they read similarly. Spec forbids `text-subtle` for meaningful copy, so darkening is a DESIGN.md token decision, not an arbitrary value. Low priority.
- **GAP-I1 [minor, was major] CONFIRMED (story-harness).** Input is `w-full` (fluid, safe); overflow is `w-90`+`p-4`=392px in the 360 story wrapper (Input.stories.tsx:57). FIX: `w-full max-w-90` on the wrappers — shared class fix across the four KIT-05 stories.
- **GAP-S1 [—] REFUTED.** Empty Select renders placeholder text (`ValueText placeholder`, required prop) + chevron (Select.tsx:84-85). Likely confused with the empty-data cell.
- **GAP-S2 [—] ALREADY-HANDLED.** Menu is `min-w-(--reference-width)` (trigger width) and grows for long options, height-bounded `max-h-64` (select.ts:36). Optional: viewport `max-w` cap at 360.
- **GAP-S3 [—] REFUTED.** Typeahead is a default-on Zag Select behavior; nothing disables it. UAT couldn't exercise it because the forced-open Matrix cell isn't focused. (A future filtered ComboBox is separate.)
- **GAP-S4 [minor] CONFIRMED.** `MANY_OPTIONS` = 6 (Select.stories.tsx:25) — doesn't exercise `max-h-64` scroll/typeahead. FIX: ~50–100 generated options.
- **GAP-S5 [minor, was major] CONFIRMED.** Same `w-90`+`p-4` story-wrapper overflow as I1; trigger is `w-full`. Same shared fix.
- **GAP-ST1 [—] REFUTED.** Stepper ships a controlled interactive `Playground` (inc/dec, ArrowUp/Down, min/max clamp — Stepper.stories.tsx:70-89). Nit: Playground arg has no `onValueChange` two-way bind, but keyboard/inc/dec work.

## 06 — KIT-06 overlay family

- **GAP-D1 [major] CONFIRMED.** Not padding (`p-6` is on-spec). Root cause: `CloseTrigger` is the FIRST flex child (`self-end`, 44px) occupying its own row ABOVE the title in the `flex-col gap-4` stack (Dialog.tsx:80-83) → ~44px+gap of dead space on top. FIX: position the close button in the content's top-right corner (don't let it consume a leading row); keep `p-6`/`gap-4`, tokens only.
- **GAP-D2 / M1 / P1 [—] REFUTED.** Dialog/Menu/Popover all ship scale+opacity entrance keyed on Ark `data-[state]` + `motion-reduce:` (dialog.ts:35, menu.ts:33, popover.ts:31). If static at runtime → a build-scan / OS reduced-motion artifact; RE-CHECK at runtime, don't re-implement.
- **GAP-T1 [minor] CONFIRMED / SPEC-OMISSION.** Tabs underline toggles `border-color` only (no slide); never specced; CLS-safe. The Ark `Indicator` slot (tabs.ts:32) is rendered but unsized = dead slot. FIX (optional): drive the Indicator with a transform-only slide under `motion-safe:`; or remove the dead slot.
- **Cross-cutting [minor] motion-token bypass (NEW).** Every overlay hardcodes `duration-150` (not even an emitted token) instead of `duration-(--duration-base) ease-(--ease-out)` (dialog/menu/popover/tooltip recipes). This is the genuine cross-cutting motion finding — fix the class once.

## 07/18 — Toast + AsyncBoundary

- **GAP-TM1 [minor, was major] REFUTED-as-stated.** `gap: 12` IS configured; `overlap: true` (ToastManager.tsx:40) intentionally collapses the stack at rest and fans out on hover/focus. Decide: `overlap:false` for always-spaced, or document fan-out-on-hover as intended.
- **GAP-TM2 [minor] CONFIRMED.** `max: 4` with no "+N more" surface. A FIFO cap is standard for transient toasts — confirm scope before adding a counter.
- **GAP-TM3 [minor] CONFIRMED.** No time-to-expiry affordance. FIX (if in scope): transform/opacity-only progress from Ark's `duration` (never animate width as layout), CLS=0.
- **GAP-TM4 [minor] CONFIRMED.** Toast root has no enter/exit transition and no `motion-reduce` (Toast.tsx:96) — the one family genuinely missing animation. Fold into the motion policy.
- **GAP-A1 [major, was blocker] CONFIRMED — and the test is false-green.** The leaf AsyncBoundary "adds no height of its own" (correct). The defect: the Cls story cages every state in `h-64` (256px) wrappers, and `cls.spec.ts` measures THOSE wrappers — so equality passes trivially and never checks the routed primitives. The real 1px: the framed `Skeleton` table (44+1+3×52 +2 border = 203) vs the story's hand-rolled `readyContent` table (202) differ by one hairline; Skeleton was tuned to the real KIT-02 `Table`, never to this story's fixture. FIX (two parts): (1) `readyContent()` must reuse the real `Table`/Skeleton geometry so loading≡ready byte-for-byte; (2) the test must measure `[data-async-boundary]` (the routed primitive), not the `h-64` cage, and assert loading-vs-ready equality across ALL states.

## NEW defects surfaced by verification (human didn't list)

- **FileUpload FU1 [major]** retry + delete row controls are hand-rolled `<button>` duplicating the `control` recipe's hit-area/ring (`itemDeleteTrigger` in fileUpload.ts) instead of routing through `Button` — and not catalogued in Base→Button. Route through `Button` (icon-only variant), delete the duplicate recipe.
- **FileUpload FU3 [major]** image upload renders TWO previews — `<ItemPreview type="image/*">` AND `<ItemPreview type=".*">`; `.*` is a catch-all that also matches images (Ark has no negative filter). OUR bug. Branch the fallback on `file.type` so it never co-renders with the image.
- **FileUpload [minor]** `itemGroup` has no capped-window/scroll-in-card → ~30 files grow unbounded (masked by the 3-file fixture, GAP-FU6); `itemStatus` recipe slot is dead code; `disabled` is not forwarded to row controls (dead `data-[disabled]` branch + removable while disabled).
- **AsyncBoundary [minor a11y]** the `loading` state wraps an `aria-hidden` Skeleton with no `aria-live`/`role=status` → screen-reader silence during load.
- **ToastManager [minor]** `message()` coerces a non-string title to `""` → an icon-only toast with no text (color/icon-alone); no `aria-live` grouping around the viewport for rapid bursts.
- **Field [minor a11y]** `helperText` is not linked to the control via `aria-describedby` (only the error is, via Ark).

## SCOPE-V1.0 (reserve, don't build now)

- **GAP-FU4** full image lightbox/preview — not specced; at v0.1 keep the thumbnail legible, defer expand to v1.0 (could reuse `Dialog`).
- **GAP-FU7** server-sync state model (ожидает синхронизации / идёт / ожидает после удаления / синхронизировано) — v1.0 wiring, BUT the four-state vocabulary is NOT yet in the data-trust token/i18n set. Reserve the i18n keys + reuse the dead `itemStatus` slot now so v1.0 composes.
- **GAP-A2-DX** make the (fixed) language toggle discoverable — naturally resolved once A2 is a real toolbar control.
