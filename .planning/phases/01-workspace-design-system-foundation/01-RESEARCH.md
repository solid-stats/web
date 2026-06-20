# Phase 1: Workspace & Design-System Foundation — Research

**Researched:** 2026-06-20
**Domain:** pnpm workspace bootstrap · Tailwind v4 `@theme` token pipeline (`DESIGN.md` → `gen-theme.mjs` → `theme.css`) · Ladle component catalog on the real stack · `@google/design.md` lint gate · Vite+ `vp check` toolchain
**Confidence:** HIGH (the two priority unknowns are resolved against current docs + live tool execution; the only genuine residual is `vp` install/run, which is unverifiable until installed)

## Summary

Phase 1 is a pure infrastructure-and-pipeline phase: there is no app, no routes, no SSR, no components — only the buildable base. The single end-to-end slice is **`DESIGN.md` (root) → `gen-theme.mjs` → `packages/design/src/styles/theme.css` (`@theme`) → Ladle renders it on the real Vite+Tailwind-v4 stack → one smoke story proves tokens resolve**, with `design.md lint` + `vp check` green across the workspace.

The repo today is a greenfield workspace shell: root `DESIGN.md` (695 lines, lint-clean), `scripts/gen-theme.mjs` (working, dependency-free), `src/styles/theme.css` (current generated output to relocate), the frozen `.design/` archive, and the installed skills. There is **no root `package.json`, no `pnpm-workspace.yaml`, and no `packages/` directory yet** — those are this phase's work. Both priority unknowns are now resolved: (1) Ladle 5.1.1 bundles its own Vite 6 and picks up a root `vite.config.ts` carrying `@tailwindcss/vite` — no Ladle-specific plugin hook; dark-only is the natural state of a single-palette `@theme`, and the global stylesheet is imported in `.ladle/components.tsx`. (2) `@google/design.md@0.3.0 lint` is a pure offline file parser (exit 1 on error / 0 otherwise) — verified by running it against the real `DESIGN.md`: **0 errors, 86 warnings, 2 info** — so the WS-05 gate must key on *exit 0 / zero error-severity findings*, not "zero findings."

**Primary recommendation:** Pin `@google/design.md@0.3.0`, `@ladle/react@5.1.1`, `tailwindcss@4.3.1` + `@tailwindcss/vite@4.3.1` as **root dev-dependencies**; let Ladle own its bundled Vite 6 (do NOT add Vite 8 to `packages/design`); change only `OUT_PATH` (L26) in `gen-theme.mjs`; run `gen-theme.mjs` *before* the gate (run-then-check); and treat the data-trust vocabulary (DS-03) as a **deliberate `gen-theme.mjs` extension** — it is NOT in `theme.css` today and `gen-theme.mjs` does not read `components.*` at all (the load-bearing finding below).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Token source of truth | Root (`DESIGN.md`) | — | Shared across packages; stays at repo root by PROJECT.md + D-09 |
| Token codegen (`@theme`) | Root script (`scripts/gen-theme.mjs`) | — | DRY single-source; D-02 puts `scripts/` + `DESIGN.md` at root, not in a package |
| Generated `theme.css` (`@theme` block) | `packages/design` | — | The importable artifact (`@solid-stats/design` `./theme.css`); WS-02/03 |
| Tailwind utility resolution at build | `packages/design` (Vite + `@tailwindcss/vite`) | — | Ladle's Vite owns the CSS pipeline; no app tier exists in v0.1 |
| Component catalog / smoke render | `packages/design` (Ladle) | — | Ladle is the durable UIKIT home (D-07/D-08); no SSR, no routes |
| Workspace resolution skeleton | `packages/app` | — | Skeleton-only (D-04); consumes `@solid-stats/design`, builds nothing |
| Lint / format / type-check | Root (`vp check`) | per-package `tsconfig.json` | D-02/D-03: config lives once at root; packages stay thin |
| Contrast + token-ref gate | Root (`design.md lint DESIGN.md`) | — | Gates the SoT file, not generated output; WS-05 |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `pnpm` | `11.6.0` (pin `>=11 <12`) | Workspace package manager | SolidStats canon (shared-ts-standards §D); siblings use pnpm `[VERIFIED: pnpm --version → 11.6.0]` |
| Node.js | `25` (pin `>=25 <26`) | Runtime | SolidStats canon (shared-ts-standards §D); `.nvmrc`/`.node-version` = `25` `[CITED: shared-ts-standards §D]` |
| `@ladle/react` | `5.1.1` | Component catalog / story harness on real Vite stack | Vite-native, lean, durable UIKIT home; bundles its own Vite 6 `[VERIFIED: npm view @ladle/react version → 5.1.1]` |
| `tailwindcss` | `4.3.1` | Tailwind v4 engine (`@theme` consumption) | Brief-locked styling; `@theme` token model `[VERIFIED: npm view tailwindcss version → 4.3.1]` |
| `@tailwindcss/vite` | `4.3.1` | Tailwind v4 Vite plugin | The v4 integration path (NOT PostCSS); peer `vite ^5.2 \|\| ^6 \|\| ^7 \|\| ^8` `[VERIFIED: npm view @tailwindcss/vite peerDependencies]` |
| `@google/design.md` | `0.3.0` | `lint` + `diff` gate on `DESIGN.md` (contrast + token refs) | Apache-2.0, ~105k wk dl, the SoT-file gate; bin `design.md` / `designmd` `[VERIFIED: npm view @google/design.md version → 0.3.0]` |
| `react` / `react-dom` | `19.x` | Ladle peer (`>=18`) | Ladle renders React stories; React 19 is current `[VERIFIED: npm view @ladle/react peerDependencies → react >=18]` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vite-plus` (`vp`) | latest | `vp check` = Oxlint + Oxfmt + tsgo (WS-05 toolchain) | The lint/format/type-check gate per conventions §0 / D-03. **Not installed yet** — see Environment Availability `[ASSUMED: A1]` |
| `tsx` | latest | Local TS execution (run `gen-theme.mjs` siblings / scripts) | If any TS-authored script is needed; `gen-theme.mjs` is plain `.mjs` and needs nothing `[CITED: shared-ts-standards §D]` |

> Ladle bundles (do NOT install separately into `packages/design`): `vite@^6.0.5`, `@vitejs/plugin-react@^4.3.4`, `vite-tsconfig-paths@^5.1.4`, `@mdx-js/react`, `prism-react-renderer`. `[VERIFIED: npm view @ladle/react@5.1.1 dependencies]`

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `gen-theme.mjs` generator | `design.md export --format css-tailwind` | Drops typography `line-height` in 0.3.0 (still latest — no `--leading-*` fix). Tracked migration; **stays the generator** (D-09) `[VERIFIED: npm view @google/design.md versions → ['0.1.0','0.1.1','0.2.0','0.3.0']]` |
| `gen-theme.mjs` generator | `@terrazzo/plugin-tailwind` (DTCG → `@theme`) | Inherits the same line-height loss via design.md's DTCG; flattens `--text-xs--line-height` double-dash names `[CITED: design-system.md]` |
| `@tailwindcss/vite` plugin | `@tailwindcss/postcss` + PostCSS | Mixing the PostCSS path with the Vite plugin causes double-processing; pick the Vite plugin for a Vite/Ladle stack `[CITED: tailwindcss.com Vite docs]` |
| Ladle | Storybook 8 | Heavier, slower, more config; Ladle is brief/pipeline-locked (pipeline.md §3) `[CITED: pipeline.md]` |

**Installation (root `package.json` devDependencies):**
```bash
pnpm add -Dw @google/design.md@0.3.0 @ladle/react@5.1.1 tailwindcss@4.3.1 @tailwindcss/vite@4.3.1
# packages/design:
pnpm --filter @solid-stats/design add react@19 react-dom@19
# vp (Vite+) — confirm exact package name before install (see Assumptions A1)
```

**Version verification (run during execution before pinning):**
```bash
npm view @ladle/react version          # → 5.1.1 (verified 2026-06-20)
npm view tailwindcss version           # → 4.3.1
npm view @tailwindcss/vite version     # → 4.3.1
npm view @google/design.md version     # → 0.3.0 (latest; line-height bug NOT fixed)
```

## Package Legitimacy Audit

Ran `gsd-tools query package-legitimacy check --ecosystem npm @ladle/react @tailwindcss/vite tailwindcss @google/design.md vite`.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `@ladle/react` | npm | published 2025-11-04 | 262k/wk | github.com/tajo/ladle | OK | Approved |
| `@tailwindcss/vite` | npm | latest patch 2026-06-12 | 37.8M/wk | github.com/tailwindlabs/tailwindcss | SUS (`too-new`) | Approved — false flag (latest patch of a 37.8M/wk official tailwindlabs pkg) |
| `tailwindcss` | npm | latest patch 2026-06-12 | 121.4M/wk | github.com/tailwindlabs/tailwindcss | SUS (`too-new`) | Approved — false flag (121M/wk official) |
| `@google/design.md` | npm | latest 2026-06-15 | 105k/wk | github.com/google-labs-code/design.md | SUS (`too-new`) | Approved — false flag (official Google Labs repo, Apache-2.0) |
| `vite` | npm | latest 2026-06-01 | 142.3M/wk | github.com/vitejs/vite | SUS (`too-new`) | Approved — false flag; **not installed directly** (Ladle owns Vite 6) |

**Packages removed due to [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** all four `too-new` flags are publish-recency artifacts on huge-download, official-repo-backed packages — no `postinstall`, not deprecated, real repos. No `checkpoint:human-verify` needed. None is a slopsquat: all four are confirmed against official docs (tailwindcss.com, ladle.dev, design.md GitHub) AND repo-backed.

> `vp` / `vite-plus` is the one package NOT yet legitimacy-checked because its exact npm name is unconfirmed `[ASSUMED: A1]` — the planner must gate its install behind a `checkpoint:human-verify` and run `package-legitimacy check` on the confirmed name.

## Architecture Patterns

### System Architecture Diagram

```
  DESIGN.md  (root, YAML front-matter — the SINGLE source of truth)
      │
      │  node scripts/gen-theme.mjs   (root script, D-02; reads colors/typography/
      │                                 rounded/elevation/motion/layout ONLY)
      ▼
  packages/design/src/styles/theme.css   ← OUT_PATH (gen-theme.mjs L26 — the ONE path that changes)
      │   @import "tailwindcss";  @theme { --*: initial; …tokens… }
      │
      ├──────────────► design.md lint DESIGN.md   (gate on the SoT, not the output;
      │                                            contrast + {token} refs; exit 0/1)
      ▼
  Ladle (packages/design, bundled Vite 6)
      vite.config.ts  → plugins: [tailwindcss()]   (@tailwindcss/vite)
      .ladle/config.mjs → addons.theme {enabled:false, defaultState:"dark"}; viteConfig
      .ladle/components.tsx → GlobalProvider imports ./src/styles/theme.css ONCE
      │
      ▼
  packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx   (the ONLY story; zero components)
      renders token utilities (bg-surface-1, text-primary, font-display, rounded-lg)
      → proves @theme resolves on the real stack (WS-04)

  packages/app/  (skeleton — package.json + workspace dep on @solid-stats/design; resolves, builds nothing; D-04)

  Gate (root): node scripts/gen-theme.mjs && design.md lint DESIGN.md && vp check   ← "green across the workspace" (WS-05)
```

### Recommended Project Structure
```
web/                                  pnpm workspace root
├── package.json                      private; packageManager: pnpm@11.x; engines node>=25; devDeps (design.md, ladle, tailwind, @tailwindcss/vite); scripts (gen-theme, lint:design, check)
├── pnpm-workspace.yaml               packages: ["packages/*"]
├── .nvmrc / .node-version            25
├── tsconfig.base.json                strict baseline (shared-ts-standards §A); per-package extends
├── DESIGN.md                         root SoT (unchanged)
├── scripts/gen-theme.mjs             root generator (only OUT_PATH L26 changes)
├── packages/
│   ├── design/                       @solid-stats/design (WS-02)
│   │   ├── package.json              name, exports {"./theme.css", "."}, scripts (ladle dev/build)
│   │   ├── tsconfig.json             extends ../../tsconfig.base.json
│   │   ├── vite.config.ts            plugins: [tailwindcss()]  (consumed by Ladle)
│   │   ├── .ladle/
│   │   │   ├── config.mjs            addons.theme{enabled:false,defaultState:"dark"}; viteConfig
│   │   │   └── components.tsx        GlobalProvider → import "./src/styles/theme.css"
│   │   └── src/
│   │       ├── styles/theme.css      ← gen-theme.mjs OUT_PATH (relocated from /src/styles, WS-03)
│   │       ├── assets/fonts/         self-hosted Saira / IBM Plex Sans+Mono .woff2 (QUAL-04)
│   │       └── shared/uikit/Smoke/
│   │           ├── Smoke.stories.tsx the one smoke story (D-07; zero components)
│   │           └── index.ts          (slice entrypoint per architecture.md)
│   └── app/                          skeleton only (D-04)
│       └── package.json              workspace dep on @solid-stats/design; no src
└── .design/                          frozen archive EXCEPT CLAUDE.md + MIGRATION.md (D-11)
```

### Pattern 1: Ladle picks up Vite via a root `vite.config.ts` (no Ladle plugin hook)
**What:** `@ladle/react@5.1.1` bundles `vite@^6.0.5` as a *direct* dependency and auto-loads `vite.config.{js,mjs,ts}` from the package root (or the path given by `.ladle/config.mjs` `viteConfig`). Custom Vite plugins go in that file — Ladle merges them and adds `@vitejs/plugin-react` + `vite-tsconfig-paths` itself.
**When to use:** Wiring `@tailwindcss/vite` into the design package's Ladle.
**Example:**
```ts
// packages/design/vite.config.ts
// Source: ladle.dev/docs (Ladle uses your vite.config) + tailwindcss.com Vite install
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()], // Ladle adds @vitejs/plugin-react + vite-tsconfig-paths on top
});
```
```js
// packages/design/.ladle/config.mjs
// Source: ladle.dev/docs/config — addons.theme {enabled, defaultState}, viteConfig
/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/**/*.stories.{ts,tsx}",
  defaultStory: "smoke--tokens",
  addons: {
    theme: { enabled: false, defaultState: "dark" }, // dark-only: drop the toggle
    width: { enabled: true },                         // useful at the project breakpoints
  },
};
```

### Pattern 2: Global stylesheet imported once in `.ladle/components.tsx`
**What:** Ladle's `GlobalProvider` is where app-wide CSS/providers live. Import the relocated `theme.css` here (import-once rule from styling.md).
**Why dark-only is trivial here:** our `@theme` carries a *single* gunmetal palette and a `--*: initial` reset — there is no light variant and no `dark:` class strategy. Dark is the only state; there is nothing to toggle. (Contrast with the common Storybook/Tailwind `dark`-class pattern — not applicable to a single-palette token system.)
```tsx
// packages/design/.ladle/components.tsx
// Source: ladle.dev/docs/providers — GlobalProvider; styling.md import-once
import type { GlobalProvider } from "@ladle/react";
import "../src/styles/theme.css"; // the ONE global import — emits @theme + utilities

export const Provider: GlobalProvider = ({ children }) => (
  <div className="bg-bg-0 text-primary font-body min-h-screen p-4">{children}</div>
);
```

### Pattern 3: Self-hosted fonts inside `packages/design` (QUAL-04)
**What:** Ship Saira + IBM Plex Sans + IBM Plex Mono as `.woff2` assets in the package and declare `@font-face` with `font-display: swap`. Reference them with paths Vite resolves at dev and build.
**Recommendation:** Put `@font-face` in a `fonts.css` imported by `theme.css` (or appended), with **relative** `url("./assets/fonts/…woff2")` from the importing CSS so Vite fingerprints them in the build graph (absolute `/fonts/...` 404s on the Ladle dev server unless placed in a `public/` dir).
```css
/* packages/design/src/styles/fonts.css — imported before/with theme.css */
/* Source: Vite static-asset handling + MDN @font-face; font-display per QUAL-04/CWV */
@font-face {
  font-family: "Saira";
  src: url("../assets/fonts/Saira-Bold.woff2") format("woff2");
  font-weight: 700; font-display: swap;
}
/* …IBM Plex Sans 400/500/600, IBM Plex Mono 400/500 (all carry Cyrillic — DESIGN.md L505) */
```
> The `--font-display`/`--font-body`/`--font-mono` token *names* already exist in `@theme`; this pattern supplies the actual font files behind them. Without it the smoke story falls back to `system-ui` and QUAL-04's "self-hosted fonts" intent is unmet.

### Pattern 4: Tailwind v4 source scanning keeps the smoke-story utilities alive
**What:** Tailwind v4 auto-scans every non-gitignored, non-`node_modules`, non-CSS file from cwd. Colocated `*.stories.tsx` **inside `packages/design`** are scanned (same package, not under `node_modules`), so the smoke story's `bg-surface-1` / `font-display` utilities are generated, not tree-shaken.
**When a consumer (`packages/app`, later phases) imports `@solid-stats/design`:** it must add `@source "../node_modules/@solid-stats/design";` to its own entry CSS — but that is a v1.0/Phase-2 concern, not Phase 1.

### Anti-Patterns to Avoid
- **Adding `vite` 8 as a direct dep of `packages/design`** — Ladle 5.1.1 pins its own Vite 6; a second Vite invites a resolution split. Let Ladle own it; `@tailwindcss/vite` 4.3.1 is compatible with Vite 6.
- **Hand-editing `theme.css`** — it is a pure build output of `gen-theme.mjs` (D-06/styling.md). Any token change goes in `DESIGN.md` then regen.
- **Treating `design.md lint` warnings as failures** — the SoT lints to *exit 0* with 86 warnings (see Pitfall 1). Gating on "zero findings" would block the phase permanently on documented false positives.
- **Mixing `@tailwindcss/postcss` with `@tailwindcss/vite`** — double-processing; pick the Vite plugin.
- **Porting any `.design/hifi/*.jsx`** — frozen reference only (D-11/D2); never code.
- **Putting `gen-theme.mjs` or `design.md` lint as a `packages/*` script** — D-02: root owns `DESIGN.md` + `scripts/`; these are root scripts.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Token `@theme` codegen | A second/parallel generator or hand-written `theme.css` | The existing `scripts/gen-theme.mjs` (one `OUT_PATH` change) | Already works, dependency-free, emits the paired `--text-*--line-height` + `--*: initial` reset no exporter does `[VERIFIED: ran it → exit 0]` |
| Contrast / token-ref validation | A custom WCAG contrast checker | `design.md lint` | Free correctness gate; offline `[VERIFIED]` |
| Component story harness | A bespoke playground / custom Vite setup | Ladle (bundles Vite 6 + react plugin + tsconfig-paths) | Durable UIKIT home; pipeline-locked `[CITED: pipeline.md]` |
| Tailwind v4 build integration | PostCSS hand-config | `@tailwindcss/vite` | The official v4 Vite path `[CITED: tailwindcss.com]` |
| Lint/format/type-check wiring | Separate ESLint+Prettier+tsc | `vp check` (Oxlint+Oxfmt+tsgo) | D-03; conventions overrides the generic baseline for web `[CITED: conventions §0, shared-ts-standards §C]` |

**Key insight:** Phase 1 builds almost nothing new — it **relocates and wires** existing, validated assets into a workspace. The risk is not "can we build it" but "do the seams resolve" (workspace, `exports` map, Ladle↔Vite↔Tailwind, the gate exit codes). Spend the rigor on the seams, not on reinventing the generator or a validator.

## Runtime State Inventory

> Rename/relocate aspect: `src/styles/theme.css` → `packages/design/src/styles/theme.css`, and `gen-theme.mjs` `OUT_PATH`.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no DB/datastore in this repo (frontend owns no persistence). | None — verified: `web` consumes `server-2`, owns no DB/S3 (AGENTS.md boundary). |
| Live service config | None — no deployed service, no external dashboards keyed to a path in Phase 1. | None. |
| OS-registered state | None — no scheduled tasks, no pm2/systemd units. | None. |
| Secrets/env vars | None — no `.env`, no secret references in scope (no API client in v0.1). | None — verified: no `.env*` in repo root. |
| Build artifacts | `src/styles/theme.css` is the current generated output; `src/` will be emptied when it relocates into `packages/design`. No compiled binaries / egg-info / dist. | **Relocate** `theme.css` via the `OUT_PATH` change + regen; remove the now-orphan top-level `src/styles/` after relocation. `[VERIFIED: find src → only src/styles/theme.css]` |

**The canonical question (after every file is updated, what still references the old path?):** Only `gen-theme.mjs` L26 hard-codes `join(ROOT, "src", "styles", "theme.css")`. `DESIGN_PATH` (L25) is unchanged (root stays root, D-09). No other file in the repo imports `theme.css` yet (greenfield — `grep` for the old path returns only `gen-theme.mjs` + the file's own header). After the change + regen + relocation, nothing live sources the old location. The dead `--container: 1240` survives only in frozen `.design/` (D-11). `[VERIFIED]`

## Common Pitfalls

### Pitfall 1: `design.md lint` exits 0 with 86 warnings — gating on "zero findings" hard-blocks the phase
**What goes wrong:** A plan that asserts WS-05 "passes" as *zero lint findings* will never pass: the real `DESIGN.md` lints to **exit 0, 0 errors, 86 warnings, 2 info**.
**Why it happens:** `design.md@0.3.0`'s component schema recognizes only `backgroundColor/textColor/typography/rounded/padding/size/height/width`. Our richer recipes (`hover`, `active`, `focusVisible`, `disabled`, `border`, `states`, `icon`) are *intentional* and trigger 61 "not a recognized sub-token" warnings; 18 "defined but never referenced" warnings cover chart tokens etc. **7 contrast warnings are false positives:** the linter composites a `-weak` token (e.g. `#3fcf8e24`, ~14% alpha) as an *opaque* background and reports 1.00:1, **ignoring the real `surface-1` beneath the tint**. DESIGN.md's own table documents the true ratios clear AA (loss floor 5.8:1).
**How to avoid:** Gate on **`design.md lint DESIGN.md` exit code 0** (no `error`-severity findings), not on finding count. In the `package.json` script, optionally pipe `--format json` and fail only if any `findings[].severity === "error"`. Document the 86 warnings as known/expected so a future regression (a *new* warning class, or any error) is visible.
**Warning signs:** A task action that does `design.md lint … | grep -q "0 findings"` or `--max-warnings 0`.

### Pitfall 2: The data-trust vocabulary (DS-03) is NOT in `theme.css` and `gen-theme.mjs` cannot emit it as written
**What goes wrong:** ROADMAP criterion #3 / DS-03 require the freshness vocabulary («Актуально» / «Данные устаревают» / «Связь потеряна» / «Переподключение»), the provenance line, and Known/Unknown/Conflict to exist as **first-class tokens**. They do **not** appear in the generated `theme.css` today (`grep` → 0 hits), because **`gen-theme.mjs` only reads `colors/typography/rounded/elevation/motion/layout` — it never reads `components.*`** (where `badge-freshness`, `provenance-line`, `badge-known/unknown/conflict` live in DESIGN.md). The state-specific colors *are* present generically (`--color-win/warn/loss/info` + `-weak`/`-border`), but the **named data-trust tokens are not.**
**Why it happens:** `buildTheme()` destructures `{ colors, typography, rounded, elevation, motion, layout }` (L173) — `components` is deliberately omitted; design.md's `@theme` model has no component-recipe namespace.
**How to avoid:** This is the **one substantive code task** of the phase. Decide and plan one of:
  - **(Recommended)** Extend `gen-theme.mjs` to emit a small, curated set of **semantic data-trust custom properties** from `components.badge-freshness.states.*` / `badge-known/unknown/conflict` (e.g. `--color-freshness-up-to-date`, `--color-freshness-stale`, `--color-freshness-offline`, `--color-freshness-reconnecting`, mapped to the existing win/warn/loss/info + `-weak`/`-border`). The Russian label *strings* are product copy and belong in i18n (Phases 3/8), **not** in CSS `@theme` — DS-03's "first-class token" is satisfied by the *named state tokens*, with the vocabulary documented in DESIGN.md and `.design/CLAUDE.md` (already present). Confirm the exact token list with the user — see Assumption A2.
  - Or treat DS-03 as satisfied by the existing semantic colors + the documented vocabulary, with the named freshness/trust tokens deferred to the first component phase. **This contradicts the literal "first-class tokens … in theme.css" success criterion**, so flag it for the discuss/plan step rather than assuming it.
**Warning signs:** A plan that asserts "DS-03 done" by `grep`-ing `theme.css` for `win`/`warn` without the named freshness tokens; or one that injects Russian strings into `@theme`.

### Pitfall 3: Node 25 is required but the machine runs Node 24
**What goes wrong:** `pnpm install` may warn/fail on `engines: node >=25 <26` (current machine: Node v24.16.0). Ladle's own engine is `node >=20` (fine), so the constraint is the *project* pin, not a tool requirement.
**Why it happens:** SolidStats canon pins Node 25; the dev box is on 24.
**How to avoid:** Install/switch to Node 25 (`nvm install 25` / `fnm`) before `pnpm install`, OR set `engine-strict=false` consciously. The `.nvmrc`/`.node-version` = `25` files make the switch one command. Do **not** lower the engines pin — it is a standard. `[VERIFIED: node --version → v24.16.0]`
**Warning signs:** `pnpm install` printing `Unsupported engine` / `EBADENGINE`.

### Pitfall 4: `vp` (Vite+) is not installed and its exact package name is unconfirmed
**What goes wrong:** WS-05's gate is `vp check`, but `npx vp --version` → "vp not installed" and the npm package name (`vite-plus`? scoped?) is not verified in this session.
**How to avoid:** The planner must add a `checkpoint:human-verify` to confirm the exact `vp`/Vite+ package + install command before wiring it into the gate, and run `package-legitimacy check` on it. See Assumption A1.
**Warning signs:** A task `pnpm add -Dw vp` with no prior name confirmation.

### Pitfall 5: `gen-theme.mjs` must run *before* the lint/check gate (ordering)
**What goes wrong:** If `vp check` / CI runs against a stale `theme.css`, a `DESIGN.md` edit that wasn't regenerated passes the check but ships an out-of-date theme.
**How to avoid (recommendation for the D-09 open question):** **run-then-check.** Make the workspace gate `node scripts/gen-theme.mjs && design.md lint DESIGN.md && vp check` (regen first, then lint the SoT, then type/lint/format). In CI, additionally `git diff --exit-code packages/design/src/styles/theme.css` after regen to fail if the committed `theme.css` drifted from `DESIGN.md` (catches "edited DESIGN.md, forgot to regen"). This is strictly safer than check-only and costs ~tens of ms.
**Warning signs:** A `check` script that never invokes `gen-theme.mjs`.

## Code Examples

### Root `package.json` (shape)
```jsonc
// Source: shared-ts-standards §D + D-01/D-02/D-03
{
  "name": "@solid-stats/web",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.6.0",
  "engines": { "node": ">=25 <26", "pnpm": ">=11 <12" },
  "scripts": {
    "gen-theme": "node scripts/gen-theme.mjs",
    "lint:design": "design.md lint DESIGN.md",
    "check": "pnpm gen-theme && pnpm lint:design && vp check"   // run-then-check (Pitfall 5)
  },
  "devDependencies": {
    "@google/design.md": "0.3.0",
    "@ladle/react": "5.1.1",
    "tailwindcss": "4.3.1",
    "@tailwindcss/vite": "4.3.1"
  }
}
```

### `pnpm-workspace.yaml`
```yaml
# Source: pnpm workspace docs; D-01
packages:
  - "packages/*"
```

### `packages/design/package.json` `exports` map (the `@solid-stats/design` seam — D-05)
```jsonc
// Source: D-05 — exposes ./theme.css now and the UIKIT entry for later phases
{
  "name": "@solid-stats/design",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./theme.css": "./src/styles/theme.css",
    ".": { "types": "./src/index.ts", "default": "./src/index.ts" }  // UIKIT entry (empty in P1)
  },
  "scripts": { "ladle": "ladle dev", "ladle:build": "ladle build" }
}
```

### The single `gen-theme.mjs` change (D-09)
```js
// scripts/gen-theme.mjs L26 — the ONLY breaking path
// BEFORE: const OUT_PATH = join(ROOT, "src", "styles", "theme.css");
const OUT_PATH = join(ROOT, "packages", "design", "src", "styles", "theme.css");
// DESIGN_PATH (L25) UNCHANGED — root stays root.
```

### Smoke story (D-07 — the one story, zero components)
```tsx
// packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx
// Source: ladle.dev/docs/stories — named export = story; proves @theme resolves (WS-04)
export const Tokens = () => (
  <div className="space-y-4">
    <p className="font-display text-3xl text-primary">SolidStats — tokens render</p>
    <div className="bg-surface-1 border border-border-1 rounded-lg p-4">
      <span className="font-mono tabular-nums text-muted text-sm">123 456 · 1.08:1</span>
    </div>
    <span className="bg-primary text-fg-on-accent rounded-sm px-2 py-1">primary</span>
  </div>
);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| vanilla-extract `*.css.ts` | Tailwind v4 `@theme` from `DESIGN.md` | This milestone (PROJECT.md) | No `createTheme`/`*.css.ts`; tokens are CSS vars |
| `design.md export --tailwind-v4` (wrong flag) | `gen-theme.mjs` interim generator | 2026-06-20 validation | Real flag is `--format css-tailwind` and it drops line-height; generator owns codegen |
| Tailwind `dark:` class toggle | Single dark-only palette + `--*: initial` | Locked dark-only | No theme-switch; nothing to toggle in Ladle |
| Single-repo `src/` | pnpm workspace `packages/design` + `packages/app` | 2026-06-20 user decision | `theme.css` relocates; `@solid-stats/design` is importable |

**Deprecated/outdated:**
- `--tailwind-v4` flag in `styling.md` and `references/design-system.md` examples — **stale**, the correct flag is `--format css-tailwind` and it is line-height-lossy. (Skill-fix owed per MIGRATION.md; out of Phase 1 scope but note it.)
- `--container: 1240` — lives only in frozen `.design/`; superseded by 1760/720 in `DESIGN.md`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The Vite+ `vp check` toolchain installs as a package named ~`vite-plus` exposing a `vp` binary | Standard Stack / Pitfall 4 | If the name/binary differs, the WS-05 gate command is wrong; **planner must `checkpoint:human-verify` the exact package + `vp check` invocation before wiring CI**. `vp` is NOT installed on this machine. |
| A2 | DS-03 "first-class tokens" is satisfied by emitting *named semantic data-trust state tokens* (freshness up-to-date/stale/offline/reconnecting, known/unknown/conflict) into `@theme`, with the Russian label *strings* living in i18n (later phases), not in CSS | Pitfall 2 | If the user expects the literal Russian strings encoded in `theme.css`, the token shape differs. **Confirm the exact DS-03 token list + whether strings belong in `@theme` during discuss/plan.** This is the phase's one design decision. |
| A3 | React 19 is the version to pair with Ladle (peer is only `>=18`) | Standard Stack | If a later phase needs React 18 for a specific lib, pin differently; low risk in v0.1 (no app). |
| A4 | `gen-theme.mjs` extension for A2 keeps the file dependency-free and within the existing YAML parser's capabilities (no arrays/anchors needed for the `components.badge-freshness.states.*` maps) | Pitfall 2 | The parser already handles nested maps (it parses `components.*` today, just doesn't emit them) — low risk, but verify the `states:` sub-map parses when wiring emission. |

## Open Questions

1. **Does DS-03 want Russian strings as token *values* in `theme.css`, or named state tokens + strings-in-i18n?**
   - What we know: the vocabulary is fully specified in DESIGN.md `components.badge-freshness.states` and `.design/CLAUDE.md`; the *colors* are already generic tokens.
   - What's unclear: whether "first-class token" means a CSS custom property carrying the Russian string, or a named color/recipe token with the string in i18n.
   - Recommendation: named semantic tokens in `@theme` (A2); confirm in discuss/plan. CSS is the wrong home for translatable copy.

2. **Exact `vp` / Vite+ package + `vp check` command (A1).** Resolve via `checkpoint:human-verify` before the gate is wired.

3. **`packages/app` skeleton minimum:** `package.json` + a workspace `dependencies: { "@solid-stats/design": "workspace:*" }` is enough to "resolve" (D-04). No `src`, no `tsconfig` needed unless `vp check` requires every package to type-check (then a trivial `tsconfig.json` extending base + an empty `src/index.ts`). Recommendation: add the trivial `tsconfig.json` + `src/index.ts` so `vp check` is uniform across packages.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| pnpm | WS-01 workspace | ✓ | 11.6.0 | — |
| Node.js | engines pin | ⚠ wrong version | 24.16.0 (need 25) | Install Node 25 (`.nvmrc` present) — **no fallback; do not lower the pin** |
| npm (for `npx`/registry) | install + `design.md` | ✓ | 11.13.0 | — |
| `@google/design.md` lint | WS-05 gate | ✓ (via npx; pin as devDep) | 0.3.0 | none needed — runs offline, exit 0 verified |
| `@ladle/react` | WS-04 | ✗ (not installed) | target 5.1.1 | none — must install |
| `@tailwindcss/vite` + `tailwindcss` | WS-04 build | ✗ (not installed) | target 4.3.1 | none — must install |
| `vp` (Vite+) | WS-05 `vp check` | ✗ (not installed) | unknown | **no fallback confirmed** — name unverified (A1); blocking until resolved |
| Self-hosted font files (Saira, IBM Plex Sans/Mono `.woff2`) | QUAL-04 / WS-04 smoke render | ✗ (not in repo) | — | Could fall back to `system-ui` (already in the font stacks) but that **misses QUAL-04 intent**; source the `.woff2` (Google Fonts / IBM Plex repo — all carry Cyrillic) |

**Missing dependencies with no fallback (block execution):**
- Node 25 (machine on 24) — install before `pnpm install`.
- `vp` / Vite+ — name + install command unconfirmed (A1); `checkpoint:human-verify`.

**Missing dependencies with fallback:**
- Self-hosted fonts → `system-ui` fallback renders, but QUAL-04 wants real type; treat as a real task, not a skip.

## Validation Architecture

> `workflow.nyquist_validation` config not located as `false`; including per the absent-means-enabled rule. Phase 1 has **no unit-test surface** — validation is concrete, runnable toolchain assertions.

### Test/Validation Framework
| Property | Value |
|----------|-------|
| Framework | Toolchain assertions (no Vitest/Playwright in Phase 1 — zero components, zero logic) |
| Config file | none — see Wave 0 (a `vitest.config` only arrives with the first component phase) |
| Quick run command | `pnpm install` (resolves workspace) · `pnpm gen-theme` (regenerates `theme.css`) |
| Full suite command | `pnpm check` = `pnpm gen-theme && pnpm lint:design && vp check` (the WS-05 green gate) |
| Design lint | `design.md lint DESIGN.md` → **exit 0 / zero `error`-severity** (NOT zero findings — Pitfall 1) |
| Smoke render | `pnpm --filter @solid-stats/design ladle build` succeeds + the Smoke story renders token utilities |

### Phase Requirements → Validation Map
| Req ID | Behavior | Type | Automated Command / Assertion | Source-of-truth |
|--------|----------|------|-------------------------------|-----------------|
| WS-01 | Workspace resolves on pnpm 11 + Node 25 | smoke | `pnpm install` exits 0; `pnpm -r exec true` lists `packages/design` + `packages/app`; `pnpm why @solid-stats/design` resolves from `packages/app` | `pnpm-workspace.yaml`, root `package.json` |
| WS-02 | `@solid-stats/design` importable, exports `./theme.css` + UIKIT entry | smoke | `node -e "require.resolve('@solid-stats/design/theme.css')"` resolves (or `pnpm --filter app exec node --input-type=module -e "import '@solid-stats/design/theme.css'"`); `exports` map has both keys | `packages/design/package.json` |
| WS-03 | Root `DESIGN.md` → `packages/design/.../theme.css` via `gen-theme.mjs`; old `src/styles` gone | smoke + diff | `pnpm gen-theme` writes `packages/design/src/styles/theme.css`; `git diff --exit-code` after regen is clean (committed == regenerated); `test ! -e src/styles/theme.css` (relocated) | `gen-theme.mjs` L26 |
| WS-04 | Ladle on the real stack (dark-only, generated `@theme`), colocated story, tokens render | build | `ladle build` exits 0; output contains the Smoke story; built CSS contains `--color-surface-1` / a `bg-surface-1` rule (token resolved, not arbitrary) | `.ladle/config.mjs`, `vite.config.ts`, `Smoke.stories.tsx` |
| WS-05 | Lint/format/type-check green across workspace; `design.md lint` gates `DESIGN.md` | gate | `vp check` exits 0 (root) AND `design.md lint DESIGN.md` exits 0 (zero error-severity) | root `package.json` `check` |
| DS-01 | `@theme` from `DESIGN.md` (colors/type incl. line-height/spacing/radii); **no arbitrary values** | source assertion | `theme.css` has paired `--text-*` + `--text-*--line-height` (already verified, 11 pairs); grep `theme.css` for `bg-[`/`p-[`/`#`-outside-`@theme` → only token defs; spacing uses Tailwind stock (no custom keys) | generated `theme.css` |
| DS-02 | Dark-only gunmetal, one cyan accent, Saira/IBM Plex, tabular mono, Lucide — as token recipes | source assertion | `theme.css` has single `--color-primary` cyan, `--font-display: 'Saira'…`, `--font-mono: 'IBM Plex Mono'…`; no light-palette tokens; `--*: initial` reset present; Lucide noted as recipe convention in DESIGN.md (icon names in `components.*`) | `theme.css` + DESIGN.md |
| DS-03 | Data-trust vocabulary as first-class tokens (freshness ×4, provenance, Known/Unknown/Conflict) | source assertion | **After the `gen-theme.mjs` extension (Pitfall 2 / A2):** grep `theme.css` for `--color-freshness-up-to-date` / `-stale` / `-offline` / `-reconnecting` + known/unknown/conflict state tokens. **Today: 0 hits — this is the gap.** Vocabulary strings documented in DESIGN.md + `.design/CLAUDE.md` | `gen-theme.mjs` (extended) + DESIGN.md |

### Sampling Rate
- **Per task commit:** `pnpm gen-theme && pnpm lint:design` (fast; <2s)
- **Per wave merge:** `pnpm check` (full gate) + `ladle build`
- **Phase gate:** `pnpm install` clean on Node 25 + `pnpm check` exit 0 + `ladle build` renders the Smoke story, before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] Node 25 installed on the machine (currently 24) — blocks `pnpm install` under `engine-strict`
- [ ] `vp` / Vite+ package name + `vp check` command confirmed (A1) — `checkpoint:human-verify`
- [ ] Self-hosted `.woff2` files sourced into `packages/design/src/assets/fonts/` (QUAL-04)
- [ ] DS-03 token shape decided (A2) — the one design call; `gen-theme.mjs` `components.*` emission if chosen
- [ ] No test framework needed this phase — Vitest/Playwright config arrives with the first component phase (Phase 2), not here.

*(No `tests/` files needed — Phase 1 has zero components and zero logic; validation is toolchain exit codes + source greps.)*

## Project Constraints (from AGENTS.md / CLAUDE.md)

- **English-only docs** — all artifacts English; Russian only as the data-trust *product copy* values (Актуально / Данные устаревают / Связь потеряна / Переподключение, Known/Unknown/Conflict).
- **Frontend boundary** — `web` owns UI only; must NOT touch DB/S3, no raw `fetch`, consumes `server-2` via typed client. (None of that is in Phase 1.)
- **Skills-first** — design pipeline runs through `solidstats-frontend-react-design` (creation) + `-design-review` (gate); conventions skill governs FSD/styling/toolchain.
- **No arbitrary Tailwind values** — every utility resolves to a `@theme` token (styling.md); a missing value means a missing token → add to `DESIGN.md`, regen.
- **`theme.css` is generated, never hand-edited** (D-06).
- **Root-once toolchain** (D-02) — `tsconfig.base.json` + per-package `extends`; `DESIGN.md` + `scripts/` at root.
- **Quality order** — UX continuity → a11y (WCAG 2.2 AA) → SEO → CWV (CLS = 0) → polish. (Phase 1: only the CLS=0/self-hosted-fonts/tabular-mono token groundwork applies.)

## Sources

### Primary (HIGH confidence — verified by live tool execution this session)
- `npm view @ladle/react@5.1.1 {version,peerDependencies,dependencies,engines}` — 5.1.1, bundles `vite@^6.0.5`, peer react `>=18`, engines node `>=20`.
- `npm view {tailwindcss,@tailwindcss/vite,vite,@google/design.md} version` + peers — 4.3.1 / 4.3.1 (peer vite `^5.2||^6||^7||^8`) / 8.0.16 / 0.3.0.
- `node scripts/gen-theme.mjs` — runs clean; emits 35 colors, 11 paired text scales, breakpoints+containers; **no `components.*`**.
- `npx @google/design.md@0.3.0 lint DESIGN.md` — **exit 0; 0 errors, 86 warnings, 2 info** (61 sub-token, 7 false-positive contrast, 18 unreferenced); offline.
- `node --version` → 24.16.0; `pnpm --version` → 11.6.0; `find src` → only `src/styles/theme.css`; `grep theme.css` for data-trust strings → 0.
- `gsd-tools query package-legitimacy check` — all five OK/SUS(false `too-new`), repo-backed, no postinstall.

### Secondary (MEDIUM confidence — official docs)
- ladle.dev/docs/config — config shape (`viteConfig`, `addons.theme{enabled,defaultState}`, `appendToHead`, `stories`, `defaultStory`).
- ladle.dev/docs/providers — `.ladle/components.tsx` `GlobalProvider`, global CSS import.
- tailwindcss.com — Tailwind v4 source detection / `@source` / `@source inline` / `source(none)`; `@tailwindcss/vite` install path.
- github.com/google-labs-code/design.md + release notes — `lint`/`diff`/`export` commands, `--format json`, exit codes, Apache-2.0.

### Tertiary (LOW confidence — web search, flagged)
- sdorra.dev (2023) Ladle+Tailwind dark mode — pattern is the *class*-toggle approach; **not directly applicable** to our single-palette dark-only system (noted in Pattern 2).
- Vite self-hosted font threads — relative-path `url()` resolves at dev+build; absolute `/fonts/...` 404s on dev server unless in `public/`.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every version verified against the live npm registry this session.
- Architecture / Ladle↔Vite↔Tailwind wiring: HIGH-MEDIUM — version facts verified; exact config shape from official docs (not run end-to-end, since packages aren't installed yet).
- `design.md lint` behavior: HIGH — run against the real `DESIGN.md`.
- DS-03 token gap (Pitfall 2): HIGH that the gap exists (grep-verified); the *resolution* (A2) is a design call needing user confirmation.
- `vp` toolchain: LOW — not installed, name unconfirmed (A1).

**Research date:** 2026-06-20
**Valid until:** 2026-07-20 (stable infra; re-check `@google/design.md` releases for the `--leading-*`/line-height fix that triggers the generator→CLI migration, and `@ladle/react` for a Vite 7/8 bump).
