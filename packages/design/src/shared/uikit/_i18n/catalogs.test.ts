// KIT-08 pure-logic contract for the runtime i18n catalogs (vitest = pure logic only,
// node env, no DOM — @lingui/core is framework-agnostic so the instance resolves here;
// solidstats-frontend-react-tests runner split). Pins three guarantees so a later drift
// fails here instead of shipping:
//   1. RU/EN parity — every STRINGS key resolves to a non-empty message in BOTH maps.
//   2. Key-set identity — ru, en, and STRINGS carry exactly the same id set (no orphan).
//   3. RU plural via ICU — the `replayCount` exemplar resolves to THREE DISTINCT RU
//      forms for n=1/2/5 (one/few/many actually differ), never concatenation (Pitfall 6).
import { beforeAll, describe, expect, test } from "vitest";

import { STRINGS } from "../_fixtures/strings";
import { en, ru } from "./catalogs";
import { i18n } from "./i18n";

import type { StringKey } from "../_fixtures/strings";

const STRING_KEYS = Object.keys(STRINGS) as StringKey[];

describe("i18n catalogs derived from STRINGS", () => {
  test("every STRINGS key resolves to a non-empty RU and EN message (parity)", () => {
    for (const key of STRING_KEYS) {
      expect(ru[key], `ru[${key}] is defined`).toBeDefined();
      expect(en[key], `en[${key}] is defined`).toBeDefined();
      expect(ru[key].length, `ru[${key}] is non-empty`).toBeGreaterThan(0);
      expect(en[key].length, `en[${key}] is non-empty`).toBeGreaterThan(0);
    }
  });

  test("ru, en, and STRINGS carry exactly the same key set (no orphan key)", () => {
    const stringsKeys = STRING_KEYS.slice().sort();
    const ruKeys = Object.keys(ru).sort();
    const enKeys = Object.keys(en).sort();
    expect(ruKeys).toEqual(stringsKeys);
    expect(enKeys).toEqual(stringsKeys);
  });

  test("each catalog message equals its STRINGS source (no transform drift)", () => {
    for (const key of STRING_KEYS) {
      expect(ru[key]).toBe(STRINGS[key].ru);
      expect(en[key]).toBe(STRINGS[key].en);
    }
  });
});

describe("RU plural renders one/few/many via ICU (never concatenation)", () => {
  // The shared `i18n` singleton is mutated INSIDE beforeAll, not at describe-eval time: Vitest
  // evaluates every describe body eagerly during collection, so an `i18n.activate` in the body
  // would flip the active locale as a collection side effect (coupling this suite to any other
  // file that activates a different locale). beforeAll runs only when this suite executes, and
  // re-activates RU defensively so the assertion is independent of any prior render's locale.
  let one = "";
  let few = "";
  let many = "";

  beforeAll(() => {
    i18n.activate("ru");
    one = i18n._({ id: "replayCount", values: { n: 1 } });
    few = i18n._({ id: "replayCount", values: { n: 2 } });
    many = i18n._({ id: "replayCount", values: { n: 5 } });
  });

  test("n=1 / n=2 / n=5 produce three DISTINCT RU forms", () => {
    expect(new Set([one, few, many]).size, `distinct forms: ${one} | ${few} | ${many}`).toBe(3);
  });

  test("each RU form carries its CLDR stem and the interpolated count", () => {
    expect(one).toBe("1 реплей");
    expect(few).toBe("2 реплея");
    expect(many).toBe("5 реплеев");
  });
});
