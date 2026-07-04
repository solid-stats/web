// EmptyState catalog stories (KIT-07). `Matrix` lays the two empty scenarios out via
// StateMatrix in RU + EN — the cold "no data yet" table-empty (heading + body) and the
// filtered "no matches" with a total-count next step (interpolates N). Both reserve a
// min-height (no collapse). `Playground` exposes the scenario via Ladle args. Copy
// comes from `_fixtures/STRINGS`.
import type { Story, StoryDefault } from "@ladle/react";
import { FilterX, Inbox } from "lucide-react";
import { Button } from "../Button";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { EmptyState } from "./EmptyState";

export default {
  title: "KIT-07 Feedback / EmptyState",
} satisfies StoryDefault;

const TOTAL = 200;

const interpolate = (s: string, n: number): string => s.replace("{n}", String(n));

type Scenario = "cold" | "filtered";
const SCENARIOS: readonly Scenario[] = ["cold", "filtered"];

const Cold = ({ lang }: { lang: "ru" | "en" }) => (
  <EmptyState
    icon={Inbox}
    heading={STRINGS.emptyTableHeading[lang]}
    body={STRINGS.emptyTableBody[lang]}
  />
);

// GAP-19: the filtered scenario carries a real recovery action — the shared secondary
// Button (canonical ring + ≥44px), the "clear filters" affordance. Story-local label
// (RU/EN), matching the ErrorState action pattern.
const CLEAR_FILTERS = { ru: "Сбросить фильтры", en: "Clear filters" } as const;

const Filtered = ({ lang }: { lang: "ru" | "en" }) => (
  <EmptyState
    icon={FilterX}
    heading={STRINGS.emptyTableHeading[lang]}
    body={STRINGS.emptyTableBody[lang]}
    totalCount={interpolate(STRINGS.emptyFilteredBody[lang], TOTAL)}
    action={<Button variant="secondary">{CLEAR_FILTERS[lang]}</Button>}
  />
);

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="EmptyState — сценарии (RU)">
      <StateCell label="cold">
        <Cold lang="ru" />
      </StateCell>
      <StateCell label="filtered">
        <Filtered lang="ru" />
      </StateCell>
    </StateMatrix>
    <StateMatrix title="EmptyState — scenarios (EN)">
      <StateCell label="cold-en">
        <Cold lang="en" />
      </StateCell>
      <StateCell label="filtered-en">
        <Filtered lang="en" />
      </StateCell>
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  scenario: Scenario;
};

export const Playground: Story<PlaygroundArgs> = ({ scenario }) => (
  <div className="bg-bg-1 p-4">
    {scenario === "cold" ? <Cold lang="ru" /> : <Filtered lang="ru" />}
  </div>
);

Playground.args = { scenario: "cold" };
Playground.argTypes = {
  scenario: {
    options: SCENARIOS,
    control: { type: "inline-radio" },
  },
};
