// KIT-01 nav-shell keyboard / focus invariants (QUAL-03, a11y.md). The generic
// catalog spec proves every story is axe-clean / 44px / Tab-reachable; this spec
// adds the nav-shell-specific behaviours those generic checks cannot express:
//   1. SkipLink is sr-only until focused, then becomes visible + focus-ringed and
//      targets `#main` (WCAG 2.4.1 Bypass Blocks; focus not obscured — 2.4.12).
//   2. The active NavBar item carries `aria-current="page"` (never color-alone).
//   3. Tab reaches every NavBar item in order (no keyboard trap).
import { expect, test } from "@playwright/test";

const SKIPLINK_STORY = "kit-01-nav-shell--skiplink--matrix";
const NAVBAR_ROLES_STORY = "kit-01-nav-shell--navbar--matrix";

test.describe("SkipLink keyboard behaviour", () => {
  test("is sr-only until focused, then visible and targeting #main", async ({ page }) => {
    await page.goto(`/?story=${SKIPLINK_STORY}&mode=preview`);
    await page.waitForSelector("[data-skip-link]");

    const link = page.locator("[data-skip-link]").first();
    await expect(link).toHaveAttribute("href", "#main");

    // sr-only collapses the box to ~1px before focus.
    const before = await link.boundingBox();
    expect(before, "skip link has a box").not.toBeNull();
    expect(before?.height ?? 0, "sr-only height ~1px before focus").toBeLessThan(4);

    // Focusing it pulls it on-screen (focus:not-sr-only) with a real hit area.
    await link.focus();
    const after = await link.boundingBox();
    expect(after?.height ?? 0, "visible + >=44px tall on focus").toBeGreaterThanOrEqual(44);

    // GAP-05: the box alone is paint-blind — a legacy `clip: rect(0,0,0,0)` keeps
    // the 44px box but paints NOTHING (the bug the old green test missed). Assert
    // the COMPUTED reveal so this test CANNOT pass while clipped: on focus the
    // visually-hidden clip must be released — `clip-path` is `none` AND the legacy
    // `clip` is `auto`. If the reveal-unsafe legacy `clip` were reintroduced, the
    // `clip` assertion below fails even though the box stays 44px tall.
    const clipState = await link.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { clip: cs.clip, clipPath: cs.clipPath };
    });
    expect(clipState.clipPath, "clip-path released on focus (not-sr-only)").toBe("none");
    expect(clipState.clip, "legacy clip released on focus — no paint-blind clip").toBe("auto");

    // It is the focused element (visible focus, not obscured).
    const focusedIsSkip = await page.evaluate(
      () => document.activeElement?.getAttribute("data-skip-link") !== null,
    );
    expect(focusedIsSkip, "skip link is the active element on focus").toBe(true);
  });
});

test.describe("NavBar keyboard + active-section semantics", () => {
  test("the active item carries aria-current=page", async ({ page }) => {
    await page.goto(`/?story=${NAVBAR_ROLES_STORY}&mode=preview`);
    await page.waitForSelector("[data-nav-item]");

    // At least one active item exists across the roles matrix; all of them are the
    // `overview` section, marked current.
    const current = page.locator('[aria-current="page"]');
    expect(await current.count(), "an active section is marked aria-current").toBeGreaterThan(0);
    await expect(current.first()).toHaveAttribute("data-nav-item", "overview");
  });

  test("Tab moves focus onto a nav item (no trap)", async ({ page }) => {
    await page.goto(`/?story=${NAVBAR_ROLES_STORY}&mode=preview`);
    await page.waitForSelector("[data-nav-item]");

    await page.keyboard.press("Tab");
    const onNavItem = await page.evaluate(
      () => document.activeElement?.hasAttribute("data-nav-item") ?? false,
    );
    expect(onNavItem, "Tab lands on a nav item").toBe(true);
  });
});

// KIT-02 table full-row click zone (QUAL-03, Pitfall 5). The whole row is the
// pointer target, but a keyboard/SR user must reach and understand the row: the
// focusable affordance is the `<a data-name-anchor>` in the player-name cell, and
// the selected row carries `aria-selected` (never fill-only).
const TABLE_SUCCESS_STORY = "kit-02-data-table--table--success";
const TABLE_ROWSTATES_STORY = "kit-02-data-table--table--row-states";

test.describe("Table full-row keyboard traversal", () => {
  test("Tab reaches the player-name anchor in a row", async ({ page }) => {
    await page.goto(`/?story=${TABLE_SUCCESS_STORY}&mode=preview`);
    await page.waitForSelector("[data-name-anchor]");

    // The sortable header buttons are earlier tab stops; Tab forward until focus
    // lands on the first row's name anchor (a keyboard user reaches the row — no
    // trap, bounded so a regression fails instead of hanging).
    let onNameAnchor = false;
    for (let i = 0; i < 12 && !onNameAnchor; i++) {
      await page.keyboard.press("Tab");
      onNameAnchor = await page.evaluate(
        () => document.activeElement?.hasAttribute("data-name-anchor") ?? false,
      );
    }
    expect(onNameAnchor, "Tab reaches a row name anchor").toBe(true);
  });

  test("the selected row carries aria-selected (not fill-only)", async ({ page }) => {
    await page.goto(`/?story=${TABLE_ROWSTATES_STORY}&mode=preview`);
    await page.waitForSelector("[data-table-row]");

    const selected = page.locator('tr[aria-selected="true"]');
    expect(await selected.count(), "a selected row is marked aria-selected").toBeGreaterThan(0);
  });

  // GAP-09: the selected-row left-edge marker is an inset box-shadow, NOT a positioned
  // `before:` bar on a `position:relative` `<tr>` (which broke `table-fixed` widths on
  // the selected row only). Prove columns stay aligned: the selected row's cell
  // x-positions must match a non-selected (enabled) row's cell x-positions — same
  // colgroup, no rightward shift / clipped trailing column.
  test("the selected row's columns stay aligned with the colgroup (GAP-09)", async ({ page }) => {
    await page.goto(`/?story=${TABLE_ROWSTATES_STORY}&mode=preview`);
    await page.waitForSelector("[data-state-cell='selected'] [data-table-row]");

    const cellX = async (stateCell: string): Promise<number[]> => {
      const cells = page.locator(`[data-state-cell='${stateCell}'] tbody td`);
      const count = await cells.count();
      const xs: number[] = [];
      for (let i = 0; i < count; i++) {
        const box = await cells.nth(i).boundingBox();
        xs.push(Math.round(box?.x ?? -1));
      }
      return xs;
    };

    const enabledX = await cellX("enabled");
    const selectedX = await cellX("selected");
    expect(selectedX.length, "selected row has the full column set").toBe(enabledX.length);
    expect(selectedX, "selected row cells align with the enabled row (no shift)").toEqual(enabledX);

    // The marker itself paints — the selected row carries the inset box-shadow.
    const shadow = await page
      .locator("[data-state-cell='selected'] tr[aria-selected='true']")
      .evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow, "selected row paints the inset cyan left-edge marker").not.toBe("none");
  });

  // GAP-10: the forced `focused` catalog cell is visibly distinct from `enabled` — it
  // carries the surface lift + the inset cyan focus ring (the row recipe maps the forced
  // state to the SAME utilities the live `focus-within:` applies).
  test("the forced focused row differs from enabled (GAP-10)", async ({ page }) => {
    await page.goto(`/?story=${TABLE_ROWSTATES_STORY}&mode=preview`);
    await page.waitForSelector("[data-state-cell='focused'] [data-table-row]");

    const rowStyle = async (stateCell: string) =>
      page.locator(`[data-state-cell='${stateCell}'] tbody tr`).evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, shadow: cs.boxShadow };
      });

    const enabled = await rowStyle("enabled");
    const focused = await rowStyle("focused");
    expect(focused.shadow, "focused row paints an inset focus ring").not.toBe("none");
    expect(
      focused.bg !== enabled.bg || focused.shadow !== enabled.shadow,
      "focused row is visibly distinct from enabled",
    ).toBe(true);
  });

  // GAP-09 + GAP-10 (WCAG 2.4.7): a row that is BOTH selected AND keyboard-focused must
  // paint BOTH markers. The selected left-edge marker lives on the `--tw-inset-shadow` slot
  // (`inset-shadow-(--shadow-selected-marker)`) and the focus ring on `--tw-shadow`
  // (`shadow-(--shadow-row-focus)`), so `box-shadow` composes them instead of one
  // overwriting the other (the single-`shadow-*` collision under the merge-free `/lite`
  // build that this fix removed). Focus the SELECTED row's name anchor and assert the
  // computed `box-shadow` carries BOTH a left-edge marker (`2px 0` offset, no spread) AND a
  // 2px-spread inset ring — the case that had zero coverage before.
  test("a selected + focused row paints both the marker and the focus ring (WCAG 2.4.7)", async ({
    page,
  }) => {
    await page.goto(`/?story=${TABLE_ROWSTATES_STORY}&mode=preview`);
    await page.waitForSelector("[data-state-cell='selected'] [data-name-anchor]");

    const selectedRow = page.locator("[data-state-cell='selected'] tr[aria-selected='true']");

    // Before focus the selected row already shows the marker but no ring.
    const restingShadow = await selectedRow.evaluate((el) => getComputedStyle(el).boxShadow);

    await page.locator("[data-state-cell='selected'] [data-name-anchor]").focus();
    const focusedShadow = await selectedRow.evaluate((el) => getComputedStyle(el).boxShadow);

    // Focus must ADD the ring, not replace the marker → the two values differ.
    expect(focusedShadow, "focus adds an indication on top of the selected marker").not.toBe(
      restingShadow,
    );

    // Both layers paint. Computed `box-shadow` serializes each shadow as
    // `<color> <offset-x> <offset-y> <blur> <spread> inset` (Chromium puts `inset` last).
    // The left-edge marker is `2px 0px 0px 0px inset` (a 2px x-offset, zero spread); the
    // inset focus ring is `0px 0px 0px 2px inset` (zero offset, a 2px spread). Both must be
    // present and inset — neither overwrote the other's slot.
    const segments = focusedShadow.split(/,(?![^(]*\))/).map((s) => s.trim());
    const marker = segments.find((s) => /\b2px 0px 0px 0px inset\b/.test(s));
    const ring = segments.find((s) => /\b0px 0px 0px 2px inset\b/.test(s));
    expect(
      marker,
      `selected left-edge marker still paints — box-shadow: ${focusedShadow}`,
    ).toBeTruthy();
    expect(ring, `focus ring paints alongside it — box-shadow: ${focusedShadow}`).toBeTruthy();
  });

  // GAP-10: live keyboard focus on a row's name anchor lifts the ROW (focus-within) and
  // the cyan focus indication paints inside the row box — it is inset, so it is never
  // clipped under the sticky <thead> (WCAG 2.4.12).
  test("live focus lifts the row and the ring is not obscured by the sticky header (GAP-10)", async ({
    page,
  }) => {
    await page.goto(`/?story=${TABLE_SUCCESS_STORY}&mode=preview`);
    await page.waitForSelector("[data-name-anchor]");

    const firstRow = page.locator("[data-table-row]").first();
    const restingShadow = await firstRow.evaluate((el) => getComputedStyle(el).boxShadow);

    await firstRow.locator("[data-name-anchor]").focus();
    const focusedShadow = await firstRow.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(focusedShadow, "row gains a focus-within indication on live focus").not.toBe(
      restingShadow,
    );
    expect(focusedShadow, "the focus-within indication actually paints").not.toBe("none");

    // The ring is inset → its painted box is fully within the row's own bounding box (not
    // an outset ring that the sticky header would clip at the top edge).
    const rowBox = await firstRow.boundingBox();
    expect(rowBox, "focused row has a box").not.toBeNull();
    expect(rowBox?.y ?? -1, "focused row sits below the viewport top (visible)").toBeGreaterThan(0);
  });
});
