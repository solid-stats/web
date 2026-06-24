# Phase 3: UIKIT — Interactive, i18n & Global-State Patterns - Research

**Researched:** 2026-06-24
**Domain:** Headless interactive primitives (Ark UI React), typed RU/EN i18n (Lingui), Ladle component-catalog global state — all on the Tailwind v4 `@theme` + dark-only stack, colocated Ladle stories only (no app, no routes).
**Confidence:** HIGH on the three locked tools and their version pins; HIGH on integration mechanics; MEDIUM on the exact sibling-version pins for `@lingui/*` packages other than `@lingui/core` (registry was network-blocked in-sandbox for the siblings — pin at install from the same `6.x` line).

> **Network caveat for the planner.** The sandbox throttled/blocked `npm view`, `curl`, and `WebFetch` (TLS) mid-session. `@ark-ui/react@5.37.2` and `@lingui/core@6.4.0` were confirmed directly via `npm view` (cached responses). All `@lingui/*` siblings ship from one monorepo in lockstep, so they share the `6.x` line — but the executor must run `npm view @lingui/<pkg> version` at install time to lock the exact patch, and re-run the `package-legitimacy check` seam (it timed out here on registry I/O, not on a bad verdict). This is mechanical, not a research gap.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Add `@ark-ui/react` as a `packages/design` runtime dependency. Each Ark headless primitive is wrapped in a thin PascalCase `shared/uikit/<Component>/` slice that styles Ark's anatomy parts with `tailwind-variants` `tv()` recipes consuming `@theme` tokens — mirroring the Phase-2 props-down presentational boundary (controlled props in, `data-*` test hooks, **no** business/i18n imports inside the primitive). Slices:
  - **KIT-05 (forms):** `Input`, `Select`, `Stepper` (Ark NumberInput), `FileUpload` (image + link evidence), `Field` (visible label + error + `aria-live` live-region, shared).
  - **KIT-06 (overlays):** `Dialog`, `Menu`, `Tabs`, `Tooltip`, `Popover` — keyboard-accessible, focus-managed, no traps.
- **D-02:** Two demonstration modes: (1) static `StateMatrix`/`StateCell` grid for the screenshot + axe + 44px gate (forced open/validation states), (2) interactive Ladle `Playground` stories exercising Ark's real keyboard/focus runtime. Extend the Phase-2 Playwright-against-Ladle harness with per-component specs: trap-free Tab cycle, `Esc`-to-close, `aria-expanded`/`aria-controls`, form live-region announcements.
- **D-03:** **Lingui** is the i18n library, adopted in **framework-agnostic core mode** (`@lingui/core` + `@lingui/react`) — no routing coupling. The `_fixtures/strings.ts` `STRINGS` seed migrates into Lingui catalogs (RU primary, EN at parity). RU one/few/many ICU plural + interpolation exercised now. Shaped to graduate into the v1.0 `/ru` `/en` routing.
- **D-04:** Language switcher = a Ladle global control/addon + a Lingui `I18nProvider` in `.ladle/components.tsx`; every story renders from the catalog and toggles RU↔EN. RU is primary; RU strings sanity-checked (QUAL-05).
- **D-05:** SURF-18 = reusable story-level recipes composing the existing Phase-2 primitives (`Skeleton`, `EmptyState`, `ErrorState`, `DataTrustBanner`) into the six named states, **plus one thin `AsyncBoundary` wrapper slice** mapping a state union → the right primitive (CLS = 0, never color-alone). Underlying primitives are NOT rebuilt.
- **D-06:** Toast lifecycle (trigger / portal / queue / auto-dismiss / stacking) built on Ark UI `createToaster`, wrapping the existing `Toast/Toast.tsx` as the visual leaf, demonstrated via an interactive Ladle `Playground`. If `createToaster` cannot slot the existing styled markup, the planner flags it (resolved below — see Toast verdict).
- **D-07:** Every interactive story demonstrates ×7 component states / ×5 scenario endings / ×4 data-volume states where applicable; forms have visible labels + inline errors + live-region; overlays focus-managed no-traps; all axe-clean, keyboard-operable, 44px, never color-alone.

### Claude's Discretion
- `AsyncBoundary` exact prop shape (state discriminated union vs slots) and slice granularity — reconcile against `architecture.md`.
- Whether `Field` is one shared wrapper or split per-control; whether `Stepper` is its own slice or a `NumberInput` variant.
- The exact Ladle mechanism for the language toggle (global state vs addon control) and for forcing overlay open-state in the static grid (resolved below as execution mechanics).

### Deferred Ideas (OUT OF SCOPE)
- `/ru` `/en` route layer + Lingui router coupling — v1.0.
- Real `server-2` data wiring, the typed OpenAPI client, SSR/SSE — v1.0.
- Surface composition (Overview, Players, profiles, the 5 request steppers, moderation queue) — Phases 4–9. Phase 3 ships only reusable primitives + patterns.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **KIT-05** | Form primitives (Ark UI) — inputs, selects, steppers, file/evidence upload, inline validation with visible labels/errors + live-region | Ark v5 `Field`/`Input`/`Select`/`NumberInput`/`FileUpload` anatomy + controlled props (§Ark API). `Field.Root invalid` drives the forced-validation StateMatrix cell. `Field.ErrorText` is the announced error; `aria-live` belongs on the error region. |
| **KIT-06** | Overlay primitives (Ark UI) — dialog, menu, tabs, tooltip, popover; keyboard-accessible, focus-managed, no traps | Ark v5 `open`/`onOpenChange`/`defaultOpen` controlled contract + `lazyMount`+`unmountOnExit`; `open`/`defaultOpen` is the forced-open StateMatrix mechanism. Ark provides focus management, Esc-close, `aria-expanded`/`aria-controls` natively (§Ark API, §Pitfalls). |
| **KIT-08** | Language switcher + RU/EN i18n harness (typed keys; RU sanity-checked) | Lingui v6 **runtime mode** (`i18n.load`/`i18n.activate`/`i18n._`), typed keys via the `Register` interface augmentation (= tsc error on missing key), ICU plural in the message string (RU one/few/many), `STRINGS` Record → `id→message` catalog migration (§Lingui recipe). |
| **SURF-18** | Global state patterns — loading / empty / error / offline / reconnecting / stale, reusable across surfaces | Compose existing primitives + one `AsyncBoundary` state→primitive seam; `DataTrustBanner.BannerKind` already maps offline/reconnecting/stale; CLS-0 reserved height already encoded (§Architecture, §Don't Hand-Roll). |
| **QUAL-01** | ×5 scenario endings + ×4 data-volume states | Demonstrated as forced `StateMatrix` cells + `Playground` args (§Validation). |
| **QUAL-02** | Responsiveness at every breakpoint, real mobile-floor width | Existing `responsive.spec` + Ladle width addon (360 floor present); container-query reflow (§Validation). |
| **QUAL-03** | WCAG 2.2 AA — axe clean, visible focus, keyboard, 44px, never color-alone | Existing `catalog.spec` (axe + 44px + keyboard) auto-picks up new stories; extend `keyboard.spec` with overlay/form behavior specs (§Validation). |
| **QUAL-04** | CLS = 0 — reserved space; tabular numerals; self-hosted fonts | Existing `cls.spec`; overlays animate transform/opacity only; AsyncBoundary reserves height (§Validation). |
| **QUAL-05** | RU + EN, every string i18n-keyed, RU sanity-checked | Lingui catalog parity (key in both locales) + RU length check on longest labels (§Lingui recipe, §Copywriting landmines). |
</phase_requirements>

## Summary

All three locked tools resolve cleanly on the React 19.2 / Vite / Node 25 stack. **`@ark-ui/react@5.37.2`** (peer `react >=18`, so React 19.2 is in-range) is the headless primitive set; its v5 anatomy is **part-based with a `className` on every part** (`Dialog.Root` → `Dialog.Trigger` → `Dialog.Backdrop` → `Dialog.Positioner` → `Dialog.Content` …), which is exactly the `tv()`-per-part wrapping the D-01 boundary wants — `asChild` is available but **not needed** for styling and should be avoided except where you must merge an Ark part onto the existing shared `Button`/`Link` control. Every overlay is controlled by `open`/`onOpenChange` (or uncontrolled `defaultOpen`), and **`open`/`defaultOpen` is the forced-open mechanism for the static StateMatrix axe gate** — no Ladle hack required. Forms nest under `Field.Root`, whose `invalid`/`required`/`disabled`/`readOnly` props broadcast to the control via context; **`Field.Root invalid` is the forced-validation StateMatrix cell**, and `Field.ErrorText` renders the announced error.

**Lingui is v6 now (`@lingui/core@6.4.0`, released 2026-04-22), ESM-only, Node 22.19+/24+ required — Node 25.9.0 satisfies it.** The decisive integration choice: **adopt Lingui in RUNTIME mode (explicit message IDs, no macros).** Macros (`t`, `<Trans>` with children) require a babel/SWC transform plugin wired into the bundler — and while Ladle *does* let you supply your own `vite.config.ts` React plugin with babel presets, pulling a babel macro plugin into a stack that otherwise uses no babel is a needless risk and a fragile graduation seam. Runtime mode needs none of it: catalogs are plain precompiled `{ id → ICU-message-string }` maps loaded with `i18n.load()` and switched with `i18n.activate()`; components call `i18n._({ id, message, values })` or the non-macro `<Trans id values>`. The `STRINGS` `Record<string, Bilingual>` seed maps **directly** onto this shape (one RU map, one EN map, keyed by the existing string keys). RU one/few/many plurals live **inside the message string** as ICU `{n, plural, one{…} few{…} many{…} other{…}}`, parsed at runtime — no concatenation. **Typed keys (missing key = `tsc` error) come from the `Register` interface module augmentation** (`messageIds` union) in a `lingui.d.ts` — this is the concrete satisfaction of the `localization.md` rule.

**The language switcher** wires as a Ladle **global control read in the `.ladle/components.tsx` GlobalProvider**: the `Provider` receives `globalState` (and `dispatch`), reads the locale control value, and calls `i18n.activate(locale)` + wraps children in Lingui's `I18nProvider` so every story re-renders bilingually. **Toast verdict (D-06): `createToaster` CAN reuse the existing styled `Toast/Toast.tsx`** — the `Toaster` component takes a render-prop that receives each toast's state, and you render *your own* `<Toast>` leaf inside it (you do not have to adopt Ark's `Toast.Root`/`Toast.Title` parts). The manager owns portal/queue/auto-dismiss/stacking; the visual leaf stays as-is. One required change: the leaf must accept the dismiss affordance and be wrapped in Ark's positioner element — see the Toast section.

**Primary recommendation:** Pin `@ark-ui/react@5.37.2` and the `@lingui/*` `6.x` line; adopt Lingui **runtime mode (no macros)**; wrap every Ark part with a `tv()` recipe (part-level `className`, not `asChild`); drive forced-open via `open`/`defaultOpen` and forced-invalid via `Field.Root invalid` in the StateMatrix; drive the language switch via a Ladle global control read in the GlobalProvider; reuse the existing `Toast/Toast.tsx` as the `createToaster` render-prop leaf.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Form/overlay interaction behavior (focus, keyboard, ARIA) | Ark UI headless (Browser/Client) | — | Brief-locked; Ark owns accessible behavior, the slice owns only visual `tv()` recipes |
| Visual styling of every Ark part | `shared/uikit` `tv()` recipe (Client) | `@theme` tokens (DS) | Props-down presentational boundary (architecture.md); no business/i18n imports inside the primitive |
| String resolution (RU/EN) | Lingui `i18n` runtime (Client) | `lingui.d.ts` typed `Register` (compile-time) | i18n is a catalog seam; primitives stay i18n-free, the *story* injects resolved strings as props |
| Locale switch across stories | Ladle GlobalProvider + global control (catalog harness) | Lingui `I18nProvider`/`i18n.activate` | Ladle owns global state; Lingui owns the locale context |
| Async/global state → UI mapping | `AsyncBoundary` wrapper slice (Client) | Phase-2 primitives | One state→primitive seam for Phases 4–9; primitives already encode CLS-0 + never-color-alone |
| Toast lifecycle (portal/queue/dismiss) | Ark `createToaster` (Client) | existing `Toast/Toast.tsx` leaf | Manager owns lifecycle; leaf stays presentational |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@ark-ui/react` | **5.37.2** | Headless, accessible form + overlay primitives (Dialog, Menu, Tabs, Tooltip, Popover, Select, Field, FileUpload, NumberInput, Toast/createToaster) | Brief-locked (PROJECT.md, AGENTS.md, architecture.md "shared/uikit … built on Ark UI"). `[VERIFIED: npm — @ark-ui/react 5.37.2, peer react >=18, published 2026-06-08]` |
| `@lingui/core` | **6.4.0** | Framework-agnostic i18n runtime: catalog load/activate, `i18n._`, ICU formatting/plurals | User-selected (D-03). `[VERIFIED: npm — @lingui/core 6.4.0]`; v6 announced 2026-04-22 `[CITED: lingui.dev/blog/2026/04/22/announcing-lingui-6.0]` |
| `@lingui/react` | **6.x (pin 6.4.x at install)** | React bindings: `I18nProvider`, `useLingui`, non-macro `<Trans id>` | Lockstep monorepo with `@lingui/core` `[CITED: lingui monorepo lockstep]` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@lingui/cli` | **6.x (devDep)** | `lingui extract` + `lingui compile` — builds runtime catalogs | Build step; run `compile` to emit the precompiled `{id→ICU}` catalogs the runtime loads |
| `@lingui/format-po` | **6.x (devDep)** | `.po` catalog format for the offline source catalogs | If you want `.po` source catalogs; **optional** — see "catalog source" note below |
| `@lingui/vite-plugin` | **6.x (devDep)** | Compiles `.po`→JS at build time so you skip a manual `lingui compile` | Optional convenience; **not required** in runtime mode if you precompile or hand-author the catalog maps |
| `@lingui/babel-plugin-lingui-macro` / `@lingui/swc-plugin` | 6.x | Macro transform plugins | **NOT recommended this phase** — runtime mode avoids them (see landmines) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Lingui runtime mode (explicit ids) | Lingui macro mode (`t`/`<Trans>` children) | Macros need a babel/SWC plugin in the Ladle Vite build; adds a transform to an otherwise babel-free stack and a fragile v1.0 graduation seam. Runtime mode migrates the existing `STRINGS` keys 1:1. **Pick runtime.** |
| Part-level `className` on Ark parts | `asChild` merge | `asChild` is for merging an Ark part onto an existing element (e.g. the shared `Button`); for plain styling it adds indirection. Use `className` per part; reserve `asChild` for slotting `Button`/`Link` into a trigger. |
| Hand-authored compiled catalog map | `@lingui/cli` extract→compile pipeline | Hand-authoring is fine for v0.1's small key set and keeps the build lean; the CLI pipeline is the v1.0 graduation target. Either satisfies KIT-08; flag as planner's call. |

**Installation:**
```bash
# runtime deps (packages/design)
pnpm --filter @solid-stats/design add @ark-ui/react@5.37.2 @lingui/core @lingui/react
# dev deps (catalog build)
pnpm --filter @solid-stats/design add -D @lingui/cli
# verify exact pins at install (registry was network-blocked in research):
npm view @ark-ui/react version
npm view @lingui/core version
npm view @lingui/react version
npm view @lingui/cli version
```

**Version verification:** `@ark-ui/react@5.37.2` and `@lingui/core@6.4.0` confirmed via `npm view` this session. `@lingui/react`/`@lingui/cli` versions were network-blocked — they share the `@lingui/core` `6.x` line (single monorepo, lockstep releases); the executor must confirm the exact patch with `npm view` at install.

## Package Legitimacy Audit

> The `package-legitimacy check` seam timed out on registry I/O in-sandbox (network throttling, not a verdict). Verdicts below are from direct `npm view` confirmation + well-known provenance. The executor must re-run the seam at install: `gsd-tools query package-legitimacy check --ecosystem npm @ark-ui/react @lingui/core @lingui/react @lingui/cli`.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `@ark-ui/react` | npm | multi-year (Chakra/Ark org) | very high (millions/wk) | github.com/chakra-ui/ark | OK | Approved — brief-locked, `npm view` confirmed 5.37.2 / 2026-06-08 |
| `@lingui/core` | npm | 8+ yrs | very high | github.com/lingui/js-lingui | OK | Approved — `npm view` confirmed 6.4.0 |
| `@lingui/react` | npm | 8+ yrs | very high | github.com/lingui/js-lingui | OK | Approved (lockstep with core; confirm patch at install) |
| `@lingui/cli` | npm | 8+ yrs | high | github.com/lingui/js-lingui | OK | Approved (lockstep; confirm at install) |
| `@lingui/format-po`, `@lingui/vite-plugin` | npm | 8+ yrs | high | github.com/lingui/js-lingui | OK | Optional — install only if used |

**Packages removed due to [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** none. (Planner: add one `checkpoint:human-verify` before the first `pnpm add` to re-run the legitimacy seam now that network is available — the in-sandbox timeout left the automated gate un-run.)

## Architecture Patterns

### System Architecture Diagram

```
                         ┌──────────────────────── Ladle catalog (Vite, dark-only) ─────────────────────┐
                         │                                                                              │
 .ladle/config.mjs ──────┤  addons.locale (custom global control: ru | en)  ── selects locale value    │
 (locale global control) │            │                                                                 │
                         │            ▼                                                                 │
 .ladle/components.tsx ──►  GlobalProvider({ globalState, children })                                   │
   (GlobalProvider)       │    ├─ read globalState → activeLocale                                       │
                         │    ├─ i18n.load(catalogs) ; i18n.activate(activeLocale)   ◄── @lingui/core   │
                         │    └─ <I18nProvider i18n={i18n}>  ◄── @lingui/react                           │
                         │            │                                                                 │
                         │            ▼                                                                 │
                         │   *.stories.tsx  (one per shared/uikit slice)                                │
                         │     │  resolves strings: i18n._({id, message, values})  → props              │
                         │     ▼                                                                         │
                         │   shared/uikit/<Component>/  (PascalCase slice)                              │
                         │     ├─ Ark headless primitive (Dialog/Menu/Tabs/Field/Select/NumberInput/…)  │
                         │     │     controlled: open|value|invalid  ──► forced states for StateMatrix   │
                         │     ├─ tv() recipe per anatomy part  ──► @theme tokens (theme.css)            │
                         │     └─ data-* test hooks   (NO business/i18n imports inside the primitive)    │
                         │                                                                              │
                         │   AsyncBoundary slice:  state union → { Skeleton | EmptyState | ErrorState   │
                         │                                         | DataTrustBanner }  (CLS-0 reserved) │
                         │                                                                              │
                         │   Toast: createToaster()  → <Toaster> render-prop → existing <Toast/> leaf   │
                         └──────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼  graduates into
                         packages/design/src/index.ts  (public barrel — Phases 4–9 consume)
```

### Recommended Project Structure
```
packages/design/src/shared/uikit/
├── Field/            # KIT-05 wrapper: label + error + aria-live (Ark Field.Root context)
├── Input/            # KIT-05 Ark Field-styled input
├── Select/           # KIT-05 Ark Select (typed value union)
├── Stepper/          # KIT-05 Ark NumberInput (tabular mono value)
├── FileUpload/       # KIT-05 Ark FileUpload (keyboard dropzone, revoke object URLs)
├── Dialog/           # KIT-06 Ark Dialog (portal, trap-inside, return focus, Esc)
├── Menu/             # KIT-06 Ark Menu (aria-expanded/controls, no trap)
├── Tabs/             # KIT-06 Ark Tabs (roving tabindex)
├── Tooltip/          # KIT-06 Ark Tooltip (focus + hover, reduced-motion)
├── Popover/          # KIT-06 Ark Popover (return focus, Esc, no trap)
├── AsyncBoundary/    # SURF-18 state union → primitive seam
├── ToastManager/     # D-06 createToaster wrapping the existing Toast leaf (or colocate in Toast/)
└── _i18n/            # KIT-08 i18n harness: i18n instance, catalogs (ru/en), Register augmentation
```

### Pattern 1: tv()-per-Ark-part wrapper (the D-01 boundary)
**What:** Each Ark anatomy part gets a `className` from a `tv()` recipe consuming `@theme` tokens. Controlled props in; `data-*` hooks; no i18n/business imports.
**When to use:** Every Ark slice.
```tsx
// Source: ark-ui.com/docs/components/dialog (anatomy parts + className), shaped to the
// Phase-2 tv()/lite + control.ts precedent (Button.tsx). [CITED]
import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { tv } from "tailwind-variants/lite";

const dialog = tv({
  slots: {
    backdrop: "fixed inset-0 bg-overlay",
    positioner: "fixed inset-0 flex items-center justify-center p-4",
    content: "bg-surface-1 border border-border-2 rounded-xl shadow-lg p-6",
    title: "font-body text-lg font-semibold text-text-primary",
  },
});

// open + onOpenChange = controlled (forced-open StateMatrix cell passes `open`); lazyMount
// + unmountOnExit keep the portal out of the DOM while closed.
export function Dialog_({ open, onOpenChange, title, children, closeAria }: Props) {
  const s = dialog();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} lazyMount unmountOnExit>
      <Portal>
        <Dialog.Backdrop className={s.backdrop()} />
        <Dialog.Positioner className={s.positioner()}>
          <Dialog.Content className={s.content()} data-dialog>
            <Dialog.Title className={s.title()}>{title}</Dialog.Title>
            {children}
            <Dialog.CloseTrigger aria-label={closeAria} /* … */ />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
```

### Pattern 2: Field wrapper with forced-invalid (KIT-05 + StateMatrix axe gate)
```tsx
// Source: ark-ui.com/docs/components/field — Field.Root broadcasts invalid/required/
// disabled/readOnly to the nested control via context; Field.ErrorText renders only when
// invalid. `invalid` is the forced-validation StateMatrix cell. [CITED]
import { Field } from "@ark-ui/react/field";

export function Field_({ label, invalid, required, errorText, children, helperText }: Props) {
  return (
    <Field.Root invalid={invalid} required={required}>
      <Field.Label>{label}</Field.Label>
      {children /* Input / Select / NumberInput inherits invalid via context */}
      {helperText ? <Field.HelperText>{helperText}</Field.HelperText> : null}
      {/* ErrorText is the announced error; pair with a Lucide icon — never color-alone */}
      <Field.ErrorText aria-live="polite">{errorText}</Field.ErrorText>
    </Field.Root>
  );
}
```

### Pattern 3: Lingui runtime catalog from the STRINGS seed (KIT-08)
```ts
// shared/uikit/_i18n/catalogs.ts — runtime mode: plain {id → ICU message} maps.
// Migrate STRINGS (Record<string, Bilingual>) into two locale maps. Source:
// lingui.dev/ref/core (i18n.load/activate/_) + lingui.dev/guides/explicit-vs-generated-ids. [CITED]
import { STRINGS } from "../_fixtures/strings"; // or move into _i18n and retire the fixture

export const ru = Object.fromEntries(Object.entries(STRINGS).map(([k, v]) => [k, v.ru]));
export const en = Object.fromEntries(Object.entries(STRINGS).map(([k, v]) => [k, v.en]));
// Plural strings carry ICU directly, e.g.:
//   filteredEmpty: "{n, plural, one{Никто…} few{Никого…} many{Никого…} other{Никого…}}"

// shared/uikit/_i18n/i18n.ts
import { i18n } from "@lingui/core";
i18n.load({ ru, en });
i18n.activate("ru"); // RU primary
export { i18n };

// usage in a story (NOT inside the primitive — primitive stays i18n-free):
//   i18n._({ id: "selectPlaceholder" })
//   i18n._({ id: "filteredEmpty", values: { n: 1204 } })
```

```ts
// shared/uikit/_i18n/lingui.d.ts — typed keys: a missing id is a tsc error (localization.md).
// Source: lingui.dev typed message IDs (Register interface augmentation). [CITED]
import type { STRINGS } from "../_fixtures/strings";
declare module "@lingui/core" {
  interface Register {
    messageIds: keyof typeof STRINGS;
  }
}
```

### Pattern 4: Ladle language switch (GlobalProvider reads a global control)
```tsx
// .ladle/components.tsx — read the locale control from globalState, activate the locale,
// wrap in I18nProvider. Source: ladle.dev/docs/providers (GlobalProvider gets globalState)
// + ladle.dev/docs/controls (global control). [CITED]
import type { GlobalProvider } from "@ladle/react";
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
> The locale control is declared either via a global control in `.ladle/config.mjs`/`addons`, or via a small custom addon button using `useLadleContext()` `dispatch`. The `theme` addon already in `config.mjs` (`addons.theme`, disabled) is the precedent for a global toggle. Simplest stable path: a custom addon button that dispatches an `UpdateControl`-style action, read back in the GlobalProvider. **Discretion (D-04):** the planner picks global-control-arg vs custom-addon-button; both are version-stable in 5.1.1.

### Anti-Patterns to Avoid
- **`asChild` for plain styling.** Use `className` per part. Reserve `asChild` for slotting the shared `Button`/`Link` `control` recipe into an Ark trigger (e.g. `Menu.Trigger asChild`).
- **i18n imports inside a `shared/uikit` primitive.** Resolve strings in the *story* and pass them as props (architecture.md uikit boundary). The primitive takes `message: string`, never an i18n key.
- **Macro mode (`t`/`<Trans>` children) in v0.1.** Needs a babel/SWC plugin in the Ladle build — avoid (see landmines).
- **A passed `className` assumed to beat a `tv()/lite` base.** The build is merge-free; hold mutually-exclusive utilities as variants or use `!`-override (styling.md; the `FORCED_STATE !`-override precedent for StateMatrix cells).
- **Rebuilding the Phase-2 state primitives.** SURF-18 composes `Skeleton`/`EmptyState`/`ErrorState`/`DataTrustBanner`; it does not re-implement them.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trap, return-focus, Esc-close, scroll-lock, inert background | Custom dialog focus logic | Ark `Dialog` (`trapFocus`, returns focus, Esc, portal) | Edge cases (iframe focus, nested overlays, SR announcement) are why Ark exists; a11y.md says prefer the Ark primitive |
| Roving tabindex / arrow-key menu+tabs+select navigation | Hand keydown handlers | Ark `Menu`/`Tabs`/`Select` | Home/End/type-ahead/wrap semantics + `aria-expanded`/`aria-controls` are built in |
| Toast portal/queue/stacking/auto-dismiss/pause-on-hover | Custom toaster | Ark `createToaster` + `<Toaster>` render-prop | D-06; manager handles lifecycle, your existing `Toast` leaf stays the visual |
| ICU plural (RU one/few/many), number/date locale formatting | String concatenation / manual `Intl` branching | Lingui `i18n` (ICU in the message string) | RU plural rules + decimal-comma + hydration-safe formatting; localization.md bans concatenation |
| Typed i18n keys (missing key = error) | A parallel hand-maintained key enum | Lingui `Register` augmentation + `keyof typeof STRINGS` | One source; tsc narrows every `i18n._` id |
| File dropzone (drag/drop, file picker, accept filtering) | Div-only drag target | Ark `FileUpload` (focusable dropzone, Trigger, ItemGroup) | Keyboard-accessible dropzone + per-file state; a div-drag-only target fails KIT-05 |

**Key insight:** This phase is almost entirely "wrap the headless primitive in a `tv()` recipe and resolve strings in the story." The accessibility and lifecycle complexity that would tempt a hand-rolled solution is exactly what Ark UI and Lingui already solved; the slice's only job is visual tokens + `data-*` hooks + controlled props.

## Common Pitfalls

### Pitfall 1: Lingui macros silently no-op in the Ladle build
**What goes wrong:** Author uses `t`/`<Trans>Hello</Trans>` macros; without a babel/SWC macro plugin wired into Ladle's Vite React plugin, macros throw syntax errors or extract 0 messages.
**Why it happens:** Macros are bundler transforms; Ladle's default `@vitejs/plugin-react` has no Lingui babel plugin.
**How to avoid:** Use **runtime mode** — explicit `i18n._({ id, message, values })` and non-macro `<Trans id values>`. No transform needed. (If a future phase wants macros, Ladle supports a custom `vite.config.ts` React plugin with babel presets — but not this phase.)
**Warning signs:** "Uncompiled message detected", "Extract is finding 0 messages", macro import errors.

### Pitfall 2: Forced overlay state in the static grid done with a Ladle hack
**What goes wrong:** Author tries to force a Dialog open for the screenshot/axe cell via global state or a setTimeout.
**Why it happens:** Assuming overlays are uncontrolled.
**How to avoid:** Pass the controlled `open` (or `defaultOpen`) prop in the StateMatrix cell — Ark renders the open overlay deterministically. Same for `Field.Root invalid` (forced validation). No Ladle mechanism needed for forcing state — only for the *locale* toggle.
**Warning signs:** Flaky screenshots, axe running before the overlay mounts.

### Pitfall 3: Portal content escapes the Tailwind `@source` scan
**What goes wrong:** Ark `Portal` mounts dialog/menu/toast content into `document.body`; if Tailwind's source scan misses those class strings they're tree-shaken and the overlay renders unstyled.
**Why it happens:** The Ladle `tailwind.css` `@source "../src"` scans source files, not the runtime DOM — but since the `tv()` recipes live in `../src`, the classes ARE scanned at build. The risk is only dynamically-constructed class strings.
**How to avoid:** Keep all overlay classes literal in `tv()` recipes under `src/` (the existing discipline). Verify the portal content paints in a real-browser Playwright check (the Phase-1 dark-base lesson: a class only on the GlobalProvider was tree-shaken).
**Warning signs:** Unstyled dialog/menu/toast in preview; classes present in source but absent from built CSS.

### Pitfall 4: `tv()/lite` merge-free override loses on forced cells
**What goes wrong:** A StateMatrix forced cell overrides a base utility via `className` and silently loses (CSS source order wins, not class-attribute order).
**Why it happens:** This repo imports `tv` from `tailwind-variants/lite` (no tailwind-merge).
**How to avoid:** Use the `FORCED_STATE` `!`-override precedent (established Phase 2) so a forced cell mirrors the live recipe; keep a `*.test.ts` asserting forced ≡ live (UI-SPEC §Per-Component States).
**Warning signs:** Forced "focused"/"invalid" cell looks identical to enabled.

### Pitfall 5: FileUpload object-URL leak / SVG upload
**What goes wrong:** Image preview via `URL.createObjectURL` is never revoked (memory leak); SVG upload is an XSS vector.
**How to avoid:** Revoke object URLs on unmount; disallow SVG in the accept filter (UI-SPEC KIT-05; security.md). Client validation is UX-only — the real gate is `server-2` (v1.0).
**Warning signs:** Growing memory across uploads; SVG in the accept list.

### Pitfall 6: RU plural via concatenation / missing plural category
**What goes wrong:** RU needs one/few/many/other; using EN's one/other drops the "few"/"many" forms and reads wrong.
**How to avoid:** Author the full ICU `{n, plural, one{} few{} many{} other{}}` in the RU message string. Lingui parses it at runtime via CLDR plural rules. Never `count + " " + word`.
**Warning signs:** "1 реплей / 2 реплей / 5 реплей" all identical; missing `few`/`many` arms.

## Runtime State Inventory

> Not a rename/refactor/migration phase. The one migration-shaped task is the `STRINGS` → Lingui catalog move:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no datastore; strings are a source `Record` | code edit only |
| Live service config | None | — |
| OS-registered state | None | — |
| Secrets/env vars | None | — |
| Build artifacts | The `_fixtures/strings.ts` `STRINGS` seed is imported by Phase-2 stories | Migrate to `id→message` maps; keep `STRINGS` (or re-home it under `_i18n/`) as the typed source for both the catalog maps AND the `Register` `messageIds` union, so existing Phase-2 story imports don't break. **Do not delete it — derive from it.** |

## Code Examples

### Ark NumberInput → Stepper (tabular mono value)
```tsx
// Source: ark-ui.com/docs/components/number-input — control with string value via
// value/onValueChange; parts: Root/Label/Control/Input/IncrementTrigger/DecrementTrigger. [CITED]
import { NumberInput } from "@ark-ui/react/number-input";
// value is a STRING (Ark recommendation); inc/dec triggers need aria-label (icon-only);
// the Input uses the mono/stat role (font-mono text-base, tabular-nums).
<NumberInput.Root value={value} onValueChange={(d) => onChange(d.value)}>
  <NumberInput.Label>{label}</NumberInput.Label>
  <NumberInput.Control>
    <NumberInput.Input className="font-mono text-base tabular-nums …" />
    <NumberInput.DecrementTrigger aria-label={decrementAria} />
    <NumberInput.IncrementTrigger aria-label={incrementAria} />
  </NumberInput.Control>
</NumberInput.Root>
```

### Toast: createToaster reusing the existing leaf (D-06)
```tsx
// Source: ark-ui.com/docs/components/toast — createToaster(options) returns a toaster
// instance; <Toaster toaster={toaster}> takes a render prop receiving each toast. Render
// YOUR OWN leaf inside it; you do NOT have to use Ark's Toast.Root/Title parts. [CITED]
import { Toaster, createToaster } from "@ark-ui/react/toast";
import { Toast } from "../Toast"; // the existing styled visual leaf

export const toaster = createToaster({ placement: "bottom-end", overlap: true, gap: 12, max: 4 });

export function ToastViewport() {
  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        // Ark gives positioning/lifecycle; the existing <Toast> is the visual leaf.
        <Toast
          variant={toast.type as ToastVariant}
          message={toast.title ?? ""}
          action={/* map toast.action → {label, onClick: () => toaster.dismiss(toast.id)} */}
        />
      )}
    </Toaster>
  );
}
// trigger from a Playground story button:  toaster.create({ title: "…", type: "success" })
```
> **Verdict (D-06): NO re-expression needed.** `createToaster` slots the existing `Toast/Toast.tsx` as the render-prop child. Two small adaptations: (1) the dismiss affordance gets `toastDismiss` aria and calls `toaster.dismiss(toast.id)`; (2) confirm the render-prop `toast` shape (`type`/`title`/`description`/`action`) against the installed 5.37.2 d.ts and map it onto the leaf's `variant`/`message`/`action` props. The leaf stays presentational; the manager owns portal/queue/auto-dismiss/stacking.

### AsyncBoundary state → primitive seam (SURF-18, D-05)
```tsx
// Discretion (D-05): discriminated state union → the right Phase-2 primitive, reserved height.
type AsyncState =
  | { kind: "loading" } | { kind: "empty" } | { kind: "error"; id?: string }
  | { kind: "offline" } | { kind: "reconnecting" } | { kind: "stale" }
  | { kind: "ready"; children: ReactNode };
// loading→Skeleton, empty→EmptyState, error→ErrorState, offline/reconnecting/stale→DataTrustBanner
// (BannerKind already maps these three). Every branch reserves final height (CLS=0),
// never color-alone (icon+text already in the primitives).
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Lingui v5 (CJS/ESM dual, Node 18) | **Lingui v6 (ESM-only, Node 22.19+/24+)** | 2026-04-22 | Node 25.9.0 OK; ESM-only matches this ESM workspace; smaller install. `[CITED: lingui.dev v6 announcement]` |
| Ark UI v4 anatomy | **Ark v5 part-based + `className` per part** | v5 line | The `tv()`-per-part wrapping the D-01 boundary expects; `asChild` available but optional |
| `intl-messageformat` + typed-map / `typesafe-i18n` | **Lingui** (user-selected) | D-03 | Single ICU-capable lib with CLI extract/compile + typed `Register` keys |

**Deprecated/outdated:**
- Lingui macro mode as the *default* path here — viable but deliberately avoided in v0.1 (no babel in the stack).
- Ark `asChild`-everywhere styling — superseded by part-level `className`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@lingui/react`/`@lingui/cli`/`@lingui/format-po`/`@lingui/vite-plugin` are all on the `6.4.x` line matching `@lingui/core@6.4.0` | Standard Stack | LOW — single monorepo, lockstep releases; executor confirms patch via `npm view` at install |
| A2 | `@ark-ui/react@5.37.2` peer `react >=18` includes 19.2 with no runtime issue on React 19.2 | Standard Stack | LOW — peer range explicit; Ark publishes React-19-tested releases. Verify with a smoke story render |
| A3 | The `createToaster` render-prop `toast` object exposes `type`/`title`/`description`/`action` mappable onto the existing leaf | Toast verdict | LOW-MED — confirm against the installed 5.37.2 `.d.ts`; adapt the mapping if field names differ |
| A4 | Ladle 5.1.1 `globalState.control` exposes a custom locale control readable in the GlobalProvider | Ladle switch | MED — if the global-control arg path differs in 5.1.1, fall back to a custom addon button via `useLadleContext()` dispatch (both documented). Planner's discretion (D-04) |
| A5 | Runtime-mode `<Trans id>` (non-macro) + `i18n._` fully satisfy KIT-08 without any macro plugin | Lingui recipe | LOW — confirmed via Lingui core/explicit-ids docs |

**If A3/A4 surface differently at install:** they are mechanical adaptations within the locked decisions, not decision re-opens.

## Open Questions

1. **Catalog source format — hand-authored maps vs `.po` + CLI extract/compile?**
   - What we know: Both produce the runtime `{id→ICU}` map KIT-08 needs; `STRINGS` migrates either way.
   - What's unclear: Whether v0.1 wants the full `lingui extract`/`compile` pipeline now or the leaner hand-authored maps (CLI is the v1.0 graduation target).
   - Recommendation: Hand-author the two locale maps derived from `STRINGS` for v0.1 (lean, no extra build wiring); add the `@lingui/cli` extract/compile pipeline at v1.0. Flag as planner's call — does not affect the primitives.

2. **Locale toggle: global control arg vs custom addon button.**
   - What we know: Both are version-stable in Ladle 5.1.1; the GlobalProvider reads `globalState` either way.
   - Recommendation: Custom addon button (mirrors the disabled `theme` addon precedent) for a visible RU↔EN switch; planner decides (D-04).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node | Lingui v6 (≥22.19/24) | ✓ | 25.9.0 | — |
| pnpm | workspace install | ✓ | 11.6.0 | — |
| `@ark-ui/react` | KIT-05/06, Toast | ✗ (to add) | 5.37.2 | none — brief-locked, must install |
| `@lingui/core`+`react` | KIT-08 | ✗ (to add) | 6.4.x | none — must install |
| `@lingui/cli` | catalog compile (if used) | ✗ (to add, devDep) | 6.4.x | hand-author the catalog maps |
| Playwright + `@axe-core/playwright` | QUAL-03 gate | ✓ | 1.61.0 / 4.11.3 | — |
| Ladle | catalog + harness | ✓ | 5.1.1 | — |
| Vitest | forced≡live unit tests | ✓ | 4.1.9 | — |

**Missing dependencies with no fallback:** `@ark-ui/react`, `@lingui/core`, `@lingui/react` — all brief-locked/user-selected; install is the first task.
**Missing dependencies with fallback:** `@lingui/cli` — fall back to hand-authored catalog maps for v0.1.

## Validation Architecture

> Nyquist validation enabled. The Phase-2 Playwright-against-Ladle + axe harness is the established mechanism; every new story flows through `catalog.spec.ts` automatically (it reads `build/meta.json`). New behavior specs extend `keyboard.spec.ts`.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.61.0 (against built Ladle catalog) + `@axe-core/playwright` 4.11.3; Vitest 4.1.9 for pure-logic/forced≡live |
| Config file | `packages/design/playwright.config.ts` (globalSetup `ladle build`, preview server port 61000, chromium local + firefox/webkit/mobile-360 in CI) |
| Quick run command | `pnpm --filter @solid-stats/design test` (Vitest) |
| Full suite command | `pnpm --filter @solid-stats/design test:e2e` (Playwright) |

### Phase Requirements → Test Map (against ROADMAP SC#1–4)
| SC / Req | Behavior | Test Type | Automated Command | File Exists? |
|----------|----------|-----------|-------------------|-------------|
| SC#1 / KIT-06 | Every overlay: trap-free Tab cycle, Esc-to-close, focus returns to trigger, `aria-expanded`/`aria-controls` | e2e | `pnpm exec playwright test tests/keyboard.spec.ts` (extend) | ⚠️ extend `keyboard.spec.ts` |
| SC#1 / KIT-05 | Form live-region announcement on forced-invalid; `Field.ErrorText` present + associated | e2e | `playwright test tests/keyboard.spec.ts` (extend) | ⚠️ extend |
| SC#1 / QUAL-03 | axe-clean (serious/critical) on every story incl. **forced-open overlays + forced-invalid fields** | e2e | `playwright test tests/catalog.spec.ts` | ✅ auto-picks up new stories via `meta.json` |
| SC#1 / QUAL-03 | ≥44px on every Ark trigger/option/tab/inc-dec control | e2e | `playwright test tests/catalog.spec.ts` | ✅ existing 44px assertion |
| SC#1 / QUAL-03 | Visible focus on every control; focus not obscured | e2e | `keyboard.spec.ts` pattern (box + computed shadow) | ⚠️ extend per overlay |
| SC#2 / QUAL-04 | CLS = 0 — overlays animate transform/opacity only; AsyncBoundary reserves height | e2e | `playwright test tests/cls.spec.ts` (extend for AsyncBoundary) | ✅ `cls.spec.ts` exists |
| SC#2 / QUAL-02 | Real mobile-floor 360 width; container-query reflow | e2e | `playwright test tests/responsive.spec.ts` | ✅ exists (360 floor wired) |
| SC#3 / SURF-18 | Six named states each render the right primitive with reserved space, never color-alone | e2e | `catalog.spec.ts` (axe) + a forced-cell screenshot story | ⚠️ add AsyncBoundary stories |
| SC#4 / QUAL-05 | RU + EN both render; missing key = **tsc error**; RU longest-label no-clip | type + e2e | `tsc` (build) for keys; `responsive.spec` at 360 for RU clip | ⚠️ add `lingui.d.ts` Register; RU-clip story |
| SC#1 | Forced StateMatrix cell ≡ live recipe (merge-free `!`-override) | unit | `pnpm --filter @solid-stats/design test` (`*.test.ts`) | ⚠️ add per-slice forced≡live test (Button `control.test.ts` precedent) |

### Sampling Rate
- **Per task commit:** `pnpm --filter @solid-stats/design test` (Vitest forced≡live + logic).
- **Per wave merge:** `pnpm --filter @solid-stats/design test:e2e` (catalog axe/44px/keyboard + the new behavior specs).
- **Phase gate:** Full Playwright suite green + `tsc` green (typed-key proof) before `/gsd-verify-work`; design-review (`solidstats-frontend-react-design-review`) seven-pillar pass.

### Wave 0 Gaps
- [ ] `tests/keyboard.spec.ts` — extend with overlay specs (Dialog Esc-close + return-focus; Menu `aria-expanded`/`aria-controls`; Tabs roving tabindex; trap-free Tab cycle) and form live-region/`Field.ErrorText` announcement.
- [ ] `tests/cls.spec.ts` — extend for `AsyncBoundary` reserved-height (six states, CLS=0).
- [ ] `src/shared/uikit/_i18n/lingui.d.ts` — `Register` augmentation so a missing key trips `tsc` (KIT-08 / SC#4).
- [ ] Per-slice `*.test.ts` — forced≡live assertion for each forced StateMatrix cell (Vitest; `control.test.ts` precedent).
- [ ] A RU-longest-label story at 360px (QUAL-05 clip check) — «Перетащите изображение или выберите файл», «Войти через Steam».
- [ ] No new framework install needed — Playwright/axe/Vitest/Ladle all present.

## Project Constraints (from AGENTS.md / conventions)

- **`shared/uikit` boundary:** generic primitives only; no `pages`/business/page-localization imports; props-down; controlled props + accessible names + disabled behavior (architecture.md). i18n keys resolve in the *story*, not the primitive.
- **Styling:** Tailwind v4 `@theme` via `tv()` from `tailwind-variants/lite` (merge-free); **no arbitrary values**; never hand-edit `theme.css`; `cursor-pointer` single-sourced on the shared `control` recipe (styling.md). All interactive tokens the phase needs are already emitted in `theme.css` (`--color-overlay`, `--shadow-ring`, `--shadow-ring-glow`, `--shadow-md/lg`, `--color-surface-1/2/3`, `--color-border-1/2`, `--color-primary-border`, `--radius-sm/lg/xl`) — **do not extend `gen-theme.mjs`** unless a genuinely new token is needed; the `input`/`dialog`/`popover` `components.*` recipes in `DESIGN.md` are NOT yet emitted, so style via `tv()` against the existing base tokens (UI-SPEC).
- **a11y (QUAL-03):** WCAG 2.2 AA; icon-only controls need accessible names; no keyboard traps; visible focus not obscured; never color-alone (status color always paired with Lucide icon/label); ≥44px; honor `prefers-reduced-motion`; live-regions don't steal focus (a11y.md).
- **Localization (KIT-08):** typed keys (missing = tsc error), ICU (RU one/few/many), RU/EN parity, no hardcoded strings, no concatenation plurals (localization.md).
- **Errors (SURF-18):** distinguish user error (by-field, names the fix) from system error (request `{id}` + contact); no raw error strings; never a blank screen (errors.md).
- **Forms (v1.0 note):** TanStack Form + `zod/v4-mini` is the v1.0 composition layer; this phase ships only the presentational `Field` live-region seam, not a wired mutation (forms.md).
- **Lingui core-mode only (D-03):** no router coupling; `/ru` `/en` routing is v1.0.

## Sources

### Primary (HIGH confidence)
- `npm view @ark-ui/react` — version 5.37.2, peer `react >=18` / `react-dom >=18`, published 2026-06-08 (direct registry read this session).
- `npm view @lingui/core` — version 6.4.0 (direct registry read this session).
- Repo code read directly: `packages/design/package.json`, `theme.css`, `_fixtures/strings.ts`, `_state-matrix/StateMatrix.tsx`, `Toast/Toast.tsx`, `Button/Button.tsx`, `index.ts`, `.ladle/{config.mjs,components.tsx,tailwind.css}`, `playwright.config.ts`, `tests/{catalog,keyboard}.spec.ts`, all `conventions/references/patterns/*.md`, `design/references/{spec-template,pipeline}.md`.

### Secondary (MEDIUM confidence — official docs via WebSearch result digests; WebFetch/TLS was sandbox-blocked)
- ark-ui.com/docs/components/{toast,dialog,popover,tooltip,number-input,field,select,file-upload} — anatomy parts, `className` per part, `open`/`onOpenChange`/`defaultOpen`, `lazyMount`/`unmountOnExit`, `Field.Root invalid`, `createToaster` render-prop.
- lingui.dev — v6 announcement (2026-04-22, ESM-only, Node 22.19+/24+), `/ref/core` (i18n.load/activate/_), `/guides/explicit-vs-generated-ids`, `/guides/plurals`, `/ref/vite-plugin`, typed `Register` message IDs, `/ref/cli` (extract/compile).
- ladle.dev/docs/{providers,controls,config,decorators} — GlobalProvider receives `globalState`+`dispatch`, `useLadleContext`, custom `vite.config.ts` React plugin support.

### Tertiary (LOW confidence)
- Sibling `@lingui/*` exact patch versions (inferred lockstep with `@lingui/core@6.4.0`; confirm at install).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@ark-ui/react@5.37.2` + `@lingui/core@6.4.0` directly verified; siblings lockstep (confirm patch at install).
- Architecture / integration mechanics: HIGH — Ark controlled-props, `Field invalid`, `createToaster` render-prop, Lingui runtime mode + typed `Register`, Ladle GlobalProvider all confirmed against official-doc digests and matched to the repo's existing patterns.
- Pitfalls: HIGH — macro-vs-runtime, forced-state, portal `@source`, merge-free override, object-URL/SVG, RU plural all grounded.

**Research date:** 2026-06-24
**Valid until:** 2026-07-24 (stable libs; re-confirm `@ark-ui/react` and `@lingui/*` patch versions at install — Ark releases weekly).
