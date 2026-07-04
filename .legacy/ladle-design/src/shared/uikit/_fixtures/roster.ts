// The single canonical roster (D-06) — the one source every stat/table/tier story
// imports so Score/K-D and tiers stay consistent across tiles, tables, and chips
// ("Vasiliy #1 everywhere", QUAL-06).
//
// Head: the 10 Overview players VERBATIM (same nick/squad/kills/games/tk/deathsTk/
// spark), augmented with a `deaths` field so K/D can be shown. Tail: a
// deterministic, seeded generated long tail descending to NEGATIVE Score (more
// teamkills than kills), with deaths scaling with games — no generated player
// outscores a real Overview leader. Rebuilt natively from the frozen hi-fi
// `data-overview.js` + `data-players.js` semantics (D-11 — never imported).
//
// Score = (kills − TK) ÷ (games + deaths-from-TK)
// K/D   = (kills − TK) ÷ (deaths + deaths-from-TK)

/** Match outcome of a player's most recent tracked game (Overview vocabulary). */
export type Outcome = "win" | "loss" | "unknown";

/** A roster player — the raw counters plus the derived Score / K-D. */
export type Player = {
  readonly name: string;
  readonly squad: string | null;
  readonly kills: number;
  readonly games: number;
  /** Teamkills (TK). */
  readonly tk: number;
  readonly deaths: number;
  /** Deaths-from-teamkill (dftk) — the formula denominator term. */
  readonly deathsTk: number;
  readonly bounty: number;
  readonly outcome: Outcome;
  /** Last 4 weekly scores for the inline Sparkline trend. */
  readonly spark: readonly number[];
  /** Derived Score = (kills − TK) ÷ (games + dftk). */
  readonly score: number;
  /** Derived K/D = (kills − TK) ÷ (deaths + dftk). */
  readonly kd: number;
  /** True for the 10 verbatim Overview players. */
  readonly synced: boolean;
};

/** Raw counters needed to derive Score. */
type ScoreInput = Pick<Player, "kills" | "games" | "tk" | "deathsTk">;
/** Raw counters needed to derive K/D. */
type KdInput = Pick<Player, "kills" | "deaths" | "tk" | "deathsTk">;

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Score = (kills − TK) ÷ (games + deaths-from-TK). `games ≥ 1` keeps it finite. */
export function scoreOf(p: ScoreInput): number {
  return round2((p.kills - p.tk) / (p.games + p.deathsTk));
}

/** K/D = (kills − TK) ÷ (deaths + deaths-from-TK), denominator floored at 1. */
export function kdOf(p: KdInput): number {
  return round2((p.kills - p.tk) / Math.max(p.deaths + p.deathsTk, 1));
}

// ----- the 10 Overview players, verbatim (sorted by Score desc; Vasiliy #1) -----
// (kills, games, tk, deathsTk, bounty, outcome, spark) are the Overview values;
// `deaths` is the K/D augmentation from data-players.js OV_DEATHS.
type Seed = Omit<Player, "score" | "kd" | "synced">;

const OVERVIEW_SEED: readonly Seed[] = [
  {
    name: "Vasiliy",
    squad: "7th",
    kills: 96,
    games: 22,
    tk: 1,
    deaths: 27,
    deathsTk: 1,
    bounty: 14208,
    outcome: "win",
    spark: [3.1, 4.6, 3.8, 4.2],
  },
  {
    name: "Strelok",
    squad: "inTeam",
    kills: 74,
    games: 20,
    tk: 0,
    deaths: 24,
    deathsTk: 1,
    bounty: 12940,
    outcome: "win",
    spark: [2.4, 3.0, 4.1, 3.5],
  },
  {
    name: "Kobra",
    squad: "inTeam",
    kills: 80,
    games: 24,
    tk: 1,
    deaths: 31,
    deathsTk: 0,
    bounty: 8820,
    outcome: "win",
    spark: [3.6, 2.9, 3.0, 3.3],
  },
  {
    name: "Tundra",
    squad: "KSK",
    kills: 52,
    games: 18,
    tk: 0,
    deaths: 20,
    deathsTk: 0,
    bounty: 9100,
    outcome: "win",
    spark: [2.2, 3.4, 2.6, 2.9],
  },
  {
    name: "Медведь",
    squad: "Wagner",
    kills: 70,
    games: 26,
    tk: 2,
    deaths: 33,
    deathsTk: 1,
    bounty: 7995,
    outcome: "win",
    spark: [2.0, 2.8, 2.7, 2.5],
  },
  {
    name: "Ghost_9",
    squad: "7th",
    kills: 50,
    games: 21,
    tk: 1,
    deaths: 28,
    deathsTk: 1,
    bounty: 8110,
    outcome: "loss",
    spark: [1.6, 2.5, 2.4, 2.2],
  },
  {
    name: "Rikom",
    squad: "GROM",
    kills: 32,
    games: 16,
    tk: 0,
    deaths: 22,
    deathsTk: 0,
    bounty: 6600,
    outcome: "win",
    spark: [1.8, 2.1, 1.9, 2.0],
  },
  {
    name: "Sokol",
    squad: "DKK",
    kills: 33,
    games: 19,
    tk: 1,
    deaths: 29,
    deathsTk: 2,
    bounty: 7240,
    outcome: "loss",
    spark: [1.2, 1.8, 1.5, 1.5],
  },
  {
    name: "Viper",
    squad: "inTeam",
    kills: 30,
    games: 23,
    tk: 0,
    deaths: 31,
    deathsTk: 1,
    bounty: 6980,
    outcome: "win",
    spark: [1.0, 1.4, 1.2, 1.25],
  },
  {
    name: "Призрак",
    squad: null,
    kills: 14,
    games: 17,
    tk: 2,
    deaths: 25,
    deathsTk: 0,
    bounty: 9415,
    outcome: "unknown",
    spark: [0.9, 0.6, 0.8, 0.71],
  },
];

const withDerived = (s: Seed, synced: boolean): Player => ({
  ...s,
  score: scoreOf(s),
  kd: kdOf(s),
  synced,
});

const head: readonly Player[] = OVERVIEW_SEED.map((s) => withDerived(s, true)).sort(
  (a, b) => b.score - a.score,
);

// ----- deterministic generated long tail (seeded LCG, stable across runs) -----
// Rebuilt from data-players.js: ~2.5% net-negative (TK > kills) players, deaths
// scaling with games. A modest tail (enough to prove the consistency invariants:
// descends to negative Score, no tail player outscores a real leader).
const TAIL_SIZE = 40;
const SQUAD_TAGS: readonly string[] = [
  "7th",
  "inTeam",
  "KSK",
  "Wagner",
  "GROM",
  "DKK",
  "31st",
  "DD",
  "RAF",
  "SEAL",
];
const STEMS: readonly string[] = [
  "Sokol",
  "Volk",
  "Bear",
  "Reaper",
  "Shadow",
  "Snayper",
  "Orel",
  "Tigr",
  "Bars",
  "Sever",
  "Raptor",
  "Falcon",
  "Hawk",
  "Fox",
  "Lynx",
  "Puma",
  "Hunter",
  "Scout",
  "Berkut",
  "Zubr",
];

function makeTail(): readonly Player[] {
  let seed = 20260614;
  const rnd = (): number => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const ri = (a: number, b: number): number => a + Math.floor(rnd() * (b - a + 1));
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)] ?? arr[0]!;

  const used = new Set(head.map((p) => p.name.toLowerCase()));
  const mkName = (): string => {
    for (let tries = 0; tries < 60; tries++) {
      const n = `${pick(STEMS)}${ri(2, 499)}`;
      if (!used.has(n.toLowerCase())) {
        used.add(n.toLowerCase());
        return n;
      }
    }
    const fallback = `${pick(STEMS)}_${ri(1000, 99999)}`;
    used.add(fallback.toLowerCase());
    return fallback;
  };

  // Ceiling: the whole generated tail sits strictly below the lowest real
  // Overview player, so no generated player ever outscores a real leader.
  const headFloor = Math.min(...head.map((p) => p.score));

  const out: Player[] = [];
  for (let i = 0; i < TAIL_SIZE; i++) {
    const games = ri(4, 60);
    const isNetNegative = rnd() < 0.1;
    let kills: number;
    let tk: number;
    const deathsTk = rnd() < 0.4 ? 1 : 0;
    if (isNetNegative) {
      kills = ri(0, 3);
      tk = kills + ri(1, 5); // more TK than kills → negative Score
    } else {
      tk = ri(0, 2);
      // Clamp net kills so score = (kills−tk)/(games+deathsTk) stays below
      // headFloor — keeps the tail under the real roster (QUAL-06).
      const maxNet = Math.max(Math.floor(headFloor * (games + deathsTk)) - 1, 0);
      const net = ri(0, Math.min(maxNet, 30));
      kills = net + tk;
    }
    const deaths = Math.round(games * 1.3) + ri(0, 6); // deaths scale with games
    const squad = rnd() < 0.12 ? null : pick(SQUAD_TAGS);
    const seedRow: Seed = {
      name: mkName(),
      squad,
      kills,
      games,
      tk,
      deaths,
      deathsTk,
      bounty: ri(200, 6000),
      outcome: isNetNegative ? "loss" : pick<Outcome>(["win", "loss", "unknown"]),
      spark: [round2(rnd()), round2(rnd()), round2(rnd()), round2(rnd())],
    };
    out.push(withDerived(seedRow, false));
  }
  return out.sort((a, b) => b.score - a.score);
}

/**
 * The canonical roster: 10 verbatim Overview players (head, Vasiliy #1) followed
 * by a deterministic generated tail. Sorted by Score descending overall.
 */
export const ROSTER: readonly Player[] = [...head, ...makeTail()];

/** The 10 verbatim Overview players (head), for the "synced top == Overview" proof. */
export const OVERVIEW_PLAYERS: readonly Player[] = head;
