// KIT-06 — pure-logic contract test for the `tooltip` recipe (Plan 03-06, Wave 6; motion contract
// updated Plan 03-11, GAP-02). Vitest = pure logic only, no DOM (solidstats-frontend-react-tests):
// this pins what the recipe STRING guarantees. Since Plan 03-11 the enter/exit animation and the
// reduced-motion opt-out live in the shared `.uikit-overlay-motion` keyframes (`styles/uikit.css`),
// NOT in per-state Tailwind utilities — so the recipe's motion contract is now "it opts into the
// shared overlay-motion policy on the FAST duration role." The RUNTIME guarantees (enter frame at
// opacity < 1, transform/opacity-only / CLS = 0, animation dropped under prefers-reduced-motion) are
// asserted against a real browser in `tests/motion.spec.ts`; this test pins the recipe wiring so a
// dropped motion class or a leaked arbitrary/layout value fails here instead of shipping.
import { describe, expect, test } from "vitest";
import { tooltip } from "./tooltip";

describe("tooltip recipe — the KIT-06 focus+hover tooltip", () => {
  test("the content opts into the shared overlay-motion policy on the fast duration role (Plan 03-11)", () => {
    const content = tooltip().content();
    // The enter/exit + reduced-motion handling is the shared `.uikit-overlay-motion` keyframe recipe…
    expect(content).toContain("uikit-overlay-motion");
    // …on the FAST duration role (the small hover surface — the design Motion roles).
    expect(content).toContain("uikit-overlay-motion-fast");
  });

  test("the recipe animates no layout property and leaks no arbitrary value (CLS = 0, styling.md)", () => {
    const content = tooltip().content();
    // Never an animated LAYOUT property (no width/height transition — that would shift layout).
    expect(content).not.toContain("transition-[width");
    expect(content).not.toContain("transition-[height");
    // No arbitrary Tailwind value leaked into the recipe (styling.md).
    expect(content).not.toMatch(/\[[^\]]*#/);
  });

  test("the content is a tokenised surface-1 + border-2 floating surface (no arbitrary values)", () => {
    const content = tooltip().content();
    expect(content).toContain("bg-surface-1");
    expect(content).toContain("border-border-2");
    expect(content).toContain("shadow-md");
    // No arbitrary Tailwind value leaked into the recipe (styling.md).
    expect(content).not.toMatch(/\[[^\]]*#/);
  });
});
