// KIT-05 — pure-logic contract test for the `input` recipe (Plan 03-02, Wave 2).
// Vitest = pure logic only, no DOM (solidstats-frontend-react-tests; mirrors
// Button/control.test.ts). The recipe maps the DESIGN.md `input` recipe literally onto
// emitted `@theme` tokens; this test pins that contract so a later drift (a dropped focus
// glow, a wrong fill token, a sneaked-in arbitrary value) fails here instead of shipping.
import { describe, expect, test } from "vitest";
import { input } from "./input";

describe("input recipe — the DESIGN.md input control", () => {
  test("resting: surface-2 fill + border-1 hairline (UI-SPEC KIT-05)", () => {
    const cls = input();
    expect(cls).toContain("bg-surface-2");
    expect(cls).toContain("border-border-1");
  });

  test("hover brightens the hairline to border-2", () => {
    expect(input()).toContain("hover:border-border-2");
  });

  test("focus-visible: primary border + the ring-glow (the input focus treatment)", () => {
    const cls = input();
    expect(cls).toContain("focus-visible:border-primary-border");
    expect(cls).toContain("focus-visible:shadow-(--shadow-ring-glow)");
  });

  test("placeholder uses text-subtle (the one sanctioned text-subtle use)", () => {
    expect(input()).toContain("placeholder:text-text-subtle");
  });

  test("disabled variant: surface-1 fill + text-subtle + 0.6 opacity", () => {
    const cls = input({ disabled: true });
    expect(cls).toContain("bg-surface-1");
    expect(cls).toContain("text-text-subtle");
    expect(cls).toContain("opacity-60");
  });

  test("NO arbitrary value (no [ bracket utility) in any resolved string (styling.md)", () => {
    expect(input()).not.toContain("[");
    expect(input({ disabled: true })).not.toContain("[");
  });
});
