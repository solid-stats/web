// Toast (KIT-07) — the VISUAL primitive ONLY: a floating surface + icon + message +
// optional action button. It is NOT a trigger, portal, or queue manager — that
// lifecycle (mounting, auto-dismiss, stacking) is Phase 3 (02-CONTEXT Deferred Ideas).
// This slice is purely presentational so later surfaces compose it under a real
// toast manager.
//
// Four semantic variants (success `win` / error `loss` / warn / info), each pairing a
// Lucide icon + the message — never color-alone (a11y.md). The optional action is a
// real `<button type="button">` carrying a visible cyan focus ring (`focus-visible:`
// outline, the ProvenanceLine precedent) and a ≥44px hit area, so it is
// keyboard-operable (a11y.md / 2.5.5).
// It floats with the `shadow-lg` elevation token (DESIGN.md Elevation). `role="status"`
// announces it politely without stealing focus (a11y.md). Semantic tokens are plain
// utilities held literal in `tv()` (styling.md — no arbitrary values); `/lite` is the
// tailwind-merge-free build (FreshnessPill precedent).
import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants/lite";

/** The four semantic toast variants. Frontend-owned finite union. */
export type ToastVariant = "success" | "error" | "warn" | "info";

type Props = {
  className?: string;
  variant: ToastVariant;
  /** The toast message (RU primary / EN mirror), from `_fixtures/STRINGS`. */
  message: string;
  /** Optional action: a label + click handler (the catalog renders it inert). */
  action?: {
    label: string;
    onClick?: () => void;
  };
};

const ICONS = {
  success: CircleCheck,
  error: CircleAlert,
  warn: TriangleAlert,
  info: Info,
} as const satisfies Record<ToastVariant, LucideIcon>;

const toast = tv({
  base: "inline-flex items-center gap-3 rounded-md border bg-surface-2 px-4 py-3 font-body text-sm text-text-primary shadow-lg",
  variants: {
    variant: {
      success: "border-win-border",
      error: "border-loss-border",
      warn: "border-warn-border",
      info: "border-info-border",
    },
  },
});

const iconTone = tv({
  base: "size-5 shrink-0",
  variants: {
    variant: {
      success: "text-win",
      error: "text-loss",
      warn: "text-warn",
      info: "text-info",
    },
  },
});

export function Toast({ className, variant, message, action }: Props): ReactNode {
  const Icon = ICONS[variant];

  return (
    <div className={toast({ variant, className })} role="status" data-toast={variant}>
      <Icon className={iconTone({ variant })} aria-hidden />
      <span className="flex-1">{message}</span>
      {action === undefined ? null : (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex min-h-11 items-center rounded-sm px-3 font-body text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
