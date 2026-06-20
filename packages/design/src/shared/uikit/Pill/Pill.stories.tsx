// Pill catalog stories (KIT-07). `Matrix` lays the tones out via StateMatrix in
// RU + EN — proving the generic rounded-full chip always renders an icon + literal
// label (never color-alone). `Playground` exposes the tone via Ladle args. Copy
// comes from `_fixtures/STRINGS`; icons are Lucide PascalCase locals.
import type { Story, StoryDefault } from "@ladle/react";
import { CircleCheck, CircleHelp, Info, Tag, TriangleAlert, type LucideIcon } from "lucide-react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Pill, type PillTone } from "./Pill";

export default {
  title: "KIT-07 Feedback / Pill",
} satisfies StoryDefault;

// One representative copy + icon per tone (the generic pill carries any label —
// these are demo pairings, all from STRINGS / Lucide).
const TONE_DEMO = {
  neutral: { icon: Tag, string: STRINGS.knownBadge },
  win: { icon: CircleCheck, string: STRINGS.freshnessUpToDate },
  loss: { icon: TriangleAlert, string: STRINGS.freshnessOffline },
  warn: { icon: CircleHelp, string: STRINGS.unknownBadge },
  info: { icon: Info, string: STRINGS.freshnessReconnecting },
} as const satisfies Record<
  PillTone,
  { readonly icon: LucideIcon; readonly string: { readonly ru: string; readonly en: string } }
>;

const TONES: readonly PillTone[] = ["neutral", "win", "loss", "warn", "info"];

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="Pill — тона (RU)">
      {TONES.map((tone) => (
        <StateCell key={tone} label={tone}>
          <Pill tone={tone} icon={TONE_DEMO[tone].icon} label={TONE_DEMO[tone].string.ru} />
        </StateCell>
      ))}
    </StateMatrix>
    <StateMatrix title="Pill — tones (EN)">
      {TONES.map((tone) => (
        <StateCell key={tone} label={`${tone}-en`}>
          <Pill tone={tone} icon={TONE_DEMO[tone].icon} label={TONE_DEMO[tone].string.en} />
        </StateCell>
      ))}
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  tone: PillTone;
};

export const Playground: Story<PlaygroundArgs> = ({ tone }) => (
  <div className="bg-bg-1 p-4">
    <Pill tone={tone} icon={TONE_DEMO[tone].icon} label={TONE_DEMO[tone].string.ru} />
  </div>
);

Playground.args = { tone: "neutral" };
Playground.argTypes = {
  tone: {
    options: TONES,
    control: { type: "inline-radio" },
  },
};
