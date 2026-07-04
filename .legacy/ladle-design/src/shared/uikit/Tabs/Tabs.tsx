// KIT-06 — `Tabs`, the roving-tabindex tab set (Plan 03-06, Wave 6). A thin wrapper over Ark
// Tabs: ARK owns the load-bearing accessibility — the arrow-key roving tabindex (exactly one
// tab in the page tab order at a time), Home/End, `role="tab"`/`role="tabpanel"`, and the
// `aria-controls`/`aria-labelledby` panel association (RESEARCH Don't-Hand-Roll; a11y.md prefer
// the Ark primitive). Do NOT hand-roll any keydown handling. The slice only adds the per-part
// `tv()` recipe (tabs.ts), the `data-tabs` hook, and the controlled props.
//
// Boundary (architecture.md uikit-vs-feature): NO i18n import. The tab `label`s + the panel
// `children` arrive resolved from the STORY — the primitive is i18n-free. The active trigger is
// cyan PAIRED with a `border-primary` underline (never color-alone — a11y.md); the canonical
// focus ring keeps the focused tab visible and unclipped under a sticky bar (WCAG 2.4.12).
//
// `value`/`onValueChange` are the CONTROLLED selection (the interactive Playground); a forced
// `value` pins the active tab for the StateMatrix cell. The panel `children` are keyed by tab
// `value` (a `Record`) so each `Tabs.Content` renders its own resolved copy.
import type { ReactNode } from "react";
import { Tabs as ArkTabs } from "@ark-ui/react/tabs";
import { tabs } from "./tabs";

const styles = tabs();

/** One tab: `value` is the stable id Ark keys selection/roving on, `label` the visible copy. */
export type TabData = {
  readonly value: string;
  readonly label: string;
};

type Props = {
  // system props first
  className?: string;
  // values
  /** The typed tab list — labels resolved in the story (the primitive is i18n-free). */
  tabs: readonly TabData[];
  /** The panel body per tab value (resolved copy/nodes), keyed by the tab `value`. */
  panels: Readonly<Record<string, ReactNode>>;
  /** Controlled active tab value (the interactive Playground / the forced StateMatrix cell). */
  value?: string;
  /** Uncontrolled initial active tab (when the caller does not control selection). */
  defaultValue?: string;
  // callbacks
  onValueChange?: (value: string) => void;
};

export function Tabs({
  className,
  tabs: tabList,
  panels,
  value,
  defaultValue,
  onValueChange,
}: Props): ReactNode {
  return (
    <ArkTabs.Root
      className={className}
      value={value}
      defaultValue={defaultValue}
      onValueChange={
        onValueChange === undefined ? undefined : (details) => onValueChange(details.value)
      }
      data-tabs
    >
      <ArkTabs.List className={styles.list()}>
        {tabList.map((tab) => (
          <ArkTabs.Trigger key={tab.value} value={tab.value} className={styles.trigger()}>
            {tab.label}
          </ArkTabs.Trigger>
        ))}
        {/* GAP-16: the Ark sliding `Indicator` slot was rendered but unsized — a dead slot. The
            STRUCTURAL selection marker is the per-trigger `border-primary` underline (paired with
            the cyan text, never color-alone), so the indicator carried no meaning; removed. */}
      </ArkTabs.List>
      {tabList.map((tab) => (
        <ArkTabs.Content key={tab.value} value={tab.value} className={styles.content()}>
          {panels[tab.value]}
        </ArkTabs.Content>
      ))}
    </ArkTabs.Root>
  );
}
