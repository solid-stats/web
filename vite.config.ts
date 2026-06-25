// Root Vite+ config (read only by `vp` — NOT a Vite app config; Ladle reads its own
// packages/design/vite.config.ts). Its single job is to make `vp check` a type-aware
// gate: with `typeCheck` on, `vp check` runs full TypeScript type checks through the
// Oxlint type-aware path (TS-Go + tsgolint), so the KIT-08 typed message-id contract
// (lingui.d.ts `Register.messageIds`, SC#4) is enforced on every `pnpm check` /CI run —
// a missing or misspelled `i18n._({ id })` becomes a hard error, not a silent runtime
// miss. `typeAware` enables the type-aware lint rules alongside it.
//
// Prereq already satisfied: no tsconfig carries `baseUrl` (the Oxlint type checker skips
// type-check when it sees one — see tsconfig.base.json / packages/design/tsconfig.json).
import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
