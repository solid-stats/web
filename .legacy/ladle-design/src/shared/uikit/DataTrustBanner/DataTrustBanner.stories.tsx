// DataTrustBanner catalog stories (KIT-04). `Matrix` shows the 3 kinds plus the
// `reserved` (absent) cell that occupies the SAME height — the CLS = 0 proof the
// catalog spec asserts (`data-banner-reserved` height === a filled banner's height).
// `Playground` exposes the kind via Ladle args. Copy from `_fixtures/STRINGS`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { type BannerKind, DataTrustBanner } from "./DataTrustBanner";

export default {
  title: "KIT-04 Data-trust / DataTrustBanner",
} satisfies StoryDefault;

const KIND_STRING = {
  stale: STRINGS.staleBanner,
  offline: STRINGS.offlineBanner,
  reconnecting: STRINGS.reconnectingBanner,
} as const satisfies Record<
  Exclude<BannerKind, "reserved">,
  { readonly ru: string; readonly en: string }
>;

const FILLED: readonly Exclude<BannerKind, "reserved">[] = ["stale", "offline", "reconnecting"];

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="DataTrustBanner — состояния (RU) + reserved (CLS = 0)">
      {FILLED.map((kind) => (
        <StateCell key={kind} label={kind}>
          <DataTrustBanner kind={kind} label={KIND_STRING[kind].ru} />
        </StateCell>
      ))}
      <StateCell label="reserved">
        <DataTrustBanner kind="reserved" />
      </StateCell>
    </StateMatrix>
    <StateMatrix title="DataTrustBanner — states (EN)">
      {FILLED.map((kind) => (
        <StateCell key={kind} label={`${kind}-en`}>
          <DataTrustBanner kind={kind} label={KIND_STRING[kind].en} />
        </StateCell>
      ))}
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  kind: BannerKind;
};

export const Playground: Story<PlaygroundArgs> = ({ kind }) => (
  <div className="bg-bg-1 p-4">
    <DataTrustBanner kind={kind} label={kind === "reserved" ? undefined : KIND_STRING[kind].ru} />
  </div>
);

Playground.args = { kind: "stale" };
Playground.argTypes = {
  kind: {
    options: ["stale", "offline", "reconnecting", "reserved"],
    control: { type: "inline-radio" },
  },
};
