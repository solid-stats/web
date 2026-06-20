// CLS = 0 proof for the DataTrustBanner (KIT-04 / QUAL-04): the `reserved` (absent)
// banner state must occupy the SAME height as a filled banner, so toggling the banner
// on/off causes zero layout shift. The catalog spec (axe / 44px / keyboard) iterates
// every story generically; this spec adds the banner-specific geometry invariant.
//
// Asserts against the DataTrustBanner Matrix story, which renders the 3 filled kinds
// plus the `reserved` cell through the shared StateMatrix.
import { expect, test } from "@playwright/test";

const STORY = "kit-04-data-trust--datatrustbanner--matrix";

test.describe("DataTrustBanner CLS = 0", () => {
  test("reserved banner reserves the same height as a filled banner", async ({ page }) => {
    await page.goto(`/?story=${STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    // The filled banner inside the "stale" labelled cell.
    const filled = page.locator('[data-state-cell="stale"] [role="status"]');
    // The reserved (absent) banner inside the "reserved" labelled cell.
    const reserved = page.locator('[data-state-cell="reserved"] [data-banner-reserved]');

    await expect(filled).toBeVisible();
    await expect(reserved).toBeVisible();

    const filledBox = await filled.boundingBox();
    const reservedBox = await reserved.boundingBox();

    expect(filledBox, "filled banner has a box").not.toBeNull();
    expect(reservedBox, "reserved banner has a box").not.toBeNull();
    // Heights must match exactly — the reserved box holds the layout (CLS = 0).
    expect(reservedBox?.height).toBe(filledBox?.height);
  });
});
