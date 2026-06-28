import type { ReactNode } from "react";
import { Filter, Search } from "lucide-react";
import { Button } from "../../../shared/uikit/Button";
import { CompactList } from "../../../shared/uikit/CompactRow";
import { Field } from "../../../shared/uikit/Field";
import { Input } from "../../../shared/uikit/Input";
import { Select } from "../../../shared/uikit/Select";
import type { SelectOption } from "../../../shared/uikit/Select";
import { AutoTable, TableRow } from "../../../shared/uikit/Table";
import type { SortState, TableColumn, TableDensity } from "../../../shared/uikit/Table";
import { STRINGS } from "../../../shared/uikit/_fixtures";
import { i18n } from "../../../shared/uikit/_i18n";
import { PublicStatsSurfaceHarness } from "../_harness";
import { PUBLIC_STATS, PUBLIC_STATS_PERIODS, toPlayerCompactRow, toTierCell } from "../_fixtures";
import type { PublicStatsHarnessState, PublicStatsLang } from "../_harness";
import type { PublicStatsPeriod, PublicStatsTierCell, PublicStatsVolumeKind } from "../_fixtures";
import type { PublicStatsPlayers } from "../_fixtures/publicStats";

export type PlayersListMode = "ready" | "cold" | "inSession";
export type PlayersListPeriod = PublicStatsPeriod["key"];

export type PlayersListFilters = {
  readonly search: string;
  readonly tier: "all" | PublicStatsTierCell["level"];
};

export type PlayersListProps = {
  className?: string;
  readonly lang?: PublicStatsLang;
  readonly state?: PublicStatsHarnessState;
  readonly players?: PublicStatsPlayers;
  readonly period?: PlayersListPeriod;
  readonly mode?: PlayersListMode;
  readonly filters?: PlayersListFilters;
  readonly volume?: PublicStatsVolumeKind;
};

const DEFAULT_FILTERS: PlayersListFilters = { search: "", tier: "all" };
const SORT: SortState = { key: "score", direction: "descending" };
const VISIBLE_ROWS = 8;
const MOBILE_TOP_N = 6;
const TOP_SPACER = 88;
const BOTTOM_SPACER = 352;

function t(
  lang: PublicStatsLang,
  id: keyof typeof STRINGS,
  values?: Record<string, string | number>,
): string {
  i18n.activate(lang);
  return values === undefined ? i18n._({ id }) : i18n._({ id, values });
}

function withCount(label: string, count: number): string {
  return label.replace("{n}", String(count));
}

function periodOptions(lang: PublicStatsLang): readonly SelectOption<PlayersListPeriod>[] {
  return PUBLIC_STATS_PERIODS.map((period) => ({
    value: period.key,
    label: t(lang, period.labelKey),
  }));
}

function sortLabels(lang: PublicStatsLang): Readonly<Record<string, string>> {
  return {
    score: t(lang, "statScore"),
    kd: t(lang, "statKd"),
  };
}

function playerColumns(lang: PublicStatsLang): readonly TableColumn[] {
  return [
    { key: "rank", label: "#", width: 64, numeric: true },
    { key: "name", label: t(lang, "publicStatsPlayersTitle"), width: 240 },
    { key: "squad", label: t(lang, "publicStatsSquadsEntry"), width: 140 },
    { key: "kd", label: t(lang, "statKd"), width: 132, numeric: true, sortable: true },
    { key: "score", label: t(lang, "statScore"), width: 132, numeric: true, sortable: true },
  ];
}

function tableRow(player: PublicStatsPlayers["rows"][number], density: TableDensity): ReactNode {
  return (
    <TableRow
      key={`${density}-${player.id}`}
      rowHeight={density === "comfortable" ? 52 : 44}
      rank={player.rank}
      name={player.name}
      squad={player.squad}
      href={player.href}
      score={toTierCell("score", player.score)}
      kd={toTierCell("kd", player.kd)}
      selected={player.rank === 1}
    />
  );
}

function periodCopy(period: PlayersListPeriod, mode: PlayersListMode): string {
  if (period === "rotation") return "Active rotation ready";
  if (mode === "ready") return "All-time warm ready";
  if (mode === "cold") return "Recomputing aggregate";
  return "Loading aggregate";
}

function periodState(period: PlayersListPeriod, mode: PlayersListMode): string {
  if (period === "rotation") return "rotation-ready";
  if (mode === "ready") return "alltime-warm";
  if (mode === "cold") return "alltime-cold";
  return "alltime-in-session";
}

function tierFilterLabel(lang: PublicStatsLang, filters: PlayersListFilters): string {
  if (filters.tier === "all") return lang === "ru" ? "Все тиры" : "All tiers";
  return filters.tier;
}

function Controls({
  lang,
  period,
  filters,
}: {
  readonly lang: PublicStatsLang;
  readonly period: PlayersListPeriod;
  readonly filters: PlayersListFilters;
}): ReactNode {
  return (
    <section
      className="grid gap-3 rounded-md border border-border-1 bg-surface-1 p-3 @4xl:grid-cols-[1fr_220px_160px_auto]"
      data-players-controls
      aria-label={t(lang, "publicStatsPlayersTitle")}
    >
      <Field label={lang === "ru" ? "Поиск игроков" : "Search players"}>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
            aria-hidden
          />
          <Input
            className="pl-9"
            type="search"
            value={filters.search}
            placeholder={t(lang, "publicStatsSearchEmptyHeading")}
          />
        </div>
      </Field>
      <Field label={t(lang, "publicStatsPeriodLabel")}>
        <Select
          options={periodOptions(lang)}
          value={period}
          placeholder={t(lang, "publicStatsPeriodRotation")}
        />
      </Field>
      <div className="flex flex-col gap-1.5">
        <span className="font-body text-xs font-semibold uppercase tracking-label text-text-muted">
          Tier
        </span>
        <span
          className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-1 bg-surface-2 px-3 font-body text-sm text-text-primary"
          data-filter-tier
        >
          <Filter className="size-4 shrink-0 text-primary" aria-hidden />
          {tierFilterLabel(lang, filters)}
        </span>
      </div>
      <div className="flex items-end">
        <Button variant="secondary">{t(lang, "emptyRetry")}</Button>
      </div>
    </section>
  );
}

function EmptyPlayers({ lang }: { readonly lang: PublicStatsLang }): ReactNode {
  return (
    <div
      className="flex min-h-64 flex-col justify-center gap-2 rounded-md border border-border-1 bg-surface-1 p-4"
      data-players-empty
    >
      <h2 className="font-display text-xl font-semibold text-text-primary">
        {t(lang, "publicStatsSearchEmptyHeading")}
      </h2>
      <p className="font-body text-sm text-text-muted">{t(lang, "publicStatsSearchEmptyBody")}</p>
      <div>
        <Button variant="secondary">{t(lang, "emptyRetry")}</Button>
      </div>
    </div>
  );
}

function LoadingCompact({
  lang,
  caption,
  rows,
  totalCount,
}: {
  readonly lang: PublicStatsLang;
  readonly caption: string;
  readonly rows: PublicStatsPlayers["rows"];
  readonly totalCount: number;
}): ReactNode {
  const remaining = Math.max(totalCount - MOBILE_TOP_N, 0);
  return (
    <div data-players-compact-skeleton aria-busy="true">
      <CompactList
        className="opacity-60"
        rows={rows.map(toPlayerCompactRow)}
        topN={MOBILE_TOP_N}
        metricLabels={{ score: t(lang, "statScore"), kd: t(lang, "statKd") }}
        showMoreLabel={withCount(t(lang, "publicStatsShowMore"), remaining)}
        caption={caption}
      />
    </div>
  );
}

function PlayersTable({
  lang,
  players,
  loading,
}: {
  readonly lang: PublicStatsLang;
  readonly players: PublicStatsPlayers;
  readonly loading: boolean;
}): ReactNode {
  const caption = withCount(t(lang, "publicStatsPlayersCaption"), players.totalCount);
  const rows = players.rows;
  const remaining = Math.max(players.totalCount - MOBILE_TOP_N, 0);

  if (rows.length === 0 && !loading) return <EmptyPlayers lang={lang} />;

  return (
    <section className="flex flex-col gap-3" data-players-table-region>
      {loading ? (
        <div className="@5xl:hidden" data-players-mobile-loading>
          <LoadingCompact
            lang={lang}
            caption={caption}
            rows={rows}
            totalCount={players.totalCount}
          />
        </div>
      ) : (
        <CompactList
          className="@5xl:hidden"
          rows={rows.map(toPlayerCompactRow)}
          topN={MOBILE_TOP_N}
          metricLabels={{ score: t(lang, "statScore"), kd: t(lang, "statKd") }}
          showMoreLabel={withCount(t(lang, "publicStatsShowMore"), remaining)}
          caption={caption}
        />
      )}
      <AutoTable
        className="hidden @5xl:block"
        columns={playerColumns(lang)}
        caption={caption}
        sort={SORT}
        sortLabels={sortLabels(lang)}
        visibleRows={VISIBLE_ROWS}
        loading={loading}
        topSpacer={TOP_SPACER}
        bottomSpacer={BOTTOM_SPACER}
        rows={(density) => rows.map((row) => tableRow(row, density))}
      />
    </section>
  );
}

function PlayersListContent({
  lang,
  players,
  period,
  mode,
  filters,
}: {
  readonly lang: PublicStatsLang;
  readonly players: PublicStatsPlayers;
  readonly period: PlayersListPeriod;
  readonly mode: PlayersListMode;
  readonly filters: PlayersListFilters;
}): ReactNode {
  const loading = period === "alltime" && mode !== "ready";
  return (
    <div
      className="@container flex flex-col gap-4"
      data-players-list
      data-period-state={periodState(period, mode)}
    >
      <Controls lang={lang} period={period} filters={filters} />
      <div
        className="rounded-md border border-border-1 bg-surface-1 px-3 py-2 font-body text-xs text-text-muted"
        data-period-status={periodState(period, mode)}
      >
        {periodCopy(period, mode)}
      </div>
      <PlayersTable lang={lang} players={players} loading={loading} />
    </div>
  );
}

export function PlayersList({
  className,
  lang = "en",
  state = "success",
  players = PUBLIC_STATS.players,
  period = "rotation",
  mode = "ready",
  filters = DEFAULT_FILTERS,
}: PlayersListProps): ReactNode {
  return (
    <div className={className} data-players-list-frame>
      <PublicStatsSurfaceHarness
        lang={lang}
        activeKey="players"
        state={state}
        provenance={players.provenance}
        title={t(lang, "publicStatsPlayersTitle")}
      >
        <PlayersListContent
          lang={lang}
          players={players}
          period={period}
          mode={mode}
          filters={filters}
        />
      </PublicStatsSurfaceHarness>
    </div>
  );
}
