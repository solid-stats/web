// GAP-02 + GAP-04 motion regression (Plan 03-11). ONE motion policy across the
// overlay+toast family — proven at RUNTIME, not by reading source classes.
//
// GAP-02: the overlay recipes carry `transition duration-150 data-[state=closed]:scale-95/
// opacity-0`, but Ark mounts the content directly in `data-state="open"` (lazyMount +
// unmountOnExit), so the element's FIRST rendered frame is already opacity:1 / transform:none
// — the closed→open frame never renders, no enter animation plays. The fix declares the
// from-frame via the Tailwind `starting:` variant (`@starting-style`), so even a direct-to-open
// mount transitions from the closed frame. The runtime oracle below samples the content's
// computed opacity on the first frame after the open trigger: pre-fix it is already 1 (no enter),
// post-fix it starts < 1 (the @starting-style frame renders) → this FAILS RED, PASSES GREEN.
//
// GAP-04: ToastManager declares `overlap:true, gap:12` but the rendered toasts apply neither —
// they stack flush (gaps 0) with `transitionDuration:0s` (no enter/exit). The oracle fires ≥3
// toasts and asserts a real at-rest gap>0 AND each toast's computed transitionDuration>0s.
//
// The harness forces `reducedMotion:"reduce"` globally (playwright.config.ts) — correct for the
// a11y opt-out, but it would suppress the very motion the animation-PLAYS tests assert. So those
// describe blocks override with `test.use({ reducedMotion: "no-preference" })`; a separate
// reduced-motion block KEEPS "reduce" and proves the opt-out suppresses the non-essential enter.
import { expect, test } from "@playwright/test";

const DIALOG_STORY = "kit-06-overlay--dialog--playground";
const TOAST_STORY = "kit-06-overlay--toastmanager--playground";
const SELECTOR_TIMEOUT = 4000;

// ─────────────────────────────────────────────────────────────────────────────
// Test 1 — overlay enter animates (the closed→open frame actually renders).
// Under no-preference, open the Dialog and sample the content's computed opacity
// on the FIRST frame after the trigger. The @starting-style enter frame makes that
// first frame start from the closed value (opacity < 1); the pre-fix direct-to-open
// mount reads opacity 1 with no enter frame → RED.
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Overlay enter animation plays (GAP-02)", () => {
  test.use({ reducedMotion: "no-preference" });

  test("opening a Dialog renders the closed→open enter frame (opacity starts < 1)", async ({
    page,
  }) => {
    await page.goto(`/?story=${DIALOG_STORY}&mode=preview`);
    await page.waitForSelector("[data-dialog-trigger]", { timeout: SELECTOR_TIMEOUT });

    // Sample the dialog content's opacity on the first animation frame after the open
    // trigger, in-page, synchronously — Playwright assertions auto-wait for the transition
    // to SETTLE (opacity 1), which would mask the enter frame. We click + read the first
    // rAF's computed opacity inside one page.evaluate so the closed→open frame is captured
    // before it settles.
    const firstFrameOpacity = await page.evaluate(async () => {
      const trigger = document.querySelector<HTMLElement>("[data-dialog-trigger]");
      trigger?.click();
      // Wait two rAFs: one for Ark to mount the content, one to read the first painted frame.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const content = document.querySelector<HTMLElement>("[data-dialog]");
      if (content === null) return null;
      return Number.parseFloat(getComputedStyle(content).opacity);
    });

    expect(firstFrameOpacity, "the dialog content has rendered").not.toBeNull();
    // The enter frame: the content starts from the closed (faded) frame and transitions in.
    // Pre-fix it mounts already at opacity 1 (no enter frame) → this assertion FAILS RED.
    expect(
      firstFrameOpacity,
      "the dialog content renders its closed→open enter frame (opacity starts < 1)",
    ).toBeLessThan(1);
  });

  test("the Dialog content animates on a non-zero, token-driven transition", async ({ page }) => {
    await page.goto(`/?story=${DIALOG_STORY}&mode=preview`);
    await page.waitForSelector("[data-dialog-trigger]", { timeout: SELECTOR_TIMEOUT });

    await page.locator("[data-dialog-trigger]").first().click();
    const content = page.locator("[data-dialog]");
    await expect(content).toBeVisible();

    // The shared motion policy reads `--duration-base` (170ms). Assert a real, non-zero
    // transition-duration so the family animates from the @theme tokens (not 0s, not absent).
    const durationMs = await content.evaluate((el) => {
      const raw = getComputedStyle(el).transitionDuration.split(",")[0]?.trim() ?? "0s";
      return raw.endsWith("ms") ? Number.parseFloat(raw) : Number.parseFloat(raw) * 1000;
    });
    expect(durationMs, "the overlay enter transition is non-zero").toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 2 — toast stacking is real and animates (GAP-04).
// Fire ≥3 toasts; assert the at-rest vertical gap between stacked toasts is > 0
// (real spacing, not flush) and each toast's computed transitionDuration > 0s.
// Pre-fix: gaps [0,0,0] and transitionDuration 0s → RED.
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Toast stacking is real and animates (GAP-04)", () => {
  test.use({ reducedMotion: "no-preference" });

  test("fired toasts stack with a gap > 0 at rest and each animates", async ({ page }) => {
    await page.goto(`/?story=${TOAST_STORY}&mode=preview`);
    await page.waitForSelector("[data-storyloaded]");

    // Fire ≥3 toasts (the four trigger buttons are the story's secondary Buttons).
    const triggers = page.getByRole("button");
    const count = await triggers.count();
    for (let i = 0; i < Math.min(3, count); i += 1) {
      await triggers.nth(i).click();
    }

    const toasts = page.locator("[data-toast]");
    await expect(toasts.nth(2), "at least three toasts are stacked").toBeVisible();

    // Measure each toast's top; the at-rest gap between adjacent stacked toasts must be > 0.
    const tops: number[] = [];
    const n = await toasts.count();
    for (let i = 0; i < n; i += 1) {
      const box = await toasts.nth(i).boundingBox();
      if (box !== null) tops.push(box.y);
    }
    tops.sort((a, b) => a - b);
    const gaps = tops.slice(1).map((t, i) => t - tops[i]!);
    expect(gaps.length, "there are stacked toasts to measure").toBeGreaterThanOrEqual(2);
    // Pre-fix the toasts stack flush (all gaps 0) → this FAILS RED.
    for (const gap of gaps) {
      expect(gap, "stacked toasts show a real gap > 0 at rest").toBeGreaterThan(0);
    }

    // Each toast animates: a non-zero enter/exit transition on the shared token policy.
    const durationMs = await toasts.first().evaluate((el) => {
      const raw = getComputedStyle(el).transitionDuration.split(",")[0]?.trim() ?? "0s";
      return raw.endsWith("ms") ? Number.parseFloat(raw) : Number.parseFloat(raw) * 1000;
    });
    // Pre-fix transitionDuration is 0s → this FAILS RED.
    expect(durationMs, "each toast plays a non-zero enter/exit transition").toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 3 — reduced-motion suppresses the non-essential enter (the opt-out holds).
// Under the harness default "reduce", open the Dialog and assert the enter transition
// is suppressed: `motion-reduce:transition-none` zeroes the transition-duration.
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Reduced motion suppresses the overlay enter (a11y opt-out)", () => {
  test.use({ reducedMotion: "reduce" });

  test("under prefers-reduced-motion the Dialog enter transition is suppressed", async ({
    page,
  }) => {
    await page.goto(`/?story=${DIALOG_STORY}&mode=preview`);
    await page.waitForSelector("[data-dialog-trigger]", { timeout: SELECTOR_TIMEOUT });

    await page.locator("[data-dialog-trigger]").first().click();
    const content = page.locator("[data-dialog]");
    await expect(content).toBeVisible();

    // `motion-reduce:transition-none` → transition-property:none, so every component's
    // transition-duration collapses to 0s. The opt-out holds.
    const durationMs = await content.evaluate((el) => {
      const style = getComputedStyle(el);
      if (style.transitionProperty === "none") return 0;
      const raw = style.transitionDuration.split(",")[0]?.trim() ?? "0s";
      return raw.endsWith("ms") ? Number.parseFloat(raw) : Number.parseFloat(raw) * 1000;
    });
    expect(durationMs, "reduced-motion suppresses the non-essential enter transition").toBe(0);
  });
});
