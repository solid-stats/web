// KIT-01 nav-shell responsive + landmark invariants + the large-screen data-container
// ceiling (QUAL-02 / QUAL-03 / GAP-21). Each describe sets its own viewport (the
// always-on `chromium` project is desktop), so every assertion is deterministic at the
// breakpoint under test:
//   1. AppShell + MobileTabBar never scroll horizontally (scrollWidth <= clientWidth).
//   2. AppShell emits the landmark order SkipLink → <header> → <main#main> → <nav>,
//      and the shell itself emits NO <h1> (the page owns the meaningful heading).
//   3. Reflow is container-keyed off `@5xl` (~1024px container): below it the
//      MobileTabBar is the visible primary nav and the desktop top nav is collapsed;
//      at/above it the desktop top nav is primary and the tabbar collapses.
//   4. The data/page container caps at the `--container` (1760px) ceiling and CENTERS
//      on ≥1920 screens — it must NOT stretch into the gutter (GAP-21).
//
// The responsive matrix is the design-system canonical tier set (design-system.md
// §"Breakpoints / design + test widths"): 360 · 768 · 1024 · 1280 · 1920 · 2560, plus
// 390/414 mobile spot-checks and a 3440 ultrawide cap-check. It is PARAMETRIZED off a
// width table (no hand-copied describe blocks). The 800 dead-zone probe is retained
// separately — it guards the `@5xl` nav-collapse reflow (GAP-03) and is not redundant
// with the canonical tiers.
import { expect, test } from "@playwright/test";

const APPSHELL_STORY = "kit-01-nav-shell--appshell--shell";
const MOBILETABBAR_STORY = "kit-01-nav-shell--mobiletabbar--matrix";

async function noHorizontalScroll(handle: import("@playwright/test").Locator) {
  const overflow = await handle.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow, "no horizontal overflow (scrollWidth <= clientWidth)").toBeLessThanOrEqual(0);
}

// The `@5xl` container breakpoint at which the desktop top nav appears (Tailwind
// `--container-5xl: 64rem` = 1024px). The AppShell `@container` is full-width in the
// story, so the container width ≈ the viewport width MINUS the scrollbar — meaning a
// viewport of EXACTLY 1024 yields a container a hair under 1024, so `@5xl:block`
// (min-width 1024) does NOT fire. The reflow is genuinely a container-width invariant,
// not a viewport one; the nav reliably flips to desktop only once the viewport clears
// the breakpoint (1280+). So `navMode` keys off `width > NAV_BREAKPOINT` (strict): the
// 1024 `lg` tier sits ON the boundary and is exercised as `mobile` (its no-scroll +
// landmark assertions still run), while 1280/1920/2560/3440 are `desktop`.
const NAV_BREAKPOINT = 1024;

// The data/page container ceiling (`--container: 1760px`, design-system.md). On screens
// wider than this the content caps here and centers; the gutters grow symmetrically.
const CONTAINER_CEILING = 1760;

type NavMode = "mobile" | "desktop";

// The canonical design/review tier set + the mobile spot-checks + the ultrawide
// cap-check. `navMode` is derived from the @5xl breakpoint; `note` documents the tier.
const TIERS = [
  { label: "360 mobile floor", width: 360, note: "QUAL-02 floor" },
  { label: "390 mobile spot-check", width: 390, note: "iPhone-class spot-check" },
  { label: "414 mobile spot-check", width: 414, note: "large-phone spot-check" },
  { label: "768 tablet portrait", width: 768, note: "md / iPad portrait" },
  {
    label: "1024 tablet landscape",
    width: 1024,
    note: "lg / on the @5xl boundary — container still < 1024",
  },
  { label: "1280 small desktop", width: 1280, note: "xl / data container ≈ full − padding" },
  { label: "1920 desktop default", width: 1920, note: "3xl / the modal desktop (~54%)" },
  { label: "2560 large desktop", width: 2560, note: "4xl / 2K" },
  {
    label: "3440 ultrawide",
    width: 3440,
    note: "ultrawide cap-check — container must not stretch",
  },
].map((tier) => ({
  ...tier,
  height: 900,
  navMode: (tier.width > NAV_BREAKPOINT ? "desktop" : "mobile") as NavMode,
}));

// ---- The parametrized canonical-tier matrix ----------------------------------------
for (const tier of TIERS) {
  test.describe(`AppShell @ ${tier.label} (${tier.width}px → ${tier.navMode} nav)`, () => {
    test.use({ viewport: { width: tier.width, height: tier.height } });

    test("no horizontal scroll on the shell or main", async ({ page }) => {
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

    test(`container-keyed reflow: ${tier.navMode} nav is primary`, async ({ page }) => {
      await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
      await page.waitForSelector("[data-app-shell]");

      const header = page.locator("[data-app-shell] header");
      const tabbar = page.locator("[data-mobile-nav] [data-tabbar]");
      if (tier.navMode === "desktop") {
        // At/above @5xl the desktop top nav is the visible primary; tabbar collapsed.
        await expect(header).toBeVisible();
        await expect(tabbar).toBeHidden();
      } else {
        // Below @5xl the mobile tabbar is the visible primary; desktop nav collapsed.
        await expect(tabbar).toBeVisible();
        await expect(header).toBeHidden();
      }
    });
  });
}

// ---- The large-screen data-container ceiling (GAP-21) -------------------------------
// On screens at/above the modal desktop width (1920) and the ultrawide cap (3440), the
// data/page content container must cap at the `--container` (1760px) ceiling and be
// CENTERED — the gutters grow symmetrically, the content width never exceeds the ceiling
// (it must NOT stretch into the gutter on wide screens). design-system.md: "container =
// 1760 ceiling, fluid below, then centers".
const CEILING_TIERS = [
  { label: "1920 desktop default", width: 1920 },
  { label: "2560 large desktop", width: 2560 },
  { label: "3440 ultrawide", width: 3440 },
];

for (const tier of CEILING_TIERS) {
  test.describe(`data container ceiling @ ${tier.label} (GAP-21)`, () => {
    test.use({ viewport: { width: tier.width, height: 900 } });

    test("content caps at ~1760 and centers (does not stretch into the gutter)", async ({
      page,
    }) => {
      await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
      await page.waitForSelector("[data-main-content]");

      const content = page.locator("[data-main-content]");
      const main = page.locator("[data-main]");
      const contentBox = await content.boundingBox();
      const mainBox = await main.boundingBox();
      expect(contentBox, "the measured content box exists").not.toBeNull();
      expect(mainBox, "the <main> box exists").not.toBeNull();
      if (contentBox === null || mainBox === null) return;

      // 1) The content width caps at the 1760 ceiling — it does NOT stretch to the
      //    viewport. A 1px tolerance covers sub-pixel layout rounding.
      expect(
        contentBox.width,
        "content width caps at the --container ceiling (does not stretch)",
      ).toBeLessThanOrEqual(CONTAINER_CEILING + 1);

      // 2) On these tiers the viewport is wider than the ceiling, so the content is
      //    strictly narrower than its <main> landmark — proving the cap actually bit
      //    (not merely that the content happened to fit).
      expect(
        contentBox.width,
        "content is capped below the full <main> width on a wide screen",
      ).toBeLessThan(mainBox.width);

      // 3) It is CENTERED — the left and right gutters between the content box and its
      //    <main> landmark are symmetric (within a 1px sub-pixel tolerance). `<main>`
      //    carries the side padding; `mx-auto` centers the content inside it.
      const leftGutter = contentBox.x - mainBox.x;
      const rightGutter = mainBox.x + mainBox.width - (contentBox.x + contentBox.width);
      expect(
        Math.abs(leftGutter - rightGutter),
        "the content is centered (symmetric gutters)",
      ).toBeLessThanOrEqual(1);
    });
  });
}

// ---- The 800px dead-zone probe (GAP-03 — retained, not redundant) ------------------
// A MID width between the mobile floor and the @5xl desktop breakpoint. The desktop nav
// must STAY collapsed here (no intermediate width shows a cramped/overflowing bar) — a
// distinct guarantee from the canonical tiers, which only sample 768 and 1024 around
// this band.
const DEAD_ZONE = { width: 800, height: 900 } as const;

test.describe("AppShell at the 800px dead-zone (GAP-03 nav-collapse probe)", () => {
  test.use({ viewport: DEAD_ZONE });

  test("desktop nav still collapsed, mobile tabbar primary", async ({ page }) => {
    await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
    await page.waitForSelector("[data-app-shell]");
    await expect(page.locator("[data-app-shell] header")).toBeHidden();
    await expect(page.locator("[data-mobile-nav] [data-tabbar]")).toBeVisible();
  });

  test("nothing overflows horizontally at the dead-zone width", async ({ page }) => {
    await page.goto(`/?story=${APPSHELL_STORY}&mode=preview`);
    await page.waitForSelector("[data-app-shell]");
    await noHorizontalScroll(page.locator("[data-app-shell]"));
    await noHorizontalScroll(page.locator("[data-main]"));
    await noHorizontalScroll(page.locator("[data-mobile-nav] [data-tabbar]"));
  });
});

// ---- MobileTabBar at the 360px floor ------------------------------------------------
const MOBILE = { width: 360, height: 780 } as const;

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

  // GAP-13: the inline name dropped `min-h-11`, so name + squad stack tightly. The ≥44px
  // hit area now comes from the ROW (`min-h-11` on the flex row). Assert both: the row box
  // is ≥44px tall AND the squad sits directly under the name (no ~44px inflated gap).
  test("the row keeps a >=44px hit area while name + squad stack tightly (GAP-13)", async ({
    page,
  }) => {
    await page.goto(`/?story=${COMPACTROW_STORY}&mode=preview`);
    await page.waitForSelector("[data-compact-row]");

    const firstRow = page.locator("[data-compact-row]").first();
    const rowBox = await firstRow.boundingBox();
    expect(
      rowBox?.height ?? 0,
      "the row is >=44px tall (hit area on the row)",
    ).toBeGreaterThanOrEqual(44);

    // name + squad stack tightly: the squad's top is within a few px of the name's
    // bottom (the old `min-h-11` on the name inflated this gap to ~44px). The squad is
    // the muted span that immediately follows the name anchor in the identity column.
    const nameBox = await firstRow.locator("[data-name-anchor]").boundingBox();
    const squadBox = await firstRow.locator("[data-name-anchor] + span").first().boundingBox();
    const gap = (squadBox?.y ?? 0) - ((nameBox?.y ?? 0) + (nameBox?.height ?? 0));
    expect(gap, "no inflated gap between the name and the squad").toBeLessThan(12);
  });
});

// GAP-12: the CompactRow/DataVolumes story renders each ×4 data-volume as a FULL-WIDTH
// labelled section at a ≤384px column — real rows render (not empty tall boxes in a
// narrow StateMatrix cell), and the caption stays a single line.
const COMPACTROW_VOLUMES_STORY = "kit-02-data-table--compactrow--data-volumes";

test.describe("CompactRow DataVolumes renders full-width (GAP-12)", () => {
  test("every labelled volume cell renders real rows; the caption does not wrap", async ({
    page,
  }) => {
    await page.goto(`/?story=${COMPACTROW_VOLUMES_STORY}&mode=preview`);
    await page.waitForSelector("[data-state-cell] [data-compact-row]");

    for (const label of ["few", "many", "limit", "single"]) {
      const cell = page.locator(`[data-state-cell='${label}']`);
      const rows = cell.locator("[data-compact-row]");
      expect(await rows.count(), `${label} cell renders real compact rows`).toBeGreaterThan(0);

      // The caption stays one line (it wrapped to 3 lines in the cramped StateMatrix cell).
      const caption = cell.locator("[data-compact-caption]");
      const box = await caption.boundingBox();
      const lineHeight = await caption.evaluate((el) =>
        parseFloat(getComputedStyle(el).lineHeight),
      );
      expect(box?.height ?? 0, `${label} caption is a single line`).toBeLessThan(lineHeight * 1.8);
    }
  });
});
