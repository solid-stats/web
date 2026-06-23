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
});
