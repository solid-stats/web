// FreshnessPill catalog stories (KIT-04 model C). `Matrix` lays the 4 states out
// through the shared StateMatrix/StateCell helper (the labelled cells the Playwright
// catalog spec asserts against); `Playground` exposes the state via Ladle args with
// an inline-radio control. Both RU and EN render from the canonical `_fixtures/STRINGS`
// map (the QUAL-05 parity proof) — copy is never hardcoded in the story.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { FreshnessPill, type FreshnessState } from "./FreshnessPill";

export default {
  title: "KIT-04 Data-trust / FreshnessPill",
} satisfies StoryDefault;

const STATE_STRING = {
  "up-to-date": STRINGS.freshnessUpToDate,
  stale: STRINGS.freshnessStale,
  offline: STRINGS.freshnessOffline,
  reconnecting: STRINGS.freshnessReconnecting,
} as const satisfies Record<FreshnessState, { readonly ru: string; readonly en: string }>;

const STATES: readonly FreshnessState[] = ["up-to-date", "stale", "offline", "reconnecting"];

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="FreshnessPill — состояния (RU)">
      {STATES.map((state) => (
        <StateCell key={state} label={state}>
          <FreshnessPill state={state} label={STATE_STRING[state].ru} />
        </StateCell>
      ))}
    </StateMatrix>
    <StateMatrix title="FreshnessPill — states (EN)">
      {STATES.map((state) => (
        <StateCell key={state} label={`${state}-en`}>
          <FreshnessPill state={state} label={STATE_STRING[state].en} />
        </StateCell>
      ))}
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  state: FreshnessState;
};

export const Playground: Story<PlaygroundArgs> = ({ state }) => (
  <div className="bg-bg-1 p-4">
    <FreshnessPill state={state} label={STATE_STRING[state].ru} />
  </div>
);

Playground.args = { state: "up-to-date" };
Playground.argTypes = {
  state: {
    options: STATES,
    control: { type: "inline-radio" },
  },
};
