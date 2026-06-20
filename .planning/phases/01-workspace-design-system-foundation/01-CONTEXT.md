# Phase 1: Workspace & Design-System Foundation - Context

**Gathered:** 2026-06-20 (assumptions mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the buildable base every later phase imports: a pnpm workspace whose `packages/design`
package (`@solid-stats/design`) exports a Tailwind v4 `@theme` generated from the root `DESIGN.md`,
with Ladle rendering on the real stack (dark-only) and the toolchain green. Requirements WS-01..05,
DS-01..03.

**In scope:** the workspace, the `DESIGN.md` → `@theme` token pipeline, Ladle wired to the real
stack, the toolchain gate, and the `.design/` freeze boundary.

**Out of scope (later phases / milestone):** any UIKIT component or primitive — even the smallest —
is a Phase 2+ concern (MIGRATION.md D4: foundation = *system + pipeline only*). All routes, data
wiring, loaders, and SSR are the v1.0 app milestone. Phase 1 ships exactly one smoke story proving
tokens render, and a `packages/app` skeleton that does nothing but resolve.
</domain>

<decisions>
## Implementation Decisions

### Workspace & Toolchain
- **D-01:** Repo is a pnpm workspace. A root private `package.json` + `pnpm-workspace.yaml` resolve
  `packages/design` and `packages/app`. pnpm 11 + Node 25 are pinned via `packageManager: pnpm@11.x`,
  `engines`, and `.nvmrc` / `.node-version` = `25` (per `solidstats-shared-ts-standards` §D). A fresh
  `pnpm install` must succeed (WS-01).
- **D-02:** Toolchain config lives **once at the workspace root**; packages stay thin. Root
  `tsconfig.base.json` with per-package `tsconfig.json` that `extends` it (so strictness flags —
  `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` — never drift). The root owns `DESIGN.md`
  and `scripts/`, so `gen-theme.mjs` and `design.md lint` run as **root** scripts, not package
  scripts. `packages/*` carry only their own `package.json` (name, `exports`, scripts, deps).
- **D-03:** Lint / format / type-check = **Vite+ `vp check`** (Oxlint + Oxfmt + tsgo), per
  `solidstats-frontend-react-conventions` — WS-05 points explicitly at that skill. The generic
  ESLint 10 + Prettier 3 + `tsc --noEmit` baseline in `solidstats-shared-ts-standards` is overridden
  for the web frontend by its own §C note ("uses Oxlint via Vite+ `vp check`"). "Green across the
  workspace" (WS-05) means a root `vp check` run passes. *(User-confirmed over the ESLint/Prettier/tsc
  alternative.)*
- **D-04:** `packages/app` is a **skeleton only** — no routes, no loaders, no SSR wiring, no
  TanStack Start plumbing. It contains just enough (`package.json` + workspace dep) to resolve the
  workspace and consume `@solid-stats/design`. All app build is the v1.0 milestone (MIGRATION.md
  "Direction change"; ROADMAP Phase 1 criterion #1; design `SKILL.md` pipeline stage 5 = graduate,
  which is v1.0).

### Design Package & Ladle Catalog
- **D-05:** `packages/design` is published internally as `@solid-stats/design` (WS-02); its package
  `exports` map exposes both `"./theme.css"` and the UIKIT entry.
- **D-06:** The existing `src/styles/theme.css` relocates to `packages/design/src/styles/theme.css`
  (WS-03). `theme.css` is generated, never hand-edited.
- **D-07:** Colocated Ladle stories live at **`packages/design/src/shared/uikit/<Component>/`** — the
  FSD `shared/uikit` slice path is preserved inside the package (`pipeline.md` §3 and MIGRATION.md D5
  both specify `src/shared/uikit/<Component>/`; the `shared/` segment is kept, not flattened to
  `src/uikit/`). Phase 1 ships **only a smoke story, zero components** (MIGRATION.md D4). *(Residual:
  the planner confirms the `shared/` nesting against `architecture.md` slice rules — see Claude's
  Discretion.)*
- **D-08:** Ladle is configured **inside `packages/design`**: its own `.ladle/config.mjs` + a Vite
  config applying `@tailwindcss/vite` against the relocated `theme.css`, dark-only, with a global
  stylesheet doing `@import "./theme.css"`. It renders the `@theme` with **no TanStack Start app and
  no SSR**. Saira / IBM Plex Sans+Mono fonts are self-hosted assets in `packages/design` so the smoke
  story shows real type (QUAL-04 self-hosted-fonts intent).

### Token Pipeline (DESIGN.md → @theme)
- **D-09:** `gen-theme.mjs` stays the interim generator. The **only** change is `OUT_PATH` (currently
  `join(ROOT, "src", "styles", "theme.css")`, gen-theme.mjs L26) → `join(ROOT, "packages", "design",
  "src", "styles", "theme.css")`. `DESIGN_PATH` is unchanged — root stays root. The tracked migration
  obligation to `design.md export --format css-tailwind` (once its line-height drop is fixed) carries
  forward unchanged.
- **D-10:** The Phase 1 `@theme` encodes, with **no arbitrary token values** anywhere (DS-01):
  colors (dark-only gunmetal palette, single cyan interactive accent), typography incl. line-height
  (Saira + IBM Plex), spacing, radii, **breakpoints** (`md` / `lg` / `xl` / `2xl` + `3xl: 120rem` +
  `4xl: 160rem`), **containers** (`--container` 1760 ceiling, `--container-prose` 720), and the
  **data-trust vocabulary as first-class tokens** (freshness "Актуально" / "Данные устаревают" /
  "Связь потеряна" / "Переподключение", the provenance line, Known / Unknown / Conflict) — DS-02,
  DS-03, ROADMAP criterion #3. `gen-theme.mjs` already emits breakpoints + containers (L291-315).
  `design.md lint` (contrast + token references) gates `DESIGN.md` (WS-05).
- **D-12 (research-resolved 2026-06-20, user-confirmed — amends D-09, refines D-10):** DS-03 /
  ROADMAP criterion #3 ("data-trust vocabulary as first-class tokens") is NOT achievable by D-09's
  "only `OUT_PATH` changes". `gen-theme.mjs` destructures only `colors, typography, rounded,
  elevation, motion, layout` (L173) and never reads the `components.*` section — where `DESIGN.md`
  already authors the data-trust recipes: `badge-freshness` (4-state), `provenance-line`,
  `badge-known` / `badge-unknown` / `badge-conflict` (`DESIGN.md` L243 / L405-426). Confirmed by
  grep: the current `theme.css` carries none of it. **Resolution (Option 1):** extend
  `gen-theme.mjs` to emit the `components.*` data-trust recipes as first-class `@theme`
  **state/color tokens**, resolving `{colors.*}` / `{rounded.*}` references the same way the
  elevation section already does (L262-264). The Russian **display strings** («Актуально» / «Данные
  устаревают» / «Связь потеряна» / «Переподключение», and the Known/Unknown/Conflict labels) are
  i18n copy — **deferred to the Phase 3 i18n harness**; they stay as `DESIGN.md` annotations and do
  NOT become CSS token values (the app is RU+EN — translatable copy must not live in the token
  layer). Net: the Phase 1 `gen-theme.mjs` change is `OUT_PATH` **plus** a bounded `components.*`
  → `@theme` data-trust emit. `theme.css` stays generated, never hand-edited.

### `.design/` Freeze Boundary
- **D-11:** Phase 1 freezes `.design/` into a reference archive **except `.design/CLAUDE.md` and
  `.design/MIGRATION.md`**, which stay **live and authoritative**. `.design/CLAUDE.md` is the running
  per-surface companion-notes home and the domain-truth source (Score / K/D formulas, `SS_BASELINE`
  population tiers, the data-trust A/C-not-B model) that every downstream phase inherits (design
  `SKILL.md`; `pipeline.md` §5; MIGRATION.md step 5). The hi-fi `*.jsx`, wireframes, screenshots, and
  `_ds/` seed are visual reference only — never ported (MIGRATION.md D1, D2).

### Claude's Discretion
- The exact `shared/` nesting of the story path (D-07) is Likely, not Confident — two analyzer
  passes disagreed (flatten vs preserve). Adopted the design-skill literal (`src/shared/uikit/`); the
  planner reconciles against `architecture.md` slice rules and may collapse to `src/uikit/` if the
  package-is-the-shared-layer reading wins.
- How `gen-theme.mjs` slots into the `vp check` / CI gate ordering (run-then-check vs check-only) is
  left to the planner.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `DESIGN.md` — token source of truth; the YAML-frontmatter shape `gen-theme.mjs` parses. Locked
  direction.
- `scripts/gen-theme.mjs` — interim generator. **`OUT_PATH` (L26) is the one path that breaks after
  the restructure**; breakpoints + containers emitted at L291-315.
- `src/styles/theme.css` — current generated output to relocate into `packages/design` (WS-03).
- `.design/MIGRATION.md` — Phase 1 task list ("Foundation task, risk-first order") and the locked
  D1–D5 decision pack; D5 vs the post-restructure sections is the stale-vs-current reconcile.
- `.design/CLAUDE.md` — binding design + domain rules and the data-trust vocabulary the DS encodes
  (DS-03). Stays live (D-11).
- `.planning/REQUIREMENTS.md` — WS-01..05 / DS-01..03 exact wording + the phase traceability table.
- `.planning/PROJECT.md` — locked workspace structure, key decisions, constraints.
- `.claude/skills/solidstats-shared-ts-standards/SKILL.md` — tsconfig / Node 25 / pnpm 11 baseline
  (§A–E).
- `.claude/skills/solidstats-frontend-react-conventions/SKILL.md` — workspace / FSD / Tailwind / the
  Vite+ `vp check` toolchain.
- `.claude/skills/solidstats-frontend-react-conventions/references/patterns/styling.md` — `@theme` /
  Tailwind-v4 consumption, no-arbitrary-values, `theme.css` import-once.
- `.claude/skills/solidstats-frontend-react-conventions/references/patterns/architecture.md` — FSD
  layers, `shared/uikit` slice rules, colocation (story-path reconcile for D-07).
- `.claude/skills/solidstats-frontend-react-design/SKILL.md` — the design pipeline entry point: the
  two-layer model (DESIGN.md tokens → `@theme`) and the brief→spec→Ladle→review→graduate stages.
- `.claude/skills/solidstats-frontend-react-design/references/design-system.md` — the source the
  breakpoint / container / spacing token values flow from; the `design.md lint` / `diff` gate
  rationale and the generator-vs-CLI decision.
- `.claude/skills/solidstats-frontend-react-design/references/pipeline.md` — Ladle-as-durable-catalog,
  the `src/shared/uikit/<Component>/` story path, and the `.design/CLAUDE.md` rule-capture home.
- `.claude/skills/solidstats-frontend-react-design/references/spec-template.md` — the per-surface spec
  format (×5 endings / ×4 data volumes / breakpoints / roles / data / component states). Not built in
  Phase 1, but the artifact format Phase 1's pipeline establishes for Phases 2–9.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `DESIGN.md` (695 lines, root) — complete dark-only token system in YAML frontmatter; the SoT.
- `scripts/gen-theme.mjs` (~12 KB) — dependency-free, root-anchored (`ROOT = join(__dirname, "..")`,
  L23-26) generator that already emits the `@theme` block + `--*: initial` reset, including
  breakpoints and containers. Reused as-is bar one constant.
- `src/styles/theme.css` — the current generated output; relocated, not regenerated by hand.
- `.design/CLAUDE.md` — 14 KB of binding design + domain knowledge; the live companion-notes home.

### Established Patterns
- FSD `shared/uikit` colocation: a slice owns its component + its `*.stories.tsx` so the story cannot
  drift from the component (conventions `architecture.md`; design `pipeline.md` §3).
- Tailwind v4 `@theme` consumed via `@tailwindcss/vite`, `theme.css` imported once, no arbitrary
  values (conventions `styling.md`).
- Single-source generation: `DESIGN.md` → `theme.css` via `gen-theme.mjs`; `theme.css` never
  hand-edited.

### Integration Points
- `gen-theme.mjs` `OUT_PATH` → the new `packages/design/src/styles/theme.css` (the single breaking
  path).
- Ladle's Vite config consumes the relocated `theme.css` through `@tailwindcss/vite` — the wiring
  that makes tokens render without an app.
- `packages/design` `exports` map is the seam the (skeleton) `packages/app` and all later phases
  import `@solid-stats/design` through.
</code_context>

<specifics>
## Specific Ideas

Two open items deferred to the planning researcher (`gsd-phase-researcher`), not blocking and not
user decisions:

1. **`@google/design.md` lint as a workspace dev-dep + offline CI.** Pin `@google/design.md@0.3.0`
   as a **root** devDependency (vs `npx`-on-demand) and verify `design.md lint` runs offline-clean
   before wiring it into the WS-05 gate. `DESIGN.md`'s own build-step block uses
   `npx @google/design.md lint` (L487-489).
2. **Ladle + Tailwind v4 (`@tailwindcss/vite`) integration specifics.** No Ladle/Vite precedent in
   the repo; verify the exact `.ladle/config.mjs` + Vite-plugin wiring (and self-hosted font loading)
   that resolves `@theme` utilities in Ladle dev/build against current Ladle + Tailwind v4 docs.
</specifics>

<deferred>
## Deferred Ideas

None — analysis stayed within phase scope (system + pipeline; zero components per MIGRATION.md D4).

### Reviewed Todos (not folded)
None — `todo.match-phase 1` returned zero matches.
</deferred>
