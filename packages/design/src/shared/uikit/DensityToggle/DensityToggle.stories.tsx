// DensityToggle catalog stories (KIT-02). `Matrix` shows the two controlled states
// (comfortable active / compact active) in RU + EN; `Playground` drives the value
// via a Ladle arg. The toggle is presentational-only (D-01) — the value is a
// controlled prop, the active option is cyan + aria-pressed + the row-density icon
// (never color-alone). Labels are RU primary / EN mirror from `_fixtures/STRINGS`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import type { TableDensity } from "../Table";
import { DensityToggle } from "./DensityToggle";

export default {
  title: "KIT-02 Data-table / DensityToggle",
} satisfies StoryDefault;

type Lang = "ru" | "en";

function labels(lang: Lang): Readonly<Record<TableDensity, string>> {
  return {
    comfortable: lang === "ru" ? STRINGS.densityComfortable.ru : STRINGS.densityComfortable.en,
    compact: lang === "ru" ? STRINGS.densityCompact.ru : STRINGS.densityCompact.en,
  };
}

const groupLabel = (lang: Lang): string =>
  lang === "ru" ? STRINGS.densityGroup.ru : STRINGS.densityGroup.en;

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="DensityToggle — состояния (RU)">
      <StateCell label="comfortable">
        <DensityToggle value="comfortable" labels={labels("ru")} groupLabel={groupLabel("ru")} />
      </StateCell>
      <StateCell label="compact">
        <DensityToggle value="compact" labels={labels("ru")} groupLabel={groupLabel("ru")} />
      </StateCell>
    </StateMatrix>
    <StateMatrix title="DensityToggle — states (EN)">
      <StateCell label="comfortable-en">
        <DensityToggle value="comfortable" labels={labels("en")} groupLabel={groupLabel("en")} />
      </StateCell>
      <StateCell label="compact-en">
        <DensityToggle value="compact" labels={labels("en")} groupLabel={groupLabel("en")} />
      </StateCell>
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  value: TableDensity;
};

export const Playground: Story<PlaygroundArgs> = ({ value }) => (
  <div className="bg-bg-1 p-4">
    <DensityToggle value={value} labels={labels("ru")} groupLabel={groupLabel("ru")} />
  </div>
);

Playground.args = { value: "comfortable" };
Playground.argTypes = {
  value: { options: ["comfortable", "compact"], control: { type: "inline-radio" } },
};
