// Button/Link base-primitive catalog stories (GAP-19, Plan 02-07). `StateMatrix` lays
// the variants × the forced interaction states (enabled / hover / pressed / focused /
// disabled) out via the established `data-state` forced-pseudo-state pattern (RESEARCH
// Pattern 2, the NavBar/Th precedent): each forced cell applies the SAME token
// utilities the live `:hover`/`:active`/`:focus-visible` apply, so one button renders a
// state with no real pointer. `Link` is shown as a variant too (the `<a>` affordance
// sharing the recipe). `Playground` exposes variant/size/active/disabled via Ladle
// args. Demo labels are literal "Button"/"Link" — a showcase reuses no STRINGS keys.
import type { Story, StoryDefault } from "@ladle/react";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Button } from "./Button";
import type { ButtonSize, ButtonVariant } from "./control";
import { Link } from "./Link";

export default {
  title: "Base / Button",
} satisfies StoryDefault;

const VARIANTS: readonly ButtonVariant[] = ["primary", "secondary", "ghost", "segment"];

// The forced interaction states. Each maps to the SAME token utilities the live
// pseudo-classes apply — the catalog override the `data-state` cell renders (no real
// pointer). `enabled` is the resting recipe; `disabled` flows through the recipe's own
// `disabled` variant (and the real `disabled` attr).
type ForcedState = "enabled" | "hover" | "pressed" | "focused" | "disabled";
const FORCED: Record<Exclude<ForcedState, "enabled" | "disabled">, string> = {
  hover: "bg-surface-3 text-text-primary",
  pressed: "translate-y-px bg-surface-2 text-text-primary",
  focused: "shadow-(--shadow-ring) outline-none",
};
const STATES: readonly ForcedState[] = ["enabled", "hover", "pressed", "focused", "disabled"];

function ForcedButton({
  variant,
  state,
}: {
  variant: ButtonVariant;
  state: ForcedState;
}): ReturnType<Story> {
  const forced = state === "hover" || state === "pressed" || state === "focused";
  return (
    <Button
      variant={variant}
      disabled={state === "disabled"}
      data-state={state}
      className={forced ? FORCED[state] : undefined}
    >
      Button
    </Button>
  );
}

export const StateMatrixStory: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    {VARIANTS.map((variant) => (
      <StateMatrix key={variant} title={`Button — ${variant} × состояния`}>
        {STATES.map((state) => (
          <StateCell key={`${variant}-${state}`} label={state}>
            <ForcedButton variant={variant} state={state} />
          </StateCell>
        ))}
      </StateMatrix>
    ))}

    <StateMatrix title="Link — affordance (та же recipe, <a>)">
      {VARIANTS.map((variant) => (
        <StateCell key={`link-${variant}`} label={variant}>
          <Link href="#button-demo" variant={variant}>
            Link
          </Link>
        </StateCell>
      ))}
    </StateMatrix>

    <StateMatrix title="Button — размеры sm / md">
      {(["sm", "md"] as const).map((size: ButtonSize) => (
        <StateCell key={size} label={size}>
          <Button variant="primary" size={size}>
            Button
          </Button>
        </StateCell>
      ))}
    </StateMatrix>

    {/* The segment active member (the sorted sort-header) — cyan, paired in real use
        with aria-sort + the arrow (never color-alone). */}
    <StateMatrix title="Button — segment active (cyan member)">
      <StateCell label="active">
        <Button variant="segment" active>
          Button
        </Button>
      </StateCell>
      <StateCell label="resting">
        <Button variant="segment">Button</Button>
      </StateCell>
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  variant: ButtonVariant;
  size: ButtonSize;
  active: boolean;
  disabled: boolean;
};

export const Playground: Story<PlaygroundArgs> = ({ variant, size, active, disabled }) => (
  <div className="bg-bg-1 p-4">
    <Button variant={variant} size={size} active={active} disabled={disabled}>
      Button
    </Button>
  </div>
);

Playground.args = { variant: "primary", size: "md", active: false, disabled: false };
Playground.argTypes = {
  variant: { options: VARIANTS, control: { type: "inline-radio" } },
  size: { options: ["sm", "md"], control: { type: "inline-radio" } },
  active: { control: { type: "boolean" } },
  disabled: { control: { type: "boolean" } },
};
