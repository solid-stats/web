// Button/Link base-primitive catalog stories (GAP-19, Plan 02-07). `StateMatrix` lays
// the variants × the forced interaction states (enabled / hover / pressed / focused /
// disabled) out via the established `data-state` forced-pseudo-state pattern (RESEARCH
// Pattern 2, the NavBar/Th precedent): each forced cell applies the SAME token
// utilities the live `:hover`/`:active`/`:focus-visible` apply, so one button renders a
// state with no real pointer. `Link` is shown as a variant too (the `<a>` affordance
// sharing the recipe). `Playground` exposes variant/size/active/disabled via Ladle
// args. Demo labels are literal "Button"/"Link" — a showcase reuses no STRINGS keys.
import type { Story, StoryDefault } from "@ladle/react";
import { RotateCcw, X } from "lucide-react";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Button } from "./Button";
import { FORCED_STATE as FORCED } from "./control";
import type { ButtonSize, ButtonVariant } from "./control";
import { Link } from "./Link";

export default {
  title: "Base / Button",
} satisfies StoryDefault;

const VARIANTS: readonly ButtonVariant[] = ["primary", "secondary", "ghost", "segment"];

// The forced interaction states. Each cell renders the variant's REAL `:hover` /
// `:active` / `:focus-visible` tokens via `FORCED_STATE` (the recipe's mirror in
// control.ts, asserted in sync by control.test.ts) — so a forced cell can't drift from
// the live recipe. (The old map was variant-agnostic: primary "hover" rendered grey,
// never the real cyan — which is how the per-variant behaviour went unreviewed.)
type ForcedState = "enabled" | "hover" | "pressed" | "focused" | "disabled";
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
      className={forced ? FORCED[variant][state] : undefined}
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

    {/* The icon-only square affordance (size="icon"): ≥44px on BOTH axes, an icon child and a
        caller-supplied aria-label (the icon-only accessible name a11y.md requires). The generic
        catalog gate runs axe + the 44px geometry check over these cells. The FileUpload row
        delete/retry route through this same control. */}
    <StateMatrix title="Button — icon-only (square ≥44px)">
      <StateCell label="ghost">
        <Button variant="ghost" size="icon" aria-label="Remove">
          <X className="size-4 shrink-0" aria-hidden />
        </Button>
      </StateCell>
      <StateCell label="secondary">
        <Button variant="secondary" size="icon" aria-label="Retry">
          <RotateCcw className="size-4 shrink-0" aria-hidden />
        </Button>
      </StateCell>
      <StateCell label="disabled">
        <Button variant="ghost" size="icon" aria-label="Remove" disabled>
          <X className="size-4 shrink-0" aria-hidden />
        </Button>
      </StateCell>
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
  size: { options: ["sm", "md", "icon"], control: { type: "inline-radio" } },
  active: { control: { type: "boolean" } },
  disabled: { control: { type: "boolean" } },
};
