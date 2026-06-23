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

/** Content justification — `center` for the button affordance, `start`/`end` for the
 *  segment / sort-header member whose label aligns with the column edge. */
export type ButtonJustify = "center" | "start" | "end";

export const control = tv({
  // The shared shape + the ONE canonical focus ring + the ≥44px floor. Press feedback
  // is the per-variant `active:` BACKGROUND shift only — NO positional translate (the
  // 1px depress was dropped: it fought the stable/dense bar and was applied
  // inconsistently across variants). DESIGN.md `active` rows carry no `transform`.
  // `cursor-pointer` on the base is a deliberate product decision (Plan 02-07): every
  // interactive control shows the hand cursor, overriding the native button default-arrow
  // convention. It lands once here so all variants + all refactored controls inherit it;
  // the `disabled` variant's `pointer-events-none` already suppresses the cursor (no
  // `cursor-not-allowed` — a disabled control takes no pointer at all).
  base: "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-sm font-body font-semibold transition-colors focus-visible:outline-none focus-visible:shadow-(--shadow-ring)",
  variants: {
    variant: {
      // per DESIGN.md button-primary
      primary: "bg-primary text-fg-on-accent hover:bg-primary-hover active:bg-primary-active",
      // per DESIGN.md button-secondary
      secondary:
        "border border-border-1 bg-surface-1 text-text-primary hover:border-border-2 hover:bg-surface-3 active:bg-surface-2",
      // per DESIGN.md button-ghost
      ghost:
        "bg-transparent text-text-muted hover:bg-surface-1 hover:text-text-primary active:bg-surface-2",
      // The segmented-control / sortable-header member (the Th precedent): muted by
      // default, the active member goes cyan (paired with aria-sort / the arrow —
      // never color-alone). No press translate (consistent with the family).
      segment: "text-text-muted hover:text-text-primary",
    },
    size: {
      // `md` is the default control padding; `sm` is tighter horizontally but holds
      // the 44px floor from `base` (min-h-11) — only padding/font differ.
      md: "px-4 text-sm",
      sm: "px-3 text-xs",
    },
    // Content justification. Default-centered (the button affordance); the segment /
    // sort-header member overrides to `start`/`end` (the label sits with the numeric
    // column edge). Held as a variant so the merge-free `/lite` build never emits two
    // conflicting `justify-*` utilities.
    justify: {
      center: "justify-center",
      start: "justify-start",
      end: "justify-end",
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
    justify: "center",
    active: false,
    disabled: false,
  },
});

/**
 * Forced-state mirror for the catalog `StateMatrix` story. Each entry MUST equal the live
 * `:hover` / `:active` / `:focus-visible` utilities the recipe above applies for that
 * variant — pseudo-prefix dropped, `!` (important) added so the forced cell
 * deterministically overrides the variant's resting background in the merge-free `/lite`
 * build (a plain utility loses to the base by stylesheet order, which is how the old
 * variant-agnostic map rendered primary "hover" as grey, never the real cyan). It is a
 * literal map because Tailwind's static `@source` scan can't see runtime-derived classes.
 * `control.test.ts` asserts this stays in sync with the recipe. CATALOG-ONLY — never put
 * an `!`-important state utility on a shipped control.
 */
export const FORCED_STATE: Record<
  ButtonVariant,
  Record<"hover" | "pressed" | "focused", string>
> = {
  primary: {
    hover: "bg-primary-hover!",
    pressed: "bg-primary-active!",
    focused: "shadow-(--shadow-ring)! outline-none!",
  },
  secondary: {
    hover: "border-border-2! bg-surface-3!",
    pressed: "bg-surface-2!",
    focused: "shadow-(--shadow-ring)! outline-none!",
  },
  ghost: {
    hover: "bg-surface-1! text-text-primary!",
    pressed: "bg-surface-2!",
    focused: "shadow-(--shadow-ring)! outline-none!",
  },
  segment: {
    hover: "text-text-primary!",
    pressed: "",
    focused: "shadow-(--shadow-ring)! outline-none!",
  },
};
