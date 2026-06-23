// GAP-19 — `Link`, the anchor affordance sharing Button's `control` recipe. It renders
// an `<a>` with the identical ≥44px hit area + ONE canonical focus ring + variant
// tokens, so a nav item / table row anchor / state-card action gets the same affordance
// as a Button. Meaning-carrying state (active section, disabled) is forwarded as real
// ARIA (`aria-current` / `aria-disabled`) — never color-alone (a11y.md).
//
// A `disabled` Link is not a native concept: it drops `href` and sets
// `aria-disabled` + the shared disabled treatment (pointer-events-none) — the consumer
// keeps any active-marker wrapper concern (the cyan edge bar) around it.
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { control, type ButtonJustify, type ButtonSize, type ButtonVariant } from "./control";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  // system props first
  className?: string;
  // values
  variant?: ButtonVariant;
  size?: ButtonSize;
  justify?: ButtonJustify;
  /** The anchor target. Dropped when `disabled` (a disabled link is not navigable). */
  href?: string;
  // booleans
  /** Segment active member → cyan. Inert for other variants. */
  active?: boolean;
  disabled?: boolean;
  // content
  children?: ReactNode;
};

export function Link({
  className,
  variant,
  size,
  justify,
  href,
  active,
  disabled = false,
  children,
  ...rest
}: Props): ReactNode {
  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled ? true : undefined}
      className={control({ variant, size, justify, active, disabled, className })}
      {...rest}
    >
      {children}
    </a>
  );
}
