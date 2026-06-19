/* hifi/tiers.js — SHARED tier system (loaded by Overview + Player profile).
   Level boundaries (ниже нормы / норма / хорошо / отлично) are NOT fixed — they are
   computed from the WHOLE playerbase for the selected period (rotation / all-time).
   A backend fills SS_BASELINE from population stats; the UI only reads it. */

window.SS_BASELINE = {
  period: 'rotation',        // active period these thresholds are computed for
  rotationNo: 92,
  by: {
    rotation: { score: { base: 1.00, good: 2.40, elite: 4.00 }, kd: { base: 1.00, good: 3.40, elite: 6.80 } },
    alltime:  { score: { base: 1.00, good: 3.00, elite: 5.00 }, kd: { base: 1.00, good: 5.00, elite: 10.00 } },
  },
  get(metric) { return this.by[this.period][metric]; },
};

window.SS_TIER = {
  // tier from population boundaries (DS: never color-alone — paired with pip/label)
  tier(metric, v) {
    const b = window.SS_BASELINE.get(metric);
    return v >= b.elite ? 'elite' : v >= b.good ? 'good' : v >= b.base ? 'base' : 'low';
  },
  score(v) { return this.tier('score', v); },
  kd(v) { return this.tier('kd', v); },
  level: { low: 1, base: 2, good: 3, elite: 4 },   // filled pips out of 4
};
