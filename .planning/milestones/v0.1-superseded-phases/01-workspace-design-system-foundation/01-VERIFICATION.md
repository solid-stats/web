---
phase: 01-workspace-design-system-foundation
verified: 2026-06-20T00:00:00Z
status: passed
human_verification_resolved: 2026-06-20T11:57:46Z
score: 5/5
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "Open Ladle dev server (`pnpm --filter @solid-stats/design ladle`), navigate to the Smoke story, and visually confirm: (1) gunmetal dark palette renders — no white/light background bleed, (2) Exo 2 display font and IBM Plex Sans body font render with Cyrillic glyphs (check «Solid Stats — статистика» and «IBM Plex Sans — корпус»), (3) IBM Plex Mono tabular numerals align correctly («1 234 567 · 89.50% · 00:42:17»), (4) four freshness pills render with distinct colors — green/Актуально, yellow/Данные устаревают, red/Связь потеряна, blue/Переподключение, (5) cyan primary accent visible."
    expected: "All five visual checks pass — tokens are not unstyled, fonts load from self-hosted woff2 assets, Cyrillic renders, and the four-state freshness vocabulary is color-distinct and legible."
    why_human: "Visual render correctness (font loading, Cyrillic glyph rendering, color fidelity, data-trust token appearance) is not assertable by the headless `ladle build`; it requires the browser rendering pipeline. The headless build confirms CSS is emitted but cannot confirm fonts load or Cyrillic glyphs render. Documented as the sole Manual-Only item in 01-VALIDATION.md."
    resolved: "PASSED — verified via browser automation (Playwright MCP) against the live `ladle dev` stack during /gsd-verify-work (01-UAT.md). All 5 sub-checks confirmed by DOM introspection: fonts loaded (document.fonts.check true for Exo 2 / IBM Plex Sans / IBM Plex Mono, Cyrillic rendered), tabular-nums active, 4 distinct freshness colors, cyan accent #36C5E0. Sub-check 1 (gunmetal base, no white bleed) surfaced a latent defect — the bg-0 backdrop token was tree-shaken from the Ladle build — fixed in quick task 260620-q5q (commit d9b307a: gen-theme.mjs emits `@layer base { html { background-color: var(--color-bg-0) } }`); re-verified html computed background = rgb(10,13,19) painted by the token."

# Phase 1: Workspace & Design-System Foundation — Verification Report

**Phase Goal:** The buildable base every later phase imports — a pnpm workspace whose `packages/design` package exports a Tailwind v4 `@theme` generated from the root `DESIGN.md`, with Ladle rendering on the real stack and the toolchain green.
**Verified:** 2026-06-20
**Status:** passed — sole human-verification item (Smoke story visual render) resolved via browser automation during UAT; bg-0 backdrop defect fixed (quick task 260620-q5q, commit d9b307a)
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `pnpm-workspace.yaml` resolves `packages/design` (importable as `@solid-stats/design`) and a `packages/app` skeleton on pnpm 11 + Node 25; a fresh `pnpm install` succeeds | ✓ VERIFIED | `pnpm install --frozen-lockfile` exits 0 in 27ms on Node 25.9.0 + pnpm 11.6.0. `packages/design/package.json` `name: "@solid-stats/design"`. `packages/app/package.json` depends on `"@solid-stats/design": "workspace:*"`. Lockfile (5743 lines) committed. |
| 2 | `scripts/gen-theme.mjs` regenerates `packages/design` `theme.css` (the `@theme` block + `--*: initial` reset) from the root `DESIGN.md` alone — never hand-edited; dark-only gunmetal / one cyan accent / Exo 2+IBM Plex type / tabular-mono / Lucide as token recipes with no arbitrary values | ✓ VERIFIED | `OUT_PATH` in gen-theme.mjs is `join(ROOT, "packages", "design", "src", "styles", "theme.css")`. `DESIGN_PATH` is root `DESIGN.md`. `pnpm gen-theme` writes theme.css; `git diff --exit-code packages/design/src/styles/theme.css` exits 0 (drift-free, confirmed by `pnpm check`). Header comment: "do NOT hand-edit theme.css". Old `src/styles/theme.css` absent. `--font-display: 'Exo 2'` + `--font-body: 'IBM Plex Sans'` + `--font-mono: 'IBM Plex Mono'` present. `--color-*: initial` reset emitted. No unresolved `{colors.` references in theme.css. |
| 3 | The data-trust vocabulary (freshness Актуально / Данные устаревают / Связь потеряна / Переподключение, provenance, Known/Unknown/Conflict) exists as first-class tokens | ✓ VERIFIED | All 9 namespace roots confirmed in theme.css: `--color-freshness-up-to-date-*`, `--color-freshness-stale-*`, `--color-freshness-offline-*`, `--color-freshness-reconnecting-*`, `--color-known-fill`, `--color-unknown-fill`, `--color-conflict-fill`, `--color-provenance-fg`, `--color-provenance-link`. Russian display strings absent from token values (D-12 satisfied). Built CSS (`index-DysqC4Ll.css`) emits freshness token values at `--color-freshness-*` from the `@theme` layer. |
| 4 | Ladle wired to the real stack (dark-only, generated `@theme`) with the colocated `*.stories.tsx` convention, and a smoke story proves tokens render | ✓ VERIFIED | `pnpm --filter @solid-stats/design exec ladle build` exits 0 in 634ms. Smoke story JS bundle (`Smoke.stories-D_o-BoHu.js`) emitted. Built CSS resolves `bg-surface-1` → `var(--color-surface-1)` → `#151a25` (token, not arbitrary). All font woff2 assets fingerprinted in output. `.ladle/config.mjs`: `addons.theme: { enabled: false, defaultState: "dark" }` (dark-only). `stories: "src/**/*.stories.{ts,tsx}"` (colocated). Smoke story at `src/shared/uikit/Smoke/Smoke.stories.tsx` exercises freshness tokens via `var(--color-freshness-*)` in inline style. ⚠️ Visual render requires human verification (see below). |
| 5 | `design.md lint` passes on `DESIGN.md` and the lint/format/type-check toolchain runs green across the workspace | ✓ VERIFIED | `pnpm check` exits 0. Sequence: `gen-theme` → `git diff --exit-code` (drift-free) → `design.md lint DESIGN.md` (0 errors, 86 warnings — expected, documented in RESEARCH Pitfall 1) → `vp check packages scripts` (0 lint/format findings). Confirmed by live run this session. |

**Score:** 5/5 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | Private workspace root with exact pins, scripts | ✓ VERIFIED | `private: true`, `packageManager: pnpm@11.6.0`, `engines.node: >=25 <26`. Four original deps exact-pinned (`@google/design.md@0.3.0`, `@ladle/react@5.1.1`, `tailwindcss@4.3.1`, `@tailwindcss/vite@4.3.1`). `vite-plus: "^0.2.1"` (caret — fifth dep added plan 02; lockfile pins 0.2.1 — see note). Scripts: `gen-theme`, `lint:design`, `check` all present. |
| `pnpm-workspace.yaml` | Workspace globs | ✓ VERIFIED | `packages: ["packages/*"]`. allowBuilds section for supply-chain control. |
| `tsconfig.base.json` | Strict TS baseline | ✓ VERIFIED | `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`, `moduleResolution: bundler`, `verbatimModuleSyntax: true`, `strict: true`. |
| `packages/design/package.json` | @solid-stats/design with exports map | ✓ VERIFIED | `name: "@solid-stats/design"`. Exports map: `"./theme.css": "./src/styles/theme.css"` and `".": { "types": "./src/index.ts", "default": "./src/index.ts" }`. |
| `packages/app/package.json` | Skeleton depending on @solid-stats/design | ✓ VERIFIED | `dependencies: { "@solid-stats/design": "workspace:*" }`. No other deps. |
| `.nvmrc` | Node 25 pin | ✓ VERIFIED | Contains `25`. `.node-version` also contains `25`. |
| `scripts/gen-theme.mjs` | OUT_PATH relocated + data-trust emit | ✓ VERIFIED | `OUT_PATH` = `join(ROOT, "packages", "design", "src", "styles", "theme.css")`. `components` destructured from design. Data-trust section emits via `emitRecipe()` for all 4 freshness states + known/unknown/conflict + provenance. Dependency-free (no new imports). |
| `packages/design/src/styles/theme.css` | Generated @theme block | ✓ VERIFIED | 159 lines. Full token set emitted. Data-trust section lines 135–159. No `{colors.` unresolved refs. Generated header comment. |
| `packages/design/src/styles/fonts.css` | @font-face for self-hosted families | ✓ VERIFIED | Declares Exo 2 (600/700), IBM Plex Sans (400/500/600), IBM Plex Mono (400/500). All use `font-display: swap`. All use relative `url("../assets/fonts/*.woff2")` paths. |
| `packages/design/src/assets/fonts/` | woff2 assets for 3 families | ✓ VERIFIED | 7 files: Exo2-Bold.woff2, Exo2-SemiBold.woff2, IBMPlexMono-Medium.woff2, IBMPlexMono-Regular.woff2, IBMPlexSans-Medium.woff2, IBMPlexSans-Regular.woff2, IBMPlexSans-SemiBold.woff2. All fingerprinted in ladle build output. |
| `packages/design/vite.config.ts` | Vite config with @tailwindcss/vite | ✓ VERIFIED | `plugins: [tailwindcss()]` from `@tailwindcss/vite`. No direct `vite` or `@vitejs/plugin-react` dep added. |
| `packages/design/.ladle/config.mjs` | Dark-only Ladle config | ✓ VERIFIED | `addons.theme: { enabled: false, defaultState: "dark" }`. `stories: "src/**/*.stories.{ts,tsx}"`. `defaultStory: "smoke--tokens"`. |
| `packages/design/.ladle/components.tsx` | GlobalProvider importing theme once | ✓ VERIFIED | Imports `fonts.css` then `./tailwind.css` (which `@import`s theme.css once + adds `@source "../src"`). The import-once principle is preserved via the wrapper; see Key Links for explanation. |
| `packages/design/.ladle/tailwind.css` | Ladle-scoped Tailwind root | ✓ VERIFIED | `@import "../src/styles/theme.css"` + `@source "../src"`. Required to fix Ladle's Vite root pointing to bundled node_modules (documented in SUMMARY 01-04). |
| `packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx` | Smoke story exercising tokens | ✓ VERIFIED | Exercises `font-display`, `bg-surface-1`, `border-border-1`, `text-primary`, freshness tokens via `var(--color-freshness-*)` inline styles. All 4 RU-labeled freshness states present. Zero real components (D-07). |
| `packages/design/src/index.ts` | Empty UIKIT barrel | ✓ VERIFIED | `export {}`. Smoke story NOT exported. |
| `.planning/phases/01-workspace-design-system-foundation/TOOLCHAIN.md` | Resolved gate command | ✓ VERIFIED | Records `vp check` as the resolved D-03 gate. Notes plan-05 scoping guidance. T-1-03 satisfied. |
| `.design/README.md` | Freeze archive pointer | ✓ VERIFIED | Declares `.design/` frozen reference, canonical SoT is `/DESIGN.md`. Lists hifi/wireframes/etc as reference-only. `.design/CLAUDE.md` and `.design/MIGRATION.md` untouched and present. No `.jsx` files under `packages/`. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `packages/app/package.json` | `packages/design/package.json` | `dependencies: { "@solid-stats/design": "workspace:*" }` | ✓ WIRED | Confirmed in package.json; `pnpm install --frozen-lockfile` resolves it. |
| `packages/design/tsconfig.json` | `tsconfig.base.json` | `extends: "../../tsconfig.base.json"` | ✓ WIRED | Confirmed in tsconfig.json. |
| `packages/app/tsconfig.json` | `tsconfig.base.json` | `extends: "../../tsconfig.base.json"` | ✓ WIRED | Confirmed in tsconfig.json. |
| `scripts/gen-theme.mjs` | `DESIGN.md` | `readFileSync(DESIGN_PATH, "utf8")` — parses YAML front-matter | ✓ WIRED | `DESIGN_PATH = join(ROOT, "DESIGN.md")`. `components` section destructured and used for data-trust emit. |
| `scripts/gen-theme.mjs` | `packages/design/src/styles/theme.css` | `OUT_PATH = join(ROOT, "packages", "design", "src", "styles", "theme.css")` | ✓ WIRED | Confirmed in L27. `writeFileSync(OUT_PATH, css)`. |
| `packages/design/.ladle/components.tsx` | `packages/design/.ladle/tailwind.css` | `import "./tailwind.css"` | ✓ WIRED | Tailwind.css bridges to theme.css. Import-once satisfied via wrapper (explained in SUMMARY 01-04). |
| `packages/design/.ladle/tailwind.css` | `packages/design/src/styles/theme.css` | `@import "../src/styles/theme.css"` | ✓ WIRED | theme.css imported exactly once in the full chain. |
| `packages/design/vite.config.ts` | `@tailwindcss/vite` | `plugins: [tailwindcss()]` | ✓ WIRED | Confirmed. |
| `packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx` | `packages/design/src/styles/theme.css` | uses `bg-surface-1`, `font-display`, freshness token custom props | ✓ WIRED | Built CSS confirms `bg-surface-1 → var(--color-surface-1)`. Freshness tokens emitted in `@theme` layer of built CSS. |
| `package.json check script` | `TOOLCHAIN.md` | wires `vp check packages scripts` (the command recorded in TOOLCHAIN.md) | ✓ WIRED | `"check": "pnpm gen-theme && git diff --exit-code packages/design/src/styles/theme.css && pnpm lint:design && vp check packages scripts"` |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `packages/design/src/styles/theme.css` | All `@theme` custom properties | `scripts/gen-theme.mjs` reading `DESIGN.md` YAML front-matter | Yes — 35 colors, 3 fonts, 11 text sizes, 4 font-weights, 5 tracking, 6 radii, 5 shadows, 5 motion, 6 breakpoints, 2 containers, 23 data-trust tokens | ✓ FLOWING |
| `packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx` | freshness pill colors | `var(--color-freshness-*)` CSS custom properties from generated `@theme` | Yes — 4 states with fill/text/border from DESIGN.md badge-freshness.states | ✓ FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| `pnpm check` exits 0 (gen-theme → drift check → design.md lint → vp check) | `pnpm check` | Exit 0. gen-theme writes theme.css, git diff clean, design.md lint: 0 errors / 86 warnings, vp check: 0 lint/format findings | ✓ PASS |
| `pnpm install --frozen-lockfile` exits 0 on Node 25 + pnpm 11 | `pnpm install --frozen-lockfile` | Exit 0, 27ms, "Already up to date" | ✓ PASS |
| Ladle headless build exits 0 and emits Smoke story | `pnpm --filter @solid-stats/design exec ladle build` | Exit 0 in 634ms. Produces `Smoke.stories-D_o-BoHu.js`. All 7 woff2 assets fingerprinted. | ✓ PASS |
| Built CSS resolves `surface-1` utility to `--color-surface-1` token (not arbitrary) | grep in built CSS | `bg-surface-1{background-color:var(--color-surface-1)}`, `--color-surface-1:#151a25` in `@theme` layer | ✓ PASS |
| Data-trust tokens appear in built CSS `@theme` layer | grep in built CSS | `--color-freshness-up-to-date-fill`, `--color-freshness-stale-fill`, `--color-freshness-offline-fill`, `--color-freshness-reconnecting-fill` all present | ✓ PASS |
| `gen-theme.mjs` is dependency-free and reads `DESIGN.md` | node scripts/gen-theme.mjs | Exits 0, writes 159-line theme.css, emits token counts | ✓ PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| WS-01 | Plan 01 | pnpm workspace (pnpm 11 + Node 25), `packages/design` + `packages/app` skeleton, resolved by `pnpm-workspace.yaml` | ✓ SATISFIED | `pnpm-workspace.yaml` has `packages/*`. `pnpm install --frozen-lockfile` exits 0. Node 25.9.0 confirmed. |
| WS-02 | Plan 01, 04 | `packages/design` importable as `@solid-stats/design`, exports `@theme` and UIKIT | ✓ SATISFIED | `name: "@solid-stats/design"`, exports map has `"./theme.css"` and `"."`. UIKIT barrel `src/index.ts` exists. |
| WS-03 | Plan 03 | Root `DESIGN.md` → `packages/design` `theme.css` via `scripts/gen-theme.mjs`, single-source | ✓ SATISFIED | `OUT_PATH` relocated to `packages/design`. Drift-free (git diff --exit-code clean). Old `src/styles/theme.css` absent. |
| WS-04 | Plan 04 | Ladle wired to real stack, dark-only, generated `@theme`, colocated `*.stories.tsx` | ✓ SATISFIED | `ladle build` exits 0. Dark-only config. Smoke story at `src/shared/uikit/Smoke/Smoke.stories.tsx`. Built CSS resolves tokens. |
| WS-05 | Plan 02, 05 | Lint/format/type-check toolchain green across workspace; `design.md lint` gates `DESIGN.md` | ✓ SATISFIED | `pnpm check` exits 0. `vp check packages scripts` finds 0 issues. `design.md lint DESIGN.md` exits 0 (0 errors). |
| DS-01 | Plan 03 | Tailwind v4 `@theme` generated from `DESIGN.md` tokens; no arbitrary token values | ✓ SATISFIED | All tokens from DESIGN.md YAML. No arbitrary values — `--color-*: initial` reset prevents stock Tailwind colors. Paired `--text-*--line-height` present. |
| DS-02 | Plan 03 | Dark-only gunmetal palette, one cyan accent, Exo 2/IBM Plex type, tabular mono, Lucide as token recipes | ✓ SATISFIED | `--color-bg-0: #0A0D13` (gunmetal base). `--color-primary: #36C5E0` (one cyan accent). `--font-display: 'Exo 2'`. `--font-body: 'IBM Plex Sans'`. `--font-mono: 'IBM Plex Mono'`. Lucide is an icon token recipe in DESIGN.md. (Exo 2 replaces Saira — approved change per font_decision_note.) |
| DS-03 | Plan 03 | Data-trust vocabulary as first-class token set: freshness ×4, provenance, Known/Unknown/Conflict | ✓ SATISFIED | 23 data-trust tokens emitted. All 9 namespace roots verified in theme.css. No Russian copy as token values. Smoke story exercises freshness tokens. |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `package.json` | 21 | `"vite-plus": "^0.2.1"` — caret pin, not exact | ℹ️ Info | vite-plus is the 5th dep added in plan 02 after the original four exact-pinned deps. Lockfile pins 0.2.1 exactly. The caret was chosen because vite-plus was freshly published (2026-06-18) and the version was unconfirmed at plan-time. No material risk with lockfile committed. Not a BLOCKER. |

No TBD, FIXME, XXX, TODO, HACK, or PLACEHOLDER markers found in any modified files.
No return null / empty stubs / Russian strings as token values.
No `.jsx` ported from `.design/hifi/` into `packages/`.
No `--container: 1240` leaked into `packages/`.

---

### Human Verification Required

#### 1. Smoke Story Visual Render in Ladle Browser

**Test:** Run `pnpm --filter @solid-stats/design ladle` (or `cd packages/design && pnpm ladle`), open the URL in a browser, navigate to the Smoke story. Visually confirm:

1. Background is dark gunmetal (#0A0D13 / #151A25) — no white bleed.
2. Heading "Solid Stats — статистика" renders in Exo 2 display font. Cyrillic glyphs are correct (not fallback system-ui boxes or substitutions).
3. Body text "IBM Plex Sans — корпус. Кириллица рендерится..." renders in IBM Plex Sans. Cyrillic legible.
4. Tabular numerals "1 234 567 · 89.50% · 00:42:17" render in IBM Plex Mono with aligned columns (tabular-nums).
5. Four freshness pills render with distinct colors: green (Актуально), yellow (Данные устаревают), red (Связь потеряна), blue (Переподключение).
6. Cyan accent text "Cyan accent — единственный акцент системы" is visibly distinct (#36C5E0).

**Expected:** All six checks pass. No unstyled content, no font fallback boxes, four-state freshness vocabulary is color-distinct and legible. The dark-only toggle is absent (no light/dark switch in Ladle UI).

**Why human:** Headless `ladle build` proves CSS is emitted and woff2 assets are bundled (confirmed above), but cannot verify the browser actually loads and renders the fonts from fingerprinted asset paths, that Cyrillic glyphs are present in the specific font subsets, or that the CSS custom property values produce the intended visual appearance. Documented as the sole Manual-Only verification item in `01-VALIDATION.md`.

---

### Notes

**Implementation deviation — `tailwind.css` wrapper in `.ladle/`:** Plan 04 expected `components.tsx` to directly `import "../src/styles/theme.css"`. The actual implementation adds an intermediate `.ladle/tailwind.css` that `@import`s theme.css and adds `@source "../src"`. This deviation was REQUIRED: Ladle sets Vite's `root` to its bundled `node_modules` app dir, so `@tailwindcss/vite`'s automatic content detection never scanned `packages/design/src`. Without `@source`, every custom-token utility was tree-shaken from the build. The import-once principle IS preserved (theme.css imported once, via tailwind.css). Documented fully in SUMMARY 01-04 as "Rule 3 - Blocking" decision. This is correct and not a gap.

**vite-plus caret pin:** `vite-plus: "^0.2.1"` uses a caret instead of exact pin. The lockfile commits `0.2.1` exactly. The four originally-required exact pins (plan 01 must_haves) are all exact: `@google/design.md@0.3.0`, `@ladle/react@5.1.1`, `tailwindcss@4.3.1`, `@tailwindcss/vite@4.3.1`. vite-plus was a plan 02 addition and was freshly published at the time; the lockfile provides the supply-chain guarantee.

**Exo 2 replaces Saira:** Per `font_decision_note`, Saira was changed to Exo 2 (user-approved; Saira lacks Cyrillic, the UI is RU-primary). DESIGN.md, theme.css (`--font-display: 'Exo 2'`), REQUIREMENTS.md DS-02, and ROADMAP success criterion were all updated. fonts.css declares Exo 2 woff2 assets. This is NOT a deviation from goal.

---

_Verified: 2026-06-20_
_Verifier: Claude (gsd-verifier)_
