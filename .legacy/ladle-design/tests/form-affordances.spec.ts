// GAP-06 + GAP-07 form-control affordance regression (03-UAT.md#GAP-06 / #GAP-07). The
// generic catalog gate (catalog.spec.ts) proves every story is axe-clean / 44px / Tab-reachable;
// it CANNOT express these three form-specific contracts, so this spec drives the KIT-05 Field +
// FileUpload Matrix stories and asserts them directly:
//
//   1. (GAP-07) A required Field shows a VISIBLE, non-color-alone required marker — a `*` glyph
//      PAIRED with visually-hidden "required" text — driven by the `required` prop. Pre-fix the
//      `required` prop only set `aria-required` (no visible marker) → RED.
//   2. (GAP-07) A Field's helperText is programmatically associated with the control via
//      `aria-describedby` (in addition to the error). Guards the association against a regression.
//   3. (GAP-06) The FileUpload retry + delete row controls route through the shared `control`
//      recipe (the catalogued icon-only Button): a real ≥44px `<button>` carrying the shared
//      control's `font-weight:600` signature (the bespoke `itemDeleteTrigger` recipe did NOT set
//      it) → RED pre-fix; AND a disabled FileUpload forwards `disabled` to those row controls
//      (the previously-dead `data-[disabled]` branch) → RED pre-fix (disabled not forwarded).
//
// Assertions read rendered DOM + computed a11y attributes (tests.md), never source internals.
import { expect, test } from "@playwright/test";

const FIELD_STORY = "kit-05-form--field--matrix";
const FILEUPLOAD_STORY = "kit-05-form--fileupload--matrix";

// The RU-primary resolution of the fixture copy (i18n default locale is ru — the keyboard.spec
// precedent of pinning the resolved RU string). `fieldRequired` is the required hint the story
// passes as the marker's visually-hidden text.
const REQUIRED_WORD_RU = "Обязательное поле";

test.describe("Field required marker (GAP-07)", () => {
  test("a required field shows a visible, non-color-alone required marker", async ({ page }) => {
    await page.goto(`/?story=${FIELD_STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    const label = page.locator('[data-state-cell="required"] [data-part="label"]').first();
    await expect(label, "the required cell renders a field label").toBeVisible();

    // The visible glyph marker — a `*` is a shape, not a colour, so the affordance is not carried
    // by colour alone. Pre-fix the label has no marker at all.
    await expect(label, "a required field shows a visible * marker").toContainText("*");

    // Not color-alone for AT users either: the `*` is paired with visually-hidden "required" text
    // that the accessible label name includes (the `fieldRequired` copy the story resolves).
    const srRequired = label.locator(".sr-only");
    await expect(
      srRequired,
      "the * marker is paired with visually-hidden required text (not color-alone)",
    ).toHaveText(REQUIRED_WORD_RU);
  });
});

test.describe("Field helperText association (GAP-07)", () => {
  test("the control's aria-describedby includes the helperText id", async ({ page }) => {
    await page.goto(`/?story=${FIELD_STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    const cell = page.locator('[data-state-cell="default"]');
    const control = cell.locator("[data-field-control]").first();
    const helper = cell.locator('[data-part="helper-text"]').first();
    await expect(helper, "the default cell renders helper text").toBeVisible();

    const helperId = await helper.getAttribute("id");
    expect(helperId, "the helper text carries an id").toBeTruthy();

    const describedBy = await control.getAttribute("aria-describedby");
    expect(
      describedBy?.split(/\s+/).includes(helperId ?? "\0"),
      "aria-describedby references the helper text id (helper associated to the control)",
    ).toBe(true);
  });
});

test.describe("FileUpload row controls routed through the shared Button (GAP-06)", () => {
  test("the retry + delete row controls render through the shared control recipe (>=44px, font-semibold)", async ({
    page,
  }) => {
    await page.goto(`/?story=${FILEUPLOAD_STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    const row = page.locator('[data-state-cell="retry"] [data-part="item"]').first();
    await expect(row, "the retry cell renders an accepted file row").toBeVisible();

    const controls = row.locator("button");
    await expect(controls, "the retry row has the retry + delete controls").toHaveCount(2);

    const count = await controls.count();
    for (let i = 0; i < count; i++) {
      const btn = controls.nth(i);
      const box = await btn.boundingBox();
      if (box === null) throw new Error(`row control ${i} has no bounding box`);
      expect(
        box.height,
        `row control ${i} clears the >=44px floor (height)`,
      ).toBeGreaterThanOrEqual(44);
      expect(box.width, `row control ${i} clears the >=44px floor (width)`).toBeGreaterThanOrEqual(
        44,
      );
      // The shared `control` recipe base sets `font-semibold` (font-weight:600); the bespoke
      // `itemDeleteTrigger` recipe never did. So a computed 600 proves the row control routes
      // through the catalogued Button rather than re-implementing the recipe by hand.
      const weight = await btn.evaluate((el) => getComputedStyle(el).fontWeight);
      expect(
        weight,
        `row control ${i} carries the shared control font weight (routes through Button)`,
      ).toBe("600");
    }
  });

  test("a disabled FileUpload forwards disabled to its row controls", async ({ page }) => {
    await page.goto(`/?story=${FILEUPLOAD_STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    const row = page.locator('[data-state-cell="disabled"] [data-part="item"]').first();
    await expect(row, "the disabled cell renders an accepted file row").toBeVisible();

    const controls = row.locator("button");
    const count = await controls.count();
    expect(count, "the disabled row renders its retry + delete controls").toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(
        controls.nth(i),
        `row control ${i} is disabled when the FileUpload is disabled`,
      ).toBeDisabled();
    }
  });
});
