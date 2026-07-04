// SURF-18 — pure-logic contract test for the AsyncBoundary state→primitive routing (Plan 03-07,
// Wave 7). Vitest = pure logic only, NO DOM render, NO RTL (solidstats-frontend-react-tests; the
// runner split — component/a11y/CLS behaviour is Playwright-against-Ladle, see cls.spec.ts +
// catalog.spec.ts). This pins the D-05 contract: each global-state `kind` maps to the right
// EXISTING Phase-2 primitive and the union is exhaustively covered — a drift (a kind routed to
// the wrong primitive, or a new kind left unmapped) fails HERE instead of shipping a blank state.
import { describe, expect, test } from "vitest";
import { ASYNC_PRIMITIVE, type AsyncKind } from "./AsyncBoundary";

describe("AsyncBoundary routing contract (SURF-18 / D-05)", () => {
  test("each kind routes to the right EXISTING Phase-2 primitive (no rebuild)", () => {
    // loading→Skeleton, empty→EmptyState, error→ErrorState; the three connection kinds all map
    // onto DataTrustBanner (its BannerKind already maps stale/offline/reconnecting); ready renders
    // the consumer's children. This IS the D-05 seam — the primitives are composed, never rebuilt.
    expect(ASYNC_PRIMITIVE).toStrictEqual({
      loading: "Skeleton",
      empty: "EmptyState",
      error: "ErrorState",
      offline: "DataTrustBanner",
      reconnecting: "DataTrustBanner",
      stale: "DataTrustBanner",
      ready: "children",
    });
  });

  test("the three connection kinds collapse onto the SAME primitive (DataTrustBanner.BannerKind)", () => {
    expect(ASYNC_PRIMITIVE.offline).toBe(ASYNC_PRIMITIVE.reconnecting);
    expect(ASYNC_PRIMITIVE.reconnecting).toBe(ASYNC_PRIMITIVE.stale);
    expect(ASYNC_PRIMITIVE.stale).toBe("DataTrustBanner");
  });

  test("the six named global states + ready are ALL covered (exhaustive, no blank screen)", () => {
    // The SURF-18 named states (loading/empty/error/offline/reconnecting/stale) plus the ready
    // content slot — every kind has a route, so AsyncBoundary never falls through to nothing.
    const kinds: readonly AsyncKind[] = [
      "loading",
      "empty",
      "error",
      "offline",
      "reconnecting",
      "stale",
      "ready",
    ];
    for (const kind of kinds) {
      expect(ASYNC_PRIMITIVE[kind], `${kind} has a route`).toBeTruthy();
    }
    expect(Object.keys(ASYNC_PRIMITIVE)).toHaveLength(kinds.length);
  });
});
