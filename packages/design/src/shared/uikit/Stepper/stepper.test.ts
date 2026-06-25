// KIT-05 — pure-logic contract test for the `stepper` recipe (Plan 03-03, Wave 3).
// Vitest = pure logic only, no DOM (solidstats-frontend-react-tests; mirrors
// Input/input.test.ts). The recipe pins the two load-bearing contracts the plan's
// <behavior> block asserts: the value aligns via the MONO face (font-mono + tabular-nums,
// not weight) and the inc/dec triggers clear the ≥44px target floor (min-h-11). A later
// drift (a dropped mono face, a shrunk trigger, a sneaked-in arbitrary value) fails here
// instead of shipping.
import { describe, expect, test } from "vitest";
import { stepper } from "./stepper";

describe("stepper recipe — the Ark NumberInput mono/44px contract", () => {
  test("value input aligns via the mono face — font-mono + tabular-nums (UI-SPEC Typography)", () => {
    const { input } = stepper();
    expect(input()).toContain("font-mono");
    expect(input()).toContain("tabular-nums");
  });

  test("inc/dec triggers clear the ≥44px target floor (a11y.md Targets)", () => {
    const { incrementTrigger, decrementTrigger } = stepper();
    expect(incrementTrigger()).toContain("min-h-11");
    expect(incrementTrigger()).toContain("min-w-11");
    expect(decrementTrigger()).toContain("min-h-11");
    expect(decrementTrigger()).toContain("min-w-11");
  });

  test("inc/dec triggers carry the canonical control focus ring", () => {
    const { incrementTrigger, decrementTrigger } = stepper();
    expect(incrementTrigger()).toContain("focus-visible:shadow-(--shadow-ring)");
    expect(decrementTrigger()).toContain("focus-visible:shadow-(--shadow-ring)");
  });

  test("NO arbitrary value / property utility (styling.md)", () => {
    // Bans arbitrary VALUES (`bg-[#fff]`, `p-[7px]`) and arbitrary PROPERTIES
    // (`[mask-type:luminance]`) — NOT the `data-[…]:` / `aria-[…]:` attribute-variant
    // selectors Ark's part state requires (those are sanctioned variant prefixes). The
    // arbitrary forms always pair `-[` (value) or open with `[` at a class boundary
    // (property); `data-[`/`aria-[` are matched and excluded explicitly.
    const arbitrary = /(?<![a-z])-\[|(?:^|\s)\[/;
    const noDataAria = (cls: string) =>
      cls.replace(/(?:data|aria)-\[[^\]]*\]/g, "").replace(/group-[a-z-]+\/[a-z-]+/g, "");
    const { control, input, incrementTrigger, decrementTrigger } = stepper();
    for (const slot of [control(), input(), incrementTrigger(), decrementTrigger()]) {
      expect(arbitrary.test(noDataAria(slot)), `arbitrary value in: ${slot}`).toBe(false);
    }
  });
});
