// SURF-18 Global state / AsyncBoundary catalog stories (Plan 03-07, Wave 7). The six named
// global states (loading / empty / error / offline / reconnecting / stale) PLUS the `ready`
// content slot are the SURF-18 deliverable: reusable recipes composing the EXISTING Phase-2
// primitives through the one AsyncBoundary seam — never rebuilding them (D-05). Two D-02 modes
// plus the CLS proof:
//   • Matrix — every state in a labelled StateCell, each pairing a Lucide icon + text (never
//              color-alone) and reserving its primitive's height.
//   • Cls    — the story id the Wave-0 `cls.spec.ts` references
//              (`surf-18-global-state--asyncboundary--cls`): every state + the `ready` content
//              render inside an IDENTICAL fixed-size reserved box (`data-async-cell=<state>`), so
//              swapping among the states and the ready content shifts NOTHING (CLS = 0, QUAL-04).
//              The reserved box holds the layout — the DataTrustBanner `reserved` precedent.
//   • Playground — toggles the `kind` via Ladle args over the same seam.
//
// Strings resolve in the STORY via `i18n._({ id })` (active locale from the Ladle language
// control) and pass as plain props — AsyncBoundary + the primitives stay i18n-free
// (architecture.md uikit boundary). The long RU error/empty copy exercises QUAL-05 at the 360
// floor.
import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "../Button";
import { i18n } from "../_i18n";
import { StateCell, StateMatrix } from "../_state-matrix";
import { AsyncBoundary, type AsyncKind, type AsyncState } from "./AsyncBoundary";

export default {
  title: "SURF-18 Global state / AsyncBoundary",
} satisfies StoryDefault;

// The reserved-table colgroup the loading skeleton + a representative ready table share.
const COLUMNS = [160, 96, 96] as const;
const ROWS = 3;

/** Build the demo `AsyncState` for a kind, resolving all copy in the story (i18n-free seam). */
function stateFor(kind: AsyncKind): AsyncState {
  switch (kind) {
    case "loading":
      return { kind: "loading", columns: COLUMNS, rows: ROWS };
    case "empty":
      return {
        kind: "empty",
        heading: i18n._({ id: "emptyTableHeading" }),
        body: i18n._({ id: "emptyTableBody" }),
        action: <Button variant="secondary">{i18n._({ id: "emptyRetry" })}</Button>,
      };
    case "error":
      return {
        kind: "error",
        // The `{id}` ref lives inside the message; the contact path sits below it (errors.md).
        message: i18n._({ id: "errorSystem", values: { id: "E-1042" } }),
        contact: i18n._({ id: "errorSystemContact" }),
        action: <Button variant="secondary">{i18n._({ id: "errorRetry" })}</Button>,
      };
    case "offline":
      return { kind: "offline", label: i18n._({ id: "offlineBanner" }) };
    case "reconnecting":
      return { kind: "reconnecting", label: i18n._({ id: "reconnectingBanner" }) };
    case "stale":
      return { kind: "stale", label: i18n._({ id: "staleBanner" }) };
    case "ready":
      return { kind: "ready", children: readyContent() };
  }
}

/** A representative "ready" surface — the real content the boundary reveals (a small table). */
function readyContent(): ReturnType<Story> {
  return (
    <div className="overflow-hidden rounded-md border border-border-1 bg-surface-1">
      <div className="grid h-11 items-center border-b border-border-1 bg-surface-2 px-3 font-body text-xs font-semibold text-text-muted">
        {i18n._({ id: "tabsLabelOverview" })}
      </div>
      {Array.from({ length: ROWS }, (_, i) => (
        <div
          key={i}
          className="flex h-13 items-center border-b border-border-1 px-3 font-body text-sm text-text-primary last:border-b-0"
        >
          {i18n._({ id: "tabsPanelOverview" })}
        </div>
      ))}
    </div>
  );
}

const STATES: readonly AsyncKind[] = [
  "loading",
  "empty",
  "error",
  "offline",
  "reconnecting",
  "stale",
];

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="AsyncBoundary — глобальные состояния / global states">
      {STATES.map((kind) => (
        <StateCell key={kind} label={kind}>
          <AsyncBoundary state={stateFor(kind)} />
        </StateCell>
      ))}
      <StateCell label="ready">
        <AsyncBoundary state={stateFor("ready")} />
      </StateCell>
    </StateMatrix>
  </div>
);

// The CLS = 0 proof (cls.spec.ts `surf-18-global-state--asyncboundary--cls`). Every state AND the
// ready content render inside the SAME fixed-size reserved box — so the box height is identical
// across all of them and swapping among states shifts nothing. The reserved box holds the layout
// (the DataTrustBanner `reserved` precedent); the routed primitive lays out within it.
const CLS_CELL = "flex h-64 w-full items-stretch overflow-hidden";
const CLS_STATES: readonly AsyncKind[] = [...STATES, "ready"];

export const Cls: Story = () => (
  <div className="flex flex-col gap-4 bg-bg-1 p-4">
    <p className="font-body text-xs text-text-muted">
      Each state reserves the same box — swapping shifts nothing (CLS = 0).
    </p>
    <div className="grid w-80 grid-cols-1 gap-3">
      {CLS_STATES.map((kind) => (
        <div key={kind} className={CLS_CELL} data-async-cell={kind}>
          <AsyncBoundary className="w-full" state={stateFor(kind)} />
        </div>
      ))}
    </div>
  </div>
);

type PlaygroundArgs = {
  kind: AsyncKind;
};

export const Playground: Story<PlaygroundArgs> = ({ kind }) => (
  <div className="w-80 bg-bg-1 p-4">
    <AsyncBoundary state={stateFor(kind)} />
  </div>
);

Playground.args = { kind: "loading" };
Playground.argTypes = {
  kind: {
    options: [...STATES, "ready"],
    control: { type: "inline-radio" },
  },
};
