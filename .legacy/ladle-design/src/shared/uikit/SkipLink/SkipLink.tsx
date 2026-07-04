// SkipLink (KIT-01) — the first focusable control of the shell: a
// visually-hidden-until-focused link that jumps keyboard / screen-reader users
// straight to the page's `<main>` content, bypassing the nav (WCAG 2.4.1 Bypass
// Blocks, a11y.md "Skip links + semantic landmarks").
//
// Off-screen by default (the `sr-only` recipe), it pulls back on-screen on
// `:focus` and paints a visible cyan focus ring (`--shadow-ring`) so it is never
// hidden behind the sticky nav (WCAG 2.4.12). It targets `#main` — the id AppShell
// puts on its `<main>` landmark. All classes are literal token utilities held in
// `tv()` (styling.md — no arbitrary values); `/lite` is the tailwind-merge-free
// build (the family precedent).
import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";

type Props = {
  className?: string;
  /** The fragment target — defaults to AppShell's `<main id="main">`. */
  href?: string;
  /** The link copy (RU primary / EN mirror), from `_fixtures/STRINGS`. */
  label: string;
};

// `sr-only` off-screen until focused; on `:focus` it becomes a fixed on-screen
// chip top-left with the cyan ring. `shadow-(--shadow-ring)` reads the @theme
// custom property (the sanctioned escape hatch — not an arbitrary value).
//
// GAP-05: `focus:not-sr-only` zeroes the padding (the `sr-only` recipe sets
// `padding: 0`, and `not-sr-only` restores `padding: 0` too), so the revealed
// chip's text would touch the edges — `focus:px-4` restores the horizontal
// padding on reveal. The reveal itself is reliant on the reveal-safe
// `clip-path`-based `.sr-only` in `.ladle/tailwind.css` (the legacy `clip` is
// gone, so `not-sr-only`'s `clip-path: none` actually un-clips the chip).
const skipLink = tv({
  base: "sr-only rounded-md bg-surface-2 px-4 font-body text-sm font-semibold text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:px-4 focus:outline-none focus:shadow-(--shadow-ring)",
});

export function SkipLink({ className, href = "#main", label }: Props): ReactNode {
  return (
    <a href={href} className={skipLink({ className })} data-skip-link>
      {label}
    </a>
  );
}
