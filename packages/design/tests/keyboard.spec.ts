// KIT-01 nav-shell keyboard / focus invariants (QUAL-03, a11y.md). The generic
// catalog spec proves every story is axe-clean / 44px / Tab-reachable; this spec
// adds the nav-shell-specific behaviours those generic checks cannot express:
//   1. SkipLink is sr-only until focused, then becomes visible + focus-ringed and
//      targets `#main` (WCAG 2.4.1 Bypass Blocks; focus not obscured — 2.4.12).
//   2. The active NavBar item carries `aria-current="page"` (never color-alone).
//   3. Tab reaches every NavBar item in order (no keyboard trap).
//
// ─────────────────────────────────────────────────────────────────────────────
// WAVE-0 RED SCAFFOLDS (Plan 03-01 Task 4 — Nyquist contract). The `describe`
// blocks at the BOTTOM of this file assert the interactive-primitive behaviours
// (overlay focus management, menu/tab ARIA, form live-region) that the generic
// `catalog.spec.ts` cannot express. They reference story ids that DO NOT EXIST
// YET — each block is RED until its owning wave lands its story; turning a block
// GREEN is that wave's acceptance gate. No `.skip` (a skipped scaffold is a
// no-op); RED-by-design. Wave → block → story-id map (the dependency set):
//   • Wave (KIT-06 Overlay) — `Dialog Esc-close + return-focus`   → kit-06-overlay--dialog--playground (GREEN 03-05)
//   • Wave (KIT-06 Overlay) — `Menu aria-expanded/aria-controls`  → kit-06-overlay--menu--playground (GREEN 03-06)
//   • Wave (KIT-06 Overlay) — `Tabs arrow-key roving tabindex`    → kit-06-overlay--tabs--playground (GREEN 03-06)
//   • Wave (KIT-06 Overlay) — `Dialog trap-free Tab cycle`        → kit-06-overlay--dialog--playground (GREEN 03-05)
//   • Wave (KIT-05 Form)    — `Field forced-invalid live error`   → kit-05-form--field--matrix (GREEN 03-02)
// (AsyncBoundary CLS=0 — SURF-18 Wave 7 — lives in cls.spec.ts.)
// ─────────────────────────────────────────────────────────────────────────────
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
        // No `?? -1` sentinel — a missing box is itself a failure, asserted explicitly
        // with the column index so the message localizes the regression.
        if (box === null) throw new Error(`${stateCell} cell ${i} has no bounding box`);
        xs.push(box.x);
      }
      return xs;
    };

    const enabledX = await cellX("enabled");
    const selectedX = await cellX("selected");
    expect(selectedX.length, "selected row has the full column set").toBe(enabledX.length);
    // Compare UNROUNDED x with a sub-pixel tolerance: a ≤0.5px colgroup drift on the
    // selected row (the exact `table-fixed` regression GAP-09 guards) must FAIL, not be
    // rounded away to integer-pixel equality.
    for (const [i, selX] of selectedX.entries()) {
      const enX = enabledX[i] ?? Number.NaN;
      expect(
        Math.abs(selX - enX),
        `selected cell ${i} aligns with the enabled colgroup (no sub-pixel shift)`,
      ).toBeLessThan(0.5);
    }

    // The marker itself paints — the selected row carries the inset box-shadow.
    const shadow = await page
      .locator("[data-state-cell='selected'] tr[aria-selected='true']")
      .evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow, "selected row paints the inset cyan left-edge marker").not.toBe("none");
  });

  // GAP-10: the forced `focused` catalog cell is visibly distinct from `enabled` — it
  // carries the surface lift + the inset cyan focus ring (the row recipe maps the forced
  // state to the SAME utilities the live `:has(:focus-visible)` applies).
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

  // GAP-10: live keyboard focus on a row's name anchor lifts the ROW (:has(:focus-visible)) and
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
    expect(focusedShadow, "row gains a focus-visible indication on live focus").not.toBe(
      restingShadow,
    );
    expect(focusedShadow, "the focus-visible indication actually paints").not.toBe("none");

    // Strong oracle for the GAP-10 rationale: the ring MUST be inset. An inset ring paints
    // INSIDE the row's client box, so the sticky `<thead>` (which overlaps the row's TOP
    // edge when the row scrolls under it) cannot clip it. A regression to an OUTSET
    // (clippable) ring — the exact failure GAP-10 guards — would drop `inset` here and fail.
    expect(
      focusedShadow,
      `focus ring is inset (paints inside the row box, unclippable by the sticky header) — box-shadow: ${focusedShadow}`,
    ).toContain("inset");

    // Geometry corroboration: scroll the focused row up until it sits partially UNDER the
    // sticky `<thead>`, then assert the ring still paints within the row's own client box —
    // i.e. the row's painted top edge is below the sticky header's bottom edge, so the inset
    // ring is not obscured (WCAG 2.4.12). Only meaningful when the viewport actually scrolls;
    // a non-scrolling fixture can never put a row under the header, so guard on it.
    const viewport = page.locator("[data-table-viewport]");
    const canScroll = await viewport.evaluate((el) => el.scrollHeight > el.clientHeight + 1);
    if (canScroll) {
      // Scroll a later row to the top so it tucks under the sticky header, then focus it.
      const probeRow = page.locator("[data-table-row]").last();
      await probeRow.scrollIntoViewIfNeeded();
      await probeRow.locator("[data-name-anchor]").focus();

      const theadBottom = await page
        .locator("[data-table] thead")
        .evaluate((el) => el.getBoundingClientRect().bottom);
      const probeBox = await probeRow.boundingBox();
      if (probeBox === null) throw new Error("probed focused row has no bounding box");
      // The row's painted top is at or below the sticky header's bottom edge → the inset
      // ring's top edge paints in visible space, never under the `<thead>` band.
      expect(
        probeBox.y,
        "focused row's top is not hidden behind the sticky header (ring unclipped)",
      ).toBeGreaterThanOrEqual(theadBottom - 0.5);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// WAVE-0 RED SCAFFOLDS — the interactive-primitive behaviour contracts the later
// waves must satisfy. Each block navigates to a story id that does not exist yet,
// so `page.goto` loads a "story not found" shell and the first `waitForSelector`
// times out → the test FAILS (RED). When the owning wave ships the story with the
// asserted `data-*` hooks and ARIA, the block turns GREEN — that is the wave's
// acceptance gate. Tight per-block timeouts keep RED fast instead of hanging on
// the default 30s wait against the missing selector.
// ═══════════════════════════════════════════════════════════════════════════════

// KIT-06 Overlay / Dialog (SC#1, a11y.md — prefer the Ark `Dialog` primitive). GREEN as of
// Plan 03-05: the `Dialog` slice ships the `kit-06-overlay--dialog--playground` story (the lone
// INTERACTIVE Dialog — the Matrix forced-open cell renders a portalled modal whose focus trap
// would intercept events, so live keyboard runs against the Playground; the Matrix serves the
// static axe gate, the Select/FileUpload precedent). Two invariants the generic axe pass cannot
// express: Esc closes the dialog AND focus RETURNS to the trigger (WCAG 2.4.3 Focus Order /
// 2.1.2 No Keyboard Trap), and an open dialog does not trap Tab (a bounded forward cycle stays
// inside the dialog and never escapes to the page chrome).
const DIALOG_STORY = "kit-06-overlay--dialog--playground";
const SELECTOR_TIMEOUT = 4000;

test.describe("KIT-06 Dialog keyboard behaviour (Plan 03-05 GREEN)", () => {
  test("Esc closes the dialog and focus returns to the trigger", async ({ page }) => {
    await page.goto(`/?story=${DIALOG_STORY}&mode=preview`);
    await page.waitForSelector("[data-dialog-trigger]", { timeout: SELECTOR_TIMEOUT });

    const trigger = page.locator("[data-dialog-trigger]").first();
    await trigger.click();

    // The dialog content is open and focus has moved inside it.
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Wait for Ark to settle the initial focus INSIDE the content before pressing Esc — the
    // `closeOnEscape` dismissable listener is armed as focus lands in the dialog, so a global
    // keydown fired in the same frame as the open can race ahead of it. Polling for focus-inside
    // is the deterministic gate (a fixed sleep would be flaky); it also asserts the focus-move.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const d = document.querySelector('[role="dialog"]');
          return d !== null && d.contains(document.activeElement);
        }),
      )
      .toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog, "Esc closes the dialog").toBeHidden();

    // WCAG 2.4.3: focus is restored to the opening trigger. POLL the live activeElement for the
    // trigger hook — restoreFocus lands a frame after the close transition, and the controlled
    // close re-renders the trigger subtree, so an identity check against the captured handle is
    // unstable; the hook on activeElement is the stable oracle.
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.hasAttribute("data-dialog-trigger") ?? false),
      )
      .toBe(true);
  });

  test("an open dialog does not trap Tab outside its focus scope", async ({ page }) => {
    await page.goto(`/?story=${DIALOG_STORY}&mode=preview`);
    await page.waitForSelector("[data-dialog-trigger]", { timeout: SELECTOR_TIMEOUT });

    await page.locator("[data-dialog-trigger]").first().click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Gate on focus settling INSIDE the dialog before Tabbing — otherwise the first Tab can fire
    // while focus is still on the trigger (outside), falsely reading as an escape (a parallel-load
    // race). Polling is the deterministic gate.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const d = document.querySelector('[role="dialog"]');
          return d !== null && d.contains(document.activeElement);
        }),
      )
      .toBe(true);

    // Tab forward a bounded number of times; every stop must remain INSIDE the
    // dialog (Ark's focus trap cycles within scope — it never lets focus leak to
    // the page behind the inert backdrop). Bounded so a regression FAILS, never hangs.
    let everEscaped = false;
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const insideDialog = await page.evaluate(() => {
        const active = document.activeElement;
        const dlg = document.querySelector('[role="dialog"]');
        return dlg !== null && active !== null && dlg.contains(active);
      });
      if (!insideDialog) everEscaped = true;
    }
    expect(everEscaped, "Tab focus stays scoped inside the open dialog (trap-free cycle)").toBe(
      false,
    );
  });

  // carried_forward tree-shake guard (the Phase-1 dark-base lesson — a class only on the
  // GlobalProvider was `@source`-scanned away): the PORTALLED dialog content must actually
  // PAINT its recipe, not render unstyled. Assert the open content carries a real surface fill
  // (the `bg-surface-1` token resolved to a non-transparent computed background) — a tree-shaken
  // recipe would leave it transparent (RESEARCH Pitfall 3).
  test("the portalled dialog content paints its recipe (not tree-shaken)", async ({ page }) => {
    await page.goto(`/?story=${DIALOG_STORY}&mode=preview`);
    await page.waitForSelector("[data-dialog-trigger]", { timeout: SELECTOR_TIMEOUT });

    await page.locator("[data-dialog-trigger]").first().click();
    const content = page.locator("[data-dialog]");
    await expect(content).toBeVisible();

    const bg = await content.evaluate((el) => getComputedStyle(el).backgroundColor);
    // A painted surface fill is opaque + non-empty; a tree-shaken recipe leaves it transparent.
    expect(bg, `dialog content paints a surface fill — got ${bg}`).not.toBe("rgba(0, 0, 0, 0)");
    expect(bg).not.toBe("transparent");
  });
});

// KIT-06 Overlay / Popover (SC#1, a11y.md — prefer the Ark `Popover` primitive). GREEN as of
// Plan 03-05: the `Popover` slice ships `kit-06-overlay--popover--playground` (the lone
// INTERACTIVE Popover; the Matrix forced-open cell serves the static axe gate). The NON-modal
// counterpart to the Dialog: Esc closes it AND focus RETURNS to the trigger (WCAG 2.4.3), but —
// unlike the modal Dialog — it does NOT trap Tab (it never inerts the page; Tab leaves the
// panel and focus stays on a real, reachable control). These are the invariants the generic
// catalog axe pass cannot express.
const POPOVER_STORY = "kit-06-overlay--popover--playground";

test.describe("KIT-06 Popover keyboard behaviour (Plan 03-05 GREEN)", () => {
  test("Esc closes the popover and focus returns to the trigger", async ({ page }) => {
    await page.goto(`/?story=${POPOVER_STORY}&mode=preview`);
    await page.waitForSelector("[data-popover-trigger]", { timeout: SELECTOR_TIMEOUT });

    const trigger = page.locator("[data-popover-trigger]").first();
    await trigger.click();

    const content = page.locator("[data-popover]");
    await expect(content).toBeVisible();

    // Wait for focus to settle inside the panel before Esc (same dismissable-listener arm race
    // as the Dialog — a global keydown in the open frame can outrun the listener attach).
    await expect
      .poll(() =>
        page.evaluate(() => {
          const p = document.querySelector("[data-popover]");
          return p !== null && p.contains(document.activeElement);
        }),
      )
      .toBe(true);

    await page.keyboard.press("Escape");
    await expect(content, "Esc closes the popover").toBeHidden();

    // WCAG 2.4.3: focus is restored to the opening trigger — POLL the live activeElement for the
    // hook (restoreFocus lands a frame after close; the controlled close re-renders the subtree).
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.hasAttribute("data-popover-trigger") ?? false),
      )
      .toBe(true);
  });

  test("an open popover does NOT trap Tab (non-modal — focus leaves the panel)", async ({
    page,
  }) => {
    await page.goto(`/?story=${POPOVER_STORY}&mode=preview`);
    await page.waitForSelector("[data-popover-trigger]", { timeout: SELECTOR_TIMEOUT });

    await page.locator("[data-popover-trigger]").first().click();
    const panel = page.locator("[data-popover]");
    await expect(panel).toBeVisible();

    // Wait for focus to settle inside the panel, then prove it is NOT trapped: unlike the modal
    // Dialog (whose Tab cycle never escapes its scope), the non-modal Popover lets Tab carry focus
    // OUT of the panel — the page behind stays interactive. Tab a bounded number of times and
    // assert focus ESCAPES the panel at least once (the inverse of the Dialog trap oracle).
    // Bounded so a regression (a popover that wrongly trapped focus) FAILS instead of hanging.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const p = document.querySelector("[data-popover]");
          return p !== null && p.contains(document.activeElement);
        }),
      )
      .toBe(true);

    let escapedPanel = false;
    for (let i = 0; i < 8 && !escapedPanel; i++) {
      await page.keyboard.press("Tab");
      escapedPanel = await page.evaluate(() => {
        const p = document.querySelector("[data-popover]");
        // Focus has left the panel scope (it is on the trigger, the body, or elsewhere) — the
        // panel did NOT lock it in. A trapping regression would keep focus inside on every step.
        return p === null || !p.contains(document.activeElement);
      });
    }
    expect(escapedPanel, "Tab carries focus out of the non-modal popover (no trap)").toBe(true);
  });
});

// KIT-06 Overlay / Menu (SC#1, a11y.md — Ark `Menu`). GREEN as of Plan 03-06: the `Menu` slice
// ships the `kit-06-overlay--menu--playground` story (the lone INTERACTIVE Menu — the Matrix
// forced-open cell renders a portalled menu whose dismiss layer would intercept events, so live
// keyboard runs against the Playground; the Matrix serves the static axe gate, the Dialog/Select
// precedent). The trigger exposes the disclosure relationship: `aria-expanded` flips false→true
// on open and `aria-controls` points at the panel's id (color/visual state alone is never the
// only signal — WCAG 4.1.2 Name, Role, Value). Ark owns the roving highlight + Esc + no-trap.
const MENU_STORY = "kit-06-overlay--menu--playground";

test.describe("KIT-06 Menu disclosure semantics (Plan 03-06 GREEN)", () => {
  test("the trigger toggles aria-expanded false→true and names aria-controls", async ({ page }) => {
    await page.goto(`/?story=${MENU_STORY}&mode=preview`);
    await page.waitForSelector("[data-menu-trigger]", { timeout: SELECTOR_TIMEOUT });

    const trigger = page.locator("[data-menu-trigger]").first();
    await expect(trigger, "menu is collapsed before interaction").toHaveAttribute(
      "aria-expanded",
      "false",
    );

    await trigger.click();
    await expect(trigger, "opening the menu sets aria-expanded=true").toHaveAttribute(
      "aria-expanded",
      "true",
    );

    // aria-controls names the panel that actually exists in the DOM. Attribute-id locator (NOT
    // `#id`) — the Ark v5 id carries `:` colons that a CSS id selector cannot express (the Select
    // block precedent).
    const controlsId = await trigger.getAttribute("aria-controls");
    expect(controlsId, "the trigger declares aria-controls").toBeTruthy();
    const panel = page.locator(`[id="${controlsId}"]`);
    await expect(panel, "aria-controls points at the live menu panel").toBeVisible();
  });
});

// KIT-06 Overlay / Tabs (SC#1, a11y.md — Ark `Tabs`). GREEN as of Plan 03-06: the `Tabs` slice
// ships the `kit-06-overlay--tabs--playground` story. Roving tabindex: arrow keys move the active
// tab through the list (WAI-ARIA tabs pattern), the active tab carries `aria-selected="true"`,
// and only ONE tab is in the tab order at a time. Two contracts the generic axe pass cannot
// express: the roving-tabindex rotation, and — mirroring the Table GAP-10 oracle — the FOCUSED
// tab paints a visible focus ring on its OWN box (so it is never obscured under a sticky bar,
// WCAG 2.4.12), and the ACTIVE tab pairs its cyan with a STRUCTURAL underline marker (the cyan is
// never color-alone — the recipe's `data-[selected]:border-primary` underline).
const TABS_STORY = "kit-06-overlay--tabs--playground";

test.describe("KIT-06 Tabs roving tabindex (Plan 03-06 GREEN)", () => {
  test("ArrowRight moves the active tab (roving tabindex)", async ({ page }) => {
    await page.goto(`/?story=${TABS_STORY}&mode=preview`);
    await page.waitForSelector('[role="tab"]', { timeout: SELECTOR_TIMEOUT });

    const tabs = page.locator('[role="tab"]');
    expect(await tabs.count(), "the tablist has at least two tabs").toBeGreaterThan(1);

    // Click the first tab to ARM Ark's roving focus tracker (a bare `.focus()` lands DOM focus but
    // does not register the tablist's roving entry, so the subsequent ArrowRight no-ops — the click
    // is the deterministic arm, mirroring the Select block's keyboard-open). Then ArrowRight must
    // advance the active tab.
    await tabs.first().click();

    // Poll for the roving state to SETTLE before pressing ArrowRight: the focused tab must be the
    // first tab AND it must be the selected one (Ark moves selection + focus together in the default
    // `automatic` activation mode). Under parallel-load the focus/selection lands a frame after the
    // click, so a synchronous read here races the move — polling is the deterministic gate (the
    // overlay focus-settle pattern from Plan 03-05), not a fixed sleep.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const active = document.activeElement;
          return (
            active?.getAttribute("role") === "tab" &&
            active.getAttribute("aria-selected") === "true"
          );
        }),
      )
      .toBe(true);
    const firstSelected = await page.locator('[role="tab"][aria-selected="true"]').textContent();

    await page.keyboard.press("ArrowRight");
    // Poll the selected-tab text until the move lands (the controlled story re-renders a frame after
    // `onValueChange`), so the assertion never races the roving move under parallel load.
    await expect
      .poll(() => page.locator('[role="tab"][aria-selected="true"]').textContent())
      .not.toBe(firstSelected);
    const afterArrow = await page.locator('[role="tab"][aria-selected="true"]').textContent();

    expect(afterArrow, "ArrowRight rotates the active tab (roving tabindex)").not.toBe(
      firstSelected,
    );

    // Roving tabindex: exactly one tab is tabbable (tabindex=0); the rest are -1.
    const tabbable = await page.locator('[role="tab"][tabindex="0"]').count();
    expect(tabbable, "exactly one tab is in the page tab order").toBe(1);
  });

  // WCAG 2.4.12 (mirror of the Table GAP-10 inset-ring oracle): the FOCUSED tab paints a visible
  // focus ring on its OWN box-shadow — an indication that lives inside the trigger's box and so is
  // never clipped under a sticky bar. A regression that dropped the `focus-visible:shadow-(...)`
  // ring (the GAP-19 outline-drift symptom) would leave the focused tab indistinguishable.
  test("the focused tab paints a visible focus ring on its own box (2.4.12)", async ({ page }) => {
    await page.goto(`/?story=${TABS_STORY}&mode=preview`);
    await page.waitForSelector('[role="tab"]', { timeout: SELECTOR_TIMEOUT });

    const firstTab = page.locator('[role="tab"]').first();
    const resting = await firstTab.evaluate((el) => getComputedStyle(el).boxShadow);

    await firstTab.focus();
    const focused = await firstTab.evaluate((el) => getComputedStyle(el).boxShadow);

    expect(
      focused,
      "focusing the tab adds a visible ring (not obscured under a sticky bar)",
    ).not.toBe(resting);
    expect(focused, "the focus ring actually paints on the tab's own box").not.toBe("none");
  });

  // The active tab's cyan is PAIRED with a structural marker — never color-alone (a11y.md). The
  // recipe maps `data-[selected]` to BOTH `text-primary` (cyan) AND a `border-primary` bottom
  // underline; assert the selected tab paints a non-transparent bottom-border colour distinct
  // from a non-selected tab's transparent one (the structural marker, not just colour).
  test("the active tab pairs its cyan with a structural underline (never color-alone)", async ({
    page,
  }) => {
    await page.goto(`/?story=${TABS_STORY}&mode=preview`);
    await page.waitForSelector('[role="tab"][aria-selected="true"]', { timeout: SELECTOR_TIMEOUT });

    const selectedBorder = await page
      .locator('[role="tab"][aria-selected="true"]')
      .first()
      .evaluate((el) => getComputedStyle(el).borderBottomColor);
    const unselectedBorder = await page
      .locator('[role="tab"][aria-selected="false"]')
      .first()
      .evaluate((el) => getComputedStyle(el).borderBottomColor);

    // The selected tab paints a real (opaque) underline colour; the unselected one is transparent
    // — so the cyan is paired with a structural marker, not carried by colour alone.
    expect(selectedBorder, "selected tab paints a structural underline").not.toBe(unselectedBorder);
    expect(selectedBorder, "the underline is a real painted colour").not.toBe("rgba(0, 0, 0, 0)");
  });
});

// KIT-05 Form / Field (SC#1, a11y.md — visible label + associated, announced error
// with recovery guidance). GREEN as of Plan 03-02: the `Field` slice ships the
// `kit-05-form--field--matrix` story whose forced-invalid cell (`Field invalid` over Ark
// `Field.Root invalid`) exposes `Field.ErrorText` with `aria-live` (the error is
// ANNOUNCED, not just painted), programmatically associated to the control via
// `aria-describedby` (WCAG 3.3.1 Error Identification / 1.3.1 Info and Relationships), and
// carrying the resolved `fieldErrorRequired` copy (RU primary — the active Ladle locale).
const FIELD_STORY = "kit-05-form--field--matrix";
// The RU primary resolution of `fieldErrorRequired` (_fixtures/strings.ts) — the announced
// error copy the forced-invalid cell renders (i18n resolves in the story, default locale ru).
const FIELD_ERROR_COPY_RU = "Заполните это поле";

test.describe("KIT-05 Field forced-invalid announcement (Plan 03-02 GREEN)", () => {
  test("the forced-invalid field exposes a live, associated error", async ({ page }) => {
    await page.goto(`/?story=${FIELD_STORY}&mode=preview`);
    await page.waitForSelector("[data-field-error]", { timeout: SELECTOR_TIMEOUT });

    // ErrorText is a live region so SR users hear it without a focus move (a11y.md
    // dynamic-content rule).
    const error = page.locator("[data-field-error]").first();
    await expect(error).toBeVisible();
    const ariaLive = await error.getAttribute("aria-live");
    expect(ariaLive, "the error text is an aria-live region").toBeTruthy();

    // The announced text is the resolved copy (not a placeholder / raw id) — the error is
    // never color-alone: it carries the recovery sentence next to its Lucide icon.
    await expect(error, "the error renders the resolved fieldErrorRequired copy").toContainText(
      FIELD_ERROR_COPY_RU,
    );

    // The invalid control names the error via aria-describedby (programmatic association).
    const control = page.locator("[data-field-control][aria-invalid='true']").first();
    const describedBy = await control.getAttribute("aria-describedby");
    expect(describedBy, "the invalid control declares aria-describedby").toBeTruthy();
    const errorId = await error.getAttribute("id");
    expect(
      describedBy?.split(/\s+/).includes(errorId ?? "\0"),
      "aria-describedby references the error text id (error associated to the control)",
    ).toBe(true);
  });
});

// KIT-05 Form / Select (SC#1, a11y.md — prefer the Ark `Select` listbox over a hand-rolled
// one; full keyboard, no trap). GREEN as of Plan 03-03: the `Select` slice ships the
// `kit-05-form--select--playground` story (a single live Select — the matrix's forced-open
// cell renders a portalled dismiss layer that would intercept events, so live keyboard runs
// against the lone Playground instance; the matrix proves the forced-open AXE gate instead).
// Ark's combobox trigger exposes `aria-expanded` (false→true on open) + `aria-controls` naming
// the listbox, arrow keys move the highlighted option (roving via `aria-activedescendant` →
// `data-highlighted`, WAI-ARIA listbox pattern), and the open popover does NOT trap Tab — the
// invariants the generic catalog axe pass cannot express. (The Menu portion of this
// form/overlay keyboard suite stays RED until the KIT-06 Overlay wave lands
// `kit-06-overlay--menu--playground`.)
const SELECT_STORY = "kit-05-form--select--playground";

test.describe("KIT-05 Select disclosure + keyboard (Plan 03-03 GREEN)", () => {
  test("a closed trigger toggles aria-expanded false→true and names aria-controls", async ({
    page,
  }) => {
    await page.goto(`/?story=${SELECT_STORY}&mode=preview`);
    await page.waitForSelector('[data-select] [data-part="trigger"]', {
      timeout: SELECTOR_TIMEOUT,
    });

    const trigger = page.locator('[data-select] [data-part="trigger"]').first();
    await expect(trigger, "the trigger starts collapsed").toHaveAttribute("aria-expanded", "false");

    // aria-controls names the listbox that lives in the DOM (the portalled popover content).
    const controlsId = await trigger.getAttribute("aria-controls");
    expect(controlsId, "the trigger declares aria-controls").toBeTruthy();

    await trigger.click();
    await expect(trigger, "opening the listbox sets aria-expanded=true").toHaveAttribute(
      "aria-expanded",
      "true",
    );
    // The listbox the trigger names is now visible and is a real listbox role. Attribute-id
    // locator (NOT `#id`) — the Ark id carries `:` colons that a CSS id selector cannot express.
    const listbox = page.locator(`[id="${controlsId}"]`);
    await expect(listbox, "aria-controls points at the live listbox").toBeVisible();
    await expect(listbox).toHaveAttribute("role", "listbox");
  });

  test("arrow keys move the highlighted option (WAI-ARIA listbox)", async ({ page }) => {
    await page.goto(`/?story=${SELECT_STORY}&mode=preview`);
    await page.waitForSelector('[data-select] [data-part="trigger"]', {
      timeout: SELECTOR_TIMEOUT,
    });

    const trigger = page.locator('[data-select] [data-part="trigger"]').first();
    const listboxId = await trigger.getAttribute("aria-controls");

    // Open from the KEYBOARD (focus + Enter): Ark moves focus into the listbox content, which is
    // what arms its arrow-key roving highlight. (A pointer `.click()` opens the popover but leaves
    // the highlight un-armed — the keyboard path is the one this test exercises anyway.)
    await trigger.focus();
    await page.keyboard.press("Enter");
    const listbox = page.locator(`[id="${listboxId}"]`);
    await expect(listbox).toBeVisible();

    const highlighted = listbox.locator('[role="option"][data-highlighted]');
    // Exactly ONE option carries `data-highlighted` at a time; read its value after each step
    // (poll for the attribute to settle, then read — avoids racing the moving highlight).
    const highlightedValue = async (): Promise<string | null> => {
      await highlighted.first().waitFor({ timeout: SELECTOR_TIMEOUT });
      return highlighted.first().getAttribute("data-value");
    };

    // ArrowDown highlights the FIRST option (Ark arms the roving highlight via the option's
    // `data-highlighted` attribute, mirrored to the content's `aria-activedescendant`).
    await page.keyboard.press("ArrowDown");
    const firstHighlighted = await highlightedValue();
    expect(firstHighlighted, "ArrowDown highlights an option").toBeTruthy();

    // `End` jumps the highlight to the LAST option (WAI-ARIA listbox Home/End) — a deterministic
    // move to a DIFFERENT option, proving the roving highlight actually relocates (and that End
    // is wired, not just ArrowDown). Polled so the attribute settle is awaited, not raced.
    await page.keyboard.press("End");
    await expect.poll(highlightedValue, { timeout: SELECTOR_TIMEOUT }).not.toBe(firstHighlighted);
  });

  test("the open listbox does not trap Tab (trap-free cycle)", async ({ page }) => {
    await page.goto(`/?story=${SELECT_STORY}&mode=preview`);
    await page.waitForSelector('[data-select] [data-part="trigger"]', {
      timeout: SELECTOR_TIMEOUT,
    });

    const trigger = page.locator('[data-select] [data-part="trigger"]').first();
    const listboxId = await trigger.getAttribute("aria-controls");
    await trigger.click();
    await expect(page.locator(`[id="${listboxId}"]`)).toBeVisible();

    // Unlike a Dialog, an open Select is NOT a focus trap: Tab moves focus on (Ark closes the
    // popover and advances). Tab a bounded number of times; the document must always retain a
    // real focused element inside the page — focus is never lost to nowhere and never hangs.
    // Bounded so a regression FAILS instead of hanging.
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      const hasFocus = await page.evaluate(() => {
        const a = document.activeElement;
        return a !== null && a !== document.body && document.contains(a);
      });
      expect(hasFocus, `Tab keeps focus on a reachable control (step ${i})`).toBe(true);
    }
  });
});

// KIT-05 Form / FileUpload (SC#1, security.md + a11y.md — the dropzone is a keyboard
// control, NOT a div-only drag target). GREEN as of Plan 03-04: the `FileUpload` slice
// ships the `kit-05-form--fileupload--playground` story (a single live Ark dropzone — the
// matrix renders several, so the live-keyboard spec runs against the lone Playground
// instance, mirroring the Select precedent; the matrix serves the static axe/44px gate).
// Ark's `FileUpload.Dropzone` is `role="button"` + `tabIndex=0` and opens the file picker on
// Enter/Space; the explicit `Browse` Trigger is a real ≥44px button — the invariants that
// PROVE the dropzone is keyboard-operable, which the generic catalog axe pass cannot express.
const FILE_UPLOAD_STORY = "kit-05-form--fileupload--playground";

test.describe("KIT-05 FileUpload keyboard dropzone (Plan 03-04 GREEN)", () => {
  test("Tab reaches the focusable dropzone (not a div-only drag target)", async ({ page }) => {
    await page.goto(`/?story=${FILE_UPLOAD_STORY}&mode=preview`);
    await page.waitForSelector('[data-file-upload] [data-part="dropzone"]', {
      timeout: SELECTOR_TIMEOUT,
    });

    const dropzone = page.locator('[data-file-upload] [data-part="dropzone"]').first();
    // The dropzone is a real keyboard control: role=button + a positive (focusable) tabindex.
    await expect(dropzone, "the dropzone is exposed as a button to AT").toHaveAttribute(
      "role",
      "button",
    );
    await expect(dropzone, "the dropzone is in the tab order (focusable)").toHaveAttribute(
      "tabindex",
      "0",
    );

    // Tab forward (bounded) until focus lands ON the dropzone — a keyboard user reaches it,
    // proving it is not a pointer-only drag div. Bounded so a regression FAILS, never hangs.
    let onDropzone = false;
    for (let i = 0; i < 8 && !onDropzone; i++) {
      await page.keyboard.press("Tab");
      onDropzone = await dropzone.evaluate((el) => el === document.activeElement);
    }
    expect(onDropzone, "Tab reaches the dropzone").toBe(true);
  });

  test("Enter/Space on the focused dropzone activates the file picker affordance", async ({
    page,
  }) => {
    await page.goto(`/?story=${FILE_UPLOAD_STORY}&mode=preview`);
    await page.waitForSelector('[data-file-upload] [data-part="dropzone"]', {
      timeout: SELECTOR_TIMEOUT,
    });

    const dropzone = page.locator('[data-file-upload] [data-part="dropzone"]').first();
    await dropzone.focus();
    await expect(dropzone, "the dropzone takes keyboard focus").toBeFocused();

    // The hidden file input is the picker the dropzone opens (Ark dispatches the open on
    // Enter/Space via the dropzone's keydown). We cannot assert the OS file dialog, but the
    // affordance exists and is wired: the hidden input is present and the dropzone keydown is
    // the documented open path. Pressing the keys must not throw or move focus off the control.
    await dropzone.press("Enter");
    await dropzone.press(" ");
    const hiddenInput = page.locator('[data-file-upload] input[type="file"]');
    await expect(hiddenInput, "the file picker input the dropzone opens exists").toHaveCount(1);
  });

  test("the explicit Browse button is a real, reachable ≥44px control", async ({ page }) => {
    await page.goto(`/?story=${FILE_UPLOAD_STORY}&mode=preview`);
    await page.waitForSelector('[data-file-upload] [data-part="trigger"]', {
      timeout: SELECTOR_TIMEOUT,
    });

    // The Browse affordance is the Ark Trigger rendered as the shared Button (asChild) — a real
    // <button> (not a styled div) clearing the WCAG 2.5.5 ≥44px target floor.
    const browse = page.locator('[data-file-upload] [data-part="trigger"]').first();
    await expect(browse).toHaveJSProperty("tagName", "BUTTON");
    const box = await browse.boundingBox();
    if (box === null) throw new Error("the Browse button has no bounding box");
    expect(box.height, "Browse button clears the ≥44px target floor").toBeGreaterThanOrEqual(44);
  });
});
