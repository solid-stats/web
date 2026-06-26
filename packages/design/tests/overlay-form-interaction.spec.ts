// Overlay + form interaction regression (Plan 03-13 — GAP-08/09/10/11). The generic
// catalog/keyboard specs prove axe/44px/keyboard reachability; this spec adds the four
// interaction contracts those cannot express, each RED on the pre-fix behaviour:
//   • GAP-08 — the Dialog close affordance must NOT consume a leading flex row above the
//     title (the title sits at the content's top padding, the close is absolute top-right).
//   • GAP-09 — an empty-options Select renders a first-class empty-state node inside the
//     listbox (message + icon), never blank padding.
//   • GAP-10 — a clearable Select with a value renders an accessible-named clear control
//     that resets the displayed value to the placeholder.
//   • GAP-11 — the Stepper Playground is interactive: increment mutates the displayed value
//     and clamps at max.
// DO-NOT-TOUCH (verified working, NOT asserted here): Select typeahead, the menu growing
// wider than the trigger, the trigger placeholder.
import { expect, test } from "@playwright/test";

const SELECTOR_TIMEOUT = 4000;

const DIALOG_MATRIX_STORY = "kit-06-overlay--dialog--matrix";
const SELECT_MATRIX_STORY = "kit-05-form--select--matrix";
const STEPPER_PLAYGROUND_STORY = "kit-05-form--stepper--playground";

// GAP-08 — the Dialog close button no longer occupies a dead leading row above the title.
test.describe("GAP-08 Dialog has no dead row above the title", () => {
  test("the title sits at the content's top padding, not below a close-button row", async ({
    page,
  }) => {
    await page.goto(`/?story=${DIALOG_MATRIX_STORY}&mode=preview`);
    // The Matrix forced-open cell renders the only mounted dialog content (the closed cell
    // unmounts on exit), so [data-dialog] is unique.
    await page.waitForSelector("[data-dialog]", { timeout: SELECTOR_TIMEOUT });

    const content = page.locator("[data-dialog]").first();
    const title = content.locator('[data-part="title"]').first();
    const close = content.locator('[data-part="close-trigger"]').first();

    const contentBox = await content.boundingBox();
    const titleBox = await title.boundingBox();
    const closeBox = await close.boundingBox();
    if (contentBox === null) throw new Error("dialog content has no bounding box");
    if (titleBox === null) throw new Error("dialog title has no bounding box");
    if (closeBox === null) throw new Error("dialog close has no bounding box");

    // The title's top offset inside the content must be SMALLER than the close-button's height:
    // post-fix the title sits at the ~24px content top padding (close is absolute, out of flow);
    // pre-fix the 44px self-end close is the first flex child, so the title is pushed a full
    // close-row + gap below the content top (~84px) → this assertion fails RED.
    const titleTopInset = titleBox.y - contentBox.y;
    expect(
      titleTopInset,
      `title top inset (${titleTopInset}px) must be under the close height (${closeBox.height}px) — no dead close row above the title`,
    ).toBeLessThan(closeBox.height);

    // Corroborate the close is parked in the top-right corner (its right edge near the content's
    // right edge), not stretched across a leading row.
    const closeRightInset = contentBox.x + contentBox.width - (closeBox.x + closeBox.width);
    expect(closeRightInset, "the close button sits in the content's right inset").toBeLessThan(
      closeBox.width,
    );
  });
});

// GAP-09 — an empty-options Select shows an in-listbox empty state (message + icon).
test.describe("GAP-09 empty Select shows an in-listbox empty state", () => {
  test("the empty listbox renders a non-blank message + icon node", async ({ page }) => {
    await page.goto(`/?story=${SELECT_MATRIX_STORY}&mode=preview`);
    // The empty-state node is portalled out of its StateCell, so target the global hook. Pre-fix
    // it does not exist (the empty cell maps an empty collection → nothing) → waitFor times out RED.
    await page.waitForSelector("[data-select-empty]", { timeout: SELECTOR_TIMEOUT });

    const empty = page.locator("[data-select-empty]").first();
    await expect(empty, "the empty-state node is visible inside the open listbox").toBeVisible();

    const text = (await empty.innerText()).trim();
    expect(
      text.length,
      "the empty state carries a real message (not blank padding)",
    ).toBeGreaterThan(0);

    // Never color-alone — the message is paired with a Lucide icon (an inline svg).
    const iconCount = await empty.locator("svg").count();
    expect(iconCount, "the empty state pairs the message with an icon").toBeGreaterThan(0);
  });
});

// GAP-10 — a clearable Select renders an accessible-named clear control that resets to placeholder.
test.describe("GAP-10 clearable Select can be cleared back to the placeholder", () => {
  test("the clear control is accessible-named and resets the value to the placeholder", async ({
    page,
  }) => {
    await page.goto(`/?story=${SELECT_MATRIX_STORY}&mode=preview`);
    const cell = page.locator("[data-state-cell='clearable']");
    // Pre-fix there is no clearable cell at all → the clear trigger never resolves → RED.
    const clear = cell.locator('[data-part="clear-trigger"]').first();
    await clear.waitFor({ state: "visible", timeout: SELECTOR_TIMEOUT });

    // Icon-only control → it must carry an accessible name (a11y.md).
    const name = await clear.getAttribute("aria-label");
    expect(name?.trim().length ?? 0, "the clear control has an accessible name").toBeGreaterThan(0);

    const trigger = cell.locator('[data-part="trigger"]').first();
    // With a value present Ark does NOT set data-placeholder-shown on the trigger.
    await expect(trigger, "the trigger shows a real value before clearing").not.toHaveAttribute(
      "data-placeholder-shown",
      /.*/,
    );

    await clear.click();

    // After clearing, the trigger falls back to the placeholder (Ark marks it
    // data-placeholder-shown), and the clear control auto-hides (no selection).
    await expect(trigger, "clearing resets the trigger to the placeholder").toHaveAttribute(
      "data-placeholder-shown",
      /.*/,
    );
    await expect(clear, "the clear control hides once there is no value").toBeHidden();
  });
});

// GAP-11 — the Stepper Playground mutates on increment and clamps at max.
test.describe("GAP-11 Stepper Playground is interactive", () => {
  test("increment mutates the displayed value and clamps at max", async ({ page }) => {
    await page.goto(`/?story=${STEPPER_PLAYGROUND_STORY}&mode=preview`);
    await page.waitForSelector('[data-stepper] [data-part="input"]', { timeout: SELECTOR_TIMEOUT });

    const input = page.locator('[data-stepper] [data-part="input"]').first();
    const increment = page.locator('[data-stepper] [data-part="increment-trigger"]').first();

    const readValue = async (): Promise<number> => Number(await input.inputValue());

    const before = await readValue();
    await increment.click();
    // Pre-fix the Playground pins `value` from the arg with no onValueChange, so the controlled
    // input never moves → before === after → RED. Post-fix useState lets the value increment.
    await expect.poll(readValue, { timeout: SELECTOR_TIMEOUT }).toBeGreaterThan(before);

    // Clamp at max: End jumps the value to the max (Ark NumberInput Home/End), and at the max the
    // increment trigger disables itself — the value cannot exceed it (max = 99 in the Playground).
    await input.focus();
    await input.press("End");
    await expect.poll(readValue, { timeout: SELECTOR_TIMEOUT }).toBe(99);
    await expect(increment, "the increment trigger disables at the max (clamp)").toBeDisabled();
  });
});
