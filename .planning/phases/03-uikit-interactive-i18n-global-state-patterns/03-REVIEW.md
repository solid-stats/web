---
phase: 03-uikit-interactive-i18n-global-state-patterns
reviewed: 2026-06-25
depth: deep
reviewer: solidstats-frontend-react-code-review (gsd-code-reviewer)
scope: git diff 0d188e1..HEAD -- packages/design
files_reviewed: 67
findings:
  critical: 0
  warning: 4
  info: 7
  total: 11
status: fixes_applied
verdict: REQUEST CHANGES
fixes_applied:
  date: 2026-06-25
  resolved: [1, 2, 3, 4, 6]
  deferred: [5, 7, 8, 9, 10, 11]
  notes: >
    Findings 1–4 + 6 fixed and committed atomically (8488b58 require ToastManager
    dismiss name; 5fa8000 remove dead object-URL revoke seam — path (a), Ark owns the
    lifecycle; 646ca71 stable FileUpload row keys; 11bf190 isolate i18n activation in
    catalogs.test; 8517d78 guard Ladle locale union + activate in effect). Gates green
    after: vp check (fmt+lint) clean, 186 unit tests pass, ladle:build green, e2e 344
    passed / 0 failed. Findings 5, 7–11 (nice-to-haves per the verdict) deferred.
---

# Review — Phase 03 (UIKIT interactive + i18n + global-state), `git diff 0d188e1..HEAD -- packages/design`

**Scope:** all phase-03 source under `packages/design` — the KIT-08 Lingui i18n harness
(`_i18n/*`, migrated `_fixtures/strings.ts`), the KIT-05 form family (`Field` `Input` `Select`
`Stepper` `FileUpload`), the KIT-06 overlay family (`Dialog` `Popover` `Menu` `Tabs` `Tooltip`),
SURF-18 (`AsyncBoundary` + `ToastManager` + the modified `Toast`), the `src/index.ts` barrel,
the Ladle wiring (`.ladle/components.tsx`, `config.mjs`), `tsconfig.json` + `vite.config.ts`
Lingui workarounds, and the `keyboard`/`cls` e2e specs + colocated `*.test.ts`/`*.stories.tsx`.

**Gates (read-only static review — not executed; no browser/CI run available):**
- ✅ uikit i18n boundary: NO `_i18n`/`@lingui` import inside any `shared/uikit` primitive (verified
  every slice — copy arrives as plain string props resolved in the story). The one `i18n` import in
  `.ladle/components.tsx` and the `*.stories.tsx` is the sanctioned story-side resolution.
- ✅ Styling: `tv()` per Ark anatomy part, `className` per part, no `asChild` for styling (the only
  `asChild` uses slot the shared `Button` into an Ark trigger — sanctioned). No arbitrary Tailwind
  values found (the `shadow-(--var)` / `min-w-(--reference-width)` forms are the sanctioned
  CSS-var-utility escape, not `[...]` arbitrary values); `/lite` merge-free build used throughout.
- ✅ a11y: ≥44px floors (`min-h-11`/`min-w-11`) on every interactive trigger; icon-only controls take a
  caller-supplied `aria-label`; error/selection states paired with a Lucide icon/structural marker
  (never color-alone). One robustness gap on the public Toast seam — finding 1.
- ✅ Type-safety: `type` over `interface` (except the mandatory Lingui `Register` augmentation —
  correctly justified in-code); no `any`; no non-null assertions; `Select`/`Stepper` typed by value
  union; the two `as` casts (`as Catalog`, `next as TValue`) are safe-by-construction and commented.
- ⚠️ Cannot run `vp check` (tsgo/oxlint) or Playwright here — correctness judged statically. The
  SC#4 typed-key contract is assessed under finding 8.

**Lenses (deep review, sequential — `solidstats-shared-review-standards` §J):** Contract Adversary
(the graduated barrel surface + the Ark↔leaf prop mapping), Edge/Failure Hunter (the FileUpload
object-URL seam, the AsyncBoundary union, the empty-collection paths), Acceptance Auditor (the
`*.test.ts` vs the plan `must_haves` — see Validation Gaps). What each ruled out is in Non-Findings
Checked.

---

## Structural Findings (fallow)

_No `<structural_findings>` block was provided to this review (no structural pre-pass ran). The
narrative findings below stand alone._

---

## Narrative Findings (AI reviewer)

## Blockers 🔴

_none_

## High 🟠

1. `ToastManager/ToastManager.tsx:53,64` + `Toast/Toast.tsx:106` `[a11y]` — **the public dismiss
   control can ship with NO accessible name.** `ToastViewport` reads `meta?.dismissAria` (optional)
   and passes it straight to the leaf as `aria-label={dismissAria}`. When a consumer calls
   `toaster.create({ ... })` **without** `meta.dismissAria`, the leaf still renders the icon-only
   `<X>` dismiss button (`onDismiss` is always wired by the manager) — now `aria-label={undefined}`,
   so the only content is an `aria-hidden` icon → an unnamed control (WCAG 4.1.2). The story always
   supplies it, so this never fires in the catalog, but the graduated `toaster`/`ToastViewport`
   contract makes the unnamed state reachable. This is the exact icon-only-name gap the slice
   comments claim to prevent. **Fix:** make the dismiss name a required field of the toaster's
   `meta` contract (type `meta: { dismissAria: string }` and read it non-optionally), or fall back
   to a sane default in `ToastViewport` (e.g. require it via a typed `createToast` helper) so an
   omitted name is a `tsc` error, not a silent a11y regression. `[conv: a11y — icon-only controls
   require an accessible name; component-shape.md "the slice never invents one"]`

2. `FileUpload/FileUpload.tsx:95-101` `[dead-code/security]` — **the object-URL revoke "contract"
   is wired but never fed — the component never calls `tracker.create()`.** The slice instantiates
   `previewTrackerRef = useRef(createPreviewUrlTracker())` and runs `tracker.revokeAll()` on unmount,
   but `tracker.create(...)` is invoked **nowhere** in the component (grep-confirmed) — the real
   preview blob URLs are created and revoked internally by Ark's `ItemPreviewImage`. So the tracker's
   `live` set is always empty and `revokeAll()` is a no-op. The head comment (lines 18-20, 90-94) and
   the barrel doc (`index.ts:134-136`) both sell this as the slice's explicit, test-pinned leak guard;
   `fileUpload.test.ts` exercises `createPreviewUrlTracker` **in isolation**, so it passes while
   proving nothing about the component's actual leak behavior. This is misleading-by-construction:
   a future reader trusts a guard that does not run. Not a 🔴 because Ark genuinely owns the real
   revoke (no actual leak today). **Fix:** either (a) delete the unused tracker + effect and rely on
   Ark's documented internal revoke, downgrading the comments to "Ark owns preview-URL lifecycle", or
   (b) actually route the previews through the tracker (`create` on add, render the tracked URL) so
   the test reflects the component. Do not keep a dead seam dressed as a security guarantee.
   `[conv: security.md — revoke object URLs; component-shape.md — no dead single-use seam]`

3. `_i18n/catalogs.test.ts:48-52` `[tests]` — **side-effecting i18n calls run at `describe`-body
   eval time, not inside a `test()`.** `i18n.activate("ru")` and the three `i18n._({...})` calls sit
   directly in the `describe` callback body. Vitest evaluates every `describe` body eagerly during
   collection (before any test runs and across all files), so this mutates the shared module-singleton
   `i18n` locale as a collection side effect and computes `one/few/many` outside the test the comment
   thinks owns them. With the catalog test sharing the same singleton as any other suite that
   `i18n.activate("en")`s, collection-order coupling can flip the active locale under another file's
   tests. **Fix:** move `i18n.activate` + the three `i18n._` reads inside the `test()` (or a
   `beforeAll`), and `i18n.activate` defensively in any suite that asserts a specific locale.
   `[conv: testing-standards — AAA, isolation, no shared-mutable-state across tests]`

4. `.ladle/components.tsx:23-30` `[data-flow/correctness]` — **`i18n.activate(locale)` is a render-body
   side effect, and the locale is an unchecked `as` cast.** The `GlobalProvider` mutates the
   module-singleton during render (`i18n.activate(locale)` before returning JSX) — a side effect in
   render, which React may run/discard/re-run freely; and `globalState.control?.["locale"]?.value as
   "ru" | "en"` casts an arbitrary control value to the locale union with only an `undefined`
   fallback (a stray third value would `activate` an unloaded locale). This is the documented PATTERNS
   shape and is confined to the Ladle harness (not shipped app code), so it is High-not-Blocker, but it
   is the kind of render-time mutation the conventions warn against. **Fix:** narrow the locale with a
   guard (`locale === "en" ? "en" : "ru"`) and move the `activate` into a `useEffect`/`useLayoutEffect`
   keyed on `locale` so the mutation is an effect, not a render side effect. `[conv: component-shape.md
   — no side effects in render; typescript.md — no unchecked `as`]`

## Medium 🟡

5. `Toast/Toast.tsx:91-112` `[a11y/correctness]` — **a multi-toast region announces only the latest;
   the dismiss/action ordering is unguarded.** The leaf carries `role="status"` (polite live region)
   per toast, which is correct for a single toast, but the `ToastManager` stacks up to `max: 4`
   simultaneously — four concurrent `role="status"` regions can collide/clobber SR announcements, and
   there is no `aria-atomic`/grouping discipline. Lower severity because it is a presentational catalog
   with no real product flow yet. **Fix:** document the announcement contract (one polite region owned
   by the viewport, or `role="alert"` only for `error`) before a real surface composes the manager;
   revisit in the v1.0 wiring. `[conv: a11y — live regions without focus steal; realtime.md]`

6. `FileUpload/FileUpload.tsx:137` `[correctness]` — **accepted/rejected rows are keyed by
   `file.name`.** `key={file.name}` (accepted) and `key={rejection.file.name}` (rejected) collide when
   a user selects two files with the same basename from different folders, or re-adds a file after
   removing it — React key collisions drop/merge rows. `maxFiles` evidence uploads make duplicate
   basenames realistic. **Fix:** key by a stable composite (`${file.name}-${file.size}-${file.lastModified}`)
   or a tracked id. `[conv: component-shape.md — stable keys; data-flow correctness]`

7. `ToastManager/ToastManager.tsx:26` `[architecture]` — **a mutable singleton `toaster` is graduated
   from the package barrel.** `export const toaster = createToaster(...)` is module-scope mutable
   shared state exported as public API (`index.ts:197`). Two consumers importing it share one queue/
   placement; there is no way to scope a toaster per surface or test it in isolation without the global.
   Acceptable for D-06's "mount once" intent, but flag it: a graduated mutable singleton is a coupling
   smell the architecture rules call out. **Fix (or accept):** document the single-instance contract on
   the export, or expose a `createToaster`-returning factory for surfaces that need isolation. `[conv:
   architecture.md — slice public surface; state.md — shared client state boundaries]`

## Low 🔵

8. `_i18n/lingui.d.ts` + `tsconfig.json:15-18` + `src/index.ts:96` `[gsd-plan/typescript]` — **SC#4
   (a wrong message id is a compile error) is enforced ONLY structurally, with no test pinning it.**
   The `Register` augmentation + the `paths` workaround do make `i18n._({ id })` narrow to
   `keyof typeof STRINGS`, and because the stories live under the tsconfig `include` (`src`), a wrong
   id in a story IS a tsgo error caught by `vp check` — so the contract is real and gated, contrary to
   a "structural-only, never CI-caught" worry. BUT there is no `@ts-expect-error`-style assertion (a
   deliberate wrong id that must fail to compile) anywhere, so a regression that silently widens the id
   type (e.g. the `paths`/alias workaround breaking and the module resolving to `any` again — exactly
   the failure the comments describe) would NOT fail any test — it would only fail if some story
   happens to use a now-untyped id. **Fix:** add a tiny type-level guard (a `// @ts-expect-error
   unknown id must not compile` line against `i18n._({ id: "definitely-not-a-key" })` in a `.test-d`
   or a type-only fixture) so the typed-key contract has an explicit regression oracle, not only the
   incidental coverage of real call sites. `[conv: localization.md — typed keys; GSD SC#4]`

9. `Select/select.ts:32` `[a11y/styling]` — `valueText` is `truncate` with no reserved single-line
   guarantee under the trigger's `min-h-11`; a very long selected label truncates silently with no
   title/tooltip. Minor — the option fixtures are short. Consider a `title` attr on overflow for the
   real data later. `[conv: a11y.md / styling.md]`

10. `Field/Field.stories.tsx:26,61` `[tests/clarity]` — the `label` and `helperText` both resolve to
    `fieldRequired` ("Обязательное поле") in several cells, so the helper text is a duplicate of the
    label rather than distinct helper copy — the story under-demonstrates the helper-text role it
    exists to catalog. Cosmetic; swap one to distinct copy. `[conv: design pipeline — catalog states]`

11. `keyboard.spec.ts:829-834` `[tests/clarity]` — comment says "a positive (focusable) tabindex" but
    the assertion (correctly) checks `tabindex="0"` (0 is in-tab-order, not positive). Comment-only
    imprecision; fix the wording. `[conv: docs accuracy]`

---

## Out of scope (pre-existing)

- `keyboard.spec.ts` FileUpload story-id mismatch (`DEF-03-05-01`) — already resolved in commit
  `fix(03-04)` (deferred-items.md); not re-flagged.
- The flaky Select arrow-nav e2e — already fixed in `5b19f1d`; the polling/re-press mitigation in
  `keyboard.spec.ts:743-782` is sound (re-press-inside-poll is idempotent for `End`, and the
  stable-initial gate is the right pattern). Not re-flagged.

## Open Questions

None that change the outcome.

## Non-Findings Checked (lenses — attacked and ruled out)

- **uikit i18n boundary (Contract Adversary):** grepped every slice — no `@lingui`/`_i18n` import
  inside any `shared/uikit` primitive. Copy is `message: string` props resolved in the story. Clean.
- **`tv()` per-part / no-`asChild`-for-styling (Contract Adversary):** every recipe is `tv({ slots })`
  with `className` per Ark part; the only `asChild` uses slot the shared `Button` into a trigger (the
  one sanctioned use). No arbitrary `[...]` values; `shadow-(--var)` and `min-w-(--reference-width)`
  are the sanctioned CSS-var-utility form — `--reference-width` is genuinely set by zag-popper on the
  floating element and inherits to the content slot (verified in `@zag-js/popper` dist). Clean.
- **Select `as TValue` cast (Edge/Failure Hunter):** `details.value[0]` is guarded `!== undefined`
  before the cast, and the collection is built from the typed `options`, so the cast is
  safe-by-construction. `firstRejectReason`/`mapRejectReason` are total (every Ark error code folds to
  a reason; the empty-array path returns `"other"`). `AsyncBoundary` switch is exhaustive over the
  union (a new kind is a tsgo error). No null/empty/duplicate correctness holes there.
- **FileUpload SVG/XSS gate (Edge/Failure Hunter):** `ACCEPT_DEFAULT` allowlists png/jpeg/webp and
  excludes `image/svg+xml`; the rejection mapper surfaces wrong-type over size (security reason wins).
  Solid. (The leak-guard wiring is finding 2 — the allowlist itself is correct.)
- **RU plural CLDR correctness (Acceptance Auditor):** `replayCount` arms (1 реплей / 2 реплея /
  5 реплеев) match Russian CLDR one/few/many; the catalog test asserts three distinct forms. Correct.
- **Dialog/Popover focus management (Edge/Failure Hunter):** delegated to Ark (trap-inside / return /
  Esc), and the keyboard spec proves it with deterministic focus-settle polling — not hand-rolled.

## Validation Gaps

- **Static read only — no `vp check`, no Playwright, no axe run** in this review environment. The
  per-component a11y truths (axe-clean, real keyboard operation, ≥44px painted hit area, CLS=0 box
  geometry, RU-longest no-clip) are asserted by the e2e specs but **not confirmed by this reviewer** —
  they need the verify/browser pass (`solidstats-frontend-react-design-review` + the CI matrix).
- The Wave-0 RED→GREEN scaffolds are intentional (Nyquist contract) and not re-evaluated as failures.
- **Acceptance Auditor caveat:** all `*.test.ts` are Vitest pure-logic (recipe class-string
  assertions, routing maps, the URL tracker, catalog parity) — correct per the runner split, but they
  do **not** prove component DOM behavior; that proof lives in Playwright, run in CI not here. Finding
  2 is the one place a Vitest test gives false assurance about a component.

## Verdict

**REQUEST CHANGES** — no blockers, the phase is advisory and does not gate completion, but four
🟠/🟡 issues should be fixed before any v1.0 surface composes these primitives:

- **Mandatory before real composition:** finding 1 (Toast dismiss can ship nameless — make
  `dismissAria` required in the toaster contract) and finding 2 (FileUpload dead revoke seam — delete
  it or wire it; do not keep a dead "security guarantee").
- **Should fix:** finding 3 (catalog test side effect at describe-eval), finding 4 (Ladle render-time
  `activate` + unchecked locale cast), finding 6 (file-name React keys collide on duplicate basenames).
- **Nice-to-have:** findings 5, 7–11.

The i18n boundary, the `tv()`-per-part styling discipline, the typed-by-union generics, the SVG/XSS
allowlist, and the keyboard/focus delegation to Ark are all correct — the convention spine of the
phase is sound; the findings are robustness gaps on the public seams, not structural breaks.

> _Deep change — recommend the parallel lens fan-out: run the `solidstats-process-review-lenses` skill
> (base `0d188e1`, stack `frontend-react`); it fans the lenses out via Workflow and merges them into
> one report._

---

_Reviewed: 2026-06-25 · Reviewer: Claude (gsd-code-reviewer) · Depth: deep_
_Skills read in full: solidstats-shared-review-standards, solidstats-frontend-react-code-review,
solidstats-frontend-react-conventions (SKILL + references/patterns/{architecture, component-shape,
localization, a11y, styling, security, typescript, forms, errors}), solidstats-shared-ts-standards,
solidstats-frontend-react-tests, solidstats-shared-testing-standards (via tests skill), the design
SKILL context. Checked against: uikit i18n boundary, tv()-per-part / no-asChild-for-styling,
tokens-only / no arbitrary values, ≥44px hit areas, never-color-alone, typed-by-union, the
FileUpload SVG-exclusion + object-URL revoke surface._
