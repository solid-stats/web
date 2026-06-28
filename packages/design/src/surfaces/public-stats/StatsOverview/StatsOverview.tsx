import type { ReactNode } from "react";
import { Trophy } from "lucide-react";
import { Link } from "../../../shared/uikit/Button";
import { CompactList } from "../../../shared/uikit/CompactRow";
import { MiniStatGrid } from "../../../shared/uikit/MiniStatGrid";
import type { MiniStat } from "../../../shared/uikit/MiniStatGrid";
import { Skeleton } from "../../../shared/uikit/Skeleton";
import { Sparkline } from "../../../shared/uikit/Sparkline";
import { StatTile } from "../../../shared/uikit/StatTile";
import { AutoTable, TableRow } from "../../../shared/uikit/Table";
import type { SortState, TableColumn, TableDensity } from "../../../shared/uikit/Table";
import { STRINGS } from "../../../shared/uikit/_fixtures";
import { SS_BASELINE } from "../../../shared/uikit/_fixtures/tiers";
import { i18n } from "../../../shared/uikit/_i18n";
import { PublicStatsSurfaceHarness } from "../_harness";
import { PUBLIC_STATS, toPlayerCompactRow, toTierCell } from "../_fixtures";
import type {
  PublicStatsHarnessState,
  PublicStatsLang,
} from "../_harness/PublicStatsSurfaceHarness";
import type { PublicStatsOverview, PublicStatsPlayer } from "../_fixtures";

export type StatsOverviewEntry = {
  readonly key: "players" | "squads" | "rotations" | "commander" | "bounty";
  readonly labelKey:
    | "publicStatsAllPlayersCta"
    | "publicStatsSquadsEntry"
    | "publicStatsRotationsEntry"
    | "publicStatsCommanderEntry"
    | "publicStatsBountyEntry";
  readonly href: string;
  readonly value: string;
};

export type StatsOverviewSection = {
  readonly key: "hero" | "leaders" | "entries";
  readonly labelKey: keyof typeof STRINGS;
};

export type StatsOverviewProps = {
  className?: string;
  readonly lang?: PublicStatsLang;
  readonly state?: PublicStatsHarnessState;
  readonly overview?: PublicStatsOverview;
  readonly loading?: boolean;
};

const SORT: SortState = { key: "score", direction: "descending" };
const VISIBLE_ROWS = 5;
const MOBILE_TOP_N = 4;

function t(
  lang: PublicStatsLang,
  id: keyof typeof STRINGS,
  values?: Record<string, string | number>,
): string {
  i18n.activate(lang);
  return values === undefined ? i18n._({ id }) : i18n._({ id, values });
}

function entryItems(lang: PublicStatsLang, totalPlayers: number): readonly StatsOverviewEntry[] {
  return [
    {
      key: "players",
      labelKey: "publicStatsAllPlayersCta",
      href: "/?story=public-stats--players-list--success&mode=preview",
      value: String(totalPlayers),
    },
    {
      key: "squads",
      labelKey: "publicStatsSquadsEntry",
      href: "/?story=public-stats--squads--success&mode=preview",
      value: lang === "ru" ? "18" : "18",
    },
    {
      key: "rotations",
      labelKey: "publicStatsRotationsEntry",
      href: "/?story=public-stats--rotations--success&mode=preview",
      value: lang === "ru" ? "6" : "6",
    },
    {
      key: "commander",
      labelKey: "publicStatsCommanderEntry",
      href: "/?story=public-stats--commander--success&mode=preview",
      value: lang === "ru" ? "42" : "42",
    },
    {
      key: "bounty",
      labelKey: "publicStatsBountyEntry",
      href: "/?story=public-stats--bounty--success&mode=preview",
      value: lang === "ru" ? "1 240" : "1,240",
    },
  ];
}

function metricStats(lang: PublicStatsLang, overview: PublicStatsOverview): readonly MiniStat[] {
  const leader = overview.topPlayers[0];
  return [
    {
      key: "players",
      label: t(lang, "publicStatsPlayersTitle"),
      value: String(overview.totalPlayers),
    },
    {
      key: "replays",
      label: t(lang, "publicStatsReplaysCaption", { n: overview.provenance.replayCount }),
      value: String(overview.provenance.replayCount),
    },
    {
      key: "score",
      label: t(lang, "statScore"),
      value: leader === undefined ? "0.00" : leader.score.toFixed(2),
    },
    {
      key: "kd",
      label: t(lang, "statKd"),
      value: leader === undefined ? "0.00" : leader.kd.toFixed(2),
    },
  ];
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
    { key: "name", label: t(lang, "publicStatsPlayersTitle"), width: 220 },
    { key: "squad", label: t(lang, "publicStatsSquadsEntry"), width: 140 },
    { key: "score", label: t(lang, "statScore"), width: 132, numeric: true, sortable: true },
    { key: "kd", label: t(lang, "statKd"), width: 132, numeric: true, sortable: true },
  ];
}

function tableRow(player: PublicStatsPlayer, density: TableDensity): ReactNode {
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

function Hero({ lang, overview, loading }: StatsOverviewProps & { overview: PublicStatsOverview }) {
  const leader = overview.topPlayers[0];
  if (loading === true) {
    return (
      <section className="grid gap-3 @xl:grid-cols-2" data-overview-hero>
        <Skeleton variant="tile" withDelta />
        <Skeleton variant="tile" withDelta />
      </section>
    );
  }

  return (
    <section className="grid gap-3 @xl:grid-cols-2" data-overview-hero>
      <StatTile
        label={t(lang ?? "en", "statScore")}
        value={leader === undefined ? "0.00" : leader.score.toFixed(2)}
        delta={{ sign: "up", text: "+0.42" }}
      />
      <StatTile
        label={t(lang ?? "en", "statKd")}
        value={leader === undefined ? "0.00" : leader.kd.toFixed(2)}
        delta={{ sign: "up", text: "+0.18" }}
      />
    </section>
  );
}

function Leaders({
  lang,
  overview,
  loading,
}: {
  readonly lang: PublicStatsLang;
  readonly overview: PublicStatsOverview;
  readonly loading: boolean;
}): ReactNode {
  const rows = overview.topPlayers;
  const caption = t(lang, "publicStatsPlayersCaption", { n: overview.totalPlayers });
  const remaining = Math.max(overview.totalPlayers - MOBILE_TOP_N, 0);

  return (
    <section className="flex flex-col gap-3" data-overview-leaders>
      <div className="flex items-center gap-2">
        <Trophy className="size-5 shrink-0 text-primary" aria-hidden />
        <h2 className="font-display text-xl font-semibold text-text-primary">
          {t(lang, "publicStatsPlayersTitle")}
        </h2>
      </div>

      {rows.length === 0 ? (
        <div className="flex min-h-64 items-center rounded-md border border-border-1 bg-surface-1 p-4">
          <p className="font-body text-sm text-text-muted">{t(lang, "publicStatsEmptyHeading")}</p>
        </div>
      ) : (
        <>
          <CompactList
            className="@5xl:hidden"
            rows={rows.map(toPlayerCompactRow)}
            topN={MOBILE_TOP_N}
            metricLabels={{ score: t(lang, "statScore"), kd: t(lang, "statKd") }}
            showMoreLabel={t(lang, "publicStatsShowMore", { n: remaining })}
            caption={caption}
          />
          <AutoTable
            className="hidden @5xl:block"
            columns={playerColumns(lang)}
            caption={caption}
            sort={SORT}
            sortLabels={sortLabels(lang)}
            visibleRows={VISIBLE_ROWS}
            loading={loading}
            rows={(density) => rows.map((row) => tableRow(row, density))}
          />
        </>
      )}
    </section>
  );
}

function EntryGrid({
  lang,
  overview,
}: {
  readonly lang: PublicStatsLang;
  readonly overview: PublicStatsOverview;
}): ReactNode {
  return (
    <section className="grid gap-3 @lg:grid-cols-2 @3xl:grid-cols-5" data-overview-entries>
      {entryItems(lang, overview.totalPlayers).map((entry) => (
        <Link
          key={entry.key}
          href={entry.href}
          variant={entry.key === "players" ? "primary" : "secondary"}
          justify="start"
          className="flex min-w-0 flex-col items-start gap-1"
          data-overview-entry={entry.key}
          aria-label={t(lang, entry.labelKey)}
        >
          <span className="font-body text-sm font-semibold">{t(lang, entry.labelKey)}</span>
          <span className="font-mono text-xs tabular-nums opacity-80">{entry.value}</span>
        </Link>
      ))}
    </section>
  );
}

function TrendStrip({
  lang,
  players,
}: {
  readonly lang: PublicStatsLang;
  readonly players: readonly PublicStatsPlayer[];
}): ReactNode {
  const leader = players[0];
  return (
    <figure className="rounded-md border border-border-1 bg-surface-1 p-4" data-overview-trend>
      <figcaption className="mb-3 font-body text-xs font-semibold uppercase tracking-label text-text-muted">
        {t(lang, "statScore")}
      </figcaption>
      <Sparkline
        values={leader?.spark ?? []}
        baseline={SS_BASELINE}
        summary={
          leader === undefined
            ? t(lang, "publicStatsEmptyHeading")
            : `${leader.name} ${leader.score.toFixed(2)}`
        }
      />
    </figure>
  );
}

function OverviewContent({
  lang,
  overview,
  loading,
}: {
  readonly lang: PublicStatsLang;
  readonly overview: PublicStatsOverview;
  readonly loading: boolean;
}): ReactNode {
  return (
    <div className="@container flex flex-col gap-4" data-stats-overview>
      <Hero lang={lang} overview={overview} loading={loading} />
      <MiniStatGrid
        stats={metricStats(lang, overview)}
        emptyLabel={t(lang, "publicStatsEmptyHeading")}
      />
      <TrendStrip lang={lang} players={overview.topPlayers} />
      <Leaders lang={lang} overview={overview} loading={loading} />
      <EntryGrid lang={lang} overview={overview} />
    </div>
  );
}

export function StatsOverview({
  className,
  lang = "en",
  state = "success",
  overview = PUBLIC_STATS.overview,
  loading = false,
}: StatsOverviewProps): ReactNode {
  return (
    <div className={className} data-stats-overview-frame>
      <PublicStatsSurfaceHarness
        lang={lang}
        activeKey="overview"
        state={state}
        provenance={overview.provenance}
        title={t(lang, "publicStatsOverviewTitle")}
      >
        <OverviewContent lang={lang} overview={overview} loading={loading || state === "loading"} />
      </PublicStatsSurfaceHarness>
    </div>
  );
}
