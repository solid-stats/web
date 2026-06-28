import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const SUCCESS_STORY = "public-stats--players-list--success";
const LOADING_STORY = "public-stats--players-list--loading-model";
const RESPONSIVE_STORY = "public-stats--players-list--responsive";
const CLS_STORY = "public-stats--players-list--cls";

const MOBILE_WIDTHS = [360, 390, 414] as const;
const RESPONSIVE_WIDTHS = [360, 390, 414, 768, 1024, 1280, 1920, 2560, 3440] as const;

async function openStory(page: Page, story: string): Promise<void> {
  await page.goto(`/?story=${story}&mode=preview`);
  await page.waitForSelector("[data-storyloaded]");
}

async function noHorizontalScroll(locator: Locator): Promise<void> {
  const overflow = await locator.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow, "no horizontal overflow").toBeLessThanOrEqual(0);
}

async function noNestedVerticalScroll(locator: Locator): Promise<void> {
  const overflow = await locator.evaluate((el) => el.scrollHeight - el.clientHeight);
  expect(overflow, "no nested vertical scroll").toBeLessThanOrEqual(0);
}

async function expectSameBox(first: Locator, second: Locator): Promise<void> {
  await expect(first).toBeVisible();
  await expect(second).toBeVisible();

  const firstBox = await first.boundingBox();
  const secondBox = await second.boundingBox();

  expect(firstBox, "first box exists").not.toBeNull();
  expect(secondBox, "second box exists").not.toBeNull();
  expect(firstBox?.height, "heights match").toBe(secondBox?.height);
  expect(firstBox?.width, "widths match").toBe(secondBox?.width);
}

test.describe("Players list journey", () => {
  test("Success shows search, filters, period selector, Vasiliy row, and tier cues", async ({
    page,
  }) => {
    await openStory(page, SUCCESS_STORY);

    await expect(page.getByRole("heading", { level: 1, name: /players/i })).toBeVisible();
    await expect(page.getByLabel(/search players/i)).toBeVisible();
    await expect(page.getByLabel(/period/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /active rotation/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /clear filters/i })).toBeVisible();

    const surface = page.locator("[data-players-list]");
    const vasiliy = surface.locator("[data-name-anchor]:visible", { hasText: "Vasiliy" });
    await expect(vasiliy).toBeVisible();
    await expect(surface.locator("[data-numeric-cell='score']:visible").first()).toBeVisible();
    await expect(surface.locator("[data-numeric-cell='kd']:visible").first()).toBeVisible();
    await expect(surface.locator("[data-pips]:visible").first()).toBeVisible();
  });

  test("LoadingModel proves all four period/cache states", async ({ page }) => {
    await openStory(page, LOADING_STORY);

    await expect(page.locator("[data-period-state='rotation-ready']")).toContainText(
      /active rotation ready/i,
    );
    await expect(page.locator("[data-period-state='alltime-warm']")).toContainText(
      /all-time warm ready/i,
    );
    await expect(page.locator("[data-period-state='alltime-cold']")).toContainText(
      /recomputing aggregate/i,
    );
    await expect(page.locator("[data-period-state='alltime-in-session']")).toContainText(
      /loading aggregate/i,
    );
    await expect(
      page.locator("[data-period-state='alltime-cold'] [data-table-card]").first(),
    ).toBeVisible();
    await expect(
      page.locator("[data-period-state='alltime-in-session'] [data-table-card]").first(),
    ).toBeVisible();
  });

  for (const width of MOBILE_WIDTHS) {
    test(`Mobile story uses CompactList with show-more and no nested scroll at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await openStory(page, RESPONSIVE_STORY);

      const compact = page.locator("[data-compact-list]:visible").first();
      await expect(compact).toBeVisible();
      await expect(compact.locator("[data-show-more]")).toContainText(/show more · \d+/i);

      await noHorizontalScroll(page.locator("body"));
      await noHorizontalScroll(page.locator("[data-main]"));
      await noHorizontalScroll(page.locator("[data-players-list]"));
      await noNestedVerticalScroll(compact);
    });
  }

  for (const width of RESPONSIVE_WIDTHS) {
    test(`Responsive story has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openStory(page, RESPONSIVE_STORY);

      await noHorizontalScroll(page.locator("body"));
      await noHorizontalScroll(page.locator("[data-main]"));
      await noHorizontalScroll(page.locator("[data-players-list]"));
    });
  }

  test("Desktop story renders AutoTable fixed viewport and spacer hooks", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openStory(page, SUCCESS_STORY);

    const table = page.locator("[data-auto-table]:visible").first();
    await expect(table).toBeVisible();
    await expect(table.locator("[data-table-viewport]")).toBeVisible();
    await expect(table.locator("[data-spacer='top']")).toBeVisible();
    await expect(table.locator("[data-spacer='bottom']")).toBeVisible();

    const viewportOverflow = await table
      .locator("[data-table-viewport]")
      .evaluate((el) => el.scrollHeight - el.clientHeight);
    expect(viewportOverflow, "desktop table keeps the reserved viewport contract").toBeGreaterThan(
      0,
    );
  });

  test("Loading and final table/list boxes keep matched geometry", async ({ page }) => {
    await openStory(page, CLS_STORY);

    await expectSameBox(
      page.locator("[data-players-cls-table-loading] [data-table-card]").first(),
      page.locator("[data-players-cls-table-ready] [data-table-card]").first(),
    );
    await expectSameBox(
      page.locator("[data-players-cls-compact-loading]"),
      page.locator("[data-players-cls-compact-ready]"),
    );
  });
});
