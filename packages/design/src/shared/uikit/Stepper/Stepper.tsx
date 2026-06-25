// KIT-05 — `Stepper`, the numeric stepper over Ark `NumberInput` (Plan 03-03, Wave 3). The
// value is a STRING via controlled `value`/`onValueChange` (Ark's recommendation — the
// NumberInput owns parsing/clamping; RESEARCH Code-Examples), so the v1.0 TanStack Form layer
// composes it the same way `Input` does. The value renders in the mono/stat role
// (`font-mono tabular-nums` — numbers align via the MONO FACE, not weight; 03-UI-SPEC
// Typography). The keyboard model (ArrowUp/Down step, PageUp/Down, clamp to min/max) is Ark's —
// the slice only adds the per-part `tv()` recipe + `data-*` hooks (RESEARCH Don't-Hand-Roll).
//
// Composes under the `Field` wrapper (Plan 03-02) for its label/error/required/disabled —
// `Field.Root` broadcasts those via Ark context. The inc/dec triggers are icon-only (Lucide
// Plus/Minus, `aria-hidden`) and so REQUIRE an accessible name (a11y.md icon-only controls):
// `incrementAria`/`decrementAria` arrive as resolved plain strings the STORY passes from
// `stepperIncrement`/`stepperDecrement` — the slice does NOT invent them (component-shape.md;
// the `Button` aria-label precedent). NO i18n import (architecture.md uikit boundary).
// `data-stepper` slice hook.
//
// Discretion recorded (D-05 family): `Stepper` is its own slice, NOT a `NumberInput` variant —
// it has a distinct mono-value contract and its own aria-labelled triggers; planner's call.
import type { ReactNode } from "react";
import { NumberInput } from "@ark-ui/react/number-input";
import { Minus, Plus } from "lucide-react";
import { stepper } from "./stepper";

const styles = stepper();

type Props = {
  // system props first
  className?: string;
  // values
  value?: string;
  /** Accessible name for the increment trigger (resolved string — the story injects it). */
  incrementAria: string;
  /** Accessible name for the decrement trigger (resolved string — the story injects it). */
  decrementAria: string;
  min?: number;
  max?: number;
  step?: number;
  // booleans
  disabled?: boolean;
  // callbacks
  onValueChange?: (value: string) => void;
};

export function Stepper({
  className,
  value,
  incrementAria,
  decrementAria,
  min,
  max,
  step,
  disabled = false,
  onValueChange,
}: Props): ReactNode {
  return (
    <NumberInput.Root
      className={className}
      value={value}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onValueChange={
        onValueChange === undefined ? undefined : (details) => onValueChange(details.value)
      }
      data-stepper
    >
      <NumberInput.Control className={styles.control()}>
        <NumberInput.DecrementTrigger
          className={styles.decrementTrigger()}
          aria-label={decrementAria}
        >
          <Minus className="size-4 shrink-0" aria-hidden />
        </NumberInput.DecrementTrigger>
        <NumberInput.Input className={styles.input()} />
        <NumberInput.IncrementTrigger
          className={styles.incrementTrigger()}
          aria-label={incrementAria}
        >
          <Plus className="size-4 shrink-0" aria-hidden />
        </NumberInput.IncrementTrigger>
      </NumberInput.Control>
    </NumberInput.Root>
  );
}
