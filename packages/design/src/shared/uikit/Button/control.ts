// GAP-19 — the shared interactive `control` recipe behind both `Button` and `Link`.
// ONE `tv()` owns the ≥44px hit area (`min-h-11`, a11y.md 2.5.5 — non-negotiable),
// the ONE canonical focus ring (`focus-visible:shadow-(--shadow-ring)` reading the
// `@theme --shadow-ring` var — the sanctioned escape, the family precedent), and the
// per-variant token utilities sourced from the DESIGN.md `button-*` recipes. Before
// this, every interactive control re-implemented those by hand and the Toast action
// had drifted to a different ring; this recipe centralizes them so no control
// re-derives them.
//
// Variants map literally (styling.md — NO arbitrary values, NO raw hex):
//   primary   — per DESIGN.md button-primary  (cyan fill, fg-on-accent text)
//   secondary — per DESIGN.md button-secondary (surface-1 + hairline border)
//   ghost     — per DESIGN.md button-ghost     (transparent, muted → primary on hover)
//   segment   — the segmented-control / sort-header member (muted, active = cyan)
// `/lite` is the tailwind-merge-free build (the FreshnessPill/Th family precedent);
// class strings stay literal so the Tailwind `@source` scan picks them up.
import { tv } from "tailwind-variants/lite";

/** The base interactive variants. `segment` is the sort-header / segmented member. */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "segment";

/** The two sizes. Both stay ≥44px tall (the floor is non-negotiable) — `sm` differs
 *  only in horizontal padding / font size, never dropping below the 44px hit area. */
export type ButtonSize = "sm" | "md";

export const control = tv({
  // The shared shape + the ONE canonical focus ring + the ≥44px floor. Press =
  // translateY(1px) per the DESIGN.md `active` recipe row (applied per-variant where
  // the variant also shifts background).
  base: "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm font-body font-semibold transition-colors focus-visible:outline-none focus-visible:shadow-(--shadow-ring)",
  variants: {
    variant: {
      // per DESIGN.md button-primary
      primary:
        "bg-primary text-fg-on-accent hover:bg-primary-hover active:translate-y-px active:bg-primary-active",
      // per DESIGN.md button-secondary
      secondary:
        "border border-border-1 bg-surface-1 text-text-primary hover:border-border-2 hover:bg-surface-3 active:translate-y-px active:bg-surface-2",
      // per DESIGN.md button-ghost
      ghost:
        "bg-transparent text-text-muted hover:bg-surface-1 hover:text-text-primary active:bg-surface-2",
      // The segmented-control / sortable-header member (the Th precedent): muted by
      // default, the active member goes cyan (paired with aria-sort / the arrow —
      // never color-alone). Press nudges down to match the family.
      segment: "text-text-muted hover:text-text-primary active:translate-y-px",
    },
    size: {
      // `md` is the default control padding; `sm` is tighter horizontally but holds
      // the 44px floor from `base` (min-h-11) — only padding/font differ.
      md: "px-4 text-sm",
      sm: "px-3 text-xs",
    },
    /** The segment active member → cyan (the sorted column label). No-op elsewhere. */
    active: {
      true: "text-primary",
      false: "",
    },
    /** Shared non-interactive treatment (per the DESIGN.md `disabled` recipe rows). */
    disabled: {
      true: "pointer-events-none text-text-subtle opacity-60",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    active: false,
    disabled: false,
  },
});
