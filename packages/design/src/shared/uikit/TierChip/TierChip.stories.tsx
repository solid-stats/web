// TierChip catalog stories (KIT-03). Every chip derives its tier via
// `tierFor(metric, value, SS_BASELINE)` with the baseline passed EXPLICITLY (D-04)
// — proving the population model drives the level, not a hardcoded cutoff. `Matrix`
// walks all four levels (ниже / норма / хорошо / отлично) by feeding values that
// land in each `SS_BASELINE.rotation` band, rendering the level name + entry
// threshold («≥2.4 ХОРОШО») with the tier color paired with the word + pips (never
// color-alone). `Heroes` shows Vasiliy #1's real Score (отлично) + K/D (норма).
import type { Story, StoryDefault } from "@ladle/react";
import { ROSTER, SS_BASELINE, type TierLevel, type TierMetric, TIER_NAMES, tierFor } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { TierChip } from "./TierChip";

export default {
  title: "KIT-03 Stat / TierChip",
} satisfies StoryDefault;

type Lang = "ru" | "en";

// Build the «≥{t} {LEVEL}» caption — or just «НИЖЕ» for low (no entry threshold).
function thresholdLabel(metric: TierMetric, value: number, lang: Lang): string {
  const tier = tierFor(metric, value, SS_BASELINE);
  const level = (lang === "ru" ? TIER_NAMES[tier.level] : EN_NAMES[tier.level]).toUpperCase();
  return tier.level === "low" ? level : `≥${tier.threshold.toFixed(1)} ${level}`;
}

// EN mirror of the RU `TIER_NAMES` (the chip caption is bilingual at parity).
const EN_NAMES: Readonly<Record<TierLevel, string>> = {
  low: "below",
  base: "normal",
  good: "good",
  elite: "excellent",
};

// One representative Score value per level, derived from `SS_BASELINE.rotation.score`
// ({ base: 1.0, good: 2.4, elite: 4.0 }) so each chip lands in a distinct band.
const SAMPLES: ReadonlyArray<{ level: TierLevel; value: number }> = [
  { level: "low", value: 0.6 },
  { level: "base", value: 1.8 },
  { level: "good", value: 3.1 },
  { level: "elite", value: 4.5 },
];

const VASILIY = ROSTER[0]!;

export const Heroes: Story = () => (
  <div className="flex flex-wrap items-center gap-3 bg-bg-1 p-4" data-tier-heroes>
    {/* Vasiliy #1 real values: Score 4.13 → отлично, K/D 3.39 → норма. */}
    <TierChip
      metric="score"
      value={VASILIY.score}
      baseline={SS_BASELINE}
      thresholdLabel={thresholdLabel("score", VASILIY.score, "ru")}
    />
    <TierChip
      metric="kd"
      value={VASILIY.kd}
      baseline={SS_BASELINE}
      thresholdLabel={thresholdLabel("kd", VASILIY.kd, "ru")}
    />
  </div>
);

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="TierChip — уровни (RU)">
      {SAMPLES.map(({ level, value }) => (
        <StateCell key={level} label={level}>
          <TierChip
            metric="score"
            value={value}
            baseline={SS_BASELINE}
            thresholdLabel={thresholdLabel("score", value, "ru")}
          />
        </StateCell>
      ))}
    </StateMatrix>
    <StateMatrix title="TierChip — levels (EN)">
      {SAMPLES.map(({ level, value }) => (
        <StateCell key={level} label={`${level}-en`}>
          <TierChip
            metric="score"
            value={value}
            baseline={SS_BASELINE}
            thresholdLabel={thresholdLabel("score", value, "en")}
          />
        </StateCell>
      ))}
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  value: number;
};

export const Playground: Story<PlaygroundArgs> = ({ value }) => (
  <div className="bg-bg-1 p-4">
    <TierChip
      metric="score"
      value={value}
      baseline={SS_BASELINE}
      thresholdLabel={thresholdLabel("score", value, "ru")}
    />
  </div>
);

Playground.args = { value: 3.1 };
Playground.argTypes = {
  value: { control: { type: "range", min: 0, max: 6, step: 0.1 } },
};
