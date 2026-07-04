// The Phase-2 catalog gate: iterate every Ladle story (from build/meta.json) and
// assert axe-cleanliness (serious/critical block), 44px interactive-target
// geometry, and keyboard reachability of any interactive controls. This is the
// QUAL-03 gate that every later family slice's stories flow through automatically
// — adding a story adds it to meta.json and this spec picks it up with no edit.
//
// Proven end-to-end here against the existing `smoke--tokens` story.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Collection-time read: globalSetup has already produced build/meta.json. Read it
// from disk (env vars set in globalSetup do not reach test workers).
const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

type LadleMeta = { readonly stories: Readonly<Record<string, unknown>> };

const meta = JSON.parse(readFileSync(join(packageRoot, "build", "meta.json"), "utf8")) as LadleMeta;

const storyKeys = Object.keys(meta.stories);

// The catalog must not be empty — a silent zero-story run would make the gate a
// no-op and falsely report green.
test("catalog meta.json exposes at least one story", () => {
  expect(storyKeys.length).toBeGreaterThan(0);
});

const INTERACTIVE = "a, button, [role=button], input, select, textarea";

for (const key of storyKeys) {
  test.describe(key, () => {
    test("axe clean (serious/critical)", async ({ page }) => {
      await page.goto(`/?story=${key}&mode=preview`);
      await page.waitForSelector("[data-storyloaded]");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
    });

    test("interactive targets >= 44x44", async ({ page }) => {
      await page.goto(`/?story=${key}&mode=preview`);
      await page.waitForSelector("[data-storyloaded]");
      for (const el of await page.locator(INTERACTIVE).all()) {
        if (!(await el.isVisible())) continue;
        const box = await el.boundingBox();
        if (!box) continue;
        expect(box.height, "target height").toBeGreaterThanOrEqual(44);
        expect(box.width, "target width").toBeGreaterThanOrEqual(44);
      }
    });

    test("interactive controls are keyboard-reachable", async ({ page }) => {
      await page.goto(`/?story=${key}&mode=preview`);
      await page.waitForSelector("[data-storyloaded]");
      const controls = page.locator(INTERACTIVE);
      const count = await controls.count();
      // Stories with no interactive controls (most display-only primitives,
      // incl. Smoke) vacuously pass — the gate applies where controls exist.
      if (count === 0) return;
      await page.keyboard.press("Tab");
      const focusedInside = await page.evaluate((sel) => {
        const active = document.activeElement;
        return active !== null && active.matches(sel);
      }, INTERACTIVE);
      expect(focusedInside, "Tab should move focus onto an interactive control").toBe(true);
    });
  });
}
