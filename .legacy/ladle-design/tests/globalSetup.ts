// Playwright globalSetup for the Ladle catalog harness.
//
// Builds the Ladle catalog once (CI-deterministic — Open Q1 resolved to
// `ladle build` + static serve over `ladle dev`) so that:
//   1. the `webServer` has a `build/` dir to preview, and
//   2. `catalog.spec.ts` can read the produced `build/meta.json` story list at
//      collection time to enumerate every story (staying in sync with the
//      catalog automatically — no hardcoded story-key list, no `sync-fetch` dep).
//
// globalSetup runs before the `webServer` boots, so it owns the build; the
// webServer command only previews the already-built `build/` dir. The spec reads
// `build/meta.json` from disk directly (rather than via an env var) because
// globalSetup's process env does not propagate into Playwright's test workers.
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

export default function globalSetup(): void {
  // Build the catalog (idempotent). pnpm exec resolves the workspace-local ladle.
  execFileSync("pnpm", ["exec", "ladle", "build"], {
    cwd: packageRoot,
    stdio: "inherit",
  });
}
