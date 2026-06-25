// KIT-06 Overlay / Dialog catalog stories (Plan 03-05, Wave 5). Two D-02 modes plus the
// destructive-confirmation pattern:
//   • Matrix         — a static grid with ONE forced-OPEN cell via Ark `defaultOpen` (the
//                      axe gate mechanism — Ark renders the open modal deterministically, no
//                      Ladle hack, RESEARCH Pitfall 2). UNCONTROLLED `defaultOpen` (not `open`)
//                      so it does not pin a controlled instance closed (the Select Rule-1
//                      lesson). Exactly ONE forced-open dialog — two portalled modals would
//                      stack their focus traps + collide ids (axe), so the matrix shows the
//                      closed trigger + the single open cell.
//   • DestructiveConfirm — the WCAG 3.3.6 (Error Prevention) pattern Phases 8–9 compose:
//                      reversible / checked / confirmed. The confirm button is `loss`-coloured
//                      (the secondary Button + a Trash2 icon + an explicit verb+noun label —
//                      never color-alone, a11y.md), and FOCUS DEFAULTS TO THE SAFE (cancel)
//                      action via `autoFocus` so an accidental Enter does not destroy data.
//   • Playground     — the lone INTERACTIVE Dialog (controlled `open` via local state, a real
//                      shared-Button trigger). The keyboard.spec drives THIS story id
//                      (`kit-06-overlay--dialog--playground`): Esc closes + focus returns to
//                      the trigger, and the open dialog does not trap Tab outside its scope.
//
// Strings resolve in the STORY via `i18n._({ id })` (active locale from the Ladle language
// control) and pass as plain `title`/`body`/`closeAria`/label props — the Dialog primitive
// stays i18n-free (architecture.md uikit boundary). The destructive confirm uses `loss` paired
// with the icon + the verb+noun label (QUAL-05 RU-longest exercised by the long RU title/body).
import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Trash2 } from "lucide-react";
import { Button } from "../Button";
import { i18n } from "../_i18n";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Dialog } from "./Dialog";

export default {
  title: "KIT-06 Overlay / Dialog",
} satisfies StoryDefault;

export const Matrix: Story = () => {
  const title = i18n._({ id: "dialogTitle" });
  const body = i18n._({ id: "dialogBody" });
  const closeAria = i18n._({ id: "dialogClose" });
  const open = i18n._({ id: "formSubmit" });

  return (
    <div className="flex flex-col gap-6 bg-bg-1 p-4">
      <StateMatrix title="Dialog — состояния / states">
        <StateCell label="closed">
          <Dialog
            trigger={<Button variant="secondary">{open}</Button>}
            title={title}
            body={body}
            closeAria={closeAria}
          />
        </StateCell>

        {/* Forced-open: Ark `defaultOpen` renders the modal deterministically so the catalog
            axe pass runs against a real open dialog (RESEARCH Pitfall 2 — no Ladle hack).
            UNCONTROLLED (defaultOpen) — the closed cell stays user-openable; the keyboard.spec
            drives the Playground. ONE forced-open dialog only (two would stack focus traps). */}
        <StateCell label="open">
          <Dialog
            defaultOpen
            trigger={<Button variant="secondary">{open}</Button>}
            title={title}
            body={body}
            closeAria={closeAria}
          />
        </StateCell>
      </StateMatrix>
    </div>
  );
};

// The destructive-confirmation pattern (WCAG 3.3.6). Focus DEFAULTS to the safe cancel action
// (`autoFocus`), the confirm is `loss`-coloured + a Trash2 icon + a verb+noun label — so an
// accidental Enter cancels (no data loss) and the destructive option is never color-alone.
export const DestructiveConfirm: Story = () => {
  const [open, setOpen] = useState(false);
  const close = (): void => setOpen(false);

  return (
    <div className="bg-bg-1 p-4">
      <Dialog
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="secondary">{i18n._({ id: "confirmDeleteConfirm" })}</Button>}
        title={i18n._({ id: "confirmDeleteTitle" })}
        body={i18n._({ id: "confirmDeleteBody" })}
        closeAria={i18n._({ id: "dialogClose" })}
      >
        <div className="flex justify-end gap-2">
          {/* Focus defaults to the SAFE action — an accidental Enter cancels, never deletes. */}
          <Button variant="secondary" autoFocus onClick={close}>
            {i18n._({ id: "formCancel" })}
          </Button>
          {/* Destructive: `loss`-toned, icon + verb+noun label (never color-alone). */}
          <Button variant="secondary" className="border-loss-border! text-loss!" onClick={close}>
            <Trash2 className="size-4 shrink-0" aria-hidden />
            {i18n._({ id: "confirmDeleteConfirm" })}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export const Playground: Story = () => {
  const [open, setOpen] = useState(false);
  const close = (): void => setOpen(false);

  return (
    <div className="bg-bg-1 p-4">
      <Dialog
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="primary">{i18n._({ id: "formSubmit" })}</Button>}
        title={i18n._({ id: "dialogTitle" })}
        body={i18n._({ id: "dialogBody" })}
        closeAria={i18n._({ id: "dialogClose" })}
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>
            {i18n._({ id: "formCancel" })}
          </Button>
          <Button variant="primary" onClick={close}>
            {i18n._({ id: "formSubmit" })}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
