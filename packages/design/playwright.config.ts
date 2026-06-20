// Playwright wiring for the Phase-2 Ladle catalog harness.
//
// The gate (not Ladle's interactive a11y addon) — drives the BUILT Ladle catalog
// one story at a time: axe (serious/critical block), 44px interactive-target
// geometry, and keyboard operability. `globalSetup` builds the catalog and the
// `webServer` previews the static `build/` output at a fixed port (CI-deterministic,
// Open Q1). `defineConfig` comes from "@playwright/test"; no direct `vite` dep.
import { defineConfig, devices } from "@playwright/test";

const PORT = 61000;
const isCI = Boolean(process.env["CI"]);

// chromium is the always-on local proof project; firefox/webkit/mobile widen the
// matrix in CI (per the frontend-tests CI gate) where their host libs are present.
const baseProjects = [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }];
const ciProjects = [
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "webkit", use: { ...devices["Desktop Safari"] } },
  // 360px is the real mobile floor (not a device frame) — QUAL-02.
  {
    name: "mobile-360",
    use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 780 } },
  },
];

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./tests/globalSetup.ts",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["list"]] : [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Honor reduced-motion in the harness — animations gate behind motion-reduce:.
    reducedMotion: "reduce",
    trace: "on-first-retry",
  },
  projects: isCI ? [...baseProjects, ...ciProjects] : baseProjects,
  webServer: {
    // globalSetup already ran `ladle build`; preview serves the static build/.
    command: `pnpm exec ladle preview --port ${PORT}`,
    url: `http://localhost:${PORT}/meta.json`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
