// KIT-06 — the `popover` recipe (Plan 03-05, Wave 5). One `tv({ slots })` per Ark Popover
// anatomy part used (RESEARCH Don't-Hand-Roll; PATTERNS tv-recipe-per-part) — `className`
// per part, NEVER `asChild` for styling (RESEARCH Anti-Patterns). Same discipline as the
// Dialog recipe: `/lite` merge-free, literal class strings the `@source` scan picks up even
// through the Portal (RESEARCH Pitfall 3), ONLY emitted `@theme` tokens, NO arbitrary values
// (styling.md). Transform/opacity-only animation (CLS = 0, QUAL-04), `motion-reduce:` drops it.
//
// The popover is the NON-modal sibling of the Dialog: lower elevation (`--shadow-md`, the
// floating-UI shadow, theme.css#L111) and a tighter radius (`rounded-lg`) than the modal's
// `--shadow-lg` + `rounded-xl` (03-UI-SPEC KIT-06). No backdrop scrim — it does not inert the
// page (Ark manages focus + Esc + return, no trap).
//
// Slots:
//   positioner — the Ark floating-UI positioner wrapper (no paint); `z-modal` to layer above
//                the page chrome.
//   content    — the floating surface: `surface-1` + `border-2` hairline + `rounded-lg` +
//                `--shadow-md`. Opacity + small scale-in (transform only).
//   title      — the popover heading (the dialog-title typography role, 03-UI-SPEC Typography).
//   body       — the popover body region (muted secondary text).
//
// No `arrow` slot: the connector arrow is purely decorative and its Ark size/bg/border are
// raw-literal CSS custom props (`[--arrow-size:…]`) that would breach the no-arbitrary-values
// rule (styling.md). A plain floating surface is fully KIT-06-compliant (surface-1 + border-2
// + rounded-lg + --shadow-md) — YAGNI, the arrow is not a contract requirement (component-shape.md).
import { tv } from "tailwind-variants/lite";

export const popover = tv({
  slots: {
    positioner: "z-modal",
    content:
      "flex w-64 flex-col gap-2 rounded-lg border border-border-2 bg-surface-1 p-4 shadow-md transition duration-150 focus-visible:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 motion-reduce:transition-none motion-reduce:data-[state=closed]:scale-100",
    title: "font-body text-sm font-semibold leading-snug text-text-primary",
    body: "font-body text-sm text-text-muted",
  },
});
