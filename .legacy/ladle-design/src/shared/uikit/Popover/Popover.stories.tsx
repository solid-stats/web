// KIT-06 Overlay / Popover catalog stories (Plan 03-05, Wave 5). Two D-02 modes:
//   • Matrix     — a static grid with ONE forced-OPEN cell via Ark `defaultOpen` (the axe
//                  gate mechanism — Ark renders the open floating surface deterministically,
//                  no Ladle hack, RESEARCH Pitfall 2). UNCONTROLLED `defaultOpen` (not `open`)
//                  so it does not pin a controlled instance closed (the Select Rule-1 lesson).
//   • Playground — the lone INTERACTIVE Popover (controlled `open` via local state, a real
//                  shared-Button trigger). The keyboard.spec drives THIS story id
//                  (`kit-06-overlay--popover--playground`): Esc closes + focus returns to the
//                  trigger, and — unlike the modal Dialog — the open popover does NOT trap Tab
//                  (it is non-modal; Tab leaves the panel, the page behind stays interactive).
//
// Strings resolve in the STORY via `i18n._({ id })` and pass as plain `title`/body props — the
// Popover primitive stays i18n-free (architecture.md uikit boundary).
import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "../Button";
import { i18n } from "../_i18n";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Popover } from "./Popover";

export default {
  title: "KIT-06 Overlay / Popover",
} satisfies StoryDefault;

export const Matrix: Story = () => {
  const triggerLabel = i18n._({ id: "popoverTrigger" });
  const title = i18n._({ id: "popoverTitle" });
  const body = i18n._({ id: "popoverBody" });

  return (
    <div className="flex flex-col gap-6 bg-bg-1 p-4">
      <StateMatrix title="Popover — состояния / states">
        <StateCell label="closed">
          <Popover trigger={<Button variant="secondary">{triggerLabel}</Button>} title={title}>
            {body}
          </Popover>
        </StateCell>

        {/* Forced-open: Ark `defaultOpen` renders the floating surface deterministically for the
            catalog axe pass (RESEARCH Pitfall 2 — no Ladle hack). UNCONTROLLED (defaultOpen) —
            the closed cell stays user-openable; the keyboard.spec drives the Playground. */}
        <StateCell label="open">
          <Popover
            defaultOpen
            trigger={<Button variant="secondary">{triggerLabel}</Button>}
            title={title}
          >
            {body}
          </Popover>
        </StateCell>
      </StateMatrix>
    </div>
  );
};

export const Playground: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-bg-1 p-4">
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="secondary">{i18n._({ id: "popoverTrigger" })}</Button>}
        title={i18n._({ id: "popoverTitle" })}
      >
        {i18n._({ id: "popoverBody" })}
      </Popover>
    </div>
  );
};
