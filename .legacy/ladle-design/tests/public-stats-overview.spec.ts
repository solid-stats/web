import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

const SUCCESS_STORY = "public-stats--stats-overview--success";
const LOADING_STORY = "public-stats--stats-overview--cls";
const RESPONSIVE_STORY = "public-stats--stats-overview--responsive";

const VIEWPORTS = [360, 390, 414, 768, 1024, 1280, 1920, 2560, 3440] as const;
const ENTRY_LABELS = ["All players", "Squads", "Rotations", "Commander", "Bounty"] as const;

async function openStory(page: import("@playwright/test").Page, story: string): Promise<void> {
  await page.goto(`/?story=${story}&mode=preview`);
  await page.waitForSelector("[data-storyloaded]");
}

async function noHorizontalScroll(locator: Locator): Promise<void> {
  const overflow = await locator.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow, "no horizontal overflow").toBeLessThanOrEqual(0);
}

test.describe("Stats Overview journey", () => {
  test("Success shows Vasiliy and all public entry affordances", async ({ page }) => {
    await openStory(page, SUCCESS_STORY);

    await expect(page.getByRole("heading", { level: 1, name: /stats overview/i })).toBeVisible();
    await expect(
      page.locator("[data-overview-leaders] [data-name-anchor]:visible", { hasText: "Vasiliy" }),
    ).toBeVisible();

    for (const label of ENTRY_LABELS) {
      const entry = page.locator("[data-overview-entries]").getByRole("link", {
        name: new RegExp(label, "i"),
      });
      await expect(entry, `${label} entry exists`).toBeVisible();
      await expect(entry, `${label} entry is keyboard-focusable`).toBeEnabled();
    }
  });

  for (const width of VIEWPORTS) {
    test(`Responsive story has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openStory(page, RESPONSIVE_STORY);

      await noHorizontalScroll(page.locator("body"));
      await noHorizontalScroll(page.locator("[data-main]"));
      await noHorizontalScroll(page.locator("[data-stats-overview]"));
    });
  }

  test("Loading and final aggregate boxes keep matched geometry", async ({ page }) => {
    await openStory(page, LOADING_STORY);

    const loading = page.locator("[data-overview-cls-loading]");
    const ready = page.locator("[data-overview-cls-ready]");

    await expect(loading).toBeVisible();
    await expect(ready).toBeVisible();

    const loadingBox = await loading.boundingBox();
    const readyBox = await ready.boundingBox();

    expect(loadingBox, "loading box exists").not.toBeNull();
    expect(readyBox, "ready box exists").not.toBeNull();
    expect(loadingBox?.height, "loading and ready heights match").toBe(readyBox?.height);
    expect(loadingBox?.width, "loading and ready widths match").toBe(readyBox?.width);
  });

  test("Entry affordances are focusable 44px targets", async ({ page }) => {
    await openStory(page, SUCCESS_STORY);

    for (const label of ENTRY_LABELS) {
      const entry = page.locator("[data-overview-entries]").getByRole("link", {
        name: new RegExp(label, "i"),
      });
      await entry.focus();
      await expect(entry, `${label} receives focus`).toBeFocused();

      const box = await entry.boundingBox();
      expect(box, `${label} target box exists`).not.toBeNull();
      expect(box?.height, `${label} target height`).toBeGreaterThanOrEqual(44);
      expect(box?.width, `${label} target width`).toBeGreaterThanOrEqual(44);
    }
  });
});
