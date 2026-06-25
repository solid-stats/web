// KIT-05 — the `stepper` recipe (Plan 03-03, Wave 3). One `tv({ slots })` per Ark
// NumberInput anatomy part used (RESEARCH Don't-Hand-Roll; PATTERNS tv-recipe-per-part) —
// `className` per part, NEVER `asChild` for styling (RESEARCH Anti-Patterns). Same discipline
// as `Input/input.ts` + `Select/select.ts`: `/lite` (the tailwind-merge-free build), literal
// class strings so Tailwind's static `@source` scan picks them up, ONLY emitted `@theme`
// tokens, NO arbitrary values (styling.md).
//
// Slots:
//   control          — the row wrapper: the value input flanked by the dec/inc triggers, on
//                      one inline-flex row with the input-family fill + border (surface-2 +
//                      border-1 hairline → border-2 hover, primary-border ring-glow on the
//                      focus-WITHIN of the row). ≥44px (`min-h-11`).
//   input            — the value field — the mono/stat role (`font-mono text-base tabular-nums
//                      text-text-primary`): numbers align via the MONO FACE, not weight
//                      (03-UI-SPEC Typography — stat/mono is 400 at 14px). Transparent fill
//                      (the `control` paints the surface); centered; no own border.
//   incrementTrigger — the +1 affordance — icon-only (Lucide Plus). ≥44px (`min-h-11 min-w-11`,
//                      the WCAG 2.2 target floor — a11y.md Targets) with the canonical
//                      `focus-visible:shadow-(--shadow-ring)` ring (the control-family ring,
//                      distinct from the input glow). Hover lifts to `surface-3`.
//   decrementTrigger — the −1 affordance — icon-only (Lucide Minus), same geometry + ring.
import { tv } from "tailwind-variants/lite";

export const stepper = tv({
  slots: {
    control:
      "inline-flex min-h-11 items-center overflow-hidden rounded-sm border border-border-1 bg-surface-2 transition-colors hover:border-border-2 focus-within:border-primary-border focus-within:shadow-(--shadow-ring-glow) data-[disabled]:pointer-events-none data-[disabled]:bg-surface-1 data-[disabled]:opacity-60",
    input:
      "min-h-11 w-16 bg-transparent text-center font-mono text-base text-text-primary tabular-nums focus-visible:outline-none data-[disabled]:text-text-subtle",
    incrementTrigger:
      "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:shadow-(--shadow-ring) focus-visible:outline-none data-[disabled]:pointer-events-none data-[disabled]:text-text-subtle",
    decrementTrigger:
      "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:shadow-(--shadow-ring) focus-visible:outline-none data-[disabled]:pointer-events-none data-[disabled]:text-text-subtle",
  },
});
