// Table catalog stories (KIT-02) — the CLS-0 sticky-header scroll-in-card with
// controlled sort, a keyboard/SR full-row click zone, and tier-colored numeric
// cells, all rows from the single `_fixtures/ROSTER` (Vasiliy #1). Demonstrates the
// ×7 row states (enabled / hover / pressed / focused / selected / disabled /
// loading), the ×4 data-volume states (empty / few / many-with-total / limit), and
// the ×5 scenario endings (success / system-error / user-error n/a / loading /
// onboarding-empty). `Cls` renders the loading skeleton beside the data table for
// the `cls.spec` box-height equality (CLS = 0).
import type { Story, StoryDefault } from "@ladle/react";
import { ROSTER, SS_BASELINE, STRINGS, type TierMetric, tierFor, type Player } from "../_fixtures";
import { EmptyState } from "../EmptyState";
import { ErrorState } from "../ErrorState";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Table, type SortState, type TableColumn, type TableDensity } from "./Table";
import { TableRow, type RowState, type TierCell } from "./TableRow";

export default {
  title: "KIT-02 Data-table / Table",
} satisfies StoryDefault;

type Lang = "ru" | "en";

// ---- column model (fixed widths → the colgroup the CLS-0 contract reserves) ----
const COLUMNS: readonly TableColumn[] = [
  { key: "rank", label: "#", width: 56, numeric: true, sortable: false },
  { key: "name", label: "Игрок", width: 200, sortable: true },
  { key: "squad", label: "Отряд", width: 120, sortable: true },
  { key: "score", label: STRINGS.statScore.ru, width: 132, numeric: true, sortable: true },
  { key: "kd", label: STRINGS.statKd.ru, width: 132, numeric: true, sortable: true },
] as const;

const EN_LABELS: Readonly<Record<string, string>> = {
  rank: "#",
  name: "Player",
  squad: "Squad",
  score: STRINGS.statScore.en,
  kd: STRINGS.statKd.en,
};

const enColumns = (): readonly TableColumn[] =>
  COLUMNS.map((c) => ({ ...c, label: EN_LABELS[c.key] ?? c.label }));

// The sort-action accessible labels per column (RU/EN), built from the «сортировать
// по {col}» template — the QUAL-05 parity proof carried onto the Th buttons.
function sortLabels(lang: Lang): Readonly<Record<string, string>> {
  const tpl = lang === "ru" ? STRINGS.sortHeaderAria.ru : STRINGS.sortHeaderAria.en;
  const labels = lang === "ru" ? COLUMNS : enColumns();
  return Object.fromEntries(labels.map((c) => [c.key, tpl.replace("{col}", c.label)]));
}

// A tier-colored numeric cell derived from the roster value via `tierFor` (baseline
// passed EXPLICITLY, D-04) — the level drives the color + paired Pips.
function tierCell(metric: TierMetric, value: number): TierCell {
  const tier = tierFor(metric, value, SS_BASELINE);
  return { value: value.toFixed(2), metric, level: tier.level };
}

// Map one roster player → the TableRow props (tier cells, anchor href, rank).
function rowProps(p: Player, rank: number) {
  return {
    rank,
    name: p.name,
    squad: p.squad,
    href: `#player-${rank}`,
    score: tierCell("score", p.score),
    kd: tierCell("kd", p.kd),
  };
}

// The caption carries the total (e.g. «по убийствам · 200») — the data-volume cue.
function caption(lang: Lang, total: number): string {
  return lang === "ru" ? `Таблица игроков · ${total}` : `Players table · ${total}`;
}

const COMFORTABLE: TableDensity = "comfortable";

// A ready-to-render table of the first `n` roster rows at the given density.
function dataTable(
  rows: readonly Player[],
  density: TableDensity,
  sort: SortState,
  lang: Lang,
  visibleRows: number,
): ReturnType<Story> {
  const cols = lang === "ru" ? COLUMNS : enColumns();
  const rowHeight = density === "comfortable" ? 52 : 44;
  return (
    <Table
      columns={cols}
      caption={caption(lang, rows.length)}
      density={density}
      sort={sort}
      sortLabels={sortLabels(lang)}
      visibleRows={visibleRows}
    >
      {rows.map((p, i) => (
        <TableRow key={p.name} rowHeight={rowHeight} {...rowProps(p, i + 1)} />
      ))}
    </Table>
  );
}

const SORT_SCORE_DESC: SortState = { key: "score", direction: "descending" };

// ---- Success (the headline story): the synced top of the roster, Vasiliy #1 ----
export const Success: Story = () => (
  <div className="flex max-w-3xl flex-col gap-3 bg-bg-1 p-4">
    {dataTable(ROSTER.slice(0, 8), COMFORTABLE, SORT_SCORE_DESC, "ru", 8)}
  </div>
);

// ---- EN parity ----
export const SuccessEn: Story = () => (
  <div className="flex max-w-3xl flex-col gap-3 bg-bg-1 p-4">
    {dataTable(ROSTER.slice(0, 8), COMFORTABLE, { key: "score", direction: "descending" }, "en", 8)}
  </div>
);

// ---- ×7 row states (RESEARCH Pattern 2 — forced via data-state, no real pointer) ----
const ROW_STATES: readonly RowState[] = [
  "enabled",
  "hover",
  "pressed",
  "focused",
  "selected",
  "disabled",
];

export const RowStates: Story = () => {
  const vasiliy = ROSTER[0]!;
  // Each state is a FULL-WIDTH labelled row (not a narrow StateMatrix cell): the
  // row's fixed colgroup is 640px wide, so a cramped 3-col grid would clip the
  // Счёт/K-D columns. The `data-state-cell` hook stays so the catalog spec asserts
  // each named state, exactly like the prior-wave MiniStatGrid full-width fix.
  return (
    <div className="flex max-w-3xl flex-col gap-4 bg-bg-1 p-4">
      <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
        TableRow — состояния (×7)
      </h2>
      {ROW_STATES.map((state) => (
        <div key={state} className="flex flex-col gap-1" data-state-cell={state}>
          <span className="font-body text-xs font-semibold uppercase text-text-muted">{state}</span>
          <div className="overflow-hidden rounded-md border border-border-1">
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                {COLUMNS.map((c) => (
                  <col key={c.key} style={{ width: `${c.width}px` }} />
                ))}
              </colgroup>
              <tbody>
                <TableRow
                  rowHeight={52}
                  {...rowProps(vasiliy, 1)}
                  selected={state === "selected"}
                  disabled={state === "disabled"}
                  forcedState={state}
                />
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {/* The 7th state — loading — is the Skeleton table variant the Table swaps in
          (GAP-11: pass `loading` so the cell shows the shimmer placeholder, NOT a
          real Vasiliy data row). */}
      <div className="flex flex-col gap-1" data-state-cell="loading">
        <span className="font-body text-xs font-semibold uppercase text-text-muted">loading</span>
        <Table
          columns={COLUMNS}
          caption={caption("ru", 0)}
          density={COMFORTABLE}
          sort={SORT_SCORE_DESC}
          sortLabels={sortLabels("ru")}
          visibleRows={1}
          loading
        >
          {null}
        </Table>
      </div>
    </div>
  );
};

// ---- ×4 data-volume states ----
export const DataVolumes: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    {/* empty → EmptyState with the actionable copy + total count (0). The narrow-safe
        empty cell rides the shared StateMatrix; the wide table volumes below are
        full-width labelled rows (the colgroup is 640px — a cramped cell would clip). */}
    <StateMatrix title="Объёмы данных — пусто">
      <StateCell label="empty">
        <EmptyState
          heading={STRINGS.emptyTableHeading.ru}
          body={STRINGS.emptyTableBody.ru}
          totalCount="Всего: 0"
        />
      </StateCell>
    </StateMatrix>
    {/* few — the table holds, no orphan layout. */}
    <section className="flex flex-col gap-2" data-state-cell="few">
      <span className="font-body text-xs font-semibold uppercase text-text-muted">few</span>
      {dataTable(ROSTER.slice(0, 3), COMFORTABLE, SORT_SCORE_DESC, "ru", 3)}
    </section>
    {/* many — capped window (sticky scroll), total in the caption. */}
    <section className="flex flex-col gap-2" data-state-cell="many">
      <span className="font-body text-xs font-semibold uppercase text-text-muted">many</span>
      {dataTable(ROSTER, COMFORTABLE, SORT_SCORE_DESC, "ru", 8)}
    </section>
    {/* limit-reached — the full roster scrolled to the end (cursor affordance lives in Pagination). */}
    <section className="flex flex-col gap-2" data-state-cell="limit">
      <span className="font-body text-xs font-semibold uppercase text-text-muted">limit</span>
      {dataTable(ROSTER.slice(-4), COMFORTABLE, SORT_SCORE_DESC, "ru", 4)}
    </section>
  </div>
);

// ---- ×5 scenario endings ----
export const Endings: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <section className="flex flex-col gap-2" data-state-cell="success">
      <span className="font-body text-xs font-semibold uppercase text-text-muted">success</span>
      {dataTable(ROSTER.slice(0, 5), COMFORTABLE, SORT_SCORE_DESC, "ru", 5)}
    </section>
    <section className="flex flex-col gap-2" data-state-cell="system-error">
      <span className="font-body text-xs font-semibold uppercase text-text-muted">
        system-error
      </span>
      <ErrorState
        kind="system"
        message={STRINGS.errorSystem.ru.replace("{id}", "SS-2026-0421")}
        action={
          <a
            href="#retry"
            className="inline-flex min-h-11 items-center rounded-md border border-border-1 bg-surface-2 px-4 font-body text-sm font-semibold text-text-primary hover:bg-surface-3 focus-visible:outline-none focus-visible:shadow-(--shadow-ring)"
          >
            Повторить
          </a>
        }
      />
    </section>
    {/* user-error — n/a for a read-only table; documented as the 3rd ending. */}
    <section className="flex flex-col gap-2" data-state-cell="user-error">
      <span className="font-body text-xs font-semibold uppercase text-text-muted">
        user-error (n/a — read-only)
      </span>
      <p className="font-body text-sm text-text-muted">
        Таблица только для чтения — пользовательских ошибок ввода нет.
      </p>
    </section>
    <section className="flex flex-col gap-2" data-state-cell="loading">
      <span className="font-body text-xs font-semibold uppercase text-text-muted">loading</span>
      <div className="max-w-3xl">
        <LoadingTable />
      </div>
    </section>
    <section className="flex flex-col gap-2" data-state-cell="onboarding-empty">
      <span className="font-body text-xs font-semibold uppercase text-text-muted">
        onboarding-empty
      </span>
      <EmptyState heading={STRINGS.emptyTableHeading.ru} body={STRINGS.emptyTableBody.ru} />
    </section>
  </div>
);

// The loading table — the Table with `loading` swapping in the Skeleton variant.
function LoadingTable(): ReturnType<Story> {
  return (
    <Table
      columns={COLUMNS}
      caption={caption("ru", 0)}
      density={COMFORTABLE}
      sort={SORT_SCORE_DESC}
      sortLabels={sortLabels("ru")}
      visibleRows={6}
      loading
    >
      {null}
    </Table>
  );
}

// ---- CLS = 0 proof: loading skeleton vs data table at identical geometry ----
// Same columns + density + visibleRows → the skeleton box height must equal the
// data table box height (cls.spec asserts equality).
export const Cls: Story = () => {
  const rows = ROSTER.slice(0, 6);
  return (
    <div className="flex max-w-3xl flex-col gap-4 bg-bg-1 p-4">
      <div data-cls-table-skeleton>
        <Table
          columns={COLUMNS}
          caption={caption("ru", rows.length)}
          density={COMFORTABLE}
          sort={SORT_SCORE_DESC}
          sortLabels={sortLabels("ru")}
          visibleRows={6}
          loading
        >
          {null}
        </Table>
      </div>
      <div data-cls-table-final>{dataTable(rows, COMFORTABLE, SORT_SCORE_DESC, "ru", 6)}</div>
    </div>
  );
};

// ---- Playground — drive sort direction + density via Ladle args ----
type PlaygroundArgs = {
  density: TableDensity;
  sortKey: string;
  direction: "ascending" | "descending" | "none";
};

export const Playground: Story<PlaygroundArgs> = ({ density, sortKey, direction }) => (
  <div className="flex max-w-3xl flex-col gap-3 bg-bg-1 p-4">
    {dataTable(ROSTER.slice(0, 8), density, { key: sortKey, direction }, "ru", 8)}
  </div>
);

Playground.args = { density: "comfortable", sortKey: "score", direction: "descending" };
Playground.argTypes = {
  density: { options: ["comfortable", "compact"], control: { type: "inline-radio" } },
  sortKey: { options: ["name", "squad", "score", "kd"], control: { type: "inline-radio" } },
  direction: {
    options: ["ascending", "descending", "none"],
    control: { type: "inline-radio" },
  },
};
