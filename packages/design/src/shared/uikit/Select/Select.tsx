// KIT-05 — `Select`, the typed-value option control (Plan 03-03, Wave 3). A GENERIC over
// the option value union (`Select<TValue extends string>`): the `options` and the controlled
// `value`/`onValueChange` narrow to the SAME `TValue` union, NOT a loose `SelectOption<string>`
// (03-UI-SPEC KIT-05 — typed by the value union). The keyboard model (arrow / Home / End /
// type-ahead / wrap, `aria-expanded`/`aria-controls`, no trap) is Ark's — the slice only adds
// the per-part `tv()` recipe + `data-*` hooks (RESEARCH Don't-Hand-Roll; a11y.md prefer the
// Ark primitive over a hand-rolled listbox).
//
// Composes under the `Field` wrapper (Plan 03-02) for its label/error/required/disabled —
// `Field.Root` broadcasts those via Ark context; rendering the trigger inside a `Field`
// associates the visible label. The active/selected option is cyan PAIRED with the
// `ItemIndicator` check (never color-alone — a11y.md). `placeholder` arrives as a resolved
// plain string (no i18n import — architecture.md uikit boundary). `data-select` slice hook;
// the forced-`open` StateMatrix cell renders the popover deterministically (RESEARCH
// Pitfall 2 — controlled `open`, no Ladle hack).
import { type ReactNode, useMemo } from "react";
import { Portal } from "@ark-ui/react/portal";
import { Select as ArkSelect, createListCollection } from "@ark-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { select } from "./select";

const styles = select();

/** One typed option: its `value` is the narrowed union member, `label` the visible copy. */
export type SelectOption<TValue extends string> = {
  readonly value: TValue;
  readonly label: string;
};

type Props<TValue extends string> = {
  // system props first
  className?: string;
  // values
  options: readonly SelectOption<TValue>[];
  value?: TValue;
  placeholder: string;
  // booleans
  disabled?: boolean;
  /** Forced-open for the StateMatrix axe/keyboard cell (controlled — RESEARCH Pitfall 2). */
  open?: boolean;
  // callbacks
  onValueChange?: (value: TValue) => void;
};

export function Select<TValue extends string>({
  className,
  options,
  value,
  placeholder,
  disabled = false,
  open,
  onValueChange,
}: Props<TValue>): ReactNode {
  // Ark v5 wants a collection (owns label/value mapping + type-ahead). Memoized so a fresh
  // array literal does not rebuild it every render (component-shape.md).
  const collection = useMemo(
    () => createListCollection({ items: options as SelectOption<TValue>[] }),
    [options],
  );

  return (
    <ArkSelect.Root
      className={className}
      collection={collection}
      value={value === undefined ? undefined : [value]}
      disabled={disabled}
      open={open}
      onValueChange={
        onValueChange === undefined
          ? undefined
          : (details) => {
              const next = details.value[0];
              if (next !== undefined) onValueChange(next as TValue);
            }
      }
      data-select
    >
      <ArkSelect.Control>
        <ArkSelect.Trigger className={styles.trigger()}>
          <ArkSelect.ValueText className={styles.valueText()} placeholder={placeholder} />
          <ChevronDown className={styles.indicator()} aria-hidden />
        </ArkSelect.Trigger>
      </ArkSelect.Control>
      <Portal>
        <ArkSelect.Positioner className={styles.positioner()}>
          <ArkSelect.Content className={styles.content()}>
            {collection.items.map((item) => (
              <ArkSelect.Item key={item.value} item={item} className={styles.item()}>
                <ArkSelect.ItemText className={styles.itemText()}>{item.label}</ArkSelect.ItemText>
                <ArkSelect.ItemIndicator className={styles.itemIndicator()}>
                  <Check className="size-4 shrink-0" aria-hidden />
                </ArkSelect.ItemIndicator>
              </ArkSelect.Item>
            ))}
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
    </ArkSelect.Root>
  );
}
