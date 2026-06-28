import type { ReactNode } from "react";
import { ExternalLink, History, ShieldCheck } from "lucide-react";
import { Link } from "../../../shared/uikit/Button";
import { CompactList } from "../../../shared/uikit/CompactRow";
import { FreshnessPill } from "../../../shared/uikit/FreshnessPill";
import { MiniStatGrid } from "../../../shared/uikit/MiniStatGrid";
import type { MiniStat } from "../../../shared/uikit/MiniStatGrid";
import { ProvenanceLine } from "../../../shared/uikit/ProvenanceLine";
import { Skeleton } from "../../../shared/uikit/Skeleton";
import { StatTile } from "../../../shared/uikit/StatTile";
import { AutoTable } from "../../../shared/uikit/Table";
import type { SortState, TableColumn, TableDensity } from "../../../shared/uikit/Table";
import { Tabs } from "../../../shared/uikit/Tabs";
import type { TabData } from "../../../shared/uikit/Tabs";
import { STRINGS } from "../../../shared/uikit/_fixtures";
import { i18n } from "../../../shared/uikit/_i18n";
import { PUBLIC_STATS, toPlayerCompactRow } from "../_fixtures";
import { PublicStatsSurfaceHarness } from "../_harness";
import type { PublicStatsHarnessState, PublicStatsLang } from "../_harness";
import type { PublicStatsVolumeKind } from "../_fixtures";
import type {
  PublicStatsFreshness,
  PublicStatsProfile,
  PublicStatsProfileReplay,
} from "../_fixtures/publicStats";

export type PlayerProfileTab = "rotation" | "bounty" | "history" | "replays";

export type PlayerProfilePanel = {
  readonly tab: PlayerProfileTab;
  readonly content: ReactNode;
};

export type PlayerProfileMode = "ready" | "loading";

export type PlayerProfileProps = {
  className?: string;
  readonly lang?: PublicStatsLang;
  readonly state?: PublicStatsHarnessState;
  readonly profile?: PublicStatsProfile;
  readonly mode?: PlayerProfileMode;
  readonly activeTab?: PlayerProfileTab;
  readonly volume?: PublicStatsVolumeKind;
};

const PROFILE_VISIBLE_ROWS = 4;
const MOBILE_TOP_N = 3;
const SORT: SortState = { key: "score", direction: "descending" };
const PROFILE_STATUS = { ru: "Активен", en: "Active" } as const;

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

function freshnessState(
  state: PublicStatsFreshness,
): "up-to-date" | "stale" | "offline" | "reconnecting" {
  switch (state) {
    case "upToDate":
      return "up-to-date";
    case "stale":
      return "stale";
    case "offline":
      return "offline";
    case "reconnecting":
      return "reconnecting";
  }
}

function freshnessLabel(lang: PublicStatsLang, state: PublicStatsFreshness): string {
  if (state === "upToDate") return t(lang, "freshnessUpToDate");
  if (state === "stale") return t(lang, "freshnessStale");
  if (state === "offline") return t(lang, "freshnessOffline");
  return t(lang, "freshnessReconnecting");
}

function profileTabs(lang: PublicStatsLang): readonly TabData[] {
  return [
    { value: "rotation", label: t(lang, "publicStatsProfileTabRotation") },
    { value: "bounty", label: t(lang, "publicStatsProfileTabBounty") },
    { value: "history", label: t(lang, "publicStatsProfileTabHistory") },
    { value: "replays", label: t(lang, "publicStatsProfileTabReplays") },
  ];
}

function profileStats(lang: PublicStatsLang, profile: PublicStatsProfile): readonly MiniStat[] {
  const player = profile.player;
  return [
    { key: "games", label: t(lang, "statGames"), value: String(player.games) },
    { key: "kills", label: t(lang, "statKills"), value: String(player.kills) },
    { key: "tk", label: t(lang, "statTk"), value: String(player.tk) },
    { key: "deaths", label: t(lang, "statDeaths"), value: String(player.deaths) },
    { key: "deathsTk", label: t(lang, "statDeathsTk"), value: String(player.deathsTk) },
    { key: "bounty", label: t(lang, "statBounty"), value: String(player.bounty) },
  ];
}

function replayColumns(lang: PublicStatsLang): readonly TableColumn[] {
  return [
    { key: "replay", label: t(lang, "publicStatsProfileTabReplays"), width: 260 },
    { key: "score", label: t(lang, "statScore"), width: 132, numeric: true, sortable: true },
  ];
}

function sortLabels(lang: PublicStatsLang): Readonly<Record<string, string>> {
  return {
    score: t(lang, "statScore"),
  };
}

function replayRow(replay: PublicStatsProfileReplay, density: TableDensity): ReactNode {
  const rowHeight = density === "comfortable" ? 52 : 44;
  return (
    <tr
      key={`${density}-${replay.id}`}
      className="[&>td]:border-b [&>td]:border-border-1 last:[&>td]:border-b-0"
      style={{ height: `${rowHeight}px` }}
      data-profile-replay-row={replay.id}
    >
      <td className="overflow-hidden px-3 align-middle">
        <span className="block truncate font-body text-sm font-semibold text-text-primary">
          {replay.label}
        </span>
      </td>
      <td className="px-3 text-right align-middle font-mono text-sm tabular-nums text-text-primary">
        {replay.score.toFixed(2)}
      </td>
    </tr>
  );
}

function Identity({
  lang,
  profile,
  loading,
}: {
  readonly lang: PublicStatsLang;
  readonly profile: PublicStatsProfile;
  readonly loading: boolean;
}): ReactNode {
  if (loading) {
    return (
      <section
        className="grid min-h-44 gap-3 rounded-md border border-border-1 bg-surface-1 p-4"
        data-profile-identity
        aria-busy
      >
        <Skeleton variant="text" line="lg" widthClassName="w-32" />
        <Skeleton variant="text" widthClassName="w-56" />
        <Skeleton variant="text" widthClassName="w-40" />
      </section>
    );
  }

  const label = freshnessLabel(lang, profile.provenance.freshness);

  return (
    <section
      className="grid min-h-44 gap-3 rounded-md border border-border-1 bg-surface-1 p-4 @3xl:grid-cols-12"
      data-profile-identity
    >
      <div className="min-w-0 @3xl:col-span-7">
        <p className="font-mono text-xs font-semibold uppercase tracking-caps text-text-muted">
          #{profile.player.rank}
        </p>
        <h1 className="truncate font-display text-xl font-semibold tracking-tight text-text-primary">
          {profile.player.name}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2 font-body text-sm text-text-muted">
          <span>{profile.currentSquad ?? "—"}</span>
          <span aria-hidden>·</span>
          <span>{PROFILE_STATUS[lang]}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <div data-profile-freshness>
            <FreshnessPill state={freshnessState(profile.provenance.freshness)} label={label} />
          </div>
          <div data-profile-provenance>
            <ProvenanceLine
              replayCount={profile.provenance.replayCount}
              freshnessLabel={label}
              template={t(lang, "publicStatsProvenance", {
                n: profile.provenance.replayCount,
                freshness: label,
              })}
              locale={lang}
              linkLabel={lang === "ru" ? "Как считается" : "How it's computed"}
            />
          </div>
        </div>
      </div>
      <div className="flex items-start @3xl:col-span-5 @3xl:justify-end">
        <Link
          href={profile.player.href}
          variant="secondary"
          justify="start"
          aria-label={t(lang, "publicStatsSgProfile")}
          data-profile-sg-link
        >
          <ExternalLink className="size-4" aria-hidden />
          {t(lang, "publicStatsSgProfile")}
        </Link>
      </div>
    </section>
  );
}

function Hero({
  lang,
  profile,
  loading,
}: {
  readonly lang: PublicStatsLang;
  readonly profile: PublicStatsProfile;
  readonly loading: boolean;
}): ReactNode {
  if (loading) {
    return (
      <section className="grid gap-3 @lg:grid-cols-2" data-profile-hero-grid aria-busy>
        <Skeleton variant="tile" withDelta />
        <Skeleton variant="tile" withDelta />
      </section>
    );
  }

  return (
    <section className="grid gap-3 @lg:grid-cols-2" data-profile-hero-grid>
      <div data-profile-hero="score">
        <StatTile
          label={t(lang, "statScore")}
          value={profile.player.score.toFixed(2)}
          delta={{ sign: "up", text: "+0.42" }}
        />
      </div>
      <div data-profile-hero="kd">
        <StatTile
          label={t(lang, "statKd")}
          value={profile.player.kd.toFixed(2)}
          delta={{ sign: "up", text: "+0.18" }}
        />
      </div>
    </section>
  );
}

function NickHistory({
  lang,
  profile,
}: {
  readonly lang: PublicStatsLang;
  readonly profile: PublicStatsProfile;
}): ReactNode {
  const caption = withCount(t(lang, "publicStatsNickHistoryCaption"), profile.nickHistory.length);
  return (
    <section className="grid gap-2 rounded-md border border-border-1 bg-surface-1 p-3">
      <div className="flex items-center gap-2">
        <History className="size-4 text-info" aria-hidden />
        <h2 className="font-display text-xl font-semibold text-text-primary">{caption}</h2>
      </div>
      {profile.nickHistory.length === 0 ? (
        <p className="font-body text-sm text-text-muted">{t(lang, "publicStatsEmptyHeading")}</p>
      ) : (
        <ol className="grid gap-2">
          {profile.nickHistory.map((nick) => (
            <li
              key={nick}
              className="rounded-sm border border-border-1 bg-surface-2 px-3 py-2 font-body text-sm text-text-primary"
            >
              {nick}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function EmptyPanel({ lang }: { readonly lang: PublicStatsLang }): ReactNode {
  return (
    <div className="flex flex-col justify-center gap-2 rounded-md border border-border-1 bg-surface-1 p-4">
      <h2 className="font-display text-xl font-semibold text-text-primary">
        {t(lang, "publicStatsEmptyHeading")}
      </h2>
      <p className="font-body text-sm text-text-muted">{t(lang, "publicStatsEmptyBody")}</p>
    </div>
  );
}

function RotationPanel({
  lang,
  profile,
}: {
  readonly lang: PublicStatsLang;
  readonly profile: PublicStatsProfile;
}): ReactNode {
  return (
    <div className="grid gap-3">
      <p className="font-body text-sm text-text-muted">{t(lang, "tabsPanelOverview")}</p>
      <CompactList
        className="@5xl:hidden"
        rows={[toPlayerCompactRow(profile.player)]}
        topN={1}
        metricLabels={{ score: t(lang, "statScore"), kd: t(lang, "statKd") }}
        showMoreLabel={withCount(t(lang, "publicStatsShowMore"), 0)}
        caption={t(lang, "publicStatsPeriodRotation")}
        expandable={false}
      />
      <MiniStatGrid
        className="hidden @5xl:block"
        stats={profileStats(lang, profile)}
        emptyLabel={t(lang, "statEmpty")}
      />
    </div>
  );
}

function BountyPanel({
  lang,
  profile,
}: {
  readonly lang: PublicStatsLang;
  readonly profile: PublicStatsProfile;
}): ReactNode {
  return (
    <div className="grid gap-3 rounded-md border border-border-1 bg-surface-1 p-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-4 text-info" aria-hidden />
        <h2 className="font-display text-xl font-semibold text-text-primary">
          {t(lang, "statBounty")}
        </h2>
      </div>
      <p className="font-body text-sm text-text-muted">{t(lang, "publicStatsBountyExplanation")}</p>
      <p className="font-mono text-xl font-semibold tabular-nums text-text-primary">
        {profile.player.bounty}
      </p>
    </div>
  );
}

function HistoryPanel({
  lang,
  profile,
}: {
  readonly lang: PublicStatsLang;
  readonly profile: PublicStatsProfile;
}): ReactNode {
  return profile.nickHistory.length === 0 ? (
    <EmptyPanel lang={lang} />
  ) : (
    <NickHistory lang={lang} profile={profile} />
  );
}

function ReplaysPanel({
  lang,
  profile,
}: {
  readonly lang: PublicStatsLang;
  readonly profile: PublicStatsProfile;
}): ReactNode {
  const caption = withCount(t(lang, "publicStatsReplaysCaption"), profile.replays.totalCount);
  const remaining = Math.max(profile.replays.totalCount - MOBILE_TOP_N, 0);

  if (profile.replays.rows.length === 0) return <EmptyPanel lang={lang} />;

  return (
    <section className="grid gap-3" data-profile-replays>
      <CompactList
        className="@5xl:hidden"
        rows={profile.replays.rows.map((replay, index) => ({
          rank: index + 1,
          name: replay.label,
          squad: replay.id,
          href: "#",
          score: {
            metric: "score",
            value: replay.score.toFixed(2),
            level: "good",
          },
          kd: {
            metric: "kd",
            value: profile.player.kd.toFixed(2),
            level: "good",
          },
        }))}
        topN={MOBILE_TOP_N}
        metricLabels={{ score: t(lang, "statScore"), kd: t(lang, "statKd") }}
        showMoreLabel={withCount(t(lang, "publicStatsShowMore"), remaining)}
        caption={caption}
      />
      <AutoTable
        className="hidden @5xl:block"
        columns={replayColumns(lang)}
        caption={caption}
        sort={SORT}
        sortLabels={sortLabels(lang)}
        visibleRows={PROFILE_VISIBLE_ROWS}
        bottomSpacer={profile.replays.totalCount > profile.replays.rows.length ? 260 : 0}
        rows={(density) => profile.replays.rows.map((row) => replayRow(row, density))}
      />
    </section>
  );
}

function TabPanels({
  lang,
  profile,
  activeTab,
  loading,
}: {
  readonly lang: PublicStatsLang;
  readonly profile: PublicStatsProfile;
  readonly activeTab: PlayerProfileTab;
  readonly loading: boolean;
}): ReactNode {
  if (loading) {
    return (
      <section
        className="grid min-h-80 gap-3 overflow-hidden rounded-md border border-border-1 bg-surface-1 p-4"
        data-profile-tabs
        aria-busy
      >
        <Skeleton variant="text" widthClassName="w-40" />
        <Skeleton variant="table" columns={[260, 132]} rows={PROFILE_VISIBLE_ROWS} />
      </section>
    );
  }

  const panels: Readonly<Record<PlayerProfileTab, ReactNode>> = {
    rotation: <RotationPanel lang={lang} profile={profile} />,
    bounty: <BountyPanel lang={lang} profile={profile} />,
    history: <HistoryPanel lang={lang} profile={profile} />,
    replays: <ReplaysPanel lang={lang} profile={profile} />,
  };

  return (
    <section
      className="min-h-80 overflow-hidden rounded-md border border-border-1 bg-surface-1 p-4"
      data-profile-tabs
    >
      <Tabs
        className="min-w-0 overflow-x-auto"
        tabs={profileTabs(lang)}
        panels={panels}
        defaultValue={activeTab}
      />
    </section>
  );
}

function PlayerProfileContent({
  lang,
  profile,
  mode,
  activeTab,
}: {
  readonly lang: PublicStatsLang;
  readonly profile: PublicStatsProfile;
  readonly mode: PlayerProfileMode;
  readonly activeTab: PlayerProfileTab;
}): ReactNode {
  const loading = mode === "loading";
  return (
    <article className="@container grid gap-4" data-player-profile>
      <Identity lang={lang} profile={profile} loading={loading} />
      <section className="grid gap-3 @5xl:grid-cols-12" data-profile-data-band>
        <div className="@5xl:col-span-5">
          <Hero lang={lang} profile={profile} loading={loading} />
        </div>
        {loading ? (
          <div
            className="min-h-32 rounded-md border border-border-1 bg-surface-1 p-4 @5xl:col-span-7"
            aria-busy
          >
            <Skeleton variant="text" widthClassName="w-48" />
          </div>
        ) : (
          <MiniStatGrid
            className="@5xl:col-span-7"
            stats={profileStats(lang, profile)}
            emptyLabel={t(lang, "statEmpty")}
          />
        )}
      </section>
      <TabPanels lang={lang} profile={profile} activeTab={activeTab} loading={loading} />
    </article>
  );
}

export function PlayerProfile({
  className,
  lang = "en",
  state = "success",
  profile = PUBLIC_STATS.profile,
  mode = "ready",
  activeTab = "rotation",
}: PlayerProfileProps): ReactNode {
  return (
    <div className={className} data-player-profile-frame>
      <PublicStatsSurfaceHarness
        lang={lang}
        activeKey="players"
        state={state}
        provenance={profile.provenance}
        showHeaderTrust={false}
        title={t(lang, "publicStatsProfileTitle")}
      >
        <PlayerProfileContent lang={lang} profile={profile} mode={mode} activeTab={activeTab} />
      </PublicStatsSurfaceHarness>
    </div>
  );
}
