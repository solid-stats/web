// Sparkline catalog stories (KIT-03, D-03). Proves the ×4 data-volume states
// (empty flat baseline · few points · many points · clamped range) all hold the
// SAME fixed height (CLS = 0), the chart is dependency-free DOM bars, and each
// bar's tier color is paired with the `sr-only` figcaption summary (never
// color-alone). Values come from the canonical roster spark series (Vasiliy #1).
import type { Story, StoryDefault } from "@ladle/react";
import { ROSTER, SS_BASELINE, STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Sparkline } from "./Sparkline";

export default {
  title: "KIT-03 Stat / Sparkline",
} satisfies StoryDefault;

const VASILIY = ROSTER[0]!;

// Build the bilingual «Недельный счёт: …» summary for a value series.
const summary = (values: readonly number[], lang: "ru" | "en"): string =>
  STRINGS.sparklineSummary[lang].replace("{values}", values.map((v) => v.toFixed(2)).join(", "));

const FEW = VASILIY.spark; // 4 weekly scores [3.1, 4.6, 3.8, 4.2]
const MANY = [1.6, 2.5, 2.4, 2.2, 3.0, 3.6, 2.9, 4.1, 3.8, 4.2]; // 10-week trend
const CLAMPED = [0, 0.2, 8.4, 0.1, 9.9, 0.05]; // wide range — min-height nubs + tall bars
const EMPTY: readonly number[] = [];

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="Sparkline — объём данных (RU)">
      <StateCell label="empty">
        <Sparkline
          values={EMPTY}
          baseline={SS_BASELINE}
          summary={summary(EMPTY, "ru")}
          className="w-32"
        />
      </StateCell>
      <StateCell label="few">
        <Sparkline
          values={FEW}
          baseline={SS_BASELINE}
          summary={summary(FEW, "ru")}
          className="w-32"
        />
      </StateCell>
      <StateCell label="many">
        <Sparkline
          values={MANY}
          baseline={SS_BASELINE}
          summary={summary(MANY, "ru")}
          className="w-40"
        />
      </StateCell>
      <StateCell label="clamped">
        <Sparkline
          values={CLAMPED}
          baseline={SS_BASELINE}
          summary={summary(CLAMPED, "ru")}
          className="w-32"
        />
      </StateCell>
    </StateMatrix>
    <StateMatrix title="Sparkline — data volume (EN)">
      <StateCell label="few-en">
        <Sparkline
          values={FEW}
          baseline={SS_BASELINE}
          summary={summary(FEW, "en")}
          className="w-32"
        />
      </StateCell>
      <StateCell label="many-en">
        <Sparkline
          values={MANY}
          baseline={SS_BASELINE}
          summary={summary(MANY, "en")}
          className="w-40"
        />
      </StateCell>
    </StateMatrix>
  </div>
);

// CLS proof: the empty and many sparklines must occupy the SAME box height, so a
// data-volume change shifts nothing. The cls.spec asserts these two boxes match.
export const Cls: Story = () => (
  <div className="flex flex-col gap-4 bg-bg-1 p-4">
    <div data-cls-spark-empty>
      <Sparkline
        values={EMPTY}
        baseline={SS_BASELINE}
        summary={summary(EMPTY, "ru")}
        className="w-40"
      />
    </div>
    <div data-cls-spark-many>
      <Sparkline
        values={MANY}
        baseline={SS_BASELINE}
        summary={summary(MANY, "ru")}
        className="w-40"
      />
    </div>
  </div>
);

type PlaygroundArgs = {
  volume: "empty" | "few" | "many" | "clamped";
};

const SERIES = { empty: EMPTY, few: FEW, many: MANY, clamped: CLAMPED } as const;

export const Playground: Story<PlaygroundArgs> = ({ volume }) => {
  const values = SERIES[volume];
  return (
    <div className="w-48 bg-bg-1 p-4">
      <Sparkline values={values} baseline={SS_BASELINE} summary={summary(values, "ru")} />
    </div>
  );
};

Playground.args = { volume: "few" };
Playground.argTypes = {
  volume: {
    options: ["empty", "few", "many", "clamped"],
    control: { type: "inline-radio" },
  },
};
