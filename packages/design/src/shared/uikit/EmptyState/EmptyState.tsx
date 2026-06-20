// EmptyState (KIT-07) — the honest "nothing here yet" surface: never a blank screen
// (errors.md). It renders an `h3` heading + body copy + an actionable next step, with
// an optional total-count line (e.g. "clear filters to see all N") for the filtered
// case. A 24px Lucide icon sits above; the whole block reserves a min-height so an
// empty result does not collapse the layout (performance.md — reserved space, CLS = 0).
//
// The container is the DESIGN.md `card` recipe (surface-1 + border-1 + rounded-lg)
// expressed as token utilities held literal in `tv()` (styling.md — no arbitrary
// values). The optional `action` is a consumer-supplied node (a button/link the
// catalog renders inert); when present it is the only interactive zone.
import type { ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";

type Props = {
  className?: string;
  /** Lucide icon component (24px). Defaults to `Inbox`. */
  icon?: LucideIcon;
  /** The `h3` heading (RU primary / EN mirror), from `_fixtures/STRINGS`. */
  heading: string;
  /** Body copy explaining the empty result. */
  body: string;
  /** Optional total-count / next-step line (e.g. "сбросьте фильтры … всех (N)"). */
  totalCount?: string;
  /** Optional recovery action (button/link). The only interactive zone. */
  action?: ReactNode;
};

export function EmptyState({
  className,
  icon: Icon = Inbox,
  heading,
  body,
  totalCount,
  action,
}: Props): ReactNode {
  return (
    <div
      className={`flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-border-1 bg-surface-1 p-8 text-center ${className ?? ""}`}
      data-empty-state
    >
      <Icon className="size-6 text-text-muted" aria-hidden />
      <h3 className="font-display text-xl font-semibold text-text-primary tracking-tight">
        {heading}
      </h3>
      <p className="max-w-prose font-body text-base text-text-primary">{body}</p>
      {totalCount === undefined ? null : (
        <p className="font-body text-xs text-text-muted">{totalCount}</p>
      )}
      {action === undefined ? null : <div className="mt-1">{action}</div>}
    </div>
  );
}
