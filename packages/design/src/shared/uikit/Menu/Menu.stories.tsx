// KIT-06 Overlay / Menu catalog stories (Plan 03-06, Wave 6). Two D-02 modes:
//   • Matrix     — a static grid with ONE forced-OPEN cell via Ark `defaultOpen` (the axe gate
//                  mechanism — Ark renders the open menu deterministically, no Ladle hack,
//                  RESEARCH Pitfall 2). UNCONTROLLED `defaultOpen` (not `open`) so it does not
//                  pin a controlled instance closed (the Select Rule-1 lesson). ONE forced-open
//                  menu only (two portalled menus would stack dismiss layers + collide ids).
//   • Playground — the lone INTERACTIVE Menu (controlled `open` via local state, a real
//                  shared-Button trigger). The keyboard.spec drives THIS story id
//                  (`kit-06-overlay--menu--playground`): the trigger toggles aria-expanded
//                  false→true and names aria-controls → the open panel.
//
// Strings resolve in the STORY via `i18n._({ id })` and pass as plain `label`/`trigger` props —
// the Menu primitive stays i18n-free (architecture.md uikit boundary). The `menuItemLongest` row
// exercises the QUAL-05 RU-longest label at the 360 floor.
import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "../Button";
import { i18n } from "../_i18n";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Menu, type MenuItemData } from "./Menu";

export default {
  title: "KIT-06 Overlay / Menu",
} satisfies StoryDefault;

const useItems = (): readonly MenuItemData[] => [
  { value: "view", label: i18n._({ id: "menuItemView" }) },
  { value: "compare", label: i18n._({ id: "menuItemCompare" }) },
  // The QUAL-05 RU-longest row — the widest item the menu surface must hold at the 360 floor.
  { value: "report", label: i18n._({ id: "menuItemLongest" }) },
];

export const Matrix: Story = () => {
  const triggerLabel = i18n._({ id: "menuTrigger" });
  const items = useItems();

  return (
    <div className="flex flex-col gap-6 bg-bg-1 p-4">
      <StateMatrix title="Menu — состояния / states">
        <StateCell label="closed">
          <Menu trigger={<Button variant="secondary">{triggerLabel}</Button>} items={items} />
        </StateCell>

        {/* Forced-open: Ark `defaultOpen` renders the menu deterministically for the catalog axe
            pass (RESEARCH Pitfall 2 — no Ladle hack). UNCONTROLLED (defaultOpen) — the closed
            cell stays user-openable; the keyboard.spec drives the Playground. */}
        <StateCell label="open">
          <Menu
            defaultOpen
            trigger={<Button variant="secondary">{triggerLabel}</Button>}
            items={items}
          />
        </StateCell>
      </StateMatrix>
    </div>
  );
};

export const Playground: Story = () => {
  const [open, setOpen] = useState(false);
  const items = useItems();

  return (
    <div className="bg-bg-1 p-4">
      <Menu
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="primary">{i18n._({ id: "menuTrigger" })}</Button>}
        items={items}
      />
    </div>
  );
};
