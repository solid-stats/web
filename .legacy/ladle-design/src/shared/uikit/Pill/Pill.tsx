// Pill (KIT-07) — the generic `rounded-full` label+icon chip. Where `Badge` is the
// squared `rounded-xs` outcome/status flag, `Pill` is the soft neutral pill (the
// freshness pill is its own KIT-04 slice; this is the unopinionated primitive a
// later surface reaches for). Always icon + label — never color-alone (a11y.md).
// Neutral surface-2 fill by default; an optional `tone` tints it via the semantic
// weak tokens held literal in `tv()` (styling.md — no arbitrary values).
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants/lite";

/** Optional semantic tint. `neutral` is the quiet surface-2 default. */
export type PillTone = "neutral" | "win" | "loss" | "warn" | "info";

type Props = {
  className?: string;
  /** A Lucide icon component (PascalCase local), rendered decorative + paired with the label. */
  icon: LucideIcon;
  /** The literal display word (RU primary / EN mirror), from `_fixtures/STRINGS`. */
  label: string;
  tone?: PillTone;
};

const pill = tv({
  base: "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-body text-xs font-medium",
  variants: {
    tone: {
      neutral: "bg-surface-2 text-text-primary border-border-1",
      win: "bg-win-weak text-win border-win-border",
      loss: "bg-loss-weak text-loss border-loss-border",
      warn: "bg-warn-weak text-warn border-warn-border",
      info: "bg-info-weak text-info border-info-border",
    },
  },
});

export function Pill({ className, icon: Icon, label, tone = "neutral" }: Props): ReactNode {
  return (
    <span className={pill({ tone, className })}>
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}
