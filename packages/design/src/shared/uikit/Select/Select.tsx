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
import { Check, ChevronDown, SearchX, X } from "lucide-react";
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
  /** Uncontrolled initial value (Ark `defaultValue`) — the clearable demo cell preset that the
   *  native `ClearTrigger` resets without a controlled `onValueChange` (mirrors `defaultOpen`). */
  defaultValue?: TValue;
  placeholder: string;
  /**
   * GAP-09: the message shown inside the listbox when `options` is empty (resolved string —
   * the story injects it; the slice stays i18n-free). When omitted, an empty listbox renders
   * nothing (the legacy behaviour), so an empty Select must pass it to surface the empty state.
   */
  emptyText?: string;
  /**
   * GAP-10: the accessible NAME for the icon-only clear control (resolved string — the story
   * injects it; the slice stays i18n-free). Required when `clearable` to name the control.
   */
  clearAria?: string;
  // booleans
  disabled?: boolean;
  /**
   * GAP-10: opt-in clear affordance. Renders Ark's `ClearTrigger` (auto-hidden while empty) so a
   * value can be reset to the placeholder. Opt-in so existing required Selects keep no clear.
   */
  clearable?: boolean;
  /**
   * Initial open state for the StateMatrix axe/keyboard cell (RESEARCH Pitfall 2). UNCONTROLLED
   * (`defaultOpen`, not `open`) so a closed Select stays user-openable — passing Ark's controlled
   * `open` pins the popover and breaks the open/close disclosure on every other instance.
   */
  defaultOpen?: boolean;
  // callbacks
  onValueChange?: (value: TValue) => void;
};

export function Select<TValue extends string>({
  className,
  options,
  value,
  defaultValue,
  placeholder,
  emptyText,
  clearAria,
  disabled = false,
  defaultOpen = false,
  clearable = false,
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
      defaultValue={defaultValue === undefined ? undefined : [defaultValue]}
      disabled={disabled}
      defaultOpen={defaultOpen}
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
      <ArkSelect.Control className={styles.control()}>
        <ArkSelect.Trigger className={styles.trigger()}>
          <ArkSelect.ValueText className={styles.valueText()} placeholder={placeholder} />
          <ChevronDown className={styles.indicator()} aria-hidden />
        </ArkSelect.Trigger>
        {clearable ? (
          <ArkSelect.ClearTrigger className={styles.clearTrigger()} aria-label={clearAria}>
            <X className="size-4 shrink-0" aria-hidden />
          </ArkSelect.ClearTrigger>
        ) : null}
      </ArkSelect.Control>
      <Portal>
        <ArkSelect.Positioner className={styles.positioner()}>
          <ArkSelect.Content className={styles.content()}>
            {options.length === 0 && emptyText !== undefined ? (
              <div className={styles.empty()} role="presentation" data-select-empty>
                <SearchX className="size-4 shrink-0" aria-hidden />
                <span>{emptyText}</span>
              </div>
            ) : (
              collection.items.map((item) => (
                <ArkSelect.Item key={item.value} item={item} className={styles.item()}>
                  <ArkSelect.ItemText className={styles.itemText()}>
                    {item.label}
                  </ArkSelect.ItemText>
                  <ArkSelect.ItemIndicator className={styles.itemIndicator()}>
                    <Check className="size-4 shrink-0" aria-hidden />
                  </ArkSelect.ItemIndicator>
                </ArkSelect.Item>
              ))
            )}
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
    </ArkSelect.Root>
  );
}
