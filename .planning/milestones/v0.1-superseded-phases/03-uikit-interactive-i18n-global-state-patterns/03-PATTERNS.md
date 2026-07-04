# Phase 3: UIKIT — Interactive, i18n & Global-State Patterns - Pattern Map

**Mapped:** 2026-06-24
**Files analyzed:** 24 (10 Ark slices + AsyncBoundary + ToastManager + _i18n harness (3) + Ladle wiring (2) + barrel + 6 test/story extensions)
**Analogs found:** 22 / 24 (2 no-direct-analog: createToaster manager, Lingui catalog)

All paths under `packages/design/src/shared/uikit/` unless noted. Ark version pin: `@ark-ui/react@5.37.2`; Lingui `@lingui/core` + `@lingui/react` `6.4.x`.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `Field/Field.tsx` | component (form wrapper) | request-response (controlled props) | `Button/Button.tsx` + `Toast/Toast.tsx` | role-match |
| `Input/Input.tsx` | component (form) | request-response | `Button/Button.tsx` | role-match |
| `Select/Select.tsx` | component (form) | event-driven (value select) | `Button/Button.tsx` | role-match |
| `Stepper/Stepper.tsx` (Ark NumberInput) | component (form) | event-driven | `Button/Button.tsx` | role-match |
| `FileUpload/FileUpload.tsx` | component (form) | file-I/O | `Button/Button.tsx` | role-match |
| `Dialog/Dialog.tsx` | component (overlay) | event-driven (open/close) | `Button/Button.tsx` (tv wrapper) | role-match |
| `Menu/Menu.tsx` | component (overlay) | event-driven | `Button/Button.tsx` | role-match |
| `Tabs/Tabs.tsx` | component (overlay) | event-driven | `Button/Button.tsx` | role-match |
| `Tooltip/Tooltip.tsx` | component (overlay) | event-driven | `Button/Button.tsx` | role-match |
| `Popover/Popover.tsx` | component (overlay) | event-driven | `Button/Button.tsx` | role-match |
| `<Slice>/<slice>.ts` (tv recipe per slice) | config (style recipe) | — | `Button/control.ts` | exact |
| `AsyncBoundary/AsyncBoundary.tsx` | component (state seam) | transform (state union → primitive) | `DataTrustBanner/DataTrustBanner.tsx` (kind switch) | role-match |
| `ToastManager/ToastManager.tsx` (createToaster) | provider (lifecycle) | pub-sub (queue) | `Toast/Toast.tsx` (leaf, reused) | no-direct (manager) |
| `_i18n/catalogs.ts` | config (catalog maps) | transform (STRINGS → id→ICU) | `_fixtures/strings.ts` | role-match |
| `_i18n/i18n.ts` | config (runtime instance) | — | (no analog — new lib seam) | no-analog |
| `_i18n/lingui.d.ts` | config (type augmentation) | — | `_fixtures/strings.ts` (`StringKey` derive) | role-match |
| `.ladle/components.tsx` (modify) | provider (GlobalProvider) | — | existing `.ladle/components.tsx` | exact |
| `.ladle/config.mjs` (modify) | config (addons) | — | existing `.ladle/config.mjs` | exact |
| `src/index.ts` (modify) | config (barrel) | — | existing `src/index.ts` | exact |
| `<Slice>/<Slice>.stories.tsx` (per slice) | test (catalog story) | — | `Button/Button.stories.tsx` | exact |
| `<Slice>/<slice>.test.ts` (forced≡live) | test (unit) | — | `Button/control.test.ts` | exact |
| `tests/keyboard.spec.ts` (extend) | test (e2e) | — | existing `tests/keyboard.spec.ts` | exact |
| `tests/cls.spec.ts` (extend) | test (e2e) | — | existing `tests/cls.spec.ts` | exact |

## Pattern Assignments

### Ark slice wrapper — `Dialog/`, `Menu/`, `Tabs/`, `Tooltip/`, `Popover/`, `Input/`, `Select/`, `Stepper/`, `FileUpload/`, `Field/`

**Analog:** `Button/Button.tsx` (component shell) + `Button/control.ts` (tv recipe). Ark v5 styles **per anatomy part** with `className`, so the single-`tv()` recipe gains `slots` (one slot per Ark part) instead of `Button`'s flat `base`+`variants`. Use `asChild` **only** to slot the shared `Button`/`Link` `control` into an Ark trigger — never for plain styling (RESEARCH anti-pattern).

**Component-shell pattern** — copy the props/forwarding shape from `Button/Button.tsx:31-53`. Controlled props in, `data-*` test hook, `className` passthrough, no i18n imports inside:
```tsx
export function Dialog_({ open, onOpenChange, title, children, closeAria, className }: Props): ReactNode {
  const s = dialog();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} lazyMount unmountOnExit>
      <Portal>
        <Dialog.Backdrop className={s.backdrop()} />
        <Dialog.Positioner className={s.positioner()}>
          <Dialog.Content className={s.content()} data-dialog>
            <Dialog.Title className={s.title()}>{title}</Dialog.Title>
            {children}
            <Dialog.CloseTrigger aria-label={closeAria} />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
```
- `open`/`onOpenChange` controlled contract = the **forced-open StateMatrix cell** (`open` prop in the catalog grid). `Field.Root invalid` = the forced-invalid cell. No Ladle hack.

**tv recipe-per-part pattern** — copy the recipe shape and discipline from `Button/control.ts:30-89`. Ark parts become `tv({ slots: {...} })`:
```ts
import { tv } from "tailwind-variants/lite"; // merge-free /lite build — class strings stay literal
const dialog = tv({
  slots: {
    backdrop: "fixed inset-0 bg-overlay",
    positioner: "fixed inset-0 flex items-center justify-center p-4",
    content: "bg-surface-1 border border-border-2 rounded-xl shadow-lg p-6",
    title: "font-body text-lg font-semibold text-text-primary",
  },
});
```
Constraints carried from `control.ts`: `tailwind-variants/lite` (no tailwind-merge), **no arbitrary values** (only `@theme` tokens already in `theme.css` — `--color-overlay`, `--shadow-ring`, `--shadow-md/lg`, `--color-surface-1/2/3`, `--color-border-1/2`, `--radius-sm/lg/xl`), literal class strings so the Tailwind `@source` scan picks them up, `min-h-11` (≥44px) on every interactive trigger, `focus-visible:shadow-(--shadow-ring)` for the ONE canonical ring. Icon-only triggers (NumberInput inc/dec, Dialog close) need an `aria-label` prop — the slice does not invent one (`Button.tsx:31` precedent).

**Forced-state mirror** — for any slice with forced interaction-state cells, copy `control.ts:102-126` `FORCED_STATE` `!`-override map + assert it in sync via a `*.test.ts` (`control.test.ts` precedent). Overlays mostly use Ark's real `open`/`invalid` instead of a forced map, so the mirror is only needed where a slice paints `:hover`/`:focus` token shifts.

**Field wrapper specifically** (`Field/Field.tsx`) — `Field.Root` broadcasts `invalid`/`required`/`disabled` to the nested control via Ark context; `Field.ErrorText` is the announced error region (pair `aria-live="polite"` + a Lucide icon — never color-alone, mirroring `Toast/Toast.tsx:71-74` icon+message and `ErrorState`/`DataTrustBanner` `role` discipline).

---

### `AsyncBoundary/AsyncBoundary.tsx` (component, state-union → primitive)

**Analog:** `DataTrustBanner/DataTrustBanner.tsx` — its `BannerKind` switch (`DataTrustBanner.tsx:21,52-67`) is the exact kind→render seam to mirror, and `BannerKind` already maps `stale`/`offline`/`reconnecting`. AsyncBoundary maps a discriminated union → the right **existing** Phase-2 primitive; it does **not** rebuild them.

**Kind-switch pattern** (copy the `if (kind === ...)` / icon-map shape from `DataTrustBanner.tsx:52-67`):
```tsx
type AsyncState =
  | { kind: "loading" } | { kind: "empty" } | { kind: "error"; id?: string }
  | { kind: "offline" } | { kind: "reconnecting" } | { kind: "stale" }
  | { kind: "ready"; children: ReactNode };
// loading→Skeleton  empty→EmptyState  error→ErrorState(kind="system")
// offline/reconnecting/stale→DataTrustBanner (BannerKind already maps these three)
```
Reserved-height (CLS=0) discipline is already encoded in each primitive — `DataTrustBanner.tsx:30` (`h-10` reserved incl. the empty `reserved` kind), `EmptyState`/`ErrorState` (`min-h-48`, `role="alert"`/`status`), `Skeleton` (`tableViewportHeight`). AsyncBoundary just routes; it never hardcodes a height of its own. Discretion (D-05): discriminated union is the intended shape; planner reconciles slice granularity against `architecture.md`.

---

### `ToastManager/ToastManager.tsx` (provider, createToaster — reuses the existing leaf)

**Analog (leaf, reused not re-expressed):** `Toast/Toast.tsx` — keep its `ToastVariant`/`message`/`action` props as the visual leaf. The manager is **new** (no codebase analog for the lifecycle), built on Ark `createToaster` + `<Toaster>` render-prop:
```tsx
import { Toaster, createToaster } from "@ark-ui/react/toast";
import { Toast } from "../Toast";
export const toaster = createToaster({ placement: "bottom-end", overlap: true, gap: 12, max: 4 });
export function ToastViewport() {
  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast
          variant={toast.type as ToastVariant}
          message={toast.title ?? ""}
          action={/* toast.action → { label, onClick: () => toaster.dismiss(toast.id) } */}
        />
      )}
    </Toaster>
  );
}
```
Two adaptations (RESEARCH A3): add a dismiss affordance (`toastDismiss` aria → `toaster.dismiss(toast.id)`) and confirm the `toast` render-prop shape (`type`/`title`/`description`/`action`) against the installed 5.37.2 `.d.ts`. The leaf at `Toast/Toast.tsx:67-83` stays presentational — manager owns portal/queue/auto-dismiss/stacking. Colocate in `Toast/` or a sibling `ToastManager/` (planner's call).

---

### `_i18n/catalogs.ts` + `_i18n/i18n.ts` + `_i18n/lingui.d.ts` (i18n harness — Lingui runtime mode)

**Analog:** `_fixtures/strings.ts` — its `STRINGS` `Record<string, Bilingual>` (`strings.ts:18-126`) is the migration source and the typed-key source. **Do not delete it — derive from it** (RESEARCH Runtime State Inventory), so existing Phase-2 story imports don't break.

**Catalog migration** (`catalogs.ts`) — STRINGS → two `{ id → ICU message }` maps:
```ts
import { STRINGS } from "../_fixtures/strings";
export const ru = Object.fromEntries(Object.entries(STRINGS).map(([k, v]) => [k, v.ru]));
export const en = Object.fromEntries(Object.entries(STRINGS).map(([k, v]) => [k, v.en]));
```
RU plurals live **inside** the message string as ICU `{n, plural, one{} few{} many{} other{}}` — never concatenation (the existing `{n}`/`{from}–{to} из {total}`/`{col}`/`{id}` placeholders in `strings.ts:43-61` already follow this). v0.1 = hand-authored maps; `@lingui/cli` extract/compile is the v1.0 graduation (Open Question 1).

**Runtime instance** (`i18n.ts`):
```ts
import { i18n } from "@lingui/core";
i18n.load({ ru, en });
i18n.activate("ru"); // RU primary
export { i18n };
```
**Typed keys** (`lingui.d.ts`) — mirror the `StringKey = keyof typeof STRINGS` derive at `strings.ts:129`, but as the Lingui `Register` augmentation so a missing id is a `tsc` error (the `localization.md` rule):
```ts
import type { STRINGS } from "../_fixtures/strings";
declare module "@lingui/core" {
  interface Register { messageIds: keyof typeof STRINGS; }
}
```
**Boundary rule (critical):** strings resolve in the **story**, not inside the primitive — `i18n._({ id, message, values })` → passed as a plain `message: string` prop. The uikit primitive takes no i18n key (`architecture.md` uikit boundary; every existing slice e.g. `Toast.tsx:27` takes `message: string`).

---

### `.ladle/components.tsx` (modify — language switcher provider)

**Analog:** the existing `.ladle/components.tsx:14-16` GlobalProvider. Extend the single `Provider` to read the locale global control, activate Lingui, and wrap in `I18nProvider` — preserve the existing `bg-bg-0 text-text-primary font-body min-h-screen p-4` wrapper and the `fonts.css`→`tailwind.css` import order (do NOT reorder; import-once discipline):
```tsx
import { I18nProvider } from "@lingui/react";
import { i18n } from "../src/shared/uikit/_i18n/i18n";
export const Provider: GlobalProvider = ({ globalState, children }) => {
  const locale = (globalState.control?.["locale"]?.value as "ru" | "en") ?? "ru";
  i18n.activate(locale);
  return (
    <I18nProvider i18n={i18n}>
      <div className="bg-bg-0 text-text-primary font-body min-h-screen p-4">{children}</div>
    </I18nProvider>
  );
};
```

### `.ladle/config.mjs` (modify — locale control)

**Analog:** the existing `config.mjs:9-28` `addons` block. The disabled `theme` addon (`config.mjs:11`) is the precedent for a global toggle; add a `locale` global control / custom addon button (RU↔EN) alongside the existing `width` addon — leave `width` and `theme` untouched. Discretion (D-04): global-control-arg vs custom addon button (RESEARCH Open Question 2 recommends the custom addon button mirroring the `theme` precedent).

### `src/index.ts` (modify — barrel)

**Analog:** the existing `src/index.ts` — append a new region per family wave (`index.ts:9,18,28,41,51,63` region-comment precedent). Graduate the 10 Ark slices, `AsyncBoundary`, the Toast manager, and the i18n hooks/types. The `_i18n` catalogs/`STRINGS`/`_state-matrix`/`_fixtures` helpers stay internal (NOT graduated — the underscore-prefix rule, `index.ts:4`).

### `<Slice>/<Slice>.stories.tsx` (per slice) + `<slice>.test.ts`

**Analog:** `Button/Button.stories.tsx` (`StateMatrix`/`StateCell` grid + `Playground` args) and `Button/control.test.ts` (forced≡live). Two demonstration modes (D-02): (1) static `StateMatrix` grid using `StateCell` from `_state-matrix` (`Button.stories.tsx:50-95`) — overlays forced open via `open`/`defaultOpen`, fields via `Field.Root invalid`; (2) interactive `Playground` with Ladle args (`Button.stories.tsx:104-118`). Reuse `StateMatrix`/`StateCell` from `_state-matrix/StateMatrix.tsx` verbatim (visible `data-state-cell` labels the catalog spec asserts against; `min-h-11` already in `StateCell`).

### `tests/keyboard.spec.ts` + `tests/cls.spec.ts` (extend)

**Analog:** the existing `tests/keyboard.spec.ts` — copy the per-story `page.goto('/?story=<id>&mode=preview')` + `data-*` selector + `getComputedStyle`/`boundingBox` oracle pattern (`keyboard.spec.ts:14-49`, `155-173`). Add overlay specs (Dialog Esc-close + return-focus; Menu `aria-expanded`/`aria-controls`; Tabs roving tabindex; trap-free Tab cycle) and form live-region/`Field.ErrorText` announcement. `catalog.spec.ts` auto-picks up new stories via `meta.json` — no edit needed. `cls.spec.ts` extends for AsyncBoundary reserved-height (six states).

## Shared Patterns

### tv() per Ark part (the D-01 boundary)
**Source:** `Button/control.ts:17,30-89` (recipe shape, `/lite` import, token-only literals, `min-h-11`, `focus-visible:shadow-(--shadow-ring)`).
**Apply to:** all 10 Ark slices. Ark v5 → `tv({ slots })` one slot per anatomy part; `className` per part, never `asChild` for styling.

### Controlled props + data-* hook + className passthrough
**Source:** `Button/Button.tsx:15-53`.
**Apply to:** every slice — controlled props in (`open`/`value`/`invalid`), `data-<slice>` test hook, `className?` passthrough, icon-only controls get an `aria-label` prop, no i18n/business imports inside.

### Forced-state mirror for the StateMatrix axe gate
**Source:** `Button/control.ts:102-126` `FORCED_STATE` (`!`-override under merge-free `/lite`) + `Button.stories.tsx:30-48` `ForcedButton`.
**Apply to:** overlays use Ark's real `open`/`defaultOpen`/`invalid` (no map needed); slices painting `:hover`/`:focus` token shifts get a `FORCED_STATE` map + a `*.test.ts` forced≡live assertion.

### Never-color-alone + live-region
**Source:** `Toast/Toast.tsx:36-41,67-74` (icon map + `role="status"`), `DataTrustBanner.tsx:58-67` (`role="status"` + Lucide icon), `ErrorState` (`role="alert"`).
**Apply to:** `Field.ErrorText` (`aria-live="polite"` + icon), every status/validation surface — color always paired with a Lucide icon/label.

### i18n resolves in the story, not the primitive
**Source:** every existing slice takes `message: string` (`Toast.tsx:27`); the boundary rule in `architecture.md:74-89`.
**Apply to:** all slices — `i18n._({id, message, values})` resolves in `*.stories.tsx`, passed as plain string props. `lingui.d.ts` `Register` makes a missing key a `tsc` error.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `ToastManager/ToastManager.tsx` | provider | pub-sub | `createToaster` lifecycle (portal/queue/dismiss) is new — no manager exists; the visual `Toast/Toast.tsx` leaf IS the analog and is reused as the render-prop child (D-06, no re-expression). |
| `_i18n/i18n.ts` | config | — | Lingui runtime instance is a brand-new lib seam; no codebase precedent. RESEARCH Pattern 3 is the recipe. |

## Metadata

**Analog search scope:** `packages/design/src/shared/uikit/**`, `packages/design/.ladle/`, `packages/design/tests/`, `packages/design/src/index.ts`, `packages/design/package.json`.
**Files scanned:** Button (Button.tsx, control.ts, Button.stories.tsx), Toast/Toast.tsx, DataTrustBanner.tsx, Skeleton/EmptyState/ErrorState (signatures), _state-matrix/StateMatrix.tsx, _fixtures/strings.ts, index.ts, .ladle/{components.tsx,config.mjs}, tests/keyboard.spec.ts.
**Pattern extraction date:** 2026-06-24
