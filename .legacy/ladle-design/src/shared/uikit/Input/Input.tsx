// KIT-05 — `Input`, the text control styled per the DESIGN.md `input` recipe (Plan 03-02,
// Wave 2). It wraps Ark's `Field.Input` (the control anatomy part), so when nested under a
// `Field` it inherits `invalid`/`required`/`disabled` + the `aria-invalid` /
// `aria-describedby` association from `Field.Root`'s context with no prop drilling
// (RESEARCH Pattern 2; verified against use-field.ts getInputProps). Used standalone it is
// still a styled native input.
//
// Controlled value contract (`value` + `onValueChange`, the Ark/shared shape) so the v1.0
// TanStack Form layer composes it; `placeholder` arrives as a plain string (no i18n import —
// architecture.md uikit boundary). `data-field-control` is the keyboard-spec hook (the
// invalid control the live-error spec asserts `aria-describedby` on); `data-input` the slice
// hook. `disabled` styles via the recipe variant AND is honored as the native attribute.
import type { ReactNode } from "react";
import { Field as ArkField } from "@ark-ui/react/field";
import { input } from "./input";

type Props = {
  // system props first
  className?: string;
  // values
  value?: string;
  placeholder?: string;
  type?: "text" | "search" | "url";
  // booleans
  disabled?: boolean;
  // callbacks
  onValueChange?: (value: string) => void;
};

export function Input({
  className,
  value,
  placeholder,
  type = "text",
  disabled = false,
  onValueChange,
}: Props): ReactNode {
  return (
    <ArkField.Input
      className={input({ disabled, className })}
      value={value}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      onChange={onValueChange === undefined ? undefined : (e) => onValueChange(e.target.value)}
      data-field-control
      data-input
    />
  );
}
