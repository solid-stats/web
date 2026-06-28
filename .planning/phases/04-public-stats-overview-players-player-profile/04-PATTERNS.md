# Phase 04: Public Stats - Overview, Players & Player Profile - Pattern Map

**Mapped:** 2026-06-28
**Files analyzed:** 16 planned new/modified files
**Analogs found:** 16 / 16

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts` | utility/model | transform | `packages/design/src/shared/uikit/_fixtures/roster.ts` | exact |
| `packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts` | test | transform | `packages/design/src/shared/uikit/_fixtures/_fixtures.test.ts` | exact |
| `packages/design/src/surfaces/public-stats/_harness/PublicStatsSurfaceHarness.tsx` | component/provider | event-driven UI state | `packages/design/src/shared/uikit/AppShell/AppShell.stories.tsx` + `AsyncBoundary.stories.tsx` | role-match |
| `packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.tsx` | component | transform | `packages/design/src/shared/uikit/StatTile/StatTile.stories.tsx` + `Table.stories.tsx` | role-match |
| `packages/design/src/surfaces/public-stats/StatsOverview/StatsOverview.stories.tsx` | test/story | event-driven UI state | `packages/design/src/shared/uikit/Table/Table.stories.tsx` | exact |
| `packages/design/src/surfaces/public-stats/StatsOverview/index.ts` | config/barrel | transform | `packages/design/src/shared/uikit/AppShell/index.ts` | exact |
| `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.tsx` | component | event-driven UI state | `packages/design/src/shared/uikit/Table/AutoTable.tsx` + `CompactRow.stories.tsx` | role-match |
| `packages/design/src/surfaces/public-stats/PlayersList/PlayersList.stories.tsx` | test/story | event-driven UI state | `packages/design/src/shared/uikit/Table/Table.stories.tsx` | exact |
| `packages/design/src/surfaces/public-stats/PlayersList/index.ts` | config/barrel | transform | `packages/design/src/shared/uikit/Table/index.ts` | exact |
| `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.tsx` | component | event-driven UI state | `packages/design/src/shared/uikit/Tabs/Tabs.stories.tsx` + `MiniStatGrid.stories.tsx` | role-match |
| `packages/design/src/surfaces/public-stats/PlayerProfile/PlayerProfile.stories.tsx` | test/story | event-driven UI state | `packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.stories.tsx` | exact |
| `packages/design/src/surfaces/public-stats/PlayerProfile/index.ts` | config/barrel | transform | `packages/design/src/shared/uikit/Tabs/index.ts` | exact |
| `packages/design/src/surfaces/public-stats/index.ts` | config/barrel | transform | `packages/design/src/shared/uikit/_fixtures/index.ts` | role-match |
| `packages/design/src/shared/uikit/_fixtures/strings.ts` | config/localization | transform | `packages/design/src/shared/uikit/_i18n/catalogs.ts` + `catalogs.test.ts` | exact |
| `packages/design/tests/public-stats-responsive.spec.ts` | test | request-response browser | `packages/design/tests/responsive.spec.ts` | exact |
| `packages/design/tests/public-stats-cls.spec.ts` | test | request-response browser | `packages/design/tests/cls.spec.ts` | exact |

## Pattern Assignments

### `packages/design/src/surfaces/public-stats/_fixtures/publicStats.ts` (utility/model, transform)

**Analog:** `packages/design/src/shared/uikit/_fixtures/roster.ts`

**Imports/data-source pattern:** import existing roster and tier seeds. Do not import `.design/hifi/*`.

**Canonical formula pattern** (lines 1-13):
```typescript
// The single canonical roster (D-06) — the one source every stat/table/tier story
// imports so Score/K-D and tiers stay consistent across tiles, tables, and chips
// ("Vasiliy #1 everywhere", QUAL-06).
//
// Score = (kills − TK) ÷ (games + deaths-from-TK)
// K/D   = (kills − TK) ÷ (deaths + deaths-from-TK)
```

**Derived helper pattern** (lines 48-55):
```typescript
export function scoreOf(p: ScoreInput): number {
  return round2((p.kills - p.tk) / (p.games + p.deathsTk));
}

export function kdOf(p: KdInput): number {
  return round2((p.kills - p.tk) / Math.max(p.deaths + p.deathsTk, 1));
}
```

**Tier derivation pattern:** `packages/design/src/shared/uikit/_fixtures/tiers.ts` lines 81-95:
```typescript
export function tierFor(
  metric: TierMetric,
  value: number,
  baseline: Baseline,
  period: TierPeriod = "rotation",
): Tier {
  const t = baseline.by[period][metric];
  if (value >= t.elite)
    return { level: "elite", name: TIER_NAMES.elite, pips: TIER_PIPS.elite, threshold: t.elite };
  if (value >= t.good)
    return { level: "good", name: TIER_NAMES.good, pips: TIER_PIPS.good, threshold: t.good };
  if (value >= t.base)
    return { level: "base", name: TIER_NAMES.base, pips: TIER_PIPS.base, threshold: t.base };
  return { level: "low", name: TIER_NAMES.low, pips: TIER_PIPS.low, threshold: 0 };
}
```

**Apply:** create one Phase 04 fixture graph that exports surface-ready overview/list/profile data, raw counters, derived Score/K/D, period-aware tiers, freshness/provenance, and data-volume variants. Keep Vasiliy as rank #1 across all exported surfaces.

---

### `packages/design/src/surfaces/public-stats/_fixtures/publicStats.test.ts` (test, transform)

**Analog:** `packages/design/src/shared/uikit/_fixtures/_fixtures.test.ts`

**Imports pattern** (lines 5-8):
```typescript
import { describe, expect, test } from "vitest";

import { OVERVIEW_PLAYERS, ROSTER, STRINGS, kdOf, scoreOf } from "./index";
```

**Invariant pattern** (lines 27-84):
```typescript
describe("canonical roster", () => {
  test("ROSTER[0] is Vasiliy (#1 everywhere)", () => {
    expect(ROSTER[0]?.name).toBe("Vasiliy");
  });

  test("every derived score/kd matches the formulas (internal consistency)", () => {
    for (const p of ROSTER) {
      expect(p.score).toBe(scoreOf(p));
      expect(p.kd).toBe(kdOf(p));
    }
  });
});
```

**Tier test pattern:** `packages/design/src/shared/uikit/_fixtures/tiers.test.ts` lines 10-25:
```typescript
test.each<{ metric: "score" | "kd"; value: number; level: TierLevel; threshold: number }>([
  { metric: "score", value: 0.5, level: "low", threshold: 0 },
  { metric: "score", value: 1.0, level: "base", threshold: 1.0 },
  { metric: "score", value: 2.4, level: "good", threshold: 2.4 },
  { metric: "score", value: 4.13, level: "elite", threshold: 4.0 },
])("$metric $value → $level (≥$threshold)", ({ metric, value, level, threshold }) => {
  const tier = tierFor(metric, value, SS_BASELINE, "rotation");
  expect(tier.level).toBe(level);
  expect(tier.threshold).toBe(threshold);
});
```

**Apply:** add tests for Vasiliy rank #1 in overview/list/profile, formula recomputation, period-aware tier derivation, no generated tail outranking seed leaders, profile/list/overview cross-surface consistency, and RU/EN key parity for new strings.

---

### Surface Components And Stories

**Applies to:**
- `StatsOverview/StatsOverview.tsx`
- `StatsOverview/StatsOverview.stories.tsx`
- `PlayersList/PlayersList.tsx`
- `PlayersList/PlayersList.stories.tsx`
- `PlayerProfile/PlayerProfile.tsx`
- `PlayerProfile/PlayerProfile.stories.tsx`
- `_harness/PublicStatsSurfaceHarness.tsx`

**Analog:** `packages/design/src/shared/uikit/AppShell/AppShell.stories.tsx`

**Story imports/default pattern** (lines 9-25):
```typescript
import type { Story, StoryDefault } from "@ladle/react";
import { BarChart3 } from "lucide-react";
import { STRINGS } from "../_fixtures";
import { AppShell } from "./AppShell";

export default {
  title: "KIT-01 Nav shell / AppShell",
} satisfies StoryDefault;
```

**Shell composition pattern** (lines 84-90):
```tsx
export const Shell: Story = () => (
  <div className="h-120 bg-bg-0">
    <AppShell activeKey="overview" className="h-full" {...shellSlots("player", "ru")}>
      <PageContent lang="ru" />
    </AppShell>
  </div>
);
```

**Async/state seam pattern:** `AsyncBoundary.stories.tsx` lines 56-90:
```typescript
function stateFor(kind: AsyncKind): AsyncState {
  switch (kind) {
    case "loading":
      return {
        kind: "loading",
        columns: COLUMNS,
        rows: ROWS,
        label: i18n._({ id: "loadingColdAggregate" }),
      };
    case "ready":
      return { kind: "ready", children: readyContent() };
  }
}
```

**State matrix pattern:** `StateMatrix.tsx` lines 23-33 and 46-55:
```tsx
export function StateMatrix({ children, title }: StateMatrixProps): ReactNode {
  return (
    <section className="flex flex-col gap-4" data-state-matrix>
      {title === undefined ? null : (
        <h2 className="font-display text-lg font-semibold text-text-primary tracking-tight">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{children}</div>
    </section>
  );
}

export function StateCell({ label, children }: StateCellProps): ReactNode {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border-1 bg-surface-1 p-3" data-state-cell={label}>
      <span className="font-body text-xs font-semibold uppercase text-text-muted">{label}</span>
      <div className="flex min-h-11 items-center">{children}</div>
    </div>
  );
}
```

**Apply:** each surface story should expose success, loading, empty, error, offline/stale/reconnecting where relevant, data-volume stories, RU/EN variants, and CLS proof stories. Components should be named functions with typed props, system props first, no route/API logic, no `shared/uikit` domain expansion.

---

### `PlayersList/PlayersList.tsx` And `StatsOverview/StatsOverview.tsx` Table/List Composition

**Analog:** `packages/design/src/shared/uikit/Table/Table.stories.tsx`, `AutoTable.tsx`, `CompactRow.stories.tsx`

**Column + tier cell pattern** (`Table.stories.tsx` lines 26-59):
```typescript
const COLUMNS: readonly TableColumn[] = [
  { key: "rank", label: "#", width: 56, numeric: true, sortable: false },
  { key: "name", label: "Игрок", width: 200, sortable: true },
  { key: "squad", label: "Отряд", width: 120, sortable: true },
  { key: "score", label: STRINGS.statScore.ru, width: 132, numeric: true, sortable: true },
  { key: "kd", label: STRINGS.statKd.ru, width: 132, numeric: true, sortable: true },
] as const;

function tierCell(metric: TierMetric, value: number): TierCell {
  const tier = tierFor(metric, value, SS_BASELINE);
  return { value: value.toFixed(2), metric, level: tier.level };
}
```

**Desktop auto-density pattern** (`AutoTable.tsx` lines 42-70):
```tsx
export function AutoTable({ className, columns, caption, sort, sortLabels, visibleRows, loading = false, rows, onSort }: Props): ReactNode {
  const shared = { columns, caption, sort, sortLabels, visibleRows, loading, onSort };
  return (
    <div className={`@container ${className ?? ""}`} data-auto-table>
      <div className="hidden @5xl:block" data-density-branch="comfortable">
        <Table {...shared} density="comfortable">{rows("comfortable")}</Table>
      </div>
      <div className="@5xl:hidden" data-density-branch="compact">
        <Table {...shared} density="compact">{rows("compact")}</Table>
      </div>
    </div>
  );
}
```

**Mobile top-N pattern** (`CompactRow.stories.tsx` lines 50-64):
```tsx
export const Mobile: Story = () => {
  const topN = 6;
  return (
    <div className="mx-auto w-full max-w-sm bg-bg-1 p-3" data-compact-mobile>
      <CompactList
        rows={ROWS}
        topN={topN}
        metricLabels={metricLabels("ru")}
        showMoreLabel={showMore("ru", ROWS.length - topN)}
        caption={caption("ru", ROWS.length)}
      />
    </div>
  );
};
```

**Data-volume pattern** (`Table.stories.tsx` lines 236-274):
```tsx
export const DataVolumes: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="Объёмы данных — пусто">
      <StateCell label="empty">
        <EmptyState heading={STRINGS.emptyTableHeading.ru} body={STRINGS.emptyTableBody.ru} totalCount="Всего: 0" />
      </StateCell>
    </StateMatrix>
    <section className="flex flex-col gap-2" data-state-cell="few">
      <VolumeCaption variant="few" shown={3} total={LARGER_TOTAL} />
      {dataTable(ROSTER.slice(0, 3), COMFORTABLE, SORT_SCORE_DESC, "ru", 3)}
    </section>
  </div>
);
```

**Apply:** desktop public stats tables should use `AutoTable`/`Table` with fixed column widths, `visibleRows`, and spacer-row visual contract only. Mobile must use `CompactList` top-N/show-more, no horizontal scroll, no nested scroll. Do not add TanStack Table/Virtual in Phase 04.

---

### `PlayerProfile/PlayerProfile.tsx` Profile Composition

**Analogs:** `StatTile.stories.tsx`, `MiniStatGrid.stories.tsx`, `Tabs.stories.tsx`, `ProvenanceLine.stories.tsx`

**Hero stat pattern** (`StatTile.stories.tsx` lines 17-39):
```tsx
const VASILIY = ROSTER[0]!;
const fmt = (n: number): string => n.toFixed(2);

export const Heroes: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <div className="grid max-w-md grid-cols-2 gap-3" data-hero-pair>
      <StatTile label={HERO_SCORE.ru} value={fmt(VASILIY.score)} delta={{ sign: "up", text: "+0.31" }} />
      <StatTile label={HERO_KD.ru} value={fmt(VASILIY.kd)} delta={{ sign: "down", text: "−0.12" }} />
    </div>
  </div>
);
```

**Secondary stats pattern** (`MiniStatGrid.stories.tsx` lines 22-35):
```typescript
const few = (lang: Lang): readonly MiniStat[] => [
  { key: "games", label: STRINGS.statGames[lang], value: int(VASILIY.games) },
  { key: "kills", label: STRINGS.statKills[lang], value: int(VASILIY.kills) },
  { key: "tk", label: STRINGS.statTk[lang], value: int(VASILIY.tk) },
  { key: "deaths", label: STRINGS.statDeaths[lang], value: int(VASILIY.deaths) },
];
```

**Tabs pattern** (`Tabs.stories.tsx` lines 23-33 and 56-64):
```tsx
const useTabs = (): readonly TabData[] => [
  { value: "overview", label: i18n._({ id: "tabsLabelOverview" }) },
  { value: "matches", label: i18n._({ id: "tabsLabelMatches" }) },
  { value: "squads", label: i18n._({ id: "tabsLabelSquads" }) },
];

export const Playground: Story = () => {
  const [value, setValue] = useState("overview");
  const tabs = useTabs();
  const panels = usePanels();
  return <Tabs tabs={tabs} panels={panels} value={value} onValueChange={setValue} />;
};
```

**Provenance pattern** (`ProvenanceLine.stories.tsx` lines 32-44):
```tsx
<ProvenanceLine
  replayCount={1342}
  freshnessLabel={FRESHNESS_STRING[state].ru}
  template={STRINGS.provenanceLine.ru}
  locale="ru"
  linkLabel="Как считается"
/>
```

**Apply:** profile should be full-width stacked sections: identity, hero Score/K/D, freshness/provenance near headline stats, squad/status, nick history and tabs. Avoid mismatched side columns and unsupported coverage/conflict panels.

---

### `packages/design/src/shared/uikit/_fixtures/strings.ts` (config/localization, transform)

**Analog:** `packages/design/src/shared/uikit/_i18n/catalogs.ts`

**Catalog derivation pattern** (lines 15-28):
```typescript
export type Catalog = Record<StringKey, string>;

export const ru = Object.fromEntries(
  Object.entries(STRINGS).map(([key, value]) => [key, value.ru]),
) as Catalog;

export const en = Object.fromEntries(
  Object.entries(STRINGS).map(([key, value]) => [key, value.en]),
) as Catalog;
```

**Parity test pattern:** `catalogs.test.ts` lines 19-42:
```typescript
test("every STRINGS key resolves to a non-empty RU and EN message (parity)", () => {
  for (const key of STRING_KEYS) {
    expect(ru[key], `ru[${key}] is defined`).toBeDefined();
    expect(en[key], `en[${key}] is defined`).toBeDefined();
    expect(ru[key].length, `ru[${key}] is non-empty`).toBeGreaterThan(0);
    expect(en[key].length, `en[${key}] is non-empty`).toBeGreaterThan(0);
  }
});
```

**Apply:** add Phase 04 string keys to `STRINGS` only; `catalogs.ts` derives RU/EN catalogs from it. Surface stories/components resolve via `i18n._({ id })` and pass plain strings into UIKIT primitives. Do not hardcode surface copy in components.

---

### Barrel Files (`index.ts`) (config/barrel, transform)

**Analogs:** `packages/design/src/shared/uikit/_fixtures/index.ts`, `packages/design/src/index.ts`

**Internal barrel pattern** (`_fixtures/index.ts` lines 1-12):
```typescript
// The single canonical fixture module (D-06) — the one barrel every stat/table/
// tier/data-trust story imports so Score/K-D, tiers, roster, and copy stay
// consistent across the whole catalog. Internal helper (underscore-prefixed): it
// is intentionally NOT graduated into the package public barrel (src/index.ts).
export type { Baseline, MetricThresholds, Tier, TierLevel, TierMetric, TierPeriod } from "./tiers";
export { SS_BASELINE, TIER_NAMES, TIER_PIPS, tierFor } from "./tiers";
```

**Public barrel boundary pattern** (`src/index.ts` lines 1-7):
```typescript
// @solid-stats/design — UIKIT public barrel (the package `exports` map "." entry
// resolves here, D-05). Components graduate into this barrel as each family slice
// lands; the Smoke catalog story and the underscore-prefixed `_fixtures` /
// `_state-matrix` helpers are NOT UIKIT exports and stay intentionally absent.
```

**Apply:** add slice-local barrels for each surface. Prefer keeping `surfaces/public-stats` internal to Ladle stories unless a later plan needs public package exports. Never export underscore-prefixed fixtures/harness helpers from `packages/design/src/index.ts`.

---

## Shared Patterns

### UIKIT Boundary

**Source:** `packages/design/src/index.ts` lines 88-101 and `04-CONTEXT.md` D-01/D-02.

**Apply to:** all Phase 04 surface files.

UIKIT primitives stay generic; player/overview/profile concepts live under `packages/design/src/surfaces/public-stats`. Surfaces compose `AppShell`, `AsyncBoundary`, `FreshnessPill`, `ProvenanceLine`, `AutoTable`, `CompactList`, `Select`, `Tabs`, `StatTile`, `MiniStatGrid`, `Sparkline`, `TierChip`, `TierScale`.

### Loading And CLS

**Source:** `Table.stories.tsx` lines 389-411 and `cls.spec.ts` lines 79-117.

```tsx
export const Cls: Story = () => {
  const rows = ROSTER.slice(0, 6);
  return (
    <div className="flex max-w-3xl flex-col gap-4 bg-bg-1 p-4">
      <div data-cls-table-skeleton>
        <Table columns={COLUMNS} caption={caption("ru", rows.length)} density={COMFORTABLE} sort={SORT_SCORE_DESC} sortLabels={sortLabels("ru")} visibleRows={6} loading>
          {null}
        </Table>
      </div>
      <div data-cls-table-final>{dataTable(rows, COMFORTABLE, SORT_SCORE_DESC, "ru", 6)}</div>
    </div>
  );
};
```

**Apply to:** every surface with loading/final states. Use identical columns, density, visible row counts, and reserved shell dimensions for skeleton/final swaps.

### Responsive / No Mobile Nested Scroll

**Source:** `packages/design/tests/responsive.spec.ts` lines 267-292.

```typescript
const list = page.locator("[data-compact-list]");
await noHorizontalScroll(list);

const nested = await list.evaluate((el) => {
  const all = [el, ...Array.from(el.querySelectorAll("*"))];
  return all.some((node) => {
    const e = node as HTMLElement;
    const oy = getComputedStyle(e).overflowY;
    return (oy === "auto" || oy === "scroll") && e.scrollHeight > e.clientHeight + 1;
  });
});
expect(nested, "no nested vertical scroll container (the page scrolls)").toBe(false);
await expect(page.locator("[data-show-more]")).toBeVisible();
```

**Apply to:** `public-stats-responsive.spec.ts`, Players mobile, Overview mobile leaderboards.

### Catalog Gate

**Source:** `packages/design/tests/catalog.spec.ts` lines 1-5 and 32-73.

```typescript
for (const key of storyKeys) {
  test.describe(key, () => {
    test("axe clean (serious/critical)", async ({ page }) => {
      await page.goto(`/?story=${key}&mode=preview`);
      await page.waitForSelector("[data-storyloaded]");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
    });
  });
}
```

**Apply to:** no direct edit needed if Phase 04 stories are registered in Ladle metadata. Add targeted public-stats tests only for surface-specific responsive/CLS/data contracts.

## No Analog Found

None. Every planned Phase 04 file has an existing local analog. Real TanStack Start routes, OpenAPI client/query hooks, SSE, and TanStack Table/Virtual integration are intentionally out of scope for this phase.

## Metadata

**Analog search scope:** `packages/design/src/shared/uikit/**`, `packages/design/tests/**`, Phase 04 planning docs, mandatory SolidStats skills.
**Files scanned:** 100+ design package files listed via `find`; 20+ analog files read with line numbers.
**Pattern extraction date:** 2026-06-28.
