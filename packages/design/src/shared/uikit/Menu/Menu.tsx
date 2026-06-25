// KIT-06 — `Menu`, the trigger-menu overlay (Plan 03-06, Wave 6). A thin wrapper over Ark
// Menu: ARK owns the load-bearing accessibility — `aria-expanded`/`aria-controls` on the
// trigger, the roving keyboard highlight (arrow / Home / End / type-ahead / wrap), Esc-close,
// and the no-trap dismiss layer (RESEARCH Don't-Hand-Roll; a11y.md "prefer the Ark primitive
// over hand-rolling option/menu keyboard handling"). Do NOT hand-roll any of it. The slice only
// adds the per-part `tv()` recipe (menu.ts), the `data-menu` hooks, and the controlled props.
//
// Boundary (architecture.md uikit-vs-feature): NO i18n import. The item `label`s + the `trigger`
// arrive as plain resolved strings/elements the STORY computes via `i18n._` — the primitive is
// i18n-free. The `trigger` is passed by the caller (rendered through the shared `Button` via
// `asChild` — the ONLY sanctioned `asChild` use, to slot the canonical ring + ≥44px floor); it
// carries the `data-menu-trigger` hook the keyboard.spec drives (aria-expanded false→true,
// aria-controls → the open panel id).
//
// `open`/`onOpenChange` are the CONTROLLED disclosure (the interactive Playground); `lazyMount`
// + `unmountOnExit` keep the portal out of the DOM while closed. The StateMatrix forced-open
// cell passes UNCONTROLLED `defaultOpen` (RESEARCH Pitfall 2 — Ark renders the open menu
// deterministically for the static axe gate, no Ladle hack; controlled `open` would pin every
// instance, the Select Rule-1 lesson). Literal `tv()` classes are `@source`-scanned even
// through the Portal (RESEARCH Pitfall 3).
import type { ReactNode } from "react";
import { Menu as ArkMenu } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import { menu } from "./menu";

const styles = menu();

/** One menu item: `value` is the stable id Ark keys the highlight/selection on, `label` the
 *  visible copy, `onSelect` the optional activation handler. */
export type MenuItemData = {
  readonly value: string;
  readonly label: string;
  readonly onSelect?: () => void;
};

type Props = {
  // system props first
  className?: string;
  // values
  /** The open affordance (rendered by the caller through the shared `Button`). Ark wires the
   *  trigger's `aria-expanded`/`aria-controls` + the `data-menu-trigger` open behaviour. */
  trigger: ReactNode;
  /** The typed item list — labels resolved in the story (the primitive is i18n-free). */
  items: readonly MenuItemData[];
  // booleans
  /** Controlled open state (the interactive Playground path). */
  open?: boolean;
  /** Uncontrolled initial open — the forced-open StateMatrix axe cell (RESEARCH Pitfall 2). */
  defaultOpen?: boolean;
  // callbacks
  onOpenChange?: (open: boolean) => void;
};

export function Menu({
  className,
  trigger,
  items,
  open,
  defaultOpen,
  onOpenChange,
}: Props): ReactNode {
  return (
    <ArkMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={
        onOpenChange === undefined ? undefined : (details) => onOpenChange(details.open)
      }
      lazyMount
      unmountOnExit
    >
      <ArkMenu.Trigger asChild data-menu-trigger>
        {trigger}
      </ArkMenu.Trigger>
      <Portal>
        <ArkMenu.Positioner className={styles.positioner()}>
          <ArkMenu.Content className={styles.content({ className })} data-menu>
            {items.map((item) => (
              <ArkMenu.Item
                key={item.value}
                value={item.value}
                onSelect={item.onSelect}
                className={styles.item()}
              >
                {item.label}
              </ArkMenu.Item>
            ))}
          </ArkMenu.Content>
        </ArkMenu.Positioner>
      </Portal>
    </ArkMenu.Root>
  );
}
