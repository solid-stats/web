// Root Vite+ config (read only by `vp` — NOT a Vite app config). Its single job is
// to make `vp check` a type-aware lint/format/type gate for active repo source.
// The old Ladle UIKIT package is archived under `.legacy/ladle-design` and is not
// part of the active check surface.
//
// Prereq already satisfied: no tsconfig carries `baseUrl` (the Oxlint type checker skips
// type-check when it sees one — see tsconfig.base.json).
import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    // Tooling configs are out of the active type surface. The archived Ladle
    // configs remain reference material and are ignored through `.prettierignore`;
    // this glob keeps future root/package configs out of `vp check` type-checking.
    ignorePatterns: ["**/vite.config.ts", "**/playwright.config.ts"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
