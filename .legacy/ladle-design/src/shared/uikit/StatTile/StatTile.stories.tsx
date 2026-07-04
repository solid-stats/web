// StatTile catalog stories (KIT-03). The hero Score + K/D tiles render the
// canonical roster numbers (Vasiliy #1, score 4.13 / K-D 3.39 from `_fixtures`),
// proving the headline vocabulary is internally consistent with the Score/K-D
// formulas. `Matrix` lays out the display states (value-only, with +delta, with
// −delta) plus the loading Skeleton — StatTile is display-only (no hover/pressed/
// focus interactive states). `Playground` exposes the props via Ladle args.
import type { Story, StoryDefault } from "@ladle/react";
import { ROSTER, STRINGS } from "../_fixtures";
import { Skeleton } from "../Skeleton";
import { StateCell, StateMatrix } from "../_state-matrix";
import { StatTile } from "./StatTile";

export default {
  title: "KIT-03 Stat / StatTile",
} satisfies StoryDefault;

// Vasiliy #1 — the canonical hero player; Score reaches «отлично», K/D «норма».
const VASILIY = ROSTER[0]!;
const fmt = (n: number): string => n.toFixed(2);

const HERO_SCORE = { ru: "Счёт", en: "Score" };
const HERO_KD = { ru: "K/D", en: "K/D" };

export const Heroes: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <div className="grid max-w-md grid-cols-2 gap-3" data-hero-pair>
      <StatTile
        label={HERO_SCORE.ru}
        value={fmt(VASILIY.score)}
        delta={{ sign: "up", text: "+0.31" }}
      />
      <StatTile
        label={HERO_KD.ru}
        value={fmt(VASILIY.kd)}
        delta={{ sign: "down", text: "−0.12" }}
      />
    </div>
  </div>
);

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="StatTile — состояния (RU)">
      <StateCell label="value-only">
        <StatTile label={HERO_SCORE.ru} value={fmt(VASILIY.score)} />
      </StateCell>
      <StateCell label="delta-up">
        <StatTile
          label={HERO_SCORE.ru}
          value={fmt(VASILIY.score)}
          delta={{ sign: "up", text: "+0.31" }}
        />
      </StateCell>
      <StateCell label="delta-down">
        <StatTile
          label={HERO_KD.ru}
          value={fmt(VASILIY.kd)}
          delta={{ sign: "down", text: "−0.12" }}
        />
      </StateCell>
      <StateCell label="loading">
        <Skeleton variant="tile" />
      </StateCell>
    </StateMatrix>
    <StateMatrix title="StatTile — states (EN)">
      <StateCell label="value-only-en">
        <StatTile label={HERO_SCORE.en} value={fmt(VASILIY.score)} />
      </StateCell>
      <StateCell label="delta-up-en">
        <StatTile
          label={HERO_SCORE.en}
          value={fmt(VASILIY.score)}
          delta={{ sign: "up", text: "+0.31" }}
        />
      </StateCell>
      <StateCell label="delta-down-en">
        <StatTile
          label={HERO_KD.en}
          value={fmt(VASILIY.kd)}
          delta={{ sign: "down", text: "−0.12" }}
        />
      </StateCell>
    </StateMatrix>
    {/* The tier-level vocabulary the headline tiles sit within (RU+EN parity proof). */}
    <p className="font-body text-xs text-text-subtle">
      {STRINGS.tierLevels.ru} · {STRINGS.tierLevels.en}
    </p>
  </div>
);

// GAP-16: the CLS = 0 proof. A delta-bearing StatTile must be NO taller than its loading
// skeleton, so the `withDelta` skeleton reserves the delta row; a plain (no-delta) tile
// still matches the compact `tile` skeleton. cls.spec asserts both box equalities — the
// skeleton holds the layout, so the skeleton→tile swap shifts nothing on load.
export const Proof: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <div className="grid w-48 gap-3" data-cls-tile-delta>
      <div data-cls-tile-delta-skeleton>
        <Skeleton variant="tile" withDelta />
      </div>
      <div data-cls-tile-delta-final>
        <StatTile
          label={HERO_SCORE.ru}
          value={fmt(VASILIY.score)}
          delta={{ sign: "up", text: "+0.31" }}
        />
      </div>
    </div>
    <div className="grid w-48 gap-3" data-cls-tile-plain>
      <div data-cls-tile-plain-skeleton>
        <Skeleton variant="tile" />
      </div>
      <div data-cls-tile-plain-final>
        <StatTile label={HERO_SCORE.ru} value={fmt(VASILIY.score)} />
      </div>
    </div>
  </div>
);

type PlaygroundArgs = {
  label: string;
  value: string;
  delta: "none" | "up" | "down";
  deltaText: string;
};

export const Playground: Story<PlaygroundArgs> = ({ label, value, delta, deltaText }) => (
  <div className="max-w-xs bg-bg-1 p-4">
    <StatTile
      label={label}
      value={value}
      delta={delta === "none" ? undefined : { sign: delta, text: deltaText }}
    />
  </div>
);

Playground.args = {
  label: "Счёт",
  value: "4.13",
  delta: "up",
  deltaText: "+0.31",
};
Playground.argTypes = {
  delta: {
    options: ["none", "up", "down"],
    control: { type: "inline-radio" },
  },
};
