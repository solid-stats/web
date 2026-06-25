// KIT-06 — `Popover`, the NON-modal floating overlay (Plan 03-05, Wave 5). The Dialog's
// sibling: same thin-Ark-wrapper shape MINUS the focus trap and the scrim. ARK owns the
// accessible behaviour — focus moves into the panel on open and RETURNS to the trigger on
// close, Esc closes it, and it is explicitly NOT a trap (Tab leaves the panel; the page
// behind stays interactive — it does not inert the background). Do NOT hand-roll any of it
// (RESEARCH Don't-Hand-Roll; a11y.md prefer the Ark primitive). The slice only adds the
// per-part `tv()` recipe (popover.ts), the `data-popover` hook, and the controlled props.
//
// Boundary (architecture.md uikit-vs-feature): NO i18n import. `title` + the body `children`
// arrive resolved from the STORY — the primitive is i18n-free. The `trigger` is passed by the
// caller (the shared `Button` or any element); it carries the `data-popover-trigger` hook the
// keyboard.spec drives (Esc-close → focus returns HERE).
//
// `open`/`onOpenChange` are the CONTROLLED disclosure; `lazyMount` + `unmountOnExit` keep the
// portal out of the DOM while closed. The StateMatrix forced-open cell passes UNCONTROLLED
// `defaultOpen` (RESEARCH Pitfall 2 — deterministic open for the static axe gate, no Ladle
// hack; controlled `open` would pin every instance, the Select Rule-1 lesson). Literal `tv()`
// classes are `@source`-scanned even through the Portal (RESEARCH Pitfall 3).
import type { ReactNode } from "react";
import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { Portal } from "@ark-ui/react/portal";
import { popover } from "./popover";

const styles = popover();

type Props = {
  // system props first
  className?: string;
  children?: ReactNode;
  // values
  /** The open affordance (the caller's shared `Button` or element). Ark wires its
   *  `data-popover-trigger` toggle behaviour + the focus-return target. */
  trigger: ReactNode;
  /** Optional popover heading (resolved string, never an i18n key). */
  title?: string;
  // booleans
  /** Controlled open state (the interactive Playground path). */
  open?: boolean;
  /** Uncontrolled initial open — the forced-open StateMatrix axe cell (RESEARCH Pitfall 2). */
  defaultOpen?: boolean;
  // callbacks
  onOpenChange?: (open: boolean) => void;
};

export function Popover({
  className,
  children,
  trigger,
  title,
  open,
  defaultOpen,
  onOpenChange,
}: Props): ReactNode {
  return (
    <ArkPopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={
        onOpenChange === undefined ? undefined : (details) => onOpenChange(details.open)
      }
      lazyMount
      unmountOnExit
    >
      <ArkPopover.Trigger asChild data-popover-trigger>
        {trigger}
      </ArkPopover.Trigger>
      <Portal>
        <ArkPopover.Positioner className={styles.positioner()}>
          <ArkPopover.Content className={styles.content({ className })} data-popover>
            {title === undefined ? null : (
              <ArkPopover.Title className={styles.title()}>{title}</ArkPopover.Title>
            )}
            <ArkPopover.Description className={styles.body()}>{children}</ArkPopover.Description>
          </ArkPopover.Content>
        </ArkPopover.Positioner>
      </Portal>
    </ArkPopover.Root>
  );
}
