// KIT-05 — the `input` control recipe (Plan 03-02, Wave 2). Maps the DESIGN.md `input`
// recipe literally onto emitted `@theme` tokens (03-UI-SPEC KIT-05): `surface-2` fill, a
// `border-1` hairline that brightens to `border-2` on hover, and `primary-border` +
// `ring-glow` on focus-visible (the input focus treatment — distinct from the control's
// `--shadow-ring`; the glow reads the `--shadow-ring-glow` @theme var via the sanctioned
// `shadow-(--var)` escape, NOT an arbitrary `[...]` value — styling.md). Placeholder is the
// ONE sanctioned `text-subtle`. `disabled` = `surface-1` + `text-subtle` + 0.6 opacity.
//
// Same discipline as `Button/control.ts`: `/lite` (tailwind-merge-free), literal class
// strings for the `@source` scan, NO arbitrary values, `min-h-11` (≥44px target floor,
// a11y.md). The `input`/`dialog`/`popover` `components.*` recipes are NOT emitted into
// theme.css (RESEARCH Project Constraints) — style via tv() against the base tokens, no
// gen-theme.mjs change.
import { tv } from "tailwind-variants/lite";

export const input = tv({
  base: "min-h-11 w-full rounded-sm border border-border-1 bg-surface-2 px-3 font-body text-base text-text-primary transition-colors placeholder:text-text-subtle hover:border-border-2 focus-visible:border-primary-border focus-visible:shadow-(--shadow-ring-glow) focus-visible:outline-none",
  variants: {
    disabled: {
      true: "pointer-events-none bg-surface-1 text-text-subtle opacity-60",
      false: "",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});
