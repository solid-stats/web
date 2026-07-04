// Root Vite config that Ladle auto-loads (Ladle 5.1.1 bundles Vite 6 and reads
// vite.config.{js,mjs,ts} from the package root, merging @vitejs/plugin-react +
// vite-tsconfig-paths on top — RESEARCH Pattern 1). We add ONLY the audited
// @tailwindcss/vite plugin (threat T-1-07).
//
// `defineConfig` is deliberately NOT imported from "vite": Ladle owns the single
// bundled Vite 6 and we must not add `vite` as a direct dep of packages/design
// (RESEARCH anti-pattern: a second Vite invites a resolution split). `defineConfig`
// is only an identity/type helper, so a plain config object is equivalent and keeps
// the package's dependency surface to the audited plugin alone.
import tailwindcss from "@tailwindcss/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [tailwindcss()],
  // The Ladle production build resolves the `@lingui/*` bare specifiers through their `types`
  // export condition (vite-tsconfig-paths in the pipeline), pulling each package's `.d.mts`
  // declaration into the rollup module graph instead of its runtime `index.mjs`. That breaks
  // the build two ways: `@lingui/react`'s `index.d.mts` re-exports a stale, non-existent chunk
  // hash (`./shared/react.CAOiZ7-M.mjs` — the published runtime chunk is `react.DZONiYSA.mjs`),
  // and `@lingui/core`'s `.d.mts` carries only type exports so the runtime `i18n` value is "not
  // exported". Both are dep-packaging artifacts, not our code — they reproduce on a clean tree
  // once Vite's pre-bundle cache is cleared. Alias each specifier straight to its published
  // runtime ESM entry (the package `exports` `default`) so resolution never touches the `.d.mts`.
  // Scoped to these two deps; remove when Lingui ships corrected declarations.
  resolve: {
    alias: {
      "@lingui/react": new URL("./node_modules/@lingui/react/dist/index.mjs", import.meta.url)
        .pathname,
      "@lingui/core": new URL("./node_modules/@lingui/core/dist/index.mjs", import.meta.url)
        .pathname,
    },
  },
};

export default config;
