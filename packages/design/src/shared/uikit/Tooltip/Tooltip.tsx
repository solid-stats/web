// KIT-06 — `Tooltip`, the focus+hover supplementary-hint overlay (Plan 03-06, Wave 6). A thin
// wrapper over Ark Tooltip: ARK owns the load-bearing accessibility — it appears on FOCUS as
// well as hover (its default), dismisses on Esc / blur / pointer-leave, and wires the
// `aria-describedby` association from the trigger to the content (RESEARCH Don't-Hand-Roll;
// a11y.md prefer the Ark primitive). Do NOT hand-roll any of it. The slice only adds the per-part
// `tv()` recipe (tooltip.ts), the `data-tooltip` hook, and the controlled props.
//
// A TOOLTIP IS NOT A LABEL SUBSTITUTE, AND NEVER THE ONLY CARRIER OF MEANING (a11y.md; 03-UI-SPEC
// KIT-06). It supplements an ALREADY-meaningful, already-labelled visible control: the consuming
// story pairs it with a visible label/icon whose accessible name stands on its own, and the
// tooltip only adds an optional hint. Do NOT use it to NAME an icon-only control (that needs a
// real `aria-label`), and do NOT put load-bearing-only information in it. The recipe drops its
// animation under `prefers-reduced-motion` (a11y.md Targets & motion).
//
// Boundary (architecture.md uikit-vs-feature): NO i18n import. The `content` hint + the `trigger`
// arrive resolved from the STORY — the primitive is i18n-free. `lazyMount` + `unmountOnExit` keep
// the portal out of the DOM while closed; literal `tv()` classes are `@source`-scanned even
// through the Portal (RESEARCH Pitfall 3).
import type { ReactNode } from "react";
import { Portal } from "@ark-ui/react/portal";
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import { tooltip } from "./tooltip";

const styles = tooltip();

type Props = {
  // system props first
  className?: string;
  // values
  /** The already-meaningful, already-labelled visible control the tooltip supplements (the
   *  caller's visible label/icon — the tooltip is NEVER its only accessible name). */
  trigger: ReactNode;
  /** The supplementary hint copy (resolved string, never an i18n key; never load-bearing-only). */
  content: string;
  // booleans
  /** Controlled open state (the interactive Playground path). */
  open?: boolean;
  /** Uncontrolled initial open — the forced-open StateMatrix axe cell (RESEARCH Pitfall 2). */
  defaultOpen?: boolean;
  // callbacks
  onOpenChange?: (open: boolean) => void;
};

export function Tooltip({
  className,
  trigger,
  content,
  open,
  defaultOpen,
  onOpenChange,
}: Props): ReactNode {
  return (
    <ArkTooltip.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={
        onOpenChange === undefined ? undefined : (details) => onOpenChange(details.open)
      }
      lazyMount
      unmountOnExit
    >
      <ArkTooltip.Trigger asChild data-tooltip-trigger>
        {trigger}
      </ArkTooltip.Trigger>
      <Portal>
        <ArkTooltip.Positioner className={styles.positioner()}>
          <ArkTooltip.Content className={styles.content({ className })} data-tooltip>
            {content}
          </ArkTooltip.Content>
        </ArkTooltip.Positioner>
      </Portal>
    </ArkTooltip.Root>
  );
}
