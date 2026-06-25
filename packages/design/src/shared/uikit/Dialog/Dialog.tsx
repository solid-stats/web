// KIT-06 — `Dialog`, the modal overlay (Plan 03-05, Wave 5). A thin wrapper over Ark
// Dialog: ARK owns the load-bearing accessibility — focus trap inside, focus RETURN to the
// trigger on close, Esc-close, scroll-lock, and the inert/aria-hidden background (RESEARCH
// Don't-Hand-Roll; a11y.md "Modal/fullscreen surfaces use the Ark Dialog with a portal, a
// localized title, controlled open/mount, lazy mount; fullscreen inerts the main content").
// Do NOT hand-roll any of it. The slice only adds the per-part `tv()` recipe (dialog.ts),
// the `data-dialog` hook, and the controlled props.
//
// Boundary (architecture.md uikit-vs-feature): NO i18n import. `title`, `body`, and
// `closeAria` arrive as plain resolved strings the STORY computes via `i18n._` — the
// primitive is i18n-free. The `trigger` is passed by the caller (rendered through the shared
// `Button`) so the open affordance owns the canonical ring + ≥44px floor; it carries the
// `data-dialog-trigger` hook the keyboard.spec drives (Esc-close → focus returns HERE).
//
// `open`/`onOpenChange` are the CONTROLLED disclosure (the interactive Playground); `lazyMount`
// + `unmountOnExit` keep the portal out of the DOM while closed. The StateMatrix forced-open
// cell passes UNCONTROLLED `defaultOpen` (RESEARCH Pitfall 2 — Ark renders the open overlay
// deterministically for the static axe gate, no Ladle hack; controlled `open` would pin every
// instance, the Select Rule-1 lesson). Portal content escapes the `@source` scan only for
// dynamic strings — the literal `tv()` classes here ARE scanned (RESEARCH Pitfall 3).
import type { ReactNode } from "react";
import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { X } from "lucide-react";
import { dialog } from "./dialog";

const styles = dialog();

type Props = {
  // system props first
  className?: string;
  children?: ReactNode;
  // values
  /** The open affordance (rendered by the caller through the shared `Button`). Ark wires the
   *  trigger's `data-dialog-trigger` open behaviour + the focus-return target. */
  trigger: ReactNode;
  /** The dialog heading — a real `Dialog.Title` (resolved copy, never an i18n key). */
  title: string;
  /** The accessible name of the icon-only close affordance (a11y.md icon-only control). */
  closeAria: string;
  /** Optional supporting body copy under the title (resolved string). */
  body?: string;
  // booleans
  /** Controlled open state (the interactive Playground path). */
  open?: boolean;
  /** Uncontrolled initial open — the forced-open StateMatrix axe cell (RESEARCH Pitfall 2). */
  defaultOpen?: boolean;
  // callbacks
  onOpenChange?: (open: boolean) => void;
};

export function Dialog({
  className,
  children,
  trigger,
  title,
  closeAria,
  body,
  open,
  defaultOpen,
  onOpenChange,
}: Props): ReactNode {
  return (
    <ArkDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={
        onOpenChange === undefined ? undefined : (details) => onOpenChange(details.open)
      }
      lazyMount
      unmountOnExit
    >
      <ArkDialog.Trigger asChild data-dialog-trigger>
        {trigger}
      </ArkDialog.Trigger>
      <Portal>
        <ArkDialog.Backdrop className={styles.backdrop()} />
        <ArkDialog.Positioner className={styles.positioner()}>
          <ArkDialog.Content className={styles.content({ className })} data-dialog>
            <ArkDialog.CloseTrigger className={styles.close()} aria-label={closeAria}>
              <X className="size-4 shrink-0" aria-hidden />
            </ArkDialog.CloseTrigger>
            <ArkDialog.Title className={styles.title()}>{title}</ArkDialog.Title>
            {body === undefined ? null : (
              <ArkDialog.Description className={styles.body()}>{body}</ArkDialog.Description>
            )}
            {children}
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  );
}
