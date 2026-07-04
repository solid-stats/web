// TierChip (KIT-03) — the population-derived tier flag for a single metric value.
// It calls `tierFor(metric, value, baseline)` with the `baseline` passed EXPLICITLY
// (D-04 — the fn is Vitest-proven pure; the chip never reads or mutates a global),
// then renders the level name (ниже / норма / хорошо / отлично) + its entry
// threshold (e.g. «≥2.4 ХОРОШО»). The tier color is ALWAYS paired with the level
// word AND the discrete `Pips` meter, so meaning is never carried by color alone
// (a11y.md). Tier levels are NEVER hardcoded cutoffs — they come from `SS_BASELINE`.
//
// Token note: the design system ships no `--color-tier-*` tokens, so the four
// levels map onto existing semantic tokens (ascending quality: loss → warn → info
// → win), held literal inside `tv()` so the Tailwind v4 `@source` scan emits them.
// The color is redundant with the pip count + the level word (never color-alone).
import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import {
  type Baseline,
  type TierLevel,
  type TierMetric,
  type TierPeriod,
  tierFor,
} from "../_fixtures";
import { Pips } from "../TierScale";

type Props = {
  className?: string;
  /** The metric this value belongs to (drives which baseline thresholds apply). */
  metric: TierMetric;
  /** The raw metric value (e.g. a player's Score); the chip derives its tier. */
  value: number;
  /** The population baseline — passed EXPLICITLY (D-04), never a module global. */
  baseline: Baseline;
  /** Active period of the baseline (rotation by default). */
  period?: TierPeriod;
  /**
   * Pre-formatted caption carrying the UPPERCASED level word — «≥{t} {LEVEL}» for
   * base/good/elite, or just «НИЖЕ» for low (which has no entry threshold). The
   * caller localizes it (RU/EN) from STRINGS; the chip pairs the tier color + pips
   * with this word (never color-alone).
   */
  thresholdLabel: string;
};

const chip = tv({
  base: "inline-flex items-center gap-1.5 rounded-xs border px-2 py-1 font-body text-xs font-semibold",
  variants: {
    level: {
      low: "bg-loss-weak text-loss border-loss-border",
      base: "bg-warn-weak text-warn border-warn-border",
      good: "bg-info-weak text-info border-info-border",
      elite: "bg-win-weak text-win border-win-border",
    } satisfies Record<TierLevel, string>,
  },
});

export function TierChip({
  className,
  metric,
  value,
  baseline,
  period = "rotation",
  thresholdLabel,
}: Props): ReactNode {
  const tier = tierFor(metric, value, baseline, period);

  return (
    <span className={chip({ level: tier.level, className })} data-tier-chip={tier.level}>
      <Pips level={tier.level} />
      {thresholdLabel}
    </span>
  );
}
