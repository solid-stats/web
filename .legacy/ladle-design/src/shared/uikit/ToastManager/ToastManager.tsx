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
// (architecture.md uikit boundary). `dismissAria` is REQUIRED on the toast `meta` (`ToastMeta`):
// the manager always wires `onDismiss`, so an omitted name would be an unnamed icon-only control
// (WCAG 4.1.2). `createToast` is the typed helper that makes the name a `tsc` requirement at the
// `toaster.create(...)` call site — a consumer cannot push a toast without it.
import type { ReactNode } from "react";
import { Toast as ArkToast, Toaster, createToaster } from "@ark-ui/react/toast";
import { Toast, type ToastVariant } from "../Toast";

/**
 * The required `meta` contract for every toast the manager renders. `dismissAria` is the
 * accessible name for the always-wired icon-only dismiss control — required (not optional) so an
 * unnamed dismiss button is impossible by construction (a11y.md — icon-only controls need a name).
 */
export type ToastMeta = {
  /** Accessible name for the icon-only dismiss control (resolved by the consumer). */
  dismissAria: string;
};

/**
 * The single toaster instance (D-06). Owns the portal (mounts its own to `document.body` — no app
 * shell needed), the FIFO queue, per-toast auto-dismiss, and the bottom-end stacking.
 * Push toasts via {@link createToast} (the typed wrapper that requires the dismiss name), not
 * `toaster.create(...)` directly.
 *
 * Plan 03-11 (GAP-04): `overlap: false` (STACKED) so fired toasts always show a real gap > 0 at
 * rest — in stacked mode the Ark/zag per-toast `--y` offset includes the configured `gap` (12px)
 * + each toast's height, and the `Toast.Root` (the leaf renders through it) carries the
 * `.uikit-toast-motion` recipe that applies `translateY(var(--y))`. The previous `overlap: true`
 * stacked toasts flush because nothing applied the overlap transform (GAP-04). `max: 4` caps the
 * visible stack.
 */
export const toaster = createToaster({ placement: "bottom-end", overlap: false, gap: 12, max: 4 });

/** The toast shape a consumer pushes — Ark's `create` options with the required {@link ToastMeta}. */
type CreateToastOptions = Parameters<typeof toaster.create>[0] & { meta: ToastMeta };

/**
 * Push a toast through the shared {@link toaster}. The typed wrapper makes `meta.dismissAria`
 * REQUIRED at the call site, so an omitted dismiss name is a `tsc` error, not a silent a11y
 * regression (WCAG 4.1.2). Use this over `toaster.create(...)` directly.
 */
export function createToast(options: CreateToastOptions): string {
  return toaster.create(options);
}

/** Coerce the Ark toast `title` (typed `ReactNode`) to the leaf's plain `string` message. */
function message(title: unknown): string {
  return typeof title === "string" ? title : "";
}

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
        // GAP-16 guard: a missing/non-string title coerces to "" — render NOTHING rather than a
        // textless icon-only toast (a label-less control with no message; a11y.md / WCAG 4.1.2).
        // A toast with no message carries no information, so dropping it is correct, not a loss.
        const text = message(toast.title);
        if (text === "") return null;
        // `toast.meta` is untyped on the Ark render-prop; the only push path is `createToast`,
        // which requires `meta.dismissAria` (`ToastMeta`), so the cast is safe-by-construction.
        const meta = toast.meta as Partial<ToastMeta> | undefined;
        const action =
          toast.action === undefined
            ? undefined
            : { label: toast.action.label, onClick: toast.action.onClick };
        // GAP-04: render the leaf THROUGH the Ark `Toast.Root` so it receives the stacking CSS vars
        // (`--y`/`--offset`/`--index`) + `data-state`; `.uikit-toast-motion` applies the
        // `translateY(var(--y))` stack offset (real gap > 0 at rest) + the shared-token opacity
        // enter/exit. The Root also already carries `role="status"`/`aria-*`, so the leaf's own
        // `role="status"` is redundant in this composed path — the manager keeps the visual leaf
        // as the surface inside the positioned Root (no re-expression of the leaf, D-06).
        return (
          <ArkToast.Root className="uikit-toast-motion">
            {meta?.dismissAria === undefined ? (
              // Defensive: a missing name omits the dismiss control rather than rendering an
              // unnamed icon-only button — an unnamed dismiss can never reach the DOM (WCAG 4.1.2).
              // `live={false}`: the Ark `Toast.Root` already owns the polite live region.
              <Toast variant={toVariant(toast.type)} message={text} action={action} live={false} />
            ) : (
              <Toast
                variant={toVariant(toast.type)}
                message={text}
                action={action}
                live={false}
                onDismiss={() => toaster.dismiss(toast.id)}
                dismissAria={meta.dismissAria}
              />
            )}
          </ArkToast.Root>
        );
      }}
    </Toaster>
  );
}
