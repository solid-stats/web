import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const SUCCESS_STORY = "public-stats--player-profile--success";
const RESPONSIVE_STORY = "public-stats--player-profile--responsive";
const CLS_STORY = "public-stats--player-profile--cls";

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

test.describe("Player Profile journey", () => {
  test("Success shows identity, hero stats, trust layer, and public profile affordance", async ({
    page,
  }) => {
    await openStory(page, SUCCESS_STORY);

    const profile = page.locator("[data-player-profile]");
    await expect(page.getByRole("heading", { level: 1, name: "Vasiliy" })).toBeVisible();
    await expect(profile.locator("[data-profile-identity]")).toContainText("7th");
    await expect(profile.locator("[data-profile-identity]")).toContainText(/active/i);
    await expect(page.getByRole("link", { name: /sg\.zone profile/i })).toHaveAttribute(
      "href",
      "https://sg.zone/profile/Vasiliy",
    );

    await expect(profile.locator("[data-profile-hero='score']")).toContainText("4.13");
    await expect(profile.locator("[data-profile-hero='kd']")).toContainText("3.39");
    await expect(profile.locator("[data-profile-freshness]")).toContainText(/up to date/i);
    await expect(profile.locator("[data-profile-provenance]")).toContainText(
      /computed from 1342 replays/i,
    );

    await expect(page.locator("body")).not.toContainText(/\b765611\d{11}\b/u);
  });

  test("Tabs expose Rotation, Bounty, History, and Replays with keyboard roving", async ({
    page,
  }) => {
    await openStory(page, SUCCESS_STORY);

    const tablist = page.getByRole("tablist");
    await expect(tablist).toBeVisible();
    await expect(page.getByRole("tab", { name: "Rotation" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Bounty" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "History" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Replays" })).toBeVisible();

    await page.getByRole("tab", { name: "Rotation" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Bounty" })).toHaveAttribute("data-selected", "");
    await expect(page.getByRole("tabpanel", { name: "Bounty" })).toContainText(/weighted score/i);
  });

  for (const width of RESPONSIVE_WIDTHS) {
    test(`Responsive story has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openStory(page, RESPONSIVE_STORY);

      await noHorizontalScroll(page.locator("body"));
      await noHorizontalScroll(page.locator("[data-main]"));
      await noHorizontalScroll(page.locator("[data-player-profile]"));
    });
  }

  test("Mobile profile tabs and panels avoid nested scroll", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await openStory(page, RESPONSIVE_STORY);

    const profile = page.locator("[data-player-profile]");
    await expect(profile.locator("[data-tabs]")).toBeVisible();
    await expect(profile.locator("[data-compact-list]:visible").first()).toBeVisible();

    await noHorizontalScroll(profile);
    await noNestedVerticalScroll(profile.locator("[data-compact-list]:visible").first());
  });

  test("Loading and final profile boxes keep matched geometry", async ({ page }) => {
    await openStory(page, CLS_STORY);

    await expectSameBox(
      page.locator("[data-profile-cls-loading] [data-profile-identity]"),
      page.locator("[data-profile-cls-ready] [data-profile-identity]"),
    );
    await expectSameBox(
      page.locator("[data-profile-cls-loading] [data-profile-hero-grid]"),
      page.locator("[data-profile-cls-ready] [data-profile-hero-grid]"),
    );
    await expectSameBox(
      page.locator("[data-profile-cls-loading] [data-profile-tabs]"),
      page.locator("[data-profile-cls-ready] [data-profile-tabs]"),
    );
  });
});
