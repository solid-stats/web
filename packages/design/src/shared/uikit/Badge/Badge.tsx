// Badge (KIT-07) — the outcome / status flag: a single `variant` union over the
// DESIGN.md `badge-outcome-*` (L295-308) and `badge-status-*` (L309-329) recipes.
// Each variant ALWAYS renders its Lucide icon + a literal label so meaning is never
// carried by color alone (a11y.md); `rounded-xs` (a badge, never a pill — that is
// `Pill`). Unlike the KIT-04 data-trust triplets, the semantic win/loss/warn/info
// tokens are plain values, so the fill/text/border resolve as ordinary Tailwind
// token utilities held literal inside `tv()` (styling.md — no arbitrary values, no
// inline style needed).
//
// `/lite` is the tailwind-merge-free build (the FreshnessPill precedent): all
// classes stay literal and never conflict, so the merge pass and its uninstalled
// optional `tailwind-merge` peer are unnecessary.
import type { ReactNode } from "react";
import {
  BadgeCheck,
  Clock,
  TrendingDown,
  TrendingUp,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { tv } from "tailwind-variants/lite";

/** Outcome (win/loss) + moderation status (pending/approved/rejected). Frontend-owned union. */
export type BadgeVariant =
  | "outcome-win"
  | "outcome-loss"
  | "status-pending"
  | "status-approved"
  | "status-rejected";

type Props = {
  className?: string;
  variant: BadgeVariant;
  /** The literal display word (RU primary / EN mirror), from `_fixtures/STRINGS`. */
  label: string;
};

const badge = tv({
  base: "inline-flex items-center gap-1.5 rounded-xs border px-2 py-1 font-body text-xs font-semibold",
  variants: {
    variant: {
      // win / approved share the green weak-fill recipe; loss / rejected the red.
      "outcome-win": "bg-win-weak text-win border-win-border",
      "outcome-loss": "bg-loss-weak text-loss border-loss-border",
      "status-pending": "bg-info-weak text-info border-info-border",
      "status-approved": "bg-win-weak text-win border-win-border",
      "status-rejected": "bg-loss-weak text-loss border-loss-border",
    },
  },
});

/** The DESIGN.md recipe icon per variant (Lucide component, never a raw SVG string — V14). */
const ICONS = {
  "outcome-win": TrendingUp,
  "outcome-loss": TrendingDown,
  "status-pending": Clock,
  "status-approved": BadgeCheck,
  "status-rejected": XCircle,
} as const satisfies Record<BadgeVariant, LucideIcon>;

export function Badge({ className, variant, label }: Props): ReactNode {
  const Icon = ICONS[variant];

  return (
    <span className={badge({ variant, className })}>
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}
