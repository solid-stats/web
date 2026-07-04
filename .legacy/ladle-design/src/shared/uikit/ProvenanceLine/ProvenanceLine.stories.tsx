// ProvenanceLine catalog stories (KIT-04 model A). `Matrix` shows the line across the
// 4 freshness variants plus the RU one/few/many pluralization (1 / 3 / 12 / 21 replays),
// in both RU and EN; `Playground` exposes the replay count + freshness via Ladle args.
// All copy comes from the canonical `_fixtures/STRINGS` map (QUAL-05 parity).
import type { Story, StoryDefault } from "@ladle/react";
import type { FreshnessState } from "../FreshnessPill";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { ProvenanceLine } from "./ProvenanceLine";

export default {
  title: "KIT-04 Data-trust / ProvenanceLine",
} satisfies StoryDefault;

const FRESHNESS_STRING = {
  "up-to-date": STRINGS.freshnessUpToDate,
  stale: STRINGS.freshnessStale,
  offline: STRINGS.freshnessOffline,
  reconnecting: STRINGS.freshnessReconnecting,
} as const satisfies Record<FreshnessState, { readonly ru: string; readonly en: string }>;

const FRESHNESS_STATES: readonly FreshnessState[] = [
  "up-to-date",
  "stale",
  "offline",
  "reconnecting",
];

// RU one/few/many pluralization proof: 1 «реплей», 3 «реплея», 12 «реплеев», 21 «реплей».
const PLURAL_COUNTS: readonly number[] = [1, 3, 12, 21];

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="ProvenanceLine — freshness-варианты (RU)">
      {FRESHNESS_STATES.map((state) => (
        <StateCell key={state} label={state}>
          <ProvenanceLine
            replayCount={1342}
            freshnessLabel={FRESHNESS_STRING[state].ru}
            template={STRINGS.provenanceLine.ru}
            locale="ru"
            linkLabel="Как считается"
          />
        </StateCell>
      ))}
    </StateMatrix>
    <StateMatrix title="ProvenanceLine — RU one/few/many (N реплеев)">
      {PLURAL_COUNTS.map((n) => (
        <StateCell key={n} label={`n-${n}`}>
          <ProvenanceLine
            replayCount={n}
            freshnessLabel={FRESHNESS_STRING["up-to-date"].ru}
            template={STRINGS.provenanceLine.ru}
            locale="ru"
            linkLabel="Как считается"
          />
        </StateCell>
      ))}
    </StateMatrix>
    <StateMatrix title="ProvenanceLine — states (EN)">
      {FRESHNESS_STATES.map((state) => (
        <StateCell key={state} label={`${state}-en`}>
          <ProvenanceLine
            replayCount={1342}
            freshnessLabel={FRESHNESS_STRING[state].en}
            template={STRINGS.provenanceLine.en}
            locale="en"
            linkLabel="How it's computed"
          />
        </StateCell>
      ))}
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  replayCount: number;
  freshness: FreshnessState;
};

export const Playground: Story<PlaygroundArgs> = ({ replayCount, freshness }) => (
  <div className="bg-bg-1 p-4">
    <ProvenanceLine
      replayCount={replayCount}
      freshnessLabel={FRESHNESS_STRING[freshness].ru}
      template={STRINGS.provenanceLine.ru}
      locale="ru"
      linkLabel="Как считается"
    />
  </div>
);

Playground.args = { replayCount: 1342, freshness: "up-to-date" };
Playground.argTypes = {
  freshness: {
    options: FRESHNESS_STATES,
    control: { type: "inline-radio" },
  },
};
