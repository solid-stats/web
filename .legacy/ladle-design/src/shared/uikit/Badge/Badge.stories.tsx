// Badge catalog stories (KIT-07). `Matrix` lays every outcome + status variant out
// via StateMatrix in RU + EN — proving each renders its Lucide icon + a literal label
// (never color-alone), `rounded-xs`. `Playground` exposes the variant via Ladle args.
// Copy comes from `_fixtures/STRINGS`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Badge, type BadgeVariant } from "./Badge";

export default {
  title: "KIT-07 Feedback / Badge",
} satisfies StoryDefault;

const VARIANT_STRING = {
  "outcome-win": STRINGS.outcomeWin,
  "outcome-loss": STRINGS.outcomeLoss,
  "status-pending": STRINGS.statusPending,
  "status-approved": STRINGS.statusApproved,
  "status-rejected": STRINGS.statusRejected,
} as const satisfies Record<BadgeVariant, { readonly ru: string; readonly en: string }>;

const VARIANTS: readonly BadgeVariant[] = [
  "outcome-win",
  "outcome-loss",
  "status-pending",
  "status-approved",
  "status-rejected",
];

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="Badge — варианты (RU)">
      {VARIANTS.map((variant) => (
        <StateCell key={variant} label={variant}>
          <Badge variant={variant} label={VARIANT_STRING[variant].ru} />
        </StateCell>
      ))}
    </StateMatrix>
    <StateMatrix title="Badge — variants (EN)">
      {VARIANTS.map((variant) => (
        <StateCell key={variant} label={`${variant}-en`}>
          <Badge variant={variant} label={VARIANT_STRING[variant].en} />
        </StateCell>
      ))}
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  variant: BadgeVariant;
};

export const Playground: Story<PlaygroundArgs> = ({ variant }) => (
  <div className="bg-bg-1 p-4">
    <Badge variant={variant} label={VARIANT_STRING[variant].ru} />
  </div>
);

Playground.args = { variant: "outcome-win" };
Playground.argTypes = {
  variant: {
    options: VARIANTS,
    control: { type: "inline-radio" },
  },
};
