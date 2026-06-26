// KIT-05 Field catalog stories (Plan 03-02, Wave 2). Two D-02 modes: a static `Matrix`
// grid (`StateCell` from `_state-matrix`) laying out the Field scenario endings — crucially
// the FORCED-INVALID cell (`Field invalid` + an `errorText`), which is the axe + live-region
// gate the Wave-0 keyboard spec `kit-05-form--field--matrix` turns GREEN (no Ladle hack —
// Ark `Field.Root invalid` broadcasts to the nested `Input`, RESEARCH Pitfall 2); and a
// `Playground` with Ladle args.
//
// Every string resolves in the STORY via `i18n._({ id })` (the active locale comes from the
// Ladle language control in the GlobalProvider) and passes as a plain `label`/`errorText`/
// `helperText` prop — the primitive stays i18n-free (architecture.md uikit boundary). The
// `longest`-label cell is the QUAL-05 RU-longest clip check rendered at the 360 floor.
import type { Story, StoryDefault } from "@ladle/react";
import { i18n } from "../_i18n";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Input } from "../Input";
import { Field } from "./Field";

export default {
  title: "KIT-05 Form / Field",
} satisfies StoryDefault;

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="Field — состояния / scenario endings">
      <StateCell label="default">
        <Field label={i18n._({ id: "fieldRequired" })} helperText={i18n._({ id: "fieldRequired" })}>
          <Input placeholder={i18n._({ id: "selectPlaceholder" })} />
        </Field>
      </StateCell>

      <StateCell label="required">
        <Field
          label={i18n._({ id: "selectLabel" })}
          requiredText={i18n._({ id: "fieldRequired" })}
          required
        >
          <Input placeholder={i18n._({ id: "selectPlaceholder" })} />
        </Field>
      </StateCell>

      {/* The forced-invalid axe + live-region gate cell — Ark Field.Root invalid
          broadcasts to the nested Input (aria-invalid + aria-describedby), and
          Field.ErrorText renders the announced, associated error. No Ladle hack. */}
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

    {/* QUAL-05 RU-longest label clip check at the 360 narrowest floor. */}
    <div className="w-90">
      <Field
        label={i18n._({ id: "fieldLabelLongest" })}
        helperText={i18n._({ id: "fieldRequired" })}
      >
        <Input placeholder={i18n._({ id: "selectPlaceholder" })} />
      </Field>
    </div>
  </div>
);

type PlaygroundArgs = {
  invalid: boolean;
  required: boolean;
  disabled: boolean;
};

export const Playground: Story<PlaygroundArgs> = ({ invalid, required, disabled }) => (
  <div className="w-90 bg-bg-1 p-4">
    <Field
      label={i18n._({ id: "fieldRequired" })}
      requiredText={i18n._({ id: "fieldRequired" })}
      helperText={i18n._({ id: "fieldRequired" })}
      errorText={i18n._({ id: "fieldErrorRequired" })}
      invalid={invalid}
      required={required}
      disabled={disabled}
    >
      <Input placeholder={i18n._({ id: "selectPlaceholder" })} disabled={disabled} />
    </Field>
  </div>
);

Playground.args = { invalid: false, required: true, disabled: false };
Playground.argTypes = {
  invalid: { control: { type: "boolean" } },
  required: { control: { type: "boolean" } },
  disabled: { control: { type: "boolean" } },
};
