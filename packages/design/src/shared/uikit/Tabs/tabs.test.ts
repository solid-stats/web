// KIT-06 — pure-logic contract test for the `tabs` recipe (Plan 03-06, Wave 6). Vitest =
// pure logic only, no DOM (solidstats-frontend-react-tests). The recipe is the single source
// of the active-tab cyan, the STRUCTURAL selected marker that pairs it (never color-alone),
// the ≥44px floor, and the canonical visible focus ring; this test pins those contracts so a
// later drift (a dropped underline → color-alone, a missing `min-h-11`, a wrong/extra ring)
// fails here instead of shipping. The keyboard.spec proves the live roving tabindex in-browser;
// this proves the recipe's painted contract.
import { describe, expect, test } from "vitest";
import { tabs } from "./tabs";

describe("tabs recipe — the KIT-06 tab set", () => {
  test("the active trigger is cyan PAIRED with a structural marker (selection is never color-alone)", () => {
    const trigger = tabs().trigger();
    // Cyan active text on the Ark-selected state.
    expect(trigger).toContain("data-[selected]:text-primary");
    // …paired with a STRUCTURAL marker: the cyan underline border on the SAME selected state.
    // The two ride together on `data-[selected]`, so the marker can never be dropped leaving
    // color alone (a11y.md "never convey meaning by color alone").
    expect(trigger).toContain("data-[selected]:border-primary");
    // The resting trigger reserves the underline slot (transparent) so selecting it does not
    // shift layout — the marker swaps colour, it does not add height (CLS = 0).
    expect(trigger).toContain("border-b-2");
    expect(trigger).toContain("border-transparent");
  });

  test("every trigger clears the >=44px target floor (a11y 2.5.5)", () => {
    expect(tabs().trigger()).toContain("min-h-11");
  });

  test("the trigger carries the ONE canonical visible focus ring (2.4.12 — not obscured)", () => {
    const trigger = tabs().trigger();
    expect(trigger).toContain("focus-visible:outline-none");
    // The canonical ring (the shared-control precedent) — paints on the trigger's own box, so
    // it is never clipped under a sticky bar.
    expect(trigger).toContain("focus-visible:shadow-(--shadow-ring)");
    // NOT the drifted outline ring (the GAP-19 symptom).
    expect(trigger).not.toContain("focus-visible:outline-2");
  });

  test("the trigger is cursor-pointer (the interactive part — styling.md)", () => {
    expect(tabs().trigger()).toContain("cursor-pointer");
  });
});
