// Population-derived tier model + the pure `tierFor` derivation (D-04).
//
// Tier levels (ниже / норма / хорошо / отлично) are NEVER hardcoded cutoffs per
// metric — they are read from `SS_BASELINE.by[period][metric]`, the per-period
// population baseline a backend fills in v1.0. `tierFor` takes the baseline
// EXPLICITLY (no module-global, no mutation) so the same component renders any
// period's tiers by swapping the passed baseline.
//
// Values rebuilt natively from the frozen hi-fi `tiers.js` semantics (D-11 — the
// hi-fi file is reference only, never imported).

/** Period the tier baseline is computed for. */
export type TierPeriod = "rotation" | "alltime";

/** Metrics that carry a population-derived tier. */
export type TierMetric = "score" | "kd";

/** Entry thresholds for the three non-base levels of a single metric. */
export type MetricThresholds = {
  readonly base: number;
  readonly good: number;
  readonly elite: number;
};

/** The population baseline: per-period, per-metric entry thresholds. */
export type Baseline = {
  readonly by: Readonly<Record<TierPeriod, Readonly<Record<TierMetric, MetricThresholds>>>>;
};

/** Stable tier-level key (data shape — display name lives in `TIER_NAMES`). */
export type TierLevel = "low" | "base" | "good" | "elite";

/** RU display name per level (matches the UI-SPEC Copywriting Contract). */
export const TIER_NAMES: Readonly<Record<TierLevel, string>> = {
  low: "ниже",
  base: "норма",
  good: "хорошо",
  elite: "отлично",
};

/** Discrete pip count per level (filled pips out of 4). */
export const TIER_PIPS: Readonly<Record<TierLevel, number>> = {
  low: 1,
  base: 2,
  good: 3,
  elite: 4,
};

/**
 * The population baseline (rebuilt from `.design/hifi/tiers.js` semantics, D-11).
 * `base`/`good`/`elite` are the ENTRY thresholds for each level; anything below
 * `base` is `low`.
 */
export const SS_BASELINE: Baseline = {
  by: {
    rotation: {
      score: { base: 1.0, good: 2.4, elite: 4.0 },
      kd: { base: 1.0, good: 3.4, elite: 6.8 },
    },
    alltime: {
      score: { base: 1.0, good: 3.0, elite: 5.0 },
      kd: { base: 1.0, good: 5.0, elite: 10.0 },
    },
  },
};

/** A resolved tier: the level, its RU name, pip count, and entry threshold. */
export type Tier = {
  readonly level: TierLevel;
  readonly name: string;
  readonly pips: number;
  /** Entry threshold for this level (`0` for `low`, which has no floor). */
  readonly threshold: number;
};

/**
 * Derive the tier of `value` for `metric` under the active period of an
 * explicitly-passed `baseline`. Pure: reads nothing global and mutates nothing
 * (including the passed `baseline`).
 */
export function tierFor(
  metric: TierMetric,
  value: number,
  baseline: Baseline,
  period: TierPeriod = "rotation",
): Tier {
  const t = baseline.by[period][metric];
  if (value >= t.elite)
    return { level: "elite", name: TIER_NAMES.elite, pips: TIER_PIPS.elite, threshold: t.elite };
  if (value >= t.good)
    return { level: "good", name: TIER_NAMES.good, pips: TIER_PIPS.good, threshold: t.good };
  if (value >= t.base)
    return { level: "base", name: TIER_NAMES.base, pips: TIER_PIPS.base, threshold: t.base };
  return { level: "low", name: TIER_NAMES.low, pips: TIER_PIPS.low, threshold: 0 };
}
