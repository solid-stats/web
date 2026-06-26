// Form-layout + a11y/dead-code sweep regression (Plan 03-14 — GAP-12/13/15/16). The generic
// catalog/keyboard/responsive specs prove axe/44px/landmark reachability; this spec adds the
// four geometry + a11y contracts those cannot express, each RED on the pre-fix code:
//   • GAP-12 — the KIT-05 demo wrappers (`w-90` 360-wide block inside the story root `p-4`)
//     overflow the 360 floor; after the `w-full max-w-90` fix the story no longer scrolls
//     horizontally at 360 (mirrors responsive.spec's `noHorizontalScroll`).
//   • GAP-13 — the FileUpload accepted list (`item-group`) caps its height and scrolls
//     INTERNALLY (a realistic ~30-file list lives in a bounded window, not an unbounded page
//     growth), and a file-name row truncates (no horizontal row overflow).
//   • GAP-15 — at 360 a long-option Select listbox caps its width to the viewport (no
//     horizontal overflow) while STILL growing wider than the trigger (the grow is preserved).
//   • GAP-16 — the AsyncBoundary loading state carries a polite `role="status"` announcement
//     alongside the aria-hidden Skeleton so the load is announced to screen-reader users.
// DO-NOT-TOUCH (verified working, NOT asserted here): the Select grow-wider-than-trigger is
// only confirmed (the cap must not regress it), never the typeahead / placeholder behaviours.
import { expect, test } from "@playwright/test";

const MOBILE = { width: 360, height: 780 } as const;
const SELECTOR_TIMEOUT = 4000;

/** The document-level horizontal overflow at the current viewport (scrollWidth − clientWidth). */
async function documentOverflow(page: import("@playwright/test").Page): Promise<number> {
  return page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
}

// ── GAP-12 — the KIT-05 demo wrappers do not overflow the 360 floor ──────────────────────
// Pre-fix the Select/Stepper/FileUpload Matrix stories carry a `w-90` (360) RU-longest block
// inside the story root `p-4` (32) = 392px → the document scrolls horizontally at 360 (RED).
// The `w-full max-w-90` fix shrinks the block to the available width → no overflow (GREEN).
const KIT05_MATRIX_STORIES = [
  "kit-05-form--input--matrix",
  "kit-05-form--select--matrix",
  "kit-05-form--stepper--matrix",
  "kit-05-form--fileupload--matrix",
];

test.describe("GAP-12 KIT-05 stories do not overflow at the 360 floor", () => {
  test.use({ viewport: MOBILE });

  for (const story of KIT05_MATRIX_STORIES) {
    test(`${story} has no horizontal overflow at 360`, async ({ page }) => {
      await page.goto(`/?story=${story}&mode=preview`);
      // Wait for the real story content (the lazy chunk), not just `[data-storyloaded]` — the
      // latter fires on the shell while the loading ring is still up (geometry would be the ring).
      await page.waitForSelector("[data-state-matrix]");
      const overflow = await documentOverflow(page);
      expect(
        overflow,
        `${story}: scrollWidth must be <= clientWidth at the 360 floor`,
      ).toBeLessThanOrEqual(0);
    });
  }
});

// ── GAP-13 — the FileUpload accepted list is height-capped + scrolls internally ──────────
// Pre-fix the `many` cell holds 3 files in an UNBOUNDED `item-group` (no max-height, no
// internal scroll) → `scrollHeight === clientHeight` (RED). The fix caps the height with
// `overflow-y-auto` + a max-h token and bumps the fixture to ~30 files → the list scrolls
// inside the capped window (`scrollHeight > clientHeight`) without the page growing (GREEN).
test.describe("GAP-13 FileUpload list is bounded + scrolls internally", () => {
  test.use({ viewport: MOBILE });

  test("the many cell caps the item-group height and scrolls internally; rows truncate", async ({
    page,
  }) => {
    await page.goto(`/?story=kit-05-form--fileupload--matrix&mode=preview`);
    await page.waitForSelector('[data-state-cell="many"]');

    const group = page.locator('[data-state-cell="many"] [data-part="item-group"]').first();
    await group.waitFor({ state: "visible", timeout: SELECTOR_TIMEOUT });

    // Ark populates the controlled accepted rows asynchronously after mount — gate on a list
    // long enough to exceed any reasonable capped window before measuring its geometry.
    const rows = group.locator('[data-part="item"]');
    await expect(rows, "the many cell renders a realistic (~30) file list").toHaveCount(30);

    // The capped window scrolls INTERNALLY: its content is taller than its clipped box, and the
    // box advertises a vertical scroll container (overflow-y auto/scroll). Pre-fix (3 files, no
    // cap) the content fits → scrollHeight === clientHeight and overflow-y is visible → RED.
    const metrics = await group.evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      overflowY: getComputedStyle(el).overflowY,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(
      ["auto", "scroll"].includes(metrics.overflowY),
      `the item-group is a vertical scroll container (overflow-y=${metrics.overflowY})`,
    ).toBe(true);
    expect(
      metrics.scrollHeight,
      "the list content is taller than its capped window (scrolls internally)",
    ).toBeGreaterThan(metrics.clientHeight + 1);

    // The rows are width-bounded: the list never overflows horizontally (the file-name truncates).
    expect(
      metrics.scrollWidth - metrics.clientWidth,
      "the file rows truncate — no horizontal overflow",
    ).toBeLessThanOrEqual(0);
  });
});

// ── GAP-16 — the AsyncBoundary loading state announces via role="status" ─────────────────
// The Skeleton is `aria-hidden` (a screen reader skips it), so the loading INTENT must ride a
// polite live region the consumer resolves. Pre-fix the loading branch wraps only the
// aria-hidden Skeleton → no announcement (RED). The fix adds an sr-only `role="status"` label.
test.describe("GAP-16 AsyncBoundary loading is announced", () => {
  test("the loading state carries a non-empty polite role=status region", async ({ page }) => {
    await page.goto(`/?story=surf-18-global-state--asyncboundary--matrix&mode=preview`);
    await page.waitForSelector('[data-async-boundary="loading"]');

    const loading = page.locator('[data-async-boundary="loading"]').first();
    await expect(loading, "the loading cell renders").toBeVisible();

    const status = loading.locator('[role="status"]');
    await expect(status, "the loading state has a polite status region").toHaveCount(1);

    const text = (await status.first().textContent())?.trim() ?? "";
    expect(text.length, "the status region carries a resolved loading message").toBeGreaterThan(0);
  });
});

// ── GAP-15 — a long-option Select listbox is viewport-capped at 360 yet still grows ──────
// Pre-fix the `content` slot has `min-w-(--reference-width)` (grow) but NO max-width, so a very
// long option in a narrow trigger pushes the listbox wider than the 360 viewport (RED). The fix
// adds a token max-width cap so the listbox stays ≤ the floor while still wider than the trigger.
test.describe("GAP-15 Select listbox is viewport-capped at 360 (grow preserved)", () => {
  test.use({ viewport: MOBILE });

  test("the open long-option listbox is <= the viewport yet wider than the trigger", async ({
    page,
  }) => {
    await page.goto(`/?story=kit-05-form--select--long-option-cap&mode=preview`);
    await page.waitForSelector("[data-select]");

    const content = page.locator('[data-part="content"]').first();
    await content.waitFor({ state: "visible", timeout: SELECTOR_TIMEOUT });
    const trigger = page.locator('[data-part="trigger"]').first();

    const contentBox = await content.boundingBox();
    const triggerBox = await trigger.boundingBox();
    if (contentBox === null) throw new Error("the listbox content has no bounding box");
    if (triggerBox === null) throw new Error("the trigger has no bounding box");

    // Capped: the listbox never exceeds the 360 viewport (no horizontal overflow).
    expect(
      contentBox.width,
      "the listbox width is capped at the 360 viewport floor",
    ).toBeLessThanOrEqual(MOBILE.width);
    // Grow preserved (DO-NOT-TOUCH): the listbox still grows wider than the narrow trigger.
    expect(
      contentBox.width,
      "the listbox still grows wider than the trigger (grow-wider-than-trigger preserved)",
    ).toBeGreaterThan(triggerBox.width);

    // And nothing spills off the page at the floor.
    expect(await documentOverflow(page), "no document overflow at 360").toBeLessThanOrEqual(0);
  });
});
