// GAP-19 — `Button`, the shared interactive base (`<button type="button">`). It owns
// nothing visual itself: the ≥44px hit area, the ONE canonical focus ring, and the
// per-variant token recipes all live in the shared `control` tv() (control.ts, sourced
// from the DESIGN.md `button-*` recipes). `Link` (Link.tsx) renders the same recipe as
// an `<a>` affordance. Before this, the ~7 catalog controls each re-implemented those
// by hand and the Toast action drifted to a different ring — this primitive removes
// that duplication.
//
// An icon-only Button needs an accessible name via `aria-label` (a11y.md) — the
// component does not invent one. Buttons default to `type="button"` unless a submit is
// intentional (component-shape.md).
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { control, type ButtonSize, type ButtonVariant } from "./control";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "type"> & {
  // system props first
  className?: string;
  // values
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  // booleans
  /** Segment active member → cyan (the sorted sort-header). Inert for other variants. */
  active?: boolean;
  disabled?: boolean;
  // content
  children?: ReactNode;
};

export function Button({
  className,
  variant,
  size,
  type = "button",
  active,
  disabled = false,
  children,
  ...rest
}: Props): ReactNode {
  return (
    <button
      // eslint-disable-next-line react/button-has-type -- type is a constrained prop, defaulted to "button"
      type={type}
      disabled={disabled}
      className={control({ variant, size, active, disabled, className })}
      {...rest}
    >
      {children}
    </button>
  );
}
