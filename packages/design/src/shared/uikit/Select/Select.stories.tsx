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

// GAP-15 fixture: a deliberately very long option label (the resolved map names joined) that,
// in a NARROW trigger at the 360 floor, would push an uncapped listbox wider than the viewport.
// The label is composed from already-resolved i18n strings in the STORY (the slice stays
// i18n-free — architecture.md uikit boundary). It drives the `LongOptionCap` story below.
const LONG_OPTION_LABEL = MAP_OPTIONS.map((o) => o.label).join(" · ");
const LONGCAP_OPTIONS = [
  { value: "long", label: LONG_OPTION_LABEL },
  ...FEW_OPTIONS,
] as const satisfies readonly SelectOption<string>[];

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

        {/* GAP-10: a clearable Select with a preset (uncontrolled `defaultValue`) value — the
            overlay-form-interaction spec drives its accessible-named clear control and asserts it
            resets the trigger to the placeholder. Opt-in `clearable`; the slice stays i18n-free
            (the story resolves the clear control's accessible name). */}
        <StateCell label="clearable">
          <Field label={label}>
            <Select
              options={MANY_OPTIONS}
              defaultValue="tanoa"
              placeholder={placeholder}
              clearable
              clearAria={i18n._({ id: "selectClear" })}
            />
          </Field>
        </StateCell>
      </StateMatrix>

      <StateMatrix title="Select — data-volume (empty / few / many / limit)">
        {/* GAP-09: forced-open so the in-listbox empty state is asserted by the
            overlay-form-interaction spec; `emptyText` surfaces the message+icon row instead of
            blank padding (the slice stays i18n-free — the story resolves the copy). */}
        <StateCell label="empty">
          <Field label={label}>
            <Select
              options={NO_OPTIONS}
              placeholder={placeholder}
              emptyText={i18n._({ id: "selectEmpty" })}
              defaultOpen
            />
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
      <div className="w-full max-w-90">
        <Field label={i18n._({ id: "fieldLabelLongest" })}>
          <Select options={MANY_OPTIONS} placeholder={placeholder} />
        </Field>
      </div>
    </div>
  );
};

// GAP-15: a forced-open Select with a very long option in a NARROW (`w-40`) trigger at the 360
// floor. Pre-fix the uncapped listbox grows wider than the viewport (overflow); the `content`
// max-width cap keeps it ≤ the floor while still growing wider than the trigger (the grow is
// preserved). The `form-layout-sweep` spec drives this cell.
export const LongOptionCap: Story = () => (
  <div className="bg-bg-1 p-4">
    <div className="w-40">
      <Field label={i18n._({ id: "selectLabel" })}>
        <Select
          options={LONGCAP_OPTIONS}
          placeholder={i18n._({ id: "selectPlaceholder" })}
          defaultOpen
        />
      </Field>
    </div>
  </div>
);

type PlaygroundArgs = {
  disabled: boolean;
};

export const Playground: Story<PlaygroundArgs> = ({ disabled }) => (
  <div className="w-full max-w-90 bg-bg-1 p-4">
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
