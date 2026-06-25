// KIT-06 — the `menu` recipe (Plan 03-06, Wave 6). One `tv({ slots })` per Ark Menu anatomy
// part used (RESEARCH Don't-Hand-Roll; PATTERNS tv-recipe-per-part) — `className` per part,
// NEVER `asChild` for styling (RESEARCH Anti-Patterns; `asChild` is used ONLY to slot the
// shared `Button` into the trigger, in Menu.tsx). Same discipline as the Dialog/Popover
// recipes: `/lite` merge-free, literal class strings the `@source` scan picks up even through
// the Portal (RESEARCH Pitfall 3), ONLY emitted `@theme` tokens, NO arbitrary values
// (styling.md). Transform/opacity-only animation (CLS = 0, QUAL-04), `motion-reduce:` drops it.
//
// The menu content is the popover-style surface (03-UI-SPEC KIT-06 → Menu): `surface-1` +
// `border-2` hairline + `rounded-lg` + `--shadow-md` — the same floating elevation as the
// Popover. Items are ≥44px (`min-h-11`, a11y.md 2.5.5) with a `surface-3` hover; the
// HIGHLIGHTED item (Ark's roving keyboard highlight, exposed as `data-highlighted`) goes cyan
// (`text-primary`) PAIRED with the highlighted state + a `surface-3` fill — never color-alone
// (a11y.md). Ark owns roving tabindex + Home/End/type-ahead + Esc + aria-expanded/controls; the
// recipe only paints.
//
// Slots:
//   positioner — the Ark floating-UI positioner wrapper (no paint); `z-modal` to layer above
//                the page chrome.
//   content    — the floating menu surface: `surface-1` + `border-2` + `rounded-lg` +
//                `--shadow-md`, a thin padding gutter. Opacity + small scale-in (transform only).
//   item       — a ≥44px row (`min-h-11`): muted resting text, `surface-3` hover, and the
//                Ark-highlighted state (`data-[highlighted]`) goes cyan + `surface-3` fill
//                (the keyboard/pointer highlight — paired, never color-alone).
//   itemGroup  — an optional group wrapper (no paint of its own beyond a small gap).
//   separator  — a hairline divider between groups (`border-2` token).
import { tv } from "tailwind-variants/lite";

export const menu = tv({
  slots: {
    positioner: "z-modal",
    content:
      "flex min-w-48 flex-col gap-0.5 rounded-lg border border-border-2 bg-surface-1 p-1 shadow-md transition duration-150 focus-visible:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 motion-reduce:transition-none motion-reduce:data-[state=closed]:scale-100",
    item: "flex min-h-11 cursor-pointer items-center rounded-sm px-3 font-body text-sm text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:outline-none data-[highlighted]:bg-surface-3 data-[highlighted]:text-primary",
    itemGroup: "flex flex-col gap-0.5",
    separator: "my-1 border-t border-border-2",
  },
});
