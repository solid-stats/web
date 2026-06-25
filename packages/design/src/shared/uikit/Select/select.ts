// KIT-05 — the `select` recipe (Plan 03-03, Wave 3). One `tv({ slots })` per Ark Select
// anatomy part used (RESEARCH Don't-Hand-Roll; PATTERNS tv-recipe-per-part) — `className`
// per part, NEVER `asChild` for styling (RESEARCH Anti-Patterns). Same discipline as
// `Input/input.ts` + `Button/control.ts`: `/lite` (the tailwind-merge-free build), literal
// class strings so Tailwind's static `@source` scan picks them up, ONLY emitted `@theme`
// tokens, NO arbitrary values (styling.md).
//
// Slots:
//   trigger       — the closed-control affordance, styled like the `input` recipe family
//                   (surface-2 fill, border-1 hairline → border-2 hover, primary-border +
//                   ring-glow on focus-visible). ≥44px (`min-h-11`). The chevron + the
//                   selected value sit on one row (inline-flex, justify-between).
//   valueText     — the selected value / placeholder text. `text-text-subtle` while empty
//                   (Ark sets `data-placeholder-shown` on the trigger; the placeholder copy
//                   is the input-family `text-subtle`).
//   indicator     — the trigger chevron (Lucide ChevronDown), muted, decorative.
//   positioner    — the Ark floating-UI positioner wrapper (no paint of its own).
//   content       — the popover surface: `surface-1` + `border-2` + `--shadow-md` (the
//                   floating-UI shadow — the ONLY shadow use; carried_forward theme.css#L111).
//   item          — one option row; hover `surface-3`; the active/selected option is
//                   `text-primary` (cyan) PAIRED with the `itemIndicator` check icon, so the
//                   selected state is never carried by color alone (a11y.md).
//   itemText      — the option label.
//   itemIndicator — the selected-option check (Lucide Check), cyan — the non-color carrier of
//                   the selected state.
import { tv } from "tailwind-variants/lite";

export const select = tv({
  slots: {
    trigger:
      "inline-flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-sm border border-border-1 bg-surface-2 px-3 font-body text-base text-text-primary transition-colors hover:border-border-2 focus-visible:border-primary-border focus-visible:shadow-(--shadow-ring-glow) focus-visible:outline-none data-[disabled]:pointer-events-none data-[disabled]:bg-surface-1 data-[disabled]:text-text-subtle data-[disabled]:opacity-60 data-[placeholder-shown]:text-text-subtle",
    valueText: "truncate text-left",
    indicator: "size-4 shrink-0 text-text-muted",
    positioner: "z-modal",
    content:
      "flex max-h-64 min-w-(--reference-width) flex-col gap-0.5 overflow-y-auto rounded-lg border border-border-2 bg-surface-1 p-1 shadow-md focus-visible:outline-none",
    item: "flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-sm px-3 font-body text-sm text-text-primary transition-colors hover:bg-surface-3 data-[highlighted]:bg-surface-3 data-[state=checked]:text-primary data-[disabled]:pointer-events-none data-[disabled]:text-text-subtle data-[disabled]:opacity-60",
    itemText: "truncate",
    itemIndicator: "size-4 shrink-0 text-primary",
  },
});
