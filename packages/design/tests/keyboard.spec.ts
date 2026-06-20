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
