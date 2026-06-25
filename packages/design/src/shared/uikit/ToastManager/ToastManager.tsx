// ToastManager (D-06, KIT-06-adjacent) — the toast LIFECYCLE the Phase-2 `Toast/Toast.tsx`
// visual leaf was deliberately built to compose under (its head comment: "this slice is purely
// presentational so later surfaces compose it under a real toast manager"). Built on Ark UI's
// `createToaster` — a single toaster instance owns the portal, the queue, auto-dismiss, and the
// stacking; `<Toaster>` takes a RENDER-PROP receiving each live toast, and we render the EXISTING
// `<Toast>` leaf inside it. NO re-expression of the leaf (RESEARCH Toast verdict, D-06): the
// manager only maps the Ark toast shape onto the leaf's props and wires the dismiss control to
// `toaster.dismiss(toast.id)`.
//
// The Ark render-prop `toast` (a `@zag-js/toast` `Options`) exposes `id`/`type`/`title`/
// `description`/`action` (confirmed against the installed 5.37.2 `.d.ts`, A3). Mapping onto the
// leaf is mechanical: `type` → the leaf's `variant` (`warning`→`warn`, `loading`→`info`), `title`
// → `message`, `action` → the leaf action. The leaf stays i18n-free — the toast `title`/`action
// label`/dismiss aria are RESOLVED BY THE CONSUMER and passed at `toaster.create(...)`; the
// dismiss aria rides in `meta.dismissAria` (author-supplied), so the manager imports no `i18n`
// (architecture.md uikit boundary).
import type { ReactNode } from "react";
import { Toaster, createToaster } from "@ark-ui/react/toast";
import { Toast, type ToastVariant } from "../Toast";

/**
 * The single toaster instance (D-06). Owns the portal (mounts its own to `document.body` — no app
 * shell needed), the FIFO queue, per-toast auto-dismiss, and the bottom-end overlap stacking.
 * Story Playgrounds call `toaster.create({ title, type, meta })`; the manager renders each.
 */
export const toaster = createToaster({ placement: "bottom-end", overlap: true, gap: 12, max: 4 });

/** Map the Ark/Zag toast `type` onto the leaf's finite `ToastVariant` (`warning`→`warn`). */
function toVariant(type: string | undefined): ToastVariant {
  switch (type) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "warning":
      return "warn";
    default:
      // `info`, `loading`, and any other type fall back to the neutral info leaf.
      return "info";
  }
}

/**
 * The viewport — `<Toaster>` over the shared {@link toaster}, rendering the EXISTING `Toast` leaf
 * per live toast (no re-expression). The dismiss control is wired to `toaster.dismiss(toast.id)`;
 * its accessible name comes from the author-supplied `meta.dismissAria` (resolved in the consumer
 * — the manager stays i18n-free). Mount once anywhere (it portals itself).
 */
export function ToastViewport(): ReactNode {
  return (
    <Toaster toaster={toaster}>
      {(toast) => {
        const meta = toast.meta as { dismissAria?: string } | undefined;
        return (
          <Toast
            variant={toVariant(toast.type)}
            message={typeof toast.title === "string" ? toast.title : ""}
            action={
              toast.action === undefined
                ? undefined
                : { label: toast.action.label, onClick: toast.action.onClick }
            }
            onDismiss={() => toaster.dismiss(toast.id)}
            dismissAria={meta?.dismissAria}
          />
        );
      }}
    </Toaster>
  );
}
