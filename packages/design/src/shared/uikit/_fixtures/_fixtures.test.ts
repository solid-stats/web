// QUAL-06 consistency proofs for the single canonical fixture module: the Score/
// K-D formulas, the roster head == the 10 Overview players, Vasiliy #1, no
// generated tail player outscoring a real leader, and RU+EN parity of the copy
// map. Pure logic — no DOM render (the runner split: Vitest = logic).
import { describe, expect, test } from "vitest";

import { OVERVIEW_PLAYERS, ROSTER, STRINGS, kdOf, scoreOf } from "./index";

const round2 = (n: number): number => Math.round(n * 100) / 100;

describe("Score / K-D formulas", () => {
  // score = (kills − TK) / (games + dftk); kd = (kills − TK) / (deaths + dftk)
  test.each([
    { kills: 96, games: 22, tk: 1, deaths: 27, deathsTk: 1, score: 4.13, kd: 3.39 },
    { kills: 74, games: 20, tk: 0, deaths: 24, deathsTk: 1, score: 3.52, kd: 2.96 },
    { kills: 14, games: 17, tk: 2, deaths: 25, deathsTk: 0, score: 0.71, kd: 0.48 },
  ])("kills=$kills games=$games tk=$tk → score $score, kd $kd", (c) => {
    expect(scoreOf(c)).toBe(c.score);
    expect(kdOf(c)).toBe(c.kd);
  });

  test("net-negative player (TK > kills) yields a negative Score", () => {
    expect(scoreOf({ kills: 1, games: 10, tk: 4, deathsTk: 0 })).toBeLessThan(0);
  });
});

describe("canonical roster", () => {
  test("ROSTER[0] is Vasiliy (#1 everywhere)", () => {
    expect(ROSTER[0]?.name).toBe("Vasiliy");
  });

  test("the synced head is exactly the 10 Overview players", () => {
    const head = ROSTER.filter((p) => p.synced);
    expect(head).toHaveLength(10);
    expect(head).toEqual(OVERVIEW_PLAYERS);
    expect(new Set(head.map((p) => p.name))).toEqual(
      new Set([
        "Vasiliy",
        "Strelok",
        "Kobra",
        "Tundra",
        "Медведь",
        "Ghost_9",
        "Rikom",
        "Sokol",
        "Viper",
        "Призрак",
      ]),
    );
  });

  test("the head is sorted by Score descending", () => {
    const head = OVERVIEW_PLAYERS;
    for (let i = 1; i < head.length; i++) {
      expect(head[i - 1]!.score).toBeGreaterThanOrEqual(head[i]!.score);
    }
  });

  test("every derived score/kd matches the formulas (internal consistency)", () => {
    for (const p of ROSTER) {
      expect(p.score).toBe(scoreOf(p));
      expect(p.kd).toBe(kdOf(p));
    }
  });

  test("no generated tail player outscores any real Overview leader", () => {
    const maxRealScore = Math.max(...OVERVIEW_PLAYERS.map((p) => p.score));
    const tail = ROSTER.filter((p) => !p.synced);
    expect(tail.length).toBeGreaterThan(0);
    for (const p of tail) {
      expect(p.score).toBeLessThan(maxRealScore);
    }
  });

  test("the tail descends to a negative Score (more TK than kills)", () => {
    const minScore = Math.min(...ROSTER.map((p) => p.score));
    expect(minScore).toBeLessThan(0);
  });

  test("ROSTER overall is sorted by Score descending", () => {
    for (let i = 1; i < ROSTER.length; i++) {
      expect(round2(ROSTER[i - 1]!.score)).toBeGreaterThanOrEqual(round2(ROSTER[i]!.score));
    }
  });
});

describe("RU + EN string-map parity (QUAL-05)", () => {
  test.each(Object.keys(STRINGS))("'%s' has both ru and en", (key) => {
    const entry = STRINGS[key as keyof typeof STRINGS];
    expect(typeof entry.ru).toBe("string");
    expect(entry.ru.length).toBeGreaterThan(0);
    expect(typeof entry.en).toBe("string");
    expect(entry.en.length).toBeGreaterThan(0);
  });
});
