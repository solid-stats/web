// Phase 04 D-03/D-04 fixture contract: Overview, Players, and Profile must read
// one canonical graph so formulas, ranks, tiers, data volumes, and copy cannot drift.
import { describe, expect, test } from "vitest";

import { STRINGS } from "../../../shared/uikit/_fixtures";
import { kdOf, scoreOf } from "../../../shared/uikit/_fixtures/roster";
import { SS_BASELINE, tierFor } from "../../../shared/uikit/_fixtures/tiers";
import {
  PUBLIC_STATS,
  PUBLIC_STATS_PERIODS,
  PUBLIC_STATS_VOLUMES,
  toPlayerCompactRow,
  toTierCell,
} from "./index";

import type { TierMetric, TierPeriod } from "../../../shared/uikit/_fixtures/tiers";
import type { PublicStatsPlayer } from "./index";

const PUBLIC_STATS_STRING_KEYS = [
  "publicStatsOverviewTitle",
  "publicStatsPlayersTitle",
  "publicStatsProfileTitle",
  "publicStatsAllPlayersCta",
  "publicStatsOpenProfile",
  "publicStatsSgProfile",
  "publicStatsPeriodLabel",
  "publicStatsPeriodRotation",
  "publicStatsPeriodAllTime",
  "publicStatsLoadingInSession",
  "publicStatsEmptyHeading",
  "publicStatsEmptyBody",
  "publicStatsSystemError",
  "publicStatsSearchEmptyHeading",
  "publicStatsSearchEmptyBody",
  "publicStatsShowMore",
  "publicStatsPlayersCaption",
  "publicStatsNickHistoryCaption",
  "publicStatsReplaysCaption",
  "publicStatsProvenance",
  "publicStatsTrustKnown",
  "publicStatsTrustUnknown",
  "publicStatsTrustConflict",
  "publicStatsProfileTabRotation",
  "publicStatsProfileTabBounty",
  "publicStatsProfileTabHistory",
  "publicStatsProfileTabReplays",
] as const;

const VOLUME_KINDS = ["empty", "few", "many", "limitReached"] as const;

function expectTopPlayer(player: PublicStatsPlayer | undefined, context: string): void {
  expect(player?.name, `${context} keeps Vasiliy as #1`).toBe("Vasiliy");
  expect(player?.rank, `${context} exposes rank #1`).toBe(1);
}

function expectFormulaDerived(player: PublicStatsPlayer): void {
  expect(player.score, `${player.name} score follows D-03`).toBe(scoreOf(player.raw));
  expect(player.kd, `${player.name} K/D follows D-03`).toBe(kdOf(player.raw));
}

function expectTierDerived(
  player: PublicStatsPlayer,
  metric: TierMetric,
  period: TierPeriod,
): void {
  const expected = tierFor(metric, player[metric], SS_BASELINE, period);
  const actual = player.tiers[period][metric];
  expect(actual, `${player.name} ${period} ${metric} tier follows D-04`).toEqual(expected);
  expect(toTierCell(metric, player[metric], period)).toEqual({
    metric,
    value: player[metric].toFixed(2),
    level: expected.level,
    pips: expected.pips,
    threshold: expected.threshold,
  });
}

describe("public-stats canonical fixture graph", () => {
  test("keeps Vasiliy rank #1 in overview, players list, and profile context", () => {
    expectTopPlayer(PUBLIC_STATS.overview.topPlayers[0], "overview");
    expectTopPlayer(PUBLIC_STATS.players.rows[0], "players list");
    expectTopPlayer(PUBLIC_STATS.profile.player, "profile");
  });

  test("recomputes every exported player Score and K/D from canonical helpers", () => {
    const players = new Map(PUBLIC_STATS.players.rows.map((player) => [player.name, player]));
    for (const player of PUBLIC_STATS.overview.topPlayers) players.set(player.name, player);
    players.set(PUBLIC_STATS.profile.player.name, PUBLIC_STATS.profile.player);

    for (const player of players.values()) {
      expectFormulaDerived(player);
    }
  });

  test("derives every score and K/D tier from SS_BASELINE for rotation and all-time", () => {
    for (const player of PUBLIC_STATS.players.rows) {
      for (const period of PUBLIC_STATS_PERIODS) {
        expectTierDerived(player, "score", period.key);
        expectTierDerived(player, "kd", period.key);
      }
    }
  });

  test("exports empty, few, many, and limit-reached volumes for every Phase 4 surface", () => {
    for (const surface of ["overview", "players", "profile"] as const) {
      expect(Object.keys(PUBLIC_STATS_VOLUMES[surface]).sort()).toEqual([...VOLUME_KINDS].sort());
    }
    expect(PUBLIC_STATS_VOLUMES.overview.empty.topPlayers).toHaveLength(0);
    expect(PUBLIC_STATS_VOLUMES.players.few.rows.length).toBeGreaterThanOrEqual(3);
    expect(PUBLIC_STATS_VOLUMES.players.few.rows.length).toBeLessThanOrEqual(5);
    expect(PUBLIC_STATS_VOLUMES.players.many.totalCount).toBeGreaterThan(
      PUBLIC_STATS_VOLUMES.players.many.rows.length,
    );
    expect(PUBLIC_STATS_VOLUMES.profile.limitReached.replays.totalCount).toBeGreaterThan(
      PUBLIC_STATS_VOLUMES.profile.limitReached.replays.rows.length,
    );
  });

  test("creates compact row data from the same player graph", () => {
    expect(toPlayerCompactRow(PUBLIC_STATS.profile.player)).toMatchObject({
      id: "vasiliy",
      title: "Vasiliy",
      metrics: expect.arrayContaining([
        expect.objectContaining({ key: "score" }),
        expect.objectContaining({ key: "kd" }),
      ]),
    });
  });
});

describe("public-stats RU + EN copy", () => {
  test.each(PUBLIC_STATS_STRING_KEYS)("%s resolves to non-empty RU and EN", (key) => {
    const entry = STRINGS[key];
    expect(entry?.ru, `STRINGS.${key}.ru`).toBeTruthy();
    expect(entry?.en, `STRINGS.${key}.en`).toBeTruthy();
  });
});
