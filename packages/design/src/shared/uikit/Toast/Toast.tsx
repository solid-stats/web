// Toast (KIT-07) — the VISUAL primitive ONLY: a floating surface + icon + message +
// optional action button. It is NOT a trigger, portal, or queue manager — that
// lifecycle (mounting, auto-dismiss, stacking) is Phase 3 (02-CONTEXT Deferred Ideas).
// This slice is purely presentational so later surfaces compose it under a real
// toast manager.
//
// Four semantic variants (success `win` / error `loss` / warn / info), each pairing a
// Lucide icon + the message — never color-alone (a11y.md). The optional action renders
// the shared `<Button variant="ghost" size="sm">` base primitive (GAP-19): this REMOVES
// the previous hand-rolled `focus-visible:outline-*` drift ring and gives the action the
// ONE canonical focus ring + ≥44px hit area every control now shares.
// It floats with the `shadow-lg` elevation token (DESIGN.md Elevation). `role="status"`
// announces it politely without stealing focus (a11y.md). Semantic tokens are plain
// utilities held literal in `tv()` (styling.md — no arbitrary values); `/lite` is the
// tailwind-merge-free build (FreshnessPill precedent).
import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants/lite";
import { Button } from "../Button";

/** The four semantic toast variants. Frontend-owned finite union. */
export type ToastVariant = "success" | "error" | "warn" | "info";

type DismissProps =
  | {
      /**
       * The dismiss affordance — an icon-only close control the toast MANAGER wires to
       * `toaster.dismiss(toast.id)` (Plan 03-07, D-06). The leaf stays presentational: it takes
       * the accessible name as a prop (`dismissAria`) and does NOT invent it (a11y.md — icon-only
       * controls need a caller-supplied name). When `onDismiss` is set, `dismissAria` is REQUIRED
       * by construction — an omitted name is a `tsc` error, not a silent unnamed control (WCAG 4.1.2).
       */
      onDismiss: () => void;
      /** The accessible name for the icon-only dismiss control (resolved by the consumer). */
      dismissAria: string;
    }
  | {
      /** Absent both → no dismiss button (the bare visual leaf the Phase-2 catalog renders inert). */
      onDismiss?: undefined;
      dismissAria?: undefined;
    };

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
} & DismissProps;

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

export function Toast({
  className,
  variant,
  message,
  action,
  onDismiss,
  dismissAria,
}: Props): ReactNode {
  const Icon = ICONS[variant];

  return (
    <div className={toast({ variant, className })} role="status" data-toast={variant}>
      <Icon className={iconTone({ variant })} aria-hidden />
      <span className="flex-1">{message}</span>
      {action === undefined ? null : (
        // GAP-19: the action is the shared ghost Button — the canonical ring, no drift.
        // `text-primary` keeps the cyan affordance the toast action has always carried.
        <Button variant="ghost" size="sm" className="text-primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {onDismiss === undefined ? null : (
        // D-06: the icon-only dismiss the manager wires to `toaster.dismiss(toast.id)`. The
        // shared ghost Button gives it the ONE canonical ring + ≥44px hit area; the icon is
        // aria-hidden and the control carries the caller-supplied accessible name.
        <Button
          variant="ghost"
          size="sm"
          className="-mr-1 shrink-0 text-text-muted"
          aria-label={dismissAria}
          onClick={onDismiss}
          data-toast-dismiss
        >
          <X className="size-4" aria-hidden />
        </Button>
      )}
    </div>
  );
}
