import type { CompactRowData } from "../../../shared/uikit/CompactRow";
import type { TierCell } from "../../../shared/uikit/Table";
import {
  OVERVIEW_PLAYERS,
  ROSTER,
  kdOf,
  scoreOf,
} from "../../../shared/uikit/_fixtures/roster";
import type { Player } from "../../../shared/uikit/_fixtures/roster";
import { SS_BASELINE, tierFor } from "../../../shared/uikit/_fixtures/tiers";
import type { Tier, TierMetric, TierPeriod } from "../../../shared/uikit/_fixtures/tiers";

export type PublicStatsPeriod = {
  readonly key: TierPeriod;
  readonly labelKey: "publicStatsPeriodRotation" | "publicStatsPeriodAllTime";
  readonly cacheState: "instant" | "warm" | "cold" | "inSession";
};

export type PublicStatsFreshness = "upToDate" | "stale" | "offline" | "reconnecting";
export type PublicStatsTrust = "known" | "unknown" | "conflict";
export type PublicStatsVolumeKind = "empty" | "few" | "many" | "limitReached";

export type PublicStatsTierCell = TierCell & {
  readonly pips: number;
  readonly threshold: number;
};

export type PublicStatsPlayer = {
  readonly id: string;
  readonly rank: number;
  readonly name: string;
  readonly squad: string | null;
  readonly href: string;
  readonly raw: Player;
  readonly games: number;
  readonly kills: number;
  readonly tk: number;
  readonly deaths: number;
  readonly deathsTk: number;
  readonly bounty: number;
  readonly score: number;
  readonly kd: number;
  readonly spark: readonly number[];
  readonly freshness: PublicStatsFreshness;
  readonly trust: PublicStatsTrust;
  readonly tiers: Readonly<Record<TierPeriod, Readonly<Record<TierMetric, Tier>>>>;
};

export type PublicStatsProvenance = {
  readonly replayCount: number;
  readonly freshness: PublicStatsFreshness;
  readonly trust: PublicStatsTrust;
  readonly computedHref: string;
};

export type PublicStatsOverview = {
  readonly titleKey: "publicStatsOverviewTitle";
  readonly topPlayers: readonly PublicStatsPlayer[];
  readonly totalPlayers: number;
  readonly provenance: PublicStatsProvenance;
};

export type PublicStatsPlayers = {
  readonly titleKey: "publicStatsPlayersTitle";
  readonly rows: readonly PublicStatsPlayer[];
  readonly totalCount: number;
  readonly period: TierPeriod;
  readonly provenance: PublicStatsProvenance;
};

export type PublicStatsProfileReplay = {
  readonly id: string;
  readonly label: string;
  readonly score: number;
};

export type PublicStatsProfile = {
  readonly titleKey: "publicStatsProfileTitle";
  readonly player: PublicStatsPlayer;
  readonly currentSquad: string | null;
  readonly nickHistory: readonly string[];
  readonly replays: {
    readonly rows: readonly PublicStatsProfileReplay[];
    readonly totalCount: number;
  };
  readonly provenance: PublicStatsProvenance;
};

export type PublicStatsFixture = {
  readonly overview: PublicStatsOverview;
  readonly players: PublicStatsPlayers;
  readonly profile: PublicStatsProfile;
};

export type PublicStatsVolumes = Readonly<
  Record<
    "overview" | "players" | "profile",
    Readonly<Record<PublicStatsVolumeKind, PublicStatsOverview | PublicStatsPlayers | PublicStatsProfile>>
  >
>;

export type PublicStatsCompactRow = CompactRowData & {
  readonly id: string;
  readonly title: string;
  readonly metrics: readonly [
    { readonly key: "score"; readonly value: string; readonly tier: PublicStatsTierCell },
    { readonly key: "kd"; readonly value: string; readonly tier: PublicStatsTierCell },
  ];
};

export const PUBLIC_STATS_PERIODS: readonly PublicStatsPeriod[] = [
  { key: "rotation", labelKey: "publicStatsPeriodRotation", cacheState: "instant" },
  { key: "alltime", labelKey: "publicStatsPeriodAllTime", cacheState: "warm" },
];

const PUBLIC_STATS_REPLAY_COUNT = 1342;
const ALLTIME_TOTAL = 2040;
const LIMIT_REPLAY_TOTAL = 86;

function playerId(name: string): string {
  return name.toLowerCase().replaceAll(/[^a-zа-я0-9]+/giu, "-").replace(/^-|-$/gu, "");
}

export function toTierCell(
  metric: TierMetric,
  value: number,
  period: TierPeriod = "rotation",
): PublicStatsTierCell {
  const tier = tierFor(metric, value, SS_BASELINE, period);
  return {
    metric,
    value: value.toFixed(2),
    level: tier.level,
    pips: tier.pips,
    threshold: tier.threshold,
  };
}

function toPublicStatsPlayer(player: Player, index: number): PublicStatsPlayer {
  const id = playerId(player.name);
  return {
    id,
    rank: index + 1,
    name: player.name,
    squad: player.squad,
    href: `https://sg.zone/profile/${encodeURIComponent(player.name)}`,
    raw: player,
    games: player.games,
    kills: player.kills,
    tk: player.tk,
    deaths: player.deaths,
    deathsTk: player.deathsTk,
    bounty: player.bounty,
    score: player.score,
    kd: player.kd,
    spark: player.spark,
    freshness: player.synced ? "upToDate" : "stale",
    trust: player.outcome === "unknown" ? "unknown" : "known",
    tiers: {
      rotation: {
        score: tierFor("score", player.score, SS_BASELINE, "rotation"),
        kd: tierFor("kd", player.kd, SS_BASELINE, "rotation"),
      },
      alltime: {
        score: tierFor("score", player.score, SS_BASELINE, "alltime"),
        kd: tierFor("kd", player.kd, SS_BASELINE, "alltime"),
      },
    },
  };
}

const playersRows = ROSTER.map(toPublicStatsPlayer);
const overviewRows = OVERVIEW_PLAYERS.map((player) => {
  const canonicalIndex = ROSTER.findIndex((row) => row.name === player.name);
  return toPublicStatsPlayer(player, canonicalIndex);
});
const vasiliy = playersRows[0] ?? toPublicStatsPlayer(ROSTER[0], 0);

const provenance: PublicStatsProvenance = {
  replayCount: PUBLIC_STATS_REPLAY_COUNT,
  freshness: "upToDate",
  trust: "known",
  computedHref: "https://sg.zone/stats/how-computed",
};

const profileReplays: readonly PublicStatsProfileReplay[] = [
  { id: "sg-2026-06-28-001", label: "Operation Northwind", score: 4.13 },
  { id: "sg-2026-06-21-014", label: "Altis push", score: 3.92 },
  { id: "sg-2026-06-14-037", label: "Kavala defense", score: 4.28 },
  { id: "sg-2026-06-07-022", label: "Airfield hold", score: 3.77 },
];

export const PUBLIC_STATS: PublicStatsFixture = {
  overview: {
    titleKey: "publicStatsOverviewTitle",
    topPlayers: overviewRows,
    totalPlayers: ROSTER.length,
    provenance,
  },
  players: {
    titleKey: "publicStatsPlayersTitle",
    rows: playersRows,
    totalCount: ROSTER.length,
    period: "rotation",
    provenance,
  },
  profile: {
    titleKey: "publicStatsProfileTitle",
    player: vasiliy,
    currentSquad: vasiliy.squad,
    nickHistory: ["Vasiliy", "Vasiliy_7th", "VasiliySG"],
    replays: {
      rows: profileReplays,
      totalCount: profileReplays.length,
    },
    provenance,
  },
};

function overviewVolume(kind: PublicStatsVolumeKind): PublicStatsOverview {
  if (kind === "empty") {
    return { ...PUBLIC_STATS.overview, topPlayers: [], totalPlayers: 0 };
  }
  if (kind === "few") {
    return { ...PUBLIC_STATS.overview, topPlayers: overviewRows.slice(0, 3), totalPlayers: 3 };
  }
  if (kind === "many") {
    return { ...PUBLIC_STATS.overview, topPlayers: overviewRows, totalPlayers: ROSTER.length };
  }
  return { ...PUBLIC_STATS.overview, topPlayers: overviewRows, totalPlayers: ALLTIME_TOTAL };
}

function playersVolume(kind: PublicStatsVolumeKind): PublicStatsPlayers {
  if (kind === "empty") {
    return { ...PUBLIC_STATS.players, rows: [], totalCount: 0 };
  }
  if (kind === "few") {
    return { ...PUBLIC_STATS.players, rows: playersRows.slice(0, 4), totalCount: 4 };
  }
  if (kind === "many") {
    return { ...PUBLIC_STATS.players, rows: playersRows.slice(0, 20), totalCount: ROSTER.length };
  }
  return { ...PUBLIC_STATS.players, rows: playersRows.slice(0, 20), totalCount: ALLTIME_TOTAL };
}

function profileVolume(kind: PublicStatsVolumeKind): PublicStatsProfile {
  if (kind === "empty") {
    return {
      ...PUBLIC_STATS.profile,
      nickHistory: [],
      replays: { rows: [], totalCount: 0 },
    };
  }
  if (kind === "few") {
    return {
      ...PUBLIC_STATS.profile,
      nickHistory: PUBLIC_STATS.profile.nickHistory.slice(0, 1),
      replays: { rows: profileReplays.slice(0, 2), totalCount: 2 },
    };
  }
  if (kind === "many") {
    return {
      ...PUBLIC_STATS.profile,
      nickHistory: PUBLIC_STATS.profile.nickHistory,
      replays: { rows: profileReplays, totalCount: profileReplays.length },
    };
  }
  return {
    ...PUBLIC_STATS.profile,
    nickHistory: PUBLIC_STATS.profile.nickHistory,
    replays: { rows: profileReplays, totalCount: LIMIT_REPLAY_TOTAL },
  };
}

export const PUBLIC_STATS_VOLUMES = {
  overview: {
    empty: overviewVolume("empty"),
    few: overviewVolume("few"),
    many: overviewVolume("many"),
    limitReached: overviewVolume("limitReached"),
  },
  players: {
    empty: playersVolume("empty"),
    few: playersVolume("few"),
    many: playersVolume("many"),
    limitReached: playersVolume("limitReached"),
  },
  profile: {
    empty: profileVolume("empty"),
    few: profileVolume("few"),
    many: profileVolume("many"),
    limitReached: profileVolume("limitReached"),
  },
} as const;

export function toPlayerCompactRow(player: PublicStatsPlayer): PublicStatsCompactRow {
  return {
    id: player.id,
    title: player.name,
    metrics: [
      { key: "score", value: player.score.toFixed(2), tier: toTierCell("score", player.score) },
      { key: "kd", value: player.kd.toFixed(2), tier: toTierCell("kd", player.kd) },
    ],
    rank: player.rank,
    name: player.name,
    squad: player.squad,
    href: player.href,
    score: toTierCell("score", player.score),
    kd: toTierCell("kd", player.kd),
  };
}
