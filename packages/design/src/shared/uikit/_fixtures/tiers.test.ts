// QUAL-06 / D-04 proofs for the population-derived tier function: levels come
// from the explicitly-passed baseline (not hardcoded cutoffs), the level carries
// its entry threshold, and `tierFor` mutates nothing (no module-global, no
// mutation of the passed baseline). Pure logic — no DOM render.
import { describe, expect, test } from "vitest";

import { SS_BASELINE, tierFor } from "./index";
import type { TierLevel } from "./index";

describe("tierFor — population-derived levels (rotation baseline)", () => {
  test.each<{ metric: "score" | "kd"; value: number; level: TierLevel; threshold: number }>([
    // rotation score thresholds: base 1.0 / good 2.4 / elite 4.0
    { metric: "score", value: 0.5, level: "low", threshold: 0 },
    { metric: "score", value: 1.0, level: "base", threshold: 1.0 },
    { metric: "score", value: 2.4, level: "good", threshold: 2.4 },
    { metric: "score", value: 4.13, level: "elite", threshold: 4.0 },
    // rotation kd thresholds: base 1.0 / good 3.4 / elite 6.8
    { metric: "kd", value: 0.9, level: "low", threshold: 0 },
    { metric: "kd", value: 3.4, level: "good", threshold: 3.4 },
    { metric: "kd", value: 7.0, level: "elite", threshold: 6.8 },
  ])("$metric $value → $level (≥$threshold)", ({ metric, value, level, threshold }) => {
    const tier = tierFor(metric, value, SS_BASELINE, "rotation");
    expect(tier.level).toBe(level);
    expect(tier.threshold).toBe(threshold);
  });

  test("a rotation score of 2.4 is 'хорошо' with entry threshold ≥2.4", () => {
    const tier = tierFor("score", 2.4, SS_BASELINE, "rotation");
    expect(tier.level).toBe("good");
    expect(tier.name).toBe("хорошо");
    expect(tier.threshold).toBe(2.4);
  });

  test("the period selects a different baseline (alltime good is 3.0, not 2.4)", () => {
    // 2.4 reaches 'good' under rotation but only 'base' under alltime (good=3.0).
    expect(tierFor("score", 2.4, SS_BASELINE, "alltime").level).toBe("base");
  });
});

describe("tierFor — purity", () => {
  test("does not mutate the passed baseline", () => {
    const snapshot = structuredClone(SS_BASELINE);
    tierFor("score", 2.4, SS_BASELINE, "rotation");
    tierFor("kd", 9.9, SS_BASELINE, "alltime");
    expect(SS_BASELINE).toEqual(snapshot);
  });
});
