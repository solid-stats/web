import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { PUBLIC_STATS } from "../src/surfaces/public-stats/_fixtures";
import type { PublicStatsLang } from "../src/surfaces/public-stats/_harness";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

type LadleMeta = { readonly stories: Readonly<Record<string, unknown>> };
type SurfaceStory = {
  readonly key: "overview" | "players" | "profile";
  readonly story: string;
  readonly root: string;
};

const meta = JSON.parse(readFileSync(join(packageRoot, "build", "meta.json"), "utf8")) as LadleMeta;
const storyKeys = Object.keys(meta.stories);

const SUCCESS_STORIES = {
  overview: "public-stats--stats-overview--success",
  players: "public-stats--players-list--success",
  profile: "public-stats--player-profile--success",
} as const;

const RESPONSIVE_STORIES: readonly SurfaceStory[] = [
  {
    key: "overview",
    story: "public-stats--stats-overview--responsive",
    root: "[data-stats-overview]",
  },
  {
    key: "players",
    story: "public-stats--players-list--responsive",
    root: "[data-players-list]",
  },
  {
    key: "profile",
    story: "public-stats--player-profile--responsive",
    root: "[data-player-profile]",
  },
];

const CROSS_SURFACE_WIDTHS = [360, 3440] as const;
const expectedPlayer = PUBLIC_STATS.profile.player;
const expectedReplayCount = PUBLIC_STATS.profile.provenance.replayCount;
const expectedScore = expectedPlayer.score.toFixed(2);
const expectedKd = expectedPlayer.kd.toFixed(2);
const expectedSquad = expectedPlayer.squad ?? "—";

function storyUrl(story: string, lang?: PublicStatsLang): string {
  const locale = lang === undefined ? "" : `&locale=${lang}&arg-lang=${lang}`;
  return `/?story=${story}&mode=preview${locale}`;
}

async function openStory(page: Page, story: string, lang?: PublicStatsLang): Promise<void> {
  await page.goto(storyUrl(story, lang));
  await page.waitForSelector("[data-storyloaded]");
}

async function noHorizontalScroll(locator: Locator): Promise<void> {
  const overflow = await locator.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow, "no horizontal overflow").toBeLessThanOrEqual(0);
}

async function expectNoRenderedKeys(page: Page): Promise<void> {
  const text = await page.locator("body").innerText();
  expect(text, "no unresolved public-stats i18n keys").not.toMatch(
    /\b(?:publicStats|freshness|stat)[A-Z][A-Za-z]+\b/u,
  );
  expect(text, "no unresolved ICU placeholders").not.toMatch(/\{[a-z][A-Za-z0-9_]*\}/u);
}

async function expectSharedTrust(page: Page): Promise<void> {
  await expect(page.locator("[data-public-stats-trust]")).toContainText(/up to date/i);
  await expect(page.locator("[data-public-stats-trust]")).toContainText(/known/i);
  await expect(page.locator("[data-public-stats-surface]")).toContainText(
    new RegExp(`computed from ${expectedReplayCount} replays`, "i"),
  );
}

test.describe("public stats cross-surface consistency", () => {
  test("Catalog meta exposes the public-stats surface trio", () => {
    for (const story of Object.values(SUCCESS_STORIES)) {
      expect(storyKeys, `${story} is present in Ladle meta`).toContain(story);
    }
    for (const { story } of RESPONSIVE_STORIES) {
      expect(storyKeys, `${story} is present in Ladle meta`).toContain(story);
    }
  });

  test("Vasiliy rank, stats, squad, freshness, and provenance agree across surfaces", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    await openStory(page, SUCCESS_STORIES.overview);
    const overview = page.locator("[data-stats-overview]");
    const overviewLeader = overview.locator("[data-overview-leaders]");
    await expect(overviewLeader.locator("[data-table-row='1']:visible")).toContainText(
      expectedPlayer.name,
    );
    await expect(overviewLeader.locator("[data-table-row='1']:visible")).toContainText(
      expectedSquad,
    );
    await expect(overviewLeader.locator("[data-numeric-cell='score']:visible").first()).toContainText(
      expectedScore,
    );
    await expect(overviewLeader.locator("[data-numeric-cell='kd']:visible").first()).toContainText(
      expectedKd,
    );
    await expect(overviewLeader.locator("[data-pips]:visible").first()).toBeVisible();
    await expectSharedTrust(page);

    await openStory(page, SUCCESS_STORIES.players);
    const players = page.locator("[data-players-list]");
    await expect(players.locator("[data-table-row='1']:visible")).toContainText(expectedPlayer.name);
    await expect(players.locator("[data-table-row='1']:visible")).toContainText(expectedSquad);
    await expect(players.locator("[data-numeric-cell='score']:visible").first()).toContainText(
      expectedScore,
    );
    await expect(players.locator("[data-numeric-cell='kd']:visible").first()).toContainText(
      expectedKd,
    );
    await expect(players.locator("[data-pips]:visible").first()).toBeVisible();
    await expectSharedTrust(page);

    await openStory(page, SUCCESS_STORIES.profile);
    const profile = page.locator("[data-player-profile]");
    await expect(profile.locator("[data-profile-identity]")).toContainText(
      `#${expectedPlayer.rank}`,
    );
    await expect(profile.locator("[data-profile-identity]")).toContainText(expectedPlayer.name);
    await expect(profile.locator("[data-profile-identity]")).toContainText(expectedSquad);
    await expect(profile.locator("[data-profile-hero='score']")).toContainText(expectedScore);
    await expect(profile.locator("[data-profile-hero='kd']")).toContainText(expectedKd);
    await expect(profile.locator("[data-profile-freshness]")).toContainText(/up to date/i);
    await expect(profile.locator("[data-profile-provenance]")).toContainText(
      new RegExp(`computed from ${expectedReplayCount} replays`, "i"),
    );
    await expectSharedTrust(page);
  });

  for (const lang of ["ru", "en"] as const) {
    test(`RU/EN responsive variants render without unresolved keys in ${lang}`, async ({ page }) => {
      for (const { story, root } of RESPONSIVE_STORIES) {
        await openStory(page, story, lang);
        await expect(page.locator(root), `${story} ${lang} root renders`).toBeVisible();
        await expectNoRenderedKeys(page);
      }
    });
  }

  for (const width of CROSS_SURFACE_WIDTHS) {
    test(`Public-stats responsive trio has no horizontal overflow at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });

      for (const { story, root } of RESPONSIVE_STORIES) {
        await openStory(page, story, "en");
        await noHorizontalScroll(page.locator("body"));
        await noHorizontalScroll(page.locator("[data-main]"));
        await noHorizontalScroll(page.locator(root));
      }
    });
  }
});
