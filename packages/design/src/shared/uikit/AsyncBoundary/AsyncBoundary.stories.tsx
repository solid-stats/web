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
import type { ReactElement } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "../Button";
import { ROSTER, SS_BASELINE, STRINGS, type TierMetric, tierFor } from "../_fixtures";
import { i18n } from "../_i18n";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Table, TableRow, type SortState, type TableColumn, type TierCell } from "../Table";
import { AsyncBoundary, type AsyncKind, type AsyncState } from "./AsyncBoundary";

export default {
  title: "SURF-18 Global state / AsyncBoundary",
} satisfies StoryDefault;

// GAP-03: the loading Skeleton and the ready Table share ONE column model + density so the
// loading→ready swap is byte-for-byte CLS = 0. The loading state routes to `Skeleton
// variant="table"` (framed: a bordered card + `tableViewportHeight(ROWS, 52)` band); the ready
// state renders the real KIT-02 `Table` (the same bordered card + the SAME
// `tableViewportHeight(visibleRows=ROWS, 52)` viewport). Identical card chrome + identical
// reserved height → the framed-card hairline that caused the old 1px gap is now identical on both
// sides. The `loading` Skeleton takes raw column WIDTHS; the ready `Table` takes the full column
// MODEL — both derived from the one `READY_COLUMNS` source.
const READY_COLUMNS: readonly TableColumn[] = [
  { key: "name", label: STRINGS.navPlayers.ru, width: 160, sortable: true },
  { key: "score", label: STRINGS.statScore.ru, width: 96, numeric: true, sortable: true },
  { key: "kd", label: STRINGS.statKd.ru, width: 96, numeric: true, sortable: true },
] as const;
const COLUMNS = READY_COLUMNS.map((c) => c.width);
const ROWS = 3;
const COMFORTABLE_ROW_H = 52;
const READY_SORT: SortState = { key: "score", direction: "descending" };

// A tier-colored numeric cell derived from a roster value via `tierFor` (the KIT-02 precedent).
function tierCell(metric: TierMetric, value: number): TierCell {
  const tier = tierFor(metric, value, SS_BASELINE);
  return { value: value.toFixed(2), metric, level: tier.level };
}

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

/**
 * The "ready" surface — the REAL content the boundary reveals. GAP-03: this renders the real
 * KIT-02 `Table` (the same `READY_COLUMNS` / comfortable density / `visibleRows=ROWS` the loading
 * `Skeleton variant="table"` reserves), NOT a hand-rolled `h-11`/`h-13` table. Because the Table
 * and the framed Skeleton both reserve `tableViewportHeight(ROWS, 52)` inside the identical bordered
 * card, the loading→ready swap is byte-for-byte CLS = 0 (the 1px hairline gap is gone). The
 * Table↔Skeleton box equality is already proven by the `Table CLS = 0` block.
 */
function readyContent(): ReactElement {
  const rows = ROSTER.slice(0, ROWS);
  return (
    <Table
      columns={READY_COLUMNS}
      caption={i18n._({ id: "navPlayers" })}
      density="comfortable"
      sort={READY_SORT}
      sortLabels={{}}
      visibleRows={ROWS}
    >
      {rows.map((p, i) => (
        <TableRow
          key={p.name}
          rowHeight={COMFORTABLE_ROW_H}
          rank={i + 1}
          name={p.name}
          squad={p.squad}
          href={`#player-${i + 1}`}
          score={tierCell("score", p.score)}
          kd={tierCell("kd", p.kd)}
        />
      ))}
    </Table>
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

// The CLS = 0 proof (cls.spec.ts `surf-18-global-state--asyncboundary--cls`). GAP-03: the proof
// measures the ROUTED `[data-async-boundary]` primitive, NOT an equalizing wrapper cage — an
// `h-64` cage made every cell 256px tall so the old test passed trivially (false-green). The cells
// here add NO height of their own (`w-full`, no fixed height), so each state's box is its real
// intrinsic reserved height. Two block roles, scoped per the SURF-18 spec re-scope:
//   • CONTENT-REGION group (loading / empty / error / ready) — the CLS-equality set. loading and
//     ready reserve the SAME table-card box byte-for-byte (the loading Skeleton's framed table ≡ the
//     real KIT-02 Table the ready slot renders); empty / error are intentionally content-sized
//     (their EmptyState / ErrorState `min-h-48` reservation, a different intrinsic min-height).
//   • BANNER group (offline / reconnecting / stale) — a SEPARATE 40px DataTrustBanner block role,
//     NOT height-compared to the content region; their own CLS guarantee is the DataTrustBanner
//     reserved-height invariant (its own cls.spec block).
const CLS_CELL = "w-full";
const CONTENT_REGION_STATES: readonly AsyncKind[] = ["loading", "empty", "error", "ready"];
const BANNER_STATES: readonly AsyncKind[] = ["offline", "reconnecting", "stale"];

export const Cls: Story = () => (
  <div className="flex flex-col gap-4 bg-bg-1 p-4">
    <p className="font-body text-xs text-text-muted">
      Content-region states reserve the table box (loading ≡ ready); banners are a separate 40px
      block role (CLS = 0).
    </p>
    <div className="grid w-80 grid-cols-1 gap-3">
      {CONTENT_REGION_STATES.map((kind) => (
        <div key={kind} className={CLS_CELL} data-async-cell={kind}>
          <AsyncBoundary className="w-full" state={stateFor(kind)} />
        </div>
      ))}
      {BANNER_STATES.map((kind) => (
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
