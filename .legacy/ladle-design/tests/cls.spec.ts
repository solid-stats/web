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

// Skeleton (KIT-07 / QUAL-04): a table skeleton must reserve the EXACT final-table
// dimensions so the skeleton→data swap shifts nothing. The Proof story renders the
// table skeleton (`[data-cls-skeleton]`) above a real table (`[data-cls-final]`)
// built from the identical colgroup + density ROW_H — their box heights must match.
const SKELETON_STORY = "kit-07-feedback--skeleton--proof";

test.describe("Skeleton CLS = 0", () => {
  test("table skeleton reserves the same height as the final table", async ({ page }) => {
    await page.goto(`/?story=${SKELETON_STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    const skeleton = page.locator('[data-cls-skeleton] [data-skeleton="table"]');
    const final = page.locator("[data-cls-final] > div");

    await expect(skeleton).toBeVisible();
    await expect(final).toBeVisible();

    const skeletonBox = await skeleton.boundingBox();
    const finalBox = await final.boundingBox();

    expect(skeletonBox, "skeleton table has a box").not.toBeNull();
    expect(finalBox, "final table has a box").not.toBeNull();
    // Heights and widths must match exactly — the skeleton holds the layout (CLS = 0).
    expect(skeletonBox?.height).toBe(finalBox?.height);
    expect(skeletonBox?.width).toBe(finalBox?.width);

    // GAP-08: the table skeleton must NEVER scroll — its reserved box fits header + N
    // rows exactly (border-box hairlines), so scrollHeight does not exceed clientHeight.
    const skeletonOverflow = await skeleton.evaluate((el) => el.scrollHeight - el.clientHeight);
    expect(
      skeletonOverflow,
      "skeleton table does not scroll (scrollHeight <= clientHeight)",
    ).toBeLessThanOrEqual(0);
  });
});

// Table (KIT-02 / QUAL-04): the data-table loading state swaps in the Skeleton
// table variant reproducing the EXACT colgroup + header + N×ROW_H, so the
// skeleton→data swap shifts nothing. The Cls story renders the loading table
// (`[data-cls-table-skeleton]`) above the data table (`[data-cls-table-final]`)
// built from the identical columns + density + visibleRows — their card box
// heights and widths must match exactly (CLS = 0).
const TABLE_STORY = "kit-02-data-table--table--cls";

test.describe("Table CLS = 0", () => {
  test("loading table reserves the same box as the data table", async ({ page }) => {
    await page.goto(`/?story=${TABLE_STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    const skeleton = page.locator("[data-cls-table-skeleton] [data-table-card]");
    const final = page.locator("[data-cls-table-final] [data-table-card]");

    await expect(skeleton).toBeVisible();
    await expect(final).toBeVisible();

    const skeletonBox = await skeleton.boundingBox();
    const finalBox = await final.boundingBox();

    expect(skeletonBox, "loading table has a box").not.toBeNull();
    expect(finalBox, "data table has a box").not.toBeNull();
    // The reserved-viewport card holds the layout — heights and widths match (CLS = 0).
    expect(skeletonBox?.height).toBe(finalBox?.height);
    expect(skeletonBox?.width).toBe(finalBox?.width);

    // GAP-08: NEITHER the data-table viewport NOR the loading skeleton viewport may show
    // a stray scrollbar — the border-box hairline math fits header + N rows exactly, so
    // scrollHeight never exceeds clientHeight on either viewport.
    const dataViewport = page.locator("[data-cls-table-final] [data-table-viewport]");
    const loadingViewport = page.locator("[data-cls-table-skeleton] [data-table-viewport]");
    const dataOverflow = await dataViewport.evaluate((el) => el.scrollHeight - el.clientHeight);
    const loadingOverflow = await loadingViewport.evaluate(
      (el) => el.scrollHeight - el.clientHeight,
    );
    expect(
      dataOverflow,
      "data table viewport does not scroll (scrollHeight <= clientHeight)",
    ).toBeLessThanOrEqual(0);
    expect(
      loadingOverflow,
      "loading skeleton viewport does not scroll (scrollHeight <= clientHeight)",
    ).toBeLessThanOrEqual(0);
  });
});

// StatTile (KIT-03 / GAP-16 / QUAL-04): a delta-bearing StatTile renders a third
// (`text-sm` delta) line, so its loading skeleton must reserve that delta row — else a
// delta tile is TALLER than its skeleton and the skeleton→tile swap shifts the layout.
// The Proof story renders the `withDelta` skeleton above a delta StatTile, and the plain
// skeleton above a no-delta StatTile; each pair's box heights must match exactly (CLS = 0).
const STAT_TILE_STORY = "kit-03-stat--stattile--proof";

test.describe("StatTile CLS = 0", () => {
  test("delta-tile skeleton reserves the same box height as the final delta tile", async ({
    page,
  }) => {
    await page.goto(`/?story=${STAT_TILE_STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    // GAP-16: the withDelta skeleton vs. the delta-bearing StatTile.
    const deltaSkeleton = page.locator('[data-cls-tile-delta-skeleton] [data-skeleton="tile"]');
    const deltaFinal = page.locator("[data-cls-tile-delta-final] [data-stat-tile]");

    await expect(deltaSkeleton).toBeVisible();
    await expect(deltaFinal).toBeVisible();

    const deltaSkeletonBox = await deltaSkeleton.boundingBox();
    const deltaFinalBox = await deltaFinal.boundingBox();

    expect(deltaSkeletonBox, "delta skeleton has a box").not.toBeNull();
    expect(deltaFinalBox, "delta tile has a box").not.toBeNull();
    // The withDelta skeleton holds the delta tile's layout — heights match (CLS = 0).
    expect(deltaSkeletonBox?.height).toBe(deltaFinalBox?.height);
  });

  test("plain-tile skeleton still matches the no-delta tile box height (no regression)", async ({
    page,
  }) => {
    await page.goto(`/?story=${STAT_TILE_STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    const plainSkeleton = page.locator('[data-cls-tile-plain-skeleton] [data-skeleton="tile"]');
    const plainFinal = page.locator("[data-cls-tile-plain-final] [data-stat-tile]");

    await expect(plainSkeleton).toBeVisible();
    await expect(plainFinal).toBeVisible();

    const plainSkeletonBox = await plainSkeleton.boundingBox();
    const plainFinalBox = await plainFinal.boundingBox();

    expect(plainSkeletonBox, "plain skeleton has a box").not.toBeNull();
    expect(plainFinalBox, "plain tile has a box").not.toBeNull();
    // The compact tile skeleton equals the no-delta tile box (CLS = 0).
    expect(plainSkeletonBox?.height).toBe(plainFinalBox?.height);
  });
});

// Sparkline (KIT-03 / D-03 / QUAL-04): the dependency-free DOM-bar chart reserves a
// FIXED height regardless of the value count, so changing the data volume shifts
// nothing. The Cls story renders an empty (flat-baseline) sparkline above a 10-week
// "many" sparkline of the same width — their figure box heights must match exactly.
const SPARKLINE_STORY = "kit-03-stat--sparkline--cls";

test.describe("Sparkline CLS = 0", () => {
  test("empty and many sparklines reserve the same height", async ({ page }) => {
    await page.goto(`/?story=${SPARKLINE_STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    const empty = page.locator("[data-cls-spark-empty] [data-sparkline]");
    const many = page.locator("[data-cls-spark-many] [data-sparkline]");

    await expect(empty).toBeVisible();
    await expect(many).toBeVisible();

    const emptyBox = await empty.boundingBox();
    const manyBox = await many.boundingBox();

    expect(emptyBox, "empty sparkline has a box").not.toBeNull();
    expect(manyBox, "many sparkline has a box").not.toBeNull();
    // Heights must match exactly — the fixed h-10 row holds the layout (CLS = 0).
    expect(emptyBox?.height).toBe(manyBox?.height);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SURF-18 AsyncBoundary (D-05 / GAP-03) — the state→primitive seam maps the global states
// to the right Phase-2 primitive (Skeleton / EmptyState / ErrorState / DataTrustBanner).
// GAP-03 rewrote this block: the old oracle measured the `[data-async-cell]` `h-64` cage
// (every cell equal at 256px → trivially green = FALSE-GREEN) and over-claimed "all six
// states the same reserved height as ready" — lumping the 40px status banners in with the
// content region. The corrected oracle measures the ROUTED `[data-async-boundary]` primitive
// and scopes the claim per the SURF-18 spec re-scope (03-UI-SPEC.md):
//   • CONTENT-REGION states (loading / empty / error / ready) — the CLS-equality SET. The
//     swap users actually see is loading↔ready, which MUST be byte-for-byte equal (the 1px
//     hairline the human caught: framed Skeleton table ≡ the real KIT-02 Table). empty / error
//     reserve their own content-region min-height (EmptyState / ErrorState `min-h-48`), an
//     intentional content-sized reservation — present and non-zero, not forced to the table box.
//   • STATUS BANNERS (offline / reconnecting / stale) — a SEPARATE 40px block role, NOT
//     height-compared to the content region; their CLS guarantee is the DataTrustBanner
//     reserved-height invariant asserted in the DataTrustBanner CLS block above.
//   Wave (SURF-18) → block `AsyncBoundary CLS = 0` → story surf-18-global-state--asyncboundary--cls
// ═══════════════════════════════════════════════════════════════════════════════
const ASYNC_BOUNDARY_STORY = "surf-18-global-state--asyncboundary--cls";
const CONTENT_REGION_STATES = ["loading", "empty", "error", "ready"] as const;
const BANNER_STATES = ["offline", "reconnecting", "stale"] as const;

test.describe("AsyncBoundary CLS = 0", () => {
  test("loading reserves byte-for-byte the same box height as ready (the content swap)", async ({
    page,
  }) => {
    await page.goto(`/?story=${ASYNC_BOUNDARY_STORY}&mode=preview`);
    await page.waitForSelector("[data-async-boundary='ready']");

    // Measure the ROUTED primitive, not the wrapper cage. loading↔ready is the swap the user
    // sees; the boxes must match EXACTLY (the 1px hairline GAP-03 caught).
    const loading = page.locator("[data-async-boundary='loading']");
    const ready = page.locator("[data-async-boundary='ready']");

    await expect(loading, "loading boundary renders").toBeVisible();
    await expect(ready, "ready boundary renders").toBeVisible();

    const loadingBox = await loading.boundingBox();
    const readyBox = await ready.boundingBox();

    expect(loadingBox, "loading boundary has a box").not.toBeNull();
    expect(readyBox, "ready boundary has a box").not.toBeNull();
    // EXACT — the loading Skeleton's framed table box equals the ready KIT-02 Table box (CLS = 0).
    expect(loadingBox?.height, "loading height === ready height (no 1px shift)").toBe(
      readyBox?.height,
    );
    expect(loadingBox?.width, "loading width === ready width").toBe(readyBox?.width);
  });

  test("every content-region state renders its routed primitive with a reserved box", async ({
    page,
  }) => {
    await page.goto(`/?story=${ASYNC_BOUNDARY_STORY}&mode=preview`);
    await page.waitForSelector("[data-async-boundary='ready']");

    // Each content-region state reserves real height (no zero-height collapse). loading/ready
    // are the equality set asserted above; empty/error are intentionally content-sized — here we
    // only assert they render their routed primitive and reserve a non-zero box.
    for (const state of CONTENT_REGION_STATES) {
      const boundary = page.locator(`[data-async-boundary='${state}']`);
      await expect(boundary, `${state} content-region boundary renders`).toBeVisible();
      const box = await boundary.boundingBox();
      if (box === null) throw new Error(`${state} content-region boundary has no bounding box`);
      expect(box.height, `${state} reserves a non-zero content box`).toBeGreaterThan(0);
    }
  });

  test("status banners are a separate 40px block role, not height-compared to the content region", async ({
    page,
  }) => {
    await page.goto(`/?story=${ASYNC_BOUNDARY_STORY}&mode=preview`);
    await page.waitForSelector("[data-async-boundary='ready']");

    // The banners reserve the DataTrustBanner `h-10` block (the DataTrustBanner CLS block proves
    // the reserved-height invariant). Here: each renders + reserves a non-zero box, and the three
    // banner kinds reserve the SAME height as each other — but they are NOT compared to the table
    // content region (that was the over-claim GAP-03 removed).
    const heights: number[] = [];
    for (const state of BANNER_STATES) {
      const boundary = page.locator(`[data-async-boundary='${state}']`);
      await expect(boundary, `${state} banner boundary renders`).toBeVisible();
      const box = await boundary.boundingBox();
      if (box === null) throw new Error(`${state} banner boundary has no bounding box`);
      expect(box.height, `${state} banner reserves a non-zero box`).toBeGreaterThan(0);
      heights.push(box.height);
    }
    // The banner family reserves one consistent block height (its own invariant).
    for (const h of heights)
      expect(h, "all banner kinds reserve the same block height").toBe(heights[0]);
  });
});
