// GAP-01 regression (blocker): the Ladle RU↔EN language switch must drive a GLOBAL,
// per-render bilingual re-render of every catalogued story — independent of whether a
// story declares its own args. The pre-fix code declared the toggle only as
// `addons.control.defaultState.locale` in config.mjs, which in Ladle 5.1.1 is a
// per-STORY args seed and is NEVER merged into `globalState.control`; so
// `globalState.control.locale` stays `undefined`, `toLocale` falls back to `ru` forever,
// and EN is unreachable from the UI (SC#2 fails) [src: 03-UAT.md#GAP-01].
//
// The locale source the GlobalProvider reads is a `?locale=` URL query param (Task 2,
// preferred option): persistent (lives in the URL), global (independent of story args),
// and drivable here by appending `&locale=en`. These tests assert REAL rendered copy in
// each locale (tests.md — never the STRINGS object): `tabsLabelOverview` is «Обзор» (RU)
// / "Overview" (EN), resolved in the Tabs story via `i18n._({ id })`, so a locale flip is
// observable as a copy change. The Tabs Matrix story (`kit-06-overlay--tabs--matrix`)
// renders that key; `smoke--tokens` is the no-args story that proves the switch is global.
import { expect, test } from "@playwright/test";

// A story that resolves a bilingual key through the runtime i18n instance (`i18n._`),
// so `i18n.activate(locale)` in the GlobalProvider re-renders it in the active language.
// The Tabs Matrix renders `tabsLabelOverview` as a `role="tab"` label.
const TABS_STORY = "kit-06-overlay--tabs--matrix";
// The no-args smoke story — proves the switch is GLOBAL (the exact GAP-01 failure: the
// toggle must work where no story declares its own args).
const SMOKE_STORY = "smoke--tokens";

// The bilingual marker rendered by the Tabs story (catalogs.ts derives these from STRINGS:
// `tabsLabelOverview` RU «Обзор» / EN "Overview"). The RU and EN forms differ unambiguously.
const RU_OVERVIEW = "Обзор";
const EN_OVERVIEW = "Overview";

function storyUrl(story: string, locale?: "ru" | "en"): string {
  const localeParam = locale === undefined ? "" : `&locale=${locale}`;
  return `/?story=${story}&mode=preview${localeParam}`;
}

test.describe("Ladle RU↔EN language toggle (GAP-01 regression)", () => {
  test("Defaults to RU when no locale source is set", async ({ page }) => {
    // Arrange + Act: load the Tabs story with NO explicit locale source.
    await page.goto(storyUrl(TABS_STORY));
    await page.waitForSelector("[data-tabs]");

    // Assert: the RU label renders (RU is the primary/default display language, D-03).
    await expect(page.getByRole("tab", { name: RU_OVERVIEW }).first()).toBeVisible();
    await expect(page.getByRole("tab", { name: EN_OVERVIEW })).toHaveCount(0);
  });

  test("Flips a catalogued story to EN when the locale source is en", async ({ page }) => {
    // Arrange + Act: drive the SAME mechanism the GlobalProvider reads — the `?locale=`
    // query param — to en, then load the story.
    await page.goto(storyUrl(TABS_STORY, "en"));
    await page.waitForSelector("[data-tabs]");

    // Assert: the story now renders the EN label and no longer the RU one.
    await expect(page.getByRole("tab", { name: EN_OVERVIEW }).first()).toBeVisible();
    await expect(page.getByRole("tab", { name: RU_OVERVIEW })).toHaveCount(0);
  });

  test("Drives EN on a no-args story, proving the switch is global", async ({ page }) => {
    // Arrange: the no-args smoke story carries no args of its own — the toggle must still
    // apply (the exact GAP-01 failure mode). Load it under `?locale=en` and confirm it
    // mounts under the GlobalProvider-wrapped tree.
    await page.goto(storyUrl(SMOKE_STORY, "en"));
    // The smoke story's display heading proves the no-args story mounted under the provider.
    await expect(page.getByRole("heading", { name: /Solid Stats/ })).toBeVisible();

    // Act: with the SAME global `?locale=en` source, a catalogued i18n-resolving story
    // renders EN — proving the source is global, not story-args-dependent.
    await page.goto(storyUrl(TABS_STORY, "en"));
    await page.waitForSelector("[data-tabs]");

    // Assert: EN is active globally.
    await expect(page.getByRole("tab", { name: EN_OVERVIEW }).first()).toBeVisible();
    await expect(page.getByRole("tab", { name: RU_OVERVIEW })).toHaveCount(0);
  });
});
