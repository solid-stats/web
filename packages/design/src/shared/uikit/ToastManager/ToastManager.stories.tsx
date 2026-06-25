// KIT-06 Overlay / ToastManager catalog story (Plan 03-07, Wave 7, D-06). The interactive
// Playground for the toast LIFECYCLE: trigger buttons push toasts via `toaster.create(...)`, and
// the mounted `<ToastViewport />` renders each through the EXISTING Toast leaf (no re-expression).
// createToaster mounts its OWN portal to `document.body`, so no app shell is needed — the story
// just mounts the viewport once and fires triggers.
//
// Strings resolve in the STORY via `i18n._({ id })` and pass as plain props — the manager + leaf
// stay i18n-free (architecture.md uikit boundary). The dismiss control's accessible name rides in
// `meta.dismissAria` (the manager reads it off the toast), keeping i18n out of the leaf. Each
// semantic variant pairs a Lucide icon + the message (never color-alone, already in the leaf).
import type { Story, StoryDefault } from "@ladle/react";
import type { ToastVariant } from "../Toast";
import { i18n } from "../_i18n";
import { Button } from "../Button";
import { ToastViewport, toaster } from "./ToastManager";

export default {
  title: "KIT-06 Overlay / ToastManager",
} satisfies StoryDefault;

// The four semantic variants → the Ark/Zag toast `type` (the leaf maps `warning`→`warn`). Each
// trigger pushes a toast carrying its body + the dismiss aria (resolved here, in the story).
const TRIGGERS: readonly {
  variant: ToastVariant;
  type: "success" | "info" | "warning" | "error";
  triggerId: "toastSuccessTrigger" | "toastInfoTrigger" | "toastWarnTrigger" | "toastErrorTrigger";
  bodyId: "toastSaved" | "toastInfo" | "toastWarn" | "toastFailed";
}[] = [
  { variant: "success", type: "success", triggerId: "toastSuccessTrigger", bodyId: "toastSaved" },
  { variant: "info", type: "info", triggerId: "toastInfoTrigger", bodyId: "toastInfo" },
  { variant: "warn", type: "warning", triggerId: "toastWarnTrigger", bodyId: "toastWarn" },
  { variant: "error", type: "error", triggerId: "toastErrorTrigger", bodyId: "toastFailed" },
];

export const Playground: Story = () => {
  const dismissAria = i18n._({ id: "toastDismiss" });

  return (
    <div className="flex min-h-svh flex-col gap-3 bg-bg-1 p-4">
      <div className="flex flex-wrap gap-2">
        {TRIGGERS.map(({ variant, type, triggerId, bodyId }) => (
          <Button
            key={variant}
            variant="secondary"
            onClick={() => {
              toaster.create({
                title: i18n._({ id: bodyId }),
                type,
                meta: { dismissAria },
              });
            }}
          >
            {i18n._({ id: triggerId })}
          </Button>
        ))}
      </div>
      {/* createToaster owns the portal/queue/auto-dismiss/stacking — mount the viewport once. */}
      <ToastViewport />
    </div>
  );
};
