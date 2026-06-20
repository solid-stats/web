// Vitest wiring for the Phase-2 pure-logic unit tests (fixture/tier consistency).
// The runner split (solidstats-frontend-react-tests): Vitest = pure logic only —
// NO DOM render, NO RTL. Component/a11y behaviour is Playwright-against-Ladle
// (see playwright.config.ts). `defineConfig` is imported from "vitest/config"
// (the Vitest-owned re-export), not "vite" — packages/design must not add a
// direct `vite` dep (Ladle owns the single bundled Vite).
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure logic only: fixtures, formulas, tier derivation. Node environment —
    // jsdom is deliberately absent (no DOM render in unit tests).
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Exclude the Playwright spec tree (driven by @playwright/test, not Vitest).
    exclude: ["tests/**", "node_modules/**", "build/**"],
    watch: false,
  },
});
