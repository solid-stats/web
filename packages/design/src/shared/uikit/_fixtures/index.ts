// The single canonical fixture module (D-06) — the one barrel every stat/table/
// tier/data-trust story imports so Score/K-D, tiers, roster, and copy stay
// consistent across the whole catalog. Internal helper (underscore-prefixed): it
// is intentionally NOT graduated into the package public barrel (src/index.ts).
export type { Baseline, MetricThresholds, Tier, TierLevel, TierMetric, TierPeriod } from "./tiers";
export { SS_BASELINE, TIER_NAMES, TIER_PIPS, tierFor } from "./tiers";

export type { Outcome, Player } from "./roster";
export { kdOf, OVERVIEW_PLAYERS, ROSTER, scoreOf } from "./roster";

export type { Bilingual, StringKey } from "./strings";
export { STRINGS } from "./strings";
