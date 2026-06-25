// KIT-05 Select catalog stories (Plan 03-03, Wave 3). Two D-02 modes: a static `Matrix`
// grid (`StateCell` from `_state-matrix`) and an interactive `Playground`. The Matrix
// demonstrates the ×4 data-volume states (empty / few / many / limit-reached option lists,
// 03-UI-SPEC Per-Component-States) AND a FORCED-OPEN cell via Ark `open` (the static
// axe/keyboard gate mechanism — controlled open, no Ladle hack, RESEARCH Pitfall 2); the
// forced-open cell is what the `keyboard.spec` Select block drives GREEN. Every cell nests
// under the `Field` wrapper so the label↔control association is exercised.
//
// Strings resolve in the STORY via `i18n._({ id })` (active locale from the Ladle language
// control) and pass as plain `placeholder`/`label`/option-`label` props — the primitive stays
// i18n-free (architecture.md uikit boundary). The `longest`-label cell is the QUAL-05
// RU-longest clip check at the 360 floor.
import type { Story, StoryDefault } from "@ladle/react";
import { i18n } from "../_i18n";
import { Field } from "../Field";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Select, type SelectOption } from "./Select";

export default {
  title: "KIT-05 Form / Select",
} satisfies StoryDefault;

// Map-name option fixtures, resolved through the catalog. The ×4 data-volume cells slice this
// list to demonstrate few / many / limit-reached; the empty cell passes [].
const MAP_OPTIONS = [
  { value: "altis", label: i18n._({ id: "selectOptionAltis" }) },
  { value: "stratis", label: i18n._({ id: "selectOptionStratis" }) },
  { value: "tanoa", label: i18n._({ id: "selectOptionTanoa" }) },
  { value: "malden", label: i18n._({ id: "selectOptionMalden" }) },
  { value: "livonia", label: i18n._({ id: "selectOptionLivonia" }) },
  { value: "chernarus", label: i18n._({ id: "selectOptionChernarus" }) },
] as const satisfies readonly SelectOption<string>[];

const FEW_OPTIONS = MAP_OPTIONS.slice(0, 2);
const MANY_OPTIONS = MAP_OPTIONS;
const NO_OPTIONS: readonly SelectOption<string>[] = [];

export const Matrix: Story = () => {
  const placeholder = i18n._({ id: "selectPlaceholder" });
  const label = i18n._({ id: "selectLabel" });

  return (
    <div className="flex flex-col gap-6 bg-bg-1 p-4">
      <StateMatrix title="Select — состояния / states">
        <StateCell label="default">
          <Field label={label}>
            <Select options={FEW_OPTIONS} placeholder={placeholder} />
          </Field>
        </StateCell>

        <StateCell label="selected">
          <Field label={label}>
            <Select options={MANY_OPTIONS} value="tanoa" placeholder={placeholder} />
          </Field>
        </StateCell>

        <StateCell label="disabled">
          <Field label={label} disabled>
            <Select options={FEW_OPTIONS} placeholder={placeholder} disabled />
          </Field>
        </StateCell>

        {/* Forced-open: Ark `defaultOpen` renders the popover deterministically so the catalog
            axe pass runs against a real open listbox (RESEARCH Pitfall 2 — no Ladle hack).
            UNCONTROLLED (defaultOpen) — the closed cells above stay user-openable, which the
            keyboard.spec drives. */}
        <StateCell label="open">
          <Field label={label}>
            <Select options={MANY_OPTIONS} value="altis" placeholder={placeholder} defaultOpen />
          </Field>
        </StateCell>
      </StateMatrix>

      <StateMatrix title="Select — data-volume (empty / few / many / limit)">
        <StateCell label="empty">
          <Field label={label}>
            <Select options={NO_OPTIONS} placeholder={placeholder} />
          </Field>
        </StateCell>

        <StateCell label="few">
          <Field label={label}>
            <Select options={FEW_OPTIONS} placeholder={placeholder} />
          </Field>
        </StateCell>

        <StateCell label="many">
          <Field label={label}>
            <Select options={MANY_OPTIONS} placeholder={placeholder} />
          </Field>
        </StateCell>

        {/* Limit-reached: the full list with a selection — the popover scroll-clamps at
            max-h (the recipe `max-h-64 overflow-y-auto`), never an unbounded surface. */}
        <StateCell label="limit">
          <Field label={label}>
            <Select options={MANY_OPTIONS} value="chernarus" placeholder={placeholder} />
          </Field>
        </StateCell>
      </StateMatrix>

      {/* QUAL-05 RU-longest label clip check at the 360 narrowest floor. */}
      <div className="w-90">
        <Field label={i18n._({ id: "fieldLabelLongest" })}>
          <Select options={MANY_OPTIONS} placeholder={placeholder} />
        </Field>
      </div>
    </div>
  );
};

type PlaygroundArgs = {
  disabled: boolean;
};

export const Playground: Story<PlaygroundArgs> = ({ disabled }) => (
  <div className="w-90 bg-bg-1 p-4">
    <Field label={i18n._({ id: "selectLabel" })} disabled={disabled}>
      <Select
        options={MAP_OPTIONS}
        placeholder={i18n._({ id: "selectPlaceholder" })}
        disabled={disabled}
      />
    </Field>
  </div>
);

Playground.args = { disabled: false };
Playground.argTypes = {
  disabled: { control: { type: "boolean" } },
};
