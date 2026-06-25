// KIT-05 FileUpload single-preview regression (GAP-05 / 03-UAT-VISUAL-FINDINGS FU3). The
// accepted-file row must render EXACTLY ONE preview node — the `<img>` for an image, the icon
// fallback only for a non-image — never the `<img>` AND the `ImageUp` fallback side by side.
//
// The bug: the slice rendered two `<ItemPreview>` siblings per row, `type="image/*"` (the img)
// and `type=".*"` (the fallback). Ark's ItemPreview filters by `file.type.match(props.type)` and
// `.*` is a catch-all that ALSO matches an image, so BOTH render for any accepted image → two
// `[data-part="item-preview"]` nodes per row. The generic catalog axe pass cannot express the
// node COUNT, so this spec drives the Matrix story's accepted image rows and asserts the count
// directly. RED on the pre-fix code (count 2), GREEN after the single-branched fix (count 1).
import { expect, test } from "@playwright/test";

const STORY = "kit-05-form--fileupload--matrix";

// The Matrix renders accepted image rows in the `few` (1 file) and `many` (3 files) data-volume
// cells, each from controlled image/png fixtures. Scoping to one cell keeps the count assertion
// about real accepted rows, not the rejection/disabled cells.
test.describe("FileUpload single preview per accepted file (GAP-05)", () => {
  test("an accepted image row renders exactly one preview node", async ({ page }) => {
    await page.goto(`/?story=${STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    // The `few` cell has a single accepted image row — the cleanest count fixture.
    const row = page.locator('[data-state-cell="few"] [data-part="item"]').first();
    await expect(row, "the few cell renders one accepted file row").toBeVisible();

    // Every preview node in the row is an Ark ItemPreview (`[data-part="item-preview"]`): the
    // image branch (`item-preview-image` inside) and/or the icon fallback. The bug renders BOTH,
    // so this is 2 pre-fix and must be exactly 1 after.
    const previews = row.locator('[data-part="item-preview"]');
    await expect(
      previews,
      "an accepted image renders exactly one preview node (not the img + fallback)",
    ).toHaveCount(1);
  });

  test("every accepted image row in the many cell renders exactly one preview", async ({ page }) => {
    await page.goto(`/?story=${STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    const rows = page.locator('[data-state-cell="many"] [data-part="item"]');
    const rowCount = await rows.count();
    expect(rowCount, "the many cell renders its three accepted rows").toBe(3);

    for (let i = 0; i < rowCount; i++) {
      const previews = rows.nth(i).locator('[data-part="item-preview"]');
      await expect(
        previews,
        `accepted row ${i} renders exactly one preview node`,
      ).toHaveCount(1);
    }
  });

  test("the surviving preview is the image branch, not the fallback icon", async ({ page }) => {
    await page.goto(`/?story=${STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    const row = page.locator('[data-state-cell="few"] [data-part="item"]').first();
    await expect(row).toBeVisible();

    // The accept default is PNG/JPEG/WebP, so the fixture row is an image — its single preview
    // must carry the `<img>` (`[data-part="item-preview-image"]`), proving the fix kept the image
    // branch and dropped the `ImageUp` placeholder (the wrong branch surviving would be the
    // inverse regression).
    const previewImage = row.locator('[data-part="item-preview-image"]');
    await expect(previewImage, "the image row's preview is the <img>, not the fallback").toHaveCount(
      1,
    );
  });
});
