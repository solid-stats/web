// KIT-05 Stepper catalog stories (Plan 03-03, Wave 3). Two D-02 modes: a static `Matrix`
// grid (`StateCell` from `_state-matrix`) laying out the stepper states (default / value /
// min-edge / disabled) and an interactive `Playground` (real ArrowUp/Down stepping + clamp).
// Every cell nests under the `Field` wrapper for the label↔control association.
//
// The icon-only inc/dec triggers get their accessible names from the STORY: `incrementAria`/
// `decrementAria` resolve via `i18n._({ id: "stepperIncrement" | "stepperDecrement" })` and
// pass as plain props — the primitive never invents them (a11y.md; architecture.md uikit
// boundary). The value is the mono/stat role (font-mono tabular-nums — alignment via the mono
// face). RU-longest label exercised at the 360 floor (QUAL-05).
import { type ReactNode, useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { i18n } from "../_i18n";
import { Field } from "../Field";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Stepper } from "./Stepper";

export default {
  title: "KIT-05 Form / Stepper",
} satisfies StoryDefault;

export const Matrix: Story = () => {
  const label = i18n._({ id: "selectLabel" });
  const incrementAria = i18n._({ id: "stepperIncrement" });
  const decrementAria = i18n._({ id: "stepperDecrement" });
  const aria = { incrementAria, decrementAria };

  return (
    <div className="flex flex-col gap-6 bg-bg-1 p-4">
      <StateMatrix title="Stepper — состояния / states">
        <StateCell label="default">
          <Field label={label}>
            <Stepper value="0" min={0} max={99} {...aria} />
          </Field>
        </StateCell>

        <StateCell label="value">
          <Field label={label}>
            <Stepper value="42" min={0} max={99} {...aria} />
          </Field>
        </StateCell>

        <StateCell label="min-edge">
          <Field label={label}>
            <Stepper value="0" min={0} max={99} {...aria} />
          </Field>
        </StateCell>

        <StateCell label="disabled">
          <Field label={label} disabled>
            <Stepper value="7" min={0} max={99} disabled {...aria} />
          </Field>
        </StateCell>
      </StateMatrix>

      {/* QUAL-05 RU-longest label clip check at the 360 narrowest floor. */}
      <div className="w-90">
        <Field label={i18n._({ id: "fieldLabelLongest" })}>
          <Stepper value="12" min={0} max={99} {...aria} />
        </Field>
      </div>
    </div>
  );
};

type PlaygroundArgs = {
  value: string;
  disabled: boolean;
};

// GAP-11: the Playground owns ephemeral demo state so inc/dec/keyboard actually mutate the
// displayed value and Ark's min/max clamp is exercised (the catalog demo is not a real
// multi-field form, so `useState` here is correct — the TanStack-Form rule governs real forms).
// Keyed on the `value` arg so editing the control reseeds the demo from the new starting value.
function StepperPlayground({ value, disabled }: PlaygroundArgs): ReactNode {
  const [current, setCurrent] = useState(value);

  return (
    <div className="w-90 bg-bg-1 p-4">
      <Field label={i18n._({ id: "selectLabel" })} disabled={disabled}>
        <Stepper
          value={current}
          onValueChange={setCurrent}
          min={0}
          max={99}
          disabled={disabled}
          incrementAria={i18n._({ id: "stepperIncrement" })}
          decrementAria={i18n._({ id: "stepperDecrement" })}
        />
      </Field>
    </div>
  );
}

export const Playground: Story<PlaygroundArgs> = ({ value, disabled }) => (
  <StepperPlayground key={value} value={value} disabled={disabled} />
);

Playground.args = { value: "10", disabled: false };
Playground.argTypes = {
  value: { control: { type: "text" } },
  disabled: { control: { type: "boolean" } },
};
