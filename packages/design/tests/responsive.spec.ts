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
// A desktop width comfortably above the RAISED @5xl (~1024px container) breakpoint
// (GAP-03) — at this width the brand + 6 section links + right cluster fit, so the
// desktop top nav appears.
const DESKTOP = { width: 1280, height: 900 } as const;
// A MID width between the mobile floor and the @5xl desktop breakpoint — the desktop
// nav is still collapsed here, and nothing the shell renders may overflow (GAP-03:
// no cramped/overflowing bar at any intermediate width).
const MID = { width: 800, height: 900 } as const;

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

  test("container-keyed reflow: mobile tabbar primary below @5xl", async ({ page }) => {
    await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
    await page.waitForSelector("[data-app-shell]");

    // Below the raised @5xl breakpoint the mobile tab bar is the visible primary nav.
    await expect(page.locator("[data-mobile-nav] [data-tabbar]")).toBeVisible();
    // The desktop top nav (its <header>) is collapsed at the 360px floor.
    await expect(page.locator("[data-app-shell] header")).toBeHidden();
  });
});

test.describe("AppShell at desktop width (>= @5xl)", () => {
  test.use({ viewport: DESKTOP });

  test("container-keyed reflow: desktop top nav primary, mobile tabbar collapsed", async ({
    page,
  }) => {
    await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
    await page.waitForSelector("[data-app-shell]");

    // At/above the raised @5xl breakpoint the desktop top nav is the visible primary.
    await expect(page.locator("[data-app-shell] header")).toBeVisible();
    // The mobile tab bar is collapsed.
    await expect(page.locator("[data-mobile-nav] [data-tabbar]")).toBeHidden();
  });
});

test.describe("AppShell at a mid width (below @5xl)", () => {
  test.use({ viewport: MID });

  test("desktop nav still collapsed, mobile tabbar primary (GAP-03)", async ({ page }) => {
    await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
    await page.waitForSelector("[data-app-shell]");
    // Between the mobile floor and the raised @5xl breakpoint the desktop top nav
    // stays collapsed — there is no intermediate width that shows a cramped bar.
    await expect(page.locator("[data-app-shell] header")).toBeHidden();
    await expect(page.locator("[data-mobile-nav] [data-tabbar]")).toBeVisible();
  });

  test("nothing overflows horizontally at the mid width (GAP-03)", async ({ page }) => {
    await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
    await page.waitForSelector("[data-app-shell]");
    await noHorizontalScroll(page.locator("[data-app-shell]"));
    await noHorizontalScroll(page.locator("[data-main]"));
    await noHorizontalScroll(page.locator("[data-mobile-nav] [data-tabbar]"));
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

  test("has exactly 5 tabs incl. the dedicated account/sign-in tab (GAP-04)", async ({ page }) => {
    await page.goto(`/?story=${MOBILETABBAR_STORY}&mode=preview`);
    await page.waitForSelector("[data-tabbar]");

    // The roles ×4 (RU/EN) matrix renders the full 4-section bars; the forced-state /
    // selected / disabled cells render 1-section bars. Filter to the full role bars by
    // the presence of the LAST section tab (`replays`), which only the 4-section bars
    // carry — each then = 4 sections + the dedicated account/sign-in tab.
    const fiveTabBars = await page
      .locator("[data-tabbar]")
      .filter({ has: page.locator('[data-tab="replays"]') })
      .all();
    expect(fiveTabBars.length, "the roles matrix renders multi-tab bars").toBeGreaterThan(0);

    for (const bar of fiveTabBars) {
      const tabCount = await bar.locator("[data-tab]").count();
      expect(tabCount, "exactly 4 section tabs + 1 account/sign-in tab").toBe(5);
      // The dedicated 5th tab is present — either the account entry or the sign-in.
      const accountOrSignIn = await bar
        .locator('[data-tab="account"], [data-tab="signin"]')
        .count();
      expect(accountOrSignIn, "the dedicated account/sign-in tab exists").toBe(1);
    }
  });
});

// KIT-02 CompactRow mobile layout at the 360px floor (QUAL-02). The mobile list is
// the `< md` reflow of the desktop scroll-in-card: top-N + «показать ещё · N»,
// secondary columns dropped, label-over-value — with NO horizontal scroll and NO
// nested scroll (the page scrolls). The `responsive.spec` asserts the floor.
const COMPACTROW_STORY = "kit-02-data-table--compactrow--mobile";

test.describe("CompactRow at the 360px floor", () => {
  test.use({ viewport: MOBILE });

  test("no horizontal scroll and no nested scroll in the mobile list", async ({ page }) => {
    await page.goto(`/?story=${COMPACTROW_STORY}&mode=preview`);
    await page.waitForSelector("[data-compact-list]");

    // The list itself never overflows horizontally at 360px.
    const list = page.locator("[data-compact-list]");
    await noHorizontalScroll(list);

    // No nested scroll: neither the list nor any row clips its own scroll area —
    // the page (document) scrolls, not an inner element (no scrollHeight overflow).
    const nested = await list.evaluate((el) => {
      const all = [el, ...Array.from(el.querySelectorAll("*"))];
      return all.some((node) => {
        const e = node as HTMLElement;
        const oy = getComputedStyle(e).overflowY;
        return (oy === "auto" || oy === "scroll") && e.scrollHeight > e.clientHeight + 1;
      });
    });
    expect(nested, "no nested vertical scroll container (the page scrolls)").toBe(false);
  });

  test("the show-more expander is present (top-N, not a full dump)", async ({ page }) => {
    await page.goto(`/?story=${COMPACTROW_STORY}&mode=preview`);
    await page.waitForSelector("[data-compact-list]");
    await expect(page.locator("[data-show-more]")).toBeVisible();
  });
});
