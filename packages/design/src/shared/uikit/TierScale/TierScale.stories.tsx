// TierScale catalog stories (KIT-03). The four-zone scale with each tier level
// marked active in turn (selected-state proof), plus the standalone `Pips` meter.
// The active zone pairs the tier color + the level word + the filled pips +
// `aria-current` (never color-alone). Names come from `TIER_NAMES` (RU) with an EN
// mirror at parity. The active level is derived from Vasiliy #1's real Score for
// the `Heroes` story (отлично).
import type { Story, StoryDefault } from "@ladle/react";
import { ROSTER, SS_BASELINE, type TierLevel, TIER_NAMES, tierFor } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Pips, TierScale } from "./TierScale";

export default {
  title: "KIT-03 Stat / TierScale",
} satisfies StoryDefault;

const LEVELS: readonly TierLevel[] = ["low", "base", "good", "elite"];

const EN_NAMES: Readonly<Record<TierLevel, string>> = {
  low: "below",
  base: "normal",
  good: "good",
  elite: "excellent",
};

const ariaFor = (level: TierLevel, names: Readonly<Record<TierLevel, string>>): string =>
  `Уровень: ${names[level]}`;

const VASILIY = ROSTER[0]!;
const vasiliyTier = tierFor("score", VASILIY.score, SS_BASELINE).level;

export const Heroes: Story = () => (
  <div className="flex max-w-md flex-col gap-3 bg-bg-1 p-4" data-tier-scale-heroes>
    {/* Vasiliy #1 Score 4.13 → отлично is the active zone. */}
    <TierScale active={vasiliyTier} names={TIER_NAMES} activeAriaLabel={ariaFor(vasiliyTier, TIER_NAMES)} />
  </div>
);

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="TierScale — активная зона (RU)">
      {LEVELS.map((level) => (
        <StateCell key={level} label={level}>
          <TierScale active={level} names={TIER_NAMES} activeAriaLabel={ariaFor(level, TIER_NAMES)} />
        </StateCell>
      ))}
    </StateMatrix>
    <StateMatrix title="TierScale — active zone (EN)">
      {LEVELS.map((level) => (
        <StateCell key={level} label={`${level}-en`}>
          <TierScale active={level} names={EN_NAMES} activeAriaLabel={`Tier: ${EN_NAMES[level]}`} />
        </StateCell>
      ))}
    </StateMatrix>
    <StateMatrix title="Pips — дискретный индикатор уровня">
      {LEVELS.map((level) => (
        <StateCell key={level} label={`pips-${level}`}>
          <Pips level={level} />
        </StateCell>
      ))}
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  active: TierLevel;
};

export const Playground: Story<PlaygroundArgs> = ({ active }) => (
  <div className="max-w-md bg-bg-1 p-4">
    <TierScale active={active} names={TIER_NAMES} activeAriaLabel={ariaFor(active, TIER_NAMES)} />
  </div>
);

Playground.args = { active: "good" };
Playground.argTypes = {
  active: {
    options: LEVELS,
    control: { type: "inline-radio" },
  },
};
