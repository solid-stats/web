// KIT-01 nav-shell responsive + landmark invariants (QUAL-02 / QUAL-03). Each
// describe sets its own viewport (the always-on `chromium` project is desktop), so
// the 360px-floor assertions are deterministic at the narrowest real breakpoint:
//   1. AppShell + MobileTabBar never scroll horizontally (scrollWidth <= clientWidth).
//   2. AppShell emits the landmark order SkipLink → <header> → <main#main> → <nav>,
//      and the shell itself emits NO <h1> (the page owns the meaningful heading).
//   3. Reflow is container-keyed: below @md the MobileTabBar is visible and the
//      desktop top nav is collapsed.
import { expect, test } from "@playwright/test";

const APPSHELL_STORY = "kit-01-nav-shell--appshell--shell";
const MOBILETABBAR_STORY = "kit-01-nav-shell--mobiletabbar--matrix";

async function noHorizontalScroll(handle: import("@playwright/test").Locator) {
  const overflow = await handle.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow, "no horizontal overflow (scrollWidth <= clientWidth)").toBeLessThanOrEqual(0);
}

// The real 360px mobile floor (QUAL-02) — set explicitly so the reflow assertions
// are deterministic regardless of the always-on `chromium` project's viewport.
const MOBILE = { width: 360, height: 780 } as const;
// A desktop width comfortably above the @md (768px) container breakpoint.
const DESKTOP = { width: 1280, height: 900 } as const;

test.describe("AppShell at the 360px floor", () => {
  test.use({ viewport: MOBILE });

  test("no horizontal scroll", async ({ page }) => {
    await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
    await page.waitForSelector("[data-app-shell]");
    await noHorizontalScroll(page.locator("[data-app-shell]"));
    await noHorizontalScroll(page.locator("[data-main]"));
  });

  test("emits the landmark order SkipLink -> header -> main#main -> mobile nav", async ({
    page,
  }) => {
    await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
    await page.waitForSelector("[data-app-shell]");

    // DOM order of the landmark hooks inside the shell.
    const order = await page.locator("[data-app-shell]").evaluate((shell) => {
      const marks = ["[data-skip-link]", "header", "main#main", "[data-mobile-nav]"];
      return marks.map((sel) => {
        const el = shell.querySelector(sel);
        if (el === null) return -1;
        // index of this element in a flat document-order walk of the shell
        const all = Array.from(shell.querySelectorAll("*"));
        return all.indexOf(el);
      });
    });
    // Every landmark is present (no -1) and appears in strictly increasing order.
    expect(
      order.every((i) => i >= 0),
      "all four landmarks present",
    ).toBe(true);
    const sorted = [...order].sort((a, b) => a - b);
    expect(order, "landmarks in skip -> header -> main -> mobile-nav order").toEqual(sorted);

    // The shell emits no meaningful <h1> — that is the page's job. The placeholder
    // page content supplies its own <h1>; assert none sits OUTSIDE <main>.
    const h1OutsideMain = await page.locator("[data-app-shell] > :not([data-main]) h1").count();
    expect(h1OutsideMain, "shell chrome emits no <h1>").toBe(0);
  });

  test("container-keyed reflow: mobile tabbar primary below @md", async ({ page }) => {
    await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
    await page.waitForSelector("[data-app-shell]");

    // Below @md the mobile tab bar is the visible primary nav.
    await expect(page.locator("[data-mobile-nav] [data-tabbar]")).toBeVisible();
    // The desktop top nav (its <header>) is collapsed at the 360px floor.
    await expect(page.locator("[data-app-shell] header")).toBeHidden();
  });
});

test.describe("AppShell at desktop width (>= @md)", () => {
  test.use({ viewport: DESKTOP });

  test("container-keyed reflow: desktop top nav primary, mobile tabbar collapsed", async ({
    page,
  }) => {
    await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
    await page.waitForSelector("[data-app-shell]");

    // At/above @md the desktop top nav (its <header>) is the visible primary nav.
    await expect(page.locator("[data-app-shell] header")).toBeVisible();
    // The mobile tab bar is collapsed.
    await expect(page.locator("[data-mobile-nav] [data-tabbar]")).toBeHidden();
  });
});

test.describe("MobileTabBar at the 360px floor", () => {
  test.use({ viewport: MOBILE });

  test("no horizontal scroll across the roles matrix", async ({ page }) => {
    await page.goto(`/?story=${MOBILETABBAR_STORY}&mode=preview`);
    await page.waitForSelector("[data-tabbar]");
    for (const bar of await page.locator("[data-tabbar]").all()) {
      await noHorizontalScroll(bar);
    }
  });
});
