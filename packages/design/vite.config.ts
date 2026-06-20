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
};

export default config;
