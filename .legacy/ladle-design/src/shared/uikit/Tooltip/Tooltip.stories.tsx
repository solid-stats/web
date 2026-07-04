// KIT-06 Overlay / Tooltip catalog stories (Plan 03-06, Wave 6). Two D-02 modes:
//   • Matrix     — a static grid with ONE forced-OPEN cell via Ark `defaultOpen` (the axe gate
//                  mechanism — Ark renders the open hint deterministically, no Ladle hack,
//                  RESEARCH Pitfall 2). UNCONTROLLED `defaultOpen` (not `open`) so the closed
//                  cell stays user-hoverable.
//   • Playground — the lone INTERACTIVE Tooltip (controlled `open` via local state).
//
// The tooltip is NEVER the only carrier of meaning (a11y.md; 03-UI-SPEC KIT-06): every trigger
// here is an ALREADY-MEANINGFUL, already-labelled visible control — a real `Button` whose text
// (`tooltipTrigger`) stands on its own. The tooltip only ADDS a supplementary hint
// (`tooltipContent`); it does not NAME the control. Strings resolve in the STORY via
// `i18n._({ id })` and pass as plain `trigger`/`content` props — the primitive is i18n-free
// (architecture.md uikit boundary).
import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "../Button";
import { i18n } from "../_i18n";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Tooltip } from "./Tooltip";

export default {
  title: "KIT-06 Overlay / Tooltip",
} satisfies StoryDefault;

export const Matrix: Story = () => {
  const triggerLabel = i18n._({ id: "tooltipTrigger" });
  const content = i18n._({ id: "tooltipContent" });

  return (
    <div className="flex flex-col gap-6 bg-bg-1 p-4">
      <StateMatrix title="Tooltip — состояния / states">
        {/* The trigger is a real labelled control — the tooltip supplements it, never names it. */}
        <StateCell label="closed">
          <Tooltip
            trigger={<Button variant="secondary">{triggerLabel}</Button>}
            content={content}
          />
        </StateCell>

        {/* Forced-open: Ark `defaultOpen` renders the hint deterministically for the catalog axe
            pass (RESEARCH Pitfall 2 — no Ladle hack). The visible Button label still carries the
            meaning; the tooltip only adds the supplementary hint. */}
        <StateCell label="open">
          <Tooltip
            defaultOpen
            trigger={<Button variant="secondary">{triggerLabel}</Button>}
            content={content}
          />
        </StateCell>
      </StateMatrix>
    </div>
  );
};

export const Playground: Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-bg-1 p-4">
      <Tooltip
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="secondary">{i18n._({ id: "tooltipTrigger" })}</Button>}
        content={i18n._({ id: "tooltipContent" })}
      />
    </div>
  );
};
