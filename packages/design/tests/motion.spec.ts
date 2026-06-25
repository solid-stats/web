// GAP-02 + GAP-04 motion regression (Plan 03-11). ONE motion policy across the
// overlay+toast family — proven at RUNTIME, not by reading source classes.
//
// GAP-02: the overlay recipes carried `transition duration-150 data-[state=closed]:scale-95/
// opacity-0`, but Ark mounts the content directly in `data-state="open"` (lazyMount +
// unmountOnExit), so the element's FIRST rendered frame was already opacity:1 / transform:none
// — the closed→open frame never rendered, no enter animation played (and a `transition`, even
// with `@starting-style`, never fired in this Ark/Chromium matrix). The fix is the
// `.uikit-overlay-motion` keyframe-animation recipe (`styles/uikit.css`), driven by Ark's
// `[data-state]`: a CSS animation runs as soon as its rule first applies to the connected
// element, so the enter keyframes (opacity 0 → 1, scale 0.95 → 1) play even on a direct-to-open
// mount. The runtime oracle below samples the content's computed opacity on the first frames
// after open: pre-fix it stayed 1 (no enter), post-fix it starts < 1 → FAILS RED, PASSES GREEN.
//
// GAP-04: ToastManager declared `overlap:true, gap:12` but the rendered toasts applied neither —
// they stacked flush (gaps 0) with no enter/exit. The oracle fires ≥3 toasts and asserts a real
// at-rest gap>0 AND that each toast runs the shared enter animation (non-zero animation-duration).
//
// The harness forces `reducedMotion:"reduce"` globally (playwright.config.ts) — correct for the
// a11y opt-out, but it would suppress the very motion the animation-PLAYS tests assert. So those
// describe blocks override with `test.use({ contextOptions: { reducedMotion: "no-preference" } })`
// (the typed per-test override in Playwright 1.61 — `reducedMotion` is a `BrowserContextOptions`
// key, not a top-level test-fixture key); a separate reduced-motion block re-asserts "reduce" and
// proves the opt-out suppresses the non-essential enter.
import { expect, test } from "@playwright/test";

const DIALOG_STORY = "kit-06-overlay--dialog--playground";
const TOAST_STORY = "kit-06-overlay--toastmanager--playground";
const SELECTOR_TIMEOUT = 4000;

// ─────────────────────────────────────────────────────────────────────────────
// Test 1 — overlay enter animates (the closed→open frame actually renders).
// Under no-preference, open the Dialog and sample the content's computed opacity
// across the first frames after the trigger. The `.uikit-overlay-motion` enter
// keyframes start the content at opacity 0; the pre-fix direct-to-open mount read
// opacity 1 with no enter frame → RED.
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Overlay enter animation plays (GAP-02)", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("opening a Dialog renders the closed→open enter frame (opacity starts < 1)", async ({
    page,
  }) => {
    await page.goto(`/?story=${DIALOG_STORY}&mode=preview`);
    await page.waitForSelector("[data-dialog-trigger]", { timeout: SELECTOR_TIMEOUT });

    // Sample the dialog content's opacity across the first few animation frames after the open
    // trigger, in-page — Playwright's own assertions auto-wait for the animation to SETTLE
    // (opacity 1), which would mask the enter frame, so we click + read the early frames inside
    // one page.evaluate and keep the MINIMUM opacity observed. The `.uikit-overlay-motion` enter
    // keyframes start the content at opacity 0; the pre-fix code mounted already at opacity 1
    // (no enter frame) → the min stays 1 → this assertion FAILS RED, PASSES GREEN.
    const minOpacity = await page.evaluate(async () => {
      const trigger = document.querySelector<HTMLElement>("[data-dialog-trigger]");
      trigger?.click();
      let min = Number.POSITIVE_INFINITY;
      // Read the first handful of frames; the enter keyframe ramps opacity 0 → 1 over ~170ms.
      for (let i = 0; i < 4; i += 1) {
        await new Promise((r) => requestAnimationFrame(r));
        const content = document.querySelector<HTMLElement>("[data-dialog]");
        if (content === null) continue;
        min = Math.min(min, Number.parseFloat(getComputedStyle(content).opacity));
      }
      return Number.isFinite(min) ? min : null;
    });

    expect(minOpacity, "the dialog content has rendered").not.toBeNull();
    // The enter frame: the content starts from the closed (faded) frame and animates in.
    // Pre-fix it mounts already at opacity 1 (no enter frame) → this assertion FAILS RED.
    expect(
      minOpacity,
      "the dialog content renders its closed→open enter frame (opacity starts < 1)",
    ).toBeLessThan(1);
  });

  test("the Dialog content runs the token-driven enter animation", async ({ page }) => {
    await page.goto(`/?story=${DIALOG_STORY}&mode=preview`);
    await page.waitForSelector("[data-dialog-trigger]", { timeout: SELECTOR_TIMEOUT });

    await page.locator("[data-dialog-trigger]").first().click();
    const content = page.locator("[data-dialog]");
    await expect(content).toBeVisible();

    // The shared `.uikit-overlay-motion` policy runs the `uikit-overlay-enter` keyframes for a
    // non-zero duration read from the `--duration-base` (170ms) @theme token. Assert the named
    // enter animation is wired and runs for a real, non-zero duration (not 0s, not absent).
    const anim = await content.evaluate((el) => {
      const style = getComputedStyle(el);
      const raw = style.animationDuration.split(",")[0]?.trim() ?? "0s";
      const durationMs = raw.endsWith("ms")
        ? Number.parseFloat(raw)
        : Number.parseFloat(raw) * 1000;
      return { name: style.animationName, durationMs };
    });
    expect(anim.name, "the overlay runs the shared enter keyframes").toContain(
      "uikit-overlay-enter",
    );
    expect(anim.durationMs, "the overlay enter animation is non-zero").toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 2 — toast stacking is real and animates (GAP-04).
// Fire ≥3 toasts; assert the at-rest vertical gap between stacked toasts is > 0
// (real spacing, not flush) and each toast's computed transitionDuration > 0s.
// Pre-fix: gaps [0,0,0] and transitionDuration 0s → RED.
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Toast stacking is real and animates (GAP-04)", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

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
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("under prefers-reduced-motion the Dialog enter transition is suppressed", async ({
    page,
  }) => {
    await page.goto(`/?story=${DIALOG_STORY}&mode=preview`);
    await page.waitForSelector("[data-dialog-trigger]", { timeout: SELECTOR_TIMEOUT });

    await page.locator("[data-dialog-trigger]").first().click();
    const content = page.locator("[data-dialog]");
    await expect(content).toBeVisible();

    // The `prefers-reduced-motion: reduce` media query in `styles/uikit.css` sets
    // `animation: none` on the overlay-motion recipe, so the named enter keyframes are dropped
    // and no animation runs. The opt-out holds deterministically (it cannot be out-ordered the
    // way the old merge-free `motion-reduce:transition-none` was).
    const reduced = await content.evaluate((el) => ({
      animationName: getComputedStyle(el).animationName,
      running: el.getAnimations().length,
    }));
    expect(reduced.animationName, "reduced-motion drops the non-essential enter keyframes").toBe(
      "none",
    );
    expect(reduced.running, "no animation runs under reduced motion").toBe(0);
  });
});
