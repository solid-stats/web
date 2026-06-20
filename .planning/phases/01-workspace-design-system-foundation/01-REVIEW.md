---
phase: 01-workspace-design-system-foundation
reviewed: 2026-06-20T00:00:00Z
depth: deep
files_reviewed: 23
files_reviewed_list:
  - .design/README.md
  - .gitignore
  - .node-version
  - .nvmrc
  - .oxlintrc.json
  - .prettierignore
  - DESIGN.md
  - package.json
  - packages/app/package.json
  - packages/app/src/index.ts
  - packages/app/tsconfig.json
  - packages/design/.ladle/components.tsx
  - packages/design/.ladle/config.mjs
  - packages/design/.ladle/tailwind.css
  - packages/design/package.json
  - packages/design/src/index.ts
  - packages/design/src/shared/uikit/Smoke/Smoke.stories.tsx
  - packages/design/src/shared/uikit/Smoke/index.ts
  - packages/design/src/styles/fonts.css
  - packages/design/tsconfig.json
  - packages/design/vite.config.ts
  - pnpm-workspace.yaml
  - scripts/gen-theme.mjs
  - tsconfig.base.json
findings:
  critical: 0
  warning: 4
  info: 5
  total: 9
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-06-20
**Depth:** deep
**Files Reviewed:** 23
**Status:** issues_found

## Summary

Reviewed the pnpm-workspace + design-system foundation: the `DESIGN.md → theme.css`
generator (`scripts/gen-theme.mjs`, the one substantive code change), the
`@solid-stats/design` package + exports map, the Ladle/Vite/Tailwind v4 seam, strict
tsconfig inheritance, and the workspace config.

Verification performed (not just static read):
- Ran `node scripts/gen-theme.mjs` → exits 0, and `git diff packages/design/src/styles/theme.css` shows **zero drift** — the committed `theme.css` is reproducible from `DESIGN.md`. The determinism contract holds for the current source.
- Confirmed every `{colors.*}`/`{rounded.*}` reference resolves to a literal in the output (grepped for `undefined`/`{colors.`/`NaN` leaks — none).
- Confirmed numeric-prefixed keys (`2xs`, `3xl`, …) preserve insertion order in the emitted CSS (they are not pure-integer keys, so V8 keeps source order — no silent reorder).
- Confirmed all 7 `@font-face` `url()` assets in `fonts.css` exist and are committed under `packages/design/src/assets/fonts/` — no broken paths.
- Confirmed `#`-bearing hex values survive `stripComment` (they are quoted; the quote-state tracking protects them).

No blockers. The defects are robustness gaps in the generator (it trusts `DESIGN.md` structure completely and fails loudly only by accident) and a drift-gate edge case. The generator is correct *today* but is one DESIGN.md restructure away from silently emitting a broken token — that is the class worth hardening before more tokens land.

The Ladle↔Vite↔Tailwind seam is sound: type-only `UserConfig` import (no second `vite` dep), `@source "../src"` in the same CSS root that imports Tailwind, `fonts.css`-before-`theme.css` ordering, dark-only provider. Per the focus brief, the absence of Saira, the generated `theme.css` content, the frozen `.design/` reference, and missing app/routes/tests are out of scope and not flagged.

## Warnings

### WR-01: `resolveRefs` / `resolve` silently emit the literal string `"undefined"` on a missing or mistyped token reference

**File:** `scripts/gen-theme.mjs:182-185` (and the focus-ring `resolve` at `272-276`)
**Issue:** Both resolvers do `String(v).replace(/\{colors\.([a-z0-9-]+)\}/g, (_, n) => colors[n])`. If a recipe in `DESIGN.md` references a token that doesn't exist (a typo like `{colors.primry}`, or a renamed/removed token), `colors[n]` is `undefined`, and the replacement callback coerces it to the string `"undefined"`, which is written straight into `theme.css` as e.g. `--color-unknown-fill: undefined;`. The generator is described as "a pure DESIGN.md→theme.css copy with zero drift" and the determinism guarantee is load-bearing for the whole design system — but a broken ref produces a *successful* run with invalid CSS, not an error. The `pnpm check` drift-gate would catch the *change* on a token edit, but a fresh broken ref committed together with the generated output passes every gate. (`npx @google/design.md lint` catches broken refs in `DESIGN.md`, but the generator must not depend on a separate tool to stay honest — it owns the resolution.)
**Fix:** Make the resolver fail loudly on an unresolved token:
```js
const resolveRefs = (v) =>
  String(v)
    .replace(/\{colors\.([a-z0-9-]+)\}/g, (_, n) => {
      if (!(n in colors)) throw new Error(`Unknown {colors.${n}} reference`);
      return colors[n];
    })
    .replace(/\{rounded\.([a-z0-9-]+)\}/g, (_, n) => {
      if (!(n in rounded)) throw new Error(`Unknown {rounded.${n}} reference`);
      return rounded[n];
    });
```
Apply the same guard to the focus-ring `resolve` at line 272.

### WR-02: The generator assumes the full `components.*` data-trust shape and throws an unhelpful native error if `DESIGN.md` is restructured

**File:** `scripts/gen-theme.mjs:346,351-357` (also the top-level destructure at `177`)
**Issue:** `Object.entries(components["badge-freshness"].states)` and `components["provenance-line"].textColor` reach several levels deep with no existence check. The data-trust block (D-12) is the newest, most-likely-to-change section. If a future edit renames `badge-freshness` → `freshness` or drops `provenance-line`, the generator dies with a bare `TypeError: Cannot read properties of undefined (reading 'states')` and no indication that `DESIGN.md` is the cause — the same failure mode applies to the top-level `const { colors, typography, rounded, … } = design` (a missing section yields `undefined` and the error surfaces far downstream). For a generator whose entire job is to be a trustworthy, debuggable single-source pipeline, a cryptic stack trace from `node:internal` is a poor failure surface.
**Fix:** Add a one-line structural assertion before `buildTheme` (or at the top of it) that names the missing section, e.g.:
```js
for (const key of ["colors", "typography", "rounded", "elevation", "motion", "layout", "components"]) {
  if (!design[key]) throw new Error(`DESIGN.md front-matter missing required section: ${key}`);
}
for (const recipe of ["badge-freshness", "badge-known", "badge-unknown", "badge-conflict", "provenance-line"]) {
  if (!components[recipe]) throw new Error(`DESIGN.md components.${recipe} missing (data-trust tokens)`);
}
```

### WR-03: The `check` drift-gate passes silently when `theme.css` is untracked, not just unchanged

**File:** `package.json:13`
**Issue:** `pnpm gen-theme && git diff --exit-code packages/design/src/styles/theme.css` is the drift gate. `git diff` only compares the working tree against the **index** for *tracked* files. If `theme.css` is ever untracked (a fresh clone where it wasn't committed, a `git rm --cached`, a `.gitignore` slip), `git diff --exit-code` reports no diff and exits 0 — the gate passes while the file is effectively unverified. The file is currently tracked, so this is latent, but the gate's contract is "fail on any drift" and it has a blind spot.
**Fix:** Either assert the file is tracked first, or compare against `HEAD` so an untracked/staged-only file still trips the gate:
```jsonc
"check": "pnpm gen-theme && git diff --exit-code HEAD -- packages/design/src/styles/theme.css && pnpm lint:design && vp check packages scripts"
```
(`git diff HEAD --` includes staged + unstaged changes and treats a never-committed path as a diff against the empty tree.)

### WR-04: `extractFrontMatter` / `parseYaml` index-access on a malformed `DESIGN.md` throws before the dedicated error

**File:** `scripts/gen-theme.mjs:43-44,112-115`
**Issue:** `extractFrontMatter` does `lines[0].trim()` — on an empty file `lines[0]` is `""` so this happens to work, but the intent ("starts with a `---` fence") is checked *after* an unguarded access pattern elsewhere. More concretely, `parseYaml` reads `stack[stack.length - 1].container` after a `while` pop loop; a front-matter line indented *less* than the root (not possible from a well-formed doc, but possible from a hand-edit with a tab or negative-looking indent) can leave the stack in a shape the code doesn't defend. This is a low-likelihood path (the input is a controlled repo file), but the parser is hand-rolled and self-described as "purpose-built" — its robustness is the only thing standing between a bad hand-edit and a corrupt `theme.css`.
**Fix:** This is bounded by WR-01/WR-02 hardening in practice; minimally, guard the fence check first:
```js
if ((lines[0] ?? "").trim() !== "---") throw new Error("DESIGN.md does not start with a `---` front-matter fence");
```
Lower priority than WR-01/WR-02 — group it with the same hardening pass.

## Info

### IN-01: `react` / `react-dom` declared as runtime `dependencies` of a design package that exports raw TS

**File:** `packages/design/package.json:17-20`
**Issue:** The `.` export resolves to `./src/index.ts` (raw, unbuilt) and the barrel is currently `export {}` — there is no shipped React runtime surface yet. `react`/`react-dom` are listed under `dependencies` (not `peerDependencies`). When real components graduate, a design/UIKIT package almost always wants React as a **peer** dependency so the consuming app dedupes a single React instance (a duplicate React is a classic hooks-break). Harmless in Phase 1 (only Ladle consumes it, and the app pins the same `19.2.0`), but worth resolving before components ship.
**Fix:** Plan to move `react`/`react-dom` to `peerDependencies` (+ keep them as `devDependencies` for Ladle) when the barrel stops being empty. No action required this phase.

### IN-02: Exact-pinned deps are inconsistent — `vite-plus` uses a caret while every other dep is exact

**File:** `package.json:15-21`
**Issue:** The focus brief calls for exact-pinned dev-deps, and `@google/design.md`, `@ladle/react`, `@tailwindcss/vite`, `tailwindcss` are all exact. `vite-plus: "^0.2.1"` is the lone caret. For a `0.x` package a caret allows `0.2.x` minor drift, which on a pre-1.0 toolchain (the `vp check` gate runner) can change lint/format behavior between installs. With `--frozen-lockfile` in CI the lockfile pins the resolved version regardless, so this is a consistency nit, not a reproducibility hole.
**Fix:** Pin exact: `"vite-plus": "0.2.1"`.

### IN-03: `data-trust` namespacing relies on resolver ordering that is correct but undocumented

**File:** `scripts/gen-theme.mjs:338-358`
**Issue:** `emitRecipe` resolves `recipe.border` (e.g. `"1px solid {colors.win-border}"`) through `resolveRefs`, producing `--color-...-border: 1px solid rgba(...);`. The Smoke story consumes this compound value via `border: state.border` inline style (correct). This is intentional and the story comment explains it, but the generator side has no note that these `--color-*-border` custom properties carry a full `1px solid …` shorthand, not a bare color — a future reader emitting them into a `border-color` utility would get an invalid value. Cross-file the contract holds today (`Smoke.stories.tsx:80` uses `border:` shorthand), but the naming (`--color-*-border`) invites the wrong consumption.
**Fix:** Optional — a one-line comment at `emitRecipe` noting "`-border` carries the full `1px solid …` shorthand (consume via `border:`, not `border-color:`)", mirroring the story-side note.

### IN-04: `.oxlintrc.json` ignores `theme.css` but `.css` is not an Oxlint target anyway

**File:** `.oxlintrc.json:12`
**Issue:** `"packages/design/src/styles/theme.css"` is listed in `ignorePatterns`. Oxlint lints JS/TS, not CSS, so this entry is inert. It's defensive and harmless (and mirrors the `.prettierignore` entry which *is* load-bearing since Oxfmt formats CSS), but it reads as if Oxlint would otherwise process the file.
**Fix:** Optional — drop the line or add a comment that it's a parallel-to-prettierignore mirror; no functional effect.

### IN-05: `block()` helper returns `""` for empty sections, filtered later — fine, but the empty-string sentinel is implicit

**File:** `scripts/gen-theme.mjs:171-174,365`
**Issue:** `block()` returns `""` when `lines.length === 0`, and `sections.filter(Boolean)` drops them. Every section currently has content, so no empty block is produced. This is correct and idiomatic; noting only that the contract (empty section → empty string → filtered) is implicit. No change needed.

---

_Reviewed: 2026-06-20_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
