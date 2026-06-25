// KIT-06 Overlay / Tabs catalog stories (Plan 03-06, Wave 6). Two D-02 modes:
//   • Matrix     — a static grid pinning the ACTIVE-tab states: one cell with the FIRST tab
//                  active and one with a LATER tab active (controlled `value`), so the catalog
//                  axe pass + the design review see the cyan active tab PAIRED with the
//                  border-primary underline (never color-alone) on different positions.
//   • Playground — the lone INTERACTIVE Tabs (controlled `value` via local state). The
//                  keyboard.spec drives THIS story id (`kit-06-overlay--tabs--playground`):
//                  ArrowRight rotates the active tab (roving tabindex), exactly one tab is in
//                  the page tab order, and the focused tab's ring is visible (2.4.12).
//
// Strings resolve in the STORY via `i18n._({ id })` and pass as plain `label`/panel props — the
// Tabs primitive stays i18n-free (architecture.md uikit boundary).
import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { i18n } from "../_i18n";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Tabs, type TabData } from "./Tabs";

export default {
  title: "KIT-06 Overlay / Tabs",
} satisfies StoryDefault;

const useTabs = (): readonly TabData[] => [
  { value: "overview", label: i18n._({ id: "tabsLabelOverview" }) },
  { value: "matches", label: i18n._({ id: "tabsLabelMatches" }) },
  { value: "squads", label: i18n._({ id: "tabsLabelSquads" }) },
];

const usePanels = (): Readonly<Record<string, string>> => ({
  overview: i18n._({ id: "tabsPanelOverview" }),
  matches: i18n._({ id: "tabsPanelMatches" }),
  squads: i18n._({ id: "tabsPanelSquads" }),
});

export const Matrix: Story = () => {
  const tabs = useTabs();
  const panels = usePanels();

  return (
    <div className="flex flex-col gap-6 bg-bg-1 p-4">
      <StateMatrix title="Tabs — состояния / states">
        {/* First tab active — the cyan + underline marker on the leading position. */}
        <StateCell label="first-active">
          <Tabs tabs={tabs} panels={panels} value="overview" />
        </StateCell>

        {/* A later tab active — proves the marker travels (cyan never color-alone, on any tab). */}
        <StateCell label="later-active">
          <Tabs tabs={tabs} panels={panels} value="matches" />
        </StateCell>
      </StateMatrix>
    </div>
  );
};

export const Playground: Story = () => {
  const [value, setValue] = useState("overview");
  const tabs = useTabs();
  const panels = usePanels();

  return (
    <div className="bg-bg-1 p-4">
      <Tabs tabs={tabs} panels={panels} value={value} onValueChange={setValue} />
    </div>
  );
};
