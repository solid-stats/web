// KIT-05 Input catalog stories (Plan 03-02, Wave 2). Two D-02 modes: a static `Matrix`
// grid (`StateCell` from `_state-matrix`) showing the input fill/hover/focus/disabled
// recipe states, each wrapped in a `Field` so the label↔control association is exercised;
// and a `Playground` with Ladle args. Strings resolve in the STORY via `i18n._({ id })`
// (active locale from the Ladle language control) and pass as plain props — the primitive
// stays i18n-free (architecture.md uikit boundary).
import type { Story, StoryDefault } from "@ladle/react";
import { i18n } from "../_i18n";
import { Field } from "../Field";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Input } from "./Input";

export default {
  title: "KIT-05 Form / Input",
} satisfies StoryDefault;

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="Input — fill / focus / disabled (DESIGN.md input recipe)">
      <StateCell label="default">
        <Field label={i18n._({ id: "fieldRequired" })}>
          <Input placeholder={i18n._({ id: "selectPlaceholder" })} />
        </Field>
      </StateCell>

      <StateCell label="filled">
        <Field label={i18n._({ id: "fieldRequired" })}>
          <Input value={i18n._({ id: "fieldLabelLongest" })} />
        </Field>
      </StateCell>

      <StateCell label="invalid">
        <Field
          label={i18n._({ id: "fieldRequired" })}
          errorText={i18n._({ id: "fieldErrorRequired" })}
          invalid
        >
          <Input placeholder={i18n._({ id: "selectPlaceholder" })} />
        </Field>
      </StateCell>

      <StateCell label="disabled">
        <Field label={i18n._({ id: "fieldRequired" })} disabled>
          <Input placeholder={i18n._({ id: "selectPlaceholder" })} disabled />
        </Field>
      </StateCell>
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  placeholder: string;
  disabled: boolean;
};

export const Playground: Story<PlaygroundArgs> = ({ placeholder, disabled }) => (
  <div className="w-full max-w-90 bg-bg-1 p-4">
    <Field label={i18n._({ id: "fieldRequired" })}>
      <Input placeholder={placeholder} disabled={disabled} />
    </Field>
  </div>
);

Playground.args = { placeholder: "Выберите…", disabled: false };
Playground.argTypes = {
  placeholder: { control: { type: "text" } },
  disabled: { control: { type: "boolean" } },
};
