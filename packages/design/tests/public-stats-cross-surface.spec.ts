import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { PUBLIC_STATS } from "../src/surfaces/public-stats/_fixtures";
import type { PublicStatsLang } from "../src/surfaces/public-stats/_harness";

type SurfaceStory = {
  readonly key: "overview" | "players" | "profile";
  readonly story: string;
  readonly root: string;
};

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

async function storyKeys(page: Page): Promise<readonly string[]> {
  const response = await page.request.get("/meta.json");
  expect(response.ok(), "Ladle meta.json is readable").toBe(true);

  const payload: unknown = await response.json();
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("stories" in payload) ||
    typeof payload.stories !== "object" ||
    payload.stories === null
  ) {
    return [];
  }

  return Object.keys(payload.stories);
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

async function verticalOffset(root: Locator, child: Locator): Promise<number> {
  const rootBox = await root.boundingBox();
  const childBox = await child.boundingBox();
  expect(rootBox, "root box exists").not.toBeNull();
  expect(childBox, "child box exists").not.toBeNull();
  return (childBox?.y ?? 0) - (rootBox?.y ?? 0);
}

test.describe("public stats cross-surface consistency", () => {
  test("Catalog meta exposes the public-stats surface trio", async ({ page }) => {
    const keys = await storyKeys(page);

    for (const story of Object.values(SUCCESS_STORIES)) {
      expect(keys, `${story} is present in Ladle meta`).toContain(story);
    }
    for (const { story } of RESPONSIVE_STORIES) {
      expect(keys, `${story} is present in Ladle meta`).toContain(story);
    }
  });

  test("Vasiliy rank, stats, squad, freshness, and provenance agree across surfaces", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await openStory(page, SUCCESS_STORIES.overview);
    const overview = page.locator("[data-stats-overview]");
    const overviewLeader = overview.locator("[data-overview-leaders]");
    await expect(overviewLeader).toContainText(expectedPlayer.name);
    await expect(overviewLeader).toContainText(expectedSquad);
    await expect(overviewLeader).toContainText(expectedScore);
    await expect(overviewLeader).toContainText(expectedKd);
    await expect(overviewLeader.locator("[data-pips]:visible").first()).toBeVisible();
    await expectSharedTrust(page);

    await openStory(page, SUCCESS_STORIES.players);
    const players = page.locator("[data-players-list]");
    await expect(players.locator("[data-table-row='1']:visible")).toContainText(
      expectedPlayer.name,
    );
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
  });

  for (const lang of ["ru", "en"] as const) {
    test(`RU/EN responsive variants render without unresolved keys in ${lang}`, async ({
      page,
    }) => {
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

  test("Desktop success trio keeps primary data dense and rejects spacer slabs", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await openStory(page, SUCCESS_STORIES.overview);
    const overview = page.locator("[data-stats-overview]");
    const overviewLeadersOffset = await verticalOffset(
      overview,
      overview.locator("[data-overview-leaders]"),
    );
    expect(
      overviewLeadersOffset,
      "overview leaderboard starts in the first desktop band",
    ).toBeLessThanOrEqual(24);

    await openStory(page, SUCCESS_STORIES.players);
    const players = page.locator("[data-players-list]");
    await expect(
      players.locator("[data-spacer]"),
      "ready players table has no spacer slab",
    ).toHaveCount(0);
    const viewport = players.locator("[data-table-viewport]:visible").first();
    const firstRow = players.locator("[data-table-row='1']:visible").first();
    const rowOffset = await verticalOffset(viewport, firstRow);
    expect(
      rowOffset,
      "first player row follows the sticky header, not a fake spacer",
    ).toBeLessThanOrEqual(56);

    await openStory(page, SUCCESS_STORIES.profile);
    const profile = page.locator("[data-player-profile]");
    await expect(profile.locator("[data-profile-freshness]")).toHaveCount(1);
    await expect(profile.locator("[data-profile-identity] [data-profile-freshness]")).toBeVisible();
    const tabsOffset = await verticalOffset(profile, profile.locator("[data-profile-tabs]"));
    expect(
      tabsOffset,
      "profile tabs stay above the fold after identity/data band",
    ).toBeLessThanOrEqual(560);
  });

  test("RU players surface does not leak English fallback labels", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openStory(page, SUCCESS_STORIES.players, "ru");

    let text = await page.locator("body").innerText();
    expect(text, "search label is localized").not.toContain("Search players");
    expect(text, "tier label is localized").not.toMatch(/\bTier\b/u);
    expect(text, "all-tier value is localized").not.toContain("All tiers");
    expect(text, "period status is localized").not.toContain("Active rotation ready");

    await openStory(page, "public-stats--players-list--loading-model", "ru");
    text = await page.locator("body").innerText();
    expect(text, "warm all-time status is localized").not.toContain("All-time warm ready");
    expect(text, "cold all-time status is localized").not.toContain("Recomputing aggregate");
    expect(text, "in-session loading status is localized").not.toContain("Loading aggregate");
  });
});
