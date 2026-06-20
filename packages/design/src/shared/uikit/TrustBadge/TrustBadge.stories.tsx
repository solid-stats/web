// TrustBadge catalog stories (KIT-04). `Matrix` lays the 3 kinds out via StateMatrix
// in RU + EN — proving Unknown/Conflict render the literal amber WORD (never `0`/`—`).
// `Playground` exposes the kind via Ladle args. Copy comes from `_fixtures/STRINGS`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { TrustBadge, type TrustKind } from "./TrustBadge";

export default {
  title: "KIT-04 Data-trust / TrustBadge",
} satisfies StoryDefault;

const KIND_STRING = {
  known: STRINGS.knownBadge,
  unknown: STRINGS.unknownBadge,
  conflict: STRINGS.conflictBadge,
} as const satisfies Record<TrustKind, { readonly ru: string; readonly en: string }>;

const KINDS: readonly TrustKind[] = ["known", "unknown", "conflict"];

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="TrustBadge — состояния (RU)">
      {KINDS.map((kind) => (
        <StateCell key={kind} label={kind}>
          <TrustBadge kind={kind} label={KIND_STRING[kind].ru} />
        </StateCell>
      ))}
    </StateMatrix>
    <StateMatrix title="TrustBadge — states (EN)">
      {KINDS.map((kind) => (
        <StateCell key={kind} label={`${kind}-en`}>
          <TrustBadge kind={kind} label={KIND_STRING[kind].en} />
        </StateCell>
      ))}
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  kind: TrustKind;
};

export const Playground: Story<PlaygroundArgs> = ({ kind }) => (
  <div className="bg-bg-1 p-4">
    <TrustBadge kind={kind} label={KIND_STRING[kind].ru} />
  </div>
);

Playground.args = { kind: "unknown" };
Playground.argTypes = {
  kind: {
    options: KINDS,
    control: { type: "inline-radio" },
  },
};
