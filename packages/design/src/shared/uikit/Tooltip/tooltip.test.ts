// KIT-06 — pure-logic contract test for the `tooltip` recipe (Plan 03-06, Wave 6). Vitest =
// pure logic only, no DOM (solidstats-frontend-react-tests). The recipe is the single source of
// the reduced-motion handling (the a11y.md "respect prefers-reduced-motion" contract) and the
// transform/opacity-only animation (CLS = 0); this test pins those so a later drift (a dropped
// `motion-reduce:`, an animated layout property) fails here instead of shipping. The component
// head comment + the story enforce "never the only meaning carrier"; this enforces the recipe.
import { describe, expect, test } from "vitest";
import { tooltip } from "./tooltip";

describe("tooltip recipe — the KIT-06 focus+hover tooltip", () => {
  test("the content DROPS the animation under prefers-reduced-motion (a11y.md Targets & motion)", () => {
    const content = tooltip().content();
    // The non-essential enter/exit transition is dropped under reduced motion…
    expect(content).toContain("motion-reduce:transition-none");
    // …and the scale-in is neutralised so it does not jump (the closed scale resets to 100).
    expect(content).toContain("motion-reduce:data-[state=closed]:scale-100");
  });

  test("the content animates transform/opacity ONLY (CLS = 0, QUAL-04 / styling.md)", () => {
    const content = tooltip().content();
    expect(content).toContain("data-[state=open]:opacity-100");
    expect(content).toContain("data-[state=closed]:opacity-0");
    expect(content).toContain("data-[state=open]:scale-100");
    expect(content).toContain("data-[state=closed]:scale-95");
    // Never an animated LAYOUT property (no width/height transition — that would shift layout).
    expect(content).not.toContain("transition-[width");
    expect(content).not.toContain("transition-[height");
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
