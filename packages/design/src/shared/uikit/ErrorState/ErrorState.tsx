// ErrorState (KIT-07) — never a blank screen (errors.md). It distinguishes a `kind`:
//   • `system` — an application/server failure: shows a ref/debug id + a contact path
//     so the user can report it (errors.md: server errors surface a request id +
//     maintainer contact). The `{id}` is a static fixture placeholder this phase — an
//     escaped literal, no real id source exists yet (threat T-02-01 / V5 note).
//   • `user`  — a user-action error: sits by the field and names the fix (minimal this
//     phase — the catalog is read-only). Recovery action is ALWAYS present.
//
// `tv()` selects the kind's accent (loss for system, warn for user) over the `card`
// container; semantic tokens are plain utilities held literal (styling.md — no
// arbitrary values). Each kind pairs a Lucide icon + text — never color-alone
// (a11y.md). `role="alert"` announces the failure (a11y.md / live-region intent).
import type { ReactNode } from "react";
import { CircleAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants/lite";

/** System (server/application) vs user (form/action) error. Frontend-owned union. */
export type ErrorKind = "system" | "user";

type Props = {
  className?: string;
  kind: ErrorKind;
  /** The headline error copy (RU primary / EN mirror), from `_fixtures/STRINGS`. */
  message: string;
  /**
   * The contact path for a `system` error (e.g. a support link/handle). Rendered
   * below the message. Ignored for `user` errors.
   */
  contact?: string;
  /** Recovery action (button/link) — always present, never a dead end. */
  action: ReactNode;
};

const ICONS = {
  system: CircleAlert,
  user: TriangleAlert,
} as const satisfies Record<ErrorKind, LucideIcon>;

const error = tv({
  base: "flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border bg-surface-1 p-8 text-center",
  variants: {
    kind: {
      system: "border-loss-border",
      user: "border-warn-border",
    },
  },
});

const iconTone = tv({
  base: "size-6",
  variants: {
    kind: {
      system: "text-loss",
      user: "text-warn",
    },
  },
});

export function ErrorState({ className, kind, message, contact, action }: Props): ReactNode {
  const Icon = ICONS[kind];

  return (
    <div className={error({ kind, className })} role="alert" data-error-state={kind}>
      <Icon className={iconTone({ kind })} aria-hidden />
      <p className="max-w-prose font-body text-base text-text-primary">{message}</p>
      {kind === "system" && contact !== undefined ? (
        <p className="font-body text-xs text-text-muted">{contact}</p>
      ) : null}
      <div className="mt-1">{action}</div>
    </div>
  );
}
